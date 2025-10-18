export interface Lookup {
  lookupId: string;       // Guid maps to string in TS
  lookupValue: string;
}

export interface MultipleLookups {
  lookupTypeName: string;
  lookups: Lookup[];
}
