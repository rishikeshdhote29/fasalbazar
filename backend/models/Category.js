const mongoose = require('mongoose');
const CategorySchema = new mongoose.Schema({
	
	name: {
		type: String, required: true,
		
	}, Products:[ {
		type:mongoose.Schema.Types.ObjectId,
		ref:"Products"
		
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
const Category= mongoose.model("Category",CategorySchema);
module.exports=Category;