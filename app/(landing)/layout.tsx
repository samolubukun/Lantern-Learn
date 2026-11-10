import { Plus_Jakarta_Sans } from "next/font/google";

const font = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
});

type Props = {
  children: React.ReactNode;
};

// Light/dark is handled app-wide by the ThemeProvider in app/layout.tsx.
const LandingLayout = ({ children }: Props) => {
  return (
    <div
      className={`${font.className} min-h-screen w-full flex flex-col bg-white text-zinc-900 dark:bg-[#08090C] dark:text-zinc-100 antialiased overflow-x-hidden transition-colors duration-300 selection:bg-amber-400 selection:text-black`}
    >
      {children}
    </div>
  );
};

export default LandingLayout;
