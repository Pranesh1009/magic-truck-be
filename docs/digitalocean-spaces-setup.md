# DigitalOcean Spaces Setup Guide

This guide will help you set up DigitalOcean Spaces for file uploads in your MagicTruck application.

## Prerequisites

1. A DigitalOcean account
2. Access to DigitalOcean Spaces service

## Step 1: Create a DigitalOcean Spaces Bucket

1. Log in to your DigitalOcean account
2. Navigate to **Spaces** in the left sidebar
3. Click **Create a Space**
4. Choose your preferred region (e.g., NYC3)
5. Choose a unique name for your bucket
6. Set the file listing to **Public** (if you want files to be publicly accessible)
7. Click **Create a Space**

## Step 2: Create API Keys

1. In your DigitalOcean dashboard, go to **API** in the left sidebar
2. Click **Generate New Token**
3. Give your token a name (e.g., "MagicTruck File Upload")
4. Select **Write** scope for full access
5. Click **Generate Token**
6. **Important**: Copy and save the token immediately - you won't be able to see it again

## Step 3: Configure Environment Variables

Add the following environment variables to your `.env` file:

```env
# DigitalOcean Spaces Configuration
DO_SPACES_ACCESS_KEY_ID=your_access_key_id
DO_SPACES_SECRET_ACCESS_KEY=your_secret_access_key
DO_SPACES_BUCKET_NAME=your_bucket_name
DO_SPACES_REGION=nyc3  # Replace with your chosen region
```

### Example:

```env
DO_SPACES_ACCESS_KEY_ID=DO00ABC123DEF456
DO_SPACES_SECRET_ACCESS_KEY=abc123def456ghi789jkl012mno345pqr678stu901vwx234yz
DO_SPACES_BUCKET_NAME=magictruck-uploads
DO_SPACES_REGION=nyc3
```

## Step 4: Configure Bucket Permissions

### For Public Access (Recommended for most use cases):

1. Go to your Spaces bucket in the DigitalOcean dashboard
2. Click on **Settings** tab
3. Under **File Listing**, ensure it's set to **Public**
4. Under **CORS Configurations**, add the following configuration:

```json
[
  {
    "AllowedOrigins": ["*"],
    "AllowedMethods": ["GET", "POST", "PUT", "DELETE"],
    "AllowedHeaders": ["*"],
    "MaxAgeSeconds": 3000
  }
]
```

### For Private Access:

If you want to keep files private, you can skip the CORS configuration, but you'll need to use presigned URLs for file access.

## Step 5: Test the Configuration

1. Start your application:

   ```bash
   npm run dev
   ```

2. Test the file upload functionality using the provided test script:

   ```bash
   node src/test-file-upload.js
   ```

   **Note**: Update the `JWT_TOKEN` in the test file with a valid token before running.

## Step 6: Verify Uploads

1. After successful uploads, check your DigitalOcean Spaces bucket
2. You should see uploaded files in the specified folders
3. Files should be accessible via their public URLs

## Troubleshooting

### Common Issues:

1. **"Access denied" errors**

   - Verify your API keys are correct
   - Ensure the bucket name matches exactly
   - Check that your API token has the correct permissions

2. **"Bucket not found" errors**

   - Double-check the bucket name spelling
   - Ensure the region matches your bucket's region

3. **CORS errors in browser**

   - Verify CORS configuration in your bucket settings
   - Check that the allowed origins include your frontend domain

4. **File upload timeouts**
   - Check your network connection
   - Verify the file size is within limits (10MB per file)
   - Consider increasing timeout settings if needed

### Testing with cURL:

```bash
# Test single file upload
curl -X POST \
  http://localhost:3000/api/upload/single \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@/path/to/test.jpg" \
  -F "folder=test"
```

## Security Best Practices

1. **Rotate API Keys Regularly**: Change your DigitalOcean API keys periodically
2. **Use Environment Variables**: Never hardcode credentials in your code
3. **Limit File Types**: The API already filters file types, but review the allowed types
4. **Monitor Usage**: Keep track of your DigitalOcean Spaces usage and costs
5. **Backup Strategy**: Consider implementing a backup strategy for important files

## Cost Considerations

DigitalOcean Spaces pricing:

- Storage: \$0.02 per GB per month
- Bandwidth: \$0.01 per GB for outbound transfers
- No charges for inbound transfers

Monitor your usage in the DigitalOcean dashboard to avoid unexpected charges.

## Next Steps

Once your DigitalOcean Spaces is configured:

1. Test all file upload endpoints
2. Integrate file uploads into your frontend application
3. Implement file management features (delete, list, etc.)
4. Consider implementing image resizing for uploaded images
5. Add file validation and virus scanning if needed

For more information, refer to the [DigitalOcean Spaces documentation](https://docs.digitalocean.com/products/spaces/).
