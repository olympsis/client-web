abstract class Codable<T> {
    /**
     * Takes in a json data and encodes it to the templated class
     * @param data - json data to decode
     */
    static decode(data: { [key: string]: any }): any {
        throw new Error('Decode method not implemented');
    }

    /**
     * Encodes the inherited class's values to json
     */
    encode(): { [key: string]: any } {
        throw new Error('Encode method not implemented');
    }
}

export {
    Codable
}