import { ImageUploadResponse } from "../models/GenericModels";
import { Endpoint, Method } from "malakbel";
import { BaseService } from './BaseService';

export class UploadService extends BaseService {

    public async uploadImage(file: ArrayBuffer, name: string, bucket: string): Promise<ImageUploadResponse> {
        const headers = await this.getAuthHeaders();
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

        const config = useRuntimeConfig();
        const scheme = config.public.MODE === 'dev' ? 'http' : 'https';
        const url = `${scheme}://${this.http.host}${endpoint.path}${endpoint.mapToQueryString()}`

        headers.set('Content-Type', 'image/jpeg');

        options.headers = Object.fromEntries(headers);
        options.method = Method.POST
        options.body = file

        const response = await fetch(url, options)
        const [status, _headers, body] = [response.status, response.headers, await response.json()];
        // End of Malakbel code
        // const [status, _headers, body] = await this.http.upload(endpoint, FileType.JPEG, file, headers);

        if (status === 200) {
            if (body) {
                return ImageUploadResponse.decode(body);
            }
        }

        throw(`Status not ok. Status: ${status}`)
    }

    public async deleteImage(name: string, bucket: string) : Promise<boolean> {
        const headers = await this.getAuthHeaders();
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
