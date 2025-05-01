import {Message} from "../model/User";

export interface APIResponse {
    success: boolean;
    message: string;
    isAcceptingMessages?: boolean;
    messages?: Array<Message>;  
}