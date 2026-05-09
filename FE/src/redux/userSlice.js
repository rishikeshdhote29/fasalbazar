import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";

import axios from "axios";

const storedUser = (() => {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
})();
console.log("stored user",storedUser);
const initialState = {
  success: false,
  error: null,
  loading: false,
  userType:"",

  loggedinUser: storedUser || null,
    user:{},
  message:"",
    isLoggedIn: !!storedUser,
  products: {}
};
const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3030/api";
// user registeration
export const registerAction = createAsyncThunk(
    'user/register',
    async({name, email, password})=>{

try{
    const data= await axios.post(`${BASE_URL}/auth/register`,
        {
            name,email,password
        }
    )
    return data;
}catch(err){

    throw err.response?.data?.message || err.message;
    }}

)

// seller registeration

export const sellerRegisterAction = createAsyncThunk(
    'seller/register',
    async({name, email, password})=>{

try{
    const data= await axios.post(`${BASE_URL}/seller/auth/register`,
        {
            name,email,password
        }
    )
    return data;
}catch(err){

    throw err.response?.data?.message || err.message;
    }}

)
// user login
export const loginAction = createAsyncThunk(
    'user/login',
    async({name, email, password})=>{

try{
    const data= await axios.post(`${BASE_URL}/auth/login`,
        {
            email,password
            
        }
    )
    return data;
}catch(err){

    throw err.response?.data?.message || err.message;
    }}

)

// seller registeration

export const sellerLoginAction = createAsyncThunk(
    'seller/login',
    async({name, email, password})=>{

try{
    const data= await axios.post(`${BASE_URL}/seller/auth/login`,
        {
           email,password
        }
    )
    return data;
}catch(err){

    throw err.response?.data?.message || err.message;
    }}

)

//fetch profile 
export const fetchUserAction= createAsyncThunk(
    'user/fetch-profile',
    async (_, {getState})=>{
          try {
              const token = getState().Users?.loggedinUser?.token;
             const data= await axios.get(`${BASE_URL}/auth/profile`, {
                headers:{
                    Authorization: `Bearer ${token}`
                }
            })
            return data.data;
            
        }catch(err){
               throw err.response?.data?.message || err.message;
        }
        
    }
)
//fetch profile
export const fetchSellerAction= createAsyncThunk(
    'user/fetch-seller-profile',
    async (_, {getState})=>{
          try {
              const token = getState().Users?.loggedinUser?.token;
             const data= await axios.get(`${BASE_URL}/seller/auth/profile`, {
                headers:{
                    Authorization: `Bearer ${token}`
                }
            })
            return data.data;
            
        }catch(err){
               throw err.response?.data?.message || err.message;
        }
        
    }
)
// update profile


export const updateProfileAction= createAsyncThunk(
    'user/updateProfile',
  async ({ formData, avatar }, { getState, rejectWithValue }) => {
        try {
            console.log("getstate",getState());
              const token = getState()?.Users?.loggedinUser?.token;
              
            const payload = new FormData();
            Object.entries(formData || {}).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    payload.append(key, value);
                }
            });
            if (avatar) {
                payload.append("image", avatar);
            }
            const data= await axios.put(`${BASE_URL}/auth/update-profile`, payload,
                {
                    headers:{
                        Authorization: `Bearer ${token}`
                    }
                }
                
                )
            return data.data;
            
        }catch(err){
               return rejectWithValue(err.response?.data?.message || err.message);
        }
        
    }
    
)
// update seller profile


export const updateSellerProfileAction= createAsyncThunk(
    'user/updateSellerProfile',
  async  ({formData,avatar},{getState})=>{
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
            const data= await axios.put(`${BASE_URL}/seller/auth/update-seller-profile`, payload,
                {
                    headers:{
                        Authorization: `Bearer ${token}`
                    }
                }
                
                )
            return data.data;
            
        }catch(err){
               throw err.response?.data?.message || err.message;
        }
        
    }
    
)

//forget password request action
export const forgetPasswordAction = createAsyncThunk(
    'user/forget-password',
    async({email})=>{
        try{
            const data= await axios.post(`${BASE_URL}/auth/forget-password`, {email})
            return data.data;
        }
        catch(err){
            throw err.response?.data?.message || err.message;
        }
    })
