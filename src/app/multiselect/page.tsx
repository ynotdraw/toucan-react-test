"use client";

import * as React from "react";

import { Button } from "@/components/button";

interface Field {
  label: string;
  name: string;
  onChange?: (value: string) => void;
}

const Label = ({
  children,
  htmlFor,
}: {
  children: React.ReactNode;
  htmlFor: string;
}) => (
  <label className="type-md-tight text-body-and-labels block" htmlFor={htmlFor}>
    {children}
  </label>
);

const InputField = ({ label, name, onChange }: Field) => {
  const id = React.useId();
  const [value, setValue] = React.useState<string>("");

  return (
    <div className="flex flex-col space-y-1.5">
      <Label htmlFor={id}>{label}</Label>

      <input
        className="focus:outline-none block rounded-sm p-1 transition-shadow
  shadow-focusable-outline focus:shadow-focus-outline bg-overlay-1 text-titles-and-attributes"
        id={id}
        name={name}
        onChange={(e) => {
          setValue(e.target.value);
          onChange?.(e.target.value);
        }}
        value={value}
      />
    </div>
  );
};

const TextareaField = ({ label, name, onChange }: Field) => {
  const id = React.useId();
  const [value, setValue] = React.useState<string>("");

  return (
    <div className="flex flex-col space-y-1.5">
      <Label htmlFor={id}>{label}</Label>

      <textarea
        className="focus:outline-none block rounded-sm p-1 transition-shadow
  shadow-focusable-outline focus:shadow-focus-outline bg-overlay-1 text-titles-and-attributes"
        id={id}
        name={name}
        onChange={(e) => {
          setValue(e.target.value);
          onChange?.(e.target.value);
        }}
        value={value}
      />
    </div>
  );
};

export default function MultiselectPage() {
  return (
    <form className="space-y-6" onSubmit={() => {}}>
      <InputField label="Order name" name="name" />
      <TextareaField
        label="Special instructions (optional)"
        name="instructions"
      />
      <Button>Submit</Button>
    </form>
  );
}
