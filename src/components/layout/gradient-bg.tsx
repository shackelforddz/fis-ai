"use client";

import { usePathname } from "next/navigation";

const routeColors: Record<string, string> = {
  "/risks": "#EB1F32",
  "/risk": "#EB1F32",
};

const defaultColor = "#4BCD3E";

const allColors = [defaultColor, ...new Set(Object.values(routeColors))];

function getGradientColor(pathname: string) {
  for (const [route, color] of Object.entries(routeColors)) {
    if (pathname === route || pathname.startsWith(route + "/")) {
      return color;
    }
  }
  return defaultColor;
}

export function GradientBg({ className }: { className?: string }) {
  const pathname = usePathname();
  const activeColor = getGradientColor(pathname);

  return (
    <div className={className}>
      {allColors.map((color) => (
        <svg
          key={color}
          width="1440"
          height="298"
          viewBox="0 0 1440 298"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out"
          style={{ opacity: color === activeColor ? 1 : 0 }}
        >
          <g clipPath={`url(#gradient-clip-${color})`}>
            <g filter={`url(#gradient-blur-${color})`}>
              <path d="M-45 116.5V-204H1617V-93.5L-45 116.5Z" fill={color} />
            </g>
          </g>
          <defs>
            <filter
              id={`gradient-blur-${color}`}
              x="-173"
              y="-332"
              width="1918"
              height="576.5"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
              <feGaussianBlur stdDeviation="64" result="effect1_foregroundBlur" />
            </filter>
            <clipPath id={`gradient-clip-${color}`}>
              <rect width="1440" height="298" fill="white" />
            </clipPath>
          </defs>
        </svg>
      ))}
    </div>
  );
}
