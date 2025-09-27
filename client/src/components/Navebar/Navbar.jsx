import React, { useState, useEffect , useRef} from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SearchIcon from "@mui/icons-material/Search";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { Link } from "react-router-dom";
import "./Navbar.scss";
import Cart from "../Cart/Cart";
import sanityClient from "../../sanityClient";
import { useSelector } from "react-redux";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState(null);
  const products = useSelector((state) => state.cart.products);
  const cartRef = useRef(); 

  useEffect(() => {
    const query = `*[_type == "category"]{_id, title}`;
    sanityClient.fetch(query).then(setCategories);
  }, []);

  const handleScroll = () => {
    const footer = document.getElementById("footer");
    if (footer) {
      footer.scrollIntoView({ behavior: "smooth" });
    }
  };
  // 3. Add useEffect to handle clicks outside the cart
  useEffect(() => {
    const handleClickOutside = (event) => {
      // If the cart is open and the click is outside the cart's container
      if (open && cartRef.current && !cartRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    // Add event listener when the component mounts
    document.addEventListener("mousedown", handleClickOutside);
    
    // Cleanup the event listener when the component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]); // This effect depends on the 'open' state

  return (
    <div className="navbar">
      <div className="wrapper">
        <div className="left">
          <div className="item">
            <img src="/img/en.png" alt="" />
          
          </div>
          <div className="item">
            <span>USA</span>
         
          </div>
          
          {/* Dynamically render category links here */}
          {categories?.map((category) => (
            <div className="item" key={category._id}>
              <Link className="link" to={`/products/${category._id}`}>
                {category.title}
              </Link>
            </div>
          ))}
        </div>

        <div className="center">
          <Link className="link" to="/">
            MY-STORE
          </Link>
        </div>
        
        <div className="right">
          {/* Static links are restored here */}
          <div className="item">
            <Link className="link" to="/">
              Homepage
            </Link>
          </div>
          <div className="item" onClick={handleScroll} style={{ cursor: 'pointer' }}>
            About
          </div>
          <div className="item" onClick={handleScroll} style={{ cursor: 'pointer' }}>
            Contact
          </div>
          <div className="item" onClick={handleScroll} style={{ cursor: 'pointer' }}>
           
              Stores
           
          </div>
          <div className="icons">
            <SearchIcon />
            <PersonOutlineOutlinedIcon />
            <FavoriteBorderOutlinedIcon />
            <div className="cartIcon" onClick={() => setOpen(!open)}>
              <ShoppingCartOutlinedIcon />
              <span>{products.length}</span>
            </div>
          </div>
        </div>
      </div >
      <div ref={cartRef}>
      {open && <Cart />}

      </div>
    </div>
  );
};

export default Navbar;