import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  updateCartQtyAction,
  removeFromCartAction,
} from "../redux/slices/cartSlice";

const CartItem = ({ item }) => {
  const dispatch = useDispatch();
  //helpers
  const renderQuantity = () => {
    return [...Array(item.countInStock).keys()].map((item, index) => {
      let key = Date.now() + "-" + index;
      return (
        <option key={key} value={item + 1}>
          {item + 1}
        </option>
      );
    });
  };

  return (
    <li className="grid grid-cols-[10fr_2fr]">
      <div className="flex flex-wrap sm:flex-nowrap">
        <img
          src={item.image}
          className="max-w-[220px] h-auto pr-2"
          alt={item.name}
        />
        <div>
          <Link to={`/product/${item._id}`}>
            <h2 className="text-lg w-full">{item.name}</h2>
          </Link>
          <Link
            to={`/brand/${item.brand}`}
            className="hover:underline text-[#007185]"
          >
            Brand : {item.brand}
          </Link>
          <div className="price font-semibold text-lg">{item.price} €</div>
          <div className="stock">
            {item.countInStock > 0 ? (
              <span className="text-[#007600] font-semibold">In Stock</span>
            ) : (
              <span className="text-[#B12704] font-semibold">Out of Stock</span>
            )}
          </div>
          <div className="flex items-center">
            <label htmlFor="quantity" className="mr-[0.5rem]">
              Qty :
            </label>
            <select
              name="quantity"
              className="border-slate-300 border rounded p-1 cursor-pointer"
              value={item.qty}
              onChange={(event) =>
                dispatch(
                  updateCartQtyAction({
                    _id: item._id,
                    qty: parseInt(event.target.value),
                  })
                )
              }
            >
              {renderQuantity()}
            </select>
            <button
              onClick={() => dispatch(removeFromCartAction(item._id))}
              className="relative text-sm ml-2 pl-2 hover:underline text-[#007185] before:content-[' '] before:absolute before:left-0 before:inset-y-0 before:border-l before:border-slate-300"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
      <div className="text-right font-semibold text-lg">
        {(item.price * item.qty).toFixed(2)} €
      </div>
    </li>
  );
};
export default CartItem;
