# Correção CORS - Deploy Necessário

## Problema
O frontend em `https://atma.roilabs.com.br` está sendo bloqueado pelo CORS da API em `https://atmaapi.roilabs.com.br`.

## Solução
Precisa atualizar a variável de ambiente `ALLOWED_ORIGINS` no servidor de produção.

## Opções de Deploy

### Opção 1: Variável de Ambiente (Recomendado)
Configurar no servidor de produção:
```bash
ALLOWED_ORIGINS=http://localhost:3000,https://atma.roilabs.com.br,https://atmaadmin.roilabs.com.br,https://roilabs.com.br
```

### Opção 2: Rebuild Docker Container
Se usando Docker, rebuildar o container com o código atualizado:
```bash
# No servidor de produção
git pull origin main
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Opção 3: Deploy Manual
1. Fazer upload do arquivo `src/server.js` atualizado
2. Reiniciar o serviço backend

## Verificação
Após o deploy, testar:
```bash
curl -X OPTIONS \
  -H "Origin: https://atma.roilabs.com.br" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  https://atmaapi.roilabs.com.br/api/patients/leads -v
```

Deve retornar headers de CORS permitindo a origem.

## Status
- ✅ Código atualizado e commitado
- ❌ Deploy pendente no servidor de produção