export const splitCodeTag = (value: string) => {
  const res: Array<string> = [];

  const slice2 = value.slice(0, 2);
  const slice4 = value.slice(0, 4);
  const slice6 = value.slice(0, 6);
  const slice8 = value.slice(0, 8);
  const slice10 = value.slice(0, 10);
  const slice12 = value.slice(0, 12);

  if (slice2.length === 2) res.push(slice2);
  if (slice4.length === 4) res.push(slice4);
  if (slice6.length === 6) res.push(slice6);
  if (slice8.length === 8) res.push(slice8);
  if (slice10.length === 10) res.push(slice10);
  if (slice12.length === 12) res.push(slice12);

  return res;
};
