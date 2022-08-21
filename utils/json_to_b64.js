export const json_to_b64 = (obj) => {
  return btoa(JSON.stringify(obj));
};
