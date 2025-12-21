import 'next-auth';

declare module 'next-auth' {
  interface User {
    isAdmin?: boolean;
    githubId?: string;
  }

  interface Session {
    user: User & {
      isAdmin?: boolean;
      githubId?: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    isAdmin?: boolean;
    githubId?: string;
  }
}
