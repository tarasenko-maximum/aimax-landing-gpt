import * as React from "react";
import { cn } from "../../lib/utils";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost";
};

export function Button({ className, variant = "primary", ...props }: Props) {
  const base =
    "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition border";
  const styles =
    variant === "ghost"
      ? "bg-transparent border-white/15 hover:border-white/30 hover:bg-white/5"
      : "bg-white text-black border-white hover:bg-white/90";

  return <button className={cn(base, styles, className)} {...props} />;
}