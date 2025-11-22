import type { Metadata } from 'next';
import { Calendar, Clock, Tag, TrendingUp, CheckCircle, CircleAlert, Heart, Smile, UserCheck } from 'lucide-react';
import Link from 'next/link';
import { RelatedArticles } from '@/components/blog/related-articles';

export const metadata: Metadata = {
    title: 'Alinhadores Invisíveis para Adolescentes: O Fim do Bullying? [2025]',
    description: 'Descubra como alinhadores invisíveis estão ajudando adolescentes a corrigir os dentes sem sofrer bullying. Autoestima, conforto e tecnologia.',
    keywords: 'alinhador invisível adolescente, bullying aparelho fixo, ortodontia teen, invisalign teen, autoestima adolescente',
    openGraph: {
        title: 'Alinhadores Invisíveis para Adolescentes: O Fim do Bullying?',
        description: 'Bullying por causa de aparelho fixo é coisa do passado. Veja como a tecnologia está ajudando adolescentes a sorrirem com confiança.',
        type: 'article',
        publishedTime: '2025-01-25T10:00:00Z',
        authors: ['Dra. Ana Silva'],
        tags: ['adolescentes', 'bullying', 'autoestima', 'tecnologia'],
    },
    alternates: {
        canonical: 'https://atma.roilabs.com.br/blog/alinhadores-invisiveis-adolescentes'
    }
};

export default function AlinhadoresAdolescentesPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
            {/* Hero Section */}
            <section className="bg-blue-600 text-white py-16">
                <div className="max-w-4xl mx-auto px-4">
                    <Link href="/blog" className="text-blue-100 hover:text-white mb-4 inline-block">
                        ← Voltar para o Blog
                    </Link>

                    <div className="flex items-center gap-2 mb-4">
                        <Tag className="w-5 h-5" />
                        <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
                            Adolescentes & Autoestima
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                        Alinhadores Invisíveis para Adolescentes: O Fim do Bullying?
                    </h1>

                    <div className="flex flex-wrap gap-6 text-sm text-blue-100">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>25 de janeiro de 2025</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>5 min de leitura</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <UserCheck className="w-4 h-4" />
                            <span>Revisado por Dra. Ana Silva</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <article className="max-w-4xl mx-auto px-4 py-12">

                {/* Introdução */}
                <div className="prose prose-lg max-w-none mb-12">
                    <p className="text-lg text-gray-700 leading-relaxed">
                        A adolescência já é uma fase complicada por si só. Mudanças no corpo, pressão social, escola... e para muitos, o temido <strong>"sorriso metálico"</strong>. Por décadas, o aparelho fixo foi um rito de passagem quase obrigatório, mas também um alvo frequente de apelidos e insegurança.
                    </p>

                    <p className="text-gray-700 leading-relaxed">
                        Mas os tempos mudaram. A tecnologia dos alinhadores invisíveis, antes exclusiva para adultos, agora é a escolha número 1 para adolescentes que querem corrigir os dentes sem comprometer a autoestima.
                    </p>
                </div>

                {/* O Impacto do Bullying */}
                <section className="mb-12 bg-red-50 p-8 rounded-2xl border border-red-100">
                    <h2 className="text-2xl font-bold text-red-800 mb-4 flex items-center gap-2">
                        <CircleAlert className="w-6 h-6" />
                        O Impacto Emocional do Aparelho Fixo
                    </h2>
                    <p className="text-gray-700 mb-4">
                        Estudos mostram que <strong>47% dos adolescentes</strong> com aparelho fixo relatam ter sofrido algum tipo de provocação relacionada ao sorriso metálico. Isso pode levar a:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                        <li>Baixa autoestima e retraimento social</li>
                        <li>Medo de sorrir em fotos e vídeos (TikTok/Instagram)</li>
                        <li>Dificuldade na higienização, causando mau hálito</li>
                        <li>Feridas na boca que atrapalham a fala e alimentação</li>
                    </ul>
                </section>

                {/* A Revolução dos Alinhadores */}
                <section className="mb-12">
                    <h2 className="text-3xl font-bold mb-6 text-gray-900">Por que os Alinhadores são a Solução?</h2>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                                <Smile className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">100% Discreto</h3>
                            <p className="text-gray-600">
                                Praticamente invisível. Nas fotos de formatura, selfies ou vídeos, o adolescente aparece sorrindo naturalmente, sem metais.
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                <TrendingUp className="w-6 h-6 text-green-600" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Mais Rápido</h3>
                            <p className="text-gray-600">
                                A tecnologia digital permite movimentos mais precisos, reduzindo o tempo de tratamento em até 50% comparado ao fixo.
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                                <Heart className="w-6 h-6 text-purple-600" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Sem Restrições Alimentares</h3>
                            <p className="text-gray-600">
                                Pode comer pipoca, maçã do amor e tudo o que o aparelho fixo proíbe. Basta tirar o alinhador para comer!
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                                <UserCheck className="w-6 h-6 text-orange-600" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Higiene Facilitada</h3>
                            <p className="text-gray-600">
                                Remove-se para escovar e passar fio dental. Sem "passa-fio" e sem restos de comida presos nos braquetes.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Comparativo */}
                <section className="mb-12">
                    <h2 className="text-3xl font-bold mb-8 text-gray-900 text-center">Comparativo Rápido</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="p-4 border-b-2 border-gray-200">Característica</th>
                                    <th className="p-4 border-b-2 border-gray-200 text-red-600">Aparelho Fixo</th>
                                    <th className="p-4 border-b-2 border-gray-200 text-green-600">Alinhador Invisível</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-gray-100">
                                    <td className="p-4 font-medium">Estética</td>
                                    <td className="p-4 text-gray-600">Metálico, chama atenção</td>
                                    <td className="p-4 font-bold text-green-700">Invisível</td>
                                </tr>
                                <tr className="border-b border-gray-100">
                                    <td className="p-4 font-medium">Conforto</td>
                                    <td className="p-4 text-gray-600">Machuca bochechas/lábios</td>
                                    <td className="p-4 font-bold text-green-700">Liso e confortável</td>
                                </tr>
                                <tr className="border-b border-gray-100">
                                    <td className="p-4 font-medium">Alimentação</td>
                                    <td className="p-4 text-gray-600">Muitas restrições</td>
                                    <td className="p-4 font-bold text-green-700">Sem restrições</td>
                                </tr>
                                <tr>
                                    <td className="p-4 font-medium">Bullying</td>
                                    <td className="p-4 text-gray-600">Risco alto</td>
                                    <td className="p-4 font-bold text-green-700">Risco zero</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Depoimento */}
                <section className="bg-gray-50 p-8 rounded-2xl mb-12 italic text-gray-700 border-l-4 border-blue-500">
                    "Eu não queria usar aparelho de jeito nenhum por causa das fotos de 15 anos. Com o alinhador, ninguém nem percebeu que eu estava usando, e meus dentes ficaram perfeitos a tempo da festa!"
                    <br />
                    <span className="font-bold not-italic text-gray-900 mt-2 block">— Julia M., 15 anos</span>
                </section>

                {/* Related Articles */}
                <RelatedArticles
                    articles={[
                        {
                            title: "Invisalign vs Alinhadores Nacionais",
                            description: "Qual a melhor opção para o seu bolso?",
                            href: "/blog/invisalign-vs-alinhadores-nacionais",
                            tag: "Comparação"
                        },
                        {
                            title: "Quanto Custa Alinhador Invisível?",
                            description: "Preços e formas de pagamento em 2025.",
                            href: "/blog/quanto-custa-alinhador-invisivel",
                            tag: "Custos"
                        },
                        {
                            title: "10 Mitos Sobre Aparelho Invisível",
                            description: "Descubra o que é verdade e o que é mentira.",
                            href: "/blog/10-mitos-aparelho-invisivel",
                            tag: "Mitos"
                        }
                    ]}
                />

                {/* CTA Final */}
                <section className="bg-blue-900 text-white rounded-2xl p-8 md:p-12 text-center shadow-xl mt-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Dê ao seu filho o sorriso que ele merece
                    </h2>
                    <p className="text-xl mb-8 text-blue-100">
                        Agende uma avaliação e descubra como o tratamento pode ser tranquilo e sem traumas.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/pacientes"
                            className="bg-white text-blue-900 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-lg inline-block"
                        >
                            Agendar Avaliação Teen
                        </Link>
                    </div>
                </section>

            </article>
        </div>
    );
}
