import { getSession } from "next-auth/react";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {getServerSession, User} from "next-auth";
import mongoose from "mongoose";

export async function GET(request:Request){
    await dbConnect()
    const session = await getServerSession(authOptions)
    const user: User = session?.user as User

    if(!session || !session.user){
        return Response.json({
            success:false,
            message:'Not Authenticated'
        },{status:401})
    }

    console.log("User from session:", user._id);
    
    try{
        const userId = new mongoose.Types.ObjectId(user._id);
        console.log("Looking for messages for user ID:", userId.toString());
        
        // First check if the user exists at all
        const userExists = await UserModel.findById(userId);
        if (!userExists) {
            console.log("User not found in database:", userId);
            return Response.json({
                success: false,
                message: 'User not found in database'
            }, { status: 404 });
        }
        
        console.log("User found, checking for messages. Has messages:", userExists.messages?.length || 0);
        
        // If user has no messages, return an empty array instead of 404
        if (!userExists.messages || userExists.messages.length === 0) {
            console.log("User has no messages");
            return Response.json({
                success: true,
                messages: []
            }, { status: 200 });
        }
        
        // If user has messages, proceed with aggregation
        const result = await UserModel.aggregate([
            { $match: { _id: userId } },
            { $unwind: '$messages' },
            { $sort: { 'messages.createdAt': -1 } },
            { $group: { _id: '$_id', messages: { $push: '$messages' } } }
        ]);
        
        console.log("Aggregation result length:", result?.length || 0);
        
        if(!result || result.length === 0){
            console.log("Aggregation returned no results");
            return Response.json({
                success: true,
                messages: []
            }, { status: 200 });
        }

        console.log("Returning messages count:", result[0].messages?.length || 0);
        
        return Response.json({
            success: true,
            messages: result[0].messages || []
        }, { status: 200 });

    } catch(error){
        console.error("Error retrieving messages:", error);
        return Response.json({
            success: false,
            message: 'Error retrieving messages',
            error: error instanceof Error ? error.message : 'Unknown error'               
        }, { status: 500 });
    }
}