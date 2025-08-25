# Configuração no EasyPanel - Passo a Passo

## 1. 🗄️ Configurar Banco de Dados MySQL

### Opção A: Usar MySQL do EasyPanel
1. No EasyPanel, vá em **Services** → **Database**
2. Clique em **Create MySQL Database**
3. Configure:
   - **Name**: `atma-mysql`
   - **Password**: Gere uma senha forte (ex: `AtmaDB2024!@#`)
   - **Database**: `atma_aligner`

### Opção B: Usar banco externo
- Use um serviço como PlanetScale, Railway, ou Supabase

## 2. 🔐 Gerar Chaves Seguras

### JWT Secret (copie um destes):
```
AtmaJWT2024!SuperSecureKey#9876
a8f5f167f44f4964e6c998dee827110c
Atma@2024$JWT#SecretKey!789
```

### Senha do Banco:
```
AtmaDB2024!Strong#Password
MySQL@Atma2024$Secure!
Database#Atma2024@Strong
```

## 3. ⚙️ Variáveis de Ambiente no EasyPanel

Na sua aplicação no EasyPanel, vá em **Environment Variables** e adicione:

### 🔧 Configurações Básicas
```bash
PORT=3001
NODE_ENV=production
```

### 🗄️ Banco de Dados (MySQL)
```bash
DB_HOST=atma-mysql  # ou IP do banco externo
DB_PORT=3306
DB_USER=root
DB_PASSWORD=SUA_SENHA_FORTE_AQUI
DB_NAME=atma_aligner
```

### 🔐 Segurança
```bash
JWT_SECRET=SUA_CHAVE_JWT_DE_32_CHARS
JWT_EXPIRE=24h
```

### 🌐 CORS (substitua pelo seu domínio)
```bash
ALLOWED_ORIGINS=https://seudominio.com,https://www.seudominio.com
```

### 📧 Email (opcional - pode configurar depois)
```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=contato@seudominio.com
SMTP_PASS=sua_senha_de_app_gmail
```

## 4. 📋 Script SQL Inicial

Depois que o backend estiver rodando, execute este SQL no seu banco:

```sql
-- Criar tabela de configurações do sistema
CREATE TABLE IF NOT EXISTS system_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value TEXT,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Inserir configurações iniciais
INSERT INTO system_settings (setting_key, setting_value, description) VALUES
('app_name', 'Atma Aligner', 'Nome da aplicação'),
('app_version', '1.0.0', 'Versão da aplicação'),
('maintenance_mode', 'false', 'Modo de manutenção');
```

## 5. 🧪 Testar a Aplicação

1. **Health Check**: `https://seu-dominio.com/health`
2. **API Stats**: `https://seu-dominio.com/api/system/stats`
3. **Logs**: Verifique os logs no EasyPanel

## 6. 🔍 Como Descobrir as Informações no EasyPanel

### Para encontrar dados do MySQL:
1. Vá em **Services** → **Databases**
2. Clique no seu MySQL
3. Na aba **Connection**, você verá:
   - **Host**: Nome interno (ex: `atma-mysql`)
   - **Port**: `3306`
   - **User**: `root`
   - **Password**: A que você definiu

### Para ver logs da aplicação:
1. Vá em **Applications** → **Sua App**
2. Aba **Logs** para ver erros
3. Aba **Monitoring** para métricas

## 🚨 Importante

- **NUNCA** commite as senhas reais no Git
- Use senhas fortes para produção
- Configure HTTPS no seu domínio
- Faça backup do banco regularmente

## 🆘 Problemas Comuns

### Erro de conexão com banco:
- Verifique se o MySQL está rodando
- Confirme as credenciais nas env vars
- Teste conexão: `telnet DB_HOST 3306`

### App não inicia:
- Verifique logs no EasyPanel
- Confirme se PORT=3001
- Verifique se todas as env vars estão definidas