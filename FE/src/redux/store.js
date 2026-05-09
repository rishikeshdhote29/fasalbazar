import { configureStore } from '@reduxjs/toolkit';        
import usersReducer  from './userSlice';
import productsReducer  from './productSlice';
import ordersReducer  from './orderSlice.js';


const store= configureStore({
    reducer:{
        Users:usersReducer,
      
        Products:productsReducer,
        Orders:ordersReducer
    }}
)
export default store;