// Uploads a profile photo to ImgBB and returns its https URL.
// TODO: move uploads behind the API so the ImgBB key isn't shipped to the browser.
const KEY = import.meta.env.VITE_IMGBB_API_KEY;

export const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export function validateImage(file) {
  if (!IMAGE_TYPES.includes(file.type)) return "Use a JPG, PNG or WebP image";
  if (file.size > MAX_IMAGE_BYTES) return "Image must be under 5 MB";
  return null;
}

export async function uploadImage(file) {
  if (!KEY) throw new Error("Photo uploads aren't configured yet (missing VITE_IMGBB_API_KEY).");
  const body = new FormData();
  body.append("image", file);
  const res = await fetch(`https://api.imgbb.com/1/upload?key=${KEY}`, { method: "POST", body });
  const json = await res.json().catch(() => null);
  if (!res.ok || !json?.success) throw new Error("We couldn't upload your photo. Try a different image.");
  return json.data.url;
}
