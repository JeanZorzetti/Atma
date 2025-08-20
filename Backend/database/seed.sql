-- Dados de exemplo para desenvolvimento/teste
-- Execute este arquivo após o schema.sql

-- Inserir templates de email adicionais
INSERT INTO email_templates (name, subject, html_content, text_content, variables, description) VALUES
(
    'new_partnership_commercial_notification',
    'Nova Solicitação de Parceria - {{nome}} ({{clinica}})',
    '<h1>Nova Solicitação de Parceria Recebida!</h1>
    <div style="background: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 8px;">
        <h2>Dados do Ortodontista</h2>
        <p><strong>Nome:</strong> {{nome}}</p>
        <p><strong>Clínica:</strong> {{clinica}}</p>
        <p><strong>CRO:</strong> {{cro}}</p>
        <p><strong>Email:</strong> {{email}}</p>
        <p><strong>Telefone:</strong> {{telefone}}</p>
    </div>
    
    <div style="background: #f0f8ff; padding: 20px; margin: 20px 0; border-radius: 8px;">
        <h2>Perfil da Clínica</h2>
        <p><strong>Consultórios:</strong> {{consultórios}}</p>
        <p><strong>Scanner:</strong> {{scanner_texto}}</p>
        <p><strong>Casos/mês:</strong> {{casos_mes_texto}}</p>
        <p><strong>Interesse:</strong> {{interesse_texto}}</p>
    </div>
    
    {{#if mensagem}}
    <div style="background: #fff8e1; padding: 20px; margin: 20px 0; border-radius: 8px;">
        <h3>Mensagem Adicional:</h3>
        <p>{{mensagem}}</p>
    </div>
    {{/if}}
    
    <div style="margin-top: 30px; text-align: center;">
        <p>Entre em contato o quanto antes para apresentar nossa proposta comercial.</p>
        <p><strong>ID da Solicitação:</strong> {{requestId}}</p>
    </div>',
    'Nova solicitação de parceria de {{nome}} ({{clinica}}). CRO: {{cro}}. Entre em contato: {{telefone}}',
    '["nome", "clinica", "cro", "email", "telefone", "consultórios", "scanner_texto", "casos_mes_texto", "interesse_texto", "mensagem", "requestId"]',
    'Notificação para equipe comercial sobre nova parceria'
),
(
    'test_email',
    'Teste de Configuração - Atma Aligner Backend',
    '<h1>✅ Teste de Email Realizado com Sucesso!</h1>
    <p>Este é um email de teste para verificar se a configuração SMTP está funcionando corretamente.</p>
    <div style="background: #f5f5f5; padding: 15px; margin: 20px 0; border-radius: 5px;">
        <p><strong>Timestamp:</strong> {{timestamp}}</p>
        <p><strong>Ambiente:</strong> {{environment}}</p>
    </div>
    <p>Se você recebeu este email, a configuração está correta! 🎉</p>',
    'Teste de email realizado em {{timestamp}}. Ambiente: {{environment}}',
    '["timestamp", "environment"]',
    'Template para teste de configuração de email'
),
(
    'patient_follow_up_reminder',
    'Lembrete: Lead sem contato há 48h - {{nome}}',
    '<h1>⚠️ Lembrete de Follow-up</h1>
    <p>O lead <strong>{{nome}}</strong> ainda não foi contatado há mais de 48 horas.</p>
    <div style="background: #fff3cd; padding: 15px; margin: 20px 0; border-radius: 5px;">
        <h3>Dados do Lead:</h3>
        <p><strong>Nome:</strong> {{nome}}</p>
        <p><strong>Email:</strong> {{email}}</p>
        <p><strong>Telefone:</strong> {{telefone}}</p>
        <p><strong>Localização:</strong> {{cep}}</p>
        <p><strong>Data de Criação:</strong> {{created_at}}</p>
    </div>
    <p>Por favor, entre em contato o quanto antes para não perder esta oportunidade.</p>',
    'Lembrete: Lead {{nome}} precisa de follow-up. Telefone: {{telefone}}',
    '["nome", "email", "telefone", "cep", "created_at"]',
    'Lembrete de follow-up para leads de pacientes'
),
(
    'partnership_follow_up_reminder',
    'Lembrete: Proposta de parceria pendente - Dr. {{nome}}',
    '<h1>⚠️ Lembrete de Follow-up Comercial</h1>
    <p>A solicitação de parceria do <strong>Dr. {{nome}}</strong> está pendente há mais de 72 horas.</p>
    <div style="background: #fff3cd; padding: 15px; margin: 20px 0; border-radius: 5px;">
        <h3>Dados da Solicitação:</h3>
        <p><strong>Nome:</strong> Dr. {{nome}}</p>
        <p><strong>Clínica:</strong> {{clinica}}</p>
        <p><strong>CRO:</strong> {{cro}}</p>
        <p><strong>Email:</strong> {{email}}</p>
        <p><strong>Telefone:</strong> {{telefone}}</p>
        <p><strong>Interesse:</strong> {{interesse}}</p>
        <p><strong>Status Atual:</strong> {{status}}</p>
    </div>
    <p>Priorize o contato para não perder esta oportunidade de parceria.</p>',
    'Lembrete: Dr. {{nome}} aguarda contato sobre parceria. Telefone: {{telefone}}',
    '["nome", "clinica", "cro", "email", "telefone", "interesse", "status"]',
    'Lembrete de follow-up para parcerias'
);

-- Inserir dados de exemplo de ortodontistas (para desenvolvimento)
INSERT INTO orthodontists (
    nome, clinica, cro, email, telefone, endereco_completo, 
    cep, cidade, estado, modelo_parceria, tem_scanner, 
    scanner_marca, capacidade_mensal, data_inicio, status
) VALUES
(
    'Dr. João Silva Santos',
    'Clínica OdontoExcelência',
    'CRO-SP 45678',
    'joao@odontoexcelencia.com.br',
    '(11) 99999-1111',
    'Av. Paulista, 1000 - Bela Vista, São Paulo - SP',
    '01310-100',
    'São Paulo',
    'SP',
    'atma-aligner',
    true,
    'iTero Element 5D',
    15,
    '2024-01-15',
    'ativo'
),
(
    'Dra. Maria Fernanda Costa',
    'Costa Ortodontia',
    'CRO-RJ 32109',
    'maria@costortodontia.com.br',
    '(21) 98888-2222',
    'Rua das Laranjeiras, 500 - Laranjeiras, Rio de Janeiro - RJ',
    '22240-006',
    'Rio de Janeiro',
    'RJ',
    'atma-labs',
    true,
    '3Shape TRIOS 4',
    12,
    '2024-02-01',
    'ativo'
),
(
    'Dr. Carlos Eduardo Mendes',
    'Mendes & Associados Ortodontia',
    'CRO-MG 28764',
    'carlos@mendesortodontia.com.br',
    '(31) 97777-3333',
    'Av. Afonso Pena, 2000 - Centro, Belo Horizonte - MG',
    '30112-007',
    'Belo Horizonte',
    'MG',
    'atma-aligner',
    false,
    NULL,
    8,
    '2024-03-10',
    'ativo'
);

-- Inserir dados de exemplo de leads de pacientes (para desenvolvimento)
INSERT INTO patient_leads (nome, email, telefone, cep, consentimento, status, ortodontista_id) VALUES
(
    'Ana Paula Oliveira',
    'ana.paula@email.com',
    '(11) 99123-4567',
    '01310-100',
    true,
    'atribuido',
    1
),
(
    'Roberto Santos Silva',
    'roberto.santos@email.com',
    '(21) 98765-4321',
    '22240-006',
    true,
    'contatado',
    2
),
(
    'Marina Costa Lima',
    'marina.costa@email.com',
    '(31) 97654-3210',
    '30112-007',
    true,
    'novo',
    NULL
);

-- Inserir configurações padrão adicionais
INSERT INTO system_settings (setting_key, setting_value, description) VALUES
('lead_auto_assignment', 'true', 'Habilitar atribuição automática de leads'),
('follow_up_hours_patient', '48', 'Horas para lembrete de follow-up de pacientes'),
('follow_up_hours_partnership', '72', 'Horas para lembrete de follow-up de parcerias'),
('max_leads_per_orthodontist', '20', 'Máximo de leads por ortodontista por mês'),
('email_batch_size', '50', 'Tamanho do lote para envio de emails em massa'),
('cache_expiry_hours', '24', 'Horas para expiração do cache de CEPs'),
('maintenance_hour', '3', 'Hora do dia para executar manutenção automática (0-23)');

-- Inserir exemplos de atribuições
INSERT INTO patient_orthodontist_assignments (patient_lead_id, orthodontist_id, status) VALUES
(1, 1, 'atribuido'),
(2, 2, 'contatado');

-- Atualizar leads com ortodontistas atribuídos
UPDATE patient_leads SET ortodontista_id = 1, status = 'atribuido' WHERE id = 1;
UPDATE patient_leads SET ortodontista_id = 2, status = 'contatado' WHERE id = 2;