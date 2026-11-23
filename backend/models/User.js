const mongoose = require('mongoose');
const crypto = require('crypto');
const { userProfile } = require('../controllers/userController');
const userSchema = new mongoose.Schema({
	
	name: {
		type: String, required: true,
		
	}, email: {
		type: String, required: true,

	}, password: {
		type: String, required: true,
	}, avatar: {
		type: String,
		default: "https://www.bing.com/ck/a?!&&p=89927bf3530e952584db7672f3bf60b720e4637e3cee17943a9d9241f40fb610JmltdHM9MTc3NDY1NjAwMA&ptn=3&ver=2&hsh=4&fclid=20b29e04-3a19-6056-1162-892c3bb16131&u=a1L2ltYWdlcy9zZWFyY2g_cT1wcm9maWxlK2ltYWdlK2ljb24maWQ9MzgyRTk5REZDNDMyOEREM0Q2ODk5NDgyRkMxNzRBMkY1MzFERTgwRCZGT1JNPUlBQ0ZJUg&ntb=1"
	}
	,
	mobileNo:{
		type:String,
		default:null,
	},
	address:{
		type:String,
		default:null,
	}
	,pincode:{
		type:String


	},cart:
		{
			  type:mongoose.Schema.Types.ObjectId,
							ref:"Cart",
							default:null
		}
	
	,orders:[
		{
			  type:mongoose.Schema.Types.ObjectId,
							ref:"Order",
			default:null
		}
	],passwordResetToken:{
            type: String,
}    ,
passwordResetExprires:{type:Date},
	
},{
	timestamps:true,
	 toJSON:{
        virtual:true
     },
        toObject: {
        virtual: true,
        }
})
userSchema.methods.generatePasswordResetToken=function(){
    //generate token
    const resetToken= crypto.randomBytes(20).toString("hex");
    
    this.passwordResetToken=crypto.createHash('sha256').update(resetToken).digest('hex');
    
    //set the expiry time to 10 min
    this.passwordResetExprires=Date.now()+10*60*1000;
    
    return resetToken;
    
    
}
const User= mongoose.model("User",userSchema);
module.exports=User;
