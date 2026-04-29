import { Nav } from "@/components/layout/nav";
import { CopilotPanel } from "@/components/layout/copilot-panel";
import { GradientBg } from "@/components/layout/gradient-bg";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex gap-4 p-4 h-full w-full bg-background overflow-hidden">
      {/* Background gradient glow */}
      <GradientBg className="pointer-events-none absolute top-0 left-0 w-full  h-[298px] z-0 opacity-50" />

      <Nav className="relative z-10" />

      {/* Main Content Panel */}
      <main className="relative z-10 flex-1 min-w-0 backdrop-blur-xl bg-glass rounded-xl p-6 flex flex-col gap-12 h-full overflow-y-auto">
        {children}
      </main>

      <CopilotPanel className="relative z-10" />
    </div>
  );
}
