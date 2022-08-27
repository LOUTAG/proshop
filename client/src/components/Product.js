import React from "react";
import { Link } from 'react-router-dom';
import Rating from "./Rating";

const Product =({id, name, image, price, rating, reviews})=>{
    return (
        <article className="rounded shadow">
            <Link to={`/product/${id}`}>
                <img src={image} alt={name} />
            </Link>
            <Link to={`/product/${id}`}>
                <h3 className="pt-4 pb-2 px-8 hover:underline">{name}</h3>
            </Link>
            <div className="pt-2 px-8 bold text-lg flex items-center text-[#ffa41c]">
            <Rating rating={rating} reviews={reviews} />
            </div>
            <h4 className="pb-4 px-8 font-semibold text-xl tracking-wide">{price} €</h4>
        </article>
    )
}
export default Product;