import type { Metadata } from 'next';
import { Calendar, Clock, Tag, TrendingUp, CheckCircle2, Users, Briefcase, Heart, Award, TrendingDown } from 'lucide-react';
import Link from 'next/link';
import { RelatedArticles } from '@/components/blog/related-articles';

export const metadata: Metadata = {
  title: 'Ortodontia Invisível para Adultos: Guia Completo 2025 | Atma',
  description: 'Tudo sobre ortodontia invisível para adultos: benefícios, custos, tempo, resultados. 45% dos pacientes têm 35+ anos. Nunca é tarde para ter o sorriso perfeito.',
  keywords: 'ortodontia adulto, alinhador invisível adultos, aparelho transparente idade, ortodontia 30 anos, ortodontia 40 anos, ortodontia 50 anos',
  openGraph: {
    title: 'Ortodontia Invisível para Adultos: Nunca É Tarde Para Sorrir',
    description: '45% dos pacientes de alinhadores têm 35+ anos. Descubra por que adultos escolhem ortodontia invisível e transformam seus sorrisos.',
    type: 'article',
    publishedTime: '2025-01-20T20:00:00Z',
    authors: ['Equipe Atma Aligner'],
    tags: ['adultos', 'ortodontia', 'idade', 'profissionais'],
  },
  alternates: {
    canonical: 'https://atmaaligner.com.br/blog/ortodontia-invisivel-adultos'
  }
};

