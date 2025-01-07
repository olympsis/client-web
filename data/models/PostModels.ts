import { UserSnippet } from "./UserModels";
import { type Like, type Comment } from "./GenericModels";

class Post {
    id: string;
    type: string;
    poster?: UserSnippet;
    body: string;
    event?: Event | undefined;
    images?: string[] | undefined;
    likes?: Like[];
    comments?: Comment[];
    createdAt: number;
    externalLink?: string;

    constructor(
        id: string,
        type: string,
        poster: UserSnippet,
        body: string,
        event: Event | undefined,
        images: string[] | undefined,
        likes: Like[],
        comments: Comment[],
        createdAt: number,
        externalLink?: string
    ) {
        this.id = id;
        this.type = type;
        this.poster = poster;
        this.body = body;
        this.event = event;
        this.images = images;
        this.likes = likes;
        this.comments = comments;
        this.createdAt = createdAt;
        this.externalLink = externalLink;
    }

    static decode(data: { [key: string]: any }): Post {
        const object = Object()
    
        object['id'] = data['id']
        object['type'] = data['type']
        object['body'] = data['body']
        object['poster'] = UserSnippet.decode(data['poster'])
        if (data['event']) {
            object['event'] = data['event']
        }
        if (data['images']) {
            object['images'] = data['images']
        }
    
        object['likes'] = data['likes']
        object['comment'] = data['comment']
        object['createdAt'] = data['created_at']
        object['externalLink'] = data['external_link']
    
        Object.setPrototypeOf(object, Post.prototype);

        return object
    }
}

class PostDao {
    type?: string;
    poster?: string;
    groupID?: string;
    body?: string;
    eventID?: string;
    images?: string[];
    externalLink?: string;
  
    constructor(
        type: string | undefined,
        poster: string | undefined,
        groupID: string | undefined,
        body: string | undefined,
        eventID?: string | undefined,
        images?: string[] | undefined,
        externalLink?: string | undefined
    ) {
        this.type = type;
        this.poster = poster;
        this.groupID = groupID;
        this.body = body;
        this.eventID = eventID;
        this.images = images;
        this.externalLink = externalLink;
    }
}

class PostsResponse {
    posts: Post[];
    totalPosts: number;

    constructor(
        posts: Post[],
        totalPosts: number
    ){
        this.posts = posts
        this.totalPosts = totalPosts
    }

    static decode(data: { [key: string]: any }): PostsResponse {
        const object = Object()

        object['totalPosts'] = data['posts'].length ?? 0
        object['posts'] = data.posts.map((p: {[key: string]: any}) => {
            return Post.decode(p)
        }) ?? [];

        Object.setPrototypeOf(object, PostsResponse.prototype);

        return object;
    }
}

interface PostDao {
    encode(): { [key: string]: any }
}

interface PostsResponse {
    decode(data: { [key: string]: any }): PostsResponse
}

PostDao.prototype.encode = function(): { [key: string]: any } {
    let json: { [key: string]: any } = {}
    if (this.type != null) {
        json['type'] = this.type
    }
    if (this.poster != null) {
        json['poster'] = this.poster
    }
    if (this.groupID != null) {
        json['group_id'] = this.groupID
    }
    if (this.body != null) {
        json['body'] = this.body
    }
    if (this.eventID != null) {
        json['event_id'] = this.eventID
    }
    if (this.images != null) {
        json['images'] = this.images
    }
    if (this.externalLink != null) {
        json['external_link'] = this.externalLink
    }
    return json
}

export {
    Post,
    PostDao,
    PostsResponse
}