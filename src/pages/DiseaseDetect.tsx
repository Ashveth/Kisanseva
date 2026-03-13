import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, AlertTriangle, CheckCircle, Shield, Leaf, X, Loader2, Heart, Pill, Info, BarChart3, Upload, ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { AIErrorCard, AnalysisSkeleton } from "@/components/ui/ai-loading";
import CameraCapture from "@/components/disease/CameraCapture";

interface DiseaseResult {
  name: string;
  crop: string;
  confidence: number;
  severity: string;
  treatment: string;
  organic: string;
  prevention: string[];
  description?: string;
}

const DiseaseDetect = () => {
  const [image, setImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ healthy: boolean; disease: DiseaseResult } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const { t } = useLanguage();

  const compressImage = (file: File, maxWidth = 800, quality = 0.7): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let w = img.width, h = img.height;
        if (w > maxWidth) { h = (maxWidth / w) * h; w = maxWidth; }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  };

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image too large. Please use an image under 10MB.");
      return;
    }
    try {
      const compressed = await compressImage(file);
      setImage(compressed);
    } catch {
      toast.error("Failed to process image.");
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;
    setAnalyzing(true);
    setResult(null);
    setError(null);
    try {
      const { data, error: fnError } = await supabase.functions.invoke("disease-detect", {
        body: { image },
      });
      if (fnError) throw fnError;
      if (data?.error) throw new Error(data.error);
      setResult(data);
    } catch (err: any) {
      console.error("Disease detect error:", err);
      setError(err.message || "Failed to analyze image. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleReset = () => {
    setImage(null);
    setResult(null);
    setError(null);
  };

  const disease = result?.disease;

  return (
    <div className="container py-6 space-y-6">
      <AnimatePresence>
        {showCamera && (
          <CameraCapture
            onCapture={(dataUrl) => {
              setImage(dataUrl);
              setShowCamera(false);
            }}
            onClose={() => setShowCamera(false)}
          />
        )}
      </AnimatePresence>
      <div>
        <h1 className="text-2xl font-bold font-display text-foreground flex items-center gap-2">
          <Camera className="h-7 w-7 text-accent" />
          {t.plantDiseaseDetection}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">{t.uploadLeafImage}</p>
      </div>

      <input type="file" accept="image/*" capture="environment" ref={fileRef} onChange={handleImage} className="hidden" />


      {!image ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
          {/* Drop zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              const file = e.dataTransfer.files[0];
              if (file) {
                const fakeEvent = { target: { files: [file] } } as unknown as React.ChangeEvent<HTMLInputElement>;
                handleImage(fakeEvent);
              }
            }}
            className={`relative rounded-2xl border-2 border-dashed transition-all duration-300 ${
              isDragging
                ? "border-primary bg-primary/10 scale-[1.02]"
                : "border-primary/25 hover:border-primary/50 bg-card"
            }`}
          >
            <div className="p-8 flex flex-col items-center gap-5">
              <motion.div
                animate={isDragging ? { scale: 1.1, y: -5 } : { scale: 1, y: 0 }}
                className="h-20 w-20 rounded-2xl gradient-earth flex items-center justify-center shadow-lg"
              >
                <ImagePlus className="h-9 w-9 text-earth-foreground" />
              </motion.div>
              <div className="text-center space-y-1">
                <p className="font-display font-bold text-foreground text-lg">{t.captureOrUpload}</p>
                <p className="text-sm text-muted-foreground">{t.takePhotoLeaf}</p>
              </div>
              <div className="flex gap-2 w-full">
                <Button
                  onClick={() => fileRef.current?.click()}
                  className="flex-1 gradient-earth text-earth-foreground font-display font-bold h-11"
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Take Photo
                </Button>
                <Button
                  onClick={() => {
                    const input = document.createElement("input");
                    input.type = "file";
                    input.accept = "image/*";
                    input.onchange = (e) => handleImage(e as unknown as React.ChangeEvent<HTMLInputElement>);
                    input.click();
                  }}
                  variant="outline"
                  className="flex-1 font-display font-bold h-11"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Gallery
                </Button>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {[
              { icon: "🎯", text: t.tipFocus },
              { icon: "💡", text: t.tipLighting },
              { icon: "📷", text: t.tipSteady },
              { icon: "🌿", text: t.tipBothParts },
            ].map((tip, i) => (
              <div key={i} className="flex-shrink-0 glass-card px-3 py-2 flex items-center gap-2 min-w-[140px]">
                <span className="text-base">{tip.icon}</span>
                <span className="text-[11px] text-muted-foreground leading-tight">{tip.text}</span>
              </div>
            ))}
          </div>
        </motion.div>
      ) : (
        <div className="space-y-3">
          <div className="relative rounded-2xl overflow-hidden shadow-lg">
            <img src={image} alt="Uploaded plant" className="w-full max-h-72 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 to-transparent pointer-events-none" />
            <button
              onClick={handleReset}
              className="absolute top-3 right-3 bg-foreground/70 backdrop-blur-sm rounded-full p-2 hover:bg-foreground/90 transition-colors"
            >
              <X className="h-4 w-4 text-primary-foreground" />
            </button>
            {!result && !analyzing && !error && (
              <div className="absolute bottom-3 left-3 right-3">
                <Button onClick={handleAnalyze} className="w-full gradient-earth text-earth-foreground font-display font-bold h-11 shadow-lg">
                  <Shield className="h-5 w-5 mr-2" />
                  {t.analyzeImage}
                </Button>
              </div>
            )}
          </div>
          {analyzing && (
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-2 py-2">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <span className="text-sm text-muted-foreground font-medium">AI is analyzing your plant...</span>
              </div>
              <AnalysisSkeleton />
            </div>
          )}
        </div>
      )}

      {error && <AIErrorCard message={error} onRetry={handleAnalyze} />}

      <AnimatePresence>
        {result && disease && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            
            {/* Diagnosis Card — compact header + confidence */}
            {result.healthy ? (
              <div className="glass-card p-4 border-l-4 border-l-primary bg-primary/5">
                <div className="flex items-center gap-3">
                  <Heart className="h-6 w-6 text-primary flex-shrink-0" />
                  <div>
                    <h3 className="font-display font-bold text-foreground">Plant looks healthy! 🌱</h3>
                    {disease.description && <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{disease.description}</p>}
                  </div>
                </div>
              </div>
            ) : (
              <div className="glass-card p-4 space-y-3">
                {/* Disease name + severity inline */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0" />
                    <h3 className="font-display font-bold text-foreground text-[15px] truncate">{disease.name}</h3>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full flex-shrink-0 ${
                    disease.severity === "High" 
                      ? "bg-destructive/10 text-destructive" 
                      : disease.severity === "Medium"
                      ? "bg-harvest/10 text-harvest"
                      : "bg-primary/10 text-primary"
                  }`}>
                    {disease.severity}
                  </span>
                </div>

                {/* Crop + description compact */}
                <p className="text-xs text-muted-foreground">
                  <strong className="text-foreground">{disease.crop}</strong>
                  {disease.description && <> — {disease.description}</>}
                </p>

                {/* Confidence bar */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{t.confidence}</span>
                  <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }} 
                      animate={{ width: `${disease.confidence}%` }} 
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="h-full bg-primary rounded-full" 
                    />
                  </div>
                  <span className="text-xs font-bold text-primary">{disease.confidence}%</span>
                </div>
              </div>
            )}

            {/* Treatment — two compact side-by-side cards on larger screens */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="glass-card p-3 border-t-2 border-t-primary">
                <p className="text-[10px] font-bold uppercase tracking-wider text-primary mb-2">💊 {t.chemicalTreatment}</p>
                <ul className="space-y-1.5">
                  {disease.treatment.split(/(?<=\.)\s+/).filter(Boolean).map((s, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                      <span className="text-xs text-foreground leading-relaxed">{s.trim()}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="glass-card p-3 border-t-2 border-t-leaf">
                <p className="text-[10px] font-bold uppercase tracking-wider text-leaf mb-2">🌿 {t.organicAlternative}</p>
                <ul className="space-y-1.5">
                  {disease.organic.split(/(?<=\.)\s+/).filter(Boolean).map((s, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-leaf mt-1.5 flex-shrink-0" />
                      <span className="text-xs text-foreground leading-relaxed">{s.trim()}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Prevention — compact list */}
            <div className="glass-card p-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-primary" />
                {t.preventionTips}
              </p>
              <div className="space-y-1.5">
                {disease.prevention.map((tip, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    transition={{ delay: i * 0.08 }}
                    className="flex items-start gap-2"
                  >
                    <CheckCircle className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-foreground leading-relaxed">{tip}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            <Button onClick={handleReset} variant="outline" className="w-full font-display h-10">
              <Camera className="h-4 w-4 mr-2" />
              {t.scanAnother}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DiseaseDetect;
