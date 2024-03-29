// WARNING:
// THIS IS NOT PRODUCTION READY CODE! THIS IS A PROOF OF CONCEPT FOR SOME MULTISELECT
// FUNCTIONALITY. PLEASE DO NOT USE THIS IN PRODUCTION!
"use client";

import * as React from "react";

import { autoUpdate, size, useFloating } from "@floating-ui/react";
import { Button } from "@/components/button";
import { options } from "@/options";
import { InputField } from "@/components/forms/input-field";
import { Label } from "@/components/label";
import { TextareaField } from "@/components/forms/textarea-field";
import { useMultipleSelection, useCombobox } from "downshift";
import { useRouter } from "next/navigation";
import clsx from "clsx";

interface CheckboxControlProps extends React.ComponentPropsWithoutRef<"input"> {
  isChecked?: boolean;
}

const CheckboxControl = ({
  isChecked = false,
  ...rootProps
}: CheckboxControlProps) => {
  return (
    <div className="min-w-4 min-h-4 relative flex h-4 w-4 items-center justify-center">
      <input
        className={clsx(
          "border-body-and-labels focusable-outer focus:outline-none inline-block h-4 w-4 transform-gpu appearance-none rounded-sm border p-0 align-middle focus-visible:scale-75 ",
          isChecked ? "bg-primary-idle border-none" : "bg-normal-idle"
        )}
        type="checkbox"
        defaultChecked={isChecked}
        {...rootProps}
      />

      {isChecked && (
        <div className="pointer-events-none absolute">
          <svg
            aria-hidden="true"
            className="text-ground-floor h-3 w-3"
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M10.207 4.207 5 9.414 2.293 6.707l1.414-1.414L5 6.586l3.793-3.793 1.414 1.414Z"
            />
          </svg>
        </div>
      )}
    </div>
  );
};
interface ComboboxField {
  error?: string;
  label: string;
  name: string;
  onChange?: (values: Array<string>) => void;
}

const getFilteredItems = (inputValue: string) => {
  const lowerCasedInputValue = inputValue.toLowerCase();

  if (lowerCasedInputValue?.length === 0) {
    return options;
  }

  return options.filter((option) =>
    option.toLowerCase().startsWith(lowerCasedInputValue)
  );
};

