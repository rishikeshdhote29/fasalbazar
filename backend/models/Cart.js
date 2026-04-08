const mongoose = require('mongoose');
const cartSchema = new mongoose.Schema({
	
	buyer: {
		type:mongoose.Schema.Types.ObjectId,
		ref:"User",
		required:true
		
	}
	,products:[{
		product:{
			type:mongoose.Schema.Types.ObjectId,
			ref:"Product"},
		 quantity:{
			type: Number,
		default:1
	}
	
}]

},{
	timestamps:true,
	 toJSON:{
        virtual:true
     },
        toObject: {
        virtual: true,
        }
})
const Cart= mongoose.model("Cart",cartSchema);
module.exports=Cart;