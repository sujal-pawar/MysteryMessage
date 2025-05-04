import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { getServerSession } from "next-auth";

export async function DELETE(_: Request, { params }: { params: { messageid: string } }) {

    const messageId = params.messageid;

    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: 'Not Authenticated'
        }, { status: 401 })
    }

    try {
        const updateResult = await UserModel.updateOne({ _id: session.user._id },
            {$pull:{messages:{_id:messageId}}}
        )
        if(updateResult.modifiedCount==0){
            return Response.json(
                {
                    success:false,
                    message:'Message not found or already deleted'
                },{status:404}
            )
        }

        return Response.json(
            {
                success:true,
                message:'Message deleted successfully'
            },{status:200}
        )
    } catch (error) {
        return Response.json(
            {
                success:false,
                message:'Error in delete message'
            },{status:500}
        )
    }
}