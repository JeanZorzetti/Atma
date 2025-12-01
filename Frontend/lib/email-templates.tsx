import * as React from 'react'

// Interface para dados do usuário
interface Usuario {
  nome: string
  email: string
}

// Interface para dados do relatório
interface Relatorio {
  score: number
  custoEstimado: number
  duracaoMeses: number
  complexidade: string
}

// Layout base para emails
const EmailLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        style={{
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          lineHeight: '1.6',
          color: '#333333',
          backgroundColor: '#f5f5f5',
          margin: 0,
          padding: 0,
        }}
      >
        <div
          style={{
            maxWidth: '600px',
            margin: '0 auto',
            backgroundColor: '#ffffff',
          }}
        >
          {/* Header */}
          <div
            style={{
              background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
              padding: '40px 30px',
              textAlign: 'center',
            }}
          >
            <h1
              style={{
                color: '#ffffff',
                fontSize: '32px',
                fontWeight: 'bold',
                margin: 0,
                letterSpacing: '-0.5px',
              }}
            >
              Atma Aligner
            </h1>
            <p
              style={{
                color: '#bfdbfe',
                fontSize: '14px',
                margin: '8px 0 0 0',
              }}
            >
              Seu sorriso perfeito começa aqui
            </p>
          </div>

          {/* Content */}
          <div style={{ padding: '40px 30px' }}>{children}</div>

          {/* Footer */}
          <div
            style={{
              backgroundColor: '#f8fafc',
              padding: '30px',
              borderTop: '1px solid #e2e8f0',
              textAlign: 'center',
            }}
          >
            <p
              style={{
                fontSize: '14px',
                color: '#64748b',
                margin: '0 0 12px 0',
              }}
            >
              © 2024 Atma Aligner - Todos os direitos reservados
            </p>
            <p
              style={{
                fontSize: '12px',
                color: '#94a3b8',
                margin: 0,
              }}
            >
              ROI Labs | São Paulo, Brasil
            </p>
          </div>
        </div>
      </body>
    </html>
  )
}

// Botão padrão para CTAs
const Button: React.FC<{ href: string; children: React.ReactNode }> = ({
  href,
  children,
}) => {
  return (
    <a
      href={href}
      style={{
        display: 'inline-block',
        backgroundColor: '#2563eb',
        color: '#ffffff',
        padding: '14px 32px',
        borderRadius: '8px',
        textDecoration: 'none',
        fontWeight: '600',
        fontSize: '16px',
        marginTop: '20px',
      }}
    >
      {children}
    </a>
  )
}

// Template: Email de Cadastro (Boas-vindas)
export const EmailCadastro = ({ usuario, relatorio }: { usuario: Usuario; relatorio: Relatorio }) => {
  return (
    <EmailLayout>
      <h2
        style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#1e293b',
          marginTop: 0,
          marginBottom: '16px',
        }}
      >
        Olá, {usuario.nome}! 👋
      </h2>

      <p style={{ fontSize: '16px', color: '#475569', marginBottom: '20px' }}>
        Bem-vindo ao <strong>Portal do Paciente Atma Aligner</strong>! Estamos muito felizes em
        tê-lo(a) conosco.
      </p>

      <div
        style={{
          backgroundColor: '#eff6ff',
          border: '2px solid #3b82f6',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '24px',
        }}
      >
        <h3
          style={{
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#1e40af',
            marginTop: 0,
            marginBottom: '12px',
          }}
        >
          📊 Seu Relatório de Viabilidade está pronto!
        </h3>
        <div style={{ fontSize: '15px', color: '#1e40af' }}>
          <p style={{ margin: '8px 0' }}>
            <strong>Score de Viabilidade:</strong> {relatorio.score}/100
          </p>
          <p style={{ margin: '8px 0' }}>
            <strong>Duração Estimada:</strong> {relatorio.duracaoMeses} meses
          </p>
          <p style={{ margin: '8px 0' }}>
            <strong>Investimento:</strong> R$ {relatorio.custoEstimado.toLocaleString('pt-BR')}
          </p>
          <p style={{ margin: '8px 0' }}>
            <strong>Complexidade:</strong> {relatorio.complexidade}
          </p>
        </div>
      </div>

      <p style={{ fontSize: '16px', color: '#475569', marginBottom: '12px' }}>
        No seu portal, você encontrará:
      </p>

      <ul style={{ fontSize: '15px', color: '#64748b', lineHeight: '1.8' }}>
        <li>📊 Análise completa do seu caso ortodôntico</li>
        <li>💰 Simulação financeira e opções de parcelamento</li>
        <li>⏱️ Timeline detalhada do tratamento</li>
        <li>🔬 Tecnologia dos alinhadores invisíveis</li>
        <li>💬 Depoimentos de outros pacientes</li>
        <li>📥 Downloads de relatórios e materiais</li>
        <li>📅 Agendamento de consulta online</li>
      </ul>

      <div style={{ textAlign: 'center', marginTop: '32px' }}>
        <Button href="https://atma.roilabs.com.br/portal">Acessar Meu Portal</Button>
      </div>

      <div
        style={{
          backgroundColor: '#fef3c7',
          border: '1px solid #fbbf24',
          borderRadius: '8px',
          padding: '16px',
          marginTop: '32px',
        }}
      >
        <p
          style={{
            fontSize: '14px',
            color: '#92400e',
            margin: 0,
          }}
        >
          💡 <strong>Dica:</strong> Explore todas as seções do portal para ganhar badges e se
          tornar um "Explorador"!
        </p>
      </div>
    </EmailLayout>
  )
}

// Template: Lembrete 3 Dias (Engajamento)
export const EmailLembrete3Dias = ({ usuario }: { usuario: Usuario }) => {
  return (
    <EmailLayout>
      <h2
        style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#1e293b',
          marginTop: 0,
          marginBottom: '16px',
        }}
      >
        {usuario.nome}, você já explorou tudo? 🔍
      </h2>

      <p style={{ fontSize: '16px', color: '#475569', marginBottom: '20px' }}>
        Notamos que você se cadastrou há alguns dias. Tem alguma dúvida sobre seu relatório de
        viabilidade?
      </p>

      <p style={{ fontSize: '16px', color: '#475569', marginBottom: '24px' }}>
        No seu portal você encontra informações detalhadas sobre:
      </p>

      <div style={{ marginBottom: '16px' }}>
        <div
          style={{
            backgroundColor: '#f1f5f9',
            borderLeft: '4px solid #3b82f6',
            padding: '16px',
            marginBottom: '12px',
            borderRadius: '4px',
          }}
        >
          <h4 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1e293b', margin: '0 0 8px 0' }}>
            📊 Análise do Caso
          </h4>
          <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
            Entenda cada aspecto da sua análise ortodôntica com gráficos interativos
          </p>
        </div>

        <div
          style={{
            backgroundColor: '#f1f5f9',
            borderLeft: '4px solid #10b981',
            padding: '16px',
            marginBottom: '12px',
            borderRadius: '4px',
          }}
        >
          <h4 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1e293b', margin: '0 0 8px 0' }}>
            💰 Plano Financeiro
          </h4>
          <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
            Simule parcelas e veja opções de pagamento que cabem no seu bolso
          </p>
        </div>

        <div
          style={{
            backgroundColor: '#f1f5f9',
            borderLeft: '4px solid #8b5cf6',
            padding: '16px',
            borderRadius: '4px',
          }}
        >
          <h4 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1e293b', margin: '0 0 8px 0' }}>
            💬 Depoimentos
          </h4>
          <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
            Leia histórias reais de pacientes que transformaram seus sorrisos
          </p>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '32px' }}>
        <Button href="https://atma.roilabs.com.br/portal">Continuar Explorando</Button>
      </div>

      <p style={{ fontSize: '14px', color: '#94a3b8', marginTop: '32px', textAlign: 'center' }}>
        Ainda tem dúvidas? Respondemos rapidamente pelo email ou WhatsApp.
      </p>
    </EmailLayout>
  )
}

// Template: Lembrete 7 Dias (Agendamento)
export const EmailLembrete7Dias = ({ usuario }: { usuario: Usuario }) => {
  return (
    <EmailLayout>
      <h2
        style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#1e293b',
          marginTop: 0,
          marginBottom: '16px',
        }}
      >
        {usuario.nome}, que tal agendar sua consulta? 📅
      </h2>

      <p style={{ fontSize: '16px', color: '#475569', marginBottom: '20px' }}>
        Você já explorou seu relatório de viabilidade. O próximo passo é <strong>agendar uma
        consulta presencial</strong> para iniciar seu tratamento!
      </p>

      <div
        style={{
          backgroundColor: '#dcfce7',
          border: '2px solid #10b981',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '24px',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎉</div>
        <h3
          style={{
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#065f46',
            margin: '0 0 12px 0',
          }}
        >
          Avaliação Inicial GRATUITA
        </h3>
        <p style={{ fontSize: '15px', color: '#047857', margin: 0 }}>
          Sem compromisso. Sem taxas. 100% grátis.
        </p>
      </div>

      <p style={{ fontSize: '16px', color: '#475569', marginBottom: '12px' }}>
        Na consulta presencial, você receberá:
      </p>

      <ul style={{ fontSize: '15px', color: '#64748b', lineHeight: '1.8' }}>
        <li>✅ Exame completo com ortodontista especializado</li>
        <li>✅ Escaneamento 3D de alta precisão</li>
        <li>✅ Simulação digital do resultado final</li>
        <li>✅ Plano de tratamento personalizado</li>
        <li>✅ Tirar todas as suas dúvidas presencialmente</li>
      </ul>

      <div style={{ textAlign: 'center', marginTop: '32px' }}>
        <Button href="https://atma.roilabs.com.br/portal/agendar">Agendar Agora</Button>
      </div>

      <div
        style={{
          backgroundColor: '#eff6ff',
          borderRadius: '8px',
          padding: '16px',
          marginTop: '32px',
        }}
      >
        <p
          style={{
            fontSize: '14px',
            color: '#1e40af',
            margin: 0,
          }}
        >
          📍 <strong>Temos unidades em:</strong> São Paulo (Jardins e Morumbi), Rio de Janeiro
          (Ipanema) e atendimento online para todo o Brasil
        </p>
      </div>

      <p style={{ fontSize: '14px', color: '#94a3b8', marginTop: '24px', textAlign: 'center' }}>
        Horários flexíveis de segunda a sábado. Escolha o melhor para você!
      </p>
    </EmailLayout>
  )
}

// Template: Confirmação de Agendamento
export const EmailAgendamento = ({
  usuario,
  agendamento,
}: {
  usuario: Usuario
  agendamento: {
    data: string
    horario: string
    unidade: string
    endereco: string
    tipoConsulta: string
  }
}) => {
  return (
    <EmailLayout>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <div style={{ fontSize: '64px', marginBottom: '8px' }}>✅</div>
        <h2
          style={{
            fontSize: '28px',
            fontWeight: 'bold',
            color: '#10b981',
            margin: 0,
          }}
        >
          Consulta Confirmada!
        </h2>
      </div>

      <p style={{ fontSize: '16px', color: '#475569', marginBottom: '24px' }}>
        Olá, {usuario.nome}! Sua consulta foi agendada com sucesso. Estamos ansiosos para
        conhecê-lo(a)!
      </p>

      <div
        style={{
          backgroundColor: '#f8fafc',
          border: '2px solid #e2e8f0',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '24px',
        }}
      >
        <h3
          style={{
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#1e293b',
            marginTop: 0,
            marginBottom: '16px',
          }}
        >
          📋 Detalhes da Consulta
        </h3>
        <div style={{ fontSize: '15px', color: '#475569' }}>
          <p style={{ margin: '8px 0' }}>
            <strong>Tipo:</strong> {agendamento.tipoConsulta}
          </p>
          <p style={{ margin: '8px 0' }}>
            <strong>Data:</strong> {agendamento.data}
          </p>
          <p style={{ margin: '8px 0' }}>
            <strong>Horário:</strong> {agendamento.horario}
          </p>
          <p style={{ margin: '8px 0' }}>
            <strong>Local:</strong> {agendamento.unidade}
          </p>
          <p style={{ margin: '8px 0', color: '#64748b' }}>{agendamento.endereco}</p>
        </div>
      </div>

      <div
        style={{
          backgroundColor: '#fef3c7',
          border: '1px solid #fbbf24',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '24px',
        }}
      >
        <h4 style={{ fontSize: '16px', fontWeight: 'bold', color: '#92400e', margin: '0 0 8px 0' }}>
          📝 O que levar
        </h4>
        <p style={{ fontSize: '14px', color: '#92400e', margin: 0 }}>
          • Documento com foto (RG ou CNH)<br />
          • Exames odontológicos recentes (se tiver)<br />
          • Carteirinha do convênio (se aplicável)
        </p>
      </div>

      <div style={{ textAlign: 'center', marginTop: '32px' }}>
        <Button href="https://atma.roilabs.com.br/portal">Acessar Meu Portal</Button>
      </div>

      <p style={{ fontSize: '14px', color: '#94a3b8', marginTop: '32px', textAlign: 'center' }}>
        Você receberá um lembrete 24h antes da consulta. Se precisar remarcar, entre em contato
        conosco.
      </p>
    </EmailLayout>
  )
}
