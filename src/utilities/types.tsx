export interface Region {
  navn: string;
  kode: string;
}

export type RegionType = {
  kode: string;
  navn: string;
};

export type LabelKey = 'median' | 'avg' | 'min' | 'max';
