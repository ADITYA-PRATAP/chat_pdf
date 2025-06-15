// ✅ Type import
import { Pinecone } from '@pinecone-database/pinecone';
import { downloadFileFromS3 } from "./s3-server";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { Document, RecursiveCharacterTextSplitter } from "@pinecone-database/doc-splitter";
import { getEmbeddings } from './embedding';
import md5 from 'md5';
import { convertToAscii } from './utils';

type Vector = {
  id: string;
  values: number[];
  metadata?: Record<string, any>;
};
let pinecone: Pinecone | null = null;

// Splits an array into chunks

// Helper to chunk array into pieces of size chunkSize
function chunkArray<T>(array: T[], chunkSize: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }
  return result;
}

interface Vector {
  id: string;
  values: number[];
  metadata?: Record<string, any>;
}

/**
 * Uploads `vectors` to `index` in chunks.
 * Ensures chunks are valid and logs progress.
 */
export async function chunkedUpsert(
  index: ReturnType<Pinecone["index"]>,
  vectors: Vector[],
  namespace: string,
  chunkSize = 100
): Promise<void> {
  if (!Array.isArray(vectors)) {
    throw new TypeError("Expected vectors to be an array");
  }

  const chunks = chunkArray(vectors, chunkSize);
 

  for (const [i, chunk] of chunks.entries()) {
    // console.log(`→ Upserting chunk ${i + 1}/${chunks.length} (${chunk.length} vectors)…`);
    try {
      await index.namespace(namespace).upsert(chunk);
    } catch (err) {
      console.error(`❌ Failed to upsert chunk ${i + 1}:`, err);
      throw err;
    }
  }
}





export const getPineconeClient = () => {
  if (!pinecone) {
    pinecone = new Pinecone({
      apiKey: process.env.PINECONE_VALUE || "",
    });
  }
  return pinecone;
};


type PDFPage = {
  pageContent: string;
  metadata: {
    loc:{
      pageNumber: number;
    }
  };
};

export async function loadS3IntoPinecone(filekey: string) {
  try {
    // console.log('Loading S3 file into Pinecone:', filekey);

    // 1. Download PDF from S3
    const fileName = await downloadFileFromS3(filekey);
    if (!fileName) throw new Error('Failed to download PDF file from S3');

    // 2. Load all pages from the PDF
    const loader = new PDFLoader(fileName);
    const pages = (await loader.load()) as PDFPage[];

    // 3. Split & segment each page into Document chunks
    const docsPerPage = await Promise.all(pages.map(prepareDocument));
    const allDocs = docsPerPage.flat();

    // 4. Embed each document into a vector
    const vectors: Vector[] = await Promise.all(allDocs.map(embedDocument));

    // console.log(`✅ Generated ${vectors.length} vectors`);

    // 5. Initialize Pinecone client and index
    const client = getPineconeClient();
    const index = client.index('chatpdf-aditya-1536',"chatpdf-aditya-1536-oucbank.svc.aped-4627-b74a.pinecone.io"); // make sure this host is correct

    // 6. Define namespace
    const namespace = convertToAscii(filekey);

    // 7. Chunk and upsert
    const chunks = chunkArray(vectors, 200);
   for (const [i, chunk] of chunks.entries()) {
  // console.log(`→ Upserting chunk ${i + 1}/${chunks.length} (${chunk.length} vectors)…`);
  await index.namespace(namespace).upsert(
    chunk.map((v) => ({
      id: v.id,       // Correct property here
      values: v.values,
      metadata: v.metadata,
    }))
  );
}


    // console.log('✅ All chunks upserted successfully.');
    return docsPerPage[0]; // return first page or as needed
  } catch (error) {
    console.error('❌ Error loading file into Pinecone:', error);
    throw error;
  }
}

async function embedDocument(doc:Document){
  try {
    const embeddings = await getEmbeddings(doc.pageContent);
    const hash = md5(doc.pageContent);
    return {
      id: hash,
      values: embeddings,
      metadata: {
        text: doc.metadata.text,
        pageNumber: doc.metadata.pageNumber,
      }

    } as Vector;

  } catch (error) {
    console.error('Error embedding document:', error);
    throw error; // rethrow to handle it further up if needed
  }
}
export const truncateStringBytes = (str: string, maxBytes: number): string => {
  const enc =new TextEncoder();
  return new TextDecoder('utf-8').decode(
    enc.encode(str).slice(0, maxBytes)
  );
}

async function prepareDocument(page:PDFPage) {
  let { pageContent, metadata } = page;
  pageContent = pageContent.replace(/\n/g, ' ')

  const splitter = new RecursiveCharacterTextSplitter();

  const docs = await splitter.splitDocuments([
    new Document({
      pageContent,
      metadata: {
        pageNumber: metadata.loc.pageNumber,
        text: truncateStringBytes(pageContent, 36000) // truncate to 1000 bytes
      }
    })
  ]);

  return docs;

}