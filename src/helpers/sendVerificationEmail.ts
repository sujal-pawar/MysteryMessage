import {resend} from "../lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { APIResponse } from "@/types/APIResponse";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string,
): Promise<APIResponse> {
        try {
            await resend.emails.send({
                from: 'Mystery Message <onboarding@resend.dev>',
                to: email,
                subject: 'Mystery Message verification code',
                react: VerificationEmail({username,otp:verifyCode}),
              });
            return {success:true,message:'Verification mail sent successfully'}
        }catch(emailError){
            console.error("Error sending verification email",emailError)
            return {success:false,message:'Failed to send verification mail'}
        }
    }