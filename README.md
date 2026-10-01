# VectorMatch AI – Resume Intelligence

VectorMatch AI is an AI-powered resume intelligence and recruitment platform that analyzes resumes, extracts candidate information, generates job descriptions, and helps match candidates with suitable job requirements.

## Overview

VectorMatch AI is designed to simplify the recruitment process by using Artificial Intelligence and Natural Language Processing to analyze resumes and job descriptions.

The platform provides features for:

- Resume analysis
- Candidate screening
- Job description generation
- Candidate-job matching
- Resume information extraction
- Analysis history
- User management
- Resume file upload
- Exporting analysis results

## Key Features

### 1. AI Resume Analysis
Upload a resume and automatically extract important information such as:

- Candidate name
- Skills
- Education
- Experience
- Projects
- Certifications
- Professional information

### 2. AI Candidate Screening
Analyze resumes against job requirements and identify how well a candidate matches the required skills and qualifications.

### 3. Job Description Generator
Generate structured job descriptions based on the required role, skills, experience, and other job requirements.

### 4. Resume-Job Matching
Compare candidate profiles with job requirements using AI-based analysis and provide relevant matching information.

### 5. Resume Upload
Users can upload resume documents through the application for automated analysis.

### 6. Analysis Dashboard
Provides an organized dashboard for viewing resume analysis results and candidate information.

### 7. Analysis History
Users can access previously performed resume analyses.

### 8. User Management
Provides user and candidate management features through the application interface.

### 9. Data Export
Analysis results can be exported for further use.

## Technology Stack

### Frontend

- React.js
- TypeScript
- Vite
- HTML5
- CSS3

### Backend

- Node.js
- TypeScript
- REST APIs

### AI / NLP

- Generative AI
- Natural Language Processing
- Resume information extraction
- Semantic matching

### Development Tools

- Git
- GitHub
- VS Code
- npm

## Project Structure


vectormatch-ai-resume-intelligence/
│
├── components/
│   ├── AnalysisDashboard.tsx
│   ├── AuthView.tsx
│   ├── EnterprisePage.tsx
│   ├── FileUploader.tsx
│   ├── Header.tsx
│   ├── HistoryView.tsx
│   ├── JDGenerator.tsx
│   ├── LandingPage.tsx
│   ├── PricingPage.tsx
│   ├── Screener.tsx
│   └── UserDirectory.tsx
│
├── services/
│   ├── exportService.ts
│   ├── geminiService.ts
│   └── persistenceService.ts
│
├── App.tsx
├── index.tsx
├── server.ts
├── types.ts
├── metadata.json
├── package.json
├── tsconfig.json
├── vite.config.ts
├── .env.example
├── .gitignore
└── README.md
