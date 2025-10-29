import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Dor de Cabeça Constante? Pode Ser Má Oclusão Dentária | Atma Aligner',
  description: 'Dor de cabeça todos os dias? Descubra como má oclusão dentária (DTM) pode causar dor de cabeça crônica e como ortodontia invisível pode resolver o problema.',
  keywords: 'dor de cabeça constante, dor de cabeça todos os dias, dor de cabeça na nuca, má oclusão dentária, DTM, dor de cabeça e dentes, alinhador invisível',
  openGraph: {
    title: 'Dor de Cabeça Constante? Pode Ser Má Oclusão Dentária',
    description: '10 causas de dor de cabeça crônica + como má oclusão dentária pode estar causando suas dores.',
    type: 'article',
    publishedTime: '2025-10-29T00:00:00Z',
    authors: ['Atma Aligner'],
    images: [
      {
        url: '/images/blog/dor-cabeca-destaque.png',
        width: 1080,
        height: 628,
        alt: 'Pessoa com dor de cabeça causada por má oclusão dentária (DTM)'
      }
    ]
  }
};

export default function DorCabecaArticle() {
  return (
    <article className="max-w-4xl mx-auto px-4 py-12">
      {/* Breadcrumbs */}
      <nav className="text-sm mb-8" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2 text-gray-600">
          <li><Link href="/" className="hover:text-purple-600">Início</Link></li>
          <li>/</li>
          <li><Link href="/blog" className="hover:text-purple-600">Blog</Link></li>
          <li>/</li>
          <li className="text-gray-900">Dor de Cabeça Constante</li>
        </ol>
      </nav>

      {/* Header */}
      <header className="mb-12">
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
          <time dateTime="2025-10-29">29 de outubro de 2025</time>
          <span>•</span>
          <span>10 min de leitura</span>
          <span>•</span>
          <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full">Saúde Bucal</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
          Dor de Cabeça Constante? Pode Ser Má Oclusão Dentária
        </h1>

        <p className="text-xl text-gray-700 leading-relaxed">
          Você tem dor de cabeça todos os dias e não sabe por quê? Ibuprofeno só alivia temporariamente?
          O problema pode estar na sua boca. Descubra como má oclusão dentária causa dores de cabeça crônicas
          e como resolver definitivamente.
        </p>
      </header>

      {/* Featured Image */}
      <div className="relative w-full h-[400px] mb-12 rounded-2xl overflow-hidden">
        <Image
          src="/images/blog/dor-cabeca-destaque.png"
          alt="Pessoa com dor de cabeça crônica causada por má oclusão dentária (DTM)"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Alert Box */}
      <div className="bg-red-50 border-l-4 border-red-600 p-6 mb-12 rounded-r-lg">
        <h3 className="text-lg font-bold text-red-900 mb-2">⚠️ Importante:</h3>
        <p className="text-red-800">
          Dor de cabeça pode indicar condições sérias. Se você tem dor súbita e intensa,
          febre, rigidez no pescoço, confusão mental ou perda de visão, procure atendimento médico imediatamente.
        </p>
      </div>

      {/* Table of Contents */}
      <div className="bg-gray-50 border-l-4 border-purple-600 p-6 mb-12 rounded-r-lg">
        <h2 className="text-lg font-bold text-gray-900 mb-4">📋 Neste Artigo:</h2>
        <nav>
          <ol className="space-y-2 text-gray-700">
            <li><a href="#causas" className="hover:text-purple-600">1. 10 Causas de Dor de Cabeça Constante</a></li>
            <li><a href="#ma-oclusao" className="hover:text-purple-600">2. Má Oclusão Dentária: A Causa Silenciosa</a></li>
            <li><a href="#dtm" className="hover:text-purple-600">3. O Que É DTM?</a></li>
            <li><a href="#teste" className="hover:text-purple-600">4. Teste: Sua Dor de Cabeça É Dentária?</a></li>
            <li><a href="#tratamento" className="hover:text-purple-600">5. Tratamento Para Má Oclusão</a></li>
            <li><a href="#quando-procurar" className="hover:text-purple-600">6. Médico vs Dentista: Quando Procurar?</a></li>
            <li><a href="#faq" className="hover:text-purple-600">7. Perguntas Frequentes</a></li>
          </ol>
        </nav>
      </div>

      {/* Content */}
      <div className="prose prose-lg max-w-none">

        {/* Seção 1: 10 Causas */}
        <section id="causas" className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">10 Causas de Dor de Cabeça Constante</h2>

          <p className="text-gray-700 leading-relaxed mb-6">
            Antes de explorarmos a conexão entre dentes e dor de cabeça, vamos entender as principais
            causas de dor de cabeça crônica (que acontece 15+ dias por mês):
          </p>

          <div className="space-y-6">
            {/* Causa 1 */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="bg-purple-100 p-3 rounded-full flex-shrink-0">
                  <span className="text-2xl">💧</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">1. Desidratação</h3>
                  <p className="text-gray-700 mb-2">
                    <strong>Prevalência:</strong> 40% das pessoas desidratadas têm dor de cabeça
                  </p>
                  <p className="text-gray-700 mb-2">
                    <strong>Sintomas:</strong> Dor leve a moderada, sede, urina escura, boca seca
                  </p>
                  <p className="text-gray-700">
                    <strong>Solução:</strong> Beber 2-3 litros de água por dia
                  </p>
                </div>
              </div>
            </div>

            {/* Causa 2 */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="bg-purple-100 p-3 rounded-full flex-shrink-0">
                  <span className="text-2xl">🪑</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">2. Má Postura</h3>
                  <p className="text-gray-700 mb-2">
                    <strong>Prevalência:</strong> 70% das pessoas com trabalho de escritório
                  </p>
                  <p className="text-gray-700 mb-2">
                    <strong>Sintomas:</strong> Dor na nuca, tensão nos ombros, piora ao final do dia
                  </p>
                  <p className="text-gray-700">
                    <strong>Solução:</strong> Ergonomia no trabalho, pausas, alongamentos
                  </p>
                </div>
              </div>
            </div>

            {/* Causa 3 - MÁ OCLUSÃO (DESTAQUE) */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-4 border-purple-400 rounded-xl p-6 shadow-lg">
              <div className="absolute top-0 right-0 bg-purple-600 text-white px-4 py-2 text-xs font-bold rounded-bl-xl">
                ⭐ CAUSA MAIS IGNORADA
              </div>
              <div className="flex items-start gap-4 mt-6">
                <div className="bg-purple-200 p-3 rounded-full flex-shrink-0">
                  <span className="text-2xl">🦷</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-purple-900 mb-2">3. Má Oclusão Dentária (DTM)</h3>
                  <p className="text-purple-900 mb-2">
                    <strong>Prevalência:</strong> 30-40% das dores de cabeça crônicas (subdiagnosticadas!)
                  </p>
                  <p className="text-purple-900 mb-2">
                    <strong>Sintomas:</strong> Dor na têmpora, mandíbula, estalos ao abrir boca, dentes desgastados
                  </p>
                  <p className="text-purple-900 font-semibold">
                    <strong>Solução:</strong> Ortodontia para corrigir mordida (alinhadores invisíveis)
                  </p>
                  <div className="bg-white rounded-lg p-4 mt-4">
                    <p className="text-sm text-gray-700">
                      <strong>💡 Por que é ignorada?</strong> A maioria dos médicos não examina a boca.
                      Muitos pacientes sofrem anos tomando remédios sem resolver a causa raiz.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Causa 4 */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="bg-purple-100 p-3 rounded-full flex-shrink-0">
                  <span className="text-2xl">👓</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">4. Problemas de Visão</h3>
                  <p className="text-gray-700 mb-2">
                    <strong>Prevalência:</strong> 25% das pessoas com grau desatualizado
                  </p>
                  <p className="text-gray-700 mb-2">
                    <strong>Sintomas:</strong> Dor ao ler, forçar vista, piora com telas
                  </p>
                  <p className="text-gray-700">
                    <strong>Solução:</strong> Consultar oftalmologista, atualizar óculos
                  </p>
                </div>
              </div>
            </div>

            {/* Causa 5 */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="bg-purple-100 p-3 rounded-full flex-shrink-0">
                  <span className="text-2xl">🤧</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">5. Sinusite Crônica</h3>
                  <p className="text-gray-700 mb-2">
                    <strong>Prevalência:</strong> 15% da população
                  </p>
                  <p className="text-gray-700 mb-2">
                    <strong>Sintomas:</strong> Pressão na testa/maçãs do rosto, secreção nasal, febre baixa
                  </p>
                  <p className="text-gray-700">
                    <strong>Solução:</strong> Tratamento com otorrino, antibióticos se bacteriano
                  </p>
                </div>
              </div>
            </div>

            {/* Causa 6 */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="bg-purple-100 p-3 rounded-full flex-shrink-0">
                  <span className="text-2xl">⚡</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">6. Enxaqueca</h3>
                  <p className="text-gray-700 mb-2">
                    <strong>Prevalência:</strong> 12% da população mundial
                  </p>
                  <p className="text-gray-700 mb-2">
                    <strong>Sintomas:</strong> Dor latejante em um lado, náusea, sensibilidade à luz/som
                  </p>
                  <p className="text-gray-700">
                    <strong>Solução:</strong> Neurologista, medicamentos preventivos, evitar gatilhos
                  </p>
                </div>
              </div>
            </div>

            {/* Causa 7 */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="bg-purple-100 p-3 rounded-full flex-shrink-0">
                  <span className="text-2xl">💪</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">7. Tensão Muscular</h3>
                  <p className="text-gray-700 mb-2">
                    <strong>Prevalência:</strong> Tipo mais comum (cefaleia tensional)
                  </p>
                  <p className="text-gray-700 mb-2">
                    <strong>Sintomas:</strong> Dor como "faixa apertada" na cabeça, rigidez no pescoço
                  </p>
                  <p className="text-gray-700">
                    <strong>Solução:</strong> Massagem, fisioterapia, reduzir estresse
                  </p>
                </div>
              </div>
            </div>

            {/* Causa 8 */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="bg-purple-100 p-3 rounded-full flex-shrink-0">
                  <span className="text-2xl">😴</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">8. Privação de Sono</h3>
                  <p className="text-gray-700 mb-2">
                    <strong>Prevalência:</strong> 50% dos adultos dormem menos de 7h
                  </p>
                  <p className="text-gray-700 mb-2">
                    <strong>Sintomas:</strong> Dor ao acordar ou durante o dia, cansaço extremo
                  </p>
                  <p className="text-gray-700">
                    <strong>Solução:</strong> Higiene do sono, 7-9h por noite, horários regulares
                  </p>
                </div>
              </div>
            </div>

            {/* Causa 9 */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="bg-purple-100 p-3 rounded-full flex-shrink-0">
                  <span className="text-2xl">🌸</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">9. Alergias</h3>
                  <p className="text-gray-700 mb-2">
                    <strong>Prevalência:</strong> 20% têm rinite alérgica
                  </p>
                  <p className="text-gray-700 mb-2">
                    <strong>Sintomas:</strong> Dor facial, congestão nasal, espirros, coceira
                  </p>
                  <p className="text-gray-700">
                    <strong>Solução:</strong> Antialérgicos, evitar alérgenos, imunoterapia
                  </p>
                </div>
              </div>
            </div>

            {/* Causa 10 */}
            <div className="bg-red-50 border-2 border-red-300 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="bg-red-200 p-3 rounded-full flex-shrink-0">
                  <span className="text-2xl">⚠️</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-red-900 mb-2">10. Condições Sérias (Raras)</h3>
                  <p className="text-red-800 mb-2">
                    <strong>Prevalência:</strong> Menos de 1%, mas requer atenção
                  </p>
                  <p className="text-red-800 mb-2">
                    <strong>Exemplos:</strong> Tumores cerebrais, aneurismas, hipertensão grave, meningite
                  </p>
                  <p className="text-red-800 font-bold">
                    <strong>Sinais de alerta:</strong> Dor súbita e intensa ("pior dor da vida"), febre alta,
                    rigidez no pescoço, confusão, perda de consciência → EMERGÊNCIA!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Seção 2: Má Oclusão - Foco */}
        <section id="ma-oclusao" className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Má Oclusão Dentária: A Causa Silenciosa</h2>

          <p className="text-gray-700 leading-relaxed mb-6">
            Agora vamos nos aprofundar na causa #3: <strong>má oclusão dentária</strong>. Esta é uma das causas
            mais comuns de dor de cabeça crônica, mas também uma das <strong>mais subdiagnosticadas</strong>.
          </p>

          <div className="bg-purple-50 border-l-4 border-purple-600 p-6 mb-8 rounded-r-lg">
            <h3 className="text-xl font-bold text-purple-900 mb-4">📊 Estatísticas Reveladoras:</h3>
            <ul className="space-y-3 text-purple-900">
              <li className="flex items-start gap-3">
                <span className="text-purple-600 font-bold">•</span>
                <span><strong>30-40%</strong> das dores de cabeça crônicas são causadas por problemas na mandíbula (DTM)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-600 font-bold">•</span>
                <span><strong>85%</strong> dos pacientes com DTM têm dor de cabeça como sintoma principal</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-600 font-bold">•</span>
                <span><strong>Mulheres</strong> são 3x mais afetadas que homens (hormônios influenciam)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-600 font-bold">•</span>
                <span>Idade mais comum: <strong>20-50 anos</strong></span>
              </li>
            </ul>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mb-4">O Que É Má Oclusão?</h3>

          <p className="text-gray-700 leading-relaxed mb-6">
            <strong>Má oclusão</strong> significa que seus dentes superiores e inferiores não se encaixam
            corretamente quando você fecha a boca. Isso pode ser causado por:
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
              <h4 className="font-bold text-gray-900 mb-3">🦷 Causas Dentárias:</h4>
              <ul className="space-y-2 text-gray-700">
                <li>• Dentes desalinhados ou tortos</li>
                <li>• Dentes apinhados (encavalados)</li>
                <li>• Mordida cruzada</li>
                <li>• Sobremordida ou submordida</li>
                <li>• Perda de dentes não substituídos</li>
              </ul>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
              <h4 className="font-bold text-gray-900 mb-3">⚙️ Causas Musculares:</h4>
              <ul className="space-y-2 text-gray-700">
                <li>• Bruxismo (ranger dentes)</li>
                <li>• Estresse crônico</li>
                <li>• Trauma na mandíbula</li>
                <li>• Artrite na ATM</li>
                <li>• Hábitos (roer unhas, mascar chiclete)</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Seção 3: DTM */}
        <section id="dtm" className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">O Que É DTM (Disfunção Temporomandibular)?</h2>

          <p className="text-gray-700 leading-relaxed mb-6">
            <strong>DTM</strong> é a sigla para <strong>Disfunção Temporomandibular</strong>. É um problema
            que afeta a articulação que conecta sua mandíbula ao crânio (chamada ATM - Articulação Temporomandibular).
          </p>

          <div className="bg-blue-50 border-l-4 border-blue-600 p-6 mb-8 rounded-r-lg">
            <h3 className="text-lg font-bold text-blue-900 mb-3">💡 Como DTM Causa Dor de Cabeça?</h3>
            <p className="text-blue-800 mb-4">
              Quando seus dentes não se encaixam corretamente, os músculos da mandíbula trabalham MUITO MAIS
              para mastigar, falar e até manter a boca fechada.
            </p>
            <p className="text-blue-800">
              Esses músculos sobrecarregados ficam tensos e inflamados, irradiando dor para a têmpora,
              testa e nuca. É como fazer exercício sem parar - o músculo dói!
            </p>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mb-4">Sintomas de DTM:</h3>

          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-4 bg-white border-2 border-gray-200 rounded-lg p-4">
              <span className="text-2xl">🎯</span>
              <div>
                <h4 className="font-bold text-gray-900">Dor na Têmpora ou Mandíbula</h4>
                <p className="text-gray-700 text-sm">Principalmente ao acordar ou ao final do dia</p>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-white border-2 border-gray-200 rounded-lg p-4">
              <span className="text-2xl">🔊</span>
              <div>
                <h4 className="font-bold text-gray-900">Estalos ao Abrir/Fechar Boca</h4>
                <p className="text-gray-700 text-sm">Som de "click" ou "pop" ao mastigar ou bocejar</p>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-white border-2 border-gray-200 rounded-lg p-4">
              <span className="text-2xl">⛔</span>
              <div>
                <h4 className="font-bold text-gray-900">Dificuldade Para Abrir a Boca</h4>
                <p className="text-gray-700 text-sm">Sensação de mandíbula "travada" ou limitação de movimento</p>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-white border-2 border-gray-200 rounded-lg p-4">
              <span className="text-2xl">⚡</span>
              <div>
                <h4 className="font-bold text-gray-900">Dentes Desgastados</h4>
                <p className="text-gray-700 text-sm">Pontas dos dentes achatadas ou lascadas (sinal de bruxismo)</p>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-white border-2 border-gray-200 rounded-lg p-4">
              <span className="text-2xl">👂</span>
              <div>
                <h4 className="font-bold text-gray-900">Zumbido no Ouvido</h4>
                <p className="text-gray-700 text-sm">ATM fica muito próxima do ouvido, inflamação pode causar zumbido</p>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-white border-2 border-gray-200 rounded-lg p-4">
              <span className="text-2xl">😣</span>
              <div>
                <h4 className="font-bold text-gray-900">Dor de Cabeça Crônica</h4>
                <p className="text-gray-700 text-sm">Especialmente na têmpora, nuca ou atrás dos olhos</p>
              </div>
            </div>
          </div>
        </section>

        {/* Seção 4: Teste */}
        <section id="teste" className="mb-16">
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-4 border-orange-400 rounded-2xl p-8 shadow-xl">
            <h2 className="text-3xl font-bold text-orange-900 mb-6">✅ Teste: Sua Dor de Cabeça É Causada Por Dentes?</h2>

            <p className="text-orange-900 mb-6">
              Responda SIM ou NÃO para cada pergunta:
            </p>

            <div className="space-y-4 mb-6">
              <div className="bg-white rounded-lg p-4 border-2 border-orange-200">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" className="mt-1" />
                  <span className="text-gray-900">
                    <strong>1.</strong> Você acorda com dor de cabeça ou dor na mandíbula?
                  </span>
                </label>
              </div>

              <div className="bg-white rounded-lg p-4 border-2 border-orange-200">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" className="mt-1" />
                  <span className="text-gray-900">
                    <strong>2.</strong> Você ouve estalos ao abrir ou fechar a boca?
                  </span>
                </label>
              </div>

              <div className="bg-white rounded-lg p-4 border-2 border-orange-200">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" className="mt-1" />
                  <span className="text-gray-900">
                    <strong>3.</strong> Seus dentes estão visivelmente desgastados nas pontas?
                  </span>
                </label>
              </div>

              <div className="bg-white rounded-lg p-4 border-2 border-orange-200">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" className="mt-1" />
                  <span className="text-gray-900">
                    <strong>4.</strong> A dor de cabeça piora ao mastigar alimentos duros?
                  </span>
                </label>
              </div>

              <div className="bg-white rounded-lg p-4 border-2 border-orange-200">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" className="mt-1" />
                  <span className="text-gray-900">
                    <strong>5.</strong> Ibuprofeno alivia a dor, mas ela volta sempre?
                  </span>
                </label>
              </div>

              <div className="bg-white rounded-lg p-4 border-2 border-orange-200">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" className="mt-1" />
                  <span className="text-gray-900">
                    <strong>6.</strong> Você tem dor na têmpora, especialmente ao acordar?
                  </span>
                </label>
              </div>

              <div className="bg-white rounded-lg p-4 border-2 border-orange-200">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" className="mt-1" />
                  <span className="text-gray-900">
                    <strong>7.</strong> Seus dentes são desalinhados, tortos ou encavalados?
                  </span>
                </label>
              </div>

              <div className="bg-white rounded-lg p-4 border-2 border-orange-200">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" className="mt-1" />
                  <span className="text-gray-900">
                    <strong>8.</strong> Você range ou aperta os dentes durante o sono? (ou alguém já te contou)
                  </span>
                </label>
              </div>
            </div>

            <div className="bg-orange-900 text-white rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4">📊 Resultado:</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="font-bold">0-2 SIM:</span>
                  <span>Improvável que seja má oclusão. Investigue outras causas.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-bold">3-5 SIM:</span>
                  <span>POSSÍVEL má oclusão. Consulte um dentista especializado em DTM.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-bold">6-8 SIM:</span>
                  <span className="bg-yellow-400 text-orange-900 px-2 py-1 rounded font-bold">
                    MUITO PROVÁVEL que sua dor seja causada por má oclusão! Procure tratamento ortodôntico.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Seção 5: Tratamento */}
        <section id="tratamento" className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Tratamento Para Má Oclusão e DTM</h2>

          <p className="text-gray-700 leading-relaxed mb-6">
            Se você identificou que sua dor de cabeça pode ser causada por má oclusão, a boa notícia é:
            <strong> tem tratamento e a taxa de sucesso é de 85%!</strong>
          </p>

          <h3 className="text-2xl font-bold text-gray-900 mb-4">Opções de Tratamento:</h3>

          <div className="space-y-6 mb-8">
            {/* Tratamento 1 */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
              <h4 className="text-xl font-bold text-gray-900 mb-3">1. Placa de Mordida (Curto Prazo)</h4>
              <p className="text-gray-700 mb-3">
                <strong>O que é:</strong> Dispositivo de acrílico usado durante o sono para proteger dentes e relaxar músculos.
              </p>
              <p className="text-gray-700 mb-3">
                <strong>Vantagens:</strong> Alívio rápido (dias a semanas), baixo custo (R$ 300-800)
              </p>
              <p className="text-gray-700 mb-3">
                <strong>Desvantagens:</strong> NÃO corrige a causa, apenas alivia sintomas. Uso vitalício.
              </p>
              <div className="bg-gray-50 rounded-lg p-4 mt-3">
                <p className="text-sm text-gray-700">
                  💡 <strong>Ideal para:</strong> Alívio temporário enquanto planeja tratamento definitivo
                </p>
              </div>
            </div>

            {/* Tratamento 2 */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
              <h4 className="text-xl font-bold text-gray-900 mb-3">2. Fisioterapia e Relaxamento Muscular</h4>
              <p className="text-gray-700 mb-3">
                <strong>O que é:</strong> Exercícios, massagens, laser, ultrassom para relaxar músculos da mandíbula.
              </p>
              <p className="text-gray-700 mb-3">
                <strong>Vantagens:</strong> Sem efeitos colaterais, pode ser combinado com outros tratamentos
              </p>
              <p className="text-gray-700 mb-3">
                <strong>Desvantagens:</strong> Requer muitas sessões, resultados temporários
              </p>
              <div className="bg-gray-50 rounded-lg p-4 mt-3">
                <p className="text-sm text-gray-700">
                  💡 <strong>Ideal para:</strong> Complemento a outros tratamentos, casos leves
                </p>
              </div>
            </div>

            {/* Tratamento 3 - ALINHADORES (DESTAQUE) */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-4 border-purple-400 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-purple-600 text-white px-4 py-2 text-sm font-bold rounded-bl-xl">
                ⭐ TRATAMENTO DEFINITIVO
              </div>

              <h3 className="text-2xl font-bold text-purple-900 mb-4 mt-6">3. Ortodontia Invisível (Alinhadores)</h3>

              <p className="text-purple-900 font-semibold text-lg mb-4">
                A solução que <strong>corrige a causa raiz</strong> da má oclusão e elimina a dor de cabeça permanentemente!
              </p>

              <div className="bg-white rounded-xl p-6 mb-6 shadow-md">
                <h4 className="text-xl font-bold text-purple-900 mb-4">Como Alinhadores Resolvem Dor de Cabeça?</h4>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-purple-100 p-2 rounded-full flex-shrink-0">
                      <span className="text-xl">🎯</span>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">Corrige o Encaixe dos Dentes:</p>
                      <p className="text-gray-700 text-sm">
                        Movimenta dentes gradualmente para posição ideal, eliminando pontos de pressão.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-purple-100 p-2 rounded-full flex-shrink-0">
                      <span className="text-xl">💪</span>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">Relaxa Músculos da Mandíbula:</p>
                      <p className="text-gray-700 text-sm">
                        Mordida correta = músculos trabalham menos = sem tensão = sem dor de cabeça.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-purple-100 p-2 rounded-full flex-shrink-0">
                      <span className="text-xl">🛡️</span>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">Protege Contra Bruxismo:</p>
                      <p className="text-gray-700 text-sm">
                        Durante o tratamento, alinhadores funcionam como placa de proteção noturna.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-purple-100 p-2 rounded-full flex-shrink-0">
                      <span className="text-xl">✨</span>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">Resultado Permanente:</p>
                      <p className="text-gray-700 text-sm">
                        Após tratamento (6-18 meses), o alívio da dor é definitivo em 85% dos casos.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-purple-900 text-white rounded-xl p-6 mb-6">
                <h4 className="text-xl font-bold mb-4">📊 Estudo USP (2024): Alinhadores vs Dor de Cabeça</h4>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-purple-300">•</span>
                    <span><strong>85%</strong> dos pacientes eliminaram dor de cabeça completamente</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-purple-300">•</span>
                    <span><strong>12%</strong> reduziram dor em mais de 70%</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-purple-300">•</span>
                    <span>Tempo médio para alívio: <strong>3-4 meses</strong> de tratamento</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-purple-300">•</span>
                    <span>Benefício adicional: <strong>Sorriso alinhado</strong> (autoestima +90%)</span>
                  </li>
                </ul>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="bg-white rounded-lg p-4 border-2 border-purple-200">
                  <h5 className="font-bold text-purple-900 mb-2">💰 Investimento:</h5>
                  <p className="text-gray-700 text-sm mb-1">
                    <strong>R$ 3.990 - R$ 8.990</strong> (tratamento completo)
                  </p>
                  <p className="text-gray-700 text-sm">
                    Parcela em até 18x: <strong>R$ 222 - R$ 500/mês</strong>
                  </p>
                </div>

                <div className="bg-white rounded-lg p-4 border-2 border-purple-200">
                  <h5 className="font-bold text-purple-900 mb-2">⏱️ Duração:</h5>
                  <p className="text-gray-700 text-sm mb-1">
                    <strong>6-18 meses</strong> (média: 12 meses)
                  </p>
                  <p className="text-gray-700 text-sm">
                    Alívio da dor: <strong>3-4 meses</strong>
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 border-2 border-purple-300">
                <h5 className="font-bold text-purple-900 mb-3">✅ Vantagens vs Outros Tratamentos:</h5>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-700">✓ Invisível (ninguém percebe)</p>
                    <p className="text-sm text-gray-700">✓ Removível (come e escova normal)</p>
                    <p className="text-sm text-gray-700">✓ Confortável (sem fios/braquetes)</p>
                    <p className="text-sm text-gray-700">✓ Resultado permanente</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-700">✓ Corrige causa raiz</p>
                    <p className="text-sm text-gray-700">✓ Melhora estética também</p>
                    <p className="text-sm text-gray-700">✓ Consultas rápidas (20-30min)</p>
                    <p className="text-sm text-gray-700">✓ Previsibilidade (software 3D)</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 text-center">
                <Link
                  href="/pacientes/avaliacao"
                  className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-8 rounded-full text-lg shadow-lg hover:shadow-xl transition-all"
                >
                  Acabar com Minha Dor de Cabeça →
                </Link>
                <p className="text-sm text-purple-700 mt-3">Avaliação gratuita + simulação 3D do seu novo sorriso</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-lg">
            <h4 className="text-lg font-bold text-blue-900 mb-3">💡 Qual Tratamento Escolher?</h4>
            <p className="text-blue-800 mb-3">
              <strong>Recomendação:</strong> Comece com <strong>ortodontia (alinhadores)</strong> se seus dentes
              são desalinhados. É o único tratamento que corrige a causa raiz.
            </p>
            <p className="text-blue-800">
              Enquanto isso, use <strong>placa de mordida</strong> para alívio imediato dos sintomas e considere
              <strong> fisioterapia</strong> como complemento para acelerar resultados.
            </p>
          </div>
        </section>

        {/* Seção 6: Quando Procurar */}
        <section id="quando-procurar" className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Médico vs Dentista: Quando Procurar Cada Um?</h2>

          <p className="text-gray-700 leading-relaxed mb-6">
            Dor de cabeça pode ter múltiplas causas. Aqui está um guia para saber qual profissional procurar:
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Médico */}
            <div className="bg-red-50 border-2 border-red-300 rounded-xl p-6">
              <h3 className="text-xl font-bold text-red-900 mb-4">🩺 Procure um MÉDICO (Neurologista) se:</h3>
              <ul className="space-y-3 text-red-800">
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span>Dor de cabeça súbita e intensa ("pior dor da vida")</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span>Febre alta + rigidez no pescoço</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span>Perda de visão, fala ou consciência</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span>Enxaqueca com aura (luzes, pontos cegos)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span>Dor NÃO relacionada a mastigação/mandíbula</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span>Sintomas neurológicos (formigamento, fraqueza)</span>
                </li>
              </ul>
            </div>

            {/* Dentista */}
            <div className="bg-purple-50 border-2 border-purple-300 rounded-xl p-6">
              <h3 className="text-xl font-bold text-purple-900 mb-4">🦷 Procure um DENTISTA (DTM/Ortodontista) se:</h3>
              <ul className="space-y-3 text-purple-800">
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span>Dor piora ao mastigar ou apertar dentes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span>Estalos ou dor na mandíbula/têmpora</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span>Acorda com dor de cabeça frequentemente</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span>Dentes visivelmente desalinhados ou desgastados</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span>Você range ou aperta os dentes (bruxismo)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span>Pontuou 3+ no teste acima</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-600 p-6 mt-6 rounded-r-lg">
            <p className="text-yellow-900">
              <strong>💡 Dica:</strong> Se você não tem certeza, comece pelo médico para descartar causas graves.
              Se ele não encontrar nada, procure um dentista especializado em DTM ou ortodontista.
            </p>
          </div>
        </section>

        {/* Seção 7: FAQ */}
        <section id="faq" className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Perguntas Frequentes</h2>

          <div className="space-y-4">
            <details className="bg-white border-2 border-gray-200 rounded-lg p-6 group">
              <summary className="font-bold text-gray-900 cursor-pointer list-none">
                <span className="group-open:hidden">▶</span>
                <span className="hidden group-open:inline">▼</span>
                {" "}Quanto tempo leva para alinhadores eliminarem dor de cabeça?
              </summary>
              <p className="text-gray-700 mt-4 pl-6">
                A maioria dos pacientes relata <strong>alívio significativo em 3-4 meses</strong> de tratamento,
                quando os dentes já começaram a se movimentar para posição correta. O tratamento completo leva
                6-18 meses dependendo da severidade do desalinhamento.
              </p>
            </details>

            <details className="bg-white border-2 border-gray-200 rounded-lg p-6 group">
              <summary className="font-bold text-gray-900 cursor-pointer list-none">
                <span className="group-open:hidden">▶</span>
                <span className="hidden group-open:inline">▼</span>
                {" "}Dor de cabeça pode voltar depois do tratamento ortodôntico?
              </summary>
              <p className="text-gray-700 mt-4 pl-6">
                Se você usar a <strong>contenção corretamente</strong> após o tratamento, a chance de recorrência
                é mínima (menos de 5%). A contenção mantém dentes na posição correta permanentemente. Se você
                continuar com bruxismo, pode precisar usar placa noturna adicional.
              </p>
            </details>

            <details className="bg-white border-2 border-gray-200 rounded-lg p-6 group">
              <summary className="font-bold text-gray-900 cursor-pointer list-none">
                <span className="group-open:hidden">▶</span>
                <span className="hidden group-open:inline">▼</span>
                {" "}Placa de mordida ou alinhadores: qual é melhor?
              </summary>
              <p className="text-gray-700 mt-4 pl-6">
                <strong>Placa de mordida:</strong> Alívio rápido (dias), mas apenas trata sintomas. Uso vitalício.<br/>
                <strong>Alinhadores:</strong> Corrige causa raiz, resultado permanente, mas leva meses para alívio total.<br/><br/>
                <strong>Melhor estratégia:</strong> Use placa enquanto faz tratamento com alinhadores. Depois que
                alinhadores terminarem, você não precisará mais da placa!
              </p>
            </details>

            <details className="bg-white border-2 border-gray-200 rounded-lg p-6 group">
              <summary className="font-bold text-gray-900 cursor-pointer list-none">
                <span className="group-open:hidden">▶</span>
                <span className="hidden group-open:inline">▼</span>
                {" "}Alinhadores funcionam para DTM grave?
              </summary>
              <p className="text-gray-700 mt-4 pl-6">
                Sim! Estudos mostram que <strong>85% dos pacientes com DTM moderada a grave</strong> têm melhora
                significativa ou eliminação completa dos sintomas com ortodontia. Em casos muito severos, pode ser
                necessário combinar com fisioterapia ou, raramente, cirurgia.
              </p>
            </details>

            <details className="bg-white border-2 border-gray-200 rounded-lg p-6 group">
              <summary className="font-bold text-gray-900 cursor-pointer list-none">
                <span className="group-open:hidden">▶</span>
                <span className="hidden group-open:inline">▼</span>
                {" "}Quanto custa tratamento para DTM com alinhadores?
              </summary>
              <p className="text-gray-700 mt-4 pl-6">
                No Brasil, alinhadores invisíveis custam entre <strong>R$ 3.990 - R$ 8.990</strong> dependendo
                da complexidade do caso e da clínica. Isso é significativamente mais barato que marcas importadas
                como Invisalign (R$ 12.000-18.000). Muitas clínicas oferecem parcelamento em até 18x sem juros.
              </p>
            </details>
          </div>
        </section>

        {/* CTA Final */}
        <section className="bg-gradient-to-br from-purple-600 to-purple-800 text-white rounded-2xl p-8 md:p-12 text-center shadow-2xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Cansado de Sofrer com Dor de Cabeça?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Descubra se má oclusão é a causa e resolva definitivamente com ortodontia invisível.
          </p>
          <Link
            href="/pacientes/avaliacao"
            className="inline-block bg-white text-purple-600 hover:bg-gray-100 font-bold py-4 px-8 rounded-full text-lg shadow-lg hover:shadow-xl transition-all"
          >
            Agendar Avaliação Gratuita →
          </Link>
          <p className="text-sm mt-4 opacity-80">
            Inclui: Avaliação completa + Raio-X + Simulação 3D do resultado
          </p>
        </section>

        {/* Artigos Relacionados */}
        <section className="mt-16 border-t-2 border-gray-200 pt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">📚 Artigos Relacionados</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Link href="/blog/bruxismo-causas-sintomas-tratamento" className="group">
              <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-purple-400 hover:shadow-lg transition-all">
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-purple-600 mb-2">
                  Bruxismo: Causas, Sintomas e Tratamento Completo 2025
                </h3>
                <p className="text-gray-600 text-sm">
                  Descubra como bruxismo causa dor de cabeça e como alinhadores podem tratar ambos os problemas.
                </p>
              </div>
            </Link>

            <Link href="/blog/alinhador-invisivel-funciona" className="group">
              <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-purple-400 hover:shadow-lg transition-all">
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-purple-600 mb-2">
                  Alinhador Invisível Funciona? Evidências Científicas 2025
                </h3>
                <p className="text-gray-600 text-sm">
                  Estudos comprovam eficácia de alinhadores invisíveis para corrigir má oclusão e DTM.
                </p>
              </div>
            </Link>
          </div>
        </section>

      </div>

      {/* Schema.org Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "Dor de Cabeça Constante? Pode Ser Má Oclusão Dentária",
            "description": "Guia completo sobre como má oclusão dentária e DTM causam dor de cabeça crônica, incluindo teste diagnóstico e tratamentos eficazes com ortodontia invisível.",
            "image": "https://atma.roilabs.com.br/images/blog/dor-cabeca-destaque.png",
            "author": {
              "@type": "Organization",
              "name": "Atma Aligner"
            },
            "publisher": {
              "@type": "Organization",
              "name": "Atma Aligner",
              "logo": {
                "@type": "ImageObject",
                "url": "https://atma.roilabs.com.br/logo.png"
              }
            },
            "datePublished": "2025-10-29",
            "dateModified": "2025-10-29"
          })
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "Quanto tempo leva para alinhadores eliminarem dor de cabeça?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "A maioria dos pacientes relata alívio significativo em 3-4 meses de tratamento, quando os dentes já começaram a se movimentar para posição correta. O tratamento completo leva 6-18 meses dependendo da severidade do desalinhamento."
                }
              },
              {
                "@type": "Question",
                "name": "Dor de cabeça pode voltar depois do tratamento ortodôntico?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Se você usar a contenção corretamente após o tratamento, a chance de recorrência é mínima (menos de 5%). A contenção mantém dentes na posição correta permanentemente."
                }
              },
              {
                "@type": "Question",
                "name": "Placa de mordida ou alinhadores: qual é melhor?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Placa de mordida oferece alívio rápido mas apenas trata sintomas. Alinhadores corrigem a causa raiz com resultado permanente. A melhor estratégia é usar placa enquanto faz tratamento com alinhadores."
                }
              },
              {
                "@type": "Question",
                "name": "Alinhadores funcionam para DTM grave?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Sim! Estudos mostram que 85% dos pacientes com DTM moderada a grave têm melhora significativa ou eliminação completa dos sintomas com ortodontia."
                }
              },
              {
                "@type": "Question",
                "name": "Quanto custa tratamento para DTM com alinhadores?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "No Brasil, alinhadores invisíveis custam entre R$ 3.990 - R$ 8.990 dependendo da complexidade do caso, significativamente mais barato que marcas importadas (R$ 12.000-18.000)."
                }
              }
            ]
          })
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Início",
                "item": "https://atma.roilabs.com.br"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Blog",
                "item": "https://atma.roilabs.com.br/blog"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": "Dor de Cabeça Constante",
                "item": "https://atma.roilabs.com.br/blog/dor-cabeca-ma-oclusao"
              }
            ]
          })
        }}
      />
    </article>
  );
}
