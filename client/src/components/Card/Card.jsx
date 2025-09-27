import React from "react";
import "./Card.scss";
import { Link } from "react-router-dom";

const Card = ({ item }) => {
  // item is now a flat object from Sanity: { _id, title, price, img, img2, ... }
  if (!item) {
    return null;
  }

  return (
    // 1. Use item._id for the link, which is Sanity's default ID
    <Link className="link" to={`/product/${item._id}`}>
      <div className="card">
        <div className="image">
          {item.isNew && <span>New Season</span>}
          <img
            // 2. Use the direct image URL from the GROQ query
            src={item.img}
            alt=""
            className="mainImg"
          />
          <img
            // 3. Use the direct image URL for the second image
            src={item.img2}
            alt=""
            className="secondImg"
          />
        </div>
        <h2>{item.title}</h2>
        <div className="prices">
          <h3>${item.oldPrice || item.price + 20}</h3>
          <h3>${item.price}</h3>
        </div>
      </div>
    </Link>
  );
};

export default Card;