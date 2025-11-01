import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Bruxismo: Causas, Sintomas e Tratamento Completo 2025 | Atma Aligner',
  description: 'Guia completo sobre bruxismo: o que é, causas, sintomas, diagnóstico e tratamentos modernos. Descubra como alinhadores invisíveis podem tratar bruxismo e proteger seus dentes.',
  keywords: 'bruxismo, bruxismo sintomas, como tratar bruxismo, bruxismo tem cura, ranger dentes, bruxismo noturno, placa de mordida, alinhador invisível',
  openGraph: {
    title: 'Bruxismo: Causas, Sintomas e Tratamento Completo 2025',
    description: 'Tudo sobre bruxismo: causas, sintomas e tratamentos modernos incluindo alinhadores invisíveis.',
    type: 'article',
    publishedTime: '2025-10-24T00:00:00Z',
    authors: ['Atma Aligner'],
    images: [
      {
        url: '/images/blog/bruxismo-tratamento.jpg',
        width: 1200,
        height: 630,
        alt: 'Pessoa com bruxismo - tratamento com alinhadores invisíveis'
      }
    ]
  }
};

export default function BruxismoArticle() {
  return (
    <article className="max-w-4xl mx-auto px-4 py-12">
      {/* Breadcrumbs */}
      <nav className="text-sm mb-8" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2 text-gray-600">
          <li><Link href="/" className="hover:text-purple-600">Início</Link></li>
          <li>/</li>
          <li><Link href="/blog" className="hover:text-purple-600">Blog</Link></li>
          <li>/</li>
          <li className="text-gray-900">Bruxismo: Causas, Sintomas e Tratamento</li>
        </ol>
      </nav>

      {/* Header */}
      <header className="mb-12">
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
          <time dateTime="2025-10-24">24 de outubro de 2025</time>
          <span>•</span>
          <span>12 min de leitura</span>
          <span>•</span>
          <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full">Saúde Bucal</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
          Bruxismo: Causas, Sintomas e Tratamento Completo 2025
        </h1>

        <p className="text-xl text-gray-700 leading-relaxed">
          Você range ou aperta os dentes durante o sono? Acorda com dor na mandíbula ou dentes sensíveis?
          Você pode ter bruxismo. Descubra tudo sobre essa condição e os tratamentos mais modernos disponíveis.
        </p>
      </header>

      {/* Featured Image */}
      <div className="relative w-full h-[400px] mb-12 rounded-2xl overflow-hidden">
        <Image
          src="/images/blog/bruxismo-dentes-ranger.jpg"
          alt="Pessoa com bruxismo mostrando os dentes - sinais de desgaste por ranger durante o sono"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Table of Contents */}
      <div className="bg-gray-50 border-l-4 border-purple-600 p-6 mb-12 rounded-r-lg">
        <h2 className="text-lg font-bold text-gray-900 mb-4">📋 Neste Artigo:</h2>
        <nav>
          <ol className="space-y-2 text-gray-700">
            <li><a href="#o-que-e" className="hover:text-purple-600">1. O que é Bruxismo?</a></li>
            <li><a href="#causas" className="hover:text-purple-600">2. Causas do Bruxismo</a></li>
            <li><a href="#sintomas" className="hover:text-purple-600">3. Sintomas e Sinais</a></li>
            <li><a href="#diagnostico" className="hover:text-purple-600">4. Como Diagnosticar</a></li>
            <li><a href="#tratamentos" className="hover:text-purple-600">5. Tratamentos Modernos</a></li>
            <li><a href="#alinhadores" className="hover:text-purple-600">6. Alinhadores Invisíveis para Bruxismo</a></li>
            <li><a href="#prevencao" className="hover:text-purple-600">7. Prevenção</a></li>
            <li><a href="#faq" className="hover:text-purple-600">8. Perguntas Frequentes</a></li>
          </ol>
        </nav>
      </div>

      {/* Content */}
      <div className="prose prose-lg max-w-none">

        {/* Seção 1: O que é Bruxismo */}
        <section id="o-que-e" className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">O que é Bruxismo?</h2>

          <p className="text-gray-700 leading-relaxed mb-6">
            <strong>Bruxismo</strong> é uma condição caracterizada pelo <strong>ranger ou apertar involuntário dos dentes</strong>,
            que pode ocorrer durante o sono (bruxismo do sono) ou enquanto acordado (bruxismo de vigília).
          </p>

          <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-8 rounded-r-lg">
            <p className="text-blue-900 font-semibold mb-2">📊 Dados Importantes:</p>
            <ul className="space-y-2 text-blue-800">
              <li>✓ <strong>30% da população</strong> sofre de bruxismo em algum momento da vida</li>
              <li>✓ <strong>80% dos casos</strong> ocorrem durante o sono (bruxismo noturno)</li>
              <li>✓ <strong>Pico de incidência:</strong> entre 25-44 anos</li>
              <li>✓ <strong>Crianças:</strong> 15-33% apresentam bruxismo (geralmente passa na adolescência)</li>
            </ul>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Tipos de Bruxismo</h3>

          <div className="grid md:grid-cols-2 gap-6 my-8">
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h4 className="text-xl font-bold text-purple-600 mb-3">🌙 Bruxismo do Sono</h4>
              <p className="text-gray-700 mb-3">
                Ocorre durante o sono, geralmente em fases de sono leve (REM). A pessoa não tem consciência
                do ranger dos dentes.
              </p>
              <ul className="space-y-2 text-gray-700">
                <li>• Mais comum (80% dos casos)</li>
                <li>• Pode acordar parceiros com o barulho</li>
                <li>• Danos mais severos aos dentes</li>
              </ul>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h4 className="text-xl font-bold text-purple-600 mb-3">☀️ Bruxismo de Vigília</h4>
              <p className="text-gray-700 mb-3">
                Apertar dos dentes durante o dia, geralmente em situações de estresse, concentração
                ou ansiedade.
              </p>
              <ul className="space-y-2 text-gray-700">
                <li>• Mais consciente (pode ser controlado)</li>
                <li>• Comum ao trabalhar ou dirigir</li>
                <li>• Menos danos, mas mais tensão muscular</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Seção 2: Causas */}
        <section id="causas" className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Causas do Bruxismo</h2>

          <p className="text-gray-700 leading-relaxed mb-6">
            O bruxismo é uma condição <strong>multifatorial</strong>, ou seja, pode ter diversas causas que,
            geralmente, atuam em conjunto:
          </p>

          <div className="space-y-6">
            {/* Causa 1: Estresse */}
            <div className="bg-white border-l-4 border-red-500 rounded-r-xl p-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-3">
                <span className="text-3xl">😰</span>
                1. Estresse e Ansiedade
              </h3>
              <p className="text-gray-700 mb-4">
                <strong>Principal causa</strong> do bruxismo moderno. O estresse crônico aumenta a tensão
                muscular da mandíbula e o sistema nervoso ativa o ranger de dentes como resposta.
              </p>
              <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-sm text-red-900">
                  <strong>Fato científico:</strong> Estudos mostram que 70% das pessoas com bruxismo
                  relatam altos níveis de estresse e ansiedade no trabalho ou vida pessoal.
                </p>
              </div>
            </div>

            {/* Causa 2: Má Oclusão */}
            <div className="bg-white border-l-4 border-orange-500 rounded-r-xl p-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-3">
                <span className="text-3xl">🦷</span>
                2. Má Oclusão Dentária
              </h3>
              <p className="text-gray-700 mb-4">
                Dentes desalinhados ou mordida incorreta forçam a mandíbula a trabalhar de forma
                compensatória, levando ao bruxismo.
              </p>
              <ul className="space-y-2 text-gray-700">
                <li>• <strong>Mordida cruzada:</strong> dentes superiores não encaixam nos inferiores</li>
                <li>• <strong>Sobremordida:</strong> dentes superiores cobrem excessivamente os inferiores</li>
                <li>• <strong>Apinhamento:</strong> dentes tortos ou sobrepostos</li>
              </ul>
            </div>

            {/* Causa 3: Genética */}
            <div className="bg-white border-l-4 border-blue-500 rounded-r-xl p-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-3">
                <span className="text-3xl">🧬</span>
                3. Fatores Genéticos
              </h3>
              <p className="text-gray-700">
                Bruxismo pode ser hereditário. Se seus pais rangem os dentes, você tem <strong>50%
                mais chances</strong> de desenvolver a condição.
              </p>
            </div>

            {/* Causa 4: Distúrbios do Sono */}
            <div className="bg-white border-l-4 border-purple-500 rounded-r-xl p-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-3">
                <span className="text-3xl">😴</span>
                4. Distúrbios do Sono
              </h3>
              <p className="text-gray-700 mb-3">
                Condições como <strong>apneia do sono</strong>, ronco e insônia estão fortemente
                associadas ao bruxismo noturno.
              </p>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-purple-900">
                  <strong>Importante:</strong> Pessoas com apneia obstrutiva do sono têm 3x mais
                  chances de desenvolver bruxismo.
                </p>
              </div>
            </div>

            {/* Causa 5: Estilo de Vida */}
            <div className="bg-white border-l-4 border-green-500 rounded-r-xl p-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-3">
                <span className="text-3xl">☕</span>
                5. Hábitos e Estilo de Vida
              </h3>
              <p className="text-gray-700 mb-4">Certos hábitos podem agravar ou desencadear o bruxismo:</p>
              <ul className="space-y-2 text-gray-700">
                <li>• <strong>Cafeína em excesso</strong> (+ de 4 xícaras/dia)</li>
                <li>• <strong>Consumo de álcool</strong> antes de dormir</li>
                <li>• <strong>Tabagismo</strong> (fumantes têm 2x mais bruxismo)</li>
                <li>• <strong>Uso de drogas recreativas</strong> (anfetaminas, ecstasy)</li>
              </ul>
            </div>

            {/* Causa 6: Medicamentos */}
            <div className="bg-white border-l-4 border-yellow-500 rounded-r-xl p-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-3">
                <span className="text-3xl">💊</span>
                6. Efeito Colateral de Medicamentos
              </h3>
              <p className="text-gray-700 mb-3">
                Alguns medicamentos podem causar bruxismo como efeito colateral:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li>• Antidepressivos (especialmente ISRS)</li>
                <li>• Medicamentos para TDAH (Ritalina, Venvanse)</li>
                <li>• Neurolépticos e antipsicóticos</li>
              </ul>
              <p className="text-sm text-yellow-900 bg-yellow-50 p-3 rounded mt-3">
                ⚠️ <strong>Não interrompa medicamentos por conta própria.</strong> Consulte seu médico
                se suspeitar que o bruxismo é causado por medicação.
              </p>
            </div>
          </div>
        </section>

        {/* Seção 3: Sintomas */}
        <section id="sintomas" className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Sintomas e Sinais do Bruxismo</h2>

          <p className="text-gray-700 leading-relaxed mb-6">
            O bruxismo pode causar uma série de sintomas que variam de leves a severos. Muitas pessoas
            <strong> não sabem que têm bruxismo</strong> até que o dentista identifique sinais de desgaste dentário.
          </p>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Sintomas Principais</h3>

          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {/* Sintoma 1 */}
            <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-xl p-5">
              <div className="flex items-start gap-3">
                <span className="text-3xl">😣</span>
                <div>
                  <h4 className="font-bold text-red-900 mb-2">Dor na Mandíbula e ATM</h4>
                  <p className="text-sm text-red-800">
                    Dor ou rigidez na articulação temporomandibular (ATM), especialmente ao acordar.
                    Pode irradiar para ouvidos e pescoço.
                  </p>
                </div>
              </div>
            </div>

            {/* Sintoma 2 */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-5">
              <div className="flex items-start gap-3">
                <span className="text-3xl">🦷</span>
                <div>
                  <h4 className="font-bold text-orange-900 mb-2">Dentes Desgastados ou Quebrados</h4>
                  <p className="text-sm text-orange-800">
                    Esmalte dentário desgastado, dentes achatados, lascados ou fraturados.
                    Em casos severos, exposição da dentina.
                  </p>
                </div>
              </div>
            </div>

            {/* Sintoma 3 */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-5">
              <div className="flex items-start gap-3">
                <span className="text-3xl">🤕</span>
                <div>
                  <h4 className="font-bold text-purple-900 mb-2">Dor de Cabeça Tensional</h4>
                  <p className="text-sm text-purple-800">
                    Dores de cabeça frequentes, principalmente na região temporal (têmporas) e
                    na nuca, ao acordar.
                  </p>
                </div>
              </div>
            </div>

            {/* Sintoma 4 */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-5">
              <div className="flex items-start gap-3">
                <span className="text-3xl">😴</span>
                <div>
                  <h4 className="font-bold text-blue-900 mb-2">Distúrbios do Sono</h4>
                  <p className="text-sm text-blue-800">
                    Sono não reparador, despertar frequente durante a noite, sensação de cansaço
                    ao acordar.
                  </p>
                </div>
              </div>
            </div>

            {/* Sintoma 5 */}
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded-xl p-5">
              <div className="flex items-start gap-3">
                <span className="text-3xl">🦴</span>
                <div>
                  <h4 className="font-bold text-yellow-900 mb-2">Sensibilidade Dentária</h4>
                  <p className="text-sm text-yellow-800">
                    Dentes sensíveis ao calor, frio ou doces devido ao desgaste do esmalte e
                    exposição da dentina.
                  </p>
                </div>
              </div>
            </div>

            {/* Sintoma 6 */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-5">
              <div className="flex items-start gap-3">
                <span className="text-3xl">👂</span>
                <div>
                  <h4 className="font-bold text-green-900 mb-2">Zumbido no Ouvido</h4>
                  <p className="text-sm text-green-800">
                    Zumbido (tinnitus) ou sensação de ouvido entupido devido à proximidade da
                    ATM com o canal auditivo.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-red-50 border-l-4 border-red-600 p-6 my-8 rounded-r-lg">
            <h4 className="text-lg font-bold text-red-900 mb-3">🚨 Sinais de Alerta (Procure um Dentista Imediatamente)</h4>
            <ul className="space-y-2 text-red-800">
              <li>✗ Dor severa na mandíbula que não melhora</li>
              <li>✗ Impossibilidade de abrir ou fechar a boca completamente</li>
              <li>✗ Estalos ou travamento da mandíbula</li>
              <li>✗ Dentes visivelmente quebrados ou fraturados</li>
              <li>✗ Sangramento nas gengivas devido ao ranger</li>
            </ul>
          </div>
        </section>

        {/* Seção 4: Diagnóstico */}
        <section id="diagnostico" className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Como é Diagnosticado o Bruxismo?</h2>

          <p className="text-gray-700 leading-relaxed mb-6">
            O diagnóstico do bruxismo é feito por um <strong>dentista ou ortodontista</strong> através de:
          </p>

          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-bold text-purple-600 mb-4 flex items-center gap-3">
                <span className="text-2xl">👨‍⚕️</span>
                1. Exame Clínico
              </h3>
              <p className="text-gray-700 mb-4">O dentista irá:</p>
              <ul className="space-y-2 text-gray-700 pl-4">
                <li>• Examinar os dentes em busca de desgaste, fraturas ou lascas</li>
                <li>• Verificar a articulação temporomandibular (ATM)</li>
                <li>• Avaliar a musculatura da mandíbula (palpação)</li>
                <li>• Observar a mordida e alinhamento dos dentes</li>
              </ul>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-bold text-purple-600 mb-4 flex items-center gap-3">
                <span className="text-2xl">💬</span>
                2. Histórico do Paciente
              </h3>
              <p className="text-gray-700 mb-4">Perguntas comuns:</p>
              <ul className="space-y-2 text-gray-700 pl-4">
                <li>• Você acorda com dor na mandíbula ou dentes?</li>
                <li>• Seu parceiro(a) já relatou que você range os dentes durante o sono?</li>
                <li>• Você tem dores de cabeça frequentes?</li>
                <li>• Passa por períodos de estresse intenso?</li>
                <li>• Toma algum medicamento regularmente?</li>
              </ul>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-bold text-purple-600 mb-4 flex items-center gap-3">
                <span className="text-2xl">📊</span>
                3. Exames Complementares (se necessário)
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="font-semibold text-gray-900 mb-2">Polissonografia:</p>
                  <p className="text-gray-700">
                    Exame do sono que monitora atividade cerebral, muscular e respiratória.
                    Identifica bruxismo noturno e apneia do sono.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-2">Eletromiografia (EMG):</p>
                  <p className="text-gray-700">
                    Mede a atividade elétrica dos músculos da mastigação, detectando contrações
                    involuntárias.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mt-8">
            <h4 className="text-lg font-bold text-blue-900 mb-3">✅ Teste Rápido: Você Tem Bruxismo?</h4>
            <p className="text-blue-800 mb-4">Marque os sintomas que você tem:</p>
            <ul className="space-y-2 text-blue-900">
              <li>☐ Acorda com dor na mandíbula ou dentes sensíveis</li>
              <li>☐ Dores de cabeça frequentes, especialmente de manhã</li>
              <li>☐ Parceiro(a) relata que você range os dentes</li>
              <li>☐ Dentes desgastados, achatados ou com lascas</li>
              <li>☐ Dor ou cansaço nos músculos da mandíbula</li>
              <li>☐ Estalos ao abrir ou fechar a boca</li>
            </ul>
            <p className="text-sm text-blue-900 font-bold mt-4">
              Se você marcou 3 ou mais sintomas, consulte um dentista para avaliação.
            </p>
          </div>
        </section>

        {/* Seção 5: Tratamentos */}
        <section id="tratamentos" className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Tratamentos para Bruxismo</h2>

          <p className="text-gray-700 leading-relaxed mb-8">
            Embora <strong>não exista uma cura definitiva</strong> para o bruxismo, existem diversos tratamentos
            eficazes para <strong>controlar os sintomas, proteger os dentes e reduzir a frequência</strong>
            do ranger.
          </p>

          <div className="space-y-8">

            {/* Tratamento 1: Placa de Mordida */}
            <div className="bg-white border-2 border-purple-200 rounded-2xl p-8 shadow-lg">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-purple-100 p-3 rounded-full">
                  <span className="text-3xl">🦷</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">1. Placa de Mordida (Bite Plate)</h3>
              </div>

              <p className="text-gray-700 mb-4">
                <strong>Tratamento mais comum.</strong> Placa de acrílico ou resina feita sob medida que é
                usada durante o sono para proteger os dentes do desgaste.
              </p>

              <div className="grid md:grid-cols-2 gap-6 mb-4">
                <div>
                  <h4 className="font-bold text-green-700 mb-2">✅ Vantagens:</h4>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• Protege os dentes do desgaste</li>
                    <li>• Reduz dor na mandíbula</li>
                    <li>• Tratamento conservador e reversível</li>
                    <li>• Custo acessível (R$ 300-800)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-red-700 mb-2">❌ Desvantagens:</h4>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• Não trata a causa, apenas sintomas</li>
                    <li>• Desconforto inicial (adaptação)</li>
                    <li>• Precisa usar toda noite</li>
                    <li>• Durabilidade limitada (1-3 anos)</li>
                  </ul>
                </div>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-purple-900">
                  <strong>Tipos de placas:</strong> Placas rígidas (acrílico) são mais indicadas para bruxismo
                  severo. Placas macias (silicone) podem piorar o bruxismo em alguns casos.
                </p>
              </div>
            </div>

            {/* Tratamento 2: Toxina Botulínica */}
            <div className="bg-white border-2 border-blue-200 rounded-2xl p-8 shadow-lg">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <span className="text-3xl">💉</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">2. Toxina Botulínica (Botox)</h3>
              </div>

              <p className="text-gray-700 mb-4">
                Aplicação de toxina botulínica nos músculos masseter (responsáveis pela mastigação) para
                <strong> relaxar a musculatura e reduzir a força do ranger.</strong>
              </p>

              <div className="grid md:grid-cols-2 gap-6 mb-4">
                <div>
                  <h4 className="font-bold text-green-700 mb-2">✅ Vantagens:</h4>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• Reduz significativamente o bruxismo</li>
                    <li>• Alivia dor de cabeça e DTM</li>
                    <li>• Efeito em 7-14 dias</li>
                    <li>• Afina o rosto (efeito estético)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-red-700 mb-2">❌ Desvantagens:</h4>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• Efeito temporário (4-6 meses)</li>
                    <li>• Custo elevado (R$ 1.500-3.000)</li>
                    <li>• Requer reaplicações periódicas</li>
                    <li>• Possível dificuldade para mastigar</li>
                  </ul>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-900">
                  <strong>Indicação:</strong> Recomendado para casos moderados a severos de bruxismo que não
                  respondem bem à placa de mordida.
                </p>
              </div>
            </div>

            {/* Tratamento 3: Alinhadores Invisíveis - DESTAQUE */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-4 border-purple-400 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-purple-600 text-white px-4 py-2 text-sm font-bold rounded-bl-xl">
                ⭐ TRATAMENTO INOVADOR
              </div>

              <div className="flex items-center gap-4 mb-6 mt-8">
                <div className="bg-white p-4 rounded-full shadow-lg">
                  <span className="text-4xl">✨</span>
                </div>
                <h3 className="text-3xl font-bold text-purple-900">3. Alinhadores Invisíveis para Bruxismo</h3>
              </div>

              <p className="text-purple-900 font-semibold text-lg mb-4">
                O tratamento <strong>2 em 1:</strong> corrige o alinhamento dos dentes E protege contra o bruxismo!
              </p>

              <p className="text-gray-700 mb-6">
                Os alinhadores invisíveis modernos, feitos de{" "}
                <Link href="/pacientes/qualidade-alemao" className="text-purple-600 hover:text-purple-700 underline font-semibold">
                  material PETG alemão de alta resistência
                </Link>, funcionam como
                <strong> placa de mordida durante a noite</strong> enquanto <strong>corrigem a posição dos dentes</strong>
                durante o dia.
              </p>

              <div className="bg-white rounded-xl p-6 mb-6 shadow-md">
                <h4 className="text-xl font-bold text-purple-900 mb-4">Como Alinhadores Tratam Bruxismo?</h4>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-purple-100 p-2 rounded-full flex-shrink-0">
                      <span className="text-xl">🌙</span>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">Proteção Noturna:</p>
                      <p className="text-gray-700 text-sm">
                        Material PETG absorve o impacto do ranger, protegendo o esmalte dentário como
                        uma placa de mordida.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-purple-100 p-2 rounded-full flex-shrink-0">
                      <span className="text-xl">🦷</span>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">Correção da Mordida:</p>
                      <p className="text-gray-700 text-sm">
                        Corrige má oclusão (uma das causas do bruxismo), resultando em mordida equilibrada
                        e redução do ranger.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-purple-100 p-2 rounded-full flex-shrink-0">
                      <span className="text-xl">💪</span>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">Relaxamento Muscular:</p>
                      <p className="text-gray-700 text-sm">
                        Reduz tensão nos músculos masseter, diminuindo a intensidade e frequência do bruxismo.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-purple-100 p-2 rounded-full flex-shrink-0">
                      <span className="text-xl">👔</span>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">Estética Preservada:</p>
                      <p className="text-gray-700 text-sm">
                        Diferente de placas rígidas, alinhadores são discretos e podem ser usados
                        durante o dia sem constrangimento.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white rounded-xl p-5 shadow-md">
                  <h4 className="font-bold text-green-700 mb-3 text-lg">✅ Vantagens Únicas:</h4>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li>• <strong>Dupla função:</strong> protege E alinha</li>
                    <li>• Invisível e discreto</li>
                    <li>• Resolve causa raiz (má oclusão)</li>
                    <li>• Confortável (sem metal)</li>
                    <li>• Removível para comer e escovar</li>
                    <li>• Melhora estética do sorriso</li>
                  </ul>
                </div>
                <div className="bg-white rounded-xl p-5 shadow-md">
                  <h4 className="font-bold text-orange-700 mb-3 text-lg">⚠️ Considerações:</h4>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li>• Custo superior à placa simples</li>
                    <li>• Requer disciplina (22h/dia)</li>
                    <li>• Tratamento de 6-18 meses</li>
                    <li>• Não indicado para bruxismo severo</li>
                    <li>• Necessita acompanhamento ortodôntico</li>
                  </ul>
                </div>
              </div>

              <div className="bg-purple-900 text-white rounded-xl p-6">
                <h4 className="text-xl font-bold mb-3">💰 Custo-Benefício</h4>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="font-bold mb-1">Placa de Mordida:</p>
                    <p className="opacity-90">R$ 300-800</p>
                    <p className="text-xs opacity-75 mt-1">Apenas proteção</p>
                  </div>
                  <div>
                    <p className="font-bold mb-1">Botox (6 meses):</p>
                    <p className="opacity-90">R$ 1.500-3.000</p>
                    <p className="text-xs opacity-75 mt-1">Efeito temporário</p>
                  </div>
                  <div className="bg-white text-purple-900 rounded-lg p-3">
                    <p className="font-bold mb-1">Alinhadores Atma:</p>
                    <p className="font-bold text-lg">A partir de R$ 3.990</p>
                    <p className="text-xs mt-1">Proteção + Correção permanente</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 text-center">
                <Link
                  href="/pacientes/agendamento"
                  className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-8 rounded-full text-lg shadow-xl transition-all hover:scale-105"
                >
                  Descubra Se Alinhadores Podem Tratar Seu Bruxismo →
                </Link>
                <p className="text-sm text-purple-700 mt-3">Avaliação gratuita • Plano personalizado em 48h</p>
              </div>
            </div>

            {/* Tratamento 4: Fisioterapia */}
            <div className="bg-white border-2 border-green-200 rounded-2xl p-8 shadow-lg">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <span className="text-3xl">🧘</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">4. Fisioterapia e Terapias Complementares</h3>
              </div>

              <p className="text-gray-700 mb-4">
                Técnicas de relaxamento muscular e exercícios específicos para a mandíbula ajudam a
                reduzir a tensão que causa o bruxismo.
              </p>

              <div className="space-y-3 mb-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="font-semibold text-green-900 mb-2">Exercícios de ATM:</p>
                  <p className="text-sm text-green-800">
                    Abertura e fechamento controlado da boca, movimentos laterais e alongamento dos
                    músculos mastigatórios.
                  </p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="font-semibold text-green-900 mb-2">Massagem Terapêutica:</p>
                  <p className="text-sm text-green-800">
                    Massagem nos músculos masseter, temporal e trapézio para aliviar tensão acumulada.
                  </p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="font-semibold text-green-900 mb-2">Terapia Comportamental Cognitiva (TCC):</p>
                  <p className="text-sm text-green-800">
                    Ajuda a identificar e modificar padrões de pensamento que causam estresse e,
                    consequentemente, bruxismo.
                  </p>
                </div>
              </div>
            </div>

            {/* Tratamento 5: Medicamentos */}
            <div className="bg-white border-2 border-yellow-200 rounded-2xl p-8 shadow-lg">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-yellow-100 p-3 rounded-full">
                  <span className="text-3xl">💊</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">5. Medicamentos (Casos Específicos)</h3>
              </div>

              <p className="text-gray-700 mb-4">
                Medicamentos são usados apenas em casos severos ou quando há condições associadas
                (ansiedade, depressão):
              </p>

              <ul className="space-y-3 text-gray-700">
                <li>
                  <strong>Relaxantes musculares:</strong> Ciclobenzaprina ou Baclofeno para relaxar
                  músculos durante o sono
                </li>
                <li>
                  <strong>Ansiolíticos:</strong> Para controlar ansiedade que causa bruxismo (uso
                  controlado)
                </li>
                <li>
                  <strong>Antidepressivos:</strong> Em casos de depressão associada (alguns podem causar
                  bruxismo, outros ajudam)
                </li>
              </ul>

              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mt-4 rounded-r-lg">
                <p className="text-sm text-yellow-900">
                  ⚠️ <strong>Importante:</strong> Medicamentos devem ser prescritos apenas por médico ou
                  dentista. Não se automedique.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* Seção 6: Alinhadores - Aprofundamento */}
        <section id="alinhadores" className="mb-16">
          <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-2xl p-8 mb-8">
            <h2 className="text-3xl font-bold mb-4">Por Que Alinhadores Invisíveis São Ideais Para Bruxismo?</h2>
            <p className="text-purple-100 text-lg">
              Entenda em detalhes como a tecnologia dos alinhadores invisíveis oferece uma solução
              completa para quem sofre de bruxismo.
            </p>
          </div>

          <div className="space-y-8">

            {/* Comparativo */}
            <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Comparativo: Placa vs Alinhadores</h3>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-300">
                      <th className="text-left py-4 px-4 text-gray-700">Aspecto</th>
                      <th className="text-center py-4 px-4 text-gray-700">Placa de Mordida</th>
                      <th className="text-center py-4 px-4 bg-purple-50 text-purple-900">Alinhadores Atma</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="py-4 px-4 font-semibold">Proteção dos dentes</td>
                      <td className="py-4 px-4 text-center">✅ Sim</td>
                      <td className="py-4 px-4 text-center bg-purple-50">✅ Sim</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-4 font-semibold">Corrige alinhamento</td>
                      <td className="py-4 px-4 text-center">❌ Não</td>
                      <td className="py-4 px-4 text-center bg-purple-50">✅ Sim</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-4 font-semibold">Trata causa raiz</td>
                      <td className="py-4 px-4 text-center">❌ Não</td>
                      <td className="py-4 px-4 text-center bg-purple-50">✅ Sim (se má oclusão)</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-4 font-semibold">Estética</td>
                      <td className="py-4 px-4 text-center">Volumoso</td>
                      <td className="py-4 px-4 text-center bg-purple-50">Invisível</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-4 font-semibold">Uso diurno</td>
                      <td className="py-4 px-4 text-center">❌ Só noite</td>
                      <td className="py-4 px-4 text-center bg-purple-50">✅ 22h/dia</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-4 font-semibold">Custo inicial</td>
                      <td className="py-4 px-4 text-center">R$ 300-800</td>
                      <td className="py-4 px-4 text-center bg-purple-50">A partir de R$ 3.990</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-4 font-semibold">Durabilidade</td>
                      <td className="py-4 px-4 text-center">1-3 anos</td>
                      <td className="py-4 px-4 text-center bg-purple-50">Resultado permanente</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-4 font-semibold">Melhora sorriso</td>
                      <td className="py-4 px-4 text-center">❌ Não</td>
                      <td className="py-4 px-4 text-center bg-purple-50">✅ Sim</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Casos de Sucesso */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">💬 Casos de Sucesso: Pacientes com Bruxismo</h3>

              <div className="space-y-6">
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <span className="text-2xl">👨‍💼</span>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">Carlos, 34 anos - Executivo</p>
                      <p className="text-sm text-gray-600">São Paulo, SP</p>
                    </div>
                  </div>
                  <p className="text-gray-700 italic mb-3">
                    "Eu tinha bruxismo há 10 anos e usava placa de mordida todas as noites. Decidí tentar
                    os alinhadores Atma porque meus dentes também eram tortos. Matei dois coelhos com uma
                    cajadada só: corrigi o sorriso E parei de acordar com dor de cabeça. Melhor decisão!"
                  </p>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-yellow-500">⭐⭐⭐⭐⭐</span>
                    <span className="text-gray-600">5/5 estrelas</span>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-md">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <span className="text-2xl">👩‍🏫</span>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">Ana Paula, 28 anos - Professora</p>
                      <p className="text-sm text-gray-600">Curitiba, PR</p>
                    </div>
                  </div>
                  <p className="text-gray-700 italic mb-3">
                    "Eu rangia os dentes tanto que meu marido não conseguia dormir. A placa não resolvia.
                    Com os alinhadores, em 3 meses já senti diferença. Meu dentista disse que minha mordida
                    melhorou muito e o bruxismo reduziu 80%."
                  </p>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-yellow-500">⭐⭐⭐⭐⭐</span>
                    <span className="text-gray-600">5/5 estrelas</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 text-center">
                <Link
                  href="/pacientes/antes-depois"
                  className="inline-block text-blue-600 hover:text-blue-800 font-semibold"
                >
                  Ver Mais Casos de Sucesso →
                </Link>
              </div>
            </div>

            {/* Quem Pode Usar */}
            <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Alinhadores Para Bruxismo: Para Quem é Indicado?</h3>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold text-green-700 mb-4 text-lg">✅ INDICADO para:</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li>✓ Bruxismo leve a moderado</li>
                    <li>✓ Dentes desalinhados ou tortos</li>
                    <li>✓ Má oclusão (mordida incorreta)</li>
                    <li>✓ Pacientes que buscam estética + função</li>
                    <li>✓ Quem não se adaptou à placa rígida</li>
                    <li>✓ Jovens adultos (18-45 anos)</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-red-700 mb-4 text-lg">❌ NÃO indicado para:</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li>✗ Bruxismo extremamente severo</li>
                    <li>✗ Casos com danos dentários extensos</li>
                    <li>✗ Pacientes com apneia do sono severa</li>
                    <li>✗ Falta de disciplina (não usa 22h/dia)</li>
                    <li>✗ Problemas periodontais graves</li>
                    <li>✗ Menores de 18 anos (avaliar)</li>
                  </ul>
                </div>
              </div>

              <div className="mt-8 bg-purple-50 border-l-4 border-purple-600 p-6 rounded-r-lg">
                <p className="text-purple-900">
                  <strong>💡 Quer saber se você se qualifica?</strong> Faça nossa avaliação online gratuita
                  e receba um plano de tratamento personalizado em até 48 horas.
                </p>
                <Link
                  href="/pacientes/agendamento"
                  className="inline-block mt-4 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                >
                  Fazer Avaliação Gratuita →
                </Link>
              </div>
            </div>

          </div>
        </section>

        {/* Seção 7: Prevenção */}
        <section id="prevencao" className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Como Prevenir o Bruxismo?</h2>

          <p className="text-gray-700 leading-relaxed mb-8">
            Embora nem sempre seja possível prevenir completamente o bruxismo (especialmente se for genético),
            algumas mudanças no estilo de vida podem <strong>reduzir significativamente a frequência e intensidade</strong>:
          </p>

          <div className="grid md:grid-cols-2 gap-6">

            <div className="bg-blue-50 border-l-4 border-blue-600 rounded-r-xl p-6">
              <h3 className="text-lg font-bold text-blue-900 mb-3 flex items-center gap-2">
                <span>😌</span> Gerenciamento do Estresse
              </h3>
              <ul className="space-y-2 text-blue-800 text-sm">
                <li>• Pratique meditação ou mindfulness</li>
                <li>• Faça exercícios regularmente</li>
                <li>• Durma 7-8 horas por noite</li>
                <li>• Considere terapia se necessário</li>
              </ul>
            </div>

            <div className="bg-green-50 border-l-4 border-green-600 rounded-r-xl p-6">
              <h3 className="text-lg font-bold text-green-900 mb-3 flex items-center gap-2">
                <span>☕</span> Reduza Estimulantes
              </h3>
              <ul className="space-y-2 text-green-800 text-sm">
                <li>• Limite cafeína (max 2-3 xícaras/dia)</li>
                <li>• Evite café após 16h</li>
                <li>• Reduza ou elimine álcool</li>
                <li>• Não fume (aumenta 2x o risco)</li>
              </ul>
            </div>

            <div className="bg-purple-50 border-l-4 border-purple-600 rounded-r-xl p-6">
              <h3 className="text-lg font-bold text-purple-900 mb-3 flex items-center gap-2">
                <span>🧘</span> Relaxe Antes de Dormir
              </h3>
              <ul className="space-y-2 text-purple-800 text-sm">
                <li>• Tome banho quente</li>
                <li>• Faça alongamentos leves</li>
                <li>• Evite telas 1h antes de dormir</li>
                <li>• Leia ou ouça música calma</li>
              </ul>
            </div>

            <div className="bg-orange-50 border-l-4 border-orange-600 rounded-r-xl p-6">
              <h3 className="text-lg font-bold text-orange-900 mb-3 flex items-center gap-2">
                <span>🦷</span> Cuide da Saúde Bucal
              </h3>
              <ul className="space-y-2 text-orange-800 text-sm">
                <li>• Visite dentista regularmente (6/6 meses)</li>
                <li>• Corrija problemas de mordida</li>
                <li>• Evite mascar chiclete excessivamente</li>
                <li>• Não morda objetos (canetas, unhas)</li>
              </ul>
            </div>

          </div>

          <div className="mt-8 bg-yellow-50 border border-yellow-300 rounded-xl p-6">
            <h4 className="text-lg font-bold text-yellow-900 mb-3">💡 Dica de Ouro</h4>
            <p className="text-yellow-900">
              Pratique <strong>conscientização da mandíbula</strong> durante o dia. Sempre que lembrar,
              relaxe os músculos faciais e mantenha os dentes levemente separados (língua no céu da boca).
              Com o tempo, isso se torna automático e reduz o bruxismo diurno.
            </p>
          </div>
        </section>

        {/* Seção 8: FAQ */}
        <section id="faq" className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Perguntas Frequentes Sobre Bruxismo</h2>

          <div className="space-y-4">

            <details className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <summary className="font-bold text-lg text-gray-900 cursor-pointer">
                ❓ Bruxismo tem cura?
              </summary>
              <p className="mt-4 text-gray-700 pl-6">
                Não existe uma "cura" definitiva para o bruxismo, mas a condição pode ser <strong>controlada
                efetivamente</strong> com tratamentos adequados. Em muitos casos, tratar a causa subjacente
                (como má oclusão ou estresse) pode eliminar completamente o bruxismo. Placas de mordida e
                alinhadores invisíveis protegem os dentes enquanto trabalham na causa raiz.
              </p>
            </details>

            <details className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <summary className="font-bold text-lg text-gray-900 cursor-pointer">
                ❓ Como saber se eu tenho bruxismo se durmo sozinho?
              </summary>
              <p className="mt-4 text-gray-700 pl-6">
                Sinais indiretos incluem: <strong>acordar com dor na mandíbula</strong>, dentes sensíveis,
                dores de cabeça matinais, desgaste visível nos dentes (dentista detecta), língua com marcas
                laterais, e tensão constante nos músculos da face. Se você tem 3+ desses sintomas, consulte
                um dentista para avaliação.
              </p>
            </details>

            <details className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <summary className="font-bold text-lg text-gray-900 cursor-pointer">
                ❓ Crianças podem ter bruxismo?
              </summary>
              <p className="mt-4 text-gray-700 pl-6">
                Sim. <strong>15-33% das crianças</strong> apresentam bruxismo, especialmente entre 3-10 anos.
                Na maioria dos casos, é uma fase temporária relacionada ao desenvolvimento dos dentes e
                mandíbula, e <strong>desaparece na adolescência</strong>. Se persistir ou causar danos, consulte
                um odontopediatra. Placas de mordida geralmente não são recomendadas para crianças pequenas.
              </p>
            </details>

            <details className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <summary className="font-bold text-lg text-gray-900 cursor-pointer">
                ❓ Bruxismo pode quebrar meus dentes?
              </summary>
              <p className="mt-4 text-gray-700 pl-6">
                Sim, em casos severos e não tratados. A força do bruxismo pode chegar a <strong>250 libras
                de pressão</strong> (113 kg) - 10x a força normal de mastigação. Isso pode causar fraturas,
                lascas, desgaste severo do esmalte e até perda de dentes. Por isso é crucial usar proteção
                (placa de mordida ou alinhadores) se você tem bruxismo.
              </p>
            </details>

            <details className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <summary className="font-bold text-lg text-gray-900 cursor-pointer">
                ❓ Placa de farmácia funciona para bruxismo?
              </summary>
              <p className="mt-4 text-gray-700 pl-6">
                <strong>Não recomendado.</strong> Placas de farmácia (boil-and-bite) são genéricas e não se
                adaptam perfeitamente aos seus dentes. Isso pode piorar o bruxismo, causar desconforto e até
                problemas de mordida. Placas profissionais são moldadas especificamente para sua arcada e
                ajustadas por dentista, garantindo eficácia e segurança.
              </p>
            </details>

            <details className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <summary className="font-bold text-lg text-gray-900 cursor-pointer">
                ❓ Quanto tempo leva para ver resultados com alinhadores?
              </summary>
              <p className="mt-4 text-gray-700 pl-6">
                Para <strong>proteção contra bruxismo</strong>, os alinhadores funcionam imediatamente - desde
                a primeira noite. Para <strong>correção da mordida</strong> (que reduz o bruxismo a longo prazo),
                resultados visíveis aparecem em <strong>2-3 meses</strong>, com tratamento completo de 6-18
                meses dependendo do caso. Muitos pacientes relatam redução significativa do bruxismo já nos
                primeiros 3 meses.
              </p>
            </details>

          </div>
        </section>

        {/* CTA Final */}
        <section className="bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-2xl p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Pronto Para Tratar Seu Bruxismo de Forma Definitiva?
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Descubra se alinhadores invisíveis são a solução ideal para o seu caso.
            Avaliação 100% gratuita e online.
          </p>
          <Link
            href="/pacientes/agendamento"
            className="inline-block bg-white text-purple-600 font-bold py-4 px-10 rounded-full text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-105"
          >
            Fazer Avaliação Gratuita Agora →
          </Link>
          <p className="text-sm text-purple-200 mt-4">
            ✓ Sem compromisso ✓ Resposta em 48h ✓ Plano personalizado
          </p>
        </section>

        {/* Artigos Relacionados */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">📚 Leia Também:</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/blog/alinhador-invisivel-funciona" className="block bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <h3 className="font-bold text-purple-600 mb-2">Alinhador Invisível Funciona?</h3>
              <p className="text-sm text-gray-600">Tudo sobre eficácia, resultados e cases reais de alinhadores invisíveis.</p>
            </Link>
            <Link href="/blog/quanto-custa-alinhador-invisivel" className="block bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <h3 className="font-bold text-purple-600 mb-2">Quanto Custa Alinhador Invisível?</h3>
              <p className="text-sm text-gray-600">Preços, formas de pagamento e custo-benefício do tratamento.</p>
            </Link>
            <Link href="/blog/alinhadores-vs-aparelho-fixo" className="block bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <h3 className="font-bold text-purple-600 mb-2">Alinhadores vs Aparelho Fixo</h3>
              <p className="text-sm text-gray-600">Comparativo completo para ajudar você a escolher o melhor tratamento.</p>
            </Link>
          </div>
        </section>

      </div>

      {/* Schema.org - Article */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "Bruxismo: Causas, Sintomas e Tratamento Completo 2025",
            "description": "Guia completo sobre bruxismo: o que é, causas, sintomas, diagnóstico e tratamentos modernos incluindo alinhadores invisíveis.",
            "image": "https://atma.roilabs.com.br/images/blog/bruxismo-hero.jpg",
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
            "datePublished": "2025-10-24",
            "dateModified": "2025-10-24"
          })
        }}
      />

      {/* Schema.org - FAQPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "Bruxismo tem cura?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Não existe uma cura definitiva para o bruxismo, mas a condição pode ser controlada efetivamente com tratamentos adequados. Em muitos casos, tratar a causa subjacente (como má oclusão ou estresse) pode eliminar completamente o bruxismo."
                }
              },
              {
                "@type": "Question",
                "name": "Como saber se eu tenho bruxismo se durmo sozinho?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Sinais indiretos incluem: acordar com dor na mandíbula, dentes sensíveis, dores de cabeça matinais, desgaste visível nos dentes, língua com marcas laterais, e tensão constante nos músculos da face."
                }
              },
              {
                "@type": "Question",
                "name": "Crianças podem ter bruxismo?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Sim. 15-33% das crianças apresentam bruxismo, especialmente entre 3-10 anos. Na maioria dos casos, é uma fase temporária e desaparece na adolescência."
                }
              },
              {
                "@type": "Question",
                "name": "Bruxismo pode quebrar meus dentes?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Sim, em casos severos e não tratados. A força do bruxismo pode chegar a 250 libras de pressão (113 kg), causando fraturas, lascas e desgaste severo do esmalte."
                }
              },
              {
                "@type": "Question",
                "name": "Placa de farmácia funciona para bruxismo?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Não recomendado. Placas de farmácia são genéricas e não se adaptam perfeitamente aos seus dentes, podendo piorar o bruxismo. Placas profissionais são moldadas especificamente para sua arcada."
                }
              },
              {
                "@type": "Question",
                "name": "Quanto tempo leva para ver resultados com alinhadores?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Para proteção contra bruxismo, os alinhadores funcionam imediatamente. Para correção da mordida, resultados visíveis aparecem em 2-3 meses, com muitos pacientes relatando redução significativa do bruxismo já nos primeiros 3 meses."
                }
              }
            ]
          })
        }}
      />

      {/* Schema.org - BreadcrumbList */}
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
                "name": "Bruxismo: Causas, Sintomas e Tratamento",
                "item": "https://atma.roilabs.com.br/blog/bruxismo-causas-sintomas-tratamento"
              }
            ]
          })
        }}
      />
    </article>
  );
}
