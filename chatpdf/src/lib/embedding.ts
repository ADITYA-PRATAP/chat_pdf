import OpenAI from "openai";

// Initialize OpenAI with your API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure this is set in your environment
});

export const getEmbeddings = async (text: string): Promise<number[]> => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not defined in environment variables.");
    }

    const formattedText = text.replace(/\n/g, " ");

    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: formattedText,
    });

    const embedding = response.data[0]?.embedding;

    if (!embedding || embedding.length === 0) {
      throw new Error("No embedding data returned from OpenAI");
    }

    return embedding;
  } catch (error) {
    console.error("Error getting embeddings from OpenAI:", error);
    throw error;
  }
};
