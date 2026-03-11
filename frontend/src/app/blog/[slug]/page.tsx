import { articles } from "@/data/articles";
import ArticlePageClient from "./ArticlePageClient";

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ArticlePageClient slug={slug} />;
}
