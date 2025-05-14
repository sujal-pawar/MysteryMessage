import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { getServerSession } from "next-auth";

export async function DELETE(_: Request, { params }: { params: { messageid: string } }) {
    await dbConnect();
    const messageId = params.messageid;

    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: 'Not Authenticated'
        }, { status: 401 })
    }

    // Find user by email instead of ID
    const userEmail = session.user.email;
    if (!userEmail) {
        return Response.json({
            success: false,
            message: 'User email not found in session'
        }, { status: 401 });
    }

    try {
        // First find the user by email
        const user = await UserModel.findOne({ email: userEmail });
        if (!user) {
            return Response.json({
                success: false,
                message: 'User not found in database'
            }, { status: 404 });
        }

        const updateResult = await UserModel.updateOne(
            { _id: user._id },
            { $pull: { messages: { _id: messageId } } }
        );
        
        if(updateResult.modifiedCount == 0) {
            return Response.json(
                {
                    success: false,
                    message: 'Message not found or already deleted'
                }, { status: 404 }
            )
        }

        return Response.json(
            {
                success: true,
                message: 'Message deleted successfully'
            }, { status: 200 }
        )
    } catch (error) {
        return Response.json(
            {
                success: false,
                message: 'Error in delete message'
            }, { status: 500 }
        )
    }
}