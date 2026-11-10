import { cn } from "@/lib/utils";
import { Card } from "./card";

type ChallengeOption = {
  _id: string;
  text: string;
  correct: boolean;
  imageSrc?: string;
  audioSrc?: string;
};

type Props = {
  options: ChallengeOption[];
  onSelect: (id: string) => void;
  status: "correct" | "wrong" | "none";
  selectedOption?: string;
  disabled?: boolean;
  type: "SELECT" | "ASSIST";
};

export const Challenge = ({
  options,
  onSelect,
  status,
  selectedOption,
  disabled,
  type,
}: Props) => {
  return (
    <div className="flex flex-col gap-y-3 w-full max-w-2xl mx-auto py-2">
      {options.map((option, i) => (
        <Card
          key={option._id}
          id={option._id}
          text={option.text}
          imageSrc={option.imageSrc ?? null}
          shortcut={`${i + 1}`}
          selected={selectedOption === option._id}
          onClick={() => onSelect(option._id)}
          status={status}
          audioSrc={option.audioSrc ?? null}
          disabled={disabled}
          type={type}
        />
      ))}
    </div>
  );
};