const MultiselectPackageC = ({
  error,
  label,
  name,
  onChange,
}: ComboboxField) => {
  const { refs, floatingStyles } = useFloating({
    placement: "bottom-start",
    middleware: [
      size({
        apply({ rects, elements }) {
          Object.assign(elements.floating.style, {
            width: `${rects.reference.width}px`,
          });
        },
      }),
    ],
    whileElementsMounted: autoUpdate,
  });

  const id = React.useId();
  const errorId = React.useId();

  const [inputValue, setInputValue] = React.useState<string>("");
  const [selectedItems, setSelectedItems] = React.useState<Array<string>>([]);

  const items = getFilteredItems(inputValue);

  const { getSelectedItemProps, getDropdownProps, removeSelectedItem } =
    useMultipleSelection({
      selectedItems,
      onStateChange({ selectedItems: newSelectedItems, type }) {
        switch (type) {
          case useMultipleSelection.stateChangeTypes
            .SelectedItemKeyDownBackspace:
          case useMultipleSelection.stateChangeTypes.SelectedItemKeyDownDelete:
          case useMultipleSelection.stateChangeTypes.DropdownKeyDownBackspace:
          case useMultipleSelection.stateChangeTypes.FunctionRemoveSelectedItem:
            setSelectedItems(newSelectedItems || []);
            onChange?.(newSelectedItems || []);
            break;
          default:
            break;
        }
      },
    });
  const {
    isOpen,
    getLabelProps,
    getMenuProps,
    getInputProps,
    highlightedIndex,
    getItemProps,
    openMenu,
    closeMenu,
  } = useCombobox({
    id,
    items,
    inputValue,
    selectedItem: null,
    stateReducer(state, actionAndChanges) {
      const { changes, type } = actionAndChanges;

      switch (type) {
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
        case useCombobox.stateChangeTypes.InputBlur:
          setInputValue("");

          return {
            ...changes,
            ...(changes.selectedItem && {
              isOpen: true,
              highlightedIndex: state.highlightedIndex,
            }),
          };
        case useCombobox.stateChangeTypes.InputKeyDownEscape:
          return { ...changes, isOpen: false };
        case useCombobox.stateChangeTypes.InputKeyDownArrowDown:
          return { ...changes, isOpen: true };
        default:
          return changes;
      }
    },
    onStateChange({
      inputValue: newInputValue,
      type,
      selectedItem: newSelectedItem,
    }: any) {
      switch (type) {
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
          if (newInputValue === "" || !newSelectedItem) {
            break;
          }

          const newItems = selectedItems?.includes(newSelectedItem)
            ? selectedItems.filter((item) => item !== newSelectedItem)
            : [...selectedItems, newSelectedItem];

          onChange?.(newItems);
          setSelectedItems(newItems);
          setInputValue("");
          break;
        case useCombobox.stateChangeTypes.InputChange:
          setInputValue(newInputValue);
          break;
        default:
          break;
      }
    },
  });
  return (
    <div className="space-y-1.5">
      <Label {...getLabelProps()}>
        {label}
        <span className="block type-xs-tight text-body-and-labels mt-0.5">
          Select two or more toppings
        </span>
      </Label>

      <div
        className="focus:outline-none flex justify-between rounded-sm p-1 transition-shadow shadow-focusable-outline focus-within:shadow-focus-outline bg-overlay-1 text-titles-and-attributes items-center min-h-[2.5rem]"
        ref={refs.setReference}
        onClick={() => openMenu()}
      >
        <div className="flex flex-wrap gap-1 w-full">
          {selectedItems.map((selectedItem, index) => (
            <span
              className="min-h-6 items-center gap-x-2.5 rounded-sm bg-normal-idle px-2 py-1"
              key={`selected-item-${index}`}
              {...getSelectedItemProps({ selectedItem, index })}
            >
              {selectedItem}

              <button
                aria-label={`Remove "${selectedItem}"`}
                className="ml-2 focusable"
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();

                  removeSelectedItem(selectedItem);
                }}
              >
                &#10005;
              </button>
            </span>
          ))}

          <input
            aria-describedby={Boolean(error) ? errorId : undefined}
            className="bg-transparent focus:outline-none"
            name={name}
            placeholder={
              selectedItems?.length === 0 ? "Select toppings" : undefined
            }
            {...getInputProps({
              ...getDropdownProps({
                onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                  }

                  if (e.key === "Tab" && isOpen) {
                    closeMenu();
                  }
                },
              }),
            })}
          />
        </div>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className={clsx(
            "min-w-4 min-h-4 w-4 h-4 mr-2 transform-gpu transition-transform duration-300",
            isOpen && "rotate-180"
          )}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
          />
        </svg>
      </div>

      {Boolean(error) ? (
        <p className="type-xs-tight text-critical mt-1.5" id={errorId}>
          {error}
        </p>
      ) : null}

      <div className="z-popover" ref={refs.setFloating} style={floatingStyles}>
        <ul
          className={
            "bg-surface-2xl shadow-xl absolute overflow-y-auto max-h-[15.5rem] w-full"
          }
          {...getMenuProps()}
        >
          {isOpen &&
            (items.length === 0 ? (
              <li
                className={clsx(
                  "p-2 flex text-titles-and-attribute items-center"
                )}
              >
                No results
              </li>
            ) : (
              items.map((item, index) => (
                <li
                  className={clsx(
                    "p-2 flex text-titles-and-attribute items-center",
                    highlightedIndex === index && "bg-overlay-1"
                  )}
                  key={`${item}${index}`}
                  {...getItemProps({ item, index })}
                >
                  <CheckboxControl
                    id={`${item}${index}`}
                    isChecked={selectedItems?.includes(item)}
                    tabIndex={-1}
                  />
                  <label className="ml-2" htmlFor={`${item}${index}`}>
                    {item}
                  </label>
                </li>
              ))
            ))}
        </ul>
      </div>
    </div>
  );
};

interface FormData {
  name?: string;
  toppings?: Array<string>;
}
interface FormErrors {
  name?: string;
  toppings?: string;
}

export default function MultiselectPage() {
  const router = useRouter();

  const [formData, setFormData] = React.useState<FormData>({});
  const [errors, setErrors] = React.useState<FormErrors | null>(null);

  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();

        const errorsToDisplay: FormErrors = {};

        if (!formData.name) {
          errorsToDisplay.name = "Enter order name";
        }

        if (
          !formData.toppings?.length ||
          (formData.toppings || []).length < 2
        ) {
          errorsToDisplay.toppings = "Select two or more toppings";
        }

        if (errorsToDisplay.name || errorsToDisplay.toppings) {
          setErrors(errorsToDisplay);
          return;
        }

        router.push("/multiselect/success");
      }}
    >
      <InputField
        label="Order name"
        name="name"
        onChange={(value) => {
          setFormData({ ...formData, name: value });

          if (errors) {
            const errorsToDisplay: FormErrors = {};

            if (errors.toppings) {
              errorsToDisplay.toppings = errors.toppings;
            }

            setErrors(errorsToDisplay);
          }
        }}
        error={errors?.name}
      />

      <MultiselectPackageC
        label="Toppings to include"
        name="toppings"
        onChange={(values) => {
          setFormData({ ...formData, toppings: values });

          if (errors) {
            const errorsToDisplay: FormErrors = {};

            if (errors.name) {
              errorsToDisplay.name = errors.name;
            }

            if ((values || [])?.length < 2) {
              errorsToDisplay.toppings = errors.toppings;
            }

            setErrors(errorsToDisplay);
          }
        }}
        error={errors?.toppings}
      />

      <TextareaField
        label="Special instructions (optional)"
        name="instructions"
      />
      <Button type="submit">Submit</Button>
    </form>
  );
}
