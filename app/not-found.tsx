import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-start justify-center px-4">
      <div className="rounded-[2rem] border border-border bg-white/80 p-8 shadow-soft backdrop-blur">
        <h1 className="text-3xl font-semibold tracking-tight text-heading">
          Page not found
        </h1>
        <p className="mt-3 text-paragraph">
          The page you’re looking for does not exist.
        </p>

        <Link
          href="/"
          className="mt-6 inline-flex rounded-full border border-buttonBg bg-buttonBg px-6 py-3 text-sm font-semibold text-white transition hover:bg-buttonHover"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}

