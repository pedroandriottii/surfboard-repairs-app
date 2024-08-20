import authConfig from "@/auth.config";
import NextAuth from "next-auth";

import {
    DEFAULT_LOGIN_REDIRECT,
    adminRoutes,
    apiAuthPrefix,
    authRoutes,
    masterRoutes,
    publicRoutes,
} from "@/routes";
import { currentRole } from "./lib/auth";

const { auth } = NextAuth(authConfig);


export default auth(async (req) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;

    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
    const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
    const isAuthRoute = authRoutes.includes(nextUrl.pathname);
    const isMasterRoute = masterRoutes.includes(nextUrl.pathname);
    const isAdminRoute = adminRoutes.includes(nextUrl.pathname);

    if (isApiAuthRoute) {
        return;
    }

    if (isAuthRoute) {
        if (isLoggedIn) {
            return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
        }
        return;
    }

    if (!isLoggedIn && !isPublicRoute) {
        return Response.redirect(new URL("/", nextUrl));
    }

    const role = await currentRole();

    if (isMasterRoute && role !== "MASTER") {
        return Response.redirect(new URL("/", nextUrl));
    }

    if (isAdminRoute && role !== "ADMIN" && role !== "MASTER") {
        return Response.redirect(new URL("/", nextUrl));
    }

    return;
})

export const config = {
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}