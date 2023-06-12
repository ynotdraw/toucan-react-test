// WARNING:
// THIS IS NOT PRODUCTION READY CODE! THIS IS A PROOF OF CONCEPT FOR SOME MULTISELECT
// FUNCTIONALITY. PLEASE DO NOT USE THIS IN PRODUCTION!
// THIS EXAMPLE IN PARTICULAR IS NOT WELL WRITTEN CODE, ONLY AIMING FOR FUNCTIONALITY PROOF OF CONCEPT 🫠!
"use client";

import * as React from "react";

import { autoUpdate, size, useFloating } from "@floating-ui/react";
import { Button } from "@/components/button";
import { options as baseOptions } from "@/options";
import { InputField } from "@/components/forms/input-field";
import { Label } from "@/components/label";
import { TextareaField } from "@/components/forms/textarea-field";
import { useMultipleSelection, useCombobox } from "downshift";
import { useRouter } from "next/navigation";
import clsx from "clsx";

const options = ["Select all", ...baseOptions];

interface CheckboxControlProps extends React.ComponentPropsWithoutRef<"input"> {
  isChecked?: boolean;
  isIndeterminate?: boolean;
}

const CheckboxControl = ({
  isChecked = false,
  isIndeterminate = false,
  ...rootProps
}: CheckboxControlProps) => {
  const ref = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    if (!ref.current) {
      return;
    }

    if (isIndeterminate) {
      ref.current.indeterminate = true;
      ref.current.checked = false;
    } else {
      ref.current.indeterminate = false;
    }
  }, [isIndeterminate]);

  return (
    <div className="min-w-4 min-h-4 relative flex h-4 w-4 items-center justify-center">
      <input
        className={clsx(
          "border-body-and-labels focusable-outer focus:outline-none inline-block h-4 w-4 transform-gpu appearance-none rounded-sm border p-0 align-middle focus-visible:scale-75 ",
          isChecked || isIndeterminate
            ? "bg-primary-idle border-none"
            : "bg-normal-idle"
        )}
        type="checkbox"
        defaultChecked={isChecked}
        ref={ref}
        {...rootProps}
      />

      {(isChecked || isIndeterminate) && (
        <div className="pointer-events-none absolute">
          <svg
            aria-hidden="true"
            className="text-ground-floor h-3 w-3"
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="currentColor"
          >
            {isChecked && (
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M10.207 4.207 5 9.414 2.293 6.707l1.414-1.414L5 6.586l3.793-3.793 1.414 1.414Z"
              />
            )}

            {isIndeterminate && <path d="M10 5v2H2V5h8Z" />}
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

const MultiselectPackageD = ({
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

  const [isBoxOpen, setIsBoxOpen] = React.useState<boolean>(false);
  const [inputValue, setInputValue] = React.useState<string>("");
  const [selectedItems, setSelectedItems] = React.useState<Array<string>>([]);
  const [selectAllState, setSelectAllState] = React.useState<
    "checked" | "unchecked" | "indeterminate"
  >("unchecked");

  const items = getFilteredItems(inputValue);

  // See statement at the top of the file, this is super hacky, but I
  // needed a way to close the popover when it is clicked outside.
  // With the hacky way we setup downshift here where it's more like a
  // select, this was a bit tricky. I opted for this terrible code.
  React.useEffect(() => {
    const closeIfClickedOutside = (e: any) => {
      if (
        e.target.contains(
          document.querySelector('[data-trigger][aria-expanded="true"]')
        )
      ) {
        setIsBoxOpen(false);
      }
    };

    document.body.addEventListener("click", closeIfClickedOutside);
    return () => {
      document.body.removeEventListener("click", closeIfClickedOutside);
    };
  }, []);

  React.useEffect(() => {
    const isIndeterminate =
      selectedItems.length > 0 && selectedItems.length < options.length - 1;

    if (isIndeterminate) {
      setSelectAllState("indeterminate");
      return;
    }

    if (selectedItems.length === options.length - 1) {
      setSelectAllState("checked");
      return;
    }

    setSelectAllState("unchecked");
  }, [selectedItems]);

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
  } = useCombobox({
    id,
    items,
    inputValue,
    isOpen: isBoxOpen,
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
          setIsBoxOpen(false);
          return changes;
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

          // NOTE: For some reason this is triggering
          // `onChange` twice when clicked.  I'm not sure why, but
          // since this is just proofing things out at the moment,
          // I'm going to ignore for the time being.
          if (newSelectedItem === "Select all") {
            const allExceptSelectAll = [...options].slice(1);

            const selectAllOptions =
              selectedItems.length === options.length - 1
                ? []
                : allExceptSelectAll;

            onChange?.(selectAllOptions);
            setSelectedItems(selectAllOptions);
            setInputValue("");
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
      <Label {...getLabelProps()}>{label}</Label>

      <div
        aria-describedby={Boolean(error) ? errorId : undefined}
        aria-expanded={isOpen}
        data-trigger
        className="focus:shadow-focus-outline focus:outline-none flex justify-between rounded-sm p-1 transition-shadow shadow-focusable-outline bg-overlay-1 text-titles-and-attributes items-center min-h-[2.5rem]"
        ref={refs.setReference}
        onClick={() => setIsBoxOpen(!isBoxOpen)}
        onKeyDown={(e) => {
          e.preventDefault();

          // We want keyboard users to be able to use the keyboard
          if (e.key === "Enter" || e.key === " ") {
            setIsBoxOpen(true);
          }

          if (!e.shiftKey && e.key === "Tab") {
            (
              document.querySelector(
                "[data-test-textarea]"
              ) as HTMLTextAreaElement
            )?.focus();
          }

          if (e.shiftKey && e.key === "Tab") {
            (
              document.querySelector("[data-test-input]") as HTMLInputElement
            )?.focus();
          }
        }}
        tabIndex={0}
        role="button"
      >
        {selectedItems?.length === 0 ? (
          <p className="text-disabled select-none">Select toppings</p>
        ) : (
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
          </div>
        )}

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

      <div
        className={clsx(
          "z-popover bg-surface-2xl shadow-xl absolute overflow-y-auto w-full",
          !isOpen && "hidden"
        )}
        ref={refs.setFloating}
        style={floatingStyles}
      >
        <div className="p-2">
          <input
            className="focus:outline-none block rounded-sm p-1 transition-shadow
            shadow-focusable-outline focus:shadow-focus-outline bg-overlay-1 text-titles-and-attributes w-full"
            name={name}
            placeholder="Filter options..."
            {...getInputProps(getDropdownProps({ preventKeyAction: isOpen }))}
          />
        </div>

        <ul className="max-h-80 space-y-1" {...getMenuProps()}>
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
                <React.Fragment key={`${item}${index}`}>
                  <li
                    className={clsx(
                      "p-2 flex text-titles-and-attribute items-center",
                      highlightedIndex === index && "bg-overlay-1"
                    )}
                    {...getItemProps({ item, index })}
                  >
                    <CheckboxControl
                      id={`${item}${index}`}
                      isChecked={
                        index === 0 && !inputValue
                          ? Boolean(selectAllState === "checked")
                          : selectedItems?.includes(item)
                      }
                      isIndeterminate={
                        index === 0 &&
                        !inputValue &&
                        selectAllState === "indeterminate"
                          ? true
                          : false
                      }
                    />
                    <label className="ml-2" htmlFor={`${item}${index}`}>
                      {item}
                    </label>
                  </li>

                  {index === 0 && !inputValue ? (
                    <div
                      className="border-basement border-[0.025rem]"
                      aria-hidden
                    />
                  ) : null}
                </React.Fragment>
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

  const [formData, setFormData] = React.useState<FormData>({
    name: "",
    toppings: [],
  });
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

        if (!formData.toppings?.length) {
          errorsToDisplay.toppings = "Select one or more toppings";
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

      <MultiselectPackageD
        label="Toppings to include"
        name="toppings"
        onChange={(values) => {
          setFormData({ ...formData, toppings: values });

          if (errors) {
            const errorsToDisplay: FormErrors = {};

            if (errors.name) {
              errorsToDisplay.name = errors.name;
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
