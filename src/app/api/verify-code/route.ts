import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {z} from 'zod'
import { userNameValidation } from "@/schemas/signupSchema";

export async function POST(request:Request){
    try{
        const {username,code}= await request.json()

        const decodedUsername = decodeURIComponent(username)
        const user = await UserModel.findOne({username:decodedUsername})


        if(!user){
            return Response.json({
                success:false,
                message:'User not found'
            },{status:404})
        }

        const isCodeValid = user.verifyCode === code
        const isCodeNotExpired = new Date(user.verifyCodeExpired)>new Date

        if(isCodeValid && isCodeNotExpired){
            user.isVerified==true,
            await user.save() 

            return Response.json({
                success:true,
                message:'User verified successfully'
            },{status:200})
        }else if (isCodeNotExpired){
            return Response.json({
                success:false,
                message:'User has expired , please sign in again'
            },{status:401})
        }else{
            return Response.json({
                success:false,
                message:'Incorrect verification code'
            },{status:401})
        }

    }catch(error){
        console.error(" Error in verifying username ",error)
        return Response.json({
            success:false,
            message:'Error in verifying user-name'
        },{status:500})
    }
}