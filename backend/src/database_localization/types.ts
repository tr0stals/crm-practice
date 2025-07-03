export interface TableLocalization {
  displayName: string;
  fields: Record<string, string>;
}

export interface LocalizationData {
  tables: Record<string, TableLocalization>;
}

export interface FieldDisplayNameResponse {
  displayName: string;
} 