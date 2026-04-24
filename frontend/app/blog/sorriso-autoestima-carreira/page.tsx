import type { Metadata } from 'next';
import { Briefcase, Heart, Star, TrendingUp, CheckCircle, Quote, User, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { RelatedArticles } from '@/components/blog/related-articles';
import Image from 'next/image';

export const metadata: Metadata = {
    title: 'O Poder do Sorriso: Impacto na Autoestima e Sucesso Profissional [2025]',
    description: 'Descubra como um sorriso alinhado pode impulsionar sua carreira e transformar sua autoestima. Dados sobre confiança, percepção profissional e sucesso.',
    keywords: 'sorriso e carreira, autoestima profissional, impacto do sorriso, sucesso profissional, imagem pessoal',
    openGraph: {
        title: 'O Poder do Sorriso: Impacto na Autoestima e Sucesso Profissional',
        description: 'Seu sorriso pode estar segurando sua promoção? Veja o que a ciência diz sobre a relação entre dentes bonitos e sucesso na carreira.',
        type: 'article',
        publishedTime: '2025-01-26T09:00:00Z',
        authors: ['Dr. Rafael Martins'],
        tags: ['carreira', 'autoestima', 'sucesso', 'psicologia'],
    },
    alternates: {
        canonical: 'https://atma.roilabs.com.br/blog/sorriso-autoestima-carreira'
    }
};

export default function SorrisoAutoestimaCarreiraPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Hero Section */}
            <section className="relative h-[500px] flex items-center justify-center text-white overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/blog/sorriso-autoestima-featured.webp"
                        alt="Profissional sorrindo com confiança em ambiente de trabalho"
                        fill
                        className="object-cover brightness-50"
                        priority
                    />
                </div>

                <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
                    <Link href="/blog" className="text-blue-100 hover:text-white mb-6 inline-block transition-colors">
                        ← Voltar para o Blog
                    </Link>

                    <div className="flex items-center justify-center gap-2 mb-6">
                        <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                        <span className="text-base font-medium bg-white/20 px-4 py-1.5 rounded-full backdrop-blur-sm border border-white/30">
                            Carreira & Sucesso
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold mb-8 leading-tight drop-shadow-lg">
                        O Poder do Sorriso: Impacto na Autoestima e Sucesso Profissional
                    </h1>

                    <div className="flex flex-wrap justify-center gap-6 text-sm md:text-base text-blue-50">
                        <div className="flex items-center gap-2">
                            <User className="w-5 h-5" />
                            <span>Por Dr. Rafael Martins</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Briefcase className="w-5 h-5" />
                            <span>7 min de leitura</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <article className="max-w-4xl mx-auto px-4 py-12 -mt-20 relative z-20 bg-white rounded-t-3xl shadow-xl">

                {/* Introdução */}
                <div className="prose prose-lg max-w-none mb-12 pt-8">
                    <p className="text-xl text-gray-600 leading-relaxed font-medium border-l-4 border-blue-600 pl-6 italic">
                        "Seu sorriso é seu cartão de visitas." Você já ouviu essa frase mil vezes, mas sabia que ela tem respaldo científico?
                    </p>

                    <p className="text-gray-700 leading-relaxed mt-6">
                        Em um mercado de trabalho cada vez mais competitivo, competência técnica é fundamental, mas a <strong>imagem pessoal e a autoconfiança</strong> desempenham papéis decisivos. Um sorriso alinhado não é apenas uma questão de vaidade; é uma ferramenta poderosa de comunicação não-verbal que transmite segurança, saúde e profissionalismo.
                    </p>
                </div>

                {/* Dados Impactantes */}
                <section className="mb-16 grid md:grid-cols-3 gap-6">
                    <div className="bg-blue-50 p-6 rounded-xl text-center">
                        <h3 className="text-4xl font-bold text-blue-600 mb-2">73%</h3>
                        <p className="text-gray-700 text-sm">
                            dos americanos acreditam que pessoas com sorriso bonito são <strong>mais confiáveis</strong>.
                        </p>
                    </div>
                    <div className="bg-indigo-50 p-6 rounded-xl text-center">
                        <h3 className="text-4xl font-bold text-indigo-600 mb-2">68%</h3>
                        <p className="text-gray-700 text-sm">
                            afirmam que um sorriso atraente aumenta as chances de <strong>sucesso profissional</strong>.
                        </p>
                    </div>
                    <div className="bg-purple-50 p-6 rounded-xl text-center">
                        <h3 className="text-4xl font-bold text-purple-600 mb-2">100%</h3>
                        <p className="text-gray-700 text-sm">
                            da sua <strong>autoconfiança</strong> pode ser transformada ao corrigir dentes desalinhados.
                        </p>
                    </div>
                </section>

                {/* O Ciclo da Confiança */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold mb-8 text-gray-900 flex items-center gap-3">
                        <Sparkles className="w-8 h-8 text-yellow-500" />
                        O Ciclo da Confiança
                    </h2>

                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-2xl border border-gray-200">
                        <p className="text-lg text-gray-700 mb-6">
                            Existe um fenômeno psicológico interessante: quando você não gosta do seu sorriso, você tende a sorrir menos, cobrir a boca ao rir ou falar de forma mais contida. Isso é interpretado inconscientemente pelos outros como <strong>insegurança, timidez ou antipatia</strong>.
                        </p>

                        <div className="grid md:grid-cols-2 gap-8 mt-8">
                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <h4 className="font-bold text-red-600 mb-3 text-lg">🚫 O Ciclo da Insegurança</h4>
                                <ul className="space-y-2 text-gray-600">
                                    <li className="flex items-start gap-2">
                                        <span className="text-red-400">•</span> Vergonha dos dentes
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-red-400">•</span> Evita sorrir em reuniões/fotos
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-red-400">•</span> Transmite imagem fechada/insegura
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-red-400">•</span> Perde oportunidades de conexão
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-white p-6 rounded-lg shadow-sm border-2 border-green-100">
                                <h4 className="font-bold text-green-600 mb-3 text-lg">✅ O Ciclo do Sucesso</h4>
                                <ul className="space-y-2 text-gray-600">
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                                        <span>Orgulho do sorriso</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                                        <span>Sorri livremente e com frequência</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                                        <span>Transmite abertura, carisma e líderança</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                                        <span>Atrai pessoas e oportunidades</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Por que Alinhadores são a Melhor Opção para Profissionais */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold mb-8 text-gray-900">A Solução para Profissionais Ocupados</h2>
                    <p className="text-lg text-gray-700 mb-6">
                        Muitos adultos adiam o tratamento ortodôntico porque não querem usar o "aparelho de ferro" em reuniões de board ou apresentações para clientes. É aqui que os <strong>alinhadores invisíveis</strong> mudam o jogo.
                    </p>

                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <Briefcase className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Imagem Profissional Intacta</h3>
                                <p className="text-gray-600">
                                    Você corrige seus dentes sem que ninguém perceba. Sua imagem de seriedade e maturidade profissional é preservada durante todo o tratamento.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <TrendingUp className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Eficiência de Tempo</h3>
                                <p className="text-gray-600">
                                    Consultas mais rápidas e espaçadas. Para quem tem agenda cheia, não precisar ir ao dentista a cada 15 dias para "apertar o aparelho" é um grande diferencial.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Depoimento */}
                <section className="mb-16 bg-blue-600 text-white p-8 md:p-12 rounded-2xl shadow-xl relative overflow-hidden">
                    <Quote className="absolute top-4 left-4 w-24 h-24 text-blue-500/30" />
                    <div className="relative z-10 text-center max-w-2xl mx-auto">
                        <p className="text-xl md:text-2xl font-medium italic mb-6">
                            "Eu tinha vergonha de sorrir nas fotos do LinkedIn e em reuniões de vídeo. Depois do tratamento com alinhadores, sinto que minha postura profissional mudou completamente. Falo com mais segurança e sorrio sem medo."
                        </p>
                        <div className="font-bold text-lg">— Carlos M., Diretor Comercial, 38 anos</div>
                    </div>
                </section>

                {/* Related Articles */}
                <RelatedArticles
                    articles={[
                        {
                            title: "Ortodontia Invisível para Adultos",
                            description: "Guia completo sobre tratamentos discretos para adultos.",
                            href: "/blog/ortodontia-invisivel-adultos",
                            tag: "Adultos"
                        },
                        {
                            title: "Alinhadores Invisíveis vs Aparelho Fixo",
                            description: "Por que profissionais preferem alinhadores.",
                            href: "/blog/alinhadores-vs-aparelho-fixo",
                            tag: "Comparação"
                        },
                        {
                            title: "Quanto Custa Alinhador Invisível?",
                            description: "Investimento e retorno para seu sorriso.",
                            href: "/blog/quanto-custa-alinhador-invisivel",
                            tag: "Custos"
                        }
                    ]}
                />

                {/* CTA Final */}
                <section className="bg-gray-900 text-white rounded-2xl p-8 md:p-12 text-center shadow-2xl mt-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Invista na Sua Carreira
                    </h2>
                    <p className="text-xl mb-8 text-gray-300">
                        O sorriso que você sempre quis está mais perto do que imagina. Agende uma avaliação discreta.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/pacientes"
                            className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-blue-500/30 inline-block"
                        >
                            Agendar Avaliação
                        </Link>
                    </div>
                </section>

            </article>
        </div>
    );
}
