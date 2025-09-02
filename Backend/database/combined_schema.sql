-- Schema do banco de dados para Atma Aligner Backend
-- Este arquivo define a estrutura das tabelas necessárias

-- Tabela para leads de pacientes (formulário "Encontre um Doutor")
CREATE TABLE patient_leads (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    cep VARCHAR(10) NOT NULL,
    consentimento BOOLEAN NOT NULL DEFAULT false,
    status ENUM('novo', 'contatado', 'agendado', 'convertido', 'cancelado') DEFAULT 'novo',
    ortodontista_id INT NULL, -- Relacionamento com ortodontista que ficará responsável
    observacoes TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_telefone (telefone),
    INDEX idx_cep (cep),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
);

-- Tabela para solicitações de parceria de ortodontistas
CREATE TABLE orthodontist_partnerships (
    id INT PRIMARY KEY AUTO_INCREMENT,
    -- Passo 1: Informações de contato
    nome VARCHAR(255) NOT NULL,
    clinica VARCHAR(255) NOT NULL,
    cro VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    
    -- Passo 2: Perfil da clínica
    consultórios ENUM('1', '2-3', '4-5', '6+') NOT NULL,
    scanner ENUM('sim', 'nao') NOT NULL,
    scanner_marca VARCHAR(100) NULL,
    casos_mes ENUM('1-5', '6-10', '11-20', '21+') NOT NULL,
    
    -- Passo 3: Interesse
    interesse ENUM('atma-aligner', 'atma-labs', 'ambos') NOT NULL,
    
    -- Passo 4: Mensagem adicional
    mensagem TEXT NULL,
    
    status ENUM('novo', 'analisando', 'proposta-enviada', 'negociacao', 'fechado', 'rejeitado') DEFAULT 'novo',
    responsavel_comercial VARCHAR(255) NULL,
    observacoes_internas TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_cro (cro),
    INDEX idx_status (status),
    INDEX idx_interesse (interesse),
    INDEX idx_created_at (created_at)
);

-- Tabela para ortodontistas parceiros (após fechamento da parceria)
CREATE TABLE orthodontists (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(255) NOT NULL,
    clinica VARCHAR(255) NOT NULL,
    cro VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    endereco_completo TEXT NOT NULL,
    cep VARCHAR(10) NOT NULL,
    cidade VARCHAR(100) NOT NULL,
    estado VARCHAR(2) NOT NULL,
    
    -- Configurações da parceria
    modelo_parceria ENUM('atma-aligner', 'atma-labs') NOT NULL,
    status ENUM('ativo', 'inativo', 'suspenso') DEFAULT 'ativo',
    data_inicio DATE NOT NULL,
    data_fim DATE NULL,
    
    -- Capacidades técnicas
    tem_scanner BOOLEAN DEFAULT false,
    scanner_marca VARCHAR(100) NULL,
    capacidade_mensal INT DEFAULT 0,
    
    -- Informações financeiras
    comissao_percentual DECIMAL(5,2) NULL,
    valor_lab_fee DECIMAL(10,2) NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_cep (cep),
    INDEX idx_cidade_estado (cidade, estado),
    INDEX idx_status (status),
    INDEX idx_modelo_parceria (modelo_parceria)
);

-- Tabela para relacionar leads com ortodontistas
CREATE TABLE patient_orthodontist_assignments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    patient_lead_id INT NOT NULL,
    orthodontist_id INT NOT NULL,
    data_atribuicao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('atribuido', 'contatado', 'agendado', 'consultado', 'convertido', 'perdido') DEFAULT 'atribuido',
    observacoes TEXT NULL,
    
    FOREIGN KEY (patient_lead_id) REFERENCES patient_leads(id) ON DELETE CASCADE,
    FOREIGN KEY (orthodontist_id) REFERENCES orthodontists(id) ON DELETE CASCADE,
    
    INDEX idx_patient_lead (patient_lead_id),
    INDEX idx_orthodontist (orthodontist_id),
    INDEX idx_status (status)
);

-- Tabela para log de emails enviados
CREATE TABLE email_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    to_email VARCHAR(255) NOT NULL,
    to_name VARCHAR(255) NULL,
    subject VARCHAR(500) NOT NULL,
    template_name VARCHAR(100) NOT NULL,
    template_data JSON NULL,
    status ENUM('enviado', 'falhado', 'pendente') NOT NULL,
    provider_response TEXT NULL,
    related_table ENUM('patient_leads', 'orthodontist_partnerships', 'patient_orthodontist_assignments') NULL,
    related_id INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_to_email (to_email),
    INDEX idx_template_name (template_name),
    INDEX idx_status (status),
    INDEX idx_related (related_table, related_id),
    INDEX idx_created_at (created_at)
);

