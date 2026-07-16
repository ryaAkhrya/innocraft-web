import { StudioShell } from "@/components/studio/studio-shell";
import { StudioHeroEditor } from "@/components/studio/hero-editor";
import { defaultStudioHeroData } from "@/lib/studio/mock-hero";

export default function StudioHeroPage() {
  return (
    <StudioShell>
      <StudioHeroEditor initialData={defaultStudioHeroData} />
    </StudioShell>
  );
}


