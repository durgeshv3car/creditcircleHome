import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

export const { auth, handlers, signIn, signOut } = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

        try {
          const response = await axios.post(`${API_BASE_URL}/auth/login`, {
            email: credentials.email,
            password: credentials.password,
            expiresInMins: 1440,
          });

          const data = response.data;
        

          return {
            id: data.id,
            permissions: data.permissions,
            email: data.email,
            role: data.role,
            token: data.token,
          };
        } catch (error) {
          console.error("Authorize Error:", error);
          throw new Error("Login failed. Please check your credentials.");
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.id = user.id;
        token.permissions = user.permissions;
        token.email = user.email;
        token.role = user.role;
        token.token = user.token;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
      

      try {
       const res =await axios.get(`${API_BASE_URL}/auth/user/${token.id}`, {
          headers: {
            Authorization: `Bearer ${token.token}`,
          },
        });
        

        if (session.user) {
          session.user.id = token.id;
          session.user.permissions = token.permissions;
          session.user.email = token.email;
          session.user.role = token.role;
          session.user.token = token.token;
        }

        return session;
      } catch (error: any) {
        if (error.response?.status === 401) {
          return null;
        }
        console.error("Session Error:", error.message);
        return session;
      }
    },
  },
});
