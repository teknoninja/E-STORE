import React, { useEffect, useState } from 'react';
import Card from "../Card/Card";
import "./FeaturedProducts.scss";
import sanityClient from "../../sanityClient"; // 1. Import the Sanity client

const FeaturedProducts = ({ type }) => {
  // 2. Set up state for data and loading
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // 3. Define the GROQ query to filter by type
    const query = `*[_type == "product" && type == $type]{
      _id,
      title,
      price,
      oldPrice,
      isNew,
      "img": img.asset->url,
      "img2": img2.asset->url
    }`;
    const params = { type };

    setLoading(true);
    setError(false);

    // 4. Fetch the data from Sanity
    sanityClient
      .fetch(query, params)
      .then((products) => {
        setData(products);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(true);
        setLoading(false);
      });
  }, [type]); // Re-run the query if the 'type' prop changes

  return (
    <div className="featuredProducts">
      <div className="top">
        <h1>{type} products</h1>
        <p>
        Welcome to a curated showcase of our most distinguished pieces. Each item in our Featured Collection is selected for its superior craftsmanship, timeless design, and exceptional quality. Discover the styles everyone is talking about. This handpicked selection features our latest arrivals and all-time favorites, chosen for their standout quality and modern appeal. Shop the best of the season right here
        </p>
      </div>
      <div className="bottom">
        {error
          ? "Something went wrong!"
          : loading
          ? "loading"
          : data?.map((item) => <Card item={item} key={item._id} />) /* 5. Use item._id for the key */}
      </div>
    </div>
  );
};

export default FeaturedProducts;