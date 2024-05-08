declare module "*.svg" {
  const content: string;

  const ReactComponent: React.FunctionComponent<
    React.SVGAttributes<SVGElement>
  >;

  export { ReactComponent };

  export default content;
}

declare module "*.png" {
  const content: string;

  export default content;
}

declare module "*.jpg" {
  const content: string;

  export default content;
}

declare module "*.jpeg" {
  const content: string;

  export default content;
}

declare module "*.ttf" {
  const content: string;
  export default content;
}
