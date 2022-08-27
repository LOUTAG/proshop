import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { savePaymentMethodAction } from "../redux/slices/cartSlice";

import Layout from "../components/Layout";
import CheckoutSteps from "../components/CheckoutSteps";

const Payment = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector((store) => store.cart);
  const { shippingAddress } = cart;

  const [paymentMethod, setPaymentMethod] = useState("Paypal");

  useEffect(() => {
    if (!shippingAddress) navigate("/shipping");
  });

  const onFormSubmit = (event) => {
    event.preventDefault();
    dispatch(savePaymentMethodAction(paymentMethod));
    navigate("/placeorder");
  };

  return (
    <Layout>
      <div className="bg-slate-200 min-h-[calc(100vh-6.25rem)] flex flex-wrap justify-center content-start">
        <CheckoutSteps step1 step2 step3 />
        <div className="w-full px-2 sm:px-4 py-4 sm:py-8">
          <h1 className="text-2xl text-center pb-4">Payment Method</h1>
          <form
            className="flex mx-auto flex-col w-full p-4 bg-white rounded items-start sm:w-[400px] shadow"
            onSubmit={(event) => onFormSubmit(event)}
          >
            <div className="flex items-center pb-1">
              <input
                type="radio"
                name="payment"
                id="paypal"
                value="Paypal"
                onChange={(event) => setPaymentMethod(event.target.value)}
                checked={paymentMethod === 'Paypal' && true }
              ></input>
              <label htmlFor="paypal" className="pl-2 tracking-wide text-lg">Paypal</label>
            </div>
            <div className="flex items-center pb-1">
              <input
                type="radio"
                name="payment"
                id="stripe"
                value="Stripe"
                onChange={(event) => setPaymentMethod(event.target.value)}
                checked={paymentMethod === 'Stripe' && true }
              ></input>
              <label htmlFor="stripe" className="pl-2 tracking-wide text-lg">Stripe</label>
            </div>
            <button
              type="submit"
              className="px-4 py-2 mt-4 bg-[#FFD814] w-full rounded uppercase "
            >
              Valid
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};
export default Payment;
