export type LinkOption = {
  name: string;
  path?: string;
  subLinks?: Array<LinkOption>;
};
