import { configureStore } from '@reduxjs/toolkit';        
import usersReducer  from './userSlice';
import sellersReducer from './sellerSlice';
import userProductsReducer from './userProductSlice';
import sellerProductsReducer from './sellerProductSlice';
import userOrdersReducer from './userOrderSlice';
import sellerOrdersReducer from './sellerOrderSlice';


const store= configureStore({
    reducer:{
        Users: usersReducer,
        Sellers: sellersReducer,
        UserProducts: userProductsReducer,
        SellerProducts: sellerProductsReducer,
        UserOrders: userOrdersReducer,
        SellerOrders: sellerOrdersReducer
    }}
)
export default store;