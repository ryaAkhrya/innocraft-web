import { cn } from "@/lib/utils";

const StatusItem = ({
  label,
  status,
  icon,
}: {
  label: string;
  status: boolean;
  icon: React.ReactNode;
}) => {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
      <div
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-xl",
          status ? "bg-green-500/20 text-green-400" : "bg-white/10 text-white/60",
        )}
      >
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-white">{label}</p>
        <p className="text-xs text-white/60">
          {status ? "Connected" : "Not configured"}
        </p>
      </div>
    </div>
  );
};

export function StudioDashboardCards() {
  return (
    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
      <StatusItem
        label="Studio CMS"
        status
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        }
      />
      <StatusItem
        label="Homepage"
        status
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
          >
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          </svg>
        }
      />
      <StatusItem
        label="Local Storage"
        status
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l3 3" />
          </svg>
        }
      />
      <StatusItem
        label="Prototype"
        status
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
          >
            <rect x="2" y="3" width="20" height="14" rx="2" />
            <line x1="2" y1="21" x2="22" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
            <path d="M7 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16" />
          </svg>
        }
      />
    </div>
  );
}