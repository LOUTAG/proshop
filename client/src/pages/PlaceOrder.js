import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

//actions
import { createOrderAction } from "../redux/slices/orderSlice";
import { clearCartAction } from "../redux/slices/cartSlice";

//utils
import instance from "../utils/api";
import addDecimals from "../utils/addDecimals";
import { toast } from "react-toastify";

//components
import Layout from "../components/Layout";
import CheckoutSteps from "../components/CheckoutSteps";
import CartItem from "../components/CartItem";
import axios from "axios";

const PlaceOrder = () => {
  const dispatch = useDispatch();
  const { cart, orders } = useSelector((store) => store);
  const { items, shippingAddress, paymentMethod } = cart;
  const { loading, isOrderCreated, error } = orders;
  const navigate = useNavigate();
  useEffect(() => {
    if (items.length === 0) return navigate("/");
  }, [items]);

  useEffect(() => {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src =
      "https://www.paypal.com/sdk/js?client-id=AZn30bMIoncsb_GaCW7gkrshC2BVk0SRBAQ2jpRcBdeE9tzjlyDPsCRCdkbz51sg2SsUChWlqOsMudE4&currency=EUR";
    script.async = true;
    document.body.appendChild(script);

    //implement button action if script is loaded
    script.onload = () => {
      window.paypal
        .Buttons({
          // Sets up the transaction when a payment button is clicked
          createOrder: async (data, actions) => {
            try {
              const response = await instance.post("/api/orders/create-order", {
                items,
                shippingAddress,
                paymentMethod 
              });
              console.log(response);
              const { id } = response.data;
              return id;
            } catch (error) {
              throw error;
            }
          },
          // Finalize the transaction after payer approval
            onApprove: async(data, actions) => {
              try{
                const response = await instance.post(`/api/orders/${data.orderID}/capture`);
                toast.success('Your payment has been perform with success');
                dispatch(clearCartAction());
                navigate(`/orders/${response.data}`);
              }catch(error){
                toast.error('Something went wrong, please try later');
                throw error;
              }
            },
            onCancel: async(data)=>{
              try{
                await instance.put(`/api/orders/${data.orderID}/cancel`);
                toast.warn('Your payment has been cancelled');
              }catch(error){
                console.log(error);
              }
            },
            onError: async(data)=>{
              try{
                await instance.put(`/api/orders/${data.orderID}/cancel`);
                toast.warn('Your payment has been cancelled');
              }catch(error){
                console.log(error);
              }
            }
        })
        .render("#paypal-button-container");
    };
  }, []);

  const itemsNumber = items.reduce((acc, item) => acc + item.qty, 0);

  const itemsPrice = items
    .reduce((acc, item) => acc + item.qty * item.price, 0)
    .toFixed(2);

  const shippingPrice =
    Number(itemsPrice) >= 100 ? addDecimals(0) : addDecimals(10);

  const totalPrice = (Number(itemsPrice) + Number(shippingPrice)).toFixed(2);

  const taxPrice = (Number(totalPrice) * 0.2).toFixed(2);

  //helpers
  const renderCartItems = () => {
    return items.map((item, index) => {
      let key = Date.now() + "-" + index;
      return <CartItem key={key} item={item} />;
    });
  };

  if (isOrderCreated) {
    navigate(`/orders/${isOrderCreated}`);
    dispatch(clearCartAction());
  }
  return (
    <Layout>
      <div className="bg-slate-200 min-h-[calc(100vh-6.25rem)] flex flex-wrap justify-center content-start">
        <CheckoutSteps step1 step2 step3 step4 />
        <div className="w-full px-2 sm:px-4 py-4 sm:py-8">
          <h1 className="text-2xl text-center pb-2">Summary Order</h1>
          <p className="text-center pb-4">
            Check if your items, shipping address and payment method are
            correct.
          </p>
        </div>
        <div className="grid bg-white p-2 mb-8 md:grid-cols-[1fr_300px] gap-4 rounded shadow mx-4">
          <div className="left-column">
            <div>
              <h2 className="text-lg font-semibold tracking-tight capitalize">
                Articles
              </h2>
              <ul className="grid grid-cols-1 gap-y-4">{renderCartItems()}</ul>
            </div>
          </div>
          <div className="right-column">
            <div className="relative pb-2 mb-2 after:content-[''] after:absolute after:inset-x-0 after:bottom-0 after:border-b-2 after:rounded-full after:border-slate-100">
              <h2 className="text-lg font-semibold tracking-tight capitalize">
                Delivery Address
              </h2>
              <p>
                <strong>Address : </strong>
                {shippingAddress.address}, {shippingAddress.city}{" "}
                {shippingAddress.postalCode}
              </p>
              <p>
                <strong>Country : </strong>
                {shippingAddress.country}
              </p>
            </div>
            <div className="relative pb-2 mb-2 after:content-[''] after:absolute after:inset-x-0 after:bottom-0 after:border-b-2 after:rounded-full after:border-slate-100">
              <h2 className="text-lg font-semibold tracking-tight capitalize">
                Payment Method
              </h2>
              <p>
                <strong>Method : </strong>
                {paymentMethod}
              </p>
            </div>
            <div className="mb-2">
              <p>
                <strong>Shipping Price : </strong>
                {shippingPrice} €
              </p>
              <p>
                <strong>Subtotal {`( ${itemsNumber} articles )`} : </strong>
                {itemsPrice} €{" "}
              </p>
              <p>
                <strong>Tax : </strong>
                {taxPrice} €{" "}
              </p>
              <div className="mt-4 mb-4 text-lg font-bold tracking-tight capitalize">
                Total : {totalPrice} €{" "}
              </div>
            </div>
            <div className="mb-2">
              <div id="paypal-button-container"></div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
export default PlaceOrder;
