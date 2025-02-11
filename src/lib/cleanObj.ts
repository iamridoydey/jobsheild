/* eslint-disable @typescript-eslint/no-explicit-any */
export function cleanObject(obj: any) {
  return Object.fromEntries(
    Object.entries(obj).filter(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ([_, v]) => v !== "" && v !== null && v !== undefined
    )
  );
}
