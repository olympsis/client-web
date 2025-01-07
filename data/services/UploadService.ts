import { getAuth } from "firebase/auth";
import { ImageUploadResponse } from "../models/GenericModels";
import { Courrier, Endpoint, FileType, Method, Scheme } from "malakbel";

export class UploadService {
    private http: Courrier;

    constructor() {
        const url = process.env.API ?? '';
        this.http = new Courrier(Scheme.HTTPS, url);
    }
    
    public async uploadImage(file: ArrayBuffer, name: string, bucket: string): Promise<ImageUploadResponse> {
        const apiURL = process.env.API ?? '';
        const token = await getAuth().currentUser?.getIdToken() ?? ''
        const headers = new Map<string, string>();
        headers.set('Authorization', token);
        headers.set('X-Filename', name);

        const endpoint = new Endpoint(`/v1/storage/${bucket}`);

        // TODO: This code belongs in the Malakbel package. For some reason the function is ignoring the headers.
        // I am probably overlooking something simple. I do not have the time to deal with this at the moment.
        var options: { 
            method: string,
            body: any | undefined,
            headers: any | undefined
        } = {
            method: "POST",
            body: undefined,
            headers: undefined
        };

        const url = `https://${apiURL}${endpoint.path}${endpoint.mapToQueryString()}`

        headers.set('Content-Type', 'image/jpeg');

        options.headers = Object.fromEntries(headers);
        options.method = Method.POST
        options.body = file

        const response = await fetch(url, options)
        const [status, _headers, body] = [response.status, response.headers, await response.json()];
        // End of Malakbel code
        // const [status, _headers, body] = await this.http.upload(endpoint, FileType.JPEG, file, headers);

        if (status !== 201) {
            if (body) {
                return ImageUploadResponse.decode(body);
            }
        }

        throw(`Status not ok. Status: ${status}`)
    }

    public async deleteImage(name: string, bucket: string) : Promise<boolean> {
        const token = await getAuth().currentUser?.getIdToken() ?? ''
        const headers = new Map<string, string>();
        headers.set('Authorization', token);
        headers.set('X-Filename', name);

        const endpoint = new Endpoint(`/v1/storage/${bucket}`);

        const [status, _headers, body] = await this.http.request(Method.DELETE, endpoint, undefined, headers);

        if (status !== 200) {
            return true;
        }
        return false;
    }

    public async uploadFile() {}

    public async removeFile() {}
}