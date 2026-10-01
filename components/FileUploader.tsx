
import React, { useCallback } from 'react';
import { ResumeData } from '../types';

interface FileUploaderProps {
  onFileLoaded: (data: ResumeData) => void;
  isLoading: boolean;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileLoaded, isLoading }) => {
  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type === 'application/pdf') {
      try {
        const arrayBuffer = await file.arrayBuffer();
        // @ts-ignore - pdfjsLib is loaded from CDN in index.html
        const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let text = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const strings = content.items.map((item: any) => item.str);
          text += strings.join(" ") + "\n";
        }
        onFileLoaded({
          fileName: file.name,
          content: text,
          fileSize: file.size
        });
      } catch (err) {
        console.error("Error parsing PDF:", err);
        alert("Failed to parse PDF. Please try a text file or a different PDF.");
      }
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        onFileLoaded({
          fileName: file.name,
          content: e.target?.result as string,
          fileSize: file.size
        });
      };
      reader.readAsText(file);
    }
  }, [onFileLoaded]);

  return (
    <div className="w-full">
      <label className={`
        flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-2xl cursor-pointer 
        transition-all duration-200 glass-morphism
        ${isLoading ? 'border-indigo-400 bg-indigo-50/50' : 'border-slate-300 hover:border-indigo-400 hover:bg-indigo-50/30'}
      `}>
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <svg className="w-10 h-10 mb-4 text-slate-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
          </svg>
          <p className="mb-2 text-sm text-slate-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
          <p className="text-xs text-slate-400">PDF or TXT (Max 5MB)</p>
        </div>
        <input 
          type="file" 
          className="hidden" 
          accept=".pdf,.txt" 
          onChange={handleFileUpload}
          disabled={isLoading}
        />
      </label>
    </div>
  );
};

export default FileUploader;
