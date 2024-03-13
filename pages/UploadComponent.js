import { Auth } from "@supabase/auth-ui-react";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabaseClient } from "../utils/SupabaseClient";
import { useDropzone } from "react-dropzone";

function UploadComponent() {
  const [userId, setUserId] = useState("");
  const [uploadStatus, setUploadStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]); 

  const uploadFiles = async (acceptedFiles) => {
    if (!userId) {
      console.warn("User not signed in yet!");
      return;
    }

    setUploadStatus(null);
    setLoading(true);
    setUploadedFiles([]); 

    try {
      const filenames = []; 

      for (const file of acceptedFiles) {
        const filename = `${userId}/${uuidv4()}`;
        const { error } = await supabaseClient.storage
          .from("updatingfiles")
          .upload(filename, file);

        if (error) {
          console.error("Upload error:", error);
          setUploadError(error.message);
          setUploadStatus("error");
          setLoading(false);
          return;
        }

        filenames.push(file.name); 
      }

      setUploadedFiles(filenames); 
      setUploadStatus("success");
    } catch (error) {
      console.error("Error uploading files:", error);
      setUploadError("An error occurred during file upload.");
      setUploadStatus("error");
    } finally {
      setLoading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: uploadFiles,
    multiple: true,
    disabled: !userId,
  });

  useEffect(() => {
    const getUser = async () => {
      try {
        const {
          data: { user },
        } = await supabaseClient.auth.getUser();
        setUserId(user?.id || "");
      } catch (error) {
        console.error("Error getting user:", error);
      }
    };

    getUser();

    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id || "");
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signout = async () => {
    setUserId("");
    await supabaseClient.auth.signOut();
  };

  return (
    <div className="container mt-5">
    {!userId ? (
        <Auth supabaseClient={supabaseClient} appearance={{ theme: ThemeSupa }} providers={[]} />
      ) : (
        <div>
          <div
            {...getRootProps({
              className: `dropzone ${isDragActive ? "dropzone--active" : ""}`,
            })}
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <div className="dropZone">Drop the files here...</div>
            ) : (
              <div className="dropZone">
              Drag 'n' drop files here, or click to select files
              </div>
            )}
          </div>

          {loading && <div className="loading">Uploading...</div>}

          {uploadStatus === "success" && (
            <div className="success">
              <p>Upload successful!</p>
              <div>
                <strong>Uploaded Files:</strong>
                <ul>
                  {uploadedFiles.map((fileName, index) => (
                    <li key={index}>{fileName}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {uploadStatus === "error" && (
            <div className="error">{uploadError}</div>
          )}

          <div className="mt-5">
            <button onClick={signout}>Logout</button>
          </div>
        </div>
      )}

      <style jsx>{`
        .container {
          text-align: center;
        }
        .dropZone {
          font-size: 30px;
          cursor: pointer;
          margin: 30px auto;
          max-width:600px;
          border: 2px dashed #ccc;

        }

        .dropzone {
          border: 2px dashed #ccc;
          padding: 20px;
          cursor: pointer;
          margin-bottom: 10px;
        }

        .dropzone--active {
          border-color: #3b82f6;
        }

        input {
          display: none;
        }

        .loading {
          color: #007bff;
        }

        .success {
          color: #28a745;
        }

        .error {
          color: #dc3545;
        }
      `}</style>
    </div>
  );
}

export default UploadComponent;
