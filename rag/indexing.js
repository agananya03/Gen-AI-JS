import 'dotenv/config'
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf"
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { QdrantVectorStore } from "@langchain/qdrant";

async function init() {
    const pdfFilePath = './AntiraggingAffidavitForm.pdf';
    const loader = new PDFLoader(pdfFilePath);
    const docs = await loader.load()  //Page by page load the pdf file

    //REady the client google gemini embedding model
    const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GEMINI_API_KEY,
    model: "text-embedding-004"
});

const vectorStore = await QdrantVectorStore.fromDocuments(docs, embeddings, {
    url: 'http://localhost:6333',
    collectionName: 'Gen_ai_collection'
    })
    console.log('Indexing of documents done...');
}

init();