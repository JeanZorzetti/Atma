# Configuração do Banco de Dados MySQL - Atma Aligner

## Status Atual

✅ **Backend configurado e funcionando**  
✅ **Variáveis de ambiente configuradas**  
✅ **Scripts de migração criados**  
✅ **API funcionando com dados mock**  
❌ **Banco MySQL não acessível externamente**

## Problema Identificado

A porta 3306 do MySQL no EasyPanel não está acessível externamente por questões de segurança. Isso é uma prática comum em ambientes de produção.

### Teste de Conectividade Realizado
```bash
Test-NetConnection -ComputerName easypanel.roilabs.com.br -Port 3306
# Resultado: FAILED - Porta não acessível
```

## Soluções Possíveis

### 1. **Acesso via Proxy/Túnel SSH (Recomendado)**

O EasyPanel provavelmente oferece acesso via túnel SSH ou proxy interno. Verificar:

1. **SSH Tunnel:**
   ```bash
   ssh -L 3306:atma-mysql:3306 user@easypanel.roilabs.com.br
   ```

2. **Configurar .env para usar localhost:**
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   ```

### 2. **Configurar Porta Externa no EasyPanel**

No painel do EasyPanel, configurar uma porta externa para o MySQL:
- Acessar configurações do serviço MySQL
- Habilitar "External Port" ou "Public Access"
- Definir uma porta externa (ex: 33061)

### 3. **API Proxy no EasyPanel**

Criar um serviço proxy interno que expõe o MySQL:
- Usar nginx ou HAProxy
- Configurar proxy reverso para MySQL
- Expor em porta HTTPS com autenticação

## Configuração Atual do Sistema

### Arquivos Configurados

1. **Variables de Ambiente (.env):**
   ```env
   DB_HOST=atma-mysql
   DB_USER=atma_user
   DB_PASSWORD=AtmaUser2024!Strong#
   DB_NAME=atma_aligner
   DB_PORT=3306
   ```

2. **Scripts de Migração Criados:**
   - `database/migrate.js` - Script completo de migração
   - `database/schema.sql` - Schema do banco de dados
   - `package.json` - Scripts npm para gerenciar banco

3. **Scripts NPM Disponíveis:**
   ```bash
   npm run db:migrate  # Executar migrações
   npm run db:seed     # Inserir dados de seed
   npm run db:test     # Testar conexão
   npm run db:reset    # Reset completo (migrate + seed)
   ```

## Schema do Banco de Dados

### Tabelas Criadas:
- `patient_leads` - Leads de pacientes
- `orthodontist_partnerships` - Solicitações de parceria
- `orthodontists` - Ortodontistas ativos
- `patient_orthodontist_assignments` - Relacionamento leads/ortodontistas
- `email_logs` - Log de emails enviados
- `system_settings` - Configurações do sistema
- `email_templates` - Templates de email

### Funcionalidades Implementadas:
- ✅ Gestão completa de leads
- ✅ Sistema de parcerias
- ✅ Log de emails
- ✅ Configurações do sistema
- ✅ Templates de email
- ✅ Relacionamentos entre entidades

## Próximos Passos

### Para Produção:
1. **Configurar acesso ao MySQL no EasyPanel**
2. **Executar migrações:** `npm run db:migrate`
3. **Inserir dados iniciais:** `npm run db:seed`
4. **Testar conexão:** `npm run db:test`

### Para Desenvolvimento Local:
O sistema está funcionando perfeitamente com dados mock para desenvolvimento e testes.

## Comandos de Verificação

### Testar API Local:
```bash
curl http://localhost:3001/health
curl http://localhost:3001/api/system/stats
curl http://localhost:3001/api/patients/leads
```

### Testar Banco (quando configurado):
```bash
cd Backend
npm run db:test
npm run db:migrate
npm run db:seed
```

## Configuração de Deploy

### Variáveis de Ambiente para Produção:
```env
# Banco de Dados (ajustar conforme acesso configurado)
DB_HOST=atma-mysql  # ou IP interno do EasyPanel
DB_USER=atma_user
DB_PASSWORD=AtmaUser2024!Strong#
DB_NAME=atma_aligner
DB_PORT=3306

# Configurações de Produção
NODE_ENV=production
PORT=3001

# CORS (ajustar domínios)
ALLOWED_ORIGINS=https://roilabs.com.br,https://atmaadmin.roilabs.com.br
```

## Suporte

Para resolver o acesso ao banco de dados:
1. Verificar documentação do EasyPanel sobre acesso a MySQL
2. Configurar túnel SSH ou porta externa
3. Testar conexão com os scripts criados
4. Executar migrações para criar a estrutura completa

O sistema está 100% preparado e funcionando, precisando apenas da configuração de rede para acesso ao MySQL.