-- Tabela para configurações do sistema
CREATE TABLE system_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT NOT NULL,
    description TEXT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_setting_key (setting_key)
);

-- Inserir configurações padrão
INSERT INTO system_settings (setting_key, setting_value, description) VALUES
('email_from_address', 'contato@atmaaligner.com.br', 'Email remetente padrão'),
('email_from_name', 'Atma Aligner', 'Nome do remetente padrão'),
('admin_email', 'admin@atmaaligner.com.br', 'Email do administrador para notificações'),
('max_distance_km', '50', 'Distância máxima em km para busca de ortodontistas'),
('auto_assignment_enabled', 'true', 'Habilitar atribuição automática de leads');

-- Tabela para armazenar templates de email
CREATE TABLE email_templates (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) UNIQUE NOT NULL,
    subject VARCHAR(500) NOT NULL,
    html_content TEXT NOT NULL,
    text_content TEXT NULL,
    variables JSON NULL, -- Array de variáveis disponíveis no template
    description TEXT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_name (name),
    INDEX idx_is_active (is_active)
);

-- Templates de email padrão
INSERT INTO email_templates (name, subject, html_content, text_content, variables, description) VALUES
(
    'patient_lead_confirmation',
    'Recebemos sua solicitação - Atma Aligner',
    '<h1>Obrigado pelo seu interesse, {{nome}}!</h1><p>Recebemos sua solicitação e em breve um ortodontista parceiro entrará em contato.</p><p>Próximos passos:</p><ul><li>Contato em até 24 horas</li><li>Agendamento da consulta</li><li>Análise do seu caso</li><li>Plano de tratamento personalizado</li></ul>',
    'Obrigado pelo seu interesse! Recebemos sua solicitação e entraremos em contato em breve.',
    '["nome", "email", "telefone"]',
    'Confirmação para pacientes que solicitaram contato'
),
(
    'orthodontist_partnership_confirmation',
    'Recebemos sua solicitação de parceria - Atma Aligner',
    '<h1>Obrigado pelo seu interesse, Dr. {{nome}}!</h1><p>Recebemos sua solicitação de parceria e nossa equipe comercial entrará em contato em até 24 horas.</p><p>Próximos passos:</p><ul><li>Análise do perfil da clínica</li><li>Apresentação dos modelos de parceria</li><li>Demonstração da tecnologia</li><li>Proposta comercial customizada</li></ul>',
    'Obrigado pelo interesse em parceria! Nossa equipe entrará em contato em breve.',
    '["nome", "clinica", "cro", "email"]',
    'Confirmação para ortodontistas que solicitaram parceria'
),
(
    'new_lead_notification',
    'Novo lead atribuído - {{nome}}',
    '<h1>Novo lead atribuído para você!</h1><p><strong>Nome:</strong> {{nome}}</p><p><strong>Telefone:</strong> {{telefone}}</p><p><strong>Email:</strong> {{email}}</p><p><strong>Localização:</strong> {{cep}}</p><p>Entre em contato o quanto antes para agendar a consulta.</p>',
    'Novo lead atribuído: {{nome}} - {{telefone}}. Entre em contato o quanto antes.',
    '["nome", "telefone", "email", "cep"]',
    'Notificação para ortodontistas sobre novos leads'
);-- Tabela para leads do CRM B2B (antes de se tornarem parceiros)
CREATE TABLE crm_leads (
    id INT PRIMARY KEY AUTO_INCREMENT,
    
    -- Informações básicas do lead
    nome VARCHAR(255) NOT NULL,
    clinica VARCHAR(255) NOT NULL,
    cro VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    
    -- Localização
    cep VARCHAR(10) NULL,
    cidade VARCHAR(100) NULL,
    estado VARCHAR(2) NULL,
    endereco_completo TEXT NULL,
    
    -- Perfil comercial
    consultórios ENUM('1', '2-3', '4-5', '6+') NULL,
    scanner ENUM('sim', 'nao') NULL,
    scanner_marca VARCHAR(100) NULL,
    casos_mes ENUM('1-5', '6-10', '11-20', '21+') NULL,
    
    -- Interesse
    interesse ENUM('atma-aligner', 'atma-labs', 'ambos') NULL,
    
    -- Status do pipeline CRM
    status ENUM('prospeccao', 'contato_inicial', 'apresentacao', 'negociacao') DEFAULT 'prospeccao',
    
    -- Gestão comercial
    responsavel_comercial VARCHAR(255) NULL,
    origem_lead ENUM('inbound', 'outbound', 'indicacao', 'evento', 'outro') DEFAULT 'outbound',
    
    -- Notas e observações
    primeira_interacao TEXT NULL,
    observacoes_internas TEXT NULL,
    próximo_followup DATETIME NULL,
    
    -- Timestamps de mudança de status (para calcular conversão)
    data_prospeccao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_contato_inicial TIMESTAMP NULL,
    data_apresentacao TIMESTAMP NULL,
    data_negociacao TIMESTAMP NULL,
    
    -- Timestamps padrão
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Indices
    INDEX idx_status (status),
    INDEX idx_responsavel (responsavel_comercial),
    INDEX idx_created_at (created_at),
    INDEX idx_próximo_followup (próximo_followup)
);

