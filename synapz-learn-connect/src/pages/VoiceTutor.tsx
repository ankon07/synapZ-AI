import { useState, useEffect, useRef } from 'react';
import { Mic, Camera, HelpCircle, ChevronLeft, ChevronRight, Volume2, StopCircle, Upload, FileText, Lightbulb, BookOpen, Loader2, X, FileImage } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MainLayout from '@/components/layout/MainLayout';
import SpeechService from '@/lib/speechService';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { toast } from 'sonner';
import * as pdfjsLib from 'pdfjs-dist';
import * as mammoth from 'mammoth';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

interface Lesson {
  id: number;
  title: string;
  content: string;
  totalSteps: number;
  currentStep: number;
}

interface DocumentAnalysis {
  extractedText: string;
  completeDetails: string;
  keyPoints: string[];
  summary: string;
}

const VoiceTutor = () => {
  const [currentLesson, setCurrentLesson] = useState<Lesson>({
    id: 1,
    title: 'Email Writing',
    content: 'Learn how to write professional emails effectively.',
    totalSteps: 4,
    currentStep: 3,
  });

  const [isListening, setIsListening] = useState(false);
  const [speakingSection, setSpeakingSection] = useState<string | null>(null);
  const [transcript, setTranscript] = useState('');
  const [lessonText, setLessonText] = useState('Welcome to your voice lesson. Let\'s learn about writing emails.');
  const [ocrText, setOcrText] = useState('Example text: Please write an email to your teacher.\nYou can request an extension for your homework.');
  const [loading, setLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [documentAnalysis, setDocumentAnalysis] = useState<DocumentAnalysis | null>(null);
  const [analyzingDocument, setAnalyzingDocument] = useState(false);
  const [activeTab, setActiveTab] = useState<'lesson' | 'document'>('lesson');
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  
  const speechServiceRef = useRef<SpeechService | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Initialize speech service
    speechServiceRef.current = new SpeechService({
      language: 'en-US',
      onResult: (result) => {
        setTranscript(result.transcript);
        if (result.isFinal) {
          handleSpeechResult(result.transcript);
        }
      },
      onEnd: () => {
        setIsListening(false);
      },
      onError: (error) => {
        console.error('Speech error:', error);
        setIsListening(false);
        toast.error('Speech recognition error. Please try again.');
      },
    });

    // Generate initial lesson content
    generateLessonContent();

    return () => {
      speechServiceRef.current?.stopListening();
      speechServiceRef.current?.stopSpeaking();
      stopCamera();
    };
  }, []);

  const generateLessonContent = async () => {
    try {
      setLoading(true);
      // Try multiple models with fallback
      const models = ['gemini-1.5-flash', 'gemini-2.5-flash', 'gemini-1.5-pro'];
      
      for (const modelName of models) {
        try {
          const model = genAI.getGenerativeModel({ model: modelName });
          
          const prompt = `Generate a short, clear lesson about ${currentLesson.title} for students. 
          The lesson should be:
          - Easy to understand (2-3 sentences)
          - Practical and actionable
          - Suitable for voice reading
          
          Just provide the lesson text without any formatting or labels.`;

          const result = await model.generateContent(prompt);
          const response = await result.response;
          const text = response.text();
          
          setLessonText(text);
          toast.success('Lesson content generated');
          return; // Success, exit the function
        } catch (modelError) {
          console.warn(`Model ${modelName} failed, trying next...`, modelError);
          continue; // Try next model
        }
      }
      
      // If all models fail, use fallback content
      throw new Error('All models failed');
      
    } catch (error) {
      console.error('Error generating lesson:', error);
      
      // Fallback lesson content
      const fallbackLessons: Record<string, string> = {
        'Email Writing': 'Email writing is an essential skill in today\'s digital world. A good email should have a clear subject line, a polite greeting, and a concise message body. Always proofread before sending and use professional language when writing to teachers or employers.',
        'default': `Let's learn about ${currentLesson.title}. This is an important skill that will help you in many situations. Practice regularly and don't be afraid to ask questions when you need help.`
      };
      
      setLessonText(fallbackLessons[currentLesson.title] || fallbackLessons['default']);
      toast.warning('Using offline lesson content');
    } finally {
      setLoading(false);
    }
  };

  const handleSpeechResult = async (text: string) => {
    console.log('Received speech:', text);
    
    // Check if user wants help
    if (text.toLowerCase().includes('help')) {
      await provideFeedback('I can help you with the lesson. Try saying "start lesson" to begin or "repeat" to hear it again.');
      return;
    }

    // Check if user wants to repeat
    if (text.toLowerCase().includes('repeat')) {
      await speakLesson();
      return;
    }

    // Check if user wants to start
    if (text.toLowerCase().includes('start')) {
      await speakLesson();
      return;
    }

    // Otherwise, provide feedback using Gemini
    await provideFeedback(`You said: "${text}". That's great! Keep practicing.`);
  };

  const provideFeedback = async (feedbackText: string) => {
    try {
      await speechServiceRef.current?.speak(feedbackText);
      toast.success('Feedback provided');
    } catch (error) {
      console.error('Error providing feedback:', error);
    }
  };

  const speakLesson = async () => {
    if (!speechServiceRef.current) return;

    try {
      setSpeakingSection('lesson');
      await speechServiceRef.current.speak(lessonText, { rate: 0.9 });
      setSpeakingSection(null);
      toast.success('Lesson completed');
    } catch (error) {
      console.error('Error speaking:', error);
      setSpeakingSection(null);
      toast.error('Failed to speak lesson');
    }
  };

  const toggleListening = () => {
    if (!speechServiceRef.current) return;

    if (isListening) {
      speechServiceRef.current.stopListening();
      setIsListening(false);
    } else {
      setTranscript('');
      speechServiceRef.current.startListening();
      setIsListening(true);
      toast.info('Listening... Speak now');
    }
  };

  const stopSpeaking = () => {
    speechServiceRef.current?.stopSpeaking();
    setSpeakingSection(null);
  };

  const readOCRText = async () => {
    if (!speechServiceRef.current) return;

    try {
      setSpeakingSection('ocr');
      await speechServiceRef.current.speak(ocrText, { rate: 0.9 });
      setSpeakingSection(null);
    } catch (error) {
      console.error('Error reading OCR text:', error);
      setSpeakingSection(null);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a PDF, DOC, DOCX, or TXT file');
      return;
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    setUploadedFile(file);
    toast.success('File uploaded successfully!');
    await analyzeDocument(file);
  };

  const analyzeDocument = async (file: File) => {
    try {
      setAnalyzingDocument(true);
      toast.info('Analyzing document with Gemini AI...');

      // Try multiple models with fallback
      const models = ['gemini-1.5-flash', 'gemini-2.0-flash-exp', 'gemini-1.5-pro'];
      
      // For PDFs and images, use Gemini Vision API
      if (file.type === 'application/pdf') {
        // Convert PDF to base64 for Gemini Vision
        const arrayBuffer = await file.arrayBuffer();
        const base64Data = btoa(
          new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
        );

        for (const modelName of models) {
          try {
            const model = genAI.getGenerativeModel({ model: modelName });
            
            const pdfPart = {
              inlineData: {
                data: base64Data,
                mimeType: 'application/pdf'
              }
            };

            const prompt = `Carefully analyze this PDF document and extract ALL the text content. Then provide a detailed analysis.

Please format your response as:

EXTRACTED TEXT:
[Write out ALL the text from the document exactly as it appears, word for word. This is the most important part - include EVERYTHING you can read from the PDF]

COMPLETE DETAILS:
[Provide a comprehensive analysis and summary of the document content in 3-4 paragraphs]

KEY POINTS:
- [Extract 5-7 key points or main ideas from the document]
- [point 2]
- [point 3]
...

SUMMARY:
[Brief 2-3 sentence overview of the document]`;

            const result = await model.generateContent([prompt, pdfPart]);
            const response = await result.response;
            const text = response.text();
            
            // Extract the text section specifically
            const extractedTextMatch = text.match(/EXTRACTED TEXT:?\s*([\s\S]*?)(?=COMPLETE DETAILS:|$)/i);
            const extractedText = extractedTextMatch?.[1]?.trim() || '';
            
            // Parse the response
            const analysis = parseAnalysisResponse(text, extractedText);
            setDocumentAnalysis(analysis);
            setActiveTab('document');
            toast.success('PDF analyzed successfully with Gemini AI!');
            return;
          } catch (modelError) {
            console.warn(`Model ${modelName} failed, trying next...`, modelError);
            continue;
          }
        }
      }
      
      // For text-based files (TXT, DOCX), extract text first then analyze
      else {
        toast.info('Extracting text from document...');
        const fileContent = await readFileContent(file);
        
        if (!fileContent || fileContent.trim().length === 0) {
          throw new Error('No text content found in document');
        }

        toast.info('Analyzing with Gemini AI...');

        for (const modelName of models) {
          try {
            const model = genAI.getGenerativeModel({ model: modelName });
            
            const prompt = `Here is the complete text content from a document. Please analyze it and provide:

Document text:
${fileContent.substring(0, 30000)}

Please format your response as:

COMPLETE DETAILS:
[Provide a comprehensive, detailed analysis of the content in 3-4 paragraphs]

KEY POINTS:
- [Extract 5-7 key points or main ideas]
- [point 2]
- [point 3]
...

SUMMARY:
[Brief 2-3 sentence overview]`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            
            // Parse the response with extracted text
            const analysis = parseAnalysisResponse(text, fileContent);
            setDocumentAnalysis(analysis);
            setActiveTab('document');
            toast.success('Document analyzed successfully with Gemini AI!');
            return;
          } catch (modelError) {
            console.warn(`Model ${modelName} failed, trying next...`, modelError);
            continue;
          }
        }
      }
      
      throw new Error('All AI models failed');
      
    } catch (error) {
      console.error('Error analyzing document:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to analyze document with AI');
      
      // Try to show at least the extracted text if available
      try {
        const fileContent = await readFileContent(file);
        setDocumentAnalysis({
          extractedText: fileContent,
          completeDetails: `Document text extracted successfully from ${file.name}. AI analysis is temporarily unavailable, but you can read the extracted text above.`,
          keyPoints: [
            'Document text extracted successfully',
            'AI analysis temporarily unavailable',
            'You can still read the extracted content',
            'Try again later for full analysis'
          ],
          summary: 'Text extraction successful, AI analysis pending.'
        });
        setActiveTab('document');
      } catch (extractError) {
        setDocumentAnalysis({
          extractedText: '',
          completeDetails: `Unable to process ${file.name}. Please ensure the document is not corrupted and is in a supported format (PDF, DOCX, TXT).`,
          keyPoints: [
            'Document processing failed',
            'Check document format and integrity',
            'Supported formats: PDF, DOCX, DOC, TXT',
            'Try a different document'
          ],
          summary: 'Document processing failed.'
        });
        setActiveTab('document');
      }
    } finally {
      setAnalyzingDocument(false);
    }
  };

  const readFileContent = async (file: File): Promise<string> => {
    try {
      // Handle text files
      if (file.type === 'text/plain') {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.onerror = () => reject(new Error('Failed to read text file'));
          reader.readAsText(file);
        });
      }
      
      // Handle PDF files
      if (file.type === 'application/pdf') {
        return await extractTextFromPDF(file);
      }
      
      // Handle DOCX files
      if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        return await extractTextFromDOCX(file);
      }
      
      // Handle DOC files (legacy format - limited support)
      if (file.type === 'application/msword') {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            const content = e.target?.result as string;
            // Basic text extraction for DOC (not perfect)
            resolve(content.replace(/[^\x20-\x7E\n]/g, ''));
          };
          reader.onerror = () => reject(new Error('Failed to read DOC file'));
          reader.readAsText(file);
        });
      }
      
      throw new Error('Unsupported file type');
    } catch (error) {
      console.error('Error reading file:', error);
      throw error;
    }
  };

  const extractTextFromPDF = async (file: File): Promise<string> => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';
      
      // Extract text from each page
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        fullText += pageText + '\n\n';
      }
      
      return fullText.trim();
    } catch (error) {
      console.error('Error extracting PDF text:', error);
      throw new Error('Failed to extract text from PDF');
    }
  };

  const extractTextFromDOCX = async (file: File): Promise<string> => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      return result.value;
    } catch (error) {
      console.error('Error extracting DOCX text:', error);
      throw new Error('Failed to extract text from DOCX');
    }
  };

  const parseAnalysisResponse = (text: string, extractedText: string = ''): DocumentAnalysis => {
    const completeDetailsMatch = text.match(/COMPLETE DETAILS:?\s*([\s\S]*?)(?=KEY POINTS:|$)/i);
    const keyPointsMatch = text.match(/KEY POINTS:?\s*([\s\S]*?)(?=SUMMARY:|$)/i);
    const summaryMatch = text.match(/SUMMARY:?\s*([\s\S]*?)$/i);
    
    const completeDetails = completeDetailsMatch?.[1]?.trim() || text;
    const keyPointsText = keyPointsMatch?.[1]?.trim() || '';
    const summary = summaryMatch?.[1]?.trim() || 'Document analyzed successfully.';
    
    // Extract bullet points
    const keyPoints = keyPointsText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.startsWith('-') || line.startsWith('•') || line.startsWith('*'))
      .map(line => line.replace(/^[-•*]\s*/, '').trim())
      .filter(line => line.length > 0);
    
    // If no bullet points found, create some from the text
    if (keyPoints.length === 0) {
      const sentences = completeDetails.split('.').filter(s => s.trim().length > 20);
      keyPoints.push(...sentences.slice(0, 5).map(s => s.trim()));
    }
    
    return {
      extractedText,
      completeDetails,
      keyPoints: keyPoints.slice(0, 7), // Limit to 7 points
      summary
    };
  };

  const speakCompleteDetails = async () => {
    if (!documentAnalysis || !speechServiceRef.current) return;

    try {
      setSpeakingSection('completeDetails');
      await speechServiceRef.current.speak(documentAnalysis.completeDetails, { rate: 0.9 });
      setSpeakingSection(null);
      toast.success('Finished reading complete details');
    } catch (error) {
      console.error('Error speaking:', error);
      setSpeakingSection(null);
      toast.error('Failed to read content');
    }
  };

  const speakKeyPoints = async () => {
    if (!documentAnalysis || !speechServiceRef.current) return;

    try {
      setSpeakingSection('keyPoints');
      const keyPointsText = 'Here are the key points: ' + 
        documentAnalysis.keyPoints.map((point, index) => 
          `Point ${index + 1}: ${point}`
        ).join('. ');
      
      await speechServiceRef.current.speak(keyPointsText, { rate: 0.9 });
      setSpeakingSection(null);
      toast.success('Finished reading key points');
    } catch (error) {
      console.error('Error speaking:', error);
      setSpeakingSection(null);
      toast.error('Failed to read key points');
    }
  };

  const speakSummary = async () => {
    if (!documentAnalysis || !speechServiceRef.current) return;

    try {
      setSpeakingSection('summary');
      await speechServiceRef.current.speak(documentAnalysis.summary, { rate: 0.9 });
      setSpeakingSection(null);
      toast.success('Finished reading summary');
    } catch (error) {
      console.error('Error speaking:', error);
      setSpeakingSection(null);
      toast.error('Failed to read summary');
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' },
        audio: false 
      });
      setCameraStream(stream);
      setIsCameraActive(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      toast.success('Camera activated');
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast.error('Failed to access camera. Please grant camera permissions.');
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
      setIsCameraActive(false);
      
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      
      toast.info('Camera stopped');
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Get image data as base64
    const imageData = canvas.toDataURL('image/jpeg');
    setCapturedImage(imageData);
    
    // Stop camera after capture
    stopCamera();
    
    toast.success('Photo captured successfully!');
    
    // Convert to blob and analyze
    canvas.toBlob(async (blob) => {
      if (blob) {
        // Create a file from the blob
        const file = new File([blob], 'captured-image.jpg', { type: 'image/jpeg' });
        await analyzeImageDocument(file, imageData);
      }
    }, 'image/jpeg');
  };

  const analyzeImageDocument = async (file: File, imageDataUrl: string) => {
    try {
      setAnalyzingDocument(true);
      toast.info('Analyzing captured image with OCR...');

      // Try multiple models with fallback
      const models = ['gemini-1.5-flash', 'gemini-2.0-flash-exp', 'gemini-1.5-pro'];
      
      for (const modelName of models) {
        try {
          const model = genAI.getGenerativeModel({ model: modelName });
          
          // Convert base64 to proper format for Gemini
          const base64Data = imageDataUrl.split(',')[1];
          
          const imagePart = {
            inlineData: {
              data: base64Data,
              mimeType: 'image/jpeg'
            }
          };

          const prompt = `Carefully analyze this image and perform OCR (Optical Character Recognition) to extract ALL visible text. Then provide:

1. EXTRACTED TEXT: Write out ALL text visible in the image exactly as it appears (this is the most important part)
2. DETAILED DESCRIPTION: Describe what you see in detail (objects, layout, context)
3. KEY POINTS: List 5-7 important observations or extracted information points
4. SUMMARY: Brief 2-3 sentence overview

Format your response as:
EXTRACTED TEXT:
[write all visible text here exactly as it appears]

COMPLETE DETAILS:
[detailed description of image and context]

KEY POINTS:
- [point 1]
- [point 2]
- [point 3]
...

SUMMARY:
[brief overview]`;

          const result = await model.generateContent([prompt, imagePart]);
          const response = await result.response;
          const text = response.text();
          
          // Extract the text section specifically
          const extractedTextMatch = text.match(/EXTRACTED TEXT:?\s*([\s\S]*?)(?=COMPLETE DETAILS:|$)/i);
          const extractedText = extractedTextMatch?.[1]?.trim() || 'No text detected in image';
          
          // Parse the response
          const analysis = parseAnalysisResponse(text, extractedText);
          setDocumentAnalysis(analysis);
          toast.success('Image analyzed with OCR successfully!');
          return;
        } catch (modelError) {
          console.warn(`Model ${modelName} failed, trying next...`, modelError);
          continue;
        }
      }
      
      throw new Error('All models failed');
      
    } catch (error) {
      console.error('Error analyzing image:', error);
      toast.error('Failed to analyze image. Please try again.');
      
      setDocumentAnalysis({
        extractedText: 'OCR processing failed. Unable to extract text from image.',
        completeDetails: 'Image captured successfully but text extraction failed. Please ensure the image is clear and contains readable text. Try recapturing with better lighting or focus.',
        keyPoints: [
          'Image captured from camera',
          'OCR processing failed',
          'Try recapturing with better quality',
          'Ensure good lighting and focus',
          'Text should be clearly visible'
        ],
        summary: 'Image captured but text extraction failed. Please try again.'
      });
    } finally {
      setAnalyzingDocument(false);
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    startCamera();
  };

  const useCapturedImage = () => {
    toast.success('Image ready for analysis');
  };

  const handlePrevious = () => {
    if (currentLesson.currentStep > 1) {
      setCurrentLesson({
        ...currentLesson,
        currentStep: currentLesson.currentStep - 1,
      });
      generateLessonContent();
      toast.info('Moved to previous step');
    }
  };

  const handleNext = () => {
    if (currentLesson.currentStep < currentLesson.totalSteps) {
      setCurrentLesson({
        ...currentLesson,
        currentStep: currentLesson.currentStep + 1,
      });
      generateLessonContent();
      toast.info('Moved to next step');
    }
  };

  const progress = (currentLesson.currentStep / currentLesson.totalSteps) * 100;

  return (
    <MainLayout>
      <div className="p-8 max-w-7xl mx-auto space-y-6">
        {/* Page Title */}
        <div>
          <h1 className="text-3xl font-bold mb-1">Voice Tutor</h1>
          <p className="text-muted-foreground">Interactive voice-based learning</p>
        </div>

        {/* Schedule Indicator */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="flex items-center gap-8">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Now</p>
              <div className="w-3 h-3 rounded-full bg-primary" />
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Next</p>
              <div className="w-3 h-3 rounded-full bg-border" />
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Then</p>
              <div className="w-3 h-3 rounded-full bg-border" />
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs for Lesson and Document Analysis */}
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'lesson' | 'document')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="lesson">Voice Lesson</TabsTrigger>
                <TabsTrigger value="document">
                  Document Analysis
                  {uploadedFile && <span className="ml-2 w-2 h-2 rounded-full bg-green-500" />}
                </TabsTrigger>
              </TabsList>

              {/* Lesson Tab */}
              <TabsContent value="lesson" className="space-y-6 mt-6">
            {/* Circular Progress */}
            <Card className="p-8">
              <div className="flex flex-col items-center">
                <div className="relative w-64 h-64">
                  <svg className="w-full h-full -rotate-90">
                    <circle
                      cx="128"
                      cy="128"
                      r="120"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="none"
                      className="text-muted"
                    />
                    <circle
                      cx="128"
                      cy="128"
                      r="120"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 120}`}
                      strokeDashoffset={`${2 * Math.PI * 120 * (1 - progress / 100)}`}
                      className="text-accent transition-all duration-1000"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-sm text-muted-foreground mb-1">
                      Lesson {currentLesson.currentStep} of {currentLesson.totalSteps}:
                    </p>
                    <p className="text-lg font-semibold mb-2">{currentLesson.title}</p>
                    <p className="text-5xl font-bold text-primary">{Math.round(progress)}%</p>
                    <p className="text-sm text-muted-foreground mt-1">Progress</p>
                  </div>
                </div>

                {/* Voice Buttons */}
                <div className="flex gap-3 mt-6">
                  <Button
                    size="lg"
                    onClick={toggleListening}
                    variant={isListening ? 'destructive' : 'default'}
                    className="gap-2 px-8"
                    disabled={speakingSection !== null}
                  >
                    <Mic className="w-5 h-5" />
                    {isListening ? 'Stop Listening' : 'Start Voice Input'}
                  </Button>

                  {speakingSection === 'lesson' ? (
                    <Button size="lg" onClick={stopSpeaking} variant="destructive" className="gap-2">
                      <StopCircle className="w-5 h-5" />
                      Stop
                    </Button>
                  ) : (
                    <Button
                      size="lg"
                      onClick={speakLesson}
                      variant="secondary"
                      className="gap-2"
                      disabled={loading || isListening || speakingSection !== null}
                    >
                      <Volume2 className="w-5 h-5" />
                      Read Lesson
                    </Button>
                  )}
                </div>

                {/* Transcript Display */}
                {transcript && (
                  <div className="mt-4 w-full">
                    <Card className="p-4 bg-muted">
                      <p className="text-sm text-muted-foreground mb-1">You said:</p>
                      <p className="text-base font-medium">{transcript}</p>
                    </Card>
                  </div>
                )}
              </div>
            </Card>

            {/* Lesson Content */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Lesson Content</h3>
              <div className="bg-primary/5 border-l-4 border-primary p-4 rounded">
                {loading ? (
                  <p className="text-base text-muted-foreground">Loading lesson content...</p>
                ) : (
                  <p className="text-base">{lessonText}</p>
                )}
              </div>
              <div className="mt-4">
                <p className="text-sm text-muted-foreground mb-2">Voice Commands:</p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-muted rounded-full text-sm">Say "start lesson"</span>
                  <span className="px-3 py-1 bg-muted rounded-full text-sm">Say "repeat"</span>
                  <span className="px-3 py-1 bg-muted rounded-full text-sm">Say "help"</span>
                </div>
              </div>
            </Card>

            {/* OCR Scan & Read */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">OCR Scan & Read</h3>
              <div className="bg-primary/5 border-l-4 border-primary p-4 rounded">
                <p className="text-base whitespace-pre-line">{ocrText}</p>
              </div>
              <div className="flex items-center justify-between mt-4">
                {speakingSection === 'ocr' ? (
                  <Button variant="outline" onClick={stopSpeaking} className="gap-2">
                    <StopCircle className="w-4 h-4" />
                    Stop
                  </Button>
                ) : (
                  <Button variant="outline" onClick={readOCRText} className="gap-2" disabled={speakingSection !== null}>
                    <Volume2 className="w-4 h-4" />
                    Read Aloud
                  </Button>
                )}
                <Button variant="outline" className="gap-2">
                  <Camera className="w-4 h-4" />
                  Scan Text
                </Button>
              </div>
            </Card>

                {/* Navigation */}
                <div className="flex items-center justify-center gap-4">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handlePrevious}
                    className="gap-2"
                    disabled={currentLesson.currentStep === 1}
                  >
                    <ChevronLeft className="w-5 h-5" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleNext}
                    className="gap-2"
                    disabled={currentLesson.currentStep === currentLesson.totalSteps}
                  >
                    Next
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                  <Button variant="outline" size="lg" className="gap-2">
                    <HelpCircle className="w-5 h-5" />
                    Help
                  </Button>
                </div>
              </TabsContent>

              {/* Document Analysis Tab */}
              <TabsContent value="document" className="space-y-6 mt-6">
                {/* Two Column Layout: Upload Document & Camera */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Document Upload Section */}
                  <Card className="p-6">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <Upload className="w-5 h-5" />
                      Upload Document
                    </h3>
                    <div className="space-y-4">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.doc,.docx,.txt"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <FileText className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground mb-3">
                          Upload a PDF, DOC, DOCX, or TXT file
                        </p>
                        <Button className="gap-2" size="sm">
                          <Upload className="w-4 h-4" />
                          Choose File
                        </Button>
                        {uploadedFile && (
                          <p className="text-xs text-primary mt-3 font-medium">
                            ✓ {uploadedFile.name}
                          </p>
                        )}
                      </div>
                      <p className="text-xs text-center text-muted-foreground">
                        Supported formats: PDF, DOC, DOCX, TXT (Max 10MB)
                      </p>
                    </div>
                  </Card>

                  {/* Camera Access Section */}
                  <Card className="p-6">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <Camera className="w-5 h-5" />
                      Camera Capture
                    </h3>
                    <div className="space-y-4">
                      {!isCameraActive && !capturedImage && (
                        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                          <Camera className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground mb-3">
                            Take a photo using your camera
                          </p>
                          <Button onClick={startCamera} className="gap-2" size="sm">
                            <Camera className="w-4 h-4" />
                            Open Camera
                          </Button>
                        </div>
                      )}

                      {isCameraActive && (
                        <div className="space-y-3">
                          <div className="relative rounded-lg overflow-hidden bg-black">
                            <video
                              ref={videoRef}
                              autoPlay
                              playsInline
                              className="w-full h-64 object-cover"
                            />
                            <Button
                              onClick={stopCamera}
                              size="icon"
                              variant="destructive"
                              className="absolute top-2 right-2"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="flex gap-2">
                            <Button onClick={capturePhoto} className="flex-1 gap-2">
                              <Camera className="w-4 h-4" />
                              Capture Photo
                            </Button>
                            <Button onClick={stopCamera} variant="outline">
                              Cancel
                            </Button>
                          </div>
                        </div>
                      )}

                      {capturedImage && !isCameraActive && (
                        <div className="space-y-3">
                          <div className="relative rounded-lg overflow-hidden border-2 border-primary">
                            <img
                              src={capturedImage}
                              alt="Captured"
                              className="w-full h-64 object-cover"
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button onClick={retakePhoto} variant="outline" className="flex-1 gap-2">
                              <Camera className="w-4 h-4" />
                              Retake
                            </Button>
                            <Button onClick={useCapturedImage} className="flex-1 gap-2">
                              Use Photo
                            </Button>
                          </div>
                          <p className="text-xs text-center text-muted-foreground">
                            ✓ Photo captured and analyzed
                          </p>
                        </div>
                      )}

                      <canvas ref={canvasRef} className="hidden" />
                      <p className="text-xs text-center text-muted-foreground">
                        Capture documents, text, or any visual content
                      </p>
                    </div>
                  </Card>
                </div>

                {/* Loading State */}
                {analyzingDocument && (
                  <Card className="p-8">
                    <div className="flex flex-col items-center justify-center">
                      <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
                      <p className="text-lg font-semibold">Analyzing document...</p>
                      <p className="text-sm text-muted-foreground mt-2">This may take a few moments</p>
                    </div>
                  </Card>
                )}

                {/* Analysis Results */}
                {documentAnalysis && !analyzingDocument && (
                  <>
                    {/* Extracted Text Section - NEW */}
                    {documentAnalysis.extractedText && documentAnalysis.extractedText.trim().length > 0 && (
                      <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-xl font-semibold flex items-center gap-2 text-blue-900">
                            <FileImage className="w-5 h-5" />
                            Extracted Text Content
                          </h3>
                          {speakingSection === 'extractedText' ? (
                            <Button size="sm" onClick={stopSpeaking} variant="destructive" className="gap-2">
                              <StopCircle className="w-4 h-4" />
                              Stop
                            </Button>
                          ) : (
                            <Button 
                              size="sm" 
                              onClick={async () => {
                                if (!speechServiceRef.current) return;
                                try {
                                  setSpeakingSection('extractedText');
                                  await speechServiceRef.current.speak(documentAnalysis.extractedText, { rate: 0.9 });
                                  setSpeakingSection(null);
                                  toast.success('Finished reading extracted text');
                                } catch (error) {
                                  console.error('Error speaking:', error);
                                  setSpeakingSection(null);
                                  toast.error('Failed to read text');
                                }
                              }} 
                              variant="secondary" 
                              className="gap-2"
                              disabled={speakingSection !== null}
                            >
                              <Volume2 className="w-4 h-4" />
                              Read Text
                            </Button>
                          )}
                        </div>
                        <div className="bg-white border-2 border-blue-300 rounded-lg p-5 max-h-96 overflow-y-auto">
                          <pre className="text-sm leading-relaxed whitespace-pre-wrap font-mono text-gray-800">
                            {documentAnalysis.extractedText}
                          </pre>
                        </div>
                        <p className="text-xs text-blue-700 mt-3 italic">
                          ⓘ This is the actual text content extracted from your document/image
                        </p>
                      </Card>
                    )}

                    {/* Complete Details Section */}
                    <Card className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold flex items-center gap-2">
                          <BookOpen className="w-5 h-5" />
                          Complete Details
                        </h3>
                        {speakingSection === 'completeDetails' ? (
                          <Button size="sm" onClick={stopSpeaking} variant="destructive" className="gap-2">
                            <StopCircle className="w-4 h-4" />
                            Stop
                          </Button>
                        ) : (
                          <Button size="sm" onClick={speakCompleteDetails} variant="secondary" className="gap-2" disabled={speakingSection !== null}>
                            <Volume2 className="w-4 h-4" />
                            Read Aloud
                          </Button>
                        )}
                      </div>
                      <div className="bg-primary/5 border-l-4 border-primary p-4 rounded">
                        <p className="text-base leading-relaxed whitespace-pre-wrap">{documentAnalysis.completeDetails}</p>
                      </div>
                    </Card>

                    {/* Key Points Section */}
                    <Card className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold flex items-center gap-2">
                          <Lightbulb className="w-5 h-5" />
                          Key Points
                        </h3>
                        {speakingSection === 'keyPoints' ? (
                          <Button size="sm" onClick={stopSpeaking} variant="destructive" className="gap-2">
                            <StopCircle className="w-4 h-4" />
                            Stop
                          </Button>
                        ) : (
                          <Button size="sm" onClick={speakKeyPoints} variant="secondary" className="gap-2" disabled={speakingSection !== null}>
                            <Volume2 className="w-4 h-4" />
                            Read Aloud
                          </Button>
                        )}
                      </div>
                      <div className="space-y-3">
                        {documentAnalysis.keyPoints.map((point, index) => (
                          <div key={index} className="flex gap-3 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-sm font-semibold text-primary">{index + 1}</span>
                            </div>
                            <p className="text-sm flex-1">{point}</p>
                          </div>
                        ))}
                      </div>
                    </Card>

                    {/* Summary Section */}
                    <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold">Quick Summary</h3>
                        {speakingSection === 'summary' ? (
                          <Button size="sm" onClick={stopSpeaking} variant="destructive" className="gap-2">
                            <StopCircle className="w-4 h-4" />
                            Stop
                          </Button>
                        ) : (
                          <Button size="sm" onClick={speakSummary} variant="secondary" className="gap-2" disabled={speakingSection !== null}>
                            <Volume2 className="w-4 h-4" />
                            Read Aloud
                          </Button>
                        )}
                      </div>
                      <p className="text-base italic">{documentAnalysis.summary}</p>
                    </Card>

                    {/* Action Buttons */}
                    <div className="flex justify-center gap-4">
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setUploadedFile(null);
                          setDocumentAnalysis(null);
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                      >
                        Upload New Document
                      </Button>
                      <Button variant="outline" onClick={() => setActiveTab('lesson')}>
                        Back to Lesson
                      </Button>
                    </div>
                  </>
                )}

                {/* Empty State */}
                {!documentAnalysis && !analyzingDocument && (
                  <Card className="p-12 text-center">
                    <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-xl font-semibold mb-2">No Document Uploaded</h3>
                    <p className="text-muted-foreground mb-6">
                      Upload a document to get AI-powered analysis, complete details, and key points
                    </p>
                    <Button onClick={() => fileInputRef.current?.click()} size="lg" className="gap-2">
                      <Upload className="w-5 h-5" />
                      Upload Document
                    </Button>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Lessons */}
            <Card className="p-6 bg-gradient-to-br from-purple-100 to-purple-50">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg bg-purple-200 flex items-center justify-center">
                  <span className="text-2xl">📝</span>
                </div>
                <div>
                  <p className="font-semibold">General Homework</p>
                  <p className="text-sm text-muted-foreground">3 Weeks Sprint</p>
                </div>
              </div>
              <Button className="w-full" onClick={generateLessonContent}>
                Start Lesson
              </Button>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-blue-100 to-blue-50">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg bg-blue-200 flex items-center justify-center">
                  <span className="text-2xl">🌍</span>
                </div>
                <div>
                  <p className="font-semibold">General Knowledge</p>
                  <p className="text-sm text-muted-foreground">5 Weeks Sprint</p>
                </div>
              </div>
              <Button className="w-full" onClick={generateLessonContent}>
                Start Lesson
              </Button>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                    <span className="text-xl">🧠</span>
                  </div>
                  <p className="text-sm">Practice Reading</p>
                </div>
                <Button 
                  className="w-full gap-2"
                  onClick={() => {
                    setActiveTab('document');
                    fileInputRef.current?.click();
                  }}
                >
                  <Upload className="w-4 h-4" />
                  Upload & Analyze Document
                </Button>
                <Button variant="outline" className="w-full">
                  View Progress
                </Button>
              </div>
            </Card>

            {/* Status Indicator */}
            {(isListening || speakingSection !== null) && (
              <Card className="p-4 bg-primary/10 border-primary">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                  <p className="text-sm font-medium">
                    {isListening && 'Listening for your voice...'}
                    {speakingSection === 'lesson' && 'Reading lesson...'}
                    {speakingSection === 'ocr' && 'Reading OCR text...'}
                    {speakingSection === 'extractedText' && 'Reading extracted text...'}
                    {speakingSection === 'completeDetails' && 'Reading complete details...'}
                    {speakingSection === 'keyPoints' && 'Reading key points...'}
                    {speakingSection === 'summary' && 'Reading summary...'}
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default VoiceTutor;
