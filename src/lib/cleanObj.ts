/* eslint-disable @typescript-eslint/no-explicit-any */
export function cleanObject(obj: any) {
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([_, v]) => v !== "" && v !== null && v !== undefined
    )
  );
}
