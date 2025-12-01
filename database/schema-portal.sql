-- ============================================
-- Schema do Portal do Paciente Atma
-- Database: atmadb
-- Criado em: 2025-12-01
-- ============================================

-- Tabela de usuários do portal
-- Sincronizada com Clerk via webhook
CREATE TABLE IF NOT EXISTS portal_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  clerk_user_id VARCHAR(255) NOT NULL UNIQUE COMMENT 'ID do usuário no Clerk',
  email VARCHAR(255) NOT NULL UNIQUE COMMENT 'Email do usuário',
  nome VARCHAR(255) NOT NULL COMMENT 'Nome completo',
  telefone VARCHAR(20) NULL COMMENT 'Telefone de contato',
  cpf VARCHAR(14) NULL COMMENT 'CPF do paciente',
  data_nascimento DATE NULL COMMENT 'Data de nascimento',
  foto_url TEXT NULL COMMENT 'URL da foto de perfil',

  -- Metadados
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Data de criação',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Última atualização',
  last_login_at TIMESTAMP NULL COMMENT 'Último login',

  -- Índices
  INDEX idx_email (email),
  INDEX idx_clerk_user_id (clerk_user_id),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Usuários do Portal do Paciente';

-- Tabela de relatórios de viabilidade
-- Cada usuário pode ter múltiplos relatórios ao longo do tempo
CREATE TABLE IF NOT EXISTS portal_relatorios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL COMMENT 'FK para portal_users.id',

  -- Dados do relatório (JSON)
  dados_json JSON NOT NULL COMMENT 'Dados completos do relatório em JSON',

  -- Dados principais (desnormalizados para queries rápidas)
  score DECIMAL(3,1) NOT NULL COMMENT 'Score de viabilidade (0.0 - 10.0)',
  custo_estimado DECIMAL(10,2) NULL COMMENT 'Custo estimado em reais',
  duracao_meses INT NULL COMMENT 'Duração estimada do tratamento em meses',
  complexidade ENUM('Simples', 'Moderada', 'Complexa', 'Muito Complexa') NULL COMMENT 'Nível de complexidade',
  status ENUM('novo', 'em_analise', 'ativo', 'concluido', 'cancelado') DEFAULT 'novo' COMMENT 'Status do relatório',

  -- Controle de pagamento
  payment_id VARCHAR(255) NULL COMMENT 'ID do pagamento no Mercado Pago',
  payment_status ENUM('pending', 'approved', 'rejected', 'cancelled', 'refunded') NULL COMMENT 'Status do pagamento',
  amount_paid DECIMAL(10,2) NULL COMMENT 'Valor pago',
  paid_at TIMESTAMP NULL COMMENT 'Data do pagamento',

  -- Controle de expiração
  expires_at TIMESTAMP NULL COMMENT 'Data de expiração do acesso',
  is_active BOOLEAN DEFAULT TRUE COMMENT 'Relatório ativo/inativo',

  -- PDF
  pdf_url TEXT NULL COMMENT 'URL do PDF gerado',
  pdf_generated_at TIMESTAMP NULL COMMENT 'Data de geração do PDF',

  -- Metadados
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Data de criação',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Última atualização',

  -- Relacionamentos
  FOREIGN KEY (user_id) REFERENCES portal_users(id) ON DELETE CASCADE,

  -- Índices
  INDEX idx_user_id (user_id),
  INDEX idx_status (status),
  INDEX idx_payment_id (payment_id),
  INDEX idx_created_at (created_at),
  INDEX idx_is_active (is_active),
  INDEX idx_score (score)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Relatórios de viabilidade dos pacientes';

