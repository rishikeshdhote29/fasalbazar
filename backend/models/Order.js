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
        enum:["pending","transit","pending"]
    },
    orderDate:{
        type:Date,
        default:Date.now()
    },
    trakingId:{
        type:String,
        
    },amount:{
        type:Number,
        required:true,
    },
    products:{
         type:mongoose.Schema.Types.ObjectId,
         ref:"Products"
    },
     paymentMethod:{
         type: String,
         enum:["upi","card","netBanking"]
     }
     ,
     address:{
        
            street:String,
            city:String,
            state:String,
            postalCode:String,
            country:String

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