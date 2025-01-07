import { getAuth } from 'firebase/auth'
import { Post, PostDao, PostsResponse } from '../models/PostModels';
import { Courrier, Method, Endpoint, Scheme, NetworkError } from 'malakbel';

export class PostService {

    private http: Courrier;

    constructor() {
        const config = useRuntimeConfig();
        this.http = new Courrier(Scheme.HTTPS, config.public.API);
    }

    async createPost(dao: PostDao): Promise<string> {
        let token = await getAuth().currentUser?.getIdToken() ?? ""
        
        let headers = new Map<string, string>();
        headers.set('Authorization', token);

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
        let token = await getAuth().currentUser?.getIdToken() ?? ""

        let query = new Map<string, string>()
        query.set('groupID', id);
        
        let headers = new Map<string, string>()
        headers.set('Authorization', token)

        const endpoint = new Endpoint('/v1/posts', query)

        try {
            const [status, _headers, body] = await this.http.request(Method.GET, endpoint, undefined, headers);
            if (status === 204) {
                const data = {
                    "posts": [],
                    "total_posts": 0
                }
                return PostsResponse.decode(data);
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
        let token = await getAuth().currentUser?.getIdToken() ?? ""

        let headers = new Map<string, string>()
        headers.set('Authorization', token)

        const endpoint = new Endpoint(`/v1/posts/${id}`);
        const [status, _headers, body] = await this.http.request(Method.DELETE, endpoint, undefined, headers);
        if (status == 200) {
            return true;
        } else {
            return false;
        }
        
    }
}