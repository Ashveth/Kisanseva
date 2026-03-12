import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Upload, AlertTriangle, CheckCircle, Shield, Leaf, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { diseases } from "@/data/mockData";
import { useLanguage } from "@/contexts/LanguageContext";

const DiseaseDetect = () => {
  const [image, setImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<typeof diseases[0] | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const { t } = useLanguage();

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setImage(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setResult(diseases[Math.floor(Math.random() * diseases.length)]);
      setAnalyzing(false);
    }, 2000);
  };

  const handleReset = () => {
    setImage(null);
    setResult(null);
  };

  return (
    <div className="container py-6 space-y-6">
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
          <button
            onClick={() => fileRef.current?.click()}
            className="glass-card w-full p-8 flex flex-col items-center gap-4 hover:shadow-elevated transition-shadow cursor-pointer border-2 border-dashed border-primary/30"
          >
            <div className="h-20 w-20 rounded-full gradient-earth flex items-center justify-center">
              <Camera className="h-10 w-10 text-earth-foreground" />
            </div>
            <div className="text-center">
              <p className="font-display font-bold text-foreground">{t.captureOrUpload}</p>
              <p className="text-sm text-muted-foreground mt-1">{t.takePhotoLeaf}</p>
            </div>
          </button>
          <div className="glass-card p-4">
            <p className="text-xs font-display font-bold text-foreground mb-2">{t.tipsTitle}</p>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• {t.tipFocus}</li>
              <li>• {t.tipLighting}</li>
              <li>• {t.tipSteady}</li>
              <li>• {t.tipBothParts}</li>
            </ul>
          </div>
        </motion.div>
      ) : (
        <div className="space-y-4">
          <div className="relative">
            <img src={image} alt="Uploaded plant" className="w-full max-h-64 object-cover rounded-xl" />
            <button onClick={handleReset} className="absolute top-2 right-2 bg-foreground/60 rounded-full p-1.5">
              <X className="h-4 w-4 text-primary-foreground" />
            </button>
          </div>
          {!result && (
            <Button onClick={handleAnalyze} disabled={analyzing} className="w-full gradient-earth text-earth-foreground font-display font-bold h-12">
              {analyzing ? (
                <span className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-earth-foreground/30 border-t-earth-foreground rounded-full animate-spin" />
                  {t.analyzing}
                </span>
              ) : (
                <>
                  <Shield className="h-5 w-5 mr-2" />
                  {t.analyzeImage}
                </>
              )}
            </Button>
          )}
        </div>
      )}

      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="glass-card p-4 border-l-4 border-l-destructive">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  <h3 className="font-display font-bold text-foreground">{result.name} {t.detected}</h3>
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                  result.severity === "High" ? "bg-destructive/10 text-destructive" : "bg-harvest/10 text-harvest"
                }`}>
                  {result.severity} {t.severity}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{t.crop}: {result.crop}</p>
              <div className="mt-2 bg-muted/50 rounded-lg p-2 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                <p className="text-sm text-foreground">{t.confidence}: <strong>{result.confidence}%</strong></p>
              </div>
            </div>

            <div className="glass-card p-4 space-y-3">
              <h3 className="font-display font-bold text-foreground flex items-center gap-2">{t.treatment}</h3>
              <div className="bg-primary/5 rounded-lg p-3">
                <p className="text-xs font-medium text-primary mb-1">{t.chemicalTreatment}</p>
                <p className="text-sm text-foreground">{result.treatment}</p>
              </div>
              <div className="bg-leaf/10 rounded-lg p-3">
                <p className="text-xs font-medium text-leaf mb-1">{t.organicAlternative}</p>
                <p className="text-sm text-foreground">{result.organic}</p>
              </div>
            </div>

            <div className="glass-card p-4">
              <h3 className="font-display font-bold text-foreground flex items-center gap-2 mb-2">
                <Leaf className="h-4 w-4 text-primary" /> {t.preventionTips}
              </h3>
              {result.prevention.map((tip, i) => (
                <p key={i} className="text-sm text-foreground flex items-start gap-2 mb-1.5">
                  <CheckCircle className="h-3.5 w-3.5 text-primary mt-0.5 flex-shrink-0" />
                  {tip}
                </p>
              ))}
            </div>

            <Button onClick={handleReset} variant="outline" className="w-full font-display">
              {t.scanAnother}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DiseaseDetect;
