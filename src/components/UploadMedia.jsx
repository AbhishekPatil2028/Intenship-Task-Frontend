
import { useState } from "react";

export default function UploadMedia() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setUploadedUrl("");

    // preview
    if (selectedFile.type.startsWith("image")) {
      setPreview(URL.createObjectURL(selectedFile));
    } else if (selectedFile.type.startsWith("video")) {
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a file");

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Upload failed");
      }

      setUploadedUrl(data.data.url);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-4">
          Upload Image / Video
        </h2>

        <input
          type="file"
          accept="image/*,video/*"
          onChange={handleFileChange}
          className="mb-4"
        />

        {preview && (
          <div className="mb-4">
            {file.type.startsWith("image") ? (
              <img
                src={preview}
                alt="preview"
                className="rounded-lg max-h-60 mx-auto"
              />
            ) : (
              <video
                src={preview}
                controls
                className="rounded-lg max-h-60 mx-auto"
              />
            )}
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={loading}
          className={`w-full py-2 rounded-lg text-white font-semibold ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {loading ? "Uploading..." : "Upload"}
        </button>

        {uploadedUrl && (
          <div className="mt-4 text-center">
            <p className="text-green-600 font-medium">Upload Successful ✅</p>
            <a
              href={uploadedUrl}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 underline break-all"
            >
              View Uploaded File
            </a>
          </div>
        )}
      </div>
    </div>
  );
}


