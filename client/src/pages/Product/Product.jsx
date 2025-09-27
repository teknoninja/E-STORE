import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/cartReducer"; // 1. Corrected import path
import sanityClient from "../../sanityClient"; // 2. Import Sanity client and hooks
import "./Product.scss";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import BalanceIcon from "@mui/icons-material/Balance";

const Product = () => {
  const { id } = useParams();
  const [selectedImg, setSelectedImg] = useState("img");
  const [quantity, setQuantity] = useState(1);
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  // 3. Fetch data from Sanity instead of useFetch
  useEffect(() => {
    const query = `*[_type == "product" && _id == $id][0]{
      ...,
      "img": img.asset->url,
      "img2": img2.asset->url,
    }`;
    const params = { id };

    setLoading(true);
    sanityClient.fetch(query, params).then((data) => {
      setProductData(data);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!productData) return <div>Product not found.</div>;

  return (
    <div className="product">
      <div className="left">
        <div className="images">
          {/* 4. Update image sources to use direct URLs */}
          <img
            src={productData.img}
            alt={productData.title}
            onClick={() => setSelectedImg("img")}
          />
          <img
            src={productData.img2}
            alt={productData.title}
            onClick={() => setSelectedImg("img2")}
          />
        </div>
        <div className="mainImg">
          <img src={productData[selectedImg]} alt={productData.title} />
        </div>
      </div>
      <div className="right">
        {/* 5. Update JSX to use flat data structure */}
        <h1>{productData.title}</h1>
        <span className="price">${productData.price}</span>
        <p>{productData.desc}</p>
        <div className="quantity">
          <button onClick={() => setQuantity((prev) => (prev === 1 ? 1 : prev - 1))}>-</button>
          {quantity}
          <button onClick={() => setQuantity((prev) => prev + 1)}>+</button>
        </div>
        <button
          className="add"
          // 6. Dispatch the correct payload structure to Redux
          onClick={() =>
            dispatch(
              addToCart({
                _id: productData._id,
                title: productData.title,
                desc: productData.desc,
                price: productData.price,
                img: productData.img,
                quantity,
              })
            )
          }
        >
          <AddShoppingCartIcon /> ADD TO CART
        </button>
        {/* ... rest of your JSX ... */}
      </div>
    </div>
  );
};

export default Product;