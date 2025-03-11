import { 
    getAuth, 
    OAuthProvider, 
    signInWithPopup ,
    GoogleAuthProvider, 
    getAdditionalUserInfo,
    reauthenticateWithPopup,
    type AuthError,
    type Auth
} from "firebase/auth";

import type { UserDTO } from "../models/UserModels";

import { AuthRequest } from "../models/AuthModels";
import { AuthService } from "../services/AuthService";
import { UserService } from "../services/UserService";
import { getAnalytics, logEvent, type Analytics } from "firebase/analytics";

type AuthFacadeResponse = {
    fullName: string
    email: string
    idToken: string
    isNewUser: boolean | undefined 
}

class AuthenticationFacade {

    private nuxtApp = useNuxtApp();
    private auth = this.nuxtApp.$auth as Auth;
    private analytics = this.nuxtApp.$analytics as Analytics;

    private authService = new AuthService();
    private userService = new UserService();

    /**
     * Requests the user to sign in with apple with either a popup or a new page
     * @returns AuthFacadeResponse Object that contains the data needed from the auth services
     */
    async signInWithApple(): Promise<AuthFacadeResponse | null> {
        const provider = new OAuthProvider('apple.com');

        try {
            const result: any = await signInWithPopup(this.auth, provider);
            const user = result.user;
            const additional = getAdditionalUserInfo(result);
    
            const response: AuthFacadeResponse = {
                fullName: user.displayName,
                email: user.email,
                idToken: result._tokenResponse.idToken,
                isNewUser: additional?.isNewUser
            } 

            if (additional?.isNewUser) {
                const request = new AuthRequest(
                    response.fullName.split(' ')[0],
                    response.fullName.split(' ')[1],
                    response.email,
                    response.idToken
                );
                const res = await this.authService.register(request);
                if (!res) return null;

                logEvent(this.analytics, 'apple_signup');
            } else {
                logEvent(this.analytics, 'apple_signin');
            }
            return response;
        } catch(error: any) {
            console.error(`Failed to sign user in with Apple. Error Code (${error.code}): ${error.message}`);
            return null;
        }
    }

    /**
     * Requests the user to sign in with google with either a popup or a new page
     * @returns AuthFacadeResponse Object that contains the data needed from the auth services
     */
    async signInWithGoogle(): Promise<AuthFacadeResponse | null> {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' });

        try {
            const result: any = await signInWithPopup(this.auth, provider);
            const user = result.user;
            const additional = getAdditionalUserInfo(result);
    
            const response: AuthFacadeResponse = {
                fullName: user.displayName,
                email: user.email,
                idToken: result._tokenResponse.idToken,
                isNewUser: additional?.isNewUser
            }
            if (additional?.isNewUser) {
                const request = new AuthRequest(
                    response.fullName.split(' ')[0],
                    response.fullName.split(' ')[1],
                    response.email,
                    response.idToken
                );
                const res = await this.authService.register(request);
                if (!res) return null;

                logEvent(this.analytics, 'google_signup');
            } else {
                logEvent(this.analytics, 'google_signin');
            }
            return response;
        } catch(error: any) {
            console.error(`Failed to sign user in with Apple. Error Code (${error.code}): ${error.message}`);
            return null;
        }
    }

    /**
     * Completes the user sign up and updates the user data with the metadata required to run the application
     * @param authResponse contains the first, last name & email of the user
     * @param user the data to update the user with
     */
    async completeUserSignUp(user: UserDTO): Promise<boolean> {
        try {
            await this.userService.updateUserData(user);
            logEvent(this.analytics, 'signup_completed')
            return true;
        } catch (error) {
            console.error(`Failed to complete signup. Error: ${error}`);
            return false;
        }
    }

    /**
     * Signs the user out of the application
     * @returns boolean indicating success status
     */
    async signOut(): Promise<boolean> {
        try {
            await this.auth.signOut()
            logEvent(this.analytics, 'signout');
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Requests the user to sign in again before they can delete their account
     * @throws an error if we fail to delete
     * @returns boolean indicating success status
     */
    async deleteAccount(): Promise<boolean> {
        const user = this.auth.currentUser;
        if (!user) {
            throw new Error('No user is currently signed in');
        }

        try {
            // Check if re-authentication is needed
            try {
                await user.delete();
                await this.authService.deleteAccount();
                return true;
            } catch (error) {
                // If requires re-authentication, continue to next part
                if ((error as AuthError).code !== 'auth/requires-recent-login') {
                    throw error;
                }
            }
        
            // Get the user's provider ID
            const providerId = user.providerData[0]?.providerId;
            if (!providerId) {
                throw new Error('No authentication provider found');
            }
        
            // Create the appropriate provider
            let authProvider;
            switch (providerId) {
                case 'google.com':
                    authProvider = new GoogleAuthProvider();
                    break;
                case 'apple.com':
                    authProvider = new OAuthProvider('apple.com');
                    break;
                default:
                    throw new Error(`Unsupported provider: ${providerId}`);
            }
        
            // Re-authenticate and delete
            await reauthenticateWithPopup(user, authProvider);
            await user.delete();
            await this.authService.deleteAccount();
            logEvent(this.analytics, 'account_deleted');
            return true;
        } catch (error) {
            const authError = error as AuthError;
            switch (authError.code) {
                case 'auth/requires-recent-login':
                    throw new Error('Please re-authenticate before deleting your account');
                case 'auth/popup-blocked':
                    throw new Error('Authentication popup was blocked by the browser');
                case 'auth/popup-closed-by-user':
                    throw new Error('Authentication popup was closed before completing the sign-in');
                default:
                    throw new Error(`Failed to delete account: ${authError.message}`);
            }
        }
    }
}

export {
    AuthenticationFacade,
    type AuthFacadeResponse,
}