import { supabase } from '../config/supabase';
import { AppError } from '../errors/app-error';

const BUCKET_NAME = process.env.SUPABASE_STORAGE_BUCKET || 'vehicle-images';

export class StorageService {
  /**
   * Ensures the storage bucket exists and is public.
   */
  private static async ensureBucketExists(): Promise<void> {
    try {
      const { data: buckets } = await supabase.storage.listBuckets();
      const bucketExists = buckets?.some((b) => b.name === BUCKET_NAME);

      if (!bucketExists) {
        await supabase.storage.createBucket(BUCKET_NAME, {
          public: true,
          allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif'],
        });
      }
    } catch (err) {
      console.warn('[StorageService] Bucket check/creation warning:', err);
    }
  }

  /**
   * Uploads an image file to Supabase Storage and returns its public URL.
   */
  public static async uploadVehicleImage(file: Express.Multer.File): Promise<string> {
    if (!file || !file.buffer) {
      throw new AppError('No image file provided for upload', 400);
    }

    await this.ensureBucketExists();

    const fileExt = file.originalname.split('.').pop()?.toLowerCase() || 'png';
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `vehicles/${fileName}`;

    const { error } = await supabase.storage.from(BUCKET_NAME).upload(filePath, file.buffer, {
      contentType: file.mimetype,
      upsert: true,
    });

    if (error) {
      console.error('[StorageService] Upload error:', error.message);
      throw new AppError(`Failed to upload image to Supabase Storage: ${error.message}`, 500);
    }

    const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);
    return data.publicUrl;
  }
}
