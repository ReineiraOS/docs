import { useParams } from "react-router-dom";
import DocsLayout from "@/components/layout/DocsLayout";
import PageHeader from "@/components/docs/PageHeader";
import SectionHub from "@/components/docs/SectionHub";
import { getSectionById } from "@/data/navigation";
import NotFound from "@/pages/NotFound";

export default function SectionPage() {
  const { section: sectionId } = useParams<{ section: string }>();
  const section = getSectionById(sectionId ?? "");

  if (!section) return <NotFound />;

  return (
    <DocsLayout>
      <PageHeader title={section.label} />
      <SectionHub section={section} />
    </DocsLayout>
  );
}
