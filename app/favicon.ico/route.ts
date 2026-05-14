const faviconSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <defs>
    <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="#29b7b0" />
      <stop offset="100%" stop-color="#1c3458" />
    </linearGradient>
  </defs>
  <rect width="64" height="64" rx="14" fill="url(#bg)" />
  <path d="M16 18h20c8.837 0 16 7.163 16 16s-7.163 16-16 16H16z" fill="rgba(255,255,255,0.12)" />
  <text
    x="32"
    y="38"
    font-family="Arial, Helvetica, sans-serif"
    font-size="24"
    font-weight="700"
    text-anchor="middle"
    fill="#f8fbff"
  >
    SP
  </text>
</svg>
`.trim();

export function GET() {
  return new Response(faviconSvg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
