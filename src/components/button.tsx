"use client";

import * as React from "react";

const VALID_VARIANTS = [
  "bare",
  "destructive",
  "link",
  "primary",
  "quiet",
  "secondary",
] as const;

export type ButtonVariant = (typeof VALID_VARIANTS)[number];

const STYLES = {
  base: [
    "focusable",
    "inline-flex",
    "items-center",
    "justify-center",
    "transition",
    "truncate",
    "type-md-medium",
  ],
  variants: {
    bare: ["focusable"],
    destructive: ["focusable-destructive", "interactive-destructive"],
    link: ["font-normal", "interactive-link", "underline"],
    primary: ["interactive-primary"],
    quiet: ["font-normal", "interactive-quiet"],
    secondary: ["interactive-normal"],
  },
  buttonGroup: {
    true: ["rounded-none", "flex-1", "first:rounded-l-sm", "last:rounded-r-sm"],
    false: ["rounded-sm"],
  },
};

const getStyles = ({
  variant = "primary",
  isDisabled,
  isButtonGroup,
}: Pick<ButtonProps, "variant" | "isDisabled" | "isButtonGroup">) => {
  if (variant === "bare") {
    return STYLES.variants.bare.join(" ");
  }

  const buttonStyles = [
    ...STYLES.base,
    ...STYLES.buttonGroup[isButtonGroup ? "true" : "false"],
    ...STYLES.variants[variant],
  ];
  const disabledStyles = ["interactive-disabled", "focus:outline-none"];

  if (variant !== "link") {
    buttonStyles.push("px-4", "py-1");
  }

  return isDisabled
    ? [...buttonStyles, ...disabledStyles].join(" ")
    : buttonStyles.join(" ");
};

export interface ButtonProps extends React.ComponentPropsWithoutRef<"button"> {
  /**
   * Sets `aria-disabled` on the button.  `aria-disabled` is used over the `disabled` attribute so that screenreaders can still focus the element.
   */
  isDisabled?: boolean;

  /**
   * Puts the button in a loading state.
   */
  isLoading?: boolean;

  /**
   * The function called when the element is clicked.
   */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;

  /**
   * Setting the variant of the button changes the styling.
   */
  variant?: ButtonVariant;

  /**
   * Special styling is applied if a button is inside a button group.
   *
   * @internal This is meant to only be used by `<ButtonGroup>`
   */
  isButtonGroup?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      onClick,
      isButtonGroup,
      isDisabled,
      variant = "primary",
      ...props
    },
    ref
  ) => {
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (isDisabled) {
        return;
      }

      onClick?.(event);
    };

    return (
      <button
        className={getStyles({ variant, isDisabled, isButtonGroup })}
        onClick={handleClick}
        ref={ref}
        type="button"
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
