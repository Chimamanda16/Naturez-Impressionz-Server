import { randomUUID } from "node:crypto";
import { UTApi, UTFile } from "uploadthing/server";

const imageTypes = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/gif", "gif"],
  ["image/avif", "avif"],
]);

let uploadthingApi;

function getUploadThingApi() {
  const token = process.env.UPLOADTHING_TOKEN;
  if (!token) {
    throw new Error("UploadThing is not configured");
  }

  uploadthingApi ??= new UTApi({ token });
  return uploadthingApi;
}

export async function uploadImageToUploadThing(file) {
  const extension = imageTypes.get(file.contentType);
  if (!extension) {
    const error = new Error("Unsupported image type. Upload JPEG, PNG, WebP, GIF, or AVIF.");
    error.status = 415;
    throw error;
  }

  if (!Buffer.isBuffer(file.body) || file.body.length === 0) {
    const error = new Error("The uploaded image is empty or invalid.");
    error.status = 400;
    throw error;
  }

  const uploaded = await getUploadThingApi().uploadFiles(
    new UTFile([file.body], `${randomUUID()}.${extension}`, {
      type: file.contentType,
    }),
    { contentDisposition: "inline" }
  );

  if (uploaded.error || !uploaded.data?.ufsUrl) {
    console.error("UploadThing upload failed", uploaded.error);
    const error = new Error(uploaded.error?.message ?? "UploadThing did not return an image URL.");
    error.status = 502;
    throw error;
  }

  return uploaded.data.ufsUrl;
}
