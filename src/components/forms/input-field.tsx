import * as React from "react";
import { Label } from "../label";
import { Field } from "./types";

export const InputField = ({ error, label, name, onChange }: Field) => {
  const id = React.useId();
  const errorId = React.useId();
  const [value, setValue] = React.useState<string>("");

  return (
    <div className="flex flex-col space-y-1.5">
      <Label htmlFor={id}>{label}</Label>

      <input
        aria-describedby={Boolean(error) ? errorId : undefined}
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

      {Boolean(error) ? (
        <p className="type-xs-tight text-critical mt-1.5" id={errorId}>
          {error}
        </p>
      ) : null}
    </div>
  );
};
