import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

//services
import { toast } from "react-toastify";

//redux actions
import {
  orderDetailsAction,
  orderPayAction,
  payResetAction,
} from "../redux/slices/orderSlice";

//utils
import addDecimals from "../utils/addDecimals";

//components
import Layout from "../components/Layout";
import Spinner from "../components/Spinner";
import Error from "../components/Error";

const Order = () => {
  const dispatch = useDispatch();
  const { orders } = useSelector((store) => store);
  const { loading, orderDetails, isOrderPaid, loadingPay, error } = orders;

  const { id } = useParams();
  const navigate = useNavigate();

  const [firstScriptRender, setFirstScriptRender] = useState(true);

  /*** render the orderDetails ***/
  useEffect(() => {
    dispatch(orderDetailsAction(id));
  }, []);

  /*** load Paypal script ***/
  useEffect(() => {
    let script;
    if (
      firstScriptRender &&
      Object.keys(orderDetails).length !== 0 &&
      !orderDetails.isPaid
    ) {
      setFirstScriptRender(false);
      script = document.createElement("script");
      script.type = "text/javascript";
      script.src =
        "https://www.paypal.com/sdk/js?client-id=AZn30bMIoncsb_GaCW7gkrshC2BVk0SRBAQ2jpRcBdeE9tzjlyDPsCRCdkbz51sg2SsUChWlqOsMudE4&currency=EUR";
      script.async = true;
      document.body.appendChild(script);

      //to indicate that the script is working;
      script.onload = () => {
        window.paypal
          .Buttons({
            // Sets up the transaction when a payment button is clicked
            createOrder: (data, actions) => {
              return actions.order.create({
                purchase_units: [
                  {
                    amount: {
                      value: orderDetails?.totalPrice,
                    },
                  },
                ],
              });
            },
            // Finalize the transaction after payer approval
            onApprove: (data, actions) => {
              return actions.order.capture().then(function (details) {
                const paymentResult = {
                  id: details.id,
                  status: details.status,
                  update_time: details.update_time,
                  email_address: details.payer.email_address,
                };
                dispatch(orderPayAction({ id, paymentResult }));
              });
            },
            onError: (error) => {
              console.log(error.message);
              return toast.error("An Error is appeared, please try later");
            },
          })
          .render("#paypal-button-container");
      };
    }

    return () => {
      if (script) {
        document.body.removeChild(script);
      }
    };
  }, [orderDetails]);

  useEffect(() => {
    console.log(isOrderPaid);
    if (isOrderPaid) {
      //dispatch if isOrderPaid to update the order;
      //But to avoid a loop we have to reset the pay first otherwise it will be a loop...
      dispatch(payResetAction());
      dispatch(orderDetailsAction(id));
    }
  }, [isOrderPaid]);

  const renderArticles = () => {
    return orderDetails?.orderItems?.map((item, index) => {
      let key = Date.now() + "-" + index;
      return (
        <div key={key} className="flex flex-wrap">
          <img src={item.image} className="w-2/12" />
          <div className="w-5/12 pl-2">{item.name}</div>
          <div className="w-5/12 pl-2">
            {item.qty} x {item.price} € = {item.qty * item.price} €
          </div>
        </div>
      );
    });
  };

  return (
    <Layout>
      {loading ? (
        <Spinner />
      ) : error ? (
        <Error message={error} />
      ) : (
        <div className="bg-slate-200 min-h-[calc(100vh-6.25rem)] flex flex-wrap justify-center content-start">
          <div className="w-full px-2 sm:px-4 py-4 sm:py-8">
            <h1 className="text-2xl text-center pb-2 uppercase">
              Order {orderDetails?._id}
            </h1>
            <div className="max-w-[700px] mx-auto">
              <p>
                <strong>Shipping : </strong>
                Address : {orderDetails?.shippingAddress?.address},{" "}
                {orderDetails?.shippingAddress?.city}{" "}
                {orderDetails?.shippingAddress?.postalCode},{" "}
                {orderDetails?.shippingAddress?.country}
              </p>
              <div>
                <strong>Payment : </strong>
                Payment Method : {orderDetails?.paymentMethod}
                {orderDetails?.isPaid ? (
                  <div className="block bg-green-300 text-green-700 border border-green-700 font-semibold capitalize tracking-tight p-2">
                    Paid
                  </div>
                ) : (
                  <div className="block bg-red-300 text-red-700 border border-red-700 font-semibold capitalize tracking-tight p-2">
                    Not Paid
                  </div>
                )}
              </div>
              <strong>Articles : </strong>
              <div>{renderArticles()}</div>
              <p>
                <strong>Address : </strong>
                {orderDetails?.shippingAddress?.address},{" "}
                {orderDetails?.shippingAddress?.city}{" "}
                {orderDetails?.shippingAddress?.postalCode},{" "}
                {orderDetails?.shippingAddress?.country}
              </p>
              <p>
                <strong>Payment Method : </strong>
                {orderDetails?.paymentMethod}
              </p>
              <p>
                <strong>Shipping Price : </strong>
                {addDecimals(orderDetails?.shippingPrice)} €
              </p>
              <p>
                <strong>Tax Price (included): </strong>
                {addDecimals(orderDetails?.taxPrice)} €
              </p>
              <p>
                <strong>total Price : </strong>
                {addDecimals(orderDetails?.totalPrice)} €
              </p>
              <div id="paypal-button-container"></div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};
export default Order;
