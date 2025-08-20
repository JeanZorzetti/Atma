# Guia de Configuração - Atma Aligner Backend

Este guia detalha o processo completo de configuração do backend para ambiente de desenvolvimento e produção.

## 📋 Pré-requisitos

### Sistema Operacional
- Linux (Ubuntu 20.04+ recomendado)
- Windows 10/11 com WSL2
- macOS 11+

### Software Necessário
- **Node.js**: 18.0.0 ou superior
- **MySQL**: 8.0 ou superior
- **Git**: Controle de versão
- **PM2**: Para produção (opcional)

---

## 🚀 Configuração Desenvolvimento

### 1. Instalação do Node.js

```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verificar instalação
node --version
npm --version
```

### 2. Instalação do MySQL

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install mysql-server

# Configuração inicial
sudo mysql_secure_installation
```

**Configurações recomendadas:**
- Root password: Definir senha forte
- Remove anonymous users: Yes
- Disallow root login remotely: Yes
- Remove test database: Yes
- Reload privilege tables: Yes

### 3. Configuração do Banco de Dados

```bash
# Conectar ao MySQL
sudo mysql -u root -p

# Criar banco e usuário
CREATE DATABASE atma_aligner CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'atma_user'@'localhost' IDENTIFIED BY 'sua_senha_segura';
GRANT ALL PRIVILEGES ON atma_aligner.* TO 'atma_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# Testar conexão
mysql -u atma_user -p atma_aligner
```

### 4. Clone e Instalação do Projeto

```bash
# Clone do repositório
git clone [URL_DO_REPOSITORIO]
cd atma-aligner-backend

# Instalar dependências
npm install

# Criar diretórios necessários
mkdir -p logs uploads
```

### 5. Configuração de Ambiente

```bash
# Copiar arquivo de exemplo
cp .env.example .env

# Editar configurações
nano .env
```

**Configurações essenciais no .env:**

```env
# Servidor
PORT=3001
NODE_ENV=development

# Banco de Dados
DB_HOST=localhost
DB_USER=atma_user
DB_PASSWORD=sua_senha_segura
DB_NAME=atma_aligner
DB_PORT=3306

# Email (Gmail exemplo)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=contato@atmaaligner.com.br
SMTP_PASS=sua_senha_de_app_gmail

# Outros
EMAIL_FROM_ADDRESS=contato@atmaaligner.com.br
EMAIL_FROM_NAME=Atma Align
ADMIN_EMAIL=admin@atmaaligner.com.br
ALLOWED_ORIGINS=http://localhost:3000
```

### 6. Configuração do Email (Gmail)

1. **Ativar 2FA** na conta Google
2. **Gerar senha de app**:
   - Google Account → Security → 2-Step Verification → App passwords
   - Selecionar "Mail" e "Other"
   - Usar a senha gerada no SMTP_PASS

### 7. Inicialização do Banco

```bash
# Executar schema
mysql -u atma_user -p atma_aligner < database/schema.sql

# Inserir dados de exemplo (opcional)
mysql -u atma_user -p atma_aligner < database/seed.sql
```

### 8. Primeira Execução

```bash
# Modo desenvolvimento
npm run dev

# Verificar se está funcionando
curl http://localhost:3001/health
```

**Resposta esperada:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "version": "1.0.0",
  "environment": "development"
}
```

---

## 🔧 Configuração Gmail Detalhada

### Opção 1: Gmail com Senha de App (Recomendado)

