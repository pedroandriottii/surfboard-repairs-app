/**
*  Rotas que serão acessíveis publicamente (Não precisam de autenticação) @type {string[]}
*/
export const publicRoutes = [
    "/",
    "/auth/new-verification",
    "/catalogo",
];

/**
 * Rotas que são utilizadas para autenticação, elas vão redirecionar usuários logados para /home @type {string[]}
*/

export const authRoutes = [
    "/auth/login",
    "/auth/register",
    "/auth/error",
    "/auth/reset",
    "/auth/new-password",
];

/**
 *   Prefixo para rotas de API @type {string} 
*/

export const apiAuthPrefix = "/api/auth";

/**
 * Rota para redirecionar usuários logados @type {string}
*/

export const DEFAULT_LOGIN_REDIRECT = "/home";

/**
 * Rotas que são utilizadas para usuários MASTER @type {string[]}
*/
export const masterRoutes = [
    ""
];

/**
 * Rotas que são utilizadas para usuários ADMIN @type {string[]}
*/

export const adminRoutes = [
    "/api/marketplace/brands",
    "/api/marketplace/brands/create",
    "/api/marketplace/brands/[id]",
    "/api/marketplace/brands/[id]/update",
    "/api/marketplace/brands/[id]/delete",
    "/api/marketplace/surfboards",
    "/api/marketplace/surfboards/create",
    "/api/marketplace/surfboards/[id]",
    "/api/marketplace/surfboards/[id]/update",
    "/api/marketplace/surfboards/[id]/delete",
];
