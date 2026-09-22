import { uploadFotoStorageAction } from "@/app/actions/adminActions";
import { supabase } from "@/lib/supabaseClient";

const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024; // 2 MB Limit

/**
 * Convert Blob to Base64 data string.
 */
function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Convert image file or source URL to AVIF format Blob with optional 90° rotation.
 */
export async function processAndConvertToAvif(
  fileOrSrc: File | string,
  rotationAngle: number = 0
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          return reject(new Error("Gagal menginisialisasi canvas context."));
        }

        const rad = (rotationAngle * Math.PI) / 180;
        const sin = Math.abs(Math.sin(rad));
        const cos = Math.abs(Math.cos(rad));

        const width = img.naturalWidth || img.width;
        const height = img.naturalHeight || img.height;

        const newWidth = Math.round(width * cos + height * sin);
        const newHeight = Math.round(width * sin + height * cos);

        canvas.width = newWidth;
        canvas.height = newHeight;

        ctx.translate(newWidth / 2, newHeight / 2);
        ctx.rotate(rad);
        ctx.drawImage(img, -width / 2, -height / 2);

        const tryExport = (mimeType: string, quality: number) => {
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                if (mimeType !== "image/jpeg") {
                  tryExport("image/jpeg", 0.85);
                } else {
                  reject(new Error("Gagal mengompresi gambar dari canvas."));
                }
                return;
              }

              if (blob.size > MAX_FILE_SIZE_BYTES && quality > 0.3) {
                tryExport(mimeType, quality - 0.2);
              } else {
                resolve(blob);
              }
            },
            mimeType,
            quality
          );
        };

        tryExport("image/avif", 0.85);
      } catch (err) {
        reject(
          new Error(
            "Gagal memproses rotasi/format gambar: " +
              (err instanceof Error ? err.message : String(err))
          )
        );
      }
    };

    img.onerror = () => {
      reject(new Error("File yang dipilih bukan file gambar yang valid. Pastikan memilih file gambar."));
    };

    if (typeof fileOrSrc === "string") {
      img.src = fileOrSrc;
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error("Gagal membaca file dari galeri."));
      reader.readAsDataURL(fileOrSrc);
    }
  });
}

/**
 * Upload AVIF Blob to Supabase Storage bucket 'pengurus-photos' in 'profile/' directory
 * and return public URL string to store in Pengurus.fotoUrl text column.
 */
export async function uploadFotoToSupabaseStorage(
  blob: Blob,
  pengurusNama: string
): Promise<string> {
  // Primary attempt via Server Action (ensures RLS policies & executes upload)
  try {
    const base64Data = await blobToBase64(blob);
    const serverResult = await uploadFotoStorageAction(base64Data, pengurusNama);
    if (serverResult.success && serverResult.url) {
      return serverResult.url;
    }
    if (serverResult.error) {
      throw new Error(serverResult.error);
    }
  } catch (serverErr) {
    if (serverErr instanceof Error && serverErr.message.includes("Gagal mengunggah foto ke Supabase Storage")) {
      throw serverErr;
    }
    console.warn("[uploadFotoToSupabaseStorage] Server action upload fallback to client:", serverErr);
  }

  // Fallback attempt via Client Supabase Storage API
  const bucketName = "pengurus-photos";
  const slugNama = pengurusNama
    ? pengurusNama
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-")
        .slice(0, 30)
    : "pengurus";
  const fileName = `profile/${Date.now()}_${slugNama}.avif`;

  const { error } = await supabase.storage
    .from(bucketName)
    .upload(fileName, blob, {
      contentType: "image/avif",
      upsert: true,
      cacheControl: "3600",
    });

  if (error) {
    console.error("[Supabase Storage Upload Error]:", error);
    throw new Error(`Gagal mengunggah foto ke Supabase Storage: ${error.message}`);
  }

  const { data: publicUrlData } = supabase.storage
    .from(bucketName)
    .getPublicUrl(fileName);

  if (!publicUrlData || !publicUrlData.publicUrl) {
    throw new Error("Gagal mendapatkan URL publik foto dari Supabase Storage.");
  }

  return publicUrlData.publicUrl;
}


