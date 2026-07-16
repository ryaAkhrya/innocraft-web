import { cn } from "@/lib/utils";

type Activity = {
  time: string;
  title: string;
  meta: string;
  tone: "pink" | "cyan" | "violet" | "amber";
};

const ActivityRow = ({ activity }: { activity: Activity }) => {
  const toneBg =
    activity.tone === "pink"
      ? "bg-[#FFCFC9]/20 text-[#FFCFC9]"
      : activity.tone === "cyan"
        ? "bg-[#9AE6FF]/20 text-[#9AE6FF]"
        : activity.tone === "violet"
          ? "bg-[#C4B5FD]/20 text-[#C4B5FD]"
          : "bg-[#FDE68A]/20 text-[#FDE68A]";

  return (
    <div className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className={cn("rounded-2xl px-3 py-2 text-sm font-medium", toneBg)}>
        {activity.time}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-white">{activity.title}</p>
        <p className="mt-1 text-sm text-white/60">{activity.meta}</p>
      </div>
    </div>
  );
};

export function StudioRecentActivity() {
  const activities: Activity[] = [
    {
      time: "10m",
      title: "Hero section updated",
      meta: "Headline and CTA copy refreshed for the new schedule.",
      tone: "pink",
    },
    {
      time: "2h",
      title: "New mentor profile added",
      meta: "Added “Raka” to the mentor list (mock data).",
      tone: "cyan",
    },
    {
      time: "Yesterday",
      title: "Gallery images reviewed",
      meta: "56 items marked as ready for publishing.",
      tone: "violet",
    },
    {
      time: "3d",
      title: "Recruitment post scheduled",
      meta: "Lowongan batch will go live next week.",
      tone: "amber",
    },
  ];

  return (
    <div className="grid gap-3">
      {activities.map((a) => (
        <ActivityRow key={a.title + a.time} activity={a} />
      ))}
    </div>
  );
}