//reset password request action
export const resetPasswordAction = createAsyncThunk(
    'user/reset-password',
    async({password,token})=>{
        try{
            const data= await axios.put(`${BASE_URL}/auth/reset-password/${token}`,{password})
            return data.data;
        }
        catch(err){
            throw err.response?.data?.message || err.message;
        }
    })

// seller forget password request action
export const forgetSellerPasswordAction = createAsyncThunk(
    'seller/forget-password',
    async({email})=>{
        try{
            const data= await axios.post(`${BASE_URL}/seller/auth/forget-password`, {email})
            return data.data;
        }
        catch(err){
            throw err.response?.data?.message || err.message;
        }
    })
//seller reset password request action
export const resetSellerPasswordAction = createAsyncThunk(
    'seller/reset-password',
    async({password,token})=>{
        try{
            const data= await axios.put(`${BASE_URL}/seller/auth/reset-password/${token}`,{password})
            return data.data;
        }
        catch(err){
            throw err.response?.data?.message || err.message;
        }
    })
const userSlices= createSlice({
    name:"userSlice",
    initialState,
    reducers:{
 successAction(state){
    state.success=false;
 },errorAction(state){
    state.error=null;
        },logoutAction(state){
    localStorage.removeItem("user");
    state.error=null
     state.success= false
  state.error= null
  state.loading=false
  state.user=  null
  state.message=""
    state.isLoggedIn= false
  state.products={}
        }
    },
extraReducers:(builder)=>{
    //register user slices
builder.addCase(registerAction.pending,(state)=>{
 state.success=false
state.loading=true
state.error=null

});
builder.addCase(registerAction.fulfilled,(state,action)=>{
 state.success=true
state.loading=false
state.message=action.payload.message

state.error=null
 
})
builder.addCase(registerAction.rejected,(state,action)=>{
 state.success=false
state.loading=false

state.error=action.payload || action.error?.message || "Register failed"

})
  //seller user slices
builder.addCase(sellerRegisterAction.pending,(state)=>{
 state.success=false
state.loading=true
state.error=null

});
builder.addCase(sellerRegisterAction.fulfilled,(state,action)=>{
 state.success=true
state.loading=false
state.message=action.payload.message

state.error=null
 
})
builder.addCase(sellerRegisterAction.rejected,(state,action)=>{
 state.success=false
state.loading=false

state.error=action.payload || action.error?.message || "Register failed"

})
//loginuser slices
builder.addCase(loginAction.pending,(state)=>{
 state.success=false
state.loading=true
state.error=null

});
builder.addCase(loginAction.fulfilled,(state,action)=>{
 state.success=true
state.loading=false
state.message=action.payload.data.message
state.loggedinUser=action.payload.data.user
state.user=action.payload.data.user

state.userType="user";
localStorage.setItem("user", JSON.stringify(action.payload.data.user));
state.error=null
    state.isLoggedIn=true

})
builder.addCase(loginAction.rejected,(state,action)=>{
 state.success=false
state.loading=false

state.error=action.payload || action.error?.message || "login failed"

})
    
    //fetch profile
    builder.addCase(fetchUserAction.pending,(state)=>{
 state.success=false
state.loading=true
state.error=null

});
builder.addCase(fetchUserAction.fulfilled,(state,action)=>{
 state.success=true
state.loading=false
state.message=action.payload.message
state.user=action.payload.user
state.success=false
state.error=null
    state.isLoggedIn=true

})
builder.addCase(fetchUserAction.rejected,(state,action)=>{
 state.success=false
state.loading=false

state.error=action.payload || action.error?.message || "profile fetch failed"

})
    
      //fetch seller profile
    builder.addCase(fetchSellerAction.pending,(state)=>{
 state.success=false
state.loading=true
state.error=null

});
builder.addCase(fetchSellerAction.fulfilled,(state,action)=>{
 state.success=true
state.loading=false
state.message=action.payload.message
    console.log("seller profile",action.payload)
state.user=action.payload.seller
    state.userType="seller";
state.error=null
    state.isLoggedIn=true

})
builder.addCase(fetchSellerAction.rejected,(state,action)=>{
 state.success=false
state.loading=false

state.error=action.payload || action.error?.message || "profile fetch failed"

})
    
  //seller user slices login
builder.addCase(sellerLoginAction.pending,(state)=>{
 state.success=false
state.loading=true
state.error=null

});
builder.addCase(sellerLoginAction.fulfilled,(state,action)=>{
 state.success=true
state.loading=false
state.message=action.payload.data.message
state.loggedinUser=action.payload.data.user
state.user=action.payload.data.user

state.userType="seller";
localStorage.setItem("user", JSON.stringify(action.payload.data.user));
state.error=null
    state.isLoggedIn=true
    

})
builder.addCase(sellerLoginAction.rejected,(state,action)=>{
 state.success=false
state.loading=false

state.error=action.payload || action.error?.message || "login failed"

})


//update userPrfoile
builder.addCase(updateProfileAction.pending,(state)=>{
 state.success=false
state.loading=true
state.error=null

});
builder.addCase(updateProfileAction.fulfilled,(state,action)=>{
 state.success=true
state.loading=false
state.message=action.payload.message
const updatedUser = action.payload.newUser || action.payload.user;
if (updatedUser) {
  state.user = {
    ...state.user,
    ...updatedUser,
    token: state.user?.token,
  };
}




state.error=null


    

})
builder.addCase(updateProfileAction.rejected,(state,action)=>{
 state.success=false
state.loading=false

state.error=action.payload || action.error?.message || "profile updation failed"

})

    //update  sellerPrfoile
builder.addCase(updateSellerProfileAction.pending,(state)=>{
 state.success=false
state.loading=true
state.error=null

});
builder.addCase(updateSellerProfileAction.fulfilled,(state,action)=>{
 state.success=true
state.loading=false
state.message=action.payload.message
  state.user=action.payload.user
// const updatedUser = action.payload.newUser || action.payload.user;
// if (updatedUser) {
//   state.user = {
//     ...state.user,
//     ...updatedUser,
//     token: state.user?.token,
//   };?





state.error=null




})
builder.addCase(updateSellerProfileAction.rejected,(state,action)=>{
 state.success=false
state.loading=false

state.error=action.payload || action.error?.message || "profileupdate failed"

})
    // forget password
    builder.addCase(forgetPasswordAction.pending,(state,action)=>{
    state.success=false
state.loading=true
state.error=null
    
    })
     builder.addCase(forgetPasswordAction.fulfilled,(state,action)=>{
    state.success=true;
state.loading=false
         state.message= action.payload.message
state.error=null
    
    })

 builder.addCase(forgetPasswordAction.rejected,(state,action)=>{
    state.success=false
state.loading=false
state.error=action.payload || action.error?.message || "password reset failed"
    
    })
    // forget password
    builder.addCase(resetPasswordAction.pending,(state,action)=>{
    state.success=false
state.loading=true
state.error=null
    
    })
     builder.addCase(resetPasswordAction.fulfilled,(state,action)=>{
    state.success=true
state.loading=false
         state.message= action.payload.message
state.error=null
    
    })

 builder.addCase(resetPasswordAction.rejected,(state,action)=>{
    state.success=false
state.loading=false
state.error=action.payload || action.error?.message || "password reset failed"
    
    })


// seller forget password
    builder.addCase(forgetSellerPasswordAction.pending,(state,action)=>{
    state.success=false
state.loading=true
state.error=null
    
    })
     builder.addCase(forgetSellerPasswordAction.fulfilled,(state,action)=>{
    state.success=true;
state.loading=false
         state.message= action.payload.message
state.error=null
    
    })

 builder.addCase(forgetSellerPasswordAction.rejected,(state,action)=>{
    state.success=false
state.loading=false
state.error=action.payload || action.error?.message || "password reset failed"
    
    })
    // seller  forget password
    builder.addCase(resetSellerPasswordAction.pending,(state,action)=>{
    state.success=false
state.loading=true
state.error=null
    
    })
     builder.addCase(resetSellerPasswordAction.fulfilled,(state,action)=>{
    state.success=true
state.loading=false
         state.message= action.payload.message
state.error=null
    
    })

 builder.addCase(resetSellerPasswordAction.rejected,(state,action)=>{
    state.success=false
state.loading=false
state.error=action.payload || action.error?.message || "password reset failed"
    
    })


}
})
export const { successAction,errorAction,logoutAction } = userSlices.actions
export default userSlices.reducer;
