import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';

const ADMIN_GITHUB_ID = process.env.ADMIN_GITHUB_ID;

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async signIn({ profile }) {
      // Only allow the admin user to sign in
      if (ADMIN_GITHUB_ID && profile?.id?.toString() !== ADMIN_GITHUB_ID) {
        return false;
      }
      return true;
    },
    async jwt({ token, profile }) {
      if (profile?.id) {
        token.githubId = profile.id.toString();
        token.isAdmin = profile.id.toString() === ADMIN_GITHUB_ID;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.isAdmin = token.isAdmin as boolean;
        session.user.githubId = token.githubId as string;
      }
      return session;
    },
  },
});
