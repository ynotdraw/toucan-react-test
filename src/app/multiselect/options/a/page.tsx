"use client";

import * as React from "react";

import { autoUpdate, size, useFloating } from "@floating-ui/react";
import { Button } from "@/components/button";
import { InputField } from "@/components/forms/input-field";
import { Label } from "@/components/label";
import { TextareaField } from "@/components/forms/textarea-field";
import { useMultipleSelection, useCombobox } from "downshift";
import { useRouter } from "next/navigation";
import clsx from "clsx";

interface ComboboxField {
  label: string;
  name: string;
  onChange?: (values: Array<string>) => void;
}

const elements = [
  "Sprinkles",
  "Hot fudge",
  "Whipped cream",
  "Pickles",
  "Avocado",
  "Banana",
  "Oreo",
  "Chopped walnuts",
  "Chocolate sprinkles",
  "Swedish fish",
  "Mini M&Ms",
  "Snickers",
  "Chocolate chips",
];

const getFilteredItems = (inputValue: string) => {
  const lowerCasedInputValue = inputValue.toLowerCase();

  if (lowerCasedInputValue?.length === 0) {
    return elements;
  }

  return elements.filter((element) =>
    element.toLowerCase().startsWith(lowerCasedInputValue)
  );
};

const MultiselectControlBaseline = ({
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
  const [isBoxOpen, setIsBoxOpen] = React.useState<boolean>(false);
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
  } = useCombobox({
    id,
    items,
    inputValue,
    isOpen: isBoxOpen,
    selectedItem: null,
    stateReducer(_state, actionAndChanges) {
      const { changes, type } = actionAndChanges;

      switch (type) {
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
        case useCombobox.stateChangeTypes.InputBlur:
          if (inputValue === "" || !highlightedIndex) {
            return changes;
          }

          setIsBoxOpen(false);
          setInputValue("");

          return {
            ...changes,
            ...(changes.selectedItem && { isOpen: true, highlightedIndex: 0 }),
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

          const newItems = [...selectedItems, newSelectedItem];

          onChange?.(newItems);
          setSelectedItems(newItems);

          setIsBoxOpen(false);
          setInputValue("");
          break;
        case useCombobox.stateChangeTypes.InputChange:
          setInputValue(newInputValue);

          if (!isBoxOpen) {
            setIsBoxOpen(true);
          }

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
        className="focus:outline-none flex flex-wrap rounded-sm p-1 transition-shadow shadow-focusable-outline focus:shadow-focus-outline bg-overlay-1 text-titles-and-attributes items-center gap-1 min-h-[2.5rem]"
        ref={refs.setReference}
        onClick={() => setIsBoxOpen(true)}
        onFocus={() => setIsBoxOpen(true)}
        onBlur={() => setIsBoxOpen(false)}
      >
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
          className="bg-transparent focus:outline-none"
          name={name}
          placeholder={
            selectedItems?.length === 0 ? "Select toppings" : undefined
          }
          {...getInputProps(getDropdownProps({ preventKeyAction: isOpen }))}
        />
      </div>

      <div ref={refs.setFloating} style={floatingStyles}>
        <ul
          className={
            "bg-surface-2xl shadow-xl absolute overflow-y-auto max-h-40 space-y-1 w-full"
          }
          {...getMenuProps()}
        >
          {isOpen &&
            items.map((item, index) => (
              <li
                className={clsx(
                  "p-2 text-titles-and-attributes",
                  highlightedIndex === index && "bg-overlay-1"
                )}
                key={`${item}${index}`}
                {...getItemProps({ item, index })}
              >
                {item}
              </li>
            ))}
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
      <MultiselectControlBaseline
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
