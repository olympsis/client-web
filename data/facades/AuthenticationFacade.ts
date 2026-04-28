import {
    getAuth,
    OAuthProvider,
    signInWithPopup,
    signInWithCredential,
    GoogleAuthProvider,
    getAdditionalUserInfo,
    reauthenticateWithPopup,
    type AuthError,
    type Auth
} from "firebase/auth";

import * as Sentry from '@sentry/nuxt';

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
     * Uses Apple's native Sign In with Apple JS SDK to authenticate, then
     * links the Apple credential to Firebase Auth via signInWithCredential.
     * This avoids needing Firebase Hosting for the OAuth popup handler.
     * @returns AuthFacadeResponse Object that contains the data needed from the auth services
     */
    async signInWithApple(): Promise<AuthFacadeResponse | null> {
        const config = useRuntimeConfig();

        try {
            // Guard against the Apple SDK failing to load
            if (!(window as any).AppleID) {
                console.error('Apple Sign In SDK not loaded');
                return null;
            }

            // Use Apple's native JS SDK — shows Apple's own auth overlay
            const appleAuth = (window as any).AppleID.auth;
            appleAuth.init({
                clientId: config.public.APL_SERVICE_ID,
                scope: 'name email',
                redirectURI: window.location.origin,
                usePopup: true,
            });

            const appleResponse = await appleAuth.signIn();
            const { id_token: appleIdToken, code } = appleResponse.authorization;
            const appleUser = appleResponse.user; // Only present on first authorization

            // Create a Firebase OAuthCredential from Apple's id_token and sign in.
            // We pass only the idToken — the authorization code is not a nonce.
            const oauthProvider = new OAuthProvider('apple.com');
            const credential = oauthProvider.credential({
                idToken: appleIdToken,
            });
            const result = await signInWithCredential(this.auth, credential);
            const user = result.user;
            const additional = getAdditionalUserInfo(result);

            // Build the full name from Apple's user object (first auth only),
            // Firebase user profile, or fall back to a default.
            const appleName = appleUser
                ? [appleUser.name?.firstName, appleUser.name?.lastName].filter(Boolean).join(' ')
                : '';
            const fullName = appleName || user.displayName || '';

            const response: AuthFacadeResponse = {
                fullName,
                email: appleUser?.email || user.email || '',
                idToken: await user.getIdToken(),
                isNewUser: additional?.isNewUser
            }

            // For new users, don't register yet — the sign-in page will collect
            // any missing profile info first, then call registerUser().
            if (!additional?.isNewUser) {
                logEvent(this.analytics, 'apple_signin');
            }
            return response;
        } catch(error: any) {
            // User closed the Apple popup — not an error worth reporting
            if (error?.error === 'popup_closed_by_user') return null;

            Sentry.withScope((scope) => {
                scope.setExtra('action', 'apple_signin');
                Sentry.captureException(error);
            });
            console.error(`Failed to sign user in with Apple. Error Code (${error.code}): ${error.message}`);
            return null;
        }
    }

    /**
     * Registers a new user with the backend after profile info has been collected.
     * Called from the sign-in page once we have first name, last name, and email.
     * @param response - the auth response containing the user's info and token
     * @returns true if registration succeeded
     */
    async registerUser(response: AuthFacadeResponse): Promise<boolean> {
        try {
            const nameParts = response.fullName ? response.fullName.split(' ') : [];
            const request = new AuthRequest(
                nameParts[0] || '',
                nameParts.slice(1).join(' ') || '',
                response.email,
                response.idToken
            );
            const res = await this.authService.register(request);
            if (!res) return false;

            return true;
        } catch (error) {
            Sentry.withScope((scope) => {
                scope.setExtra('action', 'register_user');
                Sentry.captureException(error);
            });
            console.error(`Failed to register user. Error: ${error}`);
            return false;
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
            // For new users, don't register yet — the sign-in page will collect
            // any missing profile info first, then call registerUser().
            if (!additional?.isNewUser) {
                logEvent(this.analytics, 'google_signin');
            }
            return response;
        } catch(error: any) {
            Sentry.withScope((scope) => {
                scope.setExtra('action', 'google_signin');
                Sentry.captureException(error);
            });
            console.error(`Failed to sign user in with Google. Error Code (${error.code}): ${error.message}`);
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
            Sentry.withScope((scope) => {
                scope.setExtra('action', 'complete_signup');
                Sentry.captureException(error);
            });
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
            /*
               `this.auth` is captured at facade construction time from
               `useNuxtApp().$auth`. On some logout paths (e.g. signing
               out from a route the nuxt firebase plugin hasn't fully
               initialised yet, or after Firebase tore the instance
               down) it can be undefined — calling `.signOut()` on that
               throws "Cannot read properties of undefined (reading
               'signOut')" and bubbles up to the UI as a hard error
               even though the user really has been logged out locally.
               Fall back to `getAuth()` so we always have a live Auth
               instance to call signOut on; if even that's not
               available, log and proceed so the local session cleanup
               can finish.
            */
            /*
               Resolve a usable Auth instance defensively: getAuth()
               throws synchronously when no Firebase app has been
               initialized in this context (the "app/no-app" error). On
               the signout path we'd rather just skip the remote call
               and let the local logout chain finish, so wrap it.
            */
            let auth: Auth | undefined = this.auth;
            if (!auth) {
                try {
                    auth = getAuth();
                } catch {
                    auth = undefined;
                }
            }
            if (!auth) {
                console.warn('Firebase Auth unavailable; skipping remote signOut.');
                return true;
            }

            // Create a timeout promise that resolves after 5 seconds
            const timeoutPromise = new Promise<void>((resolve) => {
                setTimeout(() => {
                   console.log("Firebase signOut timed out, proceeding anyway");
                   resolve();
                }, 5000);
            });

            // Race the signOut operation against the timeout
            await Promise.race([
                auth.signOut(),
                timeoutPromise
            ]);

            return true;
        } catch (error) {
            /*
               Two benign cases we don't want to surface as red errors:
                 - `auth/no-current-user`: nobody to sign out — we're
                   already in the desired state.
                 - `app/no-app`: Firebase wasn't initialised in this
                   context (e.g. signout fired before the firebase
                   plugin booted, or after a page reload that skipped
                   it). Locally there's nothing to tear down; the
                   downstream auth-store / session-store cleanup still
                   runs, so the user really is signed out.
               Everything else is real and worth capturing.
            */
            const code = (error as { code?: string })?.code ?? '';
            const benign = code === 'auth/no-current-user' || code === 'app/no-app'
                || (error as Error)?.message?.includes("No Firebase App");

            if (!benign) {
                Sentry.withScope((scope) => {
                    scope.setExtra('action', 'signout');
                    Sentry.captureException(error);
                });
                console.error("Error during signOut:", error);
            } else {
                console.warn('Firebase signOut skipped (no app/no user); proceeding with local logout.');
            }
            return true; // Return true to allow UI to update anyway
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