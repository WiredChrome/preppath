'use server'

import { db, auth} from "@/Firebase/admin";
import { Auth } from "firebase-admin/auth";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { cookies } from "next/headers";

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

    } catch (e) {
        console.log(e);
        return {
            success: false,
            message: 'An error occurred during sign-in',
        }
    }
}

export async function setSessionCookie(idToken: string) {
    const cookieStore = await cookies();
    const sessionCookie = await auth.createSessionCookie(idToken, {
        expiresIn: 60 * 60 * 24 * 5 * 1000, // 5 days
    });

    cookieStore.set('session', sessionCookie, {
        maxAge: 60 * 60 * 24 * 5, // 5 days
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'lax',
    });
}

export async function getCurrentUser(): Promise<User | null> {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;

    if (!sessionCookie) return null;

    try {
        const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
        const userRecord = await db.collection('users').doc(decodedClaims.uid).get();
        if (!userRecord.exists) return null;

        return {
            ...userRecord.data(),
            id: userRecord.id,

        } as User;

        
    } catch (e) {
        console.error('Error verifying session cookie:', e);
        return null;
    }
}

export async function isAuthenticated() {
    const user = await getCurrentUser();

    return !!user; 
}