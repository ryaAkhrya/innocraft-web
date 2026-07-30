const YOUTUBE_VIDEO_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;

const YOUTUBE_HOSTNAMES = new Set([
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "music.youtube.com",
  "youtube-nocookie.com",
  "www.youtube-nocookie.com",
]);

function parseUrl(value: string): URL | null {
  const trimmedValue = value.trim();
  if (!trimmedValue) return null;

  try {
    return new URL(trimmedValue);
  } catch {
    try {
      return new URL(`https://${trimmedValue}`);
    } catch {
      return null;
    }
  }
}

function normalizeVideoId(value: string | null | undefined): string | null {
  if (!value) return null;

  const videoId = value.split(/[?&#/]/, 1)[0];
  return YOUTUBE_VIDEO_ID_PATTERN.test(videoId) ? videoId : null;
}

export function extractYouTubeVideoId(value: string): string | null {
  const url = parseUrl(value);
  if (!url || !["http:", "https:"].includes(url.protocol)) return null;

  const hostname = url.hostname.toLowerCase();

  if (hostname === "youtu.be" || hostname === "www.youtu.be") {
    return normalizeVideoId(url.pathname.split("/").filter(Boolean)[0]);
  }

  if (!YOUTUBE_HOSTNAMES.has(hostname)) return null;

  const segments = url.pathname.split("/").filter(Boolean);

  if (segments[0] === "watch") {
    return normalizeVideoId(url.searchParams.get("v"));
  }

  if (["embed", "shorts"].includes(segments[0] ?? "")) {
    return normalizeVideoId(segments[1]);
  }

  return null;
}

export function detectYouTubeUrl(value: string): boolean {
  return extractYouTubeVideoId(value) !== null;
}

export function createYouTubeEmbedUrl(value: string): string | null {
  const videoId = extractYouTubeVideoId(value);
  if (!videoId) return null;

  const params = new URLSearchParams({
    autoplay: "1",
    playsinline: "1",
    rel: "0",
  });

  return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`;
}

export function createYouTubeThumbnailUrl(value: string): string | null {
  const videoId = extractYouTubeVideoId(value);
  if (!videoId) return null;

  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}