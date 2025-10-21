# URLs para Indexação Manual no Google Search Console

**Data:** 20 de outubro de 2025
**Status:** ✅ Schemas corrigidos - prontos para indexação

---

## 🚨 IMPORTANTE: Aguarde Deploy Completar

Antes de solicitar indexação, **aguarde 5-10 minutos** para o Vercel fazer deploy das correções de schema!

**Schemas corrigidos:**
- ✅ FAQPage duplicado removido
- ✅ Propriedades não-reconhecidas removidas do MedicalProcedure
- ✅ medicalSpecialty formatado corretamente
- ⚠️ Apenas 2 avisos menores restantes (não bloqueiam indexação)

---

## 📋 Copie e Cole no GSC (11 URLs)

### Alta Prioridade (fazer PRIMEIRO) - 4 URLs

```
https://atma.roilabs.com.br/blog/quanto-custa-alinhador-invisivel
https://atma.roilabs.com.br/blog/alinhadores-vs-aparelho-fixo
https://atma.roilabs.com.br/blog/ortodontia-invisivel-adultos
https://atma.roilabs.com.br/blog/alinhador-invisivel-funciona
```

### Média Prioridade - 4 URLs

```
https://atma.roilabs.com.br/blog/invisalign-vs-alinhadores-nacionais
https://atma.roilabs.com.br/blog/10-mitos-aparelho-invisivel
https://atma.roilabs.com.br/blog/alinhadores-tecnologia-alema
https://atma.roilabs.com.br/blog/como-e-feito-molde-alinhador
```

### Específicas (B2B + Local) - 2 URLs

```
https://atma.roilabs.com.br/blog/roi-ortodontia-alinhadores
https://atma.roilabs.com.br/blog/alinhadores-passo-fundo
```

### Página Geral - 1 URL

```
https://atma.roilabs.com.br/blog
```

---

## 🎯 Como Fazer no Google Search Console

### Passo a Passo:

1. **Acesse:** https://search.google.com/search-console
2. **Selecione:** Propriedade `atma.roilabs.com.br`
3. **Clique:** Menu lateral → "Inspeção de URL" (ou pressione Ctrl+K)
4. **Cole:** A primeira URL da lista acima
5. **Aguarde:** Google fazer o teste (15-30 segundos)
6. **Clique:** Botão "SOLICITAR INDEXAÇÃO"
7. **Aguarde:** Confirmação (1-2 minutos por URL)
8. **Repita:** Para todas as 11 URLs

### Atalho Rápido:

- Use **Ctrl+K** no GSC para abrir rapidamente a "Inspeção de URL"
- Copie todas URLs de uma vez e vá colando uma por vez

---

## ⏱️ Timeline Esperado

| Etapa | Tempo |
|-------|-------|
| **Deploy das correções** | 5-10 minutos |
| **Solicitar indexação (11 URLs)** | 15-20 minutos |
| **Google validar schema** | 1-4 horas |
| **Indexação inicial** | 24-72 horas |
| **Aparecer nos resultados** | 3-7 dias |
| **Ranqueamento estável** | 30-60 dias |

---

## ✅ Checklist de Verificação

### Após 24 horas:

Teste se foi indexado com este comando no Google:

```
site:atma.roilabs.com.br/blog/quanto-custa-alinhador-invisivel
```

Se aparecer = ✅ Indexado com sucesso!

### Após 48 horas:

Volte no GSC → "Inspeção de URL" → Digite a URL → Veja se mostra:
- ✅ "URL está no Google"
- ✅ "FAQPage válida" (ou "Dados estruturados válidos")
- ✅ Sem erros críticos

---

## 📊 Métricas para Acompanhar (próximos 30 dias)

No Google Search Console → "Desempenho":

1. **Impressões:** Deve crescer 200-500%
2. **Cliques:** Deve crescer 150-300%
3. **Palavras-chave:** De 1 para 20-50 palavras
4. **Posição média:** Deve melhorar (número menor é melhor)

**Medição base:**
- Setembro: 9 impressões, 3 cliques (baseline)
- Outubro (20/10): 25 impressões, 5 cliques
- **Meta Novembro:** 100-150 impressões, 20-30 cliques
- **Meta Dezembro:** 300-500 impressões, 60-100 cliques

---

## 🎯 Palavras-Chave Alvo (Acompanhar no GSC)

Após 30 dias, estas palavras devem aparecer no GSC:

**Alto Volume:**
- quanto custa alinhador invisível (1.300/mês)
- alinhadores invisíveis vs aparelho fixo (800/mês)
- ortodontia adulto (880/mês)
- alinhador invisível funciona (1.000/mês)

**Médio Volume:**
- invisalign vs alinhadores nacionais (600/mês)
- mitos alinhador invisível (400/mês)
- tecnologia alemã alinhadores (300/mês)

**Local SEO:**
- alinhador invisível passo fundo (50/mês)
- ortodontista passo fundo (100/mês)

**B2B:**
- ortodontista parceria (300/mês)
- aumentar receita ortodontia (150/mês)

---

## 🚨 Se Encontrar Erros

Se ao inspecionar URL aparecer:

### "Item duplicado"
- **Causa:** Cache do Googlebot ainda não atualizou
- **Solução:** Aguarde 24h e solicite novamente

### "Erro de servidor (5xx)"
- **Causa:** Deploy ainda não completou
- **Solução:** Aguarde 10 minutos, tente novamente

### "FAQPage duplicado"
- **Causa:** Googlebot ainda tem cache antigo
- **Solução:** Aguarde 48h para re-crawl automático

### "Propriedade não reconhecida"
- **Causa:** Normal, são apenas avisos (não erros!)
- **Solução:** Pode ignorar, não impede indexação

---

## 📞 Suporte

Se tiver dúvidas:
1. Verifique RICH_RESULTS_OPTIMIZATION.md
2. Verifique PLANO_ACAO_SEO.md (seção KPIs)
3. Consulte Google Search Central: https://search.google.com/search-console/welcome

---

**Última atualização:** 20/10/2025 às 21:30
**Próxima revisão:** 20/11/2025 (30 dias)
