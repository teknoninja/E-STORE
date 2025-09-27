import React from "react";
import "./Cart.scss";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { useSelector, useDispatch } from "react-redux";
// 1. Correct the import path to your Redux slice
import { removeItem, resetCart } from "../../redux/cartReducer"; 
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";

const Cart = () => {
  const products = useSelector((state) => state.cart.products);
  const dispatch = useDispatch();
  

  const totalPrice = () => {
    let total = 0;
    products.forEach((item) => {
      total += item.quantity * item.price;
    });
    return total.toFixed(2);
  };

  // This payment logic will require a new backend endpoint to work with Sanity
  const handlePayment = async () => {
    // ... your stripe logic ...
    console.log("Stripe Key:", import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

    try {
      const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY); // Use your publishable key here

      // 1. Send the cart products to your serverless function
      const response = await axios.post("/api/checkout", {
        products,
      });

      // 2. Redirect to Stripe's checkout page using the session ID from the response
      await stripe.redirectToCheckout({
        sessionId: response.data.id,
      });
    } catch (err) {
      console.log(err);
    }
  };
  
  return (
    <div className="cart">
      <h1>Products in your cart</h1>
      {products?.map((item) => (
        // 2. Use item._id for the key
        <div className="item" key={item._id}> 
          {/* 3. Use the direct image URL from item.img */}
          <img src={item.img} alt={item.title} /> 
          <div className="details">
            <h1>{item.title}</h1>
            <p>{item.desc?.substring(0, 100)}</p>
            <div className="price">
              {item.quantity} x ${item.price}
            </div>
          </div>
          <DeleteOutlinedIcon
            className="delete"
            // 4. Dispatch removeItem with item._id
            onClick={() => dispatch(removeItem(item._id))} 
          />
        </div>
      ))}
      <div className="total">
        <span>SUBTOTAL</span>
        <span>${totalPrice()}</span>
      </div>
      <button onClick={handlePayment}>PROCEED TO CHECKOUT</button>
      <span className="reset" onClick={() => dispatch(resetCart())}>
        Reset Cart
      </span>
    </div>
  );
};

export default Cart;