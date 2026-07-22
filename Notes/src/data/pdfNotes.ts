export interface PdfNote {
  id: string;
  documentTitle: string;
  moduleName: string;
  instructorName: string;
  uploadedDate: string;
  fileSize: string;
  totalPages: number;
  lastUpdated: string;
  overview: string;
  topicsCovered: string[];
  learningObjectives: string[];
  keywords: string[];
  pdfUrl: string;
}

export const PDF_NOTES: PdfNote[] = [
  {
    id: 'pdf-1',
    documentTitle: 'ClaudeAI Notes',
    moduleName: 'AI & Machine Learning',
    instructorName: 'Claude AI',
    uploadedDate: 'March 2026',
    fileSize: '2.1 MB',
    totalPages: 15,
    lastUpdated: 'March 2026',
    overview: 'Comprehensive notes covering Claude AI fundamentals, capabilities, architecture, and practical applications. Includes best practices for prompt engineering and integration patterns.',
    topicsCovered: [
      'Claude AI architecture overview',
      'Prompt engineering techniques',
      'Context window management',
      'Tool use and function calling',
      'Safety and alignment',
      'API integration patterns',
    ],
    learningObjectives: [
      'Understand Claude AI model capabilities',
      'Master effective prompt engineering',
      'Implement API integrations',
      'Apply safety best practices',
    ],
    keywords: ['Claude AI', 'Prompt Engineering', 'AI', 'LLM', 'API', 'Machine Learning'],
    pdfUrl: '/pdfs/ClaudeAI Notes.pdf',
  },
  {
    id: 'pdf-2',
    documentTitle: 'ClaudeAI Notes (Extended)',
    moduleName: 'AI & Machine Learning',
    instructorName: 'Claude AI',
    uploadedDate: 'March 2026',
    fileSize: '2.3 MB',
    totalPages: 18,
    lastUpdated: 'March 2026',
    overview: 'Extended version of ClaudeAI notes with additional content on advanced use cases, system prompts, and complex workflow patterns for production deployments.',
    topicsCovered: [
      'Advanced prompt patterns',
      'System prompt design',
      'Multi-step workflows',
      'Error handling strategies',
      'Performance optimization',
      'Production deployment',
    ],
    learningObjectives: [
      'Design complex multi-step AI workflows',
      'Optimize prompts for production',
      'Handle edge cases and errors',
      'Deploy AI solutions at scale',
    ],
    keywords: ['Claude AI', 'Advanced Prompts', 'Workflows', 'Production AI', 'System Prompts'],
    pdfUrl: '/pdfs/ClaudeAI Notes (1).pdf',
  },
  {
    id: 'pdf-3',
    documentTitle: 'Git and GitHub Notes',
    moduleName: 'Version Control',
    instructorName: 'GitHub Education',
    uploadedDate: 'February 2026',
    fileSize: '1.8 MB',
    totalPages: 12,
    lastUpdated: 'April 2026',
    overview: 'Complete guide to Git version control and GitHub collaboration. Covers essential commands, branching strategies, pull requests, and team workflows for modern software development.',
    topicsCovered: [
      'Git basics and repository setup',
      'Branching and merging strategies',
      'Pull requests and code review',
      'GitHub Actions and CI/CD',
      'Conflict resolution',
      'Git workflow best practices',
    ],
    learningObjectives: [
      'Master core Git commands',
      'Implement effective branching strategies',
      'Collaborate using pull requests',
      'Automate with GitHub Actions',
    ],
    keywords: ['Git', 'GitHub', 'Version Control', 'Branching', 'Pull Requests', 'CI/CD'],
    pdfUrl: '/pdfs/Git and GitHub Notes.pdf',
  },
  {
    id: 'pdf-4',
    documentTitle: 'Java Complete Guide',
    moduleName: 'Programming Languages',
    instructorName: 'Java Documentation',
    uploadedDate: 'January 2026',
    fileSize: '8.5 MB',
    totalPages: 45,
    lastUpdated: 'May 2026',
    overview: 'Comprehensive Java programming guide covering core concepts, OOP principles, collections framework, multithreading, and advanced features for building robust applications.',
    topicsCovered: [
      'Java fundamentals and syntax',
      'Object-oriented programming',
      'Collections framework',
      'Multithreading and concurrency',
      'Streams and lambdas',
      'Exception handling',
      'File I/O and serialization',
    ],
    learningObjectives: [
      'Build Java applications from scratch',
      'Apply OOP principles effectively',
      'Use collections and streams',
      'Write concurrent programs',
      'Handle errors and file operations',
    ],
    keywords: ['Java', 'OOP', 'Collections', 'Multithreading', 'Streams', 'Programming'],
    pdfUrl: '/pdfs/Java_Complete_Guide-1.pdf',
  },
];
