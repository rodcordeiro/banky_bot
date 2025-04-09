declare global {
  type Value = string | number;
  type AutocompleteOption = {
    name: string;
    value: Value;
  };
}
export {};
