import React, { useEffect, useRef, useState } from "react";

const useCamera = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  useEffect(() => {
    const getCameraStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setPermissionGranted(true);
      } catch (error) {
        console.error("Erro ao acessar a câmera:", error);
        setPermissionGranted(false);
      }
    };

    getCameraStream();

    return () => {
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const captureFrame = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        const video = videoRef.current;
        canvasRef.current.width = video.videoWidth;
        canvasRef.current.height = video.videoHeight;
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        setCapturedImage(canvasRef.current.toDataURL("image/png"));
      }
    }
  };

  return { videoRef, canvasRef, permissionGranted, capturedImage, captureFrame };
};

const postEvent = async (capturedImage: String) => {
    console.log(capturedImage)
}

const CameraStream: React.FC = () => {
  const { videoRef, canvasRef, permissionGranted, capturedImage, captureFrame } = useCamera();

  if (permissionGranted === null) return <p>Solicitando permissão...</p>;
  if (permissionGranted === false) return <p>Permissão negada! Habilite a câmera.</p>;

  return (
    <div>
      <video ref={videoRef} autoPlay playsInline />
      <canvas ref={canvasRef} style={{ display: "none" }} />
      <button onClick={captureFrame}>Frame</button>
      {capturedImage && <button onClick={() => {postEvent(capturedImage)}}>Send</button>}
      {capturedImage && <img src={capturedImage} alt="captured" />}
    </div>
  );
};

const Event: React.FC = () => {
  return (
    <div className="home-container">
      <h2>Streaming da Câmera</h2>
      <CameraStream />
    </div>
  );
};

export default Event;
