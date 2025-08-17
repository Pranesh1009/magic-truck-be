import { S3Client, PutObjectCommand, DeleteObjectCommand, ObjectCannedACL } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import logger from '../utils/logger';

export interface UploadResult {
  success: boolean;
  url?: string;
  key?: string;
  error?: string;
}

export interface DeleteResult {
  success: boolean;
  error?: string;
}

class FileUploadService {
  private s3Client: S3Client;
  private bucketName: string;
  private region: string;
  private endpoint: string;

  constructor() {
    this.bucketName = process.env.DO_SPACES_BUCKET_NAME || '';
    this.region = process.env.DO_SPACES_REGION || 'blr1';
    this.endpoint = `https://${this.region}.digitaloceanspaces.com`;

    if (!process.env.DO_SPACES_ACCESS_KEY_ID || !process.env.DO_SPACES_SECRET_ACCESS_KEY) {
      logger.error('DigitalOcean Spaces credentials not configured');
      throw new Error('DigitalOcean Spaces credentials not configured');
    }

    this.s3Client = new S3Client({
      region: this.region,
      endpoint: this.endpoint,
      credentials: {
        accessKeyId: process.env.DO_SPACES_ACCESS_KEY_ID,
        secretAccessKey: process.env.DO_SPACES_SECRET_ACCESS_KEY,
      },
    });

    logger.info('FileUploadService initialized', {
      bucket: this.bucketName,
      region: this.region,
      endpoint: this.endpoint
    });
  }

  /**
   * Upload a file to DigitalOcean Spaces
   */
  async uploadFile(
    file: Express.Multer.File,
    folder: string = 'uploads'
  ): Promise<UploadResult> {
    try {
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const fileExtension = file.originalname.split('.').pop();
      const fileName = `${folder}/${timestamp}-${randomString}.${fileExtension}`;

      const uploadParams = {
        Bucket: this.bucketName,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: ObjectCannedACL.public_read,
        Metadata: {
          originalName: file.originalname,
          uploadedAt: new Date().toISOString(),
        },
      };

      const command = new PutObjectCommand(uploadParams);
      await this.s3Client.send(command);

      const fileUrl = `${this.endpoint}/${this.bucketName}/${fileName}`;

      logger.info('File uploaded successfully', {
        fileName,
        originalName: file.originalname,
        size: file.size,
        url: fileUrl
      });

      return {
        success: true,
        url: fileUrl,
        key: fileName,
      };
    } catch (error) {
      logger.error('File upload failed', { error, originalName: file.originalname });
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Delete a file from DigitalOcean Spaces
   */
  async deleteFile(key: string): Promise<DeleteResult> {
    try {
      const deleteParams = {
        Bucket: this.bucketName,
        Key: key,
      };

      const command = new DeleteObjectCommand(deleteParams);
      await this.s3Client.send(command);

      logger.info('File deleted successfully', { key });

      return {
        success: true,
      };
    } catch (error) {
      logger.error('File deletion failed', { error, key });
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Generate a presigned URL for direct upload
   */
  async generatePresignedUrl(
    fileName: string,
    contentType: string,
    folder: string = 'uploads'
  ): Promise<{ success: boolean; url?: string; key?: string; error?: string }> {
    try {
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const fileExtension = fileName.split('.').pop();
      const key = `${folder}/${timestamp}-${randomString}.${fileExtension}`;

      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        ContentType: contentType,
        ACL: ObjectCannedACL.public_read,
      });

      const presignedUrl = await getSignedUrl(this.s3Client, command, {
        expiresIn: 3600, // 1 hour
      });

      logger.info('Presigned URL generated', { key, contentType });

      return {
        success: true,
        url: presignedUrl,
        key: key,
      };
    } catch (error) {
      logger.error('Failed to generate presigned URL', { error, fileName });
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Get the public URL for a file
   */
  getPublicUrl(key: string): string {
    return `${this.endpoint}/${this.bucketName}/${key}`;
  }
}

export default new FileUploadService();
