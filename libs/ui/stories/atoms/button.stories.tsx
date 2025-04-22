import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../../src/atoms/button";
import { VariantContainer, VariantGroup } from "../../.storybook/decorator";
import { useState } from "react";

const meta: Meta<typeof Button> = {
  title: "Atoms/Button",
  component: Button,
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "tertiary", "warning", "danger"],
    variant: {
      control: "select",
      options: ["primary", "secondary", "tertiary", "warning", "danger"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
  },
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "",
      },
    },
        component: "",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Variants: Story = {
  render: () => (
    <VariantContainer>
      <VariantGroup title="Solid themes">
        <Button>Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="tertiary">Tertiary</Button>
        <Button variant="warning">Warning</Button>
        <Button variant="danger">Danger</Button>
      </VariantGroup>
      <VariantGroup title="Light themes">
        <Button variant="primary" theme="light">
          Primary Light
        </Button>
        <Button variant="secondary" theme="light">
          Secondary Light
        </Button>
        <Button variant="tertiary" theme="light">
          Tertiary Light
        </Button>
        <Button variant="warning" theme="light">
          Warning Light
        </Button>
        <Button variant="danger" theme="light">
          Danger Light
        </Button>
        <Button variant="primary" theme="light">
          Primary Light
        </Button>
        <Button variant="secondary" theme="light">
          Secondary Light
        </Button>
        <Button variant="tertiary" theme="light">
          Tertiary Light
        </Button>
        <Button variant="warning" theme="light">
          Warning Light
        </Button>
        <Button variant="danger" theme="light">
          Danger Light
        </Button>
      </VariantGroup>
      <VariantGroup title="Outlined themes">
        <Button variant="primary" theme="outlined">
          Primary Outlined
        </Button>
        <Button variant="secondary" theme="outlined">
          Secondary Outlined
        </Button>
        <Button variant="tertiary" theme="outlined">
          Tertiary Outlined
        </Button>
        <Button variant="warning" theme="outlined">
          Warning Outlined
        </Button>
        <Button variant="danger" theme="outlined">
          Danger Outlined
        </Button>
        <Button variant="primary" theme="outlined">
          Primary Outlined
        </Button>
        <Button variant="secondary" theme="outlined">
          Secondary Outlined
        </Button>
        <Button variant="tertiary" theme="outlined">
          Tertiary Outlined
        </Button>
        <Button variant="warning" theme="outlined">
          Warning Outlined
        </Button>
        <Button variant="danger" theme="outlined">
          Danger Outlined
        </Button>
      </VariantGroup>
      <VariantGroup title="Borderless themes">
        <Button variant="primary" theme="borderless">
          Primary Borderless
        </Button>
        <Button variant="secondary" theme="borderless">
          Secondary Borderless
        </Button>
        <Button variant="tertiary" theme="borderless">
          Tertiary Borderless
        </Button>
        <Button variant="warning" theme="borderless">
          Warning Borderless
        </Button>
        <Button variant="danger" theme="borderless">
          Danger Borderless
        </Button>
        <Button variant="primary" theme="borderless">
          Primary Borderless
        </Button>
        <Button variant="secondary" theme="borderless">
          Secondary Borderless
        </Button>
        <Button variant="tertiary" theme="borderless">
          Tertiary Borderless
        </Button>
        <Button variant="warning" theme="borderless">
          Warning Borderless
        </Button>
        <Button variant="danger" theme="borderless">
          Danger Borderless
        </Button>
      </VariantGroup>
    </VariantContainer>
  ),
};

export const Sizes: Story = {
  render: () => (
    <VariantContainer>
      <VariantGroup title="sizes">
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
      </VariantGroup>


      <VariantGroup title="Block buttons" fullWidth>
        <Button block>Block Button</Button>
        <Button block variant="secondary">
          Block Secondary
        </Button>
        <Button block variant="secondary">
          Block Secondary
        </Button>
      </VariantGroup>
    </VariantContainer>
  ),
};

