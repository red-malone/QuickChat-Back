import { truncates } from "bcryptjs";
import Message from "../models/Message.js";
import User from "../models/User.js";

//Get all users except the authenticated user

export const getUsers = async (req, res) => {
    try{
        const userId=req.user._id;
        const filteredUsers =await User.find(
            {
                _id:{$ne:userId}
            }
        ).select("-password")

        //count the number of messages not seen 
        const unseen={}
        const promises=filteredUsers.map(
            async(user)=>{
                const count =await Message.find({
                    senderId:user._id,
                    receiverId:userId,
                    seen:false
                })
                if(count.length>0){
                    unseen[user._id]=count.length
                }
            }
        )
        await Promise.all(promises);

        return res.status(200).json({success:true,message:"Users fetched successfully",users:filteredUsers,unseen});
    }catch(e){
        console.error("messageController.js: Error in getUsers:", e.message);
        return res.status(500).json({ message: "Server error" });
    }
}

//Get messages between authenticated user and another user
export const getMessages=async(req,res)=>{
    try{
        const userId=req.user._id;
        const otherUserId=req.params.userId;

        const messages=await Message.find(
            {
                $or:[
                    {senderId:userId,receiverId:otherUserId},
                    {senderId:otherUserId,receiverId:userId}
                ]
            }
        )
        await Message.updateMany(
            {
                senderId:otherUserId,
                receiverId:userId,
                seen:false
            },
            {
                seen:true
            }
        )
        return res.status(200).json({success:true,message:"Messages fetched successfully",messages});

    }catch(e){
        console.error("messageController.js: Error in getMessages:", e.message);
        return res.status(500).json({ message: "Server error" });
    }
}

//api to mark messages as seen using message id 

export const markMessageAsSeen=async(req,res)=>{
    try{
        const messageId=req.params.messageId;
        await Message.findByIdAndUpdate(messageId,{seen:true});
        return res.status(200).json({success:true,message:"Message marked as seen"});
    }catch(e){
        console.error("messageController.js: Error in markMessageAsSeen:", e.message);
        return res.status(500).json({ message: "Server error" });
    }
}