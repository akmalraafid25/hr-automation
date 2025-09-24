import { NextRequest, NextResponse } from "next/server"
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

const s3Client = new S3Client({
  region: process.env.AWS_REGION || "ap-southeast-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
  }
})

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    
    const command = new GetObjectCommand({
      Bucket: 'hrtautomation-bucket',
      Key: `${id}`
    })
    
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 })

    return NextResponse.json({ url: signedUrl })
  } catch (error) {
    return NextResponse.json({ error: "Failed to generate signed URL" }, { status: 500 })
  }
}