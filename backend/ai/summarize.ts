import { api, APIError } from "encore.dev/api";
import { secret } from "encore.dev/config";
import { medicalFilesBucket } from "../storage/files";

const openAIKey = secret("OpenAIAPIKey");

export interface SummarizeDocumentRequest {
  file_path: string;
  user_type: 'patient' | 'doctor';
  document_type?: string;
}

export interface SummarizeDocumentResponse {
  summary: string;
}

export interface SummarizeAllDocumentsRequest {
  file_paths: string[];
  document_titles: string[];
}

export interface SummarizeAllDocumentsResponse {
  combined_summary: string;
}

// Generates AI summary for a medical document.
export const summarizeDocument = api<SummarizeDocumentRequest, SummarizeDocumentResponse>(
  { expose: true, method: "POST", path: "/ai/summarize" },
  async (req) => {
    try {
      // Download the document content
      const documentBuffer = await medicalFilesBucket.download(req.file_path);
      const documentText = extractTextFromBuffer(documentBuffer, req.file_path);

      if (!documentText || documentText.trim().length === 0) {
        throw APIError.invalidArgument("Could not extract text from document");
      }

      const prompt = req.user_type === 'patient' 
        ? createPatientPrompt(documentText, req.document_type)
        : createDoctorPrompt(documentText, req.document_type);

      const summary = await callOpenAI(prompt);

      return { summary };
    } catch (error: any) {
      console.error('Summarization error:', error);
      if (error instanceof APIError) {
        throw error;
      }
      throw APIError.internal(`Failed to generate summary: ${error.message}`);
    }
  }
);

// Generates combined AI summary for multiple medical documents.
export const summarizeAllDocuments = api<SummarizeAllDocumentsRequest, SummarizeAllDocumentsResponse>(
  { expose: true, method: "POST", path: "/ai/summarize-all" },
  async (req) => {
    try {
      const documentContents: { title: string; content: string }[] = [];

      // Download and extract text from all documents
      for (let i = 0; i < req.file_paths.length; i++) {
        try {
          const documentBuffer = await medicalFilesBucket.download(req.file_paths[i]);
          const documentText = extractTextFromBuffer(documentBuffer, req.file_paths[i]);
          
          if (documentText && documentText.trim().length > 0) {
            documentContents.push({
              title: req.document_titles[i] || `Document ${i + 1}`,
              content: documentText
            });
          }
        } catch (error) {
          console.warn(`Failed to process document ${req.file_paths[i]}:`, error);
        }
      }

      if (documentContents.length === 0) {
        throw APIError.invalidArgument("No readable documents found");
      }

      const prompt = createCombinedSummaryPrompt(documentContents);
      const combinedSummary = await callOpenAI(prompt);

      return { combined_summary: combinedSummary };
    } catch (error: any) {
      console.error('Combined summarization error:', error);
      if (error instanceof APIError) {
        throw error;
      }
      throw APIError.internal(`Failed to generate combined summary: ${error.message}`);
    }
  }
);

function extractTextFromBuffer(buffer: Buffer, filePath: string): string {
  const fileName = filePath.toLowerCase();
  
  // For now, we'll handle simple text extraction
  // In a real implementation, you'd use libraries like pdf-parse for PDFs
  if (fileName.endsWith('.txt')) {
    return buffer.toString('utf-8');
  }
  
  // For PDFs and images, we'll return a placeholder
  // In production, you'd use proper OCR and PDF text extraction
  if (fileName.endsWith('.pdf')) {
    return `Medical document content from PDF file: ${filePath}. This document contains medical information that needs to be analyzed.`;
  }
  
  if (fileName.match(/\.(jpg|jpeg|png|gif)$/)) {
    return `Medical image document: ${filePath}. This appears to be a medical image or scan that may contain test results, X-rays, or other diagnostic information.`;
  }
  
  // Default fallback
  return `Medical document: ${filePath}. This document contains medical information that should be reviewed by healthcare professionals.`;
}

function createPatientPrompt(documentText: string, documentType?: string): string {
  return `You are a medical AI assistant helping patients understand their medical documents in simple, clear language. Please analyze the following medical document and provide a comprehensive summary that includes:

**Main Findings** (in simple, non-technical language)
**What This Means for You** (overall explanation in easy-to-understand terms)
**Lifestyle / Care Tips** (practical advice based on the findings)
**When to See a Doctor** (specific situations that warrant medical attention)

Important: Please add a note that this summary is only for understanding purposes, and patients should always consult with their doctor for proper medical advice and treatment decisions.

Document Type: ${documentType || 'Medical Document'}
Document Content: ${documentText}

Please provide a clear, empathetic, and easy-to-understand summary that helps the patient understand their health information without causing unnecessary worry.`;
}

function createDoctorPrompt(documentText: string, documentType?: string): string {
  return `You are a medical AI assistant providing technical summaries for healthcare professionals. Please analyze the following medical document and provide a concise clinical summary that includes:

**Key Parameters with Values** (marked as Normal/Abnormal where applicable)
**Clinical Impression** (2-3 lines of professional medical assessment)

Focus on clinically relevant information, abnormal findings, and key diagnostic indicators that would be important for medical decision-making.

Document Type: ${documentType || 'Medical Document'}
Document Content: ${documentText}

Provide a professional, technical summary suitable for healthcare providers.`;
}

function createCombinedSummaryPrompt(documents: { title: string; content: string }[]): string {
  const documentList = documents.map((doc, index) => 
    `Document ${index + 1}: ${doc.title}\nContent: ${doc.content}\n`
  ).join('\n---\n');

  return `You are a medical AI assistant providing a comprehensive clinical overview for healthcare professionals. Please analyze all the following medical documents and provide a combined summary that includes:

**Individual Document Summaries** (key points from each document)
**Overall Clinical Impression** (comprehensive assessment based on all documents)
**Notable Patterns or Trends** (if any patterns emerge across documents)
**Clinical Recommendations** (if any follow-up or monitoring suggestions)

Documents to analyze:
${documentList}

Provide a comprehensive but concise summary that gives healthcare providers a complete picture of the patient's medical status based on all available documents.`;
}

async function callOpenAI(prompt: string): Promise<string> {
  const apiKey = openAIKey();
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful medical AI assistant that provides clear, accurate, and appropriate medical document summaries.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 1000,
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`OpenAI API error: ${response.status} ${errorData}`);
  }

  const data = await response.json();
  
  if (!data.choices || !data.choices[0] || !data.choices[0].message) {
    throw new Error('Invalid response from OpenAI API');
  }

  return data.choices[0].message.content.trim();
}
