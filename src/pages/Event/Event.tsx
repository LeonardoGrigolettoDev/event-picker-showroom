import React, { useEffect, useRef, useState } from "react";
import styles from "./styles.module.css";

const useCamera = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(
    null
  );
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  useEffect(() => {
    const getCameraStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
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
        (videoRef.current.srcObject as MediaStream)
          .getTracks()
          .forEach((track) => track.stop());
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
        // 👇 Espelha horizontalmente o canvas
        context.translate(video.videoWidth, 0);
        context.scale(-1, 1);

        // 👇 Desenha a imagem invertida no canvas
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        setCapturedImage(canvasRef.current.toDataURL("image/png"));
      }
    }
  };

  return {
    videoRef,
    canvasRef,
    permissionGranted,
    capturedImage,
    captureFrame,
  };
};

const postEvent = async (capturedImage: string) => {
  try {
    const blob = dataURLtoBlob(capturedImage);
    const entity_id = localStorage.getItem("entity_id");
    const date = new Date();

    if (!entity_id) {
      console.error("ID da entidade não encontrado no localStorage.");
      return;
    }

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2);
    const formattedDate = `${day}/${month}/${year}`;

    const file = new File([blob], entity_id, {
      type: "image/png",
      lastModified: date.getTime(),
    });

    const formData = new FormData();
    formData.append("entity_id", entity_id);
    formData.append("types", "facial");
    formData.append("image", file);
    formData.append("override", "false");
    formData.append("date", formattedDate);

    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    const response = await fetch("http://localhost:8080/api/events", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    console.log("RESPOSTA", data);
  } catch (error) {
    console.error("Erro ao enviar imagem:", error);
  }
};

function dataURLtoBlob(dataURL: string): Blob {
  const arr = dataURL.split(",");
  const mimeMatch = arr[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : "";
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

const CameraStream: React.FC = () => {
  const {
    videoRef,
    canvasRef,
    permissionGranted,
    capturedImage,
    captureFrame,
  } = useCamera();

  if (permissionGranted === null) return <p>Solicitando permissão...</p>;
  if (permissionGranted === false)
    return <p>Permissão negada! Habilite a câmera.</p>;

  return (
    <div className={styles.container}>
      <div className={styles.videoContainer}>
        <video className={styles.video} ref={videoRef} autoPlay playsInline />
        <button className={styles.button} onClick={captureFrame}>
          📸 Frame
        </button>
      </div>

      {capturedImage && (
        <div className={styles.captureContainer}>
          <img
            src={capturedImage}
            alt="capturada"
            className={styles.capturedImage}
          />
          <div className="containerButtons">
            <div className="buttons">
              <button
                className={styles.sendButton}
                onClick={() => postEvent(capturedImage)}
              >
                📤 Register
              </button>
            </div>

            <div className="buttons">
              <button
                className={styles.sendButton}
                // onClick={() => postEvent(capturedImage)}
              >
                📤 Compare
              </button>
            </div>
          </div>
        </div>
      )}

      <canvas
        className={styles.hiddenCanvas}
        ref={canvasRef}
        style={{ display: "none" }}
      />
    </div>
  );
};

const Event: React.FC = () => {
  return (
    <div className={styles.homeContainer}>
      <h2 className={styles.pageTitle}>📷 Streaming da Câmera</h2>
      <CameraStream />
    </div>
  );
};

export default Event;
