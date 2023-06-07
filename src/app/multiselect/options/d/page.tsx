// WARNING:
// THIS IS NOT PRODUCTION READY CODE! THIS IS A PROOF OF CONCEPT FOR SOME MULTISELECT
// FUNCTIONALITY. PLEASE DO NOT USE THIS IN PRODUCTION!
// THIS EXAMPLE IN PARTICULAR IS NOT WELL WRITTEN CODE, ONLY AIMING FOR FUNCTIONALITY PROOF OF CONCEPT 🫠!
"use client";

import * as React from "react";

import { autoUpdate, size, useFloating } from "@floating-ui/react";
import { Button } from "@/components/button";
import { elements as baseElements } from "../layout";
import { InputField } from "@/components/forms/input-field";
import { Label } from "@/components/label";
import { TextareaField } from "@/components/forms/textarea-field";
import { useMultipleSelection, useCombobox } from "downshift";
import { useRouter } from "next/navigation";
import clsx from "clsx";

const elements = ["Select all", ...baseElements];

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
  label: string;
  name: string;
  onChange?: (values: Array<string>) => void;
}

const getFilteredItems = (inputValue: string) => {
  const lowerCasedInputValue = inputValue.toLowerCase();

  if (lowerCasedInputValue?.length === 0) {
    return elements;
  }

  return elements.filter((element) =>
    element.toLowerCase().startsWith(lowerCasedInputValue)
  );
};

const MultiselectPackageD = ({ label, name, onChange }: ComboboxField) => {
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
  const [inputValue, setInputValue] = React.useState<string>("");
  const [selectedItems, setSelectedItems] = React.useState<Array<string>>([]);
  const [selectAllState, setSelectAllState] = React.useState<
    "checked" | "unchecked" | "indeterminate"
  >("unchecked");

  const items = getFilteredItems(inputValue);

  React.useEffect(() => {
    const isIndeterminate =
      selectedItems.length > 0 && selectedItems.length < elements.length - 1;

    if (isIndeterminate) {
      setSelectAllState("indeterminate");
      return;
    }

    if (selectedItems.length === elements.length - 1) {
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
    selectedItem: null,
    stateReducer(_state, actionAndChanges) {
      const { changes, type } = actionAndChanges;

      switch (type) {
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
        case useCombobox.stateChangeTypes.InputBlur:
          setInputValue("");
          return {
            ...changes,
            ...(changes.selectedItem && { isOpen: true, highlightedIndex: 0 }),
            // To prevent shifting when clicking an item, remove `highlightedIndex: 0` above!
          };
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
            const allExceptSelectAll = [...elements].slice(1);

            const selectAllElements =
              selectedItems.length === elements.length - 1
                ? []
                : allExceptSelectAll;

            onChange?.(selectAllElements);
            setSelectedItems(selectAllElements);
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
        className="focus:outline-none flex justify-between rounded-sm p-1 transition-shadow shadow-focusable-outline focus:shadow-focus-outline bg-overlay-1 text-titles-and-attributes items-center min-h-[2.5rem]"
        ref={refs.setReference}
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
            className="bg-transparent focus:outline-none flex flex-grow"
            name={name}
            placeholder={
              selectedItems?.length === 0 ? "Select toppings" : undefined
            }
            {...getInputProps(getDropdownProps({ preventKeyAction: isOpen }))}
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

      <div className="z-popover" ref={refs.setFloating} style={floatingStyles}>
        <ul
          className={
            "bg-surface-2xl shadow-xl absolute overflow-y-auto max-h-80 space-y-1 w-full"
          }
          {...getMenuProps()}
        >
          {isOpen && (
            <>
              {items.map((item, index) => (
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

                  {index === 0 ? (
                    <div
                      className="border-basement border-[0.025rem]"
                      aria-hidden
                    />
                  ) : null}
                </React.Fragment>
              ))}
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default function MultiselectPage() {
  const router = useRouter();

  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        router.push("/multiselect/success");
      }}
    >
      <InputField label="Order name" name="name" />

      <MultiselectPackageD
        label="Toppings to include"
        name="toppings"
        onChange={(values) => {
          console.log(values);
        }}
      />

      <TextareaField
        label="Special instructions (optional)"
        name="instructions"
      />

      <Button type="submit">Submit</Button>
    </form>
  );
}
