import { Endpoint, Method } from "malakbel";
import { ChatRoom, ChatRoomsResponse, type ChatRoomDTO } from "../models/ChatModels";
import { BaseService } from './BaseService';

export class ChatService extends BaseService {

    async createChatRoom(dto: ChatRoomDTO): Promise<string | null> {
        const headers = await this.getAuthHeaders();

        const endpoint =  new Endpoint('/v1/chats');
        const data = JSON.stringify(dto.encode());

        try {
            const [status, _headers, body] = await this.http.request(Method.POST, endpoint, data, headers);
            if (status === 201) {
                if (body) {
                    const resp = body as { [key: string]: any }
                    return resp['id'];
                } else {
                    console.error(`Failed to create chat room. Status Code (${status})`);
                    return null;
                }
            } else {
                console.error(`Failed to create chat room. Status Code (${status})`);
                return null;
            }
        } catch (error) {
            console.error(`Failed to create chat room: ${error}`);
            return null;
        }
    }

    async getChatRooms(groupID: string): Promise<ChatRoom[]> {
        const headers = await this.getAuthHeaders();

        const endpoint =  new Endpoint(`/v1/chats/group/${groupID}`);

        try {
            const [status, _headers, body] = await this.http.request(Method.GET, endpoint, undefined, headers);
            if (status === 200) {
                if (body) {
                    const data = body as { [key: string]: any }
                    const resp = ChatRoomsResponse.decode(data);
                    return resp.rooms;

                } else {
                    console.error('No body found in request!');
                    return [];
                }
            } else if (status === 204) {
                console.debug(`Empty Response. No Chat Rooms found for group: ${groupID}`);
                return [];
            } else {
                console.error(`Failed to get chat rooms. Status Code (${status})`);
                return [];
            }
        } catch (error) {
            console.error(`Failed to get chat rooms: ${error}`);
            return [];
        }
    }

    async getChatRoom(id: string): Promise<ChatRoom | null> {
        const headers = await this.getAuthHeaders();

        const endpoint =  new Endpoint(`/v1/chats/${id}`);

        try {
            const [status, _headers, body] = await this.http.request(Method.GET, endpoint, undefined, headers);
            if (status === 200) {
                if (body) {
                    const data = body as { [key: string]: any }
                    return ChatRoom.decode(data);

                } else {
                    console.error('No body found in request!');
                    return null;
                }
            } else {
                console.error(`Failed to get chat room. Status Code (${status})`);
                return null;
            }
        } catch (error) {
            console.error(`Failed to get chat room: ${error}`);
            return null;
        }
    }

    async modifyChatRoom(id: string, dto: ChatRoomDTO): Promise<boolean> {
        const headers = await this.getAuthHeaders();

        const endpoint =  new Endpoint(`/v1/chats/${id}`);
        const data = JSON.stringify(dto.encode());

        try {
            const [status, _headers, body] = await this.http.request(Method.PUT, endpoint, data, headers);
            if (status === 200) {
                return true;
            } else {
                console.error(`Failed to update chat. Status Code (${status})`);
                return false;
            }
        } catch (error) {
            console.error(`Failed to update chat room: ${error}`);
            return false;
        }
    }

    async deleteChatRoom(id: string): Promise<boolean> {
        const headers = await this.getAuthHeaders();

        const endpoint =  new Endpoint(`/v1/chats/${id}`);

        try {
            const [status, _headers, body] = await this.http.request(Method.GET, endpoint, undefined, headers);
            if (status === 200) {
                return true;
            } else {
                console.error(`Failed to delete chat room. Status Code (${status})`);
                return false;
            }
        } catch (error) {
            console.error(`Failed to delete chat room: ${error}`);
            return false;
        }
    }

    async joinChatRoom(id: string): Promise<boolean> {
        const headers = await this.getAuthHeaders();

        const endpoint =  new Endpoint(`/v1/chats/${id}/join`);

        try {
            const [status, _headers, body] = await this.http.request(Method.POST, endpoint, undefined, headers);
            if (status === 201) {
                return true;
            } else {
                console.error(`Failed to join chat room. Status Code (${status})`);
                return false;
            }
        } catch (error) {
            console.error(`Failed to join chat room: ${error}`);
            return false;
        }
    }

    async leaveChatRoom(id: string): Promise<boolean> {
        const headers = await this.getAuthHeaders();

        const endpoint =  new Endpoint(`/v1/chats/${id}/leave`);

        try {
            const [status, _headers, body] = await this.http.request(Method.DELETE, endpoint, undefined, headers);
            if (status === 201) {
                return true;
            } else {
                console.error(`Failed to leave chat room. Status Code (${status})`);
                return false;
            }
        } catch (error) {
            console.error(`Failed to leave chat room: ${error}`);
            return false;
        }
    }
}
