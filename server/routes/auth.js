const express=require('express')
const router=express.Router();
const mongoose=require('mongoose')
const User=mongoose.model("User")
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const {JWT_SECRET}=require('../keys')
const requireLogin=require('../middleware/requireLogin')

router.get('/protected',requireLogin,(req,res)=>{
	res.send("hello user")
})
router.post('/signup',(req,res)=>{
	const {name,email,password}=req.body;
	if(!email||!name||!password){
		return res.status(422).json({error:"add details"})
        }
    User.findOne({email:email})
  .then((saveUser)=>{
	if(saveUser){
		return res.status(422).json({error:"user already exists"})
	}
	bcrypt.hash(password,12)
	.then(hashedpassword=>{
		const user=new User({
		email,
		name,
		password:hashedpassword
	})
	user.save()
	.then(user=>{
		res.json({message:"user successfully registered"})
	}).catch(err=>{
		console.log(err)
	})
	})
	
   }).catch(err=>{console.log(err)})
   })

/////////////signin///////////////
router.post('/signin',(req,res)=>{
	const {email,password}=req.body;
	if(!email||!password)
	{
		return res.status(422).json({error:"email or password empty"})
	}

	User.findOne({email:email})
	.then((savedUser)=>{
		
		if(!savedUser)
			{
				return res.status(422).json({error:"Invalid email or password"})
			}
			bcrypt.compare(password,savedUser.password)
			.then(doMatch=>{
				if(doMatch)
					{
						//res.json({message:"successfully logged in"})
						const token=jwt.sign({_id:savedUser.id},JWT_SECRET);
						const {_id,email,password}=savedUser
						res.json({token,user:{_id,email,password}})
					}else{
						return res.status(422).json({error:"invalid email or password"})
					}
			}).catch(err=>{console.log(err)})
	})
})


  module.exports=router