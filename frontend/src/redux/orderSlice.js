import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";

import axios from "axios";


const initialState = {
  success: false,
  error: null,
  loading: false,
  orders: [],
  
 
  

};
const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3030/api";
// place order
export const palceOrderAction = createAsyncThunk(
    'order/createOrder',
    async({paymentMethod, address, pincode} = {},{getState})=>{

    const token = getState()?.Users?.loggedinUser?.token;
try{
    const data= await axios.post(`${BASE_URL}/order/create-order`,{paymentMethod, address, pincode},{headers:{
        Authorization:`Bearer ${token}`
        }})
    return data.data;
}catch(err){

    throw err.response?.data?.message || err.message;
    }}
    

)

    // fetch orders
export const fetchOrdersAction = createAsyncThunk(
    'order/fetchOrders',
    async(_, { getState })=>{

try{
     const token = getState().Users?.loggedinUser?.token;
    const data= await axios.get(`${BASE_URL}/order/get-orders-list`,{
        headers:{
            Authorization:`Bearer ${token}`
        }
    })
    return data.data;
}catch(err){

    throw err.response?.data?.message || err.message;
    }}
    

)
// fetch all seller orders
export const fetchSellerOrdersAction = createAsyncThunk(
    'order/fetchSellerOrders',
    async(_, { getState })=>{

        try{
            const token = getState().Users?.loggedinUser?.token;
            const data= await axios.get(`${BASE_URL}/order/get-seller-orders-list`,{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            })
            return data.data;
        }catch(err){

            throw err.response?.data?.message || err.message;
        }}


)
//cancel order
export const calcelOrdersAction = createAsyncThunk(
    'order/cancel',
    async({id}, { getState })=>{

        try{
            const token = getState().Users?.loggedinUser?.token;
            // axios.put(url, data, config) -> pass empty body and put headers in config
            const response = await axios.put(
                `${BASE_URL}/order/cancel-order/${id}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        }catch(err){

            throw err.response?.data?.message || err.message;
        }}


)
const orderReducer= createSlice({
    name:"productSlice",
    initialState,
   
extraReducers:(builder)=>{
    //fecth al products
    
builder.addCase(palceOrderAction.pending,(state)=>{
 state.success=false
state.loading=true
state.error=null

});

builder.addCase(palceOrderAction.fulfilled,(state,action)=>{
 state.success=true
state.loading=false
state.message=action.payload.message

state.error=null
 
})
builder.addCase(palceOrderAction.rejected,(state,action)=>{
 state.success=false
state.loading=false

state.error=action.payload || action.error?.message || "Register failed"

})
// get all orders

builder.addCase(fetchOrdersAction.pending,(state)=>{
 state.success=false
state.loading=true
state.error=null

});
builder.addCase(fetchOrdersAction.fulfilled,(state,action)=>{
 state.success=true
state.loading=false
state.message=action.payload.message

state.orders=action.payload.orders

state.error=null

})
builder.addCase(fetchOrdersAction.rejected,(state,action)=>{
 state.success=false
state.loading=false

state.error=action.payload || action.error?.message || "fetching failed"

})

// get all seller's orders

    builder.addCase(fetchSellerOrdersAction.pending,(state)=>{
        state.success=false
        state.loading=true
        state.error=null

    });
    builder.addCase(fetchSellerOrdersAction.fulfilled,(state,action)=>{
        state.success=true
        state.loading=false
        state.message=action.payload.message

        state.orders=action.payload.orders

        state.error=null

    })
    builder.addCase(fetchSellerOrdersAction.rejected,(state,action)=>{
        state.success=false
        state.loading=false

        state.error=action.payload || action.error?.message || "sellled order list fetch successfully"

    })

//order cancelation
     builder.addCase(calcelOrdersAction.pending,(state)=>{
        state.success=false
        state.loading=true
        state.error=null

    });
    builder.addCase(calcelOrdersAction.fulfilled,(state,action)=>{
        state.success=true
        state.loading=false
        state.message=action.payload.message

        state.order=action.payload.order

        state.error=null

    })
    builder.addCase(calcelOrdersAction.rejected,(state,action)=>{
        state.success=false
        state.loading=false

        state.error=action.payload || action.error?.message || "sellled order list fetch successfully"

    })
}
})
export default orderReducer.reducer;
