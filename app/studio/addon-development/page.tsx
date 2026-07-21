import { StudioShell } from "@/components/studio/studio-shell";
import { AddonDevelopmentEditor } from "@/components/studio/addon-development-editor";
import { defaultStudioAddonDevelopmentData } from "@/lib/studio/mock-addon-development";

export default function StudioAddonDevelopmentPage() {
  return (
    <StudioShell>
      <AddonDevelopmentEditor initialData={defaultStudioAddonDevelopmentData} />
    </StudioShell>
  );
}