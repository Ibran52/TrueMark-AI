
export enum AnalysisStatus {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export interface AnalysisDetails {
  title: string;
  description: string;
  isPositive: boolean;
}

export interface VerificationResult {
  isGenuine: boolean;
  confidenceScore: number;
  imageAnalysis: AnalysisDetails;
  barcodeAnalysis: AnalysisDetails;
  textAnalysis: AnalysisDetails;
}

export interface ChatMessage {
  id: number;
  sender: 'user' | 'ai';
  text: string;
}

export interface HistoryItem extends VerificationResult {
  id: number; // Unique ID, can be a timestamp
  type: 'image' | 'code';
  imagePreview: string | null; // The image used for verification, can be a data URL or a placeholder
}
