const mongoose = require('mongoose');
const orderSchema= new mongoose.Schema({

    orderId:{
        type:String,
        required:true
    },
    buyer:{
          type:mongoose.Schema.Types.ObjectId,
         ref:"User"
    },
    seller:{
          type:mongoose.Schema.Types.ObjectId,
         ref:"Seller"
    },
    status:{
        type:String,
        // kept enum values aligned with frontend TrackOrder steps
        enum:["order placed","processing","shipped","out for delivery","delivered","cancelled"],
        default:"order placed"
    },
    orderDate:{
        type:Date,
        default:Date.now
    },quantity:{
        type:Number,
    },
    trackingId:{
        type:String,
        
    },amount:{
        type:Number,
        required:true,},
    
    product:{
         type:mongoose.Schema.Types.ObjectId,
         ref:"Product"
    }
    ,
         
     paymentMethod:{
     
         enum:["upi","card","netBanking"],
        type:String,
        required:true
     },
     pincode:{
        type:String,
        required:true
     }
        ,address:{
            type:String,
            
        
     }   



},{
    timestamps:true,
     toJSON:{
        virtual:true
     },
        toObject: {
        virtual: true,
        }
})
const Order= mongoose.model("Order",orderSchema);
module.exports=Order;