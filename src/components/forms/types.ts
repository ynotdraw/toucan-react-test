export interface Field {
  label: string;
  name: string;
  onChange?: (value: string) => void;
}
