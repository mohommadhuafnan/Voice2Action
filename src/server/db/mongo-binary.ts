import { randomUUID } from "crypto";
import { GridFSBucket, MongoClient } from "mongodb";

type BinaryFile = {
  buffer: Buffer;
  contentType: string;
};

let clientPromise: Promise<MongoClient> | null = null;

async function getMongoClient() {
  if (!clientPromise) {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error("DATABASE_URL is not configured.");
    }
    clientPromise = MongoClient.connect(databaseUrl);
  }

  return clientPromise;
}

async function getBucket() {
  const client = await getMongoClient();
  return new GridFSBucket(client.db(), { bucketName: "voice_uploads" });
}

export async function putBinaryFile(params: {
  key: string;
  contentType: string;
  payload: Buffer;
}) {
  const bucket = await getBucket();
  const files = await bucket.find({ filename: params.key }).toArray();

  if (files.length > 0) {
    await Promise.all(files.map((file) => bucket.delete(file._id)));
  }

  const uploadStream = bucket.openUploadStream(params.key, {
    metadata: {
      requestId: randomUUID(),
      contentType: params.contentType,
    },
  });

  await new Promise<void>((resolve, reject) => {
    uploadStream.on("finish", () => resolve());
    uploadStream.on("error", (error) => reject(error));
    uploadStream.end(params.payload);
  });
}

export async function getBinaryFile(key: string): Promise<BinaryFile | null> {
  const bucket = await getBucket();
  const file = await bucket.find({ filename: key }).sort({ uploadDate: -1 }).limit(1).next();

  if (!file) {
    return null;
  }

  const stream = bucket.openDownloadStream(file._id);
  const chunks: Buffer[] = [];

  const buffer = await new Promise<Buffer>((resolve, reject) => {
    stream.on("data", (chunk) => {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    });
    stream.on("error", (error) => reject(error));
    stream.on("end", () => resolve(Buffer.concat(chunks)));
  });

  return {
    buffer,
    contentType:
      (file.metadata as { contentType?: string } | null | undefined)?.contentType ??
      "application/octet-stream",
  };
}
