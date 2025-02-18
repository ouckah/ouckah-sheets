import NextAuth, { User } from "next-auth"
import GoogleProvider from "next-auth/providers/google"

async function createUserInDatabase(user: User) {
    try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL
        if (!API_URL) {
            console.error('API URL is not defined.');
            return false;
        }

        const response = await fetch(`${API_URL}/api/user/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        });

        if (!response.ok) {
            console.error('Failed to create user:', response.status, response.statusText);
            return false;
        }
        return true;
    } catch (error) {
        console.error('Error creating user:', error);
        return false;
    }
}

export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut,
} = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        })
    ],
    callbacks: {
        async signIn({ user }) {
            const userCreated = await createUserInDatabase(user);
            return userCreated;
          },
      },
})