import { Codable } from "./Models";

class ChatGroup extends Codable<ChatGroup> {
    id: string;
    type: string;

    constructor(
        id: string,
        type: string
    ) {
        super();
        this.id = id;
        this.type = type;
    }

    static override decode(data: { [key: string]: any}): ChatGroup {
        if (!data) {
            throw new Error('Data cannot be null or undefined');
        }

        const id = data['id'];
        const type = data['type'];

        return new ChatGroup(
            id,
            type
        )
    }
}

class ChatRoom extends Codable<ChatRoom> {
    id: string;
    group: ChatGroup;
    name: string;
    type: string;
    members: ChatMember[];
    history: ChatMessage[];

    constructor(
        id: string,
        group: ChatGroup,
        name: string,
        type: string,
        members: ChatMember[],
        history: ChatMessage[]
    ){
        super();
        this.id = id;
        this.group = group;
        this.name = name;
        this.type = type;
        this.members = members;
        this.history = history;
    }

    static override decode(data: { [key: string]: any }): ChatRoom {
        if (!data) {
            throw new Error('Data cannot be null or undefined');
        }

        const id = data['id'];
        const group = ChatGroup.decode(data['group']);
        const name = data['name'];
        const type = data['type'];
        const members = data['members']?.map((m: any) => ChatMember.decode(m)) || [];
        const history = data['history']?.map((m: any) => ChatMessage.decode(m)) || [];

        return new ChatRoom(
            id,
            group,
            name,
            type,
            members,
            history
        );
    }
}

class ChatRoomDTO extends Codable<ChatRoomDTO> {
    name: string | undefined;
    type: string | undefined;

    constructor(
        name: string | undefined,
        type: string | undefined,
    ){
        super();
        this.name = name;
        this.type = type;
    }

    override encode(): { [key: string]: any } {
        const data: { [key: string]: any } = {};
        
        if (this.name) {
            data['name'] = this.name;
        }
        if (this.type) {
            data['type'] = this.type;
        }
    
        return data;
    };
}

class ChatRoomsResponse extends Codable<ChatRoomsResponse> {
    totalRooms: number;
    rooms: ChatRoom[];

    constructor(
        totalRooms: number,
        rooms: ChatRoom[]
    ){
        super();
        this.totalRooms = totalRooms;
        this.rooms = rooms;
    }

    static override decode(data: { [key: string]: any }): ChatRoomsResponse {
        if (!data) {
            throw new Error('Data cannot be null or undefined');
        }

        const totalRooms = data['total_rooms'];
        const rooms = data['rooms']?.map((r: any) => ChatRoom.decode(r)) || [];

        return new ChatRoomsResponse(
            totalRooms,
            rooms
        );
    }
}

class ChatMember extends Codable<ChatMember> {
    id: string;
    uuid: string;
    status: string;
    joinedAt: number;

    constructor(
        id: string,
        uuid: string,
        status: string,
        joinedAt: number
    ){
        super();
        this.id = id;
        this.uuid = uuid;
        this.status = status;
        this.joinedAt = joinedAt;
    }

    static override decode(data: { [key: string]: any }): ChatMember {
        if (!data) {
            throw new Error('Data cannot be null or undefined');
        }

        const id = data['id'];
        const uuid = data['uuid'];
        const status = data['status'];
        const joinedAt = data['joined_at'];

        return new ChatMember(
            id,
            uuid,
            status,
            joinedAt
        );
    }
}

class ChatMessage extends Codable<ChatMessage> {
    id: string;
    sender: string;
    type: string;
    body: string;
    timestamp: number;

    constructor(
        id: string,
        sender: string,
        type: string,
        body: string,
        timestamp: number
    ){
        super();
        this.id = id;
        this.sender = sender;
        this.type = type;
        this.body = body;
        this.timestamp = timestamp;
    }

    static override decode(data: { [key: string]: any }): ChatMessage {
        if (!data) {
            throw new Error('Data cannot be null or undefined');
        }

        const id = data['id'];
        const sender = data['sender'];
        const type = data['type'];
        const body = data['body'];
        const timestamp = data['timestamp'];

        return new ChatMessage(
            id,
            sender,
            type,
            body,
            timestamp
        );
    }
}

class ChatMessageDTO extends Codable<ChatMessageDTO> {
    sender: string | undefined;
    type: string | undefined;
    body: string | undefined;

    constructor(
        sender: string | undefined,
        type: string | undefined,
        body: string | undefined
    ){
        super();
        this.sender = sender;
        this.type = type;
        this.body = body;
    }

    override encode(): { [key: string]: any } {
        const data: { [key: string]: any } = {};
        
        if (this.sender) {
            data['sender'] = this.sender;
        }
        if (this.type) {
            data['type'] = this.type;
        }
        if (this.body) {
            data['body'] = this.body;
        }
    
        return data;
    };
}

export {
    ChatRoom,
    ChatRoomDTO,
    ChatRoomsResponse,

    ChatMember,

    ChatMessage,
    ChatMessageDTO
}