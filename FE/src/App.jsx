import './App.css'
import PublicNavbar from "./component/auth/PublicNavbar.jsx";
import PrivateNavbar from "./component/user/PrivateNavbar.jsx";
import Register from './component/auth/Register.jsx';
import Success from './component/utils/Success.jsx';
import TrackOrder from './component/utils/TrackOrder.jsx';

import { BrowserRouter, Routes, Route } from "react-router";
import {useSelector} from "react-redux";
import UserProfile from "./component/user/UserProfile.jsx";
import Login from "./component/auth/Login.jsx";
import Home from "./component/auth/Home.jsx";
import ProtectedRoute from "./auth/ProtectedRoutes.jsx";
import MyOrder from "./component/user/MyOrder.jsx";
import Cart from "./component/user/Cart.jsx";
import Products from "./component/user/Products.jsx";
import ProductDetails from "./component/utils/ProductDetails.jsx";
import FarmerPrivateNavbar from "./component/seller/SellerPrivateNavbar.jsx";
import SellerOrder from "./component/seller/SellerOrder.jsx";
import SellerOrderDetails from "./component/seller/SellerOrderDetails.jsx";
import SellerListing from "./component/seller/SellerListing.jsx";

import ProductListing from "./component/seller/ProductListing.jsx";

import UpdateProfile from "./component/user/UpdateProfile.jsx";
import SellerProfile from "./component/seller/SellerProfile.jsx";
import UpdateSellerProfile from "./component/seller/UpdateSellerProfile.jsx";
import MyProductListing from "./component/seller/SellerListing.jsx";
import UpdateProductListing from "./component/seller/UpdateProductListing.jsx";
import SearchResult from "./component/user/SearchResult.jsx";
import ForgetPassword from "./component/auth/ForgetPassword.jsx";
import ResetPassword from "./component/auth/ResetPassword.jsx";




function App() {
    const user= useSelector(state => state.Users.loggedinUser)
  const {isLoggedIn}= useSelector(state => state.Users);
  console.log(user)
  return (
       <BrowserRouter>
<div>
    {isLoggedIn? (user.role==="user")?<PrivateNavbar/>:<FarmerPrivateNavbar/>: <PublicNavbar/>}
     <Routes>

    

       <Route path="/register" element={<Register/>} />
       <Route path="/success" element={<Success/>} />
       <Route path="/login" element={<Login/>} />
       <Route path="/" element={<Home/>} />

       <Route path="/products" element={<Products/>} />
       <Route path="/products/:id" element={<ProductDetails/>} />
       <Route path="/Search" element={<SearchResult/>} />
       
        <Route path="/track/:trackingId" element={<TrackOrder/>} />


       <Route path="/register" element={<Register/>} />
          <Route path="/my-listing" element={<MyProductListing/>} />
<Route path={"/forget-password"} element={<ForgetPassword/>} />
          <Route path="/reset-password/:token" element={<ResetPassword/>} />
         

         {/*Protected Routes*/}
        <Route element={<ProtectedRoute/>}>
       <Route path="/orders" element={<MyOrder/>} />
          <Route path="/seller-orders" element={<SellerOrder/>} />
           <Route path="/seller/order/:id" element={<SellerOrderDetails/>} />
          <Route path="/update-profile" element={<UpdateProfile/>} />
          <Route path="/profile" element={<UserProfile/>} />
          <Route path="/seller-profile" element={<SellerProfile/>} />
          <Route path="/update-seller-profile" element={<UpdateSellerProfile/>} />
          <Route path="/product-listing" element={<ProductListing/>} />
          <Route path="/product-update/:id" element={<UpdateProductListing/>} />
          
          <Route path="/seller-listing" element={<SellerListing/>} />
          
           <Route path="/track/:trackingId" element={<TrackOrder/>} />
            <Route path="/cart" element={<Cart/>} />
        
          
        </Route>

        
      </Routes>
      </div>
       </BrowserRouter>
      
      
      
  )
}
export default App;
