// server.js - 主文件
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt=  require('bcryptjs');
// 初始化 Express 应用
const app = express();

// ✅ 使用 bodyParser 中间件解析 JSON
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({
    origin: 'http://localhost:5000',  // ✅ 根据你的前端地址更改
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));


// 创建 Nodemailer 传输器
require('dotenv').config();
//连接MongoDB

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));




const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});

// 处理表单提交的 POST 请求
app.post('/send-email', (req, res) => {
    console.log('got requestd')
    const { fullname, email, phone, subject, message } = req.body;

    const mailOptions = {
        from: email,
        to: 'daibowen6111@gmail.com',  // ⚠️ 接收邮件的邮箱
        subject: subject || "New Contact Form Your Portfolio",
        text: `
        Name: ${fullname}
        Phone: ${phone}
        Email: ${email}
        Message: ${message}
        `
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            res.status(500).send('Failed to send email');
        } else {
            console.log('Email sent:', info.response);
            res.status(200).send('Email sent successfully!');
        }
    });
});

const User = require('./Models/User.js')
console.log(User);
//用户注册API 用来接收来自前端传递的用户数据，并储存到数据库
app.post('/register', async(req,res)=>{
    const{fullname,email,password}=req.body;

    try{
        //检查邮箱是否存在
        let user=await User.findOne({email});
        if(user){
            return res.status(400).json({msg:'Email already registered'})
        }
        //创建新用户
        user= new User ({fullname,email,password});
        await user.save();
        res.status(201).send('User registered successfully :)')
    } catch (error){
        console.error(error);
        res.status(500).send('Server error')
    }
})
//用户 loginAPI

app.post('/login',async(req,res)=>{
    const{email,password}=req.body;
    try{
        //检查用户是否存在
        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({msg: 'User not found'});
        }
        //验证密码
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(401).json({ msg:'Invalid credentials'});
        }

        //登陆成功
        res.status(200).json({msg:'Login successful', user:{fullname:user.fullname, email:user.email}})
    }catch(error){
        console.error(error);
        res.status(500).json({msg: 'Server error'})
    }

})
// 运行服务器
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
