import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// Rotas públicas (não requerem autenticação)
const isPublicRoute = createRouteMatcher([
  '/',
  '/sobre(.*)',
  '/tecnologia(.*)',
  '/pacientes(.*)',
  '/ortodontistas(.*)',
  '/blog(.*)',
  '/contato(.*)',
  '/quiz(.*)',
  '/infoproduto(.*)',
  '/api/webhook(.*)',
  '/api/mercadopago(.*)',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/portal/entrar(.*)',
  '/portal/cadastro(.*)',
])

// Rotas protegidas (requerem autenticação)
const isProtectedRoute = createRouteMatcher([
  '/portal(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  // Permitir rotas públicas sem autenticação
  if (isPublicRoute(req)) {
    return
  }

  // Se for rota protegida e usuário não está autenticado, redireciona para login
  if (isProtectedRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    // Pular Next.js internals e arquivos estáticos
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Sempre rodar para API routes
    '/(api|trpc)(.*)',
  ],
}