1. **Ativar 2FA:**
   - Ir para [myaccount.google.com](https://myaccount.google.com)
   - Security → 2-Step Verification
   - Seguir instruções para ativar

2. **Gerar Senha de App:**
   - Security → 2-Step Verification → App passwords
   - Select app: "Mail"
   - Select device: "Other" → "Atma Align Backend"
   - Copiar senha gerada

3. **Configurar .env:**
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=seuemail@gmail.com
SMTP_PASS=senha_de_app_gerada
```

### Opção 2: SendGrid (Para Produção)

1. **Criar conta:** [sendgrid.com](https://sendgrid.com)
2. **Obter API Key:** Settings → API Keys → Create API Key
3. **Configurar .env:**
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASS=sua_api_key_sendgrid
```

---

## 🔒 Configuração de Segurança

### Firewall (Ubuntu)

```bash
# Ativar UFW
sudo ufw enable

# Permitir SSH
sudo ufw allow ssh

# Permitir apenas portas necessárias
sudo ufw allow 3001/tcp  # API
sudo ufw allow 3306/tcp from localhost  # MySQL apenas local

# Verificar status
sudo ufw status
```

### SSL/HTTPS (Produção)

```bash
# Instalar Certbot
sudo apt install certbot

# Obter certificado
sudo certbot certonly --standalone -d api.atmaaligner.com.br

# Configurar renovação automática
sudo crontab -e
# Adicionar linha:
0 3 * * * certbot renew --quiet
```

---

## 🚀 Configuração Produção

### 1. Instalação PM2

```bash
# Instalar PM2 globalmente
npm install -g pm2

# Copiar configuração
cp ecosystem.config.js.example ecosystem.config.js
```

### 2. Configuração PM2

**ecosystem.config.js:**
```javascript
module.exports = {
  apps: [{
    name: 'atma-aligner-backend',
    script: 'src/server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    log_file: './logs/pm2-combined.log',
    out_file: './logs/pm2-out.log',
    error_file: './logs/pm2-error.log',
    max_memory_restart: '500M'
  }]
};
```

### 3. Deploy com PM2

```bash
# Primeira execução
pm2 start ecosystem.config.js --env production

# Salvar configuração
pm2 save

# Auto-start no boot
pm2 startup
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u $USER --hp $HOME

# Monitoramento
pm2 status
pm2 logs
pm2 monit
```

### 4. Nginx Reverse Proxy

```bash
# Instalar Nginx
sudo apt install nginx

# Configurar site
sudo nano /etc/nginx/sites-available/atma-aligner-api
```

**Configuração Nginx:**
```nginx
server {
    listen 80;
    server_name api.atmaaligner.com.br;
    
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Ativar site
sudo ln -s /etc/nginx/sites-available/atma-aligner-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## 📊 Monitoramento

### Logs

```bash
# Logs da aplicação
tail -f logs/app.log

# Logs de erro
tail -f logs/error.log

# Logs PM2
pm2 logs

# Logs Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Health Checks

```bash
# Script de monitoramento
#!/bin/bash
HEALTH_URL="http://localhost:3001/health"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $HEALTH_URL)

if [ $RESPONSE -eq 200 ]; then
    echo "✅ API está funcionando"
else
    echo "❌ API com problemas - HTTP $RESPONSE"
    # Restartar se necessário
    pm2 restart atma-aligner-backend
fi
```

### Crontab para Manutenção

```bash
# Editar crontab
crontab -e

# Adicionar tarefas
# Limpeza de cache às 3h da manhã
0 3 * * * curl -X POST http://localhost:3001/api/system/maintenance

# Backup do banco às 2h da manhã
0 2 * * * mysqldump -u atma_user -p'senha' atma_aligner > /backups/atma_$(date +\%Y\%m\%d).sql

# Limpeza de logs antigos (manter últimos 30 dias)
0 4 * * * find /path/to/logs -name "*.log" -mtime +30 -delete
```

---

## 🔧 Troubleshooting

### Problemas Comuns

**1. Erro de conexão MySQL:**
```bash
# Verificar se MySQL está rodando
sudo systemctl status mysql

# Verificar configurações
mysql -u atma_user -p -h localhost
```

**2. Porta em uso:**
```bash
# Verificar processo usando porta 3001
sudo netstat -tulpn | grep :3001

# Matar processo se necessário
sudo kill -9 [PID]
```

**3. Emails não enviados:**
```bash
# Testar configuração SMTP
curl -X POST http://localhost:3001/api/emails/test \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# Verificar logs
tail -f logs/app.log | grep email
```

**4. Performance baixa:**
```bash
# Monitorar recursos
htop
pm2 monit

# Verificar logs de erro
pm2 logs --err
```

### Scripts Úteis

**Backup automático:**
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mysqldump -u atma_user -p'senha' atma_aligner > backup_atma_$DATE.sql
gzip backup_atma_$DATE.sql
echo "Backup criado: backup_atma_$DATE.sql.gz"
```

**Restart seguro:**
```bash
#!/bin/bash
echo "Parando aplicação..."
pm2 stop atma-aligner-backend

echo "Atualizando código..."
git pull origin main
npm install

echo "Reiniciando aplicação..."
pm2 start atma-aligner-backend

echo "Verificando saúde..."
sleep 5
curl http://localhost:3001/health
```

---

## 📞 Suporte

Para problemas técnicos:
1. Verificar logs em `logs/`
2. Consultar este guia
3. Contatar: dev@atmaaligner.com.br

**Informações úteis para suporte:**
- Versão do Node.js: `node --version`
- Versão do MySQL: `mysql --version`
- Logs de erro: `tail -50 logs/error.log`
- Status PM2: `pm2 status`