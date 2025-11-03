# 🚨 REGRAS CRÍTICAS DE SEO - NÃO VIOLAR

## ⚠️ HISTÓRICO DE INCIDENTES

### Incidente #1 - Colapso de Indexação (31/out/2025 - 03/nov/2025)

**O que aconteceu:**
- Remoção de `export const dynamic = 'force-dynamic'` do `Frontend/app/layout.tsx`
- Commit: ab9b2287 (31/out/2025 22:07)

**Impacto:**
- **-91% impressões** (403 → 35)
- **-94% keywords** (32 → 2)
- **-87% CTR** (3,7% → 0%)
- **Custo estimado:** R$ 2.000-5.000 em leads perdidos
- **Tempo de recuperação:** 14-30 dias

**Causa técnica:**
1. Next.js mudou de SSR (Server-Side Rendering) para SSG (Static Site Generation)
2. Vercel cacheou páginas por 2+ dias (Age: 186791 segundos)
3. Google crawlers encontraram conteúdo desatualizado
4. Google interpretou como problema e dropou rankings

**Solução:**
- Restaurado `force-dynamic` (commit e993ba6)
- Resubmetidas 17 URLs ao IndexNow
- Aguardando re-crawl do Google (7-14 dias)

---

## 🛡️ ARQUIVOS PROTEGIDOS

Os seguintes arquivos estão protegidos no `.claude/settings.local.json` e **SEMPRE** exigirão aprovação antes de qualquer edição:

### 1. `Frontend/app/layout.tsx`
**Por que é crítico:**
- Contém `export const dynamic = 'force-dynamic'`
- Controla rendering strategy de TODAS as páginas
- Remoção causa cache agressivo e desindexação

**Regra:**
- ❌ NUNCA remover `export const dynamic = 'force-dynamic'` sem aprovação explícita
- ❌ NUNCA mudar para SSG sem período de teste de 30 dias
- ✅ Sempre consultar usuário antes de qualquer mudança

### 2. `Frontend/public/robots.txt`
**Por que é crítico:**
- Controla quais páginas crawlers podem acessar
- Erro aqui = site inteiro pode ser desindexado

**Regra:**
- ❌ NUNCA adicionar `Disallow: /`
- ❌ NUNCA bloquear `/blog/` ou `/pacientes/`
- ❌ NUNCA bloquear Googlebot, Bingbot

### 3. `Frontend/app/sitemap.ts`
**Por que é crítico:**
- Lista todas as URLs que devem ser indexadas
- Google usa para descobrir páginas novas

**Regra:**
- ❌ NUNCA remover URLs de páginas públicas
- ❌ NUNCA mudar `priority` sem razão clara
- ✅ Sempre adicionar novas páginas ao sitemap

---

## 🚫 AÇÕES PROIBIDAS (Causam perda de tráfego)

### 1. Mudanças de Rendering
```typescript
// ❌ PROIBIDO - Causa cache desatualizado
// export const dynamic = 'force-dynamic'  // REMOVIDO

// ✅ CORRETO - Força rendering dinâmico
export const dynamic = 'force-dynamic'
```

### 2. Meta Tags de Indexação
```typescript
// ❌ PROIBIDO - Desindexação total
robots: {
  index: false,  // NUNCA usar false
  follow: false  // NUNCA usar false
}

// ✅ CORRETO - Permite indexação
robots: {
  index: true,
  follow: true
}
```

### 3. Robots.txt
```
# ❌ PROIBIDO - Bloqueia site inteiro
User-agent: *
Disallow: /

# ✅ CORRETO - Permite tudo exceto admin
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
```

---

## ✅ CHECKLIST PÓS-DEPLOY

Após QUALQUER deploy que toque em arquivos críticos, executar:

### 1. Verificar Indexação (Imediato)
```bash
# Checar se robots.txt está correto
curl https://atma.roilabs.com.br/robots.txt

# Checar se sitemap está acessível
curl https://atma.roilabs.com.br/sitemap.xml

# Checar meta tags de uma página
curl -s https://atma.roilabs.com.br/ | grep -i "robots"
```

### 2. Verificar Cache (Imediato)
```bash
# Verificar headers de cache
curl -I https://atma.roilabs.com.br/

# Procurar por:
# - Age: deve ser baixo (< 3600 segundos)
# - Cache-Control: não deve ter max-age muito alto
# - X-Vercel-Cache: idealmente MISS ou baixo HIT rate
```

### 3. Submeter ao IndexNow (Imediato)
```bash
cd Frontend
npm run indexnow -- --urls https://atma.roilabs.com.br/ [outras URLs]
```

### 4. Monitorar Google Search Console (Diário, por 7 dias)
- Acessar: https://search.google.com/search-console
- Verificar: Desempenho → Últimos 7 dias
- Alertar se: Impressões caírem > 20%
- Alertar se: Keywords caírem > 30%

---

## 📊 MÉTRICAS DE ALERTA

Monitorar estas métricas diariamente após mudanças críticas:

| Métrica | Valor Normal | Alerta Amarelo | Alerta Vermelho |
|---------|--------------|----------------|-----------------|
| Impressões/dia | 400+ | < 300 | < 200 |
| Keywords rankeadas | 32+ | < 25 | < 20 |
| CTR médio | 3,5-4% | < 3% | < 2% |
| Posição média | 6-8 | > 10 | > 15 |

**Se alertas vermelhos ativarem:**
1. Verificar commit mais recente
2. Verificar cache do Vercel
3. Verificar Google Search Console para erros
4. Se necessário, reverter commit e refazer deploy

---

## 🔧 PROCEDIMENTO DE EMERGÊNCIA

Se detectar queda drástica (> 50%) em impressões:

### Passo 1: Investigação Rápida (5 minutos)
```bash
# 1. Verificar robots.txt
curl https://atma.roilabs.com.br/robots.txt

# 2. Verificar meta tags
curl -s https://atma.roilabs.com.br/ | grep -i "robots\|noindex"

# 3. Verificar headers de cache
curl -I https://atma.roilabs.com.br/ | grep -i "age\|cache"

# 4. Verificar sitemap
curl https://atma.roilabs.com.br/sitemap.xml | head -50
```

### Passo 2: Identificar Commit Suspeito (5 minutos)
```bash
# Ver últimos 5 commits
git log --oneline -5

# Ver mudanças em arquivos críticos
git diff HEAD~5 Frontend/app/layout.tsx
git diff HEAD~5 Frontend/app/sitemap.ts
```

### Passo 3: Reverter se Necessário (2 minutos)
```bash
# Reverter último commit (se confirmado problema)
git reset --hard HEAD~1
git push origin main --force

# Ou reverter commit específico
git revert <commit-hash>
git push origin main
```

### Passo 4: Resubmeter URLs (5 minutos)
```bash
cd Frontend
npm run indexnow -- --urls https://atma.roilabs.com.br/ \
  https://atma.roilabs.com.br/blog/alinhadores-vs-aparelho-fixo \
  https://atma.roilabs.com.br/blog/quanto-custa-alinhador-invisivel
```

---

## 📚 RECURSOS

- **Google Search Console:** https://search.google.com/search-console
- **IndexNow API:** https://www.indexnow.org/
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Next.js Rendering Docs:** https://nextjs.org/docs/app/building-your-application/rendering

---

## 💡 LIÇÕES APRENDIDAS

1. **Never remove force-dynamic without 30-day testing period**
   - Test on staging first
   - Monitor Search Console daily
   - Have rollback plan ready

2. **Always monitor after rendering changes**
   - Check cache headers immediately
   - Submit to IndexNow within 1 hour
   - Watch Search Console for 7 days

3. **Cache is the enemy of SEO when misconfigured**
   - Aggressive caching = stale content for Google
   - SSG great for performance, bad if not monitored
   - Dynamic rendering safer for SEO-critical sites

4. **Recovery takes time**
   - Google re-crawl: 3-7 days
   - Ranking recovery: 7-14 days
   - Full recovery: 14-30 days
   - Be patient, don't make more changes during recovery

---

## 🎯 CONTATOS DE EMERGÊNCIA

Se incidente SEO crítico (> 70% queda em impressões):

1. **Primeiro:** Reverter mudança imediatamente
2. **Segundo:** Notificar Jean Zorzetti
3. **Terceiro:** Documentar incidente neste arquivo
4. **Quarto:** Atualizar regras de proteção se necessário

---

**Última atualização:** 03/nov/2025
**Próxima revisão:** 03/dez/2025
**Responsável:** Claude Code + Jean Zorzetti
