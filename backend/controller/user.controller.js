const User = require("../models/user.model");
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')

const register = async (req, res) => {
    try{
        const {fullname, email, password, phoneNumber, role} = req.body;
        if(!(fullname && email && password && phoneNumber && role)){
            return res.status(400).json({
                message: "Inaccurate fillings",
                success: false
            });
        }
        const user = await User.findOne({email});
        if(user){
            return res.status(400).json({
                message: "User already exists",
                success: false
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role
        })
        return res.status(201).json({
            message: "Account created successfully",
            success: true
        })
    }catch(error){
        console.log(err);
    }
}

const login = async (req, res) => {
    try {
        const {email, password, role} = req.body;
        if(!email || !password || !role){
            return res.status(400).json({
                message: "Fill up the missing fields",
                success: false
            })
        }
        let user = await User.findOne({email});
        if(!user){
            return res.status(400).json({
                message: "Incorrect email or password"
            })
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if(!passwordMatch){
            return res.status(400).json({
                message: "Incorrect email or password",
                success: false
            })
        }
        if(role !== user.role){
            return res.status(400).json({
                message: "Account doesnot exist with current role",
                success: false
            })
        }
        const tokenData = {
            userId: user._id
        }
        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, {expiresIn: '1d'});

        user = {
            _id: user.id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }
        
        return res.status(200).cookie("token", token, {maxAge: 1*24*60*60*1000, httpsOnly: true, sameSite: 'strict'}).json({
            message: `Welcome back ${user.fullname}`,
            user, //??
            success: true
        })
        
    }catch(err){
        console.log(err);
    }
}

