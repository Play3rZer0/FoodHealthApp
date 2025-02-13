import React, { useState, useRef } from "react";
import axios from "axios";

function App() {
  const [image, setImage] = useState(null); // Stores the captured image
  const [result, setResult] = useState(""); // Stores the analysis result
  const [loading, setLoading] = useState(false); // Loading state
  const videoRef = useRef(null); // Reference to the video element for camera stream
  const canvasRef = useRef(null); // Reference to the canvas element for capturing the image

  // Start the camera stream
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing the camera:", error);
      alert(
        "Failed to access the camera. Please ensure you have granted permission."
      );
    }
  };

  // Capture the image from the camera
  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      const context = canvas.getContext("2d");
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageDataUrl = canvas.toDataURL("image/jpeg"); // Convert canvas to image data URL
      setImage(imageDataUrl); // Set the captured image
    }
  };

  // Stop the camera stream
  const stopCamera = () => {
    const stream = videoRef.current?.srcObject;
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop()); // Stop all tracks
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      alert("Please capture an image first!");
      return;
    }

    setLoading(true);
    try {
      // Convert the image data URL to a Blob
      const blob = await fetch(image).then((res) => res.blob());
      const formData = new FormData();
      formData.append("file", blob, "captured-image.jpg"); // Append the Blob to FormData

      // Send the image to the backend
      const response = await axios.post(
        "http://localhost:3001/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setResult(response.data); // Set the analysis result
    } catch (error) {
      console.error("Error uploading file:", error);
      setResult("Error analyzing the image.");
    } finally {
      setLoading(false);
      stopCamera(); // Stop the camera after submission
    }
  };

  return (
    <div className="App">
      <h1>Calorie Counter App</h1>
      <div>
        <button onClick={startCamera}>Start Camera</button>
        <button onClick={captureImage}>Capture Image</button>
      </div>
      <div>
        <video
          ref={videoRef}
          autoPlay
          style={{ width: "100%", maxWidth: "400px" }}
        ></video>
        <canvas
          ref={canvasRef}
          style={{ display: "none" }}
          width="640"
          height="480"
        ></canvas>
      </div>
      {image && (
        <div>
          <h2>Captured Image:</h2>
          <img
            src={image}
            alt="Captured"
            style={{ width: "100%", maxWidth: "400px" }}
          />
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <button type="submit" disabled={loading}>
          {loading ? "Analyzing..." : "Upload and Analyze"}
        </button>
      </form>
      {result && (
        <div>
          <h2>Analysis Result:</h2>
          <p>{result}</p>
        </div>
      )}
    </div>
  );
}

export default App;
