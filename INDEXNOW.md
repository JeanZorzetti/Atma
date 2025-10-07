# IndexNow - Indexação Instantânea

## 📋 O que é?

O **IndexNow** é um protocolo aberto que permite notificar instantaneamente mecanismos de busca (Bing, Yandex, Naver, Seznam.cz) sobre alterações de conteúdo no site, acelerando a indexação de páginas novas ou atualizadas.

## 🔑 Chave de Autenticação

**Chave:** `e53ec1808701e6b8af6a265d09c3df019cf21cb234b2d33a1d7054290d3064fb`

**Localização:** `/public/e53ec1808701e6b8af6a265d09c3df019cf21cb234b2d33a1d7054290d3064fb.txt`

Esta chave comprova a propriedade do domínio `atma.roilabs.com.br` e é usada em todas as submissões.

## 🚀 Como Usar

### 1. Via Script Manual (Recomendado para Deploy)

```bash
cd Frontend

# Submeter todo o sitemap (todas as páginas)
npm run indexnow

# Submeter uma única URL
npm run indexnow -- --url https://atma.roilabs.com.br/pacientes/precos

# Submeter múltiplas URLs
npm run indexnow -- --urls https://atma.roilabs.com.br/page1 https://atma.roilabs.com.br/page2
```

**Quando usar:**
- ✅ Após deploy em produção
- ✅ Após correções de SEO importantes (canonical, meta descriptions, etc.)
- ✅ Após adicionar novas páginas ou conteúdo
- ✅ Após atualizar informações importantes (preços, serviços, etc.)

### 2. Via API Route

A rota `/api/indexnow` está disponível para submissões programáticas:

```bash
# POST - Submeter múltiplas URLs
curl -X POST https://atma.roilabs.com.br/api/indexnow \
  -H "Content-Type: application/json" \
  -d '{
    "urls": [
      "https://atma.roilabs.com.br/pacientes/precos",
      "https://atma.roilabs.com.br/ortodontistas/vantagens"
    ]
  }'

# GET - Submeter uma única URL
curl "https://atma.roilabs.com.br/api/indexnow?url=https://atma.roilabs.com.br/pacientes"
```

### 3. Via Biblioteca JavaScript

Use o utilitário `lib/indexnow.ts` no código Next.js:

```typescript
import { submitUrl, submitUrls, submitSitemap } from '@/lib/indexnow'

// Submeter página atual
await submitUrl('https://atma.roilabs.com.br/pacientes/precos')

// Submeter múltiplas páginas
await submitUrls([
  'https://atma.roilabs.com.br/pacientes',
  'https://atma.roilabs.com.br/ortodontistas'
])

// Submeter todo o sitemap
await submitSitemap()
```

**Exemplo com submissão condicional (apenas em produção):**

```typescript
import { createIndexNowSubmitter } from '@/lib/indexnow'

const indexnow = createIndexNowSubmitter()

// Submeter após atualização de conteúdo
await indexnow.submitPath('/pacientes/precos')

// Submeter múltiplas páginas
await indexnow.submitPaths([
  '/pacientes/precos',
  '/ortodontistas/modelos-parceria'
])

// Submeter sitemap completo
await indexnow.submitAll()
```

## 📊 Mecanismos de Busca Suportados

O sistema envia para todos estes endpoints automaticamente:

- ✅ **IndexNow API** (endpoint universal)
- ✅ **Bing** (Microsoft)
- ✅ **Yandex** (Rússia)
- ✅ **Naver** (Coreia do Sul)

**Nota:** Google não suporta IndexNow, mas continua usando sitemap.xml e Google Search Console.

## 📁 Arquivos Criados

```
Frontend/
├── public/
│   └── e53ec1808701e6b8af6a265d09c3df019cf21cb234b2d33a1d7054290d3064fb.txt
├── app/
│   └── api/
│       └── indexnow/
│           └── route.ts
├── lib/
│   └── indexnow.ts
└── package.json (scripts adicionados)

scripts/
└── submit-to-indexnow.ts
```

## 🔒 Segurança

- ✅ A chave é pública (necessária pelo protocolo)
- ✅ Validação de URLs (apenas atma.roilabs.com.br)
- ✅ Limite de 10.000 URLs por requisição
- ✅ Proteção contra submissões inválidas

## 📈 Boas Práticas

### ✅ FAÇA:
- Submeta URLs após mudanças reais de conteúdo
- Use após deploys em produção
- Submeta páginas novas imediatamente
- Agrupe URLs relacionadas em batch (mais eficiente)

### ❌ NÃO FAÇA:
- Submeter a mesma URL repetidamente sem mudanças
- Enviar mais de 10.000 URLs por requisição
- Usar em desenvolvimento (apenas produção)
- Submeter URLs de outros domínios

## 🎯 Casos de Uso Comuns

### 1. Após Deploy de Produção
```bash
npm run indexnow
```

### 2. Após Correção de SEO
```bash
npm run indexnow -- --urls \
  https://atma.roilabs.com.br/pacientes/precos \
  https://atma.roilabs.com.br/ortodontistas/vantagens
```

### 3. Nova Página Criada
```typescript
// No código de criação de conteúdo
await submitUrl('https://atma.roilabs.com.br/nova-pagina')
```

### 4. Atualização de Conteúdo Importante
```typescript
// Após salvar mudanças
await submitPath('/pacientes/precos')
```

## 🔍 Verificação

Para verificar se a chave está acessível:

```bash
curl https://atma.roilabs.com.br/e53ec1808701e6b8af6a265d09c3df019cf21cb234b2d33a1d7054290d3064fb.txt
```

Deve retornar: `e53ec1808701e6b8af6a265d09c3df019cf21cb234b2d33a1d7054290d3064fb`

## 📚 Recursos

- [Documentação Oficial IndexNow](https://www.indexnow.org/)
- [Bing IndexNow Plugin](https://www.bing.com/indexnow)
- [Verificar Status no Bing Webmaster Tools](https://www.bing.com/webmasters)

## 💡 Próximos Passos

1. ✅ **Instalar dependências** (após commit):
   ```bash
   cd Frontend
   npm install
   ```

2. ✅ **Testar submissão manual** (após deploy):
   ```bash
   npm run indexnow
   ```

3. 🔄 **Automatizar no CI/CD** (opcional):
   Adicionar ao workflow de deploy:
   ```yaml
   - name: Notify search engines
     run: cd Frontend && npm run indexnow
   ```

4. 📊 **Monitorar no Bing Webmaster Tools**:
   - Cadastrar site em https://www.bing.com/webmasters
   - Verificar IndexNow submissions na dashboard
