import { chapters } from "@/lib/data/chapters";

export function generateStaticParams() {
  return chapters.map((chapter) => ({
    id: chapter.id,
  }));
}

export default function ChapterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
