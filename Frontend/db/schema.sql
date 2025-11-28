-- ============================================
-- SCHEMA DO BANCO DE DADOS ATMA CRM
-- Fase 5.1: CRM Integration
-- ============================================

-- Tabela de clientes
CREATE TABLE IF NOT EXISTS clientes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  idade INT,
  cidade VARCHAR(100),
  estado VARCHAR(2),
  telefone VARCHAR(20),
  profissao VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_email (email),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de relatórios
CREATE TABLE IF NOT EXISTS relatorios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cliente_id INT NOT NULL,

  -- Score e análise
  score INT NOT NULL,
  categoria VARCHAR(50) NOT NULL, -- simples, moderado, complexo

  -- Problemas ortodônticos
  problemas_atuais JSON, -- Array de problemas
  problema_principal VARCHAR(100),

  -- Dados do tratamento
  tempo_estimado VARCHAR(50),
  custo_min DECIMAL(10,2),
  custo_max DECIMAL(10,2),
  custo_atma DECIMAL(10,2),
  custo_invisalign DECIMAL(10,2),
  custo_aparelho_fixo DECIMAL(10,2),

  -- Histórico ortodôntico
  ja_usou_aparelho VARCHAR(20),
  problemas_saude JSON, -- Array de problemas de saúde

  -- Expectativas e urgência
  expectativa_resultado VARCHAR(50),
  urgencia_tratamento VARCHAR(50),
  orcamento_recebido VARCHAR(20),
  disponibilidade_uso VARCHAR(50),

  -- Breakdown do score (0-20 cada)
  score_complexidade INT,
  score_idade INT,
  score_historico INT,
  score_saude INT,
  score_expectativas INT,

  -- Metadados
  pdf_gerado BOOLEAN DEFAULT FALSE,
  pdf_enviado BOOLEAN DEFAULT FALSE,
  consulta_agendada BOOLEAN DEFAULT FALSE,
  tratamento_iniciado BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE,
  INDEX idx_cliente (cliente_id),
  INDEX idx_score (score),
  INDEX idx_categoria (categoria),
  INDEX idx_problema_principal (problema_principal),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de consultas agendadas
CREATE TABLE IF NOT EXISTS consultas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cliente_id INT NOT NULL,
  relatorio_id INT,

  -- Dados da consulta
  tipo VARCHAR(50) NOT NULL, -- online, presencial
  status VARCHAR(50) NOT NULL DEFAULT 'agendada', -- agendada, realizada, cancelada, nao_compareceu
  data_agendada DATETIME NOT NULL,
  data_realizada DATETIME,

  -- Pagamento (para consultas online R$ 97)
  valor DECIMAL(10,2),
  pago BOOLEAN DEFAULT FALSE,
  pagamento_id VARCHAR(255), -- ID do Mercado Pago

  -- Notas do ortodontista
  notas TEXT,
  recomendacoes TEXT,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE,
  FOREIGN KEY (relatorio_id) REFERENCES relatorios(id) ON DELETE SET NULL,
  INDEX idx_cliente (cliente_id),
  INDEX idx_status (status),
  INDEX idx_data_agendada (data_agendada)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de tratamentos
CREATE TABLE IF NOT EXISTS tratamentos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cliente_id INT NOT NULL,
  relatorio_id INT,
  consulta_id INT,

  -- Dados do tratamento
  status VARCHAR(50) NOT NULL DEFAULT 'em_avaliacao', -- em_avaliacao, aprovado, em_andamento, concluido, cancelado
  tipo_tratamento VARCHAR(100), -- Atma Aligner, Invisalign, etc.
  valor_contratado DECIMAL(10,2),
  data_inicio DATE,
  data_previsao_fim DATE,
  data_fim DATE,

  -- Ortodontista responsável
  ortodontista_nome VARCHAR(255),
  ortodontista_email VARCHAR(255),
  ortodontista_telefone VARCHAR(20),

  -- Progresso
  alinhadores_totais INT,
  alinhadores_usados INT DEFAULT 0,
  progresso_percentual INT DEFAULT 0,

  -- Notas
  observacoes TEXT,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE,
  FOREIGN KEY (relatorio_id) REFERENCES relatorios(id) ON DELETE SET NULL,
  FOREIGN KEY (consulta_id) REFERENCES consultas(id) ON DELETE SET NULL,
  INDEX idx_cliente (cliente_id),
  INDEX idx_status (status),
  INDEX idx_data_inicio (data_inicio)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de atividades/eventos (log de interações)
CREATE TABLE IF NOT EXISTS atividades (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cliente_id INT NOT NULL,

  tipo VARCHAR(100) NOT NULL, -- relatorio_gerado, email_enviado, consulta_agendada, etc.
  descricao TEXT,
  dados JSON, -- Dados adicionais em formato JSON

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE,
  INDEX idx_cliente (cliente_id),
  INDEX idx_tipo (tipo),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- View para estatísticas gerais
CREATE OR REPLACE VIEW estatisticas_gerais AS
SELECT
  COUNT(DISTINCT c.id) as total_clientes,
  COUNT(r.id) as total_relatorios,
  AVG(r.score) as score_medio,
  COUNT(CASE WHEN r.categoria = 'simples' THEN 1 END) as casos_simples,
  COUNT(CASE WHEN r.categoria = 'moderado' THEN 1 END) as casos_moderados,
  COUNT(CASE WHEN r.categoria = 'complexo' THEN 1 END) as casos_complexos,
  COUNT(CASE WHEN r.consulta_agendada = TRUE THEN 1 END) as consultas_agendadas,
  COUNT(CASE WHEN r.tratamento_iniciado = TRUE THEN 1 END) as tratamentos_iniciados,
  (COUNT(CASE WHEN r.consulta_agendada = TRUE THEN 1 END) / COUNT(r.id) * 100) as taxa_conversao_consulta,
  (COUNT(CASE WHEN r.tratamento_iniciado = TRUE THEN 1 END) / COUNT(r.id) * 100) as taxa_conversao_tratamento
FROM clientes c
LEFT JOIN relatorios r ON c.id = r.cliente_id;

-- View para problemas mais comuns
CREATE OR REPLACE VIEW problemas_mais_comuns AS
SELECT
  problema_principal,
  COUNT(*) as quantidade,
  AVG(score) as score_medio,
  COUNT(CASE WHEN consulta_agendada = TRUE THEN 1 END) as consultas_agendadas,
  (COUNT(CASE WHEN consulta_agendada = TRUE THEN 1 END) / COUNT(*) * 100) as taxa_conversao
FROM relatorios
WHERE problema_principal IS NOT NULL
GROUP BY problema_principal
ORDER BY quantidade DESC;

-- View para relatórios recentes
CREATE OR REPLACE VIEW relatorios_recentes AS
SELECT
  r.id,
  r.created_at,
  c.nome as cliente_nome,
  c.email as cliente_email,
  r.score,
  r.categoria,
  r.problema_principal,
  r.custo_atma,
  r.pdf_gerado,
  r.pdf_enviado,
  r.consulta_agendada,
  r.tratamento_iniciado
FROM relatorios r
INNER JOIN clientes c ON r.cliente_id = c.id
ORDER BY r.created_at DESC
LIMIT 100;
