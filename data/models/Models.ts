abstract class Decodable<T> {
    static decode(data: { [key: string]: any }): any {
        throw new Error('Decode method not implemented');
    }
}

interface Encodable {
    encode(): { [key: string]: any }
}

export {
    Decodable,
    type Encodable
}