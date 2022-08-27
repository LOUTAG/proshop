import { useDispatch, useSelector } from "react-redux";
import { fetchProductList } from "../redux/slices/productsSlice";

const Paginate = ({ pages, page }) => {
  const dispatch = useDispatch();

  const onPageClick = (pageClicked) => {
    dispatch(fetchProductList(pageClicked));
  };

  const renderPages = () => {
    return [...Array(pages).keys()].map((item, index) => {
      let key = Date.now() + "pages" + index;
      if (item + 1 === page)
        return (
          <li key={key} className="bg-black text-white px-2 cursor-pointer">
            {item + 1}
          </li>
        );
      return (
        <li
          key={key}
          className="px-2 cursor-pointer"
          onClick={() => onPageClick(item + 1)}
        >
          {item + 1}
        </li>
      );
    });
  };

  return (
    pages > 1 && (
      <div className="pb-4">
        <ul className="flex justify-center items-center">{renderPages()}</ul>
      </div>
    )
  );
};
export default Paginate;
