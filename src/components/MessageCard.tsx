"use client"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Message } from "@/model/User"
import { APIUserAbortError } from "openai"
import axios from "axios"
import { APIResponse } from "@/types/APIResponse"
import { toast } from "sonner"

type MessageCardprops={
    message:Message, 
    onMessageDelete:(messageId:string)=> void 
}

const MessageCard = ({message,onMessageDelete}:MessageCardprops) => {

    const handleDeleteConfirm = async ()=>{
        const response = await axios.delete<APIResponse>(`api/delete-message/${message._id}`)
        toast(response.data.message)
        onMessageDelete(message._id as string)
    }   
    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>Card Title</CardTitle>
                    <AlertDialog>
                        <AlertDialogTrigger>Open</AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your account
                                    and remove your data from our servers.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                    <CardDescription>Card Description</CardDescription>
                </CardHeader>
                <CardContent>

                </CardContent>
                <CardFooter>

                </CardFooter>
            </Card>

        </div>
    )
}

export default MessageCard
