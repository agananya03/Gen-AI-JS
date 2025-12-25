import 'dotenv/config'
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf"
import { CohereEmbeddings } from "@langchain/cohere";
import { QdrantVectorStore } from "@langchain/qdrant";

async function init() {
    const pdfFilePath = './m8BigBang.pdf';
    const loader = new PDFLoader(pdfFilePath);
    const docs = await loader.load()  //Page by page load the pdf file

    //REady the client google gemini embedding model
    const embeddings = new CohereEmbeddings({
        apiKey: process.env.COHERE_API_KEY,
        model: "embed-english-v3.0", // or "embed-multilingual-v3.0"
    });

const vectorStore = await QdrantVectorStore.fromDocuments(docs, embeddings, {
    url: 'http://localhost:6333',
    collectionName: 'Gen_aicollection'
    })
    console.log('Indexing of documents done...');
}

init();