import { Button } from "@/components/ui/button";
import Image from "next/image";

export const Footer = () => {
  return (
    <footer className="hidden lg:block h-20 w-full border-t-2 border-slate-200 p-2">
      <div className="max-w-screen-lg mx-auto flex items-center justify-evenly h-full gap-x-2">
        <Button size="lg" variant="ghost" className="w-full text-xs font-bold text-neutral-600">
          <Image
            src="/track_engineering.svg"
            alt="Full-Stack Web"
            height={26}
            width={34}
            className="mr-2 rounded"
          />
          Full-Stack Web
        </Button>
        <Button size="lg" variant="ghost" className="w-full text-xs font-bold text-neutral-600">
          <Image
            src="/track_ai.svg"
            alt="AI & LLMs"
            height={26}
            width={34}
            className="mr-2 rounded"
          />
          AI & LLMs
        </Button>
        <Button size="lg" variant="ghost" className="w-full text-xs font-bold text-neutral-600">
          <Image
            src="/track_business.svg"
            alt="Startups & SaaS"
            height={26}
            width={34}
            className="mr-2 rounded"
          />
          Startups & SaaS
        </Button>
        <Button size="lg" variant="ghost" className="w-full text-xs font-bold text-neutral-600">
          <Image
            src="/track_cloud.svg"
            alt="Cloud Systems"
            height={26}
            width={34}
            className="mr-2 rounded"
          />
          Cloud Systems
        </Button>
        <Button size="lg" variant="ghost" className="w-full text-xs font-bold text-neutral-600">
          <Image
            src="/track_design.svg"
            alt="Product Design"
            height={26}
            width={34}
            className="mr-2 rounded"
          />
          Product Design
        </Button>
      </div>
    </footer>
  );
};
