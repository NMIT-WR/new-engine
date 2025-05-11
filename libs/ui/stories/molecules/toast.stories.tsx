import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../../src/atoms/button";
import { useToast, ToastContainer } from "../../src/molecules/toast";
import { VariantContainer } from "../../.storybook/decorator";
import { useRef } from "react";

const meta: Meta = {
  title: "Molecules/Toast",
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <>
        <Story />
        <ToastContainer />
      </>
    ),
  ],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => {
    const toaster = useToast();
    const idRef = useRef<string>();

    return (
      <VariantContainer>
        <Button
          variant="primary"
          onClick={() => {
            idRef.current = toaster.create({
              title: "Success!",
              description: "Your action was completed successfully.",
              type: "success",
              placement: "bottom-start",
            });
          }}
        >
          Show Success Toast
        </Button>

        <Button
          variant="danger"
          onClick={() => {
            toaster.create({
              title: "Error",
              description: "Something went wrong. Please try again.",
              type: "error",
              duration: 50000,
            });
          }}
        >
          Show Error Toast
        </Button>

        <Button
          variant="primary"
          onClick={() => {
            toaster.create({
              title: "About Version",
              description: "System version: 19.0.4",
              type: "info",
            });
          }}
        >
          Info Toast
        </Button>

        <Button
          variant="warning"
          onClick={() => {
            toaster.create({
              title: "Warning",
              description: "Your subscription ends soon.",
              type: "warning",
            });
          }}
        >
          Warning Toast
        </Button>
      </VariantContainer>
    );
  },
};

export const Types: Story = {
  render: () => {
    const toaster = useToast();

    return (
      <VariantContainer>
        <Button
          onClick={() => {
            toaster.create({
              title: "Success",
              description: "Operation completed successfully.",
              type: "success",
            });
          }}
        >
          Success
        </Button>

        <Button
          onClick={() => {
            toaster.create({
              title: "Error",
              description: "An error occurred.",
              type: "error",
            });
          }}
        >
          Error
        </Button>

        <Button
          onClick={() => {
            toaster.create({
              title: "Warning",
              description: "Please be careful.",
              type: "warning",
            });
          }}
        >
          Warning
        </Button>

        <Button
          onClick={() => {
            toaster.create({
              title: "Info",
              description: "This is an informational message.",
              type: "info",
            });
          }}
        >
          Info
        </Button>

        <Button
          onClick={() => {
            toaster.create({
              title: "Loading...",
              description: "Please wait while we process your request.",
              type: "loading",
              duration: Infinity,
            });
          }}
        >
          Loading
        </Button>
      </VariantContainer>
    );
  },
};

export const Placements: Story = {
  render: () => {
    const toaster = useToast();

    const placements = [
      "top-start",
      "top",
      "top-end",
      "bottom-start",
      "bottom",
      "bottom-end",
    ] as const;

    return (
      <div className="grid grid-cols-3 gap-4">
        {placements.map((placement) => (
          <Button
            key={placement}
            size="sm"
            onClick={() => {
              toaster.create({
                title: `Toast ${placement}`,
                description: `This toast is positioned at ${placement}`,
                placement,
              });
            }}
          >
            {placement}
          </Button>
        ))}
      </div>
    );
  },
};
