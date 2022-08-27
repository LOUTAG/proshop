import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

//redux actions
import {
  orderDetailsAction,
  orderInvoiceAction,
  resetOrderAction,
} from "../redux/slices/orderSlice";

//utils
import addDecimals from "../utils/addDecimals";

//components
import Layout from "../components/Layout";
import Spinner from "../components/Spinner";
import Error from "../components/Error";
import axios from "axios";

const Order = () => {
  const dispatch = useDispatch();
  const { orders } = useSelector((store) => store);
  const {
    loading,
    orderDetails,
    error,
    invoiceLoading,
    invoice,
    invoiceError,
  } = orders;

  const { id } = useParams();

  /*** render the orderDetails ***/
  useEffect(() => {
    dispatch(orderDetailsAction(id));
    return () => {
      dispatch(resetOrderAction());
    };
  }, []);

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

  const onButtonClick = () => {
    dispatch(orderInvoiceAction({ id: id }));
  };

  const downloadPDF = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.get("/api/orders/invoices/get", {
        responseType: "arraybuffer",
      });
      console.log(response);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "file.pdf");
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.log(error);
    }
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
              {/* DOWNLOAD PDF BUTTON */}
              <div>
                <button onClick={(event) => downloadPDF(event)}>
                  DOWNLOAD
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};
export default Order;
