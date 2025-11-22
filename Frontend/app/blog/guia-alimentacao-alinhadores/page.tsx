import type { Metadata } from 'next';
import { Utensils, Coffee, CircleAlert, CheckCircle, CircleX, ChefHat, Droplet } from 'lucide-react';
import Link from 'next/link';
import { RelatedArticles } from '@/components/blog/related-articles';

export const metadata: Metadata = {
    title: 'Comendo com Alinhadores: O Guia Definitivo de Liberdade Alimentar [2025]',
    description: 'Pode comer de tudo com alinhador invisível? Descubra o que pode e não pode, dicas para restaurantes e como manter a higiene fora de casa.',
    keywords: 'comer com alinhador, dieta alinhador invisível, o que não pode comer com invisalign, bebidas alinhador, café com alinhador',
    openGraph: {
        title: 'Comendo com Alinhadores: O Guia Definitivo de Liberdade Alimentar',
        description: 'A maior vantagem dos alinhadores é comer o que quiser. Mas existem regras? Veja nosso guia completo de sobrevivência gastronômica.',
        type: 'article',
        publishedTime: '2025-01-28T11:00:00Z',
        authors: ['Equipe Atma Aligner'],
        tags: ['alimentação', 'dicas', 'lifestyle', 'guias'],
    },
    alternates: {
        canonical: 'https://atma.roilabs.com.br/blog/guia-alimentacao-alinhadores'
    }
};

export default function GuiaAlimentacaoPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-16">
                <div className="max-w-4xl mx-auto px-4">
                    <Link href="/blog" className="text-orange-100 hover:text-white mb-4 inline-block">
                        ← Voltar para o Blog
                    </Link>

                    <div className="flex items-center gap-2 mb-4">
                        <Utensils className="w-5 h-5" />
                        <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
                            Lifestyle & Alimentação
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                        Comendo com Alinhadores: O Guia Definitivo de Liberdade Alimentar
                    </h1>

                    <div className="flex flex-wrap gap-6 text-sm text-orange-100">
                        <div className="flex items-center gap-2">
                            <ChefHat className="w-4 h-4" />
                            <span>Guia Prático</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Coffee className="w-4 h-4" />
                            <span>4 min de leitura</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <article className="max-w-4xl mx-auto px-4 py-12">

                {/* Introdução */}
                <div className="prose prose-lg max-w-none mb-12">
                    <p className="text-lg text-gray-700 leading-relaxed">
                        Se você já usou aparelho fixo ou conhece alguém que usou, sabe a lista de "proibidos": nada de pipoca, nada de maçã inteira, cuidado com pão francês, adeus torresmo.
                    </p>

                    <p className="text-gray-700 leading-relaxed">
                        Com alinhadores invisíveis, a regra é simples e maravilhosa: <strong>TIROU, TÁ LIBERADO!</strong> Mas, como em tudo na vida, existem algumas "letras miúdas" que você precisa saber para não manchar seus alinhadores ou prejudicar o tratamento.
                    </p>
                </div>

                {/* A Regra de Ouro */}
                <section className="mb-12 bg-orange-50 border-l-4 border-orange-500 p-8 rounded-r-xl">
                    <h2 className="text-2xl font-bold text-orange-800 mb-4 flex items-center gap-2">
                        <CircleAlert className="w-6 h-6" />
                        A Regra de Ouro
                    </h2>
                    <p className="text-lg text-gray-800 font-medium">
                        Nunca, jamais, em hipótese alguma, COMA com os alinhadores na boca.
                    </p>
                    <p className="text-gray-700 mt-2">
                        A força da mastigação pode rachar o plástico, deformar o molde e arruinar a eficácia daquela placa. Além disso, a comida fica presa entre o plástico e o dente, criando um banquete para bactérias (olá, cáries!).
                    </p>
                </section>

                {/* Bebidas: O Que Pode? */}
                <section className="mb-12">
                    <h2 className="text-3xl font-bold mb-8 text-gray-900">Bebidas: O Que Pode e O Que Não Pode?</h2>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-green-50 p-6 rounded-xl border border-green-100">
                            <div className="flex items-center gap-3 mb-4">
                                <CheckCircle className="w-8 h-8 text-green-600" />
                                <h3 className="text-xl font-bold text-green-800">PODE (com alinhador)</h3>
                            </div>
                            <ul className="space-y-3 text-gray-700">
                                <li className="flex items-start gap-2">
                                    <Droplet className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                                    <span><strong>Água:</strong> Gelada ou natural. Beba à vontade! Ajuda a limpar a saliva.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Droplet className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                                    <span><strong>Água com gás:</strong> Sem sabor e sem açúcar.</span>
                                </li>
                            </ul>
                        </div>

                        <div className="bg-red-50 p-6 rounded-xl border border-red-100">
                            <div className="flex items-center gap-3 mb-4">
                                <CircleX className="w-8 h-8 text-red-600" />
                                <h3 className="text-xl font-bold text-red-800">NÃO PODE (tire o alinhador!)</h3>
                            </div>
                            <ul className="space-y-3 text-gray-700">
                                <li className="flex items-start gap-2">
                                    <Coffee className="w-5 h-5 text-brown-600 flex-shrink-0 mt-0.5" />
                                    <span><strong>Café/Chá Quente:</strong> O calor deforma o plástico. O pigmento mancha.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Coffee className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                                    <span><strong>Vinho Tinto/Suco de Uva:</strong> Mancha instantânea. Seu alinhador ficará roxo.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Coffee className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                                    <span><strong>Refrigerantes/Sucos Ácidos:</strong> O açúcar entra no alinhador e fica "marinando" seus dentes no ácido. Risco altíssimo de cárie.</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-6 bg-gray-100 p-4 rounded-lg text-center">
                        <p className="text-gray-600 text-sm italic">
                            "Doutor, mas e se eu usar um canudinho?" <br />
                            <strong>Resposta:</strong> Ajuda, mas não resolve. O líquido ainda banha os dentes. Se for beber algo diferente de água, o ideal é tirar. Se não der para tirar, beba rápido e enxágue com água logo em seguida.
                        </p>
                    </div>
                </section>

                {/* Kit de Sobrevivência */}
                <section className="mb-12">
                    <h2 className="text-3xl font-bold mb-6 text-gray-900">Kit de Sobrevivência para Restaurantes</h2>
                    <p className="text-gray-700 mb-6">
                        Sair para jantar não precisa ser um drama. Basta ter sempre com você o seu "Kit Sorriso":
                    </p>

                    <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
                            <div className="text-4xl mb-2">case</div>
                            <h4 className="font-bold">Caixinha do Alinhador</h4>
                            <p className="text-xs text-gray-500">NUNCA embrulhe no guardanapo (vai pro lixo, certeza!)</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
                            <div className="text-4xl mb-2">🪥</div>
                            <h4 className="font-bold">Escova de Viagem</h4>
                            <p className="text-xs text-gray-500">Essencial para limpar antes de recolocar.</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
                            <div className="text-4xl mb-2">🦷</div>
                            <h4 className="font-bold">Fio Dental</h4>
                            <p className="text-xs text-gray-500">Tira aquele pedacinho de carne que a escova não pegou.</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
                            <div className="text-4xl mb-2">💧</div>
                            <h4 className="font-bold">Água</h4>
                            <p className="text-xs text-gray-500">Para bochecho se não der para escovar na hora.</p>
                        </div>
                    </div>
                </section>

                {/* Related Articles */}
                <RelatedArticles
                    articles={[
                        {
                            title: "10 Mitos Sobre Aparelho Invisível",
                            description: "Mito #5: Você não pode comer nada. Verdade ou mentira?",
                            href: "/blog/10-mitos-aparelho-invisivel",
                            tag: "Mitos"
                        },
                        {
                            title: "Alinhadores Invisíveis para Adolescentes",
                            description: "Como lidar com a alimentação na escola.",
                            href: "/blog/alinhadores-invisiveis-adolescentes",
                            tag: "Teen"
                        },
                        {
                            title: "15 Dicas para um Sorriso Perfeito",
                            description: "Alimentos que ajudam a manter os dentes brancos.",
                            href: "/blog/sorriso-perfeito-15-dicas",
                            tag: "Dicas"
                        }
                    ]}
                />

                {/* CTA Final */}
                <section className="bg-orange-600 text-white rounded-2xl p-8 md:p-12 text-center shadow-xl mt-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Liberdade para Sorrir e Comer
                    </h2>
                    <p className="text-xl mb-8 text-orange-100">
                        Quer corrigir seus dentes sem abrir mão dos seus pratos favoritos?
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/pacientes"
                            className="bg-white text-orange-600 px-8 py-4 rounded-lg font-semibold hover:bg-orange-50 transition-colors shadow-lg inline-block"
                        >
                            Conheça a Atma Aligner
                        </Link>
                    </div>
                </section>

            </article>
        </div>
    );
}
