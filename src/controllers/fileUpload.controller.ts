import { Request, Response } from 'express';
import fileUploadService from '../services/fileUpload.service';
import logger from '../utils/logger';
import { sendSuccess, sendError } from '../utils/response.util';

export class FileUploadController {
  /**
   * Upload a single file
   */
  async uploadSingleFile(req: Request, res: Response) {
    try {
      if (!req.file) {
        return sendError(res, 'No file provided', 400);
      }

      const folder = req.body.folder || 'uploads';
      const result = await fileUploadService.uploadFile(req.file, folder);

      if (!result.success) {
        logger.error(`File upload failed: ${JSON.stringify(result.error)}`);
        return sendError(res, 'File upload failed', 500);
      }

      logger.info('File uploaded via API', {
        originalName: req.file.originalname,
        size: req.file.size,
        url: result.url
      });

      return sendSuccess(res, {
        url: result.url,
        key: result.key,
        originalName: req.file.originalname,
        size: req.file.size,
        mimeType: req.file.mimetype
      });
    } catch (error) {
      logger.error('File upload controller error', { error });
      return sendError(res, 'Internal server error', 500);
    }
  }

  /**
   * Upload multiple files
   */
  async uploadMultipleFiles(req: Request, res: Response) {
    try {
      if (!req.files || req.files.length === 0) {
        return sendError(res, 'No files provided', 400);
      }

      const folder = req.body.folder || 'uploads';
      const files = req.files as Express.Multer.File[];
      const results = [];

      for (const file of files) {
        const result = await fileUploadService.uploadFile(file, folder);
        results.push({
          originalName: file.originalname,
          success: result.success,
          url: result.url,
          key: result.key,
          error: result.error
        });
      }

      const successCount = results.filter(r => r.success).length;
      const failureCount = results.length - successCount;

      logger.info('Multiple files uploaded via API', {
        totalFiles: files.length,
        successCount,
        failureCount
      });

      return sendSuccess(res, {
        results,
        summary: {
          total: files.length,
          successful: successCount,
          failed: failureCount
        }
      });
    } catch (error) {
      logger.error('Multiple file upload controller error', { error });
      return sendError(res, 'Internal server error', 500);
    }
  }

  /**
   * Delete a file
   */
  async deleteFile(req: Request, res: Response) {
    try {
      const { key } = req.params;

      if (!key) {
        return sendError(res, 'File key is required', 400);
      }

      const result = await fileUploadService.deleteFile(key);

      if (!result.success) {
        logger.error(`File deletion failed: ${JSON.stringify(result.error)}`);
        return sendError(res, 'File deletion failed', 500);
      }

      logger.info('File deleted via API', { key });

      return sendSuccess(res, 'File deleted successfully');
    } catch (error) {
      logger.error('File deletion controller error', { error });
      return sendError(res, 'Internal server error', 500);
    }
  }

  /**
   * Generate presigned URL for direct upload
   */
  async generatePresignedUrl(req: Request, res: Response) {
    try {
      const { fileName, contentType, folder } = req.body;

      if (!fileName || !contentType) {
        return sendError(res, 'fileName and contentType are required', 400);
      }

      const result = await fileUploadService.generatePresignedUrl(
        fileName,
        contentType,
        folder || 'uploads'
      );

      if (!result.success) {
        logger.error(`Failed to generate presigned URL: ${JSON.stringify(result.error)}`);
        return sendError(res, 'Failed to generate presigned URL', 500);
      }

      logger.info('Presigned URL generated via API', { fileName, contentType });

      return sendSuccess(res, {
        presignedUrl: result.url,
        key: result.key,
        publicUrl: result.key ? fileUploadService.getPublicUrl(result.key) : undefined
      });
    } catch (error) {
      logger.error('Presigned URL generation controller error', { error });
      return sendError(res, 'Internal server error', 500);
    }
  }

  /**
   * Get file info (public URL)
   */
  async getFileInfo(req: Request, res: Response) {
    try {
      const { key } = req.params;

      if (!key) {
        return sendError(res, 'File key is required', 400);
      }

      const publicUrl = fileUploadService.getPublicUrl(key);

      return sendSuccess(res, {
        key,
        publicUrl
      });
    } catch (error) {
      logger.error('Get file info controller error', { error });
      return sendError(res, 'Internal server error', 500);
    }
  }
}

export default new FileUploadController();
