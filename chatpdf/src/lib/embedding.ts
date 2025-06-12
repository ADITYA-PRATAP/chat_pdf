import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Generative Model with your Gemini API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export const getEmbeddings = async (text: string): Promise<number[]> => {
    try {
        // Ensure the API key is provided
        if (!process.env.GEMINI_API_KEY) {
            throw new Error("GEMINI_API_KEY is not defined in environment variables.");
        }

        // Get the embedding model (you'll need to specify a compatible model)
        // For text embeddings, typically "embedding-001" or similar is used.
        // Always refer to the latest Gemini API documentation for available embedding models.
        const model = genAI.getGenerativeModel({ model: "embedding-001" });

        // Replace newlines with spaces for better embedding quality
        const formattedText = text.replace(/\n/g, ' ');

        // Call the embedding API
        const result = await model.embedContent(formattedText);

        console.log("Embedding result:", result);
        // Extract the embedding vector
        const embedding = result.embedding.values;

        if (!embedding || embedding.length === 0) {
            throw new Error("No embedding data returned from Gemini API");
        }

        return embedding; // return the embedding vector as number[]
    } catch (error) {
        console.error("Error getting embeddings from Gemini:", error);
        throw error; // rethrow to handle it further up if needed
    }
};