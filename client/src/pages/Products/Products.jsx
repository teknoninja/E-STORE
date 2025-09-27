import React from "react";
import { useState, useEffect } from "react"; // 1. Import Sanity client and React hooks
import { useParams } from "react-router-dom";
import List from "../../components/List/List";
import sanityClient from "../../sanityClient";
import "./Products.scss";

const Products = () => {
  // 2. Get catId as a string (no more parseInt)
  const { id: catId } = useParams();
  
  const [data, setData] = useState(null); // State for sub-categories
  const [loading, setLoading] = useState(true);

  const [maxPrice, setMaxPrice] = useState(1000); // Increased default
  const [sort, setSort] = useState("asc");
  const [selectedSubCats, setSelectedSubCats] = useState([]);

  // 3. Fetch sub-categories associated with the current category
  useEffect(() => {
    setLoading(true);
    // This query finds the single category document by its ID
    // and returns only its list of sub-categories
    const query = `*[_type == "category" && _id == $catId][0]{
      "subCategories": subCategories[]->{_id, title}
    }`;
    const params = { catId };

    sanityClient.fetch(query, params).then((result) => {
      setData(result.subCategories);
      setLoading(false);
    });
  }, [catId]); // Re-fetch when the category ID changes

  const handleChange = (e) => {
    const value = e.target.value;
    const isChecked = e.target.checked;

    setSelectedSubCats(
      isChecked
        ? [...selectedSubCats, value]
        : selectedSubCats.filter((item) => item !== value)
    );
  };

  return (
    <div className="products">
      <div className="left">
        <div className="filterItem">
          <h2>Product Categories</h2>
          {loading ? "loading..." : data?.map((item) => (
            // 4. Update JSX to use Sanity's data structure (_id, title)
            <div className="inputItem" key={item._id}>
              <input
                type="checkbox"
                id={item._id}
                value={item._id}
                onChange={handleChange}
              />
              <label htmlFor={item._id}>{item.title}</label>
            </div>
          ))}
        </div>
        <div className="filterItem">
          <h2>Filter by price</h2>
          <div className="inputItem">
            <span>0</span>
            <input
              type="range"
              min={0}
              max={1000}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
            <span>{maxPrice}</span>
          </div>
        </div>
        <div className="filterItem">
          <h2>Sort by</h2>
          {/* ... Sort logic remains the same ... */}
        </div>
      </div>
      <div className="right">
        <img
          className="catImg"
          src="https://images.pexels.com/photos/1074535/pexels-photo-1074535.jpeg?auto=compress&cs=tinysrgb&w=1600"
          alt=""
        />
        <List catId={catId} maxPrice={maxPrice} sort={sort} subCats={selectedSubCats}/>
      </div>
    </div>
  );
};

export default Products;