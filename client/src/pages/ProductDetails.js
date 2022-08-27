import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link, useNavigate } from "react-router-dom";
import { fetchDetailsProduct } from "../redux/slices/productsSlice";

//services
import Helmet from "react-helmet";

//components
import Layout from "../components/Layout";
import Rating from "../components/Rating";
import Spinner from "../components/Spinner";
import Error from "../components/Error";

const ProductDetails = () => {
  const [qty, setQty] = useState(1);
  const id = useParams().id;
  const products = useSelector((store) => store.products);
  const { loading, productDetails, error } = products;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchDetailsProduct(id));
  }, []);

  //helpers
  const onFormSubmit=(event)=>{
    event.preventDefault();
    navigate(`/cart/${id}?qty=${qty}`);
  }

  const renderQuantity = () => {
    const stock = [...Array(productDetails.countInStock).keys()];
    return stock.map((item, index) => {
      let key = Date.now() + "-" + index;
      return (
        <option key={key} value={item + 1}>
          {item + 1}
        </option>
      );
    });
  };

  return (
    <>
    <Helmet>
      <title>Welcome to proshop | product details</title>
      <meta name="description" content="All the details that you need" />
    </Helmet>
      {loading ? (
        <Spinner />
      ) : error ? (
        <Layout>
          <Error message={error} />
        </Layout>
      ) : (
        <Layout>
          <div>
            <div className="my-4 sm:my-8 flex flex-wrap">
              {/*** left ***/}
              <div className="left-column w-full sm:w-1/2">
                <img src={productDetails.image} alt={productDetails.name} />
              </div>
              {/*** right ***/}
              <div className="right-column w-full sm:w-1/2 px-2 sm:px-4">
                <h1 className="text-xl mb-2 ">{productDetails.name}</h1>
                <Link
                  to={`/brand/${productDetails.brand}`}
                  className="hover:underline text-[#007185]"
                >
                  Brand : {productDetails.brand}
                </Link>
                <div className="flex items-center text-[#ffa41c]">
                  <Rating
                    rating={productDetails.rating}
                    reviews={productDetails.numReviews}
                  />
                </div>
                <h2 className="pb-2 font-semibold text-2xl tracking-wide">
                  {productDetails.price} €
                </h2>
                <div className="stock">
                  {productDetails.countInStock > 0 ? (
                    <span className="text-[#007600] font-semibold">
                      In Stock
                    </span>
                  ) : (
                    <span className="text-[#B12704] font-semibold">
                      Out of Stock
                    </span>
                  )}
                </div>
                <form onSubmit={(event)=>onFormSubmit(event)}>
                  {productDetails.countInStock > 0 && (
                    <div className="flex items-center">
                      <label htmlFor="quantity" className="mr-[0.5rem]">
                        Quantity :
                      </label>
                      <select
                        name="quantity"
                        className="border-slate-300 border rounded p-1"
                        value={qty}
                        onChange={(event) => setQty(event.target.value)}
                      >
                        {renderQuantity()}
                      </select>
                    </div>
                  )}
                  <button
                    disabled={productDetails.countInStock < 1}
                    type="submit"
                    className={`${
                      productDetails.countInStock < 1
                        ? "bg-gray-400 opacity-75"
                        : "bg-[#FFD814]"
                    } rounded w-full sm:max-w-[200px] py-2 px-4 sm:inline mx-auto my-4 font-semibold text-lg inline-block`}
                  >
                    Add to cart
                  </button>
                </form>
                <div className="description">
                  <div className="uppercase font-semibold">Description</div>
                  <p>{productDetails.description}</p>
                </div>
              </div>
            </div>
          </div>
        </Layout>
      )}
    </>
  );
};
export default ProductDetails;