export const States: Story = {
  render: () => {
    const [isLoading, setIsLoading] = useState(false);


    const toggleLoading = () => {
      setIsLoading(true);
      setTimeout(() => setIsLoading(false), 2000);
    };


    return (
      <VariantContainer>
        <VariantGroup title="Disabled states">
          <Button theme="outlined" disabled>
            Primary
          </Button>
          <Button variant="secondary" theme="light" disabled>
            Secondary
          </Button>
          <Button variant="tertiary" theme="borderless" disabled>
            Tertiary
          </Button>
          <Button variant="warning" theme="borderless" disabled>
            Warning
          </Button>
          <Button variant="danger" theme="solid" disabled>
            Danger
          </Button>
        </VariantGroup>

        <VariantGroup title="Loading states">
          <Button isLoading>Primary</Button>
          <Button isLoading theme="outlined" loadingText="Loading...">
            Outlined
          </Button>

          <Button variant="danger" isLoading>
            Danger
          </Button>
        </VariantGroup>
      </VariantContainer>
    );
  },
};

export const AllVariants: Story = {
  render: () => (
    <VariantContainer>
      <VariantGroup title="Primary buttons">
        <Button variant="primary">BUTTON</Button>
        <Button variant="primary" size="sm">
          SMALL
        </Button>
        <Button variant="primary" size="md">
          DEFAULT
        </Button>
        <Button variant="primary" size="lg">
          LARGE
        </Button>
        <Button variant="primary" disabled>
          DISABLED
        </Button>
      </VariantGroup>

      <VariantGroup title="Secondary buttons">
        <Button variant="secondary">BUTTON</Button>
        <Button variant="secondary" size="sm">
          SMALL
        </Button>
        <Button variant="secondary" size="md">
          DEFAULT
        </Button>
        <Button variant="secondary" size="lg">
          LARGE
        </Button>
        <Button variant="secondary" disabled>
          DISABLED
        </Button>
      </VariantGroup>

      <VariantGroup title="Tertiary buttons">
        <Button variant="tertiary">BUTTON</Button>
        <Button variant="tertiary" size="sm">
          SMALL
        </Button>
        <Button variant="tertiary" size="md">
          DEFAULT
        </Button>
        <Button variant="tertiary" size="lg">
          LARGE
        </Button>
        <Button variant="tertiary" disabled>
          DISABLED
        </Button>
      </VariantGroup>

      <VariantGroup title="Warning buttons">
        <Button variant="warning">WARNING</Button>
        <Button variant="warning" size="sm">
          SMALL
        </Button>
        <Button variant="warning" size="md">
          DEFAULT
        </Button>
        <Button variant="warning" size="lg">
          LARGE
        </Button>
        <Button variant="warning" disabled>
          DISABLED
        </Button>
      </VariantGroup>

      <VariantGroup title="Danger buttons">
        <Button variant="danger">DANGER</Button>
        <Button variant="danger" size="sm">
          SMALL
        </Button>
        <Button variant="danger" size="md">
          DEFAULT
        </Button>
        <Button variant="danger" size="lg">
          LARGE
        </Button>
        <Button variant="danger" disabled>
          DISABLED
        </Button>
      </VariantGroup>

      <VariantGroup title="Light variants">
        <Button variant="primary">PRIMARY LIGHT</Button>
        <Button variant="secondary">SECONDARY LIGHT</Button>
        <Button variant="tertiary">TERTIARY LIGHT</Button>
        <Button variant="warning">WARNING LIGHT</Button>
        <Button variant="danger">DANGER LIGHT</Button>
      </VariantGroup>

      <VariantGroup title="Full width buttons" fullWidth>
        <Button variant="primary" block>
          PRIMARY
        </Button>
        <Button variant="secondary" block>
          SECONDARY
        </Button>
        <Button variant="tertiary" block>
          TERTIARY
        </Button>
        <Button variant="warning" block>
          WARNING
        </Button>
        <Button variant="danger" block>
          DANGER
        </Button>
      </VariantGroup>
    </VariantContainer>
  ),
};

