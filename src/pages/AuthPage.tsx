import { useState } from "react";
import { motion } from "framer-motion";
import { Sprout, Mail, Lock, User, ArrowRight, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Language } from "@/i18n/translations";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await signIn(email, password);
        toast.success(t.welcomeBack.replace(", farmer!", "! 🌾"));
      } else {
        await signUp(email, password, fullName);
        toast.success(t.createAccount + " 🌱");
      }
      navigate("/");
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const langOptions: { value: Language; label: string }[] = [
    { value: "en", label: "EN" },
    { value: "hi", label: "हिं" },
    { value: "ta", label: "த" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
        {/* Language Switcher */}
        <div className="flex justify-center gap-2 mb-6">
          {langOptions.map((l) => (
            <button
              key={l.value}
              onClick={() => setLanguage(l.value)}
              className={`px-3 py-1.5 rounded-full text-sm font-bold transition-colors ${
                language === l.value ? "gradient-hero text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>

        <div className="text-center mb-8">
          <div className="h-16 w-16 rounded-2xl gradient-hero flex items-center justify-center mx-auto mb-4">
            <Sprout className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold font-display text-foreground">{t.appName}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isLogin ? t.welcomeBack : t.joinFarmers}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card p-6 space-y-4">
          {!isLogin && (
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input placeholder={t.fullName} value={fullName} onChange={(e) => setFullName(e.target.value)}
                className="pl-10 h-11 bg-card" required={!isLogin} />
            </div>
          )}
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input type="email" placeholder={t.email} value={email} onChange={(e) => setEmail(e.target.value)}
              className="pl-10 h-11 bg-card" required />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input type="password" placeholder={t.password} value={password} onChange={(e) => setPassword(e.target.value)}
              className="pl-10 h-11 bg-card" required minLength={6} />
          </div>

          <Button type="submit" disabled={loading} className="w-full h-11 gradient-hero text-primary-foreground font-display font-bold">
            {loading ? t.pleaseWait : isLogin ? t.signIn : t.createAccount}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-4">
          {isLogin ? t.noAccount : t.haveAccount}{" "}
          <button onClick={() => setIsLogin(!isLogin)} className="text-primary font-medium underline">
            {isLogin ? t.signUp : t.signIn}
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default AuthPage;
