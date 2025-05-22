'use server'

import { db, auth} from "@/Firebase/admin";
import { Auth } from "firebase-admin/auth";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { cookies } from "next/headers";
import { redirect } from 'next/navigation';


export async function signUp(params: SignUpParams) {
	const { uid, name, email } = params;

    try{
        const userDocRef = db.collection('users').doc(uid);
        const userRecord = await userDocRef.get();
        
        if(userRecord.exists) {
            return {
                success: false,
                message: 'User already exists',
            }
        }
        await userDocRef.set({
            name,
            email,
            createdAt: new Date().toISOString(),
        });
        return {
            success: true,
            message: 'User created successfully',
        }
    } catch (e: any) {
        console.error('Error during sign-in:', e);
        if(e.code === 'auth/email-already-in-use') {
            return {
                success: false,
                message: 'Email already in use',
            }
            // throw new Error('Email already in use');
        }
        return{
            success: false,
            message: 'An error occurred during sign-in',
        }
    }
}

export async function signIn(params: SignInParams) {
    const { email, idToken } = params;

    try {
        const userRecord = await auth.getUserByEmail(email);
        if (!userRecord) {
            return {
                success: false,
                message: 'User not found',
            }
        }

        await setSessionCookie(idToken);

        return {
            success: true,
            message: 'Signed in successfully',
        };

    } catch (e) {
        console.log(e);
        return {
            success: false,
            message: 'An error occurred during sign-in',
        }
    }
}

export async function setSessionCookie(idToken: string) {
    const sessionCookie = await auth.createSessionCookie(idToken, {
        expiresIn: 60 * 60 * 24 * 5 * 1000, // 5 days
    });

    cookies().set('session', sessionCookie, {
        maxAge: 60 * 60 * 24 * 5, // 5 days
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'lax',
    });
}

export async function getCurrentUser(): Promise<User | null> {
    const sessionCookie = cookies().get('session')?.value;
    if (!sessionCookie) return null;

    try {
        const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
        const authUser = await auth.getUser(decodedClaims.uid);
        const userDoc = await db.collection('users').doc(authUser.uid).get();

        return {
            uid: authUser.uid,
            email: authUser.email,
            name: authUser.displayName || userDoc.data()?.name,
            photoURL: authUser.photoURL,
            createdAt: userDoc.data()?.createdAt,
        } as User;
    } catch (e) {
        console.error('Error verifying session cookie:', e);
        return null;
    }
}

export async function clearSessionCookie() {
  cookies().delete('session');
}

export async function signOut() {
  await clearSessionCookie();
  redirect('/auth/sign-in');
}

export async function isAuthenticated() {
    return await getCurrentUser(); // returns null or User object
}