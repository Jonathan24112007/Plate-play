import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { getUserByEmail, findOrCreateOAuthUser } from "@/lib/pilotService";

export const authOptions: NextAuthOptions = {
  providers: [
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            allowDangerousEmailAccountLinking: true,
          }),
        ]
      : []),
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const emailClean = credentials.email.trim().toLowerCase();

        // 1. Check for dedicated Admin credentials
        const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
        const adminHash = process.env.ADMIN_PASSWORD_HASH;

        if (adminEmail && adminHash && emailClean === adminEmail) {
          const validAdmin = await bcrypt.compare(credentials.password, adminHash);
          if (validAdmin) {
            return {
              id: "admin-master",
              email: adminEmail,
              name: "PlatePlay Operations Admin",
              role: "ADMIN",
            };
          }
        }

        // 2. Check for registered Customer / User accounts
        try {
          const user = await getUserByEmail(emailClean);
          if (user) {
            const validCustomer = await bcrypt.compare(credentials.password, user.passwordHash);
            if (validCustomer) {
              return {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role, // "CUSTOMER" or "ADMIN"
              };
            }
          }
        } catch (e) {
          console.error("[Auth] Error resolving user credentials:", e);
        }

        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
  jwt: {
    maxAge: 60 * 60 * 24 * 7,
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        if (!user.email) return false;
        try {
          const dbUser = await findOrCreateOAuthUser({
            email: user.email,
            name: user.name || profile?.name || "",
            image: user.image || (profile as any)?.picture || undefined,
            provider: "google",
          });
          user.id = dbUser.id;
          (user as any).role = dbUser.role;
        } catch (err) {
          console.error("[Auth] Error in Google signIn callback:", err);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role ?? "CUSTOMER";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).role = (token.role as string) ?? "CUSTOMER";
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET || "plateplay-secret-pilot-beta-key-2026",
};

/**
 * Check if a request is authenticated as admin
 */
export async function getAdminSession(
  req?: Request
): Promise<{ id: string; email: string; name: string; role: string } | null> {
  const { getServerSession } = await import("next-auth");
  try {
    const session = (await getServerSession(authOptions as any)) as any;
    if (!session?.user || session.user.role !== "ADMIN") return null;
    return {
      id: session.user.id ?? "admin",
      email: session.user.email ?? "",
      name: session.user.name ?? "PlatePlay Admin",
      role: "ADMIN",
    };
  } catch {
    return null;
  }
}

/**
 * Check if a request has any valid authenticated user session (customer or admin)
 */
export async function getAuthenticatedSession(): Promise<{
  id: string;
  email: string;
  name: string;
  role: "CUSTOMER" | "ADMIN";
} | null> {
  const { getServerSession } = await import("next-auth");
  try {
    const session = (await getServerSession(authOptions as any)) as any;
    if (!session?.user) return null;
    return {
      id: session.user.id ?? "",
      email: session.user.email ?? "",
      name: session.user.name ?? "",
      role: session.user.role === "ADMIN" ? "ADMIN" : "CUSTOMER",
    };
  } catch {
    return null;
  }
}
