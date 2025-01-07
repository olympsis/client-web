import { v4 as uuidv4 } from 'uuid';
import { UserSnippet } from "../models/UserModels";
import { useModelStore } from "@/stores/model-store";
import { Post, PostDao } from "../models/PostModels";
import { PostService } from "../services/PostService";
import { useSessionStore } from "@/stores/session-store";
import { UploadService } from "../services/UploadService";
import type { ImageUploadResponse } from "../models/GenericModels";

export class NewPostManager {

    private modelStore = useModelStore();
    private sessionStore = useSessionStore();

    private postService = new PostService();
    private uploadService = new UploadService();

    constructor() {}

    public async handleImageUpload(url: string): Promise<ImageUploadResponse> {
        try {
            const response = await fetch(url);
            const blob = await response.arrayBuffer();
            
            const name = `${uuidv4()}.jpeg`;
            return await this.uploadService.uploadImage(blob, name, 'olympsis-post-images');
        } catch (error) {
            console.error('Failed to upload image. Error: ', error)
            throw('Failed to upload image');
        }
    }

    public async createNewPost(groupID: string, body: string, images?: string[], externalLink?: string): Promise<Post | null> {
        try {
            let dao = new PostDao(
                'post',
                undefined,
                groupID,
                body,
                undefined,
                undefined,
                externalLink
            );

            // For now only handle the one image upload
            if (images) {
                const resp = await this.handleImageUpload(images[0]);
                dao.images = [resp.url ?? '']
            }

            const id = await this.postService.createPost(dao);
            return this.generateNewPostModel(id, dao);
        } catch (error) {
            console.error(`Failed to create post. Error: ${error}`);
            return null;
        }
    }

    public generateNewPostModel(id: string, dao: PostDao): Post {
        const user = this.sessionStore.user;
        const poster = new UserSnippet(
            user?.uuid,
            user?.username,
            user?.imageURL
        );
        
        return new Post(
            id,
            'post',
            poster,
            dao.body ?? '',
            undefined,
            dao.images,
            [],
            [],
            Math.floor(Date.now() / 1000)
        )
    }
}
