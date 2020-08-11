const express=require('express');
const app=express();
const mongoose=require('mongoose')
const {MONGOURI}=require('./keys')
const PORT=5000;
//F7bVzZXfMUULMHHr
require('./models/user')
require('./models/post')
app.use(express.json())
app.use(require('./routes/auth'))
app.use(require('./routes/post'))
mongoose.connect(MONGOURI, { useNewUrlParser: true , useUnifiedTopology: true })
mongoose.connection.on('connected',()=> 
{
	console.log('connected to mongo db')
})
mongoose.connection.on('error',(err)=>
{
	console.log('error',err)
})

app.listen(PORT,()=>{
	console.log('runnning')
})