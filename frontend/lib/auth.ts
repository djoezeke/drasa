import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import type { JWT } from "next-auth/jwt";

const BACKEND_ORIGIN =
    process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://127.0.0.1:8000";
const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? `${BACKEND_ORIGIN.replace(/\/$/, "")}/api`;
const AUTH_SECRET = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;

type AuthUser = {
    id: number;
    username: string;
    email: string;
    first_name?: string;
    last_name?: string;
    role?: string;
};

type LoginResponse = {
    access: string;
    refresh: string;
    user: AuthUser;
};

function accessTokenExpiresAt(accessToken: string): number {
    try {
        const payload = JSON.parse(
            Buffer.from(accessToken.split(".")[1], "base64url").toString("utf8"),
        ) as { exp?: number };

        return payload.exp ? payload.exp * 1000 : Date.now() + 10 * 60 * 1000;
    } catch {
        return Date.now() + 10 * 60 * 1000;
    }
}

async function refreshAccessToken(token: JWT): Promise<JWT> {
    if (!token.refreshToken) {
        return { ...token, error: "RefreshAccessTokenError" };
    }

    try {
        const response = await fetch(`${API_BASE_URL}/auth/refresh/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh: token.refreshToken }),
            cache: "no-store",
        });

        if (!response.ok) {
            throw new Error("Unable to refresh access token");
        }

        const refreshed = (await response.json()) as {
            access: string;
            refresh: string;
        };

        return {
            ...token,
            accessToken: refreshed.access,
            refreshToken: refreshed.refresh,
            accessTokenExpires: accessTokenExpiresAt(refreshed.access),
            error: undefined,
        };
    } catch {
        return {
            ...token,
            error: "RefreshAccessTokenError",
        };
    }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
    secret: AUTH_SECRET,
    trustHost: true,
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/login",
    },
    providers: [
        Credentials({
            name: "Student Credentials",
            credentials: {
                identifier: { label: "Student ID or Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                const identifier = String(credentials?.identifier ?? "").trim();
                const password = String(credentials?.password ?? "");

                if (!identifier || !password) {
                    return null;
                }

                const response = await fetch(`${API_BASE_URL}/auth/login/`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ identifier, password }),
                    cache: "no-store",
                });

                if (!response.ok) {
                    return null;
                }

                const data = (await response.json()) as LoginResponse;

                return {
                    id: String(data.user.id),
                    name: `${data.user.first_name ?? ""} ${data.user.last_name ?? ""}`.trim() || data.user.username,
                    email: data.user.email,
                    backendUser: data.user,
                    accessToken: data.access,
                    refreshToken: data.refresh,
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                if (!user.accessToken || !user.refreshToken || !user.backendUser) {
                    return { ...token, error: "AuthPayloadError" };
                }

                return {
                    ...token,
                    user: user.backendUser,
                    accessToken: user.accessToken,
                    refreshToken: user.refreshToken,
                    accessTokenExpires: accessTokenExpiresAt(user.accessToken),
                };
            }

            if (token.accessToken && token.accessTokenExpires && Date.now() < token.accessTokenExpires) {
                return token;
            }

            return refreshAccessToken(token);
        },
        async session({ session, token }) {
            if (token.user) {
                const { id, ...restUser } = token.user;

                session.user = {
                    ...session.user,
                    ...restUser,
                    id: String(id),
                    name:
                        `${token.user.first_name ?? ""} ${token.user.last_name ?? ""}`.trim() ||
                        token.user.username,
                    email: token.user.email,
                };
            }
            session.accessToken = token.accessToken as string | undefined;
            session.error = token.error as string | undefined;
            return session;
        },
    },
    events: {
        async signOut(message) {
            if (!("token" in message) || !message.token?.refreshToken) {
                return;
            }

            await fetch(`${API_BASE_URL}/auth/logout/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ refresh: message.token.refreshToken }),
                cache: "no-store",
            }).catch(() => undefined);
        },
    },
});
