import { PineconeClient } from '@pinecone-database/pinecone';
import { downloadFileFromS3 } from "./s3-server";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

let pinecone: PineconeClient | null = null;

export const getPineconeClient = async () => {
  if (!pinecone) {
    pinecone = new PineconeClient();
    await pinecone.init({
      apiKey: process.env.PINECONE_API_KEY || '',
      environment: process.env.PINECONE_ENVIRONMENT || '',
    });
  }
  return pinecone;
}


export async function loadS3IntoPinecone(filekey: string) {
  try {
    console.log('Loading S3 file into Pinecone:', filekey);
    
    const fileName = await downloadFileFromS3(filekey);
    
    if (!fileName) {
      throw new Error('Failed to download PDF file from S3');
    }

    const loader = new PDFLoader(fileName);
    const pages = await loader.load();

    return pages;
  } catch (error) {
    console.error('Error loading file into Pinecone:', error);
    throw error; // rethrow to handle it further up if needed
  }
}
