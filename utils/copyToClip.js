import toast from "react-hot-toast";

export const copyToClip = async (text, showToast = true) => {
  try {
    await navigator.clipboard.writeText(text);
    if (showToast) toast.success("Copied!");
  } catch (e) {
    console.log("Error copying to clipboard", e);
  }
};