export const IconButtons: Story = {
  render: () => (
    <VariantContainer>
      <VariantGroup title="Icon buttons">
        <Button icon="icon-[mdi--thumb-up]">LIKE</Button>
        <Button icon="icon-[mdi--send]" iconPosition="right">
          SEND
        </Button>
        <Button icon="icon-[mdi--magnify]" aria-label="Search" />
        <Button variant="secondary" icon="icon-[mdi--pencil]">
          EDIT
        </Button>
        <Button variant="danger" icon="icon-[mdi--delete]">
          DELETE
        </Button>
      </VariantGroup>
    </VariantContainer>
  ),
};
  render: () => (
    <VariantContainer>
      <VariantGroup title="Primary buttons">
        <Button variant="primary">BUTTON</Button>
        <Button variant="primary" size="sm">
          SMALL
        </Button>
        <Button variant="primary" size="md">
          DEFAULT
        </Button>
        <Button variant="primary" size="lg">
          LARGE
        </Button>
        <Button variant="primary" disabled>
          DISABLED
        </Button>
      </VariantGroup>

      <VariantGroup title="Secondary buttons">
        <Button variant="secondary">BUTTON</Button>
        <Button variant="secondary" size="sm">
          SMALL
        </Button>
        <Button variant="secondary" size="md">
          DEFAULT
        </Button>
        <Button variant="secondary" size="lg">
          LARGE
        </Button>
        <Button variant="secondary" disabled>
          DISABLED
        </Button>
      </VariantGroup>

      <VariantGroup title="Tertiary buttons">
        <Button variant="tertiary">BUTTON</Button>
        <Button variant="tertiary" size="sm">
          SMALL
        </Button>
        <Button variant="tertiary" size="md">
          DEFAULT
        </Button>
        <Button variant="tertiary" size="lg">
          LARGE
        </Button>
        <Button variant="tertiary" disabled>
          DISABLED
        </Button>
      </VariantGroup>

      <VariantGroup title="Warning buttons">
        <Button variant="warning">WARNING</Button>
        <Button variant="warning" size="sm">
          SMALL
        </Button>
        <Button variant="warning" size="md">
          DEFAULT
        </Button>
        <Button variant="warning" size="lg">
          LARGE
        </Button>
        <Button variant="warning" disabled>
          DISABLED
        </Button>
      </VariantGroup>

      <VariantGroup title="Danger buttons">
        <Button variant="danger">DANGER</Button>
        <Button variant="danger" size="sm">
          SMALL
        </Button>
        <Button variant="danger" size="md">
          DEFAULT
        </Button>
        <Button variant="danger" size="lg">
          LARGE
        </Button>
        <Button variant="danger" disabled>
          DISABLED
        </Button>
      </VariantGroup>

      <VariantGroup title="Light variants">
        <Button variant="primary">PRIMARY LIGHT</Button>
        <Button variant="secondary">SECONDARY LIGHT</Button>
        <Button variant="tertiary">TERTIARY LIGHT</Button>
        <Button variant="warning">WARNING LIGHT</Button>
        <Button variant="danger">DANGER LIGHT</Button>
      </VariantGroup>

      <VariantGroup title="Full width buttons" fullWidth>
        <Button variant="primary" block>
          PRIMARY
        </Button>
        <Button variant="secondary" block>
          SECONDARY
        </Button>
        <Button variant="tertiary" block>
          TERTIARY
        </Button>
        <Button variant="warning" block>
          WARNING
        </Button>
        <Button variant="danger" block>
          DANGER
        </Button>
      </VariantGroup>
    </VariantContainer>
  ),
};

export const IconButtons: Story = {
  render: () => (
    <VariantContainer>
      <VariantGroup title="Icon buttons">
        <Button icon="icon-[mdi--thumb-up]">LIKE</Button>
        <Button icon="icon-[mdi--send]" iconPosition="right">
          SEND
        </Button>
        <Button icon="icon-[mdi--magnify]" aria-label="Search" />
        <Button variant="secondary" icon="icon-[mdi--pencil]">
          EDIT
        </Button>
        <Button variant="danger" icon="icon-[mdi--delete]">
          DELETE
        </Button>
      </VariantGroup>
    </VariantContainer>
  ),
};
