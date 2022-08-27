import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link, useNavigate } from "react-router-dom";
import { addToCartAction } from "../redux/slices/cartSlice";

//components
import Layout from "../components/Layout";
import Spinner from "../components/Spinner";
import Error from "../components/Error";
import CartItem from "../components/CartItem";

const Cart = () => {
  const navigate = useNavigate();
  const id = useParams().id;
  const qty = parseInt(window.location.href.split("=")[1]);
  const dispatch = useDispatch();
  const cart = useSelector((store) => store.cart);
  const { loading, items, error } = cart;

  useEffect(() => {
    const payload = { id, qty };
    if (id) {
      dispatch(addToCartAction(payload));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //helpers
  const renderCartItems = () => {
    return items.map((item, index) => {
      let key = Date.now() + "-" + index;
      return <CartItem key={key} item={item} />;
    });
  };

  return (
    <>
      {loading ? (
        <Spinner />
      ) : error ? (
        <Layout>
          <Error />
        </Layout>
      ) : (
        <Layout>
          <div className="bg-slate-200 min-h-[calc(100vh-6.25rem)] px-4 py-8">
            {items.length === 0 ? (
              <div>
                Your Cart is empty{" "}
                <Link className="hover:underline text-[#007185]" to="/">
                  Go Back
                </Link>
              </div>
            ) : (
              <div className="grid md:grid-cols-[1fr_300px] gap-4">
                <div className="left-column bg-white px-4 py-4">
                  <h1 className="relative pb-2 mb-4 after:content-[' '] after:absolute after:inset-x-0 after:bottom-0 border-b-2 border-slate-200 text-2xl font-semibold">
                    My Cart
                  </h1>
                  <div>
                    <ul className="grid grid-cols-1 gap-y-4">
                      {renderCartItems()}
                    </ul>
                  </div>
                </div>
                <div className="right-column bg-white px-2 py-4 h-fit">
                  <div className="text-2xl font-semibold">
                    <div>{`Subtotal (${items.reduce(
                      (acc, item) => acc + item.qty,
                      0
                    )} articles)`}</div>
                    <div>{`${items
                      .reduce((acc, item) => acc + item.qty * item.price, 0)
                      .toFixed(2)} €`}</div>
                  </div>
                  <button onClick={()=>navigate('/shipping')} className="bg-[#FFD814] rounded w-full sm:max-w-[300px] py-2 px-4 mx-auto my-4 font-semibold uppercase tracking-tight">Proceed to checkout</button>
                </div>
              </div>
            )}
          </div>
        </Layout>
      )}
    </>
  );
};
export default Cart;
