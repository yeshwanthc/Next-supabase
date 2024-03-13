import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const MyDropzone = () => {
  const [files, setFiles] = useState([]);
  const [uploadStatus, setUploadStatus] = useState(null); 

  const onDrop = useCallback((acceptedFiles) => {
    setFiles(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleUpload = async () => {
    setUploadStatus("uploading"); 
    try {
      for (const file of files) {
        const thirdPartyResponse = await fetch("your_3rd_party_api_endpoint", {
          method: "POST",
          body: file,
        });

        const fileUrl = await thirdPartyResponse.json(); 
        const { data, error } = await supabase
          .from("uploads")
          .insert([
            { name: file.name, url: fileUrl, size: file.size, type: file.type },
          ]);

        if (error) {
          throw error; 
        }
      }
      setFiles([]); 
      setUploadStatus("success");
    } catch (error) {
      console.error("Upload error:", error);
      setUploadStatus("error");
    }
  };
  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <p>Drag 'n' drop files here, or click to select files</p>
      <button onClick={handleUpload} disabled={uploadStatus === "uploading"}>
        Upload
      </button>
      {uploadStatus === "success" && <p>Files uploaded successfully!</p>}
      {uploadStatus === "error" && (
        <p>Error during upload, please try again.</p>
      )}
    </div>
  );
};

export default MyDropzone;
