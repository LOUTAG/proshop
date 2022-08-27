import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { saveShippingCartAction } from "../redux/slices/cartSlice";

import Layout from "../components/Layout";
import CheckoutSteps from "../components/CheckoutSteps";

const Shipping = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector((store) => store.cart);
  const { shippingAddress } = cart;

  const [address, setAddress] = useState(shippingAddress.address);
  const [city, setCity] = useState(shippingAddress.city);
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode);
  const [country, setCountry] = useState(shippingAddress.country);

  const onFormSubmit = (event) => {
    event.preventDefault();
    const payload = { address, city, postalCode: Number(postalCode), country };
    dispatch(saveShippingCartAction(payload));
    navigate("/payment");
  };

  return (
    <Layout>
      <div className="bg-slate-200 min-h-[calc(100vh-6.25rem)] flex flex-wrap justify-center content-start">
        <CheckoutSteps step1 step2 />
        <div className="w-full px-2 sm:px-4 py-4 sm:py-8">
          <h1 className="text-2xl text-center pb-4">Shipping</h1>
          <form
            className="flex mx-auto flex-col w-full p-4 bg-white rounded items-start sm:w-[400px] shadow"
            onSubmit={(event) => onFormSubmit(event)}
          >
            <label htmlFor="address" className="pb-1 tracking-wide">
              Address :{" "}
            </label>
            <input
              className="border border-slate-300 w-full rounded px-2 py-1"
              type="string"
              required
              name="address"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
            />
            <label htmlFor="city" className="pb-1 tracking-wide">
              City :{" "}
            </label>
            <input
              className="border border-slate-300 w-full rounded px-2 py-1"
              type="string"
              required
              name="city"
              value={city}
              onChange={(event) => setCity(event.target.value)}
            />
            <label htmlFor="postalCode" className="pb-1 tracking-wide">
              PostalCode :{" "}
            </label>
            <input
              className="border border-slate-300 w-full rounded px-2 py-1"
              type="string"
              required
              name="postalCode"
              value={postalCode}
              onChange={(event) => setPostalCode(event.target.value)}
            />
            <label htmlFor="country" className="pb-1 tracking-wide">
              Country :{" "}
            </label>
            <input
              className="border border-slate-300 w-full rounded px-2 py-1"
              type="string"
              required
              name="country"
              value={country}
              onChange={(event) => setCountry(event.target.value)}
            />

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
export default Shipping;
