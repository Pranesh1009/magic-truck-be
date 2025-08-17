import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import fileUploadController from '../controllers/fileUpload.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();

// File filter to allow specific file types
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Allow common file types
  const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'text/csv',
    'application/zip',
    'application/x-zip-compressed'
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${file.mimetype} is not allowed`));
  }
};

// Configure multer with limits
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 5 // Maximum 5 files per request
  }
});

// Single file upload
const uploadSingle = upload.single('file');

// Multiple files upload
const uploadMultiple = upload.array('files', 5);

// Error handling middleware for multer
const handleMulterError = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 10MB'
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files. Maximum is 5 files'
      });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Unexpected file field'
      });
    }
  }

  if (err.message && err.message.includes('File type')) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }

  next(err);
};

// Routes

/**
 * @route POST /api/upload/single
 * @desc Upload a single file
 * @access Private (requires authentication)
 */
router.post('/single', authenticateToken, (req, res, next) => {
  uploadSingle(req, res, (err) => {
    if (err) {
      return handleMulterError(err, req, res, next);
    }
    fileUploadController.uploadSingleFile(req, res);
  });
});

/**
 * @route POST /api/upload/multiple
 * @desc Upload multiple files
 * @access Private (requires authentication)
 */
router.post('/multiple', authenticateToken, (req, res, next) => {
  uploadMultiple(req, res, (err) => {
    if (err) {
      return handleMulterError(err, req, res, next);
    }
    fileUploadController.uploadMultipleFiles(req, res);
  });
});

/**
 * @route POST /api/upload/presigned-url
 * @desc Generate a presigned URL for direct upload
 * @access Private (requires authentication)
 */
router.post('/presigned-url', authenticateToken, fileUploadController.generatePresignedUrl);

/**
 * @route GET /api/upload/file/:key
 * @desc Get file information and public URL
 * @access Private (requires authentication)
 */
router.get('/file/:key', authenticateToken, fileUploadController.getFileInfo);

/**
 * @route DELETE /api/upload/file/:key
 * @desc Delete a file
 * @access Private (requires authentication)
 */
router.delete('/file/:key', authenticateToken, fileUploadController.deleteFile);

export default router;
