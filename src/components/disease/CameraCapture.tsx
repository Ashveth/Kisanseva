import { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Camera, X, SwitchCamera, Aperture } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface CameraCaptureProps {
  onCapture: (imageDataUrl: string) => void;
  onClose: () => void;
}

const CameraCapture = ({ onCapture, onClose }: CameraCaptureProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const [ready, setReady] = useState(false);

  const startCamera = useCallback(async (facing: "environment" | "user") => {
    try {
      // Stop existing stream
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facing, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.onloadedmetadata = () => setReady(true);
      }
    } catch (err) {
      console.error("Camera error:", err);
      toast.error("Could not access camera. Please check permissions.");
      onClose();
    }
  }, []); // intentionally exclude stream to avoid loop

  useEffect(() => {
    startCamera(facingMode);
    return () => {
      // cleanup on unmount
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, []); // start once on mount

  const handleSwitchCamera = async () => {
    stream?.getTracks().forEach((t) => t.stop());
    const newFacing = facingMode === "environment" ? "user" : "environment";
    setFacingMode(newFacing);
    setReady(false);
    await startCamera(newFacing);
  };

  const handleCapture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.8);

    // Stop camera
    stream?.getTracks().forEach((t) => t.stop());
    onCapture(dataUrl);
  };

  const handleClose = () => {
    stream?.getTracks().forEach((t) => t.stop());
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black flex flex-col"
    >
      {/* Video feed */}
      <div className="flex-1 relative overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
        {!ready && (
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            <div className="text-white text-sm animate-pulse">Starting camera...</div>
          </div>
        )}
        {/* Scan overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-[15%] border-2 border-white/40 rounded-2xl" />
          <div className="absolute bottom-4 left-0 right-0 text-center">
            <span className="text-white/70 text-xs bg-black/40 px-3 py-1 rounded-full">
              Position the leaf inside the frame
            </span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-black/90 p-4 flex items-center justify-between safe-area-bottom">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClose}
          className="text-white hover:bg-white/10 h-12 w-12"
        >
          <X className="h-6 w-6" />
        </Button>

        <button
          onClick={handleCapture}
          disabled={!ready}
          className="h-16 w-16 rounded-full border-4 border-white flex items-center justify-center disabled:opacity-50 transition-transform active:scale-90"
        >
          <div className="h-12 w-12 rounded-full bg-white" />
        </button>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleSwitchCamera}
          className="text-white hover:bg-white/10 h-12 w-12"
        >
          <SwitchCamera className="h-6 w-6" />
        </Button>
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </motion.div>
  );
};

export default CameraCapture;
