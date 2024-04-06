export interface Region {
  navn: string;
  kode: string;
}

export type RegionType = {
  kode: string;
  navn: string;
};

export type TableDataType = {
  indexes: any[];
  variable: any[];
  region: any[];
  year: any[];
  values: any[];
};

export type LabelKey = 'median' | 'avg' | 'min' | 'max';
