class AuthRequest {
    firstName: string | undefined
    lastName: string | undefined
    email: string | undefined
    token: string

    constructor(
        firstName: string | undefined,
        lastName: string | undefined,
        email: string | undefined,
        token: string
    ){
        this.firstName = firstName
        this.lastName = lastName
        this.email = email
        this.token = token
    }

    encode(): { [key: string]: any } {
        let json: { [key: string]: any } = {}
        // Always include name/email fields even if empty — using truthy checks
        // previously caused empty strings to be omitted, leaving server-side
        // pointer fields nil which led to nil-pointer panics.
        if (this.firstName != undefined) {
            json['first_name'] = this.firstName
        }
        if (this.lastName != undefined) {
            json['last_name'] = this.lastName
        }
        if (this.email != undefined) {
            json['email'] = this.email
        }
        json['token'] = this.token
        return json
    }
}

class AuthResponse {
    userId: string | undefined
    firstName: string | undefined
    lastName: string | undefined
    email: string | undefined
    token: string

    constructor(
        userId: string | undefined,
        firstName: string | undefined,
        lastName: string | undefined,
        email: string | undefined,
        token: string
    ){
        this.userId = userId
        this.firstName = firstName
        this.lastName = lastName
        this.email = email
        this.token = token
    }

    static decode<AuthResponse>(data: { [key: string]: any }): AuthResponse {
        const object = Object()

        if (data['user_id']) {
            object['userId'] = data['user_id']
        }
        if (data['first_name']) {
            object['firstName'] = data['first_name']
        }
        if (data['last_name']) {
            object['lastName'] = data['last_name']
        }
        if (data['email']) {
            object['email'] = data['email']
        }
        object['token'] = data['token']

        Object.setPrototypeOf(object, AuthResponse.prototype);
        return object
    }
}

export {
    AuthRequest,
    AuthResponse
}