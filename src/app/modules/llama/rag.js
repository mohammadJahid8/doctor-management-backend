import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

const axios = require('axios');
const cheerio = require('cheerio');
import { ChromaClient } from 'chromadb';

const client = new ChromaClient({ path: 'http://localhost:8000' });

const WEBSITE_URL = 'https://www.docalert.in/';
const COLLECTION_NAME = 'docalert-website';

// Helper: fetch & extract text from URL
async function scrapeWebsite(url) {
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);

  // Extract text content from body
  let text = $('body').text();
  text = text.replace(/\s+/g, ' ').trim();

  // Chunk into smaller parts
  const chunkSize = 1000;
  const chunks = [];
  for (let i = 0; i < text.length; i += chunkSize) {
    chunks.push(text.slice(i, i + chunkSize));
  }

  return chunks;
}

export async function embedWebsiteContent() {
  try {
    // Connect to or create collection
    const collection = await client.getOrCreateCollection({
      name: COLLECTION_NAME,
    });

    const chunks = await scrapeWebsite(WEBSITE_URL);

    console.log(`✅ Scraped ${chunks.length} chunks from ${WEBSITE_URL}`);

    // Embed each chunk with unique ID
    const ids = chunks.map((_, i) => `doc-${i + 1}`);
    await collection.add({
      ids,
      documents: chunks,
    });

    console.log(`✅ Embedded ${chunks.length} chunks into ChromaDB`);
  } catch (error) {
    console.error('❌ Error in embedWebsiteContent:', error);
  }
}
