import { Post, PostDao, PostsResponse } from '../models/PostModels';
import { Method, Endpoint } from 'malakbel';
import type { Comment, CommentDao } from '../models/GenericModels';
import { BaseService } from './BaseService';

export class PostService extends BaseService {

    async createPost(dao: PostDao): Promise<string> {
        const headers = await this.getAuthHeaders();

        const endpoint = new Endpoint("/v1/posts");
        const data = JSON.stringify(dao.encode());

        const [status, _headers, body] = await this.http.request(Method.POST, endpoint, data, headers);
        if (status === 201) {
            if (body) {
                const resp = body as { [key: string]: any }
                return resp['id'];
            }
        }

        throw(`Status Code (${status})`);
    }

    async getPosts(id: string): Promise<PostsResponse | undefined> {
        const headers = await this.getAuthHeaders();

        let query = new Map<string, string>()
        query.set('groupID', id);

        const endpoint = new Endpoint('/v1/posts', query)

        try {
            const [status, _headers, body] = await this.http.request(Method.GET, endpoint, undefined, headers);
            if (status === 204) {
                return new PostsResponse([], 0);
            } else {
                if (body) {
                    return PostsResponse.decode(body);
                } else {
                    return undefined
                }
            }
        } catch (error) {
            console.error(error)
            return undefined
        }
    }

    async deletePost(id: string) : Promise<boolean> {
        const headers = await this.getAuthHeaders();

        const endpoint = new Endpoint(`/v1/posts/${id}`);
        const [status, _headers, body] = await this.http.request(Method.DELETE, endpoint, undefined, headers);
        if (status == 200) {
            return true;
        } else {
            return false;
        }
    }

    async likePost(id: string): Promise<string> {
        const headers = await this.getAuthHeaders();

        const endpoint = new Endpoint(`/v1/posts/${id}/likes`);
        const [status, _headers, body] = await this.http.request(Method.POST, endpoint, undefined, headers);
        if (status == 200) {
            if (body) {
                const resp = body as { [key: string]: any }
                return resp['id'];
            }
        }

        throw(`Status Code (${status})`);
    }

    async unLikePost(id: string, lID: string): Promise<boolean> {
        const headers = await this.getAuthHeaders();

        const endpoint = new Endpoint(`/v1/posts/${id}/likes/${lID}`);
        const [status, _headers, body] = await this.http.request(Method.DELETE, endpoint, undefined, headers);
        if (status == 200) {
            return true;
        } else {
            return false;
        }
    }

    async addComment(id: string, dao: CommentDao): Promise<string> {
        const headers = await this.getAuthHeaders();

        const data = JSON.stringify(dao.encode());
        const endpoint = new Endpoint(`/v1/posts/${id}/comments`);
        const [status, _headers, body] = await this.http.request(Method.POST, endpoint, data, headers);
        if (status == 200) {
            if (body) {
                const resp = body as { [key: string]: any }
                return resp['id'];
            }
        }

        throw(`Status Code (${status})`);
    }

    async removeComment(id: string, cID: string): Promise<boolean> {
        const headers = await this.getAuthHeaders();

        const endpoint = new Endpoint(`/v1/posts/${id}/comments/${cID}`);
        const [status, _headers, body] = await this.http.request(Method.DELETE, endpoint, undefined, headers);
        if (status == 200) {
            return true;
        } else {
            return false;
        }
    }
}
