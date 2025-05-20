const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

exports.signup = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success:false,
        message: 'Please provide username, email and password'
      });
    }
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success:false,
        message: 'Email already taken'
      });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role: role || 'user'
    });
    
    res.status(201).json({
      success:true,
      message: 'User created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success:false,
      message: 'Server error',
      error
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({
        success:false,
        message: 'Please provide email and password'
      });
    }
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({
      success:false,
      message: 'User does not exist !'
    });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({
      success:false,
      message: 'Wrong password entered'
    });


    const token = jwt.sign({ userId: user._id,email:user.email,role:user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    user.password = undefined;

    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), 
      httpOnly: true, 
    };

    res.cookie("token", token, options).status(201).json({
      user: user,
      token: token,
      message: 'User logged in successfully',
      success:true,
    });
  } catch (error) {
    res.status(500).json({
      success:false,
      message: 'Server error',
      error
    });
  }
};
