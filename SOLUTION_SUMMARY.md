# 🎯 Solução Final: Erro 404 em main.js e polyfills.js

## Problema Identificado

**Sintoma:**
```
GET /_next/static/chunks/main.js net::ERR_ABORTED 404 (Not Found)
GET /_next/static/chunks/polyfills.js net::ERR_ABORTED 404 (Not Found)
```

Browser requisitava chunks **sem hashes**, mas os arquivos reais têm hashes:
- ❌ Requisitado: `main.js`
- ✅ Arquivo real: `main-727daab658503b01.js`

## Causa Raiz

**Bug conhecido do Next.js 15**: Inconsistência entre `[chunkhash]` e `[contenthash]`

No webpack do Next.js 15:
- `filename` usa `[chunkhash]`
- `chunkFilename` usa `[contenthash]`

Isso causa hashes diferentes para o mesmo conteúdo, levando o `buildManifest.json` a referenciar chunks com nomes incorretos.

**Referência:** https://github.com/vercel/next.js/issues/78756

## Solução Aplicada

Modificado `next.config.mjs` para substituir `[chunkhash]` por `[contenthash]`:

```javascript
webpack: (config, { isServer }) => {
  if (!isServer) {
    // Replace [chunkhash] with [contenthash] for deterministic builds
    if (config.output.filename) {
      config.output.filename = config.output.filename.replace('[chunkhash]', '[contenthash]');
    }
  }
  return config;
}
```

## Outras Correções Aplicadas

Durante a investigação, também foram corrigidos:

1. ✅ **generateBuildId**: Usa `VERCEL_GIT_COMMIT_SHA` para consistência
2. ✅ **Headers**: Excluídos `_next/static` de headers customizados
3. ✅ **Middleware removido**: Estava causando 500 no Edge Runtime
4. ✅ **Lottie imports**: Mudados de `require()` para static imports

## Verificação

### Build Local
```bash
✓ Chunks gerados com hashes corretos:
  - polyfills-42372ed130431b0a.js
  - main-727daab658503b01.js
  - main-app-5eb757d34d4b47be.js

✓ buildManifest.json referencia arquivos corretos
```

### Após Deploy no Vercel

Aguarde ~2-3 minutos para o deploy completar, então:

1. Acesse https://atma.roilabs.com.br/pacientes/tratamento
2. Abra DevTools (F12) → Console
3. Verifique que não há mais erros 404 em `main.js` e `polyfills.js`

## Se Ainda Houver Problemas

### 1. Verificar se o deploy completou
```bash
# Via Vercel Dashboard
https://vercel.com → Seu projeto → Deployments
```

### 2. Forçar redeploy sem cache (se necessário)
```bash
cd Frontend
git commit --allow-empty -m "chore: Force clean rebuild"
git push
```

### 3. Analisar o HTML de produção
```bash
cd Frontend
node analyze-vercel-html.js
```

Isso vai baixar o HTML do Vercel e verificar quais chunks estão sendo referenciados.

### 4. Verificar logs do Vercel
- Acesse: Vercel Dashboard → Seu Projeto → Deployments → [Latest] → Runtime Logs
- Procure por erros 500 ou falhas de build

## Commits da Solução

- `56badee` - Add generateBuildId (VERCEL_GIT_COMMIT_SHA)
- `8fef56a` - Exclude _next/static from custom headers
- `079c6df` - Add debug tools
- `02191b8` - Fix Lottie imports
- `d0c7df8` - Remove middleware causing 500
- `0390586` - Force redeploy
- `1515bf8` - **Apply webpack contenthash fix** ⭐ SOLUÇÃO PRINCIPAL

## Documentação de Referência

- [Next.js Issue #78756](https://github.com/vercel/next.js/issues/78756) - Chunkhash inconsistency
- [Vercel Runtime Logs](https://vercel.com/docs/logs/runtime) - Como acessar logs
- [Next.js Webpack Config](https://nextjs.org/docs/app/api-reference/config/next-config-js/webpack)
