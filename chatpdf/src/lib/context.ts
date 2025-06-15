
import { getPineconeClient } from "./pinecone";
import { convertToAscii } from "./utils";
import { getEmbeddings } from "./embedding";
export async function getMatchesFromEmbeddings(embeddings:number[],filekey:string){
    const pineCone= getPineconeClient();

    const index = pineCone.index('chatpdf-aditya-1536',"chatpdf-aditya-1536-oucbank.svc.aped-4627-b74a.pinecone.io"); // make sure this host is correct

    try {
        const namespace = convertToAscii(filekey);
        const queryResult = index.namespace(namespace).query({
            vector: embeddings,
            topK: 10,
            includeMetadata: true,
            includeValues: false,
        })
        return (await queryResult).matches || []
        
    } catch (error) {
        console.error('Error getting matches from embeddings:', error);
        throw error;
        
    }
}



export async function getContext(query:string,filekey:string){
    const queryEmbeddings = await getEmbeddings(query);
    const matches = await getMatchesFromEmbeddings(queryEmbeddings,filekey);

    const qualifyingDocs = matches.filter((match)=>
        match.score  && match.score > 0.3
    )

    type Metadata = {
        text: string;
        pageNumber: number;
      };

      let docs = qualifyingDocs.map((match)=> (match.metadata as Metadata).text);
      

    return docs.join('\n').substring(0,3000)

 


} 