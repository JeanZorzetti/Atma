import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface RelatedArticle {
  title: string;
  description: string;
  href: string;
  tag: string;
}

interface RelatedArticlesProps {
  articles: RelatedArticle[];
  title?: string;
}

export function RelatedArticles({ articles, title = "Artigos Relacionados" }: RelatedArticlesProps) {
  return (
    <section className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8 my-12">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">{title}</h2>
      <div className="grid md:grid-cols-2 gap-6">
        {articles.map((article, index) => (
          <Link
            key={index}
            href={article.href}
            className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow border-l-4 border-blue-600 group"
          >
            <div className="flex items-start justify-between mb-2">
              <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">
                {article.tag}
              </span>
              <ArrowRight className="w-5 h-5 text-blue-600 group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="font-bold text-lg mb-2 text-gray-900 group-hover:text-blue-600 transition-colors">
              {article.title}
            </h3>
            <p className="text-sm text-gray-600">
              {article.description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
