# Deploy no EasyPanel

## 1. Preparação

### Arquivos Criados:
- `Dockerfile` - Configuração do container
- `.dockerignore` - Arquivos ignorados no build
- `docker-compose.yml` - Orquestração dos serviços
- `.env.example` - Template das variáveis de ambiente

## 2. Configuração no EasyPanel

### Passos para Deploy:

1. **Upload do Projeto**
   - Faça upload de todos os arquivos do backend para sua VPS
   - Certifique-se que o Docker está instalado na VPS

2. **Configurar Variáveis de Ambiente**
   - Copie `.env.example` para `.env`
   - Configure as variáveis de produção:
     ```bash
     cp .env.example .env
     nano .env
     ```

3. **Deploy via EasyPanel**
   - No EasyPanel, crie uma nova aplicação
   - Selecione "Docker Compose"
   - Aponte para o arquivo `docker-compose.yml`

### Variáveis Importantes para Produção:

```bash
# Database - Configure com suas credenciais MySQL
DB_HOST=db
DB_USER=atma_user
DB_PASSWORD=sua_senha_segura
DB_NAME=atma_aligner

# CORS - Configure com seu domínio
ALLOWED_ORIGINS=https://seudominio.com

# JWT - Gere uma chave segura
JWT_SECRET=sua_chave_jwt_super_segura

# Email - Configure SMTP
SMTP_HOST=smtp.gmail.com
SMTP_USER=contato@seudominio.com
SMTP_PASS=sua_senha_app
```

## 3. Verificação

Após o deploy, teste:
- Health check: `https://seudominio.com/health`
- API root: `https://seudominio.com/`

## 4. Comandos Úteis

```bash
# Build local (para teste)
docker build -t atma-backend .

# Run com compose
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar serviços
docker-compose down
```