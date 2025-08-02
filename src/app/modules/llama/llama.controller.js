import axios from 'axios';
import { ChromaClient } from 'chromadb';
import { embedWebsiteContent } from './rag.js';

// Updated ChromaDB client configuration for v2 API
const client = new ChromaClient({
  host: 'localhost',
  port: 8000,
  path: '/api/v2'  // Explicit v2 API path
});

const COLLECTION_NAME = 'docalert-website';

export const LlamaController = {
  askQuestion: async (req, res) => {
    try {
      const { message, model = 'llama3:8b' } = req.body;
      
      if (!message) {
        return res.status(400).json({ 
          success: false, 
          message: 'Missing message in request body' 
        });
      }

      // Initialize ChromaDB collection
      let collection;
      try {
        collection = await client.getOrCreateCollection({
          name: COLLECTION_NAME,
          metadata: { "hnsw:space": "cosine" }
        });
        
        const count = await collection.count();
        if (count === 0) {
          console.log('Embedding website content...');
          await embedWebsiteContent();
        }
      } catch (chromaError) {
        console.error('ChromaDB error:', chromaError);
        throw new Error('Failed to connect to ChromaDB. Please check if the server is running.');
      }

      // Query ChromaDB for relevant context
      const MAX_CONTEXT_CHARS = 1500;
      const queryResult = await collection.query({
        queryTexts: [message],
        nResults: 3,  // Increased for better context
      });

      const contextChunks = queryResult.documents?.[0] || [];
      const context = contextChunks
        .join('\n')
        .slice(0, MAX_CONTEXT_CHARS);

      // Call LLaMA via Ollama
      const llamaResponse = await axios.post('http://localhost:11434/api/chat', {
        model,
        messages: [
          {
            role: 'system',
            content: `You are an AI assistant for Docalert. Answer questions based on this context:
            ${context}\n\nIf the answer isn't in the context, say "I don't know".`
          },
          {
            role: 'user',
            content: message
          }
        ],
        stream: false,
        options: {
          temperature: 0.7,
          top_p: 0.9
        }
      });

      if (!llamaResponse.data?.message?.content) {
        throw new Error('LLaMA returned empty response');
      }

      return res.json({
        success: true,
        reply: llamaResponse.data.message.content.trim(),
        context: context // Optional: for debugging
      });

    } catch (error) {
      console.error('LLaMA Processing Error:', error);
      return res.status(500).json({
        success: false,
        message: 'Error during response generation',
        error: error.response?.data?.error || error.message,
        suggestion: 'Check ChromaDB and Ollama services are running'
      });
    }
  }
};