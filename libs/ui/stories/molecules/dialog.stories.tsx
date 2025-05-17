import type { Meta, StoryObj } from "@storybook/react";
import { Dialog, type DialogProps } from "../../src/molecules/dialog";
import { Button } from "../../src/atoms/button";
import { useState, useRef } from "react";
import { VariantContainer } from "../../.storybook/decorator";
import { Icon } from "../../src/atoms/icon";

const meta: Meta<typeof Dialog> = {
  title: "Molecules/Dialog", // Or Organisms/Dialog
  component: Dialog,
  parameters: {
    layout: "centered", // Dialogs often overlay the whole screen
  },
  tags: ["autodocs"],
  argTypes: {
    open: {
      control: "boolean",
      description: "Controls the visibility of the dialog.",
    },
    title: {
      control: "text",
      description: "Optional title for the dialog header.",
    },
    description: {
      control: "text",
      description:
        "Optional descriptive text, typically rendered below the title.",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Determines the width of the dialog content panel.",
    },
    hideCloseButton: {
      control: "boolean",
      description: "Hides the default close (X) button.",
    },
    closeOnEscape: {
      control: "boolean",
      description:
        "Whether the dialog should close when Escape key is pressed.",
    },
    closeOnInteractOutside: {
      control: "boolean",
      description:
        "Whether the dialog should close on click or tap outside its content.",
    },
    modal: {
      control: "boolean",
      description:
        "If true, interaction with outside elements is blocked and focus is trapped.",
    },
    // Props for custom header/footer are better demonstrated via render functions
    // children prop is the main content, also best shown via render
  },
};

export default meta;
type Story = StoryObj<typeof Dialog>;

// Helper component for stories that need to manage open state
const DialogWithState = (args: DialogProps) => {
  const [isOpen, setIsOpen] = useState(args.open || false);
  const triggerButtonRef = useRef<HTMLButtonElement>(null); // To return focus

  return (
    <Dialog
      {...args}
      open={isOpen}
      onOpenChange={(details) => setIsOpen(details.open)}
      // Example of returning focus to the trigger button
      finalFocusEl={() => triggerButtonRef.current}
    />
  );
};

export const Default: Story = {
  args: {
    title: "Default Dialog Title",
    children: (
      <p>
        This is the main content of the dialog. You can put any React nodes
        here.
      </p>
    ),
  },
  render: (args) => <DialogWithState {...args} />,
};

export const WithDescription: Story = {
  args: {
    title: "Dialog With Description",
    description:
      "This is a short description that appears below the title, providing more context.",
    children: (
      <p>
        The main content follows the description. This helps in structuring
        information clearly.
      </p>
    ),
  },
  render: (args) => <DialogWithState {...args} />,
};

export const NoCloseButton: Story = {
  args: {
    title: "No Close Button",
    hideCloseButton: true,
    children: (
      <p>
        This dialog has the default 'X' close button hidden. Closing must be
        handled by other means, e.g., a button in the footer or by pressing
        Escape (if enabled).
      </p>
    ),
    footer: (
      // In a real scenario, this button would trigger onOpenChange({ open: false })
      // For simplicity in story, it just alerts.
      <Button onClick={() => alert("Close via footer button")}>Close Me</Button>
    ),
  },
  render: (args) => <DialogWithState {...args} />,
};

export const LongContent: Story = {
  args: {
    title: "Dialog with Scrollable Content",
    children: (
      <div className="space-y-4">
        {Array.from({ length: 20 }).map((_, i) => (
          <p key={i}>
            This is paragraph number {i + 1}. Lorem ipsum dolor sit amet,
            consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut
            labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
            exercitation ullamco laboris nisi ut aliquip ex ea commodo
            consequat. Duis aute irure dolor in reprehenderit in voluptate velit
            esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
            cupidatat non proident, sunt in culpa qui officia deserunt mollit
            anim id est laborum.
          </p>
        ))}
      </div>
    ),
    footer: <Button>Close</Button>,
  },
  render: (args) => <DialogWithState {...args} />,
};

export const NonModal: Story = {
  args: {
    title: "Non-Modal Dialog",
    modal: false,
    closeOnInteractOutside: true, // Usually true for non-modal
    children: (
      <p>
        This is a non-modal dialog. You can interact with elements outside of
        it, and focus is not trapped. Clicking outside will close it if
        `closeOnInteractOutside` is true.
      </p>
    ),
  },
  render: (args) => (
    <div className="p-8 bg-gray-200 dark:bg-gray-700 rounded">
      <p className="mb-4">
        Content behind the dialog. Try clicking here when the non-modal dialog
        is open.
      </p>
      <DialogWithState {...args} />
    </div>
  ),
};
