import React, { useState, useEffect } from "react";
import "./List.scss";
import Card from "../Card/Card";
import sanityClient from "../../sanityClient"; // 1. Import Sanity client and hooks

const List = ({ subCats, maxPrice, sort, catId }) => {
  // 2. Set up state for data, loading, and errors
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // 3. Use useEffect to fetch data when filters change
  useEffect(() => {
    setLoading(true);
    setError(false);

    // 4. Build the dynamic GROQ query
    const query = `*[_type == "product" 
      && $catId in categories[]._ref
      && price <= $maxPrice
      ${subCats.length > 0 ? `&& count((subCategories[]->_id)[@ in $subCats]) > 0` : ''}
    ] | order(price ${sort}) {
      _id,
      title,
      price,
      oldPrice,
      isNew,
      "img": img.asset->url,
      "img2": img2.asset->url
    }`;

    // 5. Define parameters for the query
    const params = { catId, subCats, maxPrice };

    // 6. Fetch data using the Sanity client
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
  }, [catId, subCats, maxPrice, sort]); // Re-fetches when any filter prop changes

  return (
    <div className="list">
      {error
        ? "Something went wrong!"
        : loading
        ? "loading"
        : data?.map((item) => <Card item={item} key={item._id} />) /* 7. Update the key to use item._id */}
    </div>
  );
};

export default List;