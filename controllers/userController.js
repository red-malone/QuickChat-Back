import User from "../models/User.js";
import bcrypt from "bcryptjs";
import  generateToken from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";
//Signup a new user
export const signupUser = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    //Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    //Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    //Create new user
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword
    });
    await newUser.save();
    console.log("usercontroller.js: User created successfully", newUser);
    const token = generateToken(newUser._id);
    return res.status(201).json({ message: "User created successfully" , token});
  } catch (error) {
    console.error("usercontroller.js: Error in signupUser:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const loginUser =async(req,res)=>{
  try{
      const {email,password}=req.body;
      //Check if user exists
      const user=await User.findOne({email});
      // if(!user){
      //     return res.status(400).json({message:"Invalid email or password"});
      // }
      //Check password
      const isMatch=await bcrypt.compare(password,user.password);
      if(!isMatch){
          return res.status(400).json({message:"Invalid email or password"});
      }
      const token=generateToken(user._id);
      return res.status(200).json({message:"Login successful",token});
  }catch(e){
    console.error("usercontroller.js: Error in loginUser:", e.message);
    return res.status(500).json({ message: "Server error" });
  }
}

//Check if user is authenticated
export const checkAuth=(req,res)=>{
    res.json({message:"User is authenticated", user:req.user});
}

//Controller to update user profile details
export const updateUserProfile=async(req,res)=>{
    try{
      const {profilePic,bio,fullName}=req.body
      const userId=req.user._id;
      let updatedUser;

      if(!profilePic){
        updatedUser= await User.findByIdAndUpdate(userId, { fullName, bio },{new:true});
      }
      else{
        const upload =await cloudinary.uploader.upload(profilePic)
        updatedUser= await User.findByIdAndUpdate(userId, {profilePic:upload.secure_url, fullName, bio },{new:true})
      }
      res.json({message:"Profile updated successfully",user:updatedUser});
    }catch(e){
        console.error("usercontroller.js: Error in updateUserProfile:", e.message);
        return res.status(500).json({ message: "Server error" });
    }
}