# ⚠️ AÇÃO URGENTE NECESSÁRIA: Vercel Cache Stuck

## 🔴 Problema Atual

O Vercel está servindo um **build antigo com cache** que ainda contém o erro:
```
ReferenceError: window is not defined
at <unknown> (.next/server/chunks/245.js:6:7271)
```

Apesar do fix já estar no código (commit `237e0b9`), o Vercel não está fazendo rebuild limpo.

## ✅ Solução: Force Clean Rebuild no Vercel Dashboard

### Passo 1: Acesse o Vercel Dashboard
1. Vá para https://vercel.com
2. Faça login
3. Selecione o projeto **Atma**

### Passo 2: Delete Build Cache
1. Vá em **Settings** (ícone de engrenagem)
2. No menu lateral, clique em **General**
3. Role até **Build & Development Settings**
4. Procure por **"Build Cache"** ou **"Cache"**
5. Clique em **"Clear Build Cache"** ou **"Purge Cache"**

### Passo 3: Force Redeploy
1. Volte para a aba **Deployments**
2. Encontre o deployment mais recente (provavelmente `414a097` ou `237e0b9`)
3. Clique nos **3 pontinhos** (⋯) ao lado do deployment
4. Selecione **"Redeploy"**
5. **IMPORTANTE**: Na modal que abrir:
   - ✅ **DESMARQUE** "Use existing Build Cache"
   - ✅ **MARQUE** "Force clean build" (se disponível)
6. Clique em **"Redeploy"**

### Passo 4: Aguarde o Build
- O rebuild deve levar ~3-5 minutos
- Acompanhe os logs de build em tempo real
- Procure por mensagens de sucesso

### Passo 5: Verifique se Funcionou
1. Acesse https://atma.roilabs.com.br/
2. Abra DevTools (F12) → Console
3. Verifique se **NÃO** aparecem mais:
   - ❌ `ReferenceError: window is not defined`
   - ❌ `GET 500 Internal Server Error`

4. Acesse https://atma.roilabs.com.br/pacientes/tratamento
5. Verifique se a página carrega sem erro 500

## 🔍 O Que Foi Corrigido

### Commit `237e0b9` - Fix SSR Error
Envolveu `TreatmentProcessAnimation` com `dynamic()` e `ssr: false` na página `/pacientes/visualizacao-3d/page.tsx`.

**Antes (causava erro):**
```tsx
import { TreatmentProcessAnimation } from '@/components/animations'
```

**Depois (correto):**
```tsx
const TreatmentProcessAnimation = dynamic(
  () => import('@/components/animations/treatment-process').then(mod => ({ default: mod.TreatmentProcessAnimation })),
  { ssr: false }
)
```

### Commit `1515bf8` - Fix Webpack Contenthash
Corrigiu inconsistência de chunks no Next.js 15.

### Commit `683b24a` - Fix Backend CORS
Corrigiu wildcard matching para URLs preview do Vercel.

## 📊 Status dos Problemas

| Problema | Status | Commit | Deploy Necessário |
|----------|--------|--------|-------------------|
| Backend CORS | ✅ Corrigido | 683b24a | ✅ Easypanel |
| Frontend SSR Error | ✅ Corrigido | 237e0b9 | ❌ Vercel (cache stuck) |
| Frontend Webpack Chunks | ✅ Corrigido | 1515bf8 | ❌ Vercel (cache stuck) |

## 🆘 Se Ainda Não Funcionar

Se após o clean rebuild o problema persistir, execute:

```bash
cd Frontend
node analyze-vercel-html.js
```

E envie o output completo. Isso vai nos mostrar exatamente o que o Vercel está servindo.

## 📞 Alternativa: Vercel CLI

Se preferir usar CLI:

```bash
# Instalar Vercel CLI (se não tiver)
npm i -g vercel

# Login
vercel login

# Force redeploy sem cache
cd Frontend
vercel --prod --force
```

## ⏰ Última Tentativa de Fix Automático

Foi feito push do commit `414a097` que deleta `.next` localmente e força novo commit, mas isso pode não ser suficiente se o Vercel estiver com cache travado no CDN dele.

**A ação manual no dashboard é NECESSÁRIA.**
