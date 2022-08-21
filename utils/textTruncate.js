export const textTruncate = (text, firstCharCount, lastCharCount) => {
  if (text.length < firstCharCount + lastCharCount) return text;
  const newText = text.slice(0, firstCharCount);
  const lastText = text.slice(-lastCharCount);
  return newText + "..." + lastText;
};
