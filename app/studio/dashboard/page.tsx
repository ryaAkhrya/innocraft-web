import { StudioShell } from "@/components/studio/studio-shell";
import { StudioDashboardCards } from "@/components/studio/dashboard-cards";
import { StudioQuickActions } from "@/components/studio/quick-actions";

export default function StudioDashboardPage() {
  return (
    <StudioShell>
      <div className="space-y-8">
        <section className="space-y-3">
          <h2 className="text-2xl font-semibold tracking-tight text-white">Dashboard</h2>
          <p className="text-sm text-white/60">
            Overview of your INNOCRAFT studio content.
          </p>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <p className="text-sm text-white/80">
            Welcome to INNOCRAFT Studio.
          </p>
          <p className="mt-2 text-sm text-white/60">
            Use the navigation on the left to manage your website content. All changes are saved locally.
          </p>
        </section>

        <section>
          <h3 className="text-sm font-medium text-white/60 mb-3">System Status</h3>
          <StudioDashboardCards />
        </section>

        <section>
          <h3 className="text-sm font-medium text-white/60 mb-3">Quick Actions</h3>
          <StudioQuickActions />
        </section>
      </div>
    </StudioShell>
  );
}