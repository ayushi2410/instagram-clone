const mongoose=require('mongoose')
const User=mongoose.model("User")
const jwt=require('jsonwebtoken')
const {JWT_SECRET} =require('../keys')

module.exports=(req,res,next)=>{
const {authorization}=req.headers
//authorization will look like bearer ckbffofjf
if(!authorization){
	res.status(422).json({error:"you must be logged in"})
}
const token=authorization.replace("bearer ","")

jwt.verify(token,JWT_SECRET,(err,payload)=>{
	if(err){
		return res.status(401).json({error:"you must be logged in"})
	}
	//genetrated at time of login
	const {_id}=payload
	User.findById(_id).then(userdata=>{
		req.user=userdata
		next()
	})
	
})
}