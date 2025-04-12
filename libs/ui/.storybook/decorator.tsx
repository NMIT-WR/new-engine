import React, { ReactNode } from "react";

type VariantGroupProps = {
  title: string;
  children: ReactNode;
  fullWidth?: boolean;
};

export const VariantGroup: React.FC<VariantGroupProps> = ({
  title,
  children,
  fullWidth,
}) => (
  <div className="wr:space-y-2 wr:w-full">
    <h3 className="wr:font-semibold wr:text-m wr:text-fg-primary">{title}</h3>
    <div
      className={`wr:flex ${
        fullWidth ? "wr:flex-col" : "wr:flex-wrap"
      } wr:gap-4 wr:items-center`}
    >
      {children}
    </div>
  </div>
);

export const VariantContainer: React.FC<{ children: ReactNode }> = ({
  children,
}) => (
  <div className="wr:flex wr:flex-col wr:items-center wr:space-y-8">
    {children}
  </div>
);
