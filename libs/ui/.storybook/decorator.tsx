import { FC, ReactNode } from "react";

type VariantGroupProps = {
  title: string;
  children: ReactNode;
  fullWidth?: boolean;
};

export function VariantGroup({
  title,
  children,
  fullWidth,
}: VariantGroupProps) {
  return (
    <div className="space-y-2 w-full">
      <h3 className="font-semibold text-m text-fg-primary">{title}</h3>
      <div
        className={`flex ${
          fullWidth ? "flex-col" : "flex-wrap"
        } gap-4 items-start`}
      >
        {children}
      </div>
    </div>
  )
};

export function VariantContainer({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col items-center space-y-8">{children}</div>
  );
}
