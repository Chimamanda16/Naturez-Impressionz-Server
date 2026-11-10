import Post from "../models/blog.js";

function slugify(title) {
  return String(title ?? "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "post";
}

export async function generateUniqueSlug(title, excludeId) {
  const baseSlug = slugify(title);
  const excludedDocument = excludeId ? { _id: { $ne: excludeId } } : {};
  let candidate = baseSlug;
  let suffix = 2;

  while (await Post.exists({ slug: candidate, ...excludedDocument })) {
    candidate = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  return candidate;
}

export function isDuplicateSlugError(error) {
  return error?.code === 11000 && error?.keyPattern?.slug === 1;
}
