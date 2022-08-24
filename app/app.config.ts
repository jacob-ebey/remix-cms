export const appName = "Remix CMS";

export type DataTypes =
  | "bool"
  | "int"
  | "float"
  | "string"
  | "json"
  | "reference";
export const dataTypes = [
  "bool",
  "int",
  "float",
  "string",
  "json",
  "reference",
] as const;
