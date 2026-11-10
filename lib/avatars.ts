export interface BuiltInAvatar {
  id: string;
  label: string;
  src: string;
  category: "beacon" | "scholar" | "tech" | "creative";
  accentColor: string;
}

export const BUILT_IN_AVATARS: BuiltInAvatar[] = [
  {
    id: "mascot",
    label: "Lantern Beacon",
    src: "/mascot.svg",
    category: "beacon",
    accentColor: "#F59E0B",
  },
  {
    id: "lantern-gold",
    label: "Solar Forge",
    src: "/avatars/avatar-lantern.svg",
    category: "beacon",
    accentColor: "#F59E0B",
  },
  {
    id: "scholar",
    label: "Grand Scholar",
    src: "/avatars/avatar-scholar.svg",
    category: "scholar",
    accentColor: "#3B82F6",
  },
  {
    id: "coder",
    label: "Hacker / Coder",
    src: "/avatars/avatar-coder.svg",
    category: "tech",
    accentColor: "#10B981",
  },
  {
    id: "wizard",
    label: "Tech Sage",
    src: "/avatars/avatar-wizard.svg",
    category: "creative",
    accentColor: "#8B5CF6",
  },
  {
    id: "astronaut",
    label: "Cosmic Explorer",
    src: "/avatars/avatar-astronaut.svg",
    category: "tech",
    accentColor: "#0EA5E9",
  },
  {
    id: "ninja",
    label: "Shadow Shinobi",
    src: "/avatars/avatar-ninja.svg",
    category: "creative",
    accentColor: "#E11D48",
  },
  {
    id: "cyborg",
    label: "AI Android",
    src: "/avatars/avatar-cyborg.svg",
    category: "tech",
    accentColor: "#0284C7",
  },
  {
    id: "designer",
    label: "Design Visionary",
    src: "/avatars/avatar-designer.svg",
    category: "creative",
    accentColor: "#EC4899",
  },
];

