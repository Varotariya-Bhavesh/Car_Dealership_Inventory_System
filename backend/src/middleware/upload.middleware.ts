import multer from 'multer';
import { Request } from 'express';
import { AppError } from '../errors/app-error';

const storage = multer.memoryStorage();

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
): void => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new AppError('Only image files (JPEG, PNG, WEBP, GIF) are allowed', 400));
  }
};

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB max size
  },
  fileFilter,
});

export const uploadSingleImage = upload.single('image');
