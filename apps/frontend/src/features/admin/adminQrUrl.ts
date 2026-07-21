function getPublicSiteOrigin() {
  const configuredOrigin = import.meta.env.VITE_PUBLIC_SITE_URL?.trim();
  return (configuredOrigin || window.location.origin).replace(/\/+$/, "");
}

export function getPublicQrUrl(code: string) {
  const normalizedCode = code.trim() || "PREVIEW";
  return `${getPublicSiteOrigin()}/q/${encodeURIComponent(normalizedCode)}`;
}

export function getPublicRouteUrl(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getPublicSiteOrigin()}${normalizedPath}`;
}
