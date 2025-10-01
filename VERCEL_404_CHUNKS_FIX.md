# Fix 404 em main.js e polyfills.js - Vercel

## ✅ CAUSA RAIZ IDENTIFICADA

O browser estava requisitando `main.js` e `polyfills.js` **SEM hashes**, enquanto os arquivos reais têm hashes (`main-727daab658503b01.js`, `polyfills-42372ed130431b0a.js`).

Isso acontece quando o Next.js usa **build IDs diferentes** em múltiplas instâncias/edge functions no Vercel, causando inconsistência no `_buildManifest.js`.

## Problemas Identificados e Soluções Aplicadas

### 1. ❌ Custom Webpack splitChunks Config
**Problema:** A configuração customizada de `splitChunks` no webpack estava sobrescrevendo a estratégia padrão do Next.js para gerenciamento de chunks.

**Solução:** Removida a configuração customizada do webpack em `next.config.mjs`:
```js
// REMOVIDO:
webpack: (config, { dev, isServer }) => {
  if (!dev && !isServer) {
    config.optimization.splitChunks = {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    };
  }
  return config;
}
```

### 2. ❌ Headers Aplicados a Rotas Estáticas
**Problema:** A configuração de headers em `next.config.mjs` estava aplicando headers de segurança customizados a TODAS as rotas, incluindo `_next/static/*`, o que pode interferir com o serving de arquivos estáticos no Vercel.

**Solução:** Atualizado o pattern `source` para excluir rotas internas do Next.js:
```js
// ANTES:
{
  source: '/(.*)',
  headers: [...]
}

// DEPOIS:
{
  source: '/:path((?!_next/static|_next/image|favicon.ico).*)',
  headers: [...]
}
```

## Como Verificar se Foi Resolvido

1. Aguarde o deploy do Vercel terminar
2. Abra o DevTools (F12) na aba Network
3. Recarregue a página
4. Verifique se `main.js` e `polyfills.js` retornam **200 OK** ao invés de **404**

## Outras Causas Comuns (já verificadas e não aplicáveis)

- ✅ Framework Preset: Já configurado corretamente como "Next.js"
- ✅ Root Directory: Já configurado como "Frontend"
- ✅ Middleware: Não existe middleware customizado interceptando rotas `_next`
- ✅ assetPrefix/basePath: Não configurado (usa padrão do Next.js)

## Referências

- [Next.js Discussions #49803](https://github.com/vercel/next.js/discussions/49803) - Headers blocking static chunks
- [Stack Overflow - Next.js 404 on chunks](https://stackoverflow.com/questions/66084031/next-js-error-getting-404-when-fetching-js-resources-after-refresh)
- [Next.js Issue #54120](https://github.com/vercel/next.js/issues/54120) - Chunk files not found

### 3. ❌ ✅ Inconsistência de Build IDs (SOLUÇÃO PRINCIPAL)
**Problema:** O Next.js gera um build ID aleatório por padrão. Em ambientes com múltiplas instâncias (como Vercel Edge), diferentes instâncias podem ter build IDs diferentes, causando referências inconsistentes aos chunks.

**Sintoma:** Browser requisita `/_next/static/chunks/main.js` (sem hash) mas o arquivo real é `main-[hash].js`.

**Solução:** Usar `VERCEL_GIT_COMMIT_SHA` como build ID para garantir consistência:
```js
generateBuildId: async () => {
  return process.env.VERCEL_GIT_COMMIT_SHA || null;
},
```

Isso garante que **todas as instâncias usem o mesmo build ID** = mesmas referências de chunks.

## Commits

- `51a54ed` - Remove custom webpack splitChunks config
- `8fef56a` - Exclude _next/static from custom headers
- `56badee` - **Add generateBuildId to ensure consistent chunk references** ⭐ SOLUÇÃO PRINCIPAL
