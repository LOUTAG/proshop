import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductList } from "../redux/slices/productsSlice";

//components
import Layout from "../components/Layout";
import Meta from "../components/Meta";
import Product from "../components/Product";
import Paginate from "../components/Paginate";
import Spinner from "../components/Spinner";
import Error from "../components/Error";

const Home = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products);
  const { loading, productsList, page, pages, error } = products;

  useEffect(() => {
    dispatch(fetchProductList());
  }, []);

  const renderProducts = () => {
    return productsList.map((item, index) => {
      let key = Date.now + "-" + index;
      return (
        <Product
          key={key}
          id={item._id}
          name={item.name}
          image={item.image}
          price={item.price}
          rating={item.rating}
          reviews={item.numReviews}
        />
      );
    });
  };
  return (
    <>
    <Meta title="homepage" description="blablabla" keywords="electronics devices" />
      {loading ? (
        <Spinner />
      ) : error ? (
        <Layout>
          <Error message={error}>Something went wrong please try later</Error>
        </Layout>
      ) : (
        <>
          <Layout>
            <section title="welcome" className="px-4 sm:px-8">
              <h1 className="text-center text-xl font-bold py-4 capitalize">
                welcome to proshop
              </h1>
              <h2 className="text-center text-lg pb-4">
                e-commerce platform specialized in electronic products for
                entertainment, communication, productivity...{" "}
              </h2>
            </section>
            <section title="latest products">
              <h2 className="text-center text-xl font-bold py-4 capitalize">
                latest products
              </h2>
              <div className="grid w-full px-4 mb-8  gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {renderProducts()}
              </div>
              <Paginate pages={pages} page={page} />
            </section>
          </Layout>
        </>
      )}
    </>
  );
};
export default Home;
