const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.signup = async (req,res)=>{

try{

const {name,email,password} = req.body;

const hashedPassword = await bcrypt.hash(password,10);

const user = new User({
name,
email,
password:hashedPassword
});

await user.save();

res.json({message:"User created"});

}catch(error){

res.status(500).json(error.message);

}

};


exports.login = async (req,res)=>{

try{

const {email,password} = req.body;

const user = await User.findOne({email});

if(!user) return res.status(400).json("User not found");

const validPassword = await bcrypt.compare(password,user.password);

if(!validPassword) return res.status(400).json("Invalid password");

const token = jwt.sign(
{id:user._id},
"secret",
{expiresIn:"1d"}
);

res.json({token});

}catch(error){

res.status(500).json(error.message);

}

};