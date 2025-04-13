import { FC, ReactNode } from "react";

type VariantGroupProps = {
  title: string;
  children: ReactNode;
  fullWidth?: boolean;
};

export const VariantGroup: FC<VariantGroupProps> = ({
  title,
  children,
  fullWidth,
}) => (
  <div className="space-y-2 w-full">
    <h3 className="font-semibold text-m text-fg-primary">{title}</h3>
    <div
      className={`flex ${
        fullWidth ? "flex-col" : "flex-wrap"
      } gap-4 items-center`}
    >
      {children}
    </div>
  </div>
);

export const VariantContainer: FC<{ children: ReactNode }> = ({
  children,
}) => (
  <div className="flex flex-col items-center space-y-8">
    {children}
  </div>
);
