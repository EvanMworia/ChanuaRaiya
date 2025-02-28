const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const crypto = require('crypto');
require('dotenv').config();

// Initialize S3 Client
const s3 = new S3Client({
	region: process.env.AWS_REGION,
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	},
});

// Generate a unique file name
const generateFileName = (originalName) => {
	const randomString = crypto.randomBytes(8).toString('hex');
	return `${Date.now()}-${randomString}-${originalName}`;
};

// Upload file to S3
const uploadToS3 = async (file, folder) => {
	const fileName = `${folder}/${generateFileName(file.originalname)}`;

	const uploadParams = {
		Bucket: process.env.S3_BUCKET_NAME,
		Key: fileName,
		Body: file.buffer,
		ContentType: file.mimetype,
	};

	try {
		await s3.send(new PutObjectCommand(uploadParams));
		return `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
	} catch (error) {
		console.error('S3 Upload Error:', error);
		throw new Error('Failed to upload file to S3');
	}
};

// Generate a presigned URL for file access
const getPresignedUrl = async (fileKey) => {
	try {
		const command = new GetObjectCommand({
			Bucket: process.env.S3_BUCKET_NAME,
			Key: fileKey,
		});

		return await getSignedUrl(s3, command, { expiresIn: 3600 }); // URL expires in 1 hour
	} catch (error) {
		console.error('Presigned URL Error:', error);
		throw new Error('Failed to generate presigned URL');
	}
};

module.exports = { uploadToS3, getPresignedUrl };
