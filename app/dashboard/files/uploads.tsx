/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from "react";
import SearchBar from "@/components/SearchBar";
import FileUpload from "@/components/FileUpload";
import FilterSection, { FilterOptions } from "@/components/FilterSection";
import FileGrid from "@/components/FileGrid";
import { FileItem } from "@/components/FileCard"
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes"; // Add this import for theme handling
import { supabase } from '@/lib/supabaseClient'; // Add this import at the top
import { useUser } from '@/lib/UserContext'; // Add this import at the top


// Sample data for demonstration






const Index = () => {
  const { user } = useUser(); // Add this hook to get current user
  const { theme } = useTheme(); // Add theme detection
  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [filteredFiles, setFilteredFiles] = useState<FileItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentFilters, setCurrentFilters] = useState<FilterOptions>({
    type: [],
    date: null,
    sortBy: "date",
  });
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);

  // Simulate loading data
  // Replace the existing useEffect with this:
  useEffect(() => {
    if (user) {
      fetchUserFiles();
    } else {
      // If no user, just show empty state
      setFiles([]);
      setFilteredFiles([]);
      setLoading(false);
    }
  }, [user]); // Depend on user so it refetches when user changes

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    applyFilters(query, currentFilters);
  };

  const handleFilter = (filters: FilterOptions) => {
    setCurrentFilters(filters);
    applyFilters(searchQuery, filters);
  };

  const applyFilters = (query: string, filters: FilterOptions) => {
    let results = [...files];

    // Apply search
    if (query) {
      const lowerQuery = query.toLowerCase();
      results = results.filter(file =>
        file.name.toLowerCase().includes(lowerQuery)
      );
    }

    // Apply type filters
    if (filters.type.length > 0) {
      results = results.filter(file => {
        const fileType = file.type.toLowerCase();
        return filters.type.some((type: any) => fileType.includes(type));
      });
    }

    // Apply sorting
    results.sort((a, b) => {
      switch (filters.sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "size":
          // Simple string comparison for demo purposes
          return a.size.localeCompare(b.size);
        case "date":
        default:
          // For demo, we're just using the modified string
          return b.modified.localeCompare(a.modified);
      }
    });

    setFilteredFiles(results);
  };

  const handleFileUpload = async (fileList: FileList) => {
    if (!user) {
      toast.error('Please sign in to upload files');
      return;
    }

    const uploadPromises = Array.from(fileList).map(async (file, index) => {
      try {
        // Create file path: userId/docs/filename
        const filePath = `${user.id}/docs/${file.name}`;

        // Upload file to Supabase storage
        const { data, error } = await supabase.storage
          .from('general1')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false // Set to true if you want to overwrite existing files
          });

        if (error) {
          console.error(`Error uploading ${file.name}:`, error);
          toast.error(`Failed to upload ${file.name}: ${error.message}`);
          return null;
        }

        // Create FileItem for UI
        const preview = file.type.startsWith('image/')
          ? URL.createObjectURL(file)
          : undefined;

        return {
          id: `uploaded-${Date.now()}-${index}`,
          name: file.name,
          type: file.type || 'unknown',
          size: formatFileSize(file.size),
          modified: formatDistanceToNow(new Date(), { addSuffix: true }),
          preview,
          storagePath: data.path, // Store the Supabase path for future reference
        };
      } catch (error) {
        console.error(`Unexpected error uploading ${file.name}:`, error);
        toast.error(`Failed to upload ${file.name}`);
        return null;
      }
    });

    // Wait for all uploads to complete
    const uploadResults = await Promise.all(uploadPromises);

    // Filter out failed uploads
    const successfulUploads = uploadResults.filter(result => result !== null) as FileItem[];

    if (successfulUploads.length > 0) {
      // Add successfully uploaded files to the list
      const updatedFiles = [...successfulUploads, ...files];
      setFiles(updatedFiles);
      setFilteredFiles(updatedFiles);

      toast.success(`${successfulUploads.length} file(s) uploaded successfully`);
      fetchUserFiles();
    }

    // Show summary if some uploads failed
    const failedCount = fileList.length - successfulUploads.length;
    if (failedCount > 0) {
      toast.error(`${failedCount} file(s) failed to upload`);
    }
  };

  // Add this function after the handleFileUpload function
  const fetchUserFiles = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // List all files in the user's docs folder
      const { data, error } = await supabase.storage
        .from('general1')
        .list(`${user.id}/docs`, {
          limit: 100,
          offset: 0,
        });

      if (error) {
        console.error('Error fetching files:', error);
        toast.error('Failed to fetch files');
        setLoading(false);
        return;
      }

      // Convert storage files to FileItem format
      const userFiles: FileItem[] = data.map((file) => ({
        id: file.id || `file-${file.name}`,
        name: file.name,
        type: file.metadata?.mimetype || 'unknown',
        size: formatFileSize(file.metadata?.size || 0),
        modified: formatDistanceToNow(new Date(file.updated_at || file.created_at), { addSuffix: true }),
        storagePath: `${user.id}/docs/${file.name}`,
        // For images, we can create a preview URL
        preview: file.metadata?.mimetype?.startsWith('image/')
          ? supabase.storage.from('general1').getPublicUrl(`${user.id}/docs/${file.name}`).data.publicUrl
          : undefined,
      }));

      setFiles(userFiles);
      setFilteredFiles(userFiles);
      setLoading(false);
    } catch (error) {
      console.error('Unexpected error fetching files:', error);
      toast.error('Failed to fetch files');
      setLoading(false);
    }
  };


  // Add these functions after the fetchUserFiles function
  const handleDownload = async (file: FileItem) => {
    if (!file.storagePath) {
      toast.error('File path not found');
      return;
    }

    try {
      // Get the file data
      const { data, error } = await supabase.storage
        .from('general1')
        .download(file.storagePath as string);

      if (error) {
        console.error('Error downloading file:', error);
        toast.error('Failed to download file');
        return;
      }

      // Create a blob URL and trigger download
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('File downloaded successfully');
    } catch (error) {
      console.error('Unexpected error downloading file:', error);
      toast.error('Failed to download file');
    }
  };

  const handlePreview = (file: FileItem) => {
    if (!file.storagePath) {
      toast.error('File path not found');
      return;
    }

    // Get the public URL for the file
    const { data } = supabase.storage
      .from('general1')
      .getPublicUrl(file.storagePath as string);

    if (data.publicUrl) {
      // Open in new tab
      window.open(data.publicUrl, '_blank');
    } else {
      toast.error('Unable to generate preview URL');
    }
  };

  // (Removed duplicate and erroneous code block)

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleFileClick = (file: FileItem) => {
    setSelectedFile(file);
  };

  return (
    // Use bg-background instead of hardcoded gradient to respect theme colors
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-5 sm:py-6 max-w-full">
        <div className="space-y-6">
          {/* Search and Upload Row */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <SearchBar onSearch={handleSearch} />
            </div>
            <div className="sm:w-auto">
              <FileUpload onFileUpload={handleFileUpload} />
            </div>
          </div>

          {/* Filter Section */}
          <div className="flex justify-between items-center">
            <FilterSection onFilter={handleFilter} />
            <div className="text-sm text-muted-foreground">
              {filteredFiles.length} file{filteredFiles.length !== 1 ? 's' : ''}
            </div>
          </div>

          {/* File Grid */}
          <div className="mt-6">:
            <FileGrid
              files={filteredFiles}
              onFileClick={handleFileClick}
              onDownload={handleDownload}     // Add this
              onPreview={handlePreview}       // Add this
              isLoading={loading}
            />
          </div>
        </div>
      </div>

      {/* File Preview Dialog */}
      <Dialog open={!!selectedFile} onOpenChange={(open: any) => !open && setSelectedFile(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="truncate pr-8">{selectedFile?.name}</DialogTitle>
            <DialogDescription>
              {selectedFile?.size} • {selectedFile?.modified}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center justify-center py-4">
            {selectedFile?.preview ? (
              <img
                src={selectedFile.preview}
                alt={selectedFile.name}
                className="max-h-[300px] rounded-md object-contain cursor-pointer"
                onClick={() => selectedFile && handlePreview(selectedFile)}
                title="Click to open in new tab"
              />
            ) : (
              <div className="py-12 text-center text-muted-foreground">
                <div className="mb-4">No preview available for this file type</div>
                <Button
                  variant="outline"
                  onClick={() => selectedFile && handlePreview(selectedFile)}
                  className="mb-2"
                >
                  Open in New Tab
                </Button>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2">
            
            <Button
              variant="secondary"
              onClick={() => selectedFile && handleDownload(selectedFile)}
            >
              Download
            </Button>
            <DialogClose asChild>
              <Button variant="ghost">Close</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;