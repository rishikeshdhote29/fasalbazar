import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";

import axios from "axios";


const initialState = {
  success: false,
  error: null,
  loading: false,
    message: "",
  products: [],
    cart:{},
 product:{},
 pagination: {
   total: 0,
   page: 1,
   limit: 10,
   hasMore: true
 }
 

};
const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3030/api";
// fetch products
export const getAllProductsAction = createAsyncThunk(
    'product/getAllProducts',
    async({page,limit,sortBy})=>{

try{
    const data= await axios.get(`${BASE_URL}/product/getAllProducts?page=${page || 1}&limit=${limit || 10}&sortBy=${sortBy || "newest"}`)
    return data.data;
}catch(err){

    throw err.response?.data?.message || err.message;
    }}
    

)

// remove form cart
export const removeFromCartAction = createAsyncThunk(
'cart/remove-product',
async({id},{getState})=>{
    try{
     const token = getState().Users?.loggedinUser?.token;
    const data= await axios.put(`${BASE_URL}/cart/delete-form-cart/${id}`,{},{
        headers:{
            Authorization:`Bearer ${token}`
        }
    })
    return data.data;
}catch(err){

    throw err.response?.data?.message || err.message;
    }
    
}

)
    // fetch cart
export const fetchCartAction = createAsyncThunk(
    'cart/fetchCartAction',
    async(_, { getState })=>{

try{
     const token = getState().Users?.loggedinUser?.token;
    const data= await axios.get(`${BASE_URL}/cart/get-cart`,{
        headers:{
            Authorization:`Bearer ${token}`
        }
    })
    return data.data;
}catch(err){

    throw err.response?.data?.message || err.message;
    }}
    

)


export const listProductAction= createAsyncThunk("porduct/add-product",
    
    async ({formData,avatar},{getState,rejectWithValue} )=>{
    try {
        const token = getState().Users?.loggedinUser?.token;
        
        const payload = new FormData();
        Object.entries(formData || {}).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                payload.append(key, value);
            }
        });
        
        
        if (avatar) {
            payload.append("image", avatar);
        }
        console.log("form data pp", payload);
        const response = await axios.post(`${BASE_URL}/product/create`, payload, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return response.data;
    }
    catch(err){
       return rejectWithValue(err.response?.data?.message || err.message);
    }
    
    
}
    )

export const deleteListedProductAction= createAsyncThunk('/product/delete',
    async({id},{getState,rejectWithValue})=>{
    
    const token = getState().Users?.loggedinUser?.token;
        try{
            
            const response = await axios.delete(`${BASE_URL}/product/delete-product/${id}`,{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            })
            return response.data;
        }catch(error){
            return rejectWithValue(error?.response?.data?.message || error?.message || "some error occuerd");
        }
    
    
})

export const updateProductListingAction= createAsyncThunk("porduct/update-product",
    
    async ({id,formData,avatar},{getState,rejectWithValue} )=>{
    try {
        const token = getState().Users?.loggedinUser?.token;
        
        const payload = new FormData();
        Object.entries(formData || {}).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                payload.append(key, value);
            }
        });
        
        
        if (avatar) {
            payload.append("image", avatar);
        }
        console.log("form data pp", payload);
        const response = await axios.put(`${BASE_URL}/product/update/${id}`, payload, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return response.data;
    }
    catch(err){
       return rejectWithValue(err.response?.data?.message || err.message);
    }
    
    
}
    )



