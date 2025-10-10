import { getAuth } from 'firebase/auth'

/**
 * A helper function to grab user auth token from firebase.
 * Sometimes firebase has not yet initialized and we may need to try again to get the token.
 * 
 * @param retries - how often to try getting the token again
 * @param delay - how often to delay between retries (in ms)
 * @throws an error notifies that the token could not be found
 * @returns a string containing the auth token
 */
async function getAuthToken(retries = 3, delay = 50) : Promise<string> {
    for(let i = 0; i < retries; ++i) {
        let token = await getAuth().currentUser?.getIdToken();
        if (token) return token;

        // Don't delay after the last attempt
        if (i < retries - 1) {
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }

    throw new Error('Failed to get auth token after ' + retries + ' attempts');
}

export {
    getAuthToken
};