export const b64_to_json = (b64) => {
  return JSON.parse(atob(b64));
};