-- Tabela de logs de acesso ao portal
-- Para auditoria e análise de uso
CREATE TABLE IF NOT EXISTS portal_acessos (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL COMMENT 'FK para portal_users.id',

  -- Dados do acesso
  ip_address VARCHAR(45) NOT NULL COMMENT 'IP do usuário (IPv4 ou IPv6)',
  user_agent TEXT NULL COMMENT 'User agent do navegador',
  device_type ENUM('desktop', 'mobile', 'tablet', 'unknown') DEFAULT 'unknown' COMMENT 'Tipo de dispositivo',

  -- Página acessada
  page_url VARCHAR(500) NOT NULL COMMENT 'URL da página acessada',
  page_type ENUM('dashboard', 'analise', 'financeiro', 'timeline', 'tecnologia', 'depoimentos', 'perguntas', 'downloads', 'outros') DEFAULT 'outros' COMMENT 'Tipo de página',

  -- Ação realizada
  action VARCHAR(100) NULL COMMENT 'Ação realizada (login, download_pdf, etc.)',

  -- Geolocalização (opcional)
  country_code CHAR(2) NULL COMMENT 'Código do país (ISO 3166-1 alpha-2)',
  city VARCHAR(100) NULL COMMENT 'Cidade',

  -- Metadados
  accessed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Data e hora do acesso',

  -- Relacionamentos
  FOREIGN KEY (user_id) REFERENCES portal_users(id) ON DELETE CASCADE,

  -- Índices
  INDEX idx_user_id (user_id),
  INDEX idx_accessed_at (accessed_at),
  INDEX idx_page_type (page_type),
  INDEX idx_action (action),
  INDEX idx_ip_address (ip_address)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Logs de acesso ao portal';

-- Tabela de interações do usuário
-- Para gamificação e tracking de engajamento
CREATE TABLE IF NOT EXISTS portal_interacoes (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL COMMENT 'FK para portal_users.id',
  relatorio_id INT NULL COMMENT 'FK para portal_relatorios.id (opcional)',

  -- Tipo de interação
  tipo ENUM(
    'visualizou_score',
    'baixou_pdf',
    'compartilhou_relatorio',
    'agendou_consulta',
    'calculou_parcela',
    'visitou_secao',
    'completou_checklist',
    'assistiu_video',
    'leu_depoimento',
    'fez_pergunta',
    'outros'
  ) NOT NULL COMMENT 'Tipo de interação',

  -- Detalhes
  detalhes JSON NULL COMMENT 'Detalhes adicionais em JSON',

  -- Metadados
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Data da interação',

  -- Relacionamentos
  FOREIGN KEY (user_id) REFERENCES portal_users(id) ON DELETE CASCADE,
  FOREIGN KEY (relatorio_id) REFERENCES portal_relatorios(id) ON DELETE SET NULL,

  -- Índices
  INDEX idx_user_id (user_id),
  INDEX idx_relatorio_id (relatorio_id),
  INDEX idx_tipo (tipo),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Interações dos usuários no portal';

-- Tabela de preferências do usuário
-- Para personalização da experiência
CREATE TABLE IF NOT EXISTS portal_preferencias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE COMMENT 'FK para portal_users.id',

  -- Notificações
  notificacoes_email BOOLEAN DEFAULT TRUE COMMENT 'Receber emails',
  notificacoes_sms BOOLEAN DEFAULT FALSE COMMENT 'Receber SMS',

  -- Preferências de comunicação
  idioma VARCHAR(5) DEFAULT 'pt-BR' COMMENT 'Idioma preferido',
  timezone VARCHAR(50) DEFAULT 'America/Sao_Paulo' COMMENT 'Fuso horário',

  -- Marketing
  aceita_marketing BOOLEAN DEFAULT FALSE COMMENT 'Aceita comunicação de marketing',
  aceita_pesquisas BOOLEAN DEFAULT TRUE COMMENT 'Aceita participar de pesquisas',

  -- Privacidade
  perfil_publico BOOLEAN DEFAULT FALSE COMMENT 'Perfil público para depoimentos',
  compartilhar_antes_depois BOOLEAN DEFAULT FALSE COMMENT 'Permitir uso de fotos antes/depois',

  -- Outras preferências (JSON para flexibilidade)
  outras_preferencias JSON NULL COMMENT 'Outras preferências em JSON',

  -- Metadados
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Data de criação',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Última atualização',

  -- Relacionamentos
  FOREIGN KEY (user_id) REFERENCES portal_users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Preferências dos usuários';

-- ============================================
-- Views úteis
-- ============================================

-- View de relatórios ativos com dados do usuário
CREATE OR REPLACE VIEW vw_relatorios_ativos AS
SELECT
  r.id AS relatorio_id,
  r.score,
  r.custo_estimado,
  r.duracao_meses,
  r.complexidade,
  r.status,
  r.created_at AS relatorio_criado_em,
  u.id AS user_id,
  u.clerk_user_id,
  u.email,
  u.nome,
  u.telefone,
  r.payment_status,
  r.amount_paid,
  r.paid_at
FROM portal_relatorios r
INNER JOIN portal_users u ON r.user_id = u.id
WHERE r.is_active = TRUE
  AND (r.expires_at IS NULL OR r.expires_at > NOW());

-- View de estatísticas de uso por usuário
CREATE OR REPLACE VIEW vw_estatisticas_uso AS
SELECT
  u.id AS user_id,
  u.nome,
  u.email,
  COUNT(DISTINCT a.id) AS total_acessos,
  COUNT(DISTINCT DATE(a.accessed_at)) AS dias_ativos,
  MAX(a.accessed_at) AS ultimo_acesso,
  COUNT(DISTINCT i.id) AS total_interacoes,
  (
    SELECT COUNT(*)
    FROM portal_interacoes i2
    WHERE i2.user_id = u.id
      AND i2.tipo = 'baixou_pdf'
  ) AS downloads_pdf,
  (
    SELECT COUNT(*)
    FROM portal_interacoes i2
    WHERE i2.user_id = u.id
      AND i2.tipo = 'compartilhou_relatorio'
  ) AS compartilhamentos
FROM portal_users u
LEFT JOIN portal_acessos a ON u.id = a.user_id
LEFT JOIN portal_interacoes i ON u.id = i.user_id
GROUP BY u.id, u.nome, u.email;

-- ============================================
-- Triggers
-- ============================================

-- Trigger para atualizar last_login_at do usuário
DELIMITER //
CREATE TRIGGER trg_update_last_login
AFTER INSERT ON portal_acessos
FOR EACH ROW
BEGIN
  UPDATE portal_users
  SET last_login_at = NEW.accessed_at
  WHERE id = NEW.user_id;
END//
DELIMITER ;

-- ============================================
-- Dados iniciais (opcional)
-- ============================================

-- Inserir preferências padrão para novos usuários será feito via trigger ou application code
