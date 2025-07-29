import User from '../models/user.js';
import jwt from 'jsonwebtoken';

const generateToken = (userID) => {
    return jwt.sign({id: userID}, process.env.JWT_SECRET, {expiresIn: '30d'});
};


// Signup User
export const registerUser = async (req, res) => {
    
    try{
        const {name, email, password} = req.body;
        console.log(req.body);
        const userExists = await User.findOne({email});
        if(userExists){
            return res.status(400).json({message: 'User already exists'});
        }
        const user = await User.create({name, email, password});
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        });
    }catch(error){
        res.status(500).json({message: 'Error registering user'});
    }
};

// Login User
export const loginUser = async (req, res) => {
    const {email, password} = req.body;
    try{
        const user = await User.findOne({email});
        if(!user || !(await user.matchPassword(password))){
            return res.status(401).json({message: 'Invalid email or password'});
        }
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        });
    }catch (error) {
        console.error("Register error:", error);  // ADD THIS
        res.status(500).json({ message: 'Error registering user' });
    }
};

// // Get User Profile
// export const getUserProfile = async (req, res) => {
//     try{
//         const user = await User.findById(req.user._id).select('-password');
//         res.status(200).json(user);
//     }catch(error){
//         res.status(500).json({message: 'Error getting user profile'});
//     }
// };

// // Update User Profile
// export const updateUserProfile = async (req, res) => {
//     const {name, email, password} = req.body;
// }
