import { getSession } from "next-auth/react";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {getServerSession, User} from "next-auth";
import mongoose, { Mongoose } from "mongoose";

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

    const userId = new mongoose.Types.ObjectId(user._id);
    try{
        const user = await UserModel.aggregate([
            { $match:{_id:userId} },
            { $unwind:'$messages'},
            { $sort:{'$messages.createdAt':-1}},
            {$group:{_id:'$_id',messages:{$push:'$messages'}}}
        ])

        if(!user || user.length === 0){
            return Response.json({
                success:false,
                message:'User not found'
            },{status : 404})
        }


        return Response.json({
            success:true,
            message:user[0].message
        },{status : 200})

    }catch(error){
        console.log("An unexpected error occured",error)
        return Response.json({
            success:false,
            message:'User not found'                
        },{status:500})
    }


}