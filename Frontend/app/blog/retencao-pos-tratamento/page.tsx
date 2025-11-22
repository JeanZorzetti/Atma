import type { Metadata } from 'next';
import { Shield, Clock, RotateCcw, TriangleAlert, CheckCircle, CircleHelp, Info } from 'lucide-react';
import Link from 'next/link';
import { RelatedArticles } from '@/components/blog/related-articles';

export const metadata: Metadata = {
    title: 'A Importância da Contenção: Mantendo seu Sorriso Perfeito para Sempre [2025]',
    description: 'Terminou o tratamento com alinhadores? Descubra por que a contenção é vital para evitar que os dentes voltem a entortar. Tipos, cuidados e tempo de uso.',
    keywords: 'contenção ortodôntica, contenção vivera, contenção fixa vs removível, dentes entortando de novo, pós tratamento ortodôntico',
    openGraph: {
        title: 'A Importância da Contenção: Mantendo seu Sorriso Perfeito para Sempre',
        description: 'Você sabia que seus dentes têm "memória"? Entenda por que a contenção é a etapa mais importante para garantir resultados vitalícios.',
        type: 'article',
        publishedTime: '2025-01-27T14:00:00Z',
        authors: ['Dra. Mariana Silva'],
        tags: ['contenção', 'pós-tratamento', 'saúde bucal', 'dicas'],
    },
    alternates: {
        canonical: 'https://atma.roilabs.com.br/blog/retencao-pos-tratamento'
    }
};

export default function RetencaoPosTratamentoPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white py-16">
                <div className="max-w-4xl mx-auto px-4">
                    <Link href="/blog" className="text-teal-100 hover:text-white mb-4 inline-block">
                        ← Voltar para o Blog
                    </Link>

                    <div className="flex items-center gap-2 mb-4">
                        <Shield className="w-5 h-5" />
                        <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
                            Manutenção & Cuidados
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                        A Importância da Contenção: Mantendo seu Sorriso Perfeito para Sempre
                    </h1>

                    <div className="flex flex-wrap gap-6 text-sm text-teal-100">
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>27 de janeiro de 2025</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Info className="w-4 h-4" />
                            <span>5 min de leitura</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            <span>Revisado por Dra. Mariana Silva</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <article className="max-w-4xl mx-auto px-4 py-12">

                {/* Introdução */}
                <div className="prose prose-lg max-w-none mb-12">
                    <p className="text-lg text-gray-700 leading-relaxed">
                        Parabéns! Você completou seu tratamento com alinhadores invisíveis e conquistou o sorriso dos seus sonhos. Mas cuidado: <strong>o trabalho ainda não acabou.</strong>
                    </p>

                    <p className="text-gray-700 leading-relaxed">
                        Muitos pacientes acreditam que, ao tirar o último alinhador, os dentes ficarão perfeitos para sempre sem esforço. Infelizmente, isso é um mito. Sem a fase de contenção, seus dentes podem (e provavelmente vão) tentar voltar à posição original.
                    </p>

                    <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-r-lg mt-6">
                        <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                            <TriangleAlert className="w-6 h-6 text-yellow-600" />
                            O Perigo da Recidiva
                        </h3>
                        <p className="text-gray-700">
                            Estudos indicam que sem o uso de contenção, cerca de <strong>70% dos pacientes</strong> sofrem algum grau de recidiva (dentes voltando a entortar) nos primeiros 2 anos pós-tratamento.
                        </p>
                    </div>
                </div>

                {/* Por que os dentes se movem? */}
                <section className="mb-12">
                    <h2 className="text-3xl font-bold mb-6 text-gray-900">Por Que os Dentes se Movem de Volta?</h2>
                    <p className="text-gray-700 mb-6">
                        Imagine que seus dentes estão presos ao osso por fibras elásticas (ligamento periodontal). Durante o tratamento, esticamos essas fibras para mover os dentes. Quando o aparelho é removido, essas fibras têm uma "memória elástica" e tendem a puxar os dentes de volta para a posição antiga até que o osso ao redor se solidifique completamente na nova posição.
                    </p>

                    <div className="bg-blue-50 p-6 rounded-xl">
                        <h4 className="font-bold text-blue-800 mb-2">Fatores que contribuem para a recidiva:</h4>
                        <ul className="space-y-2 text-gray-700">
                            <li className="flex items-center gap-2">
                                <RotateCcw className="w-4 h-4 text-blue-600" />
                                Memória das fibras gengivais
                            </li>
                            <li className="flex items-center gap-2">
                                <RotateCcw className="w-4 h-4 text-blue-600" />
                                Crescimento tardio dos maxilares
                            </li>
                            <li className="flex items-center gap-2">
                                <RotateCcw className="w-4 h-4 text-blue-600" />
                                Pressão da língua e lábios
                            </li>
                            <li className="flex items-center gap-2">
                                <RotateCcw className="w-4 h-4 text-blue-600" />
                                Envelhecimento natural (sim, dentes se movem a vida toda!)
                            </li>
                        </ul>
                    </div>
                </section>

                {/* Tipos de Contenção */}
                <section className="mb-12">
                    <h2 className="text-3xl font-bold mb-8 text-gray-900">Tipos de Contenção: Qual a Melhor?</h2>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                            <h3 className="text-xl font-bold text-teal-700 mb-4">1. Contenção Fixa</h3>
                            <p className="text-gray-600 mb-4">
                                Um fiozinho metálico colado atrás dos dentes inferiores (e às vezes superiores).
                            </p>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li className="text-green-600">✅ Invisível e não precisa lembrar de usar</li>
                                <li className="text-green-600">✅ Mantém os dentes da frente alinhados</li>
                                <li className="text-red-500">❌ Dificulta o uso do fio dental</li>
                                <li className="text-red-500">❌ Não segura os dentes do fundo</li>
                            </ul>
                        </div>

                        <div className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                            <h3 className="text-xl font-bold text-teal-700 mb-4">2. Contenção Removível (Vivera/Placa)</h3>
                            <p className="text-gray-600 mb-4">
                                Parecida com o alinhador invisível, mas feita de material mais rígido e durável.
                            </p>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li className="text-green-600">✅ Mantém TODOS os dentes na posição</li>
                                <li className="text-green-600">✅ Fácil de limpar</li>
                                <li className="text-green-600">✅ Pode ser usada apenas para dormir (após fase inicial)</li>
                                <li className="text-red-500">❌ Depende da disciplina do paciente</li>
                            </ul>
                        </div>
                    </div>

                    <p className="mt-6 text-gray-700 italic text-center">
                        <strong>Nossa recomendação:</strong> Na maioria dos casos, usamos uma combinação (fixa inferior + removível superior) ou apenas removíveis para garantir estabilidade total.
                    </p>
                </section>

                {/* Protocolo de Uso */}
                <section className="mb-12 bg-gray-50 rounded-2xl p-8">
                    <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-2">
                        <Clock className="w-6 h-6 text-gray-700" />
                        Por Quanto Tempo Devo Usar?
                    </h2>

                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-teal-700">1</div>
                            <div>
                                <h4 className="font-bold text-gray-900">Fase Intensiva (3-6 meses)</h4>
                                <p className="text-gray-600">Uso integral (20-22h/dia), removendo apenas para comer. É crucial para a estabilização óssea.</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-teal-700">2</div>
                            <div>
                                <h4 className="font-bold text-gray-900">Fase de Transição (6-12 meses)</h4>
                                <p className="text-gray-600">Uso apenas para dormir (8-10h/noite). Se sentir a contenção apertada, aumente o tempo de uso.</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-teal-700">3</div>
                            <div>
                                <h4 className="font-bold text-gray-900">Manutenção Vitalícia</h4>
                                <p className="text-gray-600">Uso para dormir algumas noites por semana, PARA SEMPRE. É a única garantia de que seu sorriso continuará perfeito aos 80 anos.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ Rápido */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-gray-900">Dúvidas Comuns</h2>
                    <div className="space-y-4">
                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                            <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-2">
                                <CircleHelp className="w-5 h-5 text-teal-500" />
                                Minha contenção quebrou/perdi. O que fazer?
                            </h3>
                            <p className="text-gray-600">
                                Ligue para seu ortodontista IMEDIATAMENTE. Seus dentes podem começar a se mover em questão de dias. Não espere a próxima consulta.
                            </p>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                            <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-2">
                                <CircleHelp className="w-5 h-5 text-teal-500" />
                                Preciso trocar a contenção?
                            </h3>
                            <p className="text-gray-600">
                                Sim. Contenções removíveis desgastam e perdem a força com o tempo. Recomendamos a troca a cada 12-24 meses para manter a higiene e eficácia.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Related Articles */}
                <RelatedArticles
                    articles={[
                        {
                            title: "Como é Feito o Molde para Alinhador",
                            description: "Entenda a tecnologia por trás dos seus alinhadores e contenções.",
                            href: "/blog/como-e-feito-molde-alinhador",
                            tag: "Tecnologia"
                        },
                        {
                            title: "15 Dicas para um Sorriso Perfeito",
                            description: "Cuidados diários além do alinhamento.",
                            href: "/blog/sorriso-perfeito-15-dicas",
                            tag: "Dicas"
                        },
                        {
                            title: "Dor de Cabeça e Má Oclusão",
                            description: "Como dentes alinhados previnem dores.",
                            href: "/blog/dor-cabeca-ma-oclusao",
                            tag: "Saúde"
                        }
                    ]}
                />

                {/* CTA Final */}
                <section className="bg-teal-700 text-white rounded-2xl p-8 md:p-12 text-center shadow-xl mt-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Cuide do Seu Investimento
                    </h2>
                    <p className="text-xl mb-8 text-teal-100">
                        Precisa de uma nova contenção ou quer iniciar seu tratamento com segurança?
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/pacientes"
                            className="bg-white text-teal-700 px-8 py-4 rounded-lg font-semibold hover:bg-teal-50 transition-colors shadow-lg inline-block"
                        >
                            Falar com Especialista
                        </Link>
                    </div>
                </section>

            </article>
        </div>
    );
}
