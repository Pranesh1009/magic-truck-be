# File Upload API Documentation

This document describes the file upload API endpoints for uploading files to DigitalOcean Spaces.

## Overview

The file upload API provides endpoints for:

- Uploading single files
- Uploading multiple files
- Generating presigned URLs for direct uploads
- Deleting files
- Getting file information

All endpoints require authentication using JWT tokens.

## Configuration

The following environment variables are required:

```env
DO_SPACES_ACCESS_KEY_ID=your_access_key_id
DO_SPACES_SECRET_ACCESS_KEY=your_secret_access_key
DO_SPACES_BUCKET_NAME=your_bucket_name
DO_SPACES_REGION=nyc3  # Optional, defaults to nyc3
```

## Supported File Types

The API supports the following file types:

- Images: JPEG, PNG, GIF, WebP
- Documents: PDF, DOC, DOCX, XLS, XLSX
- Text files: TXT, CSV
- Archives: ZIP

## File Size Limits

- Maximum file size: 10MB per file
- Maximum files per request: 5 files

## API Endpoints

### 1. Upload Single File

**POST** `/api/upload/single`

Upload a single file to DigitalOcean Spaces.

**Headers:**

```
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data
```

**Body (multipart/form-data):**

- `file`: The file to upload (required)
- `folder`: Optional folder name (defaults to "uploads")

**Response:**

```json
{
  "success": true,
  "message": "File uploaded successfully",
  "data": {
    "url": "https://nyc3.digitaloceanspaces.com/bucket/uploads/1234567890-abc123.jpg",
    "key": "uploads/1234567890-abc123.jpg",
    "originalName": "photo.jpg",
    "size": 1024000,
    "mimeType": "image/jpeg"
  }
}
```

### 2. Upload Multiple Files

**POST** `/api/upload/multiple`

Upload multiple files to DigitalOcean Spaces.

**Headers:**

```
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data
```

**Body (multipart/form-data):**

- `files`: Array of files to upload (required)
- `folder`: Optional folder name (defaults to "uploads")

**Response:**

```json
{
  "success": true,
  "message": "Uploaded 3 of 3 files",
  "data": {
    "results": [
      {
        "originalName": "file1.jpg",
        "success": true,
        "url": "https://nyc3.digitaloceanspaces.com/bucket/uploads/1234567890-abc123.jpg",
        "key": "uploads/1234567890-abc123.jpg"
      },
      {
        "originalName": "file2.pdf",
        "success": true,
        "url": "https://nyc3.digitaloceanspaces.com/bucket/uploads/1234567890-def456.pdf",
        "key": "uploads/1234567890-def456.pdf"
      }
    ],
    "summary": {
      "total": 2,
      "successful": 2,
      "failed": 0
    }
  }
}
```

### 3. Generate Presigned URL

**POST** `/api/upload/presigned-url`

Generate a presigned URL for direct upload to DigitalOcean Spaces.

**Headers:**

```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Body:**

```json
{
  "fileName": "document.pdf",
  "contentType": "application/pdf",
  "folder": "documents" // Optional
}
```

**Response:**

```json
{
  "success": true,
  "message": "Presigned URL generated successfully",
  "data": {
    "presignedUrl": "https://bucket.nyc3.digitaloceanspaces.com/uploads/1234567890-abc123.pdf?X-Amz-Algorithm=...",
    "key": "uploads/1234567890-abc123.pdf",
    "publicUrl": "https://nyc3.digitaloceanspaces.com/bucket/uploads/1234567890-abc123.pdf"
  }
}
```

### 4. Get File Information

**GET** `/api/upload/file/:key`

Get information about a file including its public URL.

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Response:**

```json
{
  "success": true,
  "message": "File info retrieved successfully",
  "data": {
    "key": "uploads/1234567890-abc123.jpg",
    "publicUrl": "https://nyc3.digitaloceanspaces.com/bucket/uploads/1234567890-abc123.jpg"
  }
}
```

### 5. Delete File

**DELETE** `/api/upload/file/:key`

Delete a file from DigitalOcean Spaces.

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Response:**

```json
{
  "success": true,
  "message": "File deleted successfully"
}
```

## Error Responses

### File Too Large

```json
{
  "success": false,
  "message": "File too large. Maximum size is 10MB"
}
```

### Too Many Files

```json
{
  "success": false,
  "message": "Too many files. Maximum is 5 files"
}
```

### Unsupported File Type

```json
{
  "success": false,
  "message": "File type application/octet-stream is not allowed"
}
```

### Upload Failed

```json
{
  "success": false,
  "message": "File upload failed",
  "data": {
    "error": "Access denied"
  }
}
```

## Usage Examples

### Using cURL for Single File Upload

```bash
curl -X POST \
  http://localhost:3000/api/upload/single \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@/path/to/your/file.jpg" \
  -F "folder=images"
```

### Using cURL for Multiple File Upload

```bash
curl -X POST \
  http://localhost:3000/api/upload/multiple \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "files=@/path/to/file1.jpg" \
  -F "files=@/path/to/file2.pdf" \
  -F "folder=documents"
```

### Using JavaScript/Fetch

```javascript
// Single file upload
const formData = new FormData();
formData.append("file", fileInput.files[0]);
formData.append("folder", "images");

const response = await fetch("/api/upload/single", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
  },
  body: formData,
});

const result = await response.json();
console.log(result.data.url); // Public URL of uploaded file
```

## Security Considerations

1. **Authentication**: All endpoints require valid JWT tokens
2. **File Validation**: Files are validated for type and size
3. **Rate Limiting**: Consider implementing rate limiting for production
4. **CORS**: Configure CORS appropriately for your frontend domain
5. **Bucket Permissions**: Ensure your DigitalOcean Spaces bucket has appropriate permissions

## Troubleshooting

### Common Issues

1. **"DigitalOcean Spaces credentials not configured"**

   - Ensure all required environment variables are set
   - Check that the credentials are valid

2. **"Access denied" errors**

   - Verify your DigitalOcean Spaces access keys have proper permissions
   - Check that the bucket name is correct

3. **File upload failures**
   - Ensure the file type is supported
   - Check that the file size is within limits
   - Verify network connectivity to DigitalOcean Spaces

### Logs

The API logs all file upload activities. Check the application logs for detailed error information:

```bash
tail -f logs/combined.log
```
