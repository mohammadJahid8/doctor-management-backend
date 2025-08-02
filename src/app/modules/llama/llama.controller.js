import axios from 'axios';
import { ChromaClient } from 'chromadb';
import { embedWebsiteContent } from './rag.js';

const client = new ChromaClient({
  host: 'localhost',
  port: 8000,
  ssl: false
});
const COLLECTION_NAME = 'docalert-website';

export const LlamaController = {
  askQuestion: async (req, res) => {
    try {
      const { message } = req.body;
      if (!message) {
        return res.status(400).json({ success: false, message: 'Missing message in body' });
      }

      // Ensure content is embedded (optional: put behind a flag or cron job)
      const collection = await client.getOrCreateCollection({ name: COLLECTION_NAME });
      const count = await collection.count();

      if (count === 0) {
        console.log('Embedding website content...');
        await embedWebsiteContent();
      }

      // Query ChromaDB for similar chunks
      const queryResult = await collection.query({
        queryTexts: [message],
        nResults: 1, // Fewer results for faster response
      });

      const MAX_CONTEXT_CHARS = 1500;
      const contextChunks = queryResult.documents?.[0] || [];
      const context = contextChunks.join('\n').slice(0, MAX_CONTEXT_CHARS);

      // Call LLaMA3 via Ollama API
      const llamaResponse = await axios.post('http://localhost:11434/api/chat', {
        model: 'llama3:8b',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant answering questions based on the following website context.',
          },
          {
            role: 'user',
            content: `Context:\n${context}\n\nQuestion:\n${message}`,
          },
        ],
        stream: false,
      });

      const reply = llamaResponse.data.message?.content || 'No reply generated.';

      return res.status(200).json({
        success: true,
        reply,
      });
    } catch (error) {
      console.error('❌ LlamaController error:', error.message);
      return res.status(500).json({
        success: false,
        message: 'Error during LLaMA response generation.',
        error: error.message,
      });
    }
  },
};
