import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

//action
import {fetchProductsByTerm} from "../redux/slices/searchSlice";

//components
import Layout from "../components/Layout";
import Spinner from "../components/Spinner";
import Error from "../components/Error";
import Product from "../components/Product";

const Search=()=>{
    const dispatch=useDispatch();
    const {term} = useParams();
    const {search} = useSelector(store=>store);
    const { loading, searchProduct, error }= search;

    useEffect(()=>{
        dispatch(fetchProductsByTerm(term));
    },[term]);

    const renderProducts=()=>{
        if(searchProduct.length===0) return <div>no product was found for <span className="font-bold">{term}</span></div>
        return searchProduct.map((item, index)=>{
            let key = Date.now+'-'+index;
            return(
                <Product key={key} id={item._id} name={item.name} image={item.image} price={item.price} rating={item.rating} reviews={item.numReviews} />
            )
        })
    }

    return (
        <Layout>
            {loading ? <Spinner/> : error ? <Error message={error}/> : <div className="grid w-full p-4 mb-8  gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {renderProducts()}
        </div> }
        </Layout>
    )
}
export default Search;