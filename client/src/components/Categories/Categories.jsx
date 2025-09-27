import React, { useState, useEffect } from "react";
import "./Categories.scss";
import { Link } from "react-router-dom";
import sanityClient from "../../sanityClient";

const Categories = () => {
  const [categories, setCategories] = useState(null);

  useEffect(() => {
    const query = `*[_type == "category"]{
      _id,
      title,
      "imageUrl": image.asset->url
    }`;
    
    sanityClient.fetch(query).then(setCategories);
  }, []);

  if (!categories) return <div>Loading categories...</div>;

  // This creates a more flexible grid based on your data
  return (
    <div className="categories">
      {categories.map((category, index) => (
        <div className="col" key={category._id}>
          <div className="row">
            <img src={category.imageUrl} alt={category.title} />
            <Link to={`/products/${category._id}`} className="link">
              {category.title}
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Categories;