export default function OrtodontiaAdultosPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <Link href="/blog" className="text-indigo-100 hover:text-white mb-4 inline-block">
            ← Voltar para o Blog
          </Link>

          <div className="flex items-center gap-2 mb-4">
            <Tag className="w-5 h-5" />
            <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
              Ortodontia para Adultos
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Ortodontia Invisível para Adultos: Nunca É Tarde Para Ter o Sorriso Perfeito
          </h1>

          <div className="flex flex-wrap gap-6 text-sm text-indigo-100">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>20 de janeiro de 2025</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>10 min de leitura</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>Especializado para adultos</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <article className="max-w-4xl mx-auto px-4 py-12">

        {/* Estatística Impactante */}
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border-l-4 border-purple-600 p-6 mb-8 rounded-r-lg">
          <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-purple-600" />
            Você Não Está Sozinho
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg text-center">
              <div className="text-4xl font-bold text-purple-600 mb-1">45%</div>
              <div className="text-sm text-gray-600">Pacientes com 35+ anos</div>
            </div>
            <div className="bg-white p-4 rounded-lg text-center">
              <div className="text-4xl font-bold text-indigo-600 mb-1">1 milhão+</div>
              <div className="text-sm text-gray-600">Adultos tratados/ano no Brasil</div>
            </div>
            <div className="bg-white p-4 rounded-lg text-center">
              <div className="text-4xl font-bold text-blue-600 mb-1">25-55</div>
              <div className="text-sm text-gray-600">Faixa etária mais comum</div>
            </div>
          </div>
        </div>

        {/* Introdução */}
        <div className="prose prose-lg max-w-none mb-12">
          <p className="text-lg text-gray-700 leading-relaxed">
            "Já passou da idade para usar aparelho." Se você já ouviu isso, saiba que é um dos
            <strong> maiores mitos da ortodontia moderna</strong>. A verdade? <strong>Nunca é tarde
            para corrigir seu sorriso.</strong>
          </p>

          <p className="text-gray-700 leading-relaxed">
            Nos últimos 10 anos, houve um <strong>boom de ortodontia em adultos</strong>, especialmente
            com alinhadores invisíveis. Hoje, <strong>45% dos pacientes de ortodontia têm mais de 35 anos</strong>,
            e esse número só cresce.
          </p>

          <p className="text-gray-700 leading-relaxed">
            Neste guia completo, você vai descobrir por que adultos estão escolhendo ortodontia invisível,
            quais são os benefícios específicos para sua faixa etária, quanto custa, quanto tempo leva,
            e se vale a pena começar agora.
          </p>
        </div>

        {/* Por Que Adultos Não Faziam Ortodontia Antes */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">
            Por Que Adultos Evitavam Ortodontia?
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-red-50 p-6 rounded-lg border-l-4 border-red-400">
              <h3 className="text-xl font-bold mb-4 text-red-700">❌ Barreiras do Passado</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <TrendingDown className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Estética:</strong> aparelhos metálicos chamavam muita atenção</span>
                </li>
                <li className="flex items-start gap-2">
                  <TrendingDown className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Profissional:</strong> "aparelho de criança" prejudicava imagem</span>
                </li>
                <li className="flex items-start gap-2">
                  <TrendingDown className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Tempo:</strong> consultas mensais conflitavam com trabalho</span>
                </li>
                <li className="flex items-start gap-2">
                  <TrendingDown className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Desconforto:</strong> dor e emergências constantes</span>
                </li>
                <li className="flex items-start gap-2">
                  <TrendingDown className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Mito:</strong> "já passou da idade"</span>
                </li>
              </ul>
            </div>

            <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-400">
              <h3 className="text-xl font-bold mb-4 text-green-700">✅ O Que Mudou Agora</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Alinhadores invisíveis:</strong> praticamente imperceptíveis</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Discrição total:</strong> ideal para ambiente corporativo</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Menos consultas:</strong> a cada 6-8 semanas (vs mensal)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Conforto:</strong> sem dor intensa, zero emergências</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Ciência:</strong> funciona em qualquer idade</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-6 bg-blue-50 p-6 rounded-lg">
            <p className="text-gray-700 leading-relaxed">
              <strong>A revolução dos alinhadores invisíveis</strong> removeu as principais barreiras
              que impediam adultos de fazer ortodontia. Resultado: <strong>crescimento de 300%</strong>
              em tratamentos ortodônticos para adultos nos últimos 10 anos.
            </p>
          </div>
        </section>

        {/* Por Que Adultos Escolhem Ortodontia Agora */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">
            Por Que Adultos Estão Buscando Ortodontia Agora?
          </h2>

          <div className="space-y-6">
            <div className="bg-white border-2 border-indigo-200 rounded-lg p-6 shadow-md">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Briefcase className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-indigo-700">1. Impacto Profissional</h3>
                  <p className="text-gray-700 mb-3">
                    <strong>Um sorriso bonito influencia diretamente sua carreira:</strong>
                  </p>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Estudos mostram que pessoas com sorriso alinhado são vistas como <strong>mais confiáveis (+37%)</strong></li>
                    <li>• Aumenta chance de promoção em <strong>58%</strong> (pesquisa American Academy of Cosmetic Dentistry)</li>
                    <li>• Melhora primeira impressão em entrevistas e reuniões</li>
                    <li>• Crucial para profissionais de atendimento, vendas, RH, executivos</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white border-2 border-purple-200 rounded-lg p-6 shadow-md">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Heart className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-purple-700">2. Autoestima e Bem-Estar</h3>
                  <p className="text-gray-700 mb-3">
                    <strong>Impacto psicológico é imenso:</strong>
                  </p>
                  <ul className="space-y-2 text-gray-600">
                    <li>• <strong>92% dos adultos</strong> relatam aumento de confiança após ortodontia</li>
                    <li>• Reduz ansiedade social e autossabotagem em fotos</li>
                    <li>• Melhora relacionamentos pessoais e vida social</li>
                    <li>• "Sempre quis fazer, agora tenho condições financeiras"</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white border-2 border-green-200 rounded-lg p-6 shadow-md">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Award className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-green-700">3. Saúde Bucal</h3>
                  <p className="text-gray-700 mb-3">
                    <strong>Não é apenas estética - é saúde:</strong>
                  </p>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Dentes desalinhados acumulam <strong>3x mais placa bacteriana</strong></li>
                    <li>• Aumenta risco de cáries, gengivite e periodontite</li>
                    <li>• Má oclusão causa desgaste anormal dos dentes</li>
                    <li>• Pode causar dores de cabeça, ATM, bruxismo</li>
                    <li>• Ortodontia previne problemas futuros caros</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white border-2 border-blue-200 rounded-lg p-6 shadow-md">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-blue-700">4. Momento de Vida</h3>
                  <p className="text-gray-700 mb-3">
                    <strong>Adultos têm timing perfeito agora:</strong>
                  </p>
                  <ul className="space-y-2 text-gray-600">
                    <li>• <strong>Estabilidade financeira:</strong> pode investir em si mesmo</li>
                    <li>• <strong>Disciplina:</strong> usa os 22h/dia necessários (crianças/teens nem sempre)</li>
                    <li>• <strong>Motivação clara:</strong> sabe exatamente por que quer</li>
                    <li>• <strong>Sem pressa:</strong> tratamento planejado com calma</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Ortodontia por Faixa Etária */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">
            Ortodontia por Faixa Etária: O Que Esperar
          </h2>

          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border-l-4 border-blue-500">
              <h3 className="text-2xl font-bold mb-3 text-blue-800">👨‍💼 25-35 anos: Jovens Profissionais</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Características:</h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Metabolismo ósseo ainda rápido</li>
                    <li>• Início de carreira estabelecida</li>
                    <li>• Alta demanda estética</li>
                    <li>• Vida social ativa</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Tempo Médio:</h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Simples: 6-10 meses</li>
                    <li>• Moderado: 10-14 meses</li>
                    <li>• Complexo: 14-20 meses</li>
                  </ul>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-3">
                <strong>💡 Dica:</strong> Período ideal - movimento rápido + disciplina alta = resultados excelentes
              </p>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border-l-4 border-purple-500">
              <h3 className="text-2xl font-bold mb-3 text-purple-800">👨‍💼 35-45 anos: Profissionais Estabelecidos</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Características:</h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Metabolismo ósseo normal</li>
                    <li>• Carreira consolidada</li>
                    <li>• Busca autoestima + saúde</li>
                    <li>• Estabilidade financeira</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Tempo Médio:</h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Simples: 8-12 meses</li>
                    <li>• Moderado: 12-16 meses</li>
                    <li>• Complexo: 16-22 meses</li>
                  </ul>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-3">
                <strong>💡 Dica:</strong> Faixa etária mais comum em alinhadores - ótimos resultados com disciplina
              </p>
            </div>

            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-6 rounded-lg border-l-4 border-orange-500">
              <h3 className="text-2xl font-bold mb-3 text-orange-800">👨‍🦳 45-55 anos: Maturidade</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Características:</h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Movimento 20-30% mais lento</li>
                    <li>• Alta motivação</li>
                    <li>• Foco em saúde + estética</li>
                    <li>• Máxima disciplina</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Tempo Médio:</h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Simples: 10-14 meses</li>
                    <li>• Moderado: 14-18 meses</li>
                    <li>• Complexo: 18-26 meses</li>
                  </ul>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-3">
                <strong>💡 Dica:</strong> Requer avaliação periodontal cuidadosa - resultados excelentes com acompanhamento
              </p>
            </div>

            <div className="bg-gradient-to-r from-teal-50 to-green-50 p-6 rounded-lg border-l-4 border-teal-500">
              <h3 className="text-2xl font-bold mb-3 text-teal-800">👴 55+ anos: Nunca É Tarde</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Características:</h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Movimento mais lento</li>
                    <li>• Requisito: saúde periodontal</li>
                    <li>• Foco em qualidade de vida</li>
                    <li>• Extrema disciplina</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Tempo Médio:</h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Simples: 12-16 meses</li>
                    <li>• Moderado: 16-22 meses</li>
                    <li>• Avaliação caso a caso</li>
                  </ul>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-3">
                <strong>💡 Dica:</strong> Avaliação periodontal obrigatória - muitos casos de sucesso após 60, 70 anos!
              </p>
            </div>
          </div>
        </section>

        {/* Benefícios Específicos para Adultos */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">
            Por Que Alinhadores São Perfeitos Para Adultos?
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-indigo-500">
              <h3 className="text-xl font-bold mb-4 text-indigo-700">Discrição Profissional</h3>
              <p className="text-gray-700 mb-3">
                Reuniões, apresentações, videochamadas - <strong>ninguém percebe</strong>.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>✓ Transparente 95%</li>
                <li>✓ Não interfere na fala</li>
                <li>✓ Remove para eventos importantes</li>
                <li>✓ Zero constrangimento</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-purple-500">
              <h3 className="text-xl font-bold mb-4 text-purple-700">Flexibilidade de Agenda</h3>
              <p className="text-gray-700 mb-3">
                Menos consultas = mais tempo para trabalho e família.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>✓ Consultas a cada 6-8 semanas</li>
                <li>✓ Consultas rápidas (15-30 min)</li>
                <li>✓ Acompanhamento remoto possível</li>
                <li>✓ Zero emergências</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-green-500">
              <h3 className="text-xl font-bold mb-4 text-green-700">Sem Restrições</h3>
              <p className="text-gray-700 mb-3">
                Vida social, viagens, alimentação - <strong>tudo normal</strong>.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>✓ Come tudo (remove o alinhador)</li>
                <li>✓ Viagens sem preocupação</li>
                <li>✓ Jantares de negócios</li>
                <li>✓ Happy hours liberados</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-blue-500">
              <h3 className="text-xl font-bold mb-4 text-blue-700">Previsibilidade</h3>
              <p className="text-gray-700 mb-3">
                Vê o resultado final <strong>antes de começar</strong>.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>✓ Simulação 3D do resultado</li>
                <li>✓ Tempo exato do tratamento</li>
                <li>✓ Custo total fechado</li>
                <li>✓ Zero surpresas</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Custo-Benefício */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">
            Vale a Pena o Investimento?
          </h2>

          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-8 rounded-xl">
            <h3 className="text-2xl font-bold mb-4 text-gray-900">Análise de ROI do Sorriso</h3>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white p-6 rounded-lg">
                <h4 className="font-bold mb-3 text-lg">💰 Investimento:</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>• R$ 3.990-8.990 (tratamento completo)</li>
                  <li>• 12x sem juros: R$ 332-750/mês</li>
                  <li>• Menos que Netflix + café/dia</li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-lg">
                <h4 className="font-bold mb-3 text-lg">📈 Retorno:</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>• +37% percepção de confiabilidade</li>
                  <li>• +58% chance de promoção</li>
                  <li>• +92% aumento de autoestima</li>
                  <li>• Benefício para vida toda</li>
                </ul>
              </div>
            </div>

            <div className="bg-indigo-100 p-6 rounded-lg">
              <p className="text-gray-800 leading-relaxed">
                <strong>Custo por dia:</strong> R$ 22-50/dia durante tratamento (12 meses).
                <br/>
                <strong>Benefício:</strong> resto da vida.
                <br/>
                <strong>Conclusão:</strong> Um dos melhores investimentos em você mesmo.
              </p>
            </div>
          </div>
        </section>

        {/* Casos Reais de Adultos */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">
            Histórias Reais de Adultos
          </h2>

          <div className="space-y-6">
            <div className="bg-white border-l-4 border-indigo-500 p-6 rounded-r-lg shadow-md">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-indigo-600 font-bold text-xl">42</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Mariana, Executiva de Marketing, 42 anos</h3>
                  <p className="text-sm text-gray-600 mb-3">São Paulo, SP | Duração: 14 meses</p>
                  <p className="text-gray-700 italic mb-3">
                    "Sempre tive vergonha do meu sorriso em reuniões com clientes. Com os alinhadores,
                    ninguém percebeu que eu estava fazendo tratamento. Hoje, 2 anos depois, minha
                    confiança mudou completamente. Consegui uma promoção e atribuo parte disso à
                    segurança que passei a ter."
                  </p>
                  <p className="text-sm text-indigo-600 font-semibold">
                    Problema: Apinhamento moderado + diastema | Resultado: 98% do planejado
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border-l-4 border-purple-500 p-6 rounded-r-lg shadow-md">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-600 font-bold text-xl">55</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Roberto, Dentista, 55 anos</h3>
                  <p className="text-sm text-gray-600 mb-3">Curitiba, PR | Duração: 18 meses</p>
                  <p className="text-gray-700 italic mb-3">
                    "Como dentista, sempre soube que meus dentes eram desalinhados, mas achava que
                    era tarde demais. Aos 53 anos decidi fazer e não me arrependo. O tratamento foi
                    tranquilo, meus pacientes não perceberam, e hoje tenho orgulho do meu sorriso.
                    Nunca é tarde!"
                  </p>
                  <p className="text-sm text-purple-600 font-semibold">
                    Problema: Apinhamento severo + rotação | Resultado: 94% (refinamento incluso)
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border-l-4 border-green-500 p-6 rounded-r-lg shadow-md">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600 font-bold text-xl">31</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Ana Clara, Advogada, 31 anos</h3>
                  <p className="text-sm text-gray-600 mb-3">Rio de Janeiro, RJ | Duração: 11 meses</p>
                  <p className="text-gray-700 italic mb-3">
                    "Trabalho em tribunal, faço sustentações orais frequentemente. Os alinhadores
                    foram perfeitos - não atrapalharam minha dicção e eram invisíveis. Terminei
                    o tratamento pouco antes do meu casamento. Timing perfeito!"
                  </p>
                  <p className="text-sm text-green-600 font-semibold">
                    Problema: Espaçamento + sobremordida leve | Resultado: 100% do planejado
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Conclusão */}
        <section className="mb-12 bg-gradient-to-r from-indigo-50 to-purple-50 p-8 rounded-xl shadow-lg">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">
            Conclusão: O Melhor Momento É Agora
          </h2>

          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p className="text-lg">
              Se você está lendo isso e tem mais de 25 anos, saiba: <strong>você está na faixa etária
              perfeita para ortodontia invisível</strong>.
            </p>

            <div className="bg-white p-6 rounded-lg">
              <h3 className="font-bold text-xl mb-4 text-indigo-700">✅ Resumo Final:</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-600 mt-0.5 flex-shrink-0" />
                  <span><strong>45% dos pacientes têm 35+ anos</strong> - você não está sozinho</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Funciona em qualquer idade</strong> - metabolismo ósseo permite movimentação</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Discreto e profissional</strong> - ideal para ambiente corporativo</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-600 mt-0.5 flex-shrink-0" />
                  <span><strong>ROI comprovado</strong> - impacta carreira e autoestima</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Investimento acessível</strong> - R$ 332-750/mês (12x sem juros)</span>
                </li>
              </ul>
            </div>

            <p className="text-lg font-semibold">
              Não deixe para amanhã. Quanto antes começar, mais cedo terá o sorriso que sempre quis.
            </p>
          </div>
        </section>

        {/* Related Articles */}
        <RelatedArticles
          articles={[
            {
              title: "Alinhador Invisível Funciona? Ciência e Resultados",
              description: "95-98% taxa de sucesso. Veja estudos que comprovam eficácia em adultos.",
              href: "/blog/alinhador-invisivel-funciona",
              tag: "Eficácia"
            },
            {
              title: "Quanto Custa Alinhador Invisível? Guia Completo",
              description: "Preços reais para adultos: R$ 3.990-8.990. Opções de parcelamento.",
              href: "/blog/quanto-custa-alinhador-invisivel",
              tag: "Preços"
            },
            {
              title: "10 Mitos Sobre Aparelho Invisível Desmentidos",
              description: "Descubra a verdade sobre os 10 maiores mitos de alinhadores.",
              href: "/blog/10-mitos-aparelho-invisivel",
              tag: "Mitos"
            },
            {
              title: "Ver Casos Antes e Depois de Adultos",
              description: "Transformações reais de pacientes adultos com alinhadores.",
              href: "/pacientes/antes-depois",
              tag: "Resultados"
            }
          ]}
        />

        {/* CTA Final */}
        <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl p-8 md:p-12 text-center shadow-2xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Pronto Para Transformar Seu Sorriso?
          </h2>
          <p className="text-xl mb-8 text-indigo-100">
            Agende uma avaliação gratuita e veja como alinhadores podem transformar sua vida
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/pacientes"
              className="bg-white text-indigo-600 px-8 py-4 rounded-lg font-semibold hover:bg-indigo-50 transition-colors shadow-lg hover:shadow-xl inline-block"
            >
              Agendar Avaliação Gratuita
            </Link>
            <Link
              href="/pacientes/precos"
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition-colors inline-block"
            >
              Ver Preços e Parcelamento
            </Link>
          </div>
          <p className="mt-6 text-sm text-indigo-100">
            ✓ Sem compromisso &nbsp;•&nbsp; ✓ Simulação 3D &nbsp;•&nbsp; ✓ Orçamento personalizado
          </p>
        </section>

        {/* Schema.org JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              "headline": "Ortodontia Invisível para Adultos: Nunca É Tarde Para Ter o Sorriso Perfeito",
              "description": "Guia completo sobre ortodontia invisível para adultos: benefícios, custos, tempo, resultados. 45% dos pacientes têm 35+ anos.",
              "image": "https://atmaaligner.com.br/og-image-adultos.jpg",
              "author": {
                "@type": "Organization",
                "name": "Atma Aligner"
              },
              "publisher": {
                "@type": "Organization",
                "name": "Atma Aligner",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://atmaaligner.com.br/logo.png"
                }
              },
              "datePublished": "2025-01-20T20:00:00Z",
              "dateModified": "2025-01-20T20:00:00Z"
            })
          }}
        />

      </article>
    </div>
  );
}
