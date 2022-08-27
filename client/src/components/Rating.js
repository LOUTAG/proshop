import React from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const Rating = ({ rating, reviews }) => {
  //helpers
  const renderRatingStars = () => {
    if (rating < 0.5) {
      return (
        <>
          <FaRegStar />
          <FaRegStar />
          <FaRegStar />
          <FaRegStar />
          <FaRegStar />
        </>
      );
    } else if (rating < 1) {
      return (
        <>
          <FaStarHalfAlt />
          <FaRegStar />
          <FaRegStar />
          <FaRegStar />
          <FaRegStar />
        </>
      );
    } else if (rating < 1.5) {
      return (
        <>
          <FaStar />
          <FaRegStar />
          <FaRegStar />
          <FaRegStar />
          <FaRegStar />
        </>
      );
    } else if (rating < 2) {
      return (
        <>
          <FaStar />
          <FaStarHalfAlt />
          <FaRegStar />
          <FaRegStar />
          <FaRegStar />
        </>
      );
    } else if (rating < 2.5) {
      return (
        <>
          <FaStar />
          <FaStar />
          <FaRegStar />
          <FaRegStar />
          <FaRegStar />
        </>
      );
    } else if (rating < 3) {
      return (
        <>
          <FaStar />
          <FaStar />
          <FaStarHalfAlt />
          <FaRegStar />
          <FaRegStar />
        </>
      );
    } else if (rating < 3.5) {
      return (
        <>
          <FaStar />
          <FaStar />
          <FaStar />
          <FaRegStar />
          <FaRegStar />
        </>
      );
    } else if (rating < 4) {
      return (
        <>
          <FaStar />
          <FaStar />
          <FaStar />
          <FaStarHalfAlt />
          <FaRegStar />
        </>
      );
    } else if (rating < 4.5) {
      return (
        <>
          <FaStar />
          <FaStar />
          <FaStar />
          <FaStar />
          <FaRegStar />
        </>
      );
    }else if (rating < 5) {
        return (
          <>
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStarHalfAlt />
          </>
        );
      }
     else {
      <>
        <FaStar />
        <FaStar />
        <FaStar />
        <FaStar />
        <FaStar />
      </>;
    }
  };
  return (
    <>
      {renderRatingStars()}
      <span className="ml-1 text-base text-black">{reviews} Reviews</span>
    </>
  );
};
export default Rating;