-- Tabela para histórico de atividades do CRM
CREATE TABLE crm_activities (
    id INT PRIMARY KEY AUTO_INCREMENT,
    crm_lead_id INT NOT NULL,
    
    -- Tipo de atividade
    tipo ENUM('ligacao', 'email', 'reuniao', 'apresentacao', 'proposta', 'followup', 'mudanca_status') NOT NULL,
    
    -- Detalhes da atividade
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT NULL,
    status_anterior ENUM('prospeccao', 'contato_inicial', 'apresentacao', 'negociacao') NULL,
    status_novo ENUM('prospeccao', 'contato_inicial', 'apresentacao', 'negociacao') NULL,
    
    -- Quem fez a atividade
    usuario VARCHAR(255) NOT NULL,
    
    -- Agendamento
    agendada_para DATETIME NULL,
    concluida_em DATETIME NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (crm_lead_id) REFERENCES crm_leads(id) ON DELETE CASCADE,
    INDEX idx_lead_id (crm_lead_id),
    INDEX idx_tipo (tipo),
    INDEX idx_agendada_para (agendada_para)
);

-- Inserir alguns leads de exemplo
INSERT INTO crm_leads (
    nome, clinica, cro, email, telefone, 
    consultórios, scanner, casos_mes, interesse, 
    status, responsavel_comercial, origem_lead,
    observacoes_internas
) VALUES
(
    'Dr. João Silva', 'Clínica OrthoSmile', 'CRO-SP 12345', 
    'joao@orthosmile.com.br', '(11) 9999-8888',
    '2-3', 'sim', '11-20', 'atma-aligner',
    'prospeccao', 'Maria Santos', 'outbound',
    'Lead qualificado - tem interesse em tecnologia'
),
(
    'Dra. Ana Costa', 'Costa Ortodontia', 'CRO-RJ 67890',
    'ana@costaortodontia.com.br', '(21) 8888-7777',
    '4-5', 'nao', '21+', 'atma-labs',
    'contato_inicial', 'João Oliveira', 'inbound',
    'Preencheu formulário no site - alto volume'
),
(
    'Dr. Carlos Mendes', 'Mendes & Associados', 'CRO-MG 54321',
    'carlos@mendesortho.com.br', '(31) 7777-6666',
    '6+', 'sim', '21+', 'ambos',
    'apresentacao', 'Maria Santos', 'indicacao',
    'Indicação do Dr. Paulo - muito interessado'
),
(
    'Dra. Lucia Fernandes', 'Sorriso Perfeito', 'CRO-SP 98765',
    'lucia@sorrisoperfeito.com.br', '(11) 6666-5555',
    '2-3', 'nao', '6-10', 'atma-aligner',
    'negociacao', 'João Oliveira', 'evento',
    'Conheceu no congresso - proposta enviada'
);

-- Inserir algumas atividades de exemplo
INSERT INTO crm_activities (
    crm_lead_id, tipo, titulo, descricao, usuario
) VALUES
(1, 'ligacao', 'Primeira ligação', 'Contato inicial realizado, apresentou interesse', 'Maria Santos'),
(2, 'email', 'Envio de material', 'Enviado catálogo e casos de sucesso', 'João Oliveira'),
(3, 'reuniao', 'Apresentação online', 'Demo da plataforma - 45min', 'Maria Santos'),
(4, 'proposta', 'Proposta comercial', 'Enviada proposta personalizada', 'João Oliveira');