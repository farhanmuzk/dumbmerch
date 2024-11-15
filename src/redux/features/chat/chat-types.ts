import { UserProfile } from "../user/user-types";

export interface IMessage {
    id: number;
    senderId: number;
    roomId: number;
    content: string;
    createdAt: string;
}

export interface IRoom{
    id: number;
    users: UserProfile;
    createdAt: string;
    updatedAt: string;
    messages: IMessage[];
}
