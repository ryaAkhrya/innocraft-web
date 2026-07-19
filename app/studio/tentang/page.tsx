import { StudioShell } from "@/components/studio/studio-shell";
import { StudioAboutEditor } from "@/components/studio/about-editor";
import { defaultStudioTentangData } from "@/lib/studio/mock-tentang";

export default function StudioTentangPage() {
  return (
    <StudioShell>
      <StudioAboutEditor initialData={defaultStudioTentangData} />
    </StudioShell>
  );
}