export interface Field {
  error?: string;
  label: string;
  name: string;
  onChange?: (value: string) => void;
}
