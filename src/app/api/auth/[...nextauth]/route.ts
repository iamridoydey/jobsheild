import NextAuth, { AuthOptions, User} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        identifier: {
          label: "Email or Username",
          type: "text",
          placeholder: "Enter your email or username",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Enter your password",
        },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.identifier || !credentials?.password) {
            return null;
          }

          const isEmail = credentials.identifier.includes("@");
          const variableKey = isEmail ? "email" : "username";

          const res = await fetch(
            `${process.env.NEXT_PUBLIC_DOMAIN}/api/graphql`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                query: `
              query GetUser($${variableKey}: String!) {
                getUser(${variableKey}: $${variableKey}) {
                  _id,
                  createdAt
                  email
                  insertedFrauders
                  isVerified
                  name
                  password
                  role
                  username
                }
              }
              `,
                variables: {
                  [variableKey]: credentials.identifier,
                },
              }),
            }
          );

          const { data, errors } = await res.json();
          if (errors || !data?.getUser) {
            return null;
          }

          const user = data.getUser;

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (!isPasswordValid) {
            return null;
          }

          const { password, ...userData } = user;
          return userData;
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.user = user;
      }

      if (trigger === "update" && session?.user) {
        token.user = session.user;
      }

      return token;
    },
    async session({ session, token }) {
      session.user = token.user as User;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
