import type { Meta, StoryObj } from "@storybook/react";
import { Combobox } from "../../src/molecules/combobox";
import { VariantContainer } from "../../.storybook/decorator";
import { useState } from "react";

const countries = [
  { id: 1, label: "Česká republika", value: "cz" },
  { id: 2, label: "Slovensko", value: "sk" },
  { id: 3, label: "Německo", value: "de" },
  { id: 4, label: "Rakousko", value: "at", disabled: true },
  { id: 5, label: "Polsko", value: "pl" },
  { id: 6, label: "Francie", value: "fr", disabled: true },
  { id: 7, label: "Itálie", value: "it" },
  { id: 8, label: "Španělsko", value: "es" },
  { id: 9, label: "Velká Británie", value: "gb" },
  { id: 10, label: "USA", value: "us" },
];

const meta: Meta<typeof Combobox> = {
  title: "Molecules/Combobox",
  component: Combobox,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    state: {
      control: "select",
      options: ["normal", "error", "success", "warning"],
      description: "Validační stav comboboxu",
    },
    multiple: {
      control: "boolean",
      description: "Umožňuje výběr více hodnot",
    },
    disabled: {
      control: "boolean",
      description: "Zakáže interakci s comboboxem",
    },
    clearable: {
      control: "boolean",
      description: "Umožňuje vymazání výběru",
    },
    searchable: {
      control: "boolean",
      description: "Umožňuje vyhledávání v položkách",
    },
    closeOnSelect: {
      control: "boolean",
      description: "Zavře dropdown po výběru položky",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Combobox>;

export const Default: Story = {
  args: {
    label: "Vyberte zemi",
    placeholder: "Zvolte zemi...",
    items: countries,
    helper: "Vyberte zemi vašeho pobytu",
  },
};

export const ValidationStates: Story = {
  render: () => (
    <VariantContainer>
      <Combobox
        label="Běžný stav"
        placeholder="Vyberte zemi"
        items={countries}
        helper="Výchozí stav bez validace"
        validationState="normal"
      />
      <Combobox
        label="Chybový stav"
        placeholder="Vyberte zemi"
        items={countries}
        error="Prosím vyberte platnou zemi"
        validationState="error"
      />
      <Combobox
        label="Úspěšný stav"
        placeholder="Vyberte zemi"
        items={countries}
        helper="Vaše volba je platná"
        validationState="success"
      />
      <Combobox
        label="Varovný stav"
        placeholder="Vyberte zemi"
        items={countries}
        helper="Tato země může vyžadovat další ověření"
        validationState="warning"
      />
    </VariantContainer>
  ),
};

export const MultipleSelection: Story = {
  args: {
    label: "Vyberte země",
    placeholder: "Zvolte země...",
    items: countries,
    helper: "Vyberte země, které jste navštívili",
    multiple: true,
    closeOnSelect: false,
    selectionBehavior: "clear",
  },
};

export const ComplexStory: Story = {
  render: () => {
    const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

    const validationState =
      selectedCountry === "us"
        ? "error"
        : selectedCountry === "sk"
        ? "warning"
        : selectedCountry === "cz"
        ? "success"
        : "normal";

    const helperMessage =
      validationState === "error"
        ? "USA není momentálně dostupná"
        : validationState === "warning"
        ? "Slovensko vyžaduje dodatečné ověření totožnosti"
        : validationState === "success"
        ? "Země úspěšně vybrána"
        : undefined;
    return (
      <div className="space-y-8">
        <Combobox
          label="Vyberte zemi"
          placeholder="Zvolte zemi..."
          items={countries}
          onChange={(value) =>
            setSelectedCountry(Array.isArray(value) ? value[0] : value)
          }
          validationState={validationState}
          error={validationState === "error" ? helperMessage : undefined}
          helper={helperMessage}
        />

        <div className="text-sm text-gray-600">
          Zkuste vybrat různé země a sledujte, jak se mění validační stavy:
          <ul className="list-disc ml-5 mt-2">
            <li>USA - error</li>
            <li>SK - warning</li>
            <li>CZ - success</li>
          </ul>
        </div>
      </div>
    );
  },
};