export const  fetchSellerListing= createAsyncThunk('seller/fetch-listing',
    async (_, {getState, rejectWithValue})=>{
     try {
        
        const token = getState().Users?.loggedinUser?.token;
        
        const response = await axios.get(`${BASE_URL}/product/seller/listing`,{
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
         return response.data;
     }catch(err){
     return rejectWithValue(err.response?.data?.message || err.message || "unable to fetch")
     }
    
    
    })
//fetch a product details
export const  fetchProductDetailsAction= createAsyncThunk('product/fetch-product',
    async ({id}, {getState, rejectWithValue})=>{
     try {
        
        const token = getState().Users?.loggedinUser?.token;
        
        const response = await axios.get(`${BASE_URL}/product/${id}`,{
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
         return response.data;
     }catch(err){
     return rejectWithValue(err.response?.data?.message || err.message || "unable to fetch")
     }
    
    
    })

//search query
export const searchProductsAction= createAsyncThunk('product/search',
    async ({query}, { rejectWithValue})=>{
     try {
        
        
        const response = await axios.get(`${BASE_URL}/product/search?q=${query}`)
         return response.data;
     }
catch (error)
{
return rejectWithValue(error.response?.data?.message || error.message || "unable to search")
}
    })
        
        
        const productSlice= createSlice({
    name:"productSlice",
    initialState,
    reducers:{
 successAction(state){
    state.success=false;
 },errorAction(state){
    state.error=null;
        }},
extraReducers:(builder)=>{
    //fecth all products
    
builder.addCase(getAllProductsAction.pending,(state)=>{
 state.success=false
state.loading=true
state.error=null

});

builder.addCase(getAllProductsAction.fulfilled,(state,action)=>{
 state.success=true
 state.loading=false
 state.message=action.payload.message
 const incomingProducts = Array.isArray(action.payload.products) ? action.payload.products : []
 const currentPage = action.meta?.arg?.page || 1
 state.products = currentPage > 1 ? [...state.products, ...incomingProducts] : incomingProducts
 state.pagination = action.payload.pagination || state.pagination
 
 state.error=null
 
 })
 builder.addCase(getAllProductsAction.rejected,(state,action)=>{
 state.success=false
state.loading=false

state.error=action.payload || action.error?.message || "Register failed"

})
// add to cart

builder.addCase(fetchCartAction.pending,(state)=>{
 state.success=false
state.loading=true
state.error=null

});
builder.addCase(fetchCartAction.fulfilled,(state,action)=>{
 state.success=true
state.loading=false
state.message=action.payload.message
state.cart=action.payload.cart || {}


state.error=null

})
builder.addCase(fetchCartAction.rejected,(state,action)=>{
 state.success=false
state.loading=false

state.error=action.payload || action.error?.message || "Register failed"

})
    
    builder.addCase(listProductAction.pending,(state)=>{
        state.success=false
state.loading=true
state.error=null
    
    
    })
    builder.addCase(listProductAction.fulfilled,(state,action)=>{
        console.log(action.payload)
        
        state.success=true
state.loading=false
state.error=null

        
        state.message=action.payload.message
        
        
    })
    builder.addCase(listProductAction.rejected,(state,action)=>{
        state.success=false
state.loading=false
state.error=action.payload || action.error?.message || "login failed"

    
    
    })
   
    builder.addCase(fetchSellerListing.pending,(state)=>{
        state.success=false
state.loading=true
state.error=null
    
    
    })
    builder.addCase(fetchSellerListing.fulfilled,(state,action)=>{
       
        console.log(action.payload)
        state.success=true
state.loading=false
state.error=null
state.products=action.payload.listings;
        
        state.message=action.payload.message
        
        
    })
    builder.addCase(fetchSellerListing.rejected,(state,action)=>{
        state.success=false
state.loading=false
state.error=action.payload || action.error?.message || "faild to fetch"

    
    
    })

    
    builder.addCase(updateProductListingAction.pending,(state)=>{
        state.success=false
state.loading=true
state.error=null
    
    
    })
    builder.addCase(updateProductListingAction.fulfilled,(state,action)=>{
        console.log(action.payload)
        
        state.success=true
state.loading=false
state.error=null

        
        state.message=action.payload.message
        
        
    })
    builder.addCase(updateProductListingAction.rejected,(state,action)=>{
        state.success=false
state.loading=false
state.error=action.payload || action.error?.message || "login failed"

    
    
    })
    builder.addCase(fetchProductDetailsAction.pending,(state)=>{
        state.success=false
state.loading=true
state.error=null
    
    
    })
    builder.addCase(fetchProductDetailsAction.fulfilled,(state,action)=>{
        console.log(action.payload)
        
        state.success=true
state.loading=false
state.error=null

        
        state.message=action.payload.message
        state.product=action.payload.product
        
    })
    builder.addCase(fetchProductDetailsAction.rejected,(state,action)=>{
        state.success=false
state.loading=false
state.error=action.payload || action.error?.message || "login failed"

    
    
    })
//deleting the porduct
    builder.addCase(deleteListedProductAction.pending,(state)=>{
        state.success=false
state.loading=true
state.error=null
    
    
    })
    builder.addCase(deleteListedProductAction.fulfilled,(state,action)=>{
        console.log(action.payload)
        
        state.success=true
state.loading=false
state.error=null

        
        state.message=action.payload.message
        
    })
    builder.addCase(deleteListedProductAction.rejected,(state,action)=>{
        state.success=false
state.loading=false
state.error=action.payload || action.error?.message || "deletion failed"

    
    
    })

    
    //search query
    
builder.addCase(searchProductsAction.pending,(state)=>{
 state.success=false
state.loading=true
state.error=null

});

builder.addCase(searchProductsAction.fulfilled,(state,action)=>{
 state.success=true
state.loading=false
state.message=action.payload.message
state.products=Array.isArray(action.payload.products) ? action.payload.products : []

state.error=null

})
builder.addCase(searchProductsAction.rejected,(state,action)=>{
 state.success=false
state.loading=false

state.error=action.payload || action.error?.message || "unable to fetch products"

})
}
})
 export default productSlice.reducer;
