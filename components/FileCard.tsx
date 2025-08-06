/* eslint-disable @next/next/no-img-element */
import { File, FileImage, FileText, FileAudio, FileVideo, FileArchive, FileSpreadsheet, FileCode } from "lucide-react";

export interface FileItem {
  storagePath: unknown;
  id: string;
  name: string;
  type: string;
  size: string;
  modified: string;
  preview?: string;
}

interface FileCardProps {
  file: FileItem;
  onClick: (file: FileItem) => void;
}

const FileCard = ({ file, onClick }: FileCardProps) => {
  const getFileIcon = () => {
    const type = file.type.toLowerCase();
    if (type.includes("image")) return <FileImage size={30} className="text-blue-500" />;
    if (type.includes("pdf") || type.includes("doc")) return <FileText size={30} className="text-amber-500" />;
    if (type.includes("audio")) return <FileAudio size={30} className="text-green-500" />;
    if (type.includes("video")) return <FileVideo size={30} className="text-purple-500" />;
    if (type.includes("zip") || type.includes("rar")) return <FileArchive size={30} className="text-gray-500" />;
    if (type.includes("excel") || type.includes("sheet")) return <FileSpreadsheet size={30} className="text-emerald-500" />;
    if (type.includes("code") || type.includes("json") || type.includes("html")) return <FileCode size={30} className="text-indigo-500" />;
    return <File size={30} className="text-muted-foreground" />;
  };

  return (
    <div 
      onClick={() => onClick(file)}
      className="file-card group bg-card border border-border p-4 rounded-xl shadow-sm hover:shadow-md cursor-pointer"
    >
      <div className="flex flex-col items-center justify-center h-full">
        {file.preview ? (
          <div className="relative w-full h-32 mb-3 overflow-hidden rounded-lg bg-muted">
            <img 
              src={file.preview} 
              alt={file.name} 
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="flex items-center justify-center w-full h-32 mb-3 bg-muted rounded-lg">
            {getFileIcon()}
          </div>
        )}
        
        <div className="w-full space-y-1">
          <h3 className="text-sm font-medium truncate text-card-foreground">{file.name}</h3>
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <span>{file.size}</span>
            <span>{file.modified}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileCard;
