export enum ClientCategory {
  private = "private",
  company = "company",
}

export type Tarrif = {
  durationTitle: string;
  category: ClientCategory;
  description: string;
  features: Array<string>;
  price: number;
};
