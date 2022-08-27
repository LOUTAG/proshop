import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import addDecimals from "../utils/addDecimals";
import { createOrderAction } from "../redux/slices/orderSlice";
import { clearCartAction } from "../redux/slices/cartSlice";

//components
import Layout from "../components/Layout";
import CheckoutSteps from "../components/CheckoutSteps";
import CartItem from "../components/CartItem";

const PlaceOrder = () => {
  const dispatch = useDispatch();
  const { cart, orders } = useSelector((store) => store);
  const { items, shippingAddress, paymentMethod } = cart;
  const { loading ,isOrderCreated, error } = orders;

  const navigate = useNavigate();
  
  useEffect(()=>{
    if(items.length === 0) return navigate('/'); 
  },[items]);

  const itemsNumber = items.reduce((acc, item) => acc + item.qty, 0);

  const itemsPrice = items
    .reduce((acc, item) => acc + item.qty * item.price, 0)
    .toFixed(2);

  const shippingPrice = Number(itemsPrice) >=100 ? addDecimals(0) : addDecimals(10);

  const totalPrice = (Number(itemsPrice) + Number(shippingPrice)).toFixed(2);

  const taxPrice = (Number(totalPrice) * 0.2).toFixed(2);

  //helpers
  const renderCartItems = () => {
    return items.map((item, index) => {
      let key = Date.now() + "-" + index;
      return <CartItem key={key} item={item} />;
    });
  };

  const onButtonClick =()=>{
    const payload = {
      orderItems: items,
      shippingAddress,
      paymentMethod,
      taxPrice: Number(taxPrice),
      shippingPrice: Number(shippingPrice),
      totalPrice: Number(totalPrice)
    }
    dispatch(createOrderAction(payload));
  }

  if(isOrderCreated){
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
              <button onClick={()=>onButtonClick()}
                className="bg-[#FFD814] rounded w-full
                 py-2 px-4 font-semibold uppercase tracking-tight"
              >
                Proceed to order
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
export default PlaceOrder;
