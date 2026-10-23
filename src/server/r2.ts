import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export interface PresignRequest {
  filename: string;
  mimeType: string;
  sizeBytes: number;
  workspaceId: string;
}

export interface PresignResponse {
  uploadId: string;
  objectKey: string;
  presignedPutUrl: string;
  publicReadUrl: string;
  expiresInSeconds: number;
  provider: 'cloudflare-r2' | 'cloudflare-r2-sandbox';
}

const accountId = process.env.R2_ACCOUNT_ID || 'demo-account-id';
const accessKeyId = process.env.R2_ACCESS_KEY_ID || 'demo-access-key';
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY || 'demo-secret-key';
const bucketName = process.env.R2_BUCKET_NAME || 'cadence-media';
const publicDomain = (process.env.R2_PUBLIC_DOMAIN || 'https://media.cadencestudio.app').replace(/\/$/, '');

const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

export async function createR2PresignedUpload(req: PresignRequest): Promise<PresignResponse> {
  const safeName = req.filename.toLowerCase().replace(/[^a-z0-9._-]/g, '-');
  const timestamp = Date.now();
  const objectKey = `workspaces/${req.workspaceId}/2026/10/${timestamp}-${safeName}`;
  const expiresInSeconds = 900;

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: objectKey,
    ContentType: req.mimeType,
    ContentLength: req.sizeBytes,
  });

  const presignedPutUrl = await getSignedUrl(r2Client, command, {
    expiresIn: expiresInSeconds,
  });

  const isConfigured =
    Boolean(process.env.R2_ACCOUNT_ID) &&
    process.env.R2_ACCOUNT_ID !== 'your_cloudflare_account_id';

  return {
    uploadId: `med_${timestamp}`,
    objectKey,
    presignedPutUrl,
    publicReadUrl: `${publicDomain}/${objectKey}`,
    expiresInSeconds,
    provider: isConfigured ? 'cloudflare-r2' : 'cloudflare-r2-sandbox',
  };
}
