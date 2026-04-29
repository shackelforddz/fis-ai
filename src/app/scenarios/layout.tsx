import { Nav } from "@/components/layout/nav";
import { GradientBg } from "@/components/layout/gradient-bg";

export default function ScenariosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex gap-4 p-4 h-full w-full bg-background overflow-hidden">
      <GradientBg className="pointer-events-none absolute top-0 left-0 w-full  h-[298px] z-0 opacity-50" />
      <Nav className="relative z-10" />
      {children}
    </div>
  );
}
