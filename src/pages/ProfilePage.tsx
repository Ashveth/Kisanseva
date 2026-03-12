import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, MapPin, Sprout, Droplets, Save, LogOut, Phone, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Language } from "@/i18n/translations";

interface Profile {
  full_name: string;
  phone: string;
  location: string;
  farm_size: string;
  soil_type: string;
  crops_grown: string[];
  irrigation_method: string;
  preferred_language: string;
  farming_experience: string;
}

const soilTypes = ["Clay", "Sandy", "Loamy", "Silt", "Peaty", "Chalky", "Red Soil", "Black Soil", "Alluvial"];
const irrigationMethods = ["Drip", "Sprinkler", "Flood", "Furrow", "Rainfed", "Canal"];
const experienceLevels = ["Beginner (0-2 years)", "Intermediate (3-5 years)", "Experienced (5-10 years)", "Expert (10+ years)"];

const ProfilePage = () => {
  const { user, signOut } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<Profile>({
    full_name: "", phone: "", location: "", farm_size: "", soil_type: "",
    crops_grown: [], irrigation_method: "", preferred_language: "en", farming_experience: "",
  });
  const [cropsInput, setCropsInput] = useState("");

  const languages = [
    { value: "en", label: t.langEnglish },
    { value: "hi", label: t.langHindi },
    { value: "ta", label: t.langTamil },
  ];

  useEffect(() => {
    if (user) fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    const { data } = await supabase.from("profiles").select("*").eq("id", user!.id).single();
    if (data) {
      setProfile({
        full_name: data.full_name || "", phone: data.phone || "", location: data.location || "",
        farm_size: data.farm_size || "", soil_type: data.soil_type || "",
        crops_grown: (data.crops_grown as string[]) || [], irrigation_method: data.irrigation_method || "",
        preferred_language: data.preferred_language || "en", farming_experience: data.farming_experience || "",
      });
      setCropsInput(((data.crops_grown as string[]) || []).join(", "));
      if (data.preferred_language && ["en", "hi", "ta"].includes(data.preferred_language)) {
        setLanguage(data.preferred_language as Language);
      }
    }
  };

  const handleSave = async () => {
    setLoading(true);
    const crops = cropsInput.split(",").map((c) => c.trim()).filter(Boolean);
    const updatedProfile = { ...profile, crops_grown: crops, preferred_language: language };
    const { error } = await supabase.from("profiles").update(updatedProfile).eq("id", user!.id);
    setLoading(false);
    if (error) {
      toast.error(t.profileSaveFailed);
    } else {
      toast.success(t.profileSaved);
    }
  };

  const handleLanguageChange = (lang: string) => {
    setProfile({ ...profile, preferred_language: lang });
    setLanguage(lang as Language);
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-display text-foreground flex items-center gap-2">
          <User className="h-7 w-7 text-primary" />
          {t.myProfile}
        </h1>
        <Button variant="outline" size="sm" onClick={handleLogout} className="text-destructive">
          <LogOut className="h-4 w-4 mr-1" /> {t.signOut}
        </Button>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
        <div className="glass-card p-4 space-y-3">
          <h2 className="font-display font-bold text-foreground text-sm">{t.basicInfo}</h2>
          <Input placeholder={t.fullName} value={profile.full_name} onChange={(e) => setProfile({ ...profile, full_name: e.target.value })} className="bg-card" />
          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input placeholder={t.phone} value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} className="pl-10 bg-card" />
            </div>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input placeholder={t.location} value={profile.location} onChange={(e) => setProfile({ ...profile, location: e.target.value })} className="pl-10 bg-card" />
            </div>
          </div>
          <Select value={language} onValueChange={handleLanguageChange}>
            <SelectTrigger className="bg-card"><Globe className="h-4 w-4 mr-2 text-muted-foreground" /><SelectValue placeholder={t.preferredLanguage} /></SelectTrigger>
            <SelectContent>{languages.map((l) => <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>)}</SelectContent>
          </Select>
        </div>

        <div className="glass-card p-4 space-y-3">
          <h2 className="font-display font-bold text-foreground text-sm">{t.farmDetails}</h2>
          <Input placeholder={t.farmSizePlaceholder} value={profile.farm_size} onChange={(e) => setProfile({ ...profile, farm_size: e.target.value })} className="bg-card" />
          <Select value={profile.soil_type} onValueChange={(v) => setProfile({ ...profile, soil_type: v })}>
            <SelectTrigger className="bg-card"><SelectValue placeholder={t.soilType} /></SelectTrigger>
            <SelectContent>{soilTypes.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
          </Select>
          <Input placeholder={t.cropsGrownPlaceholder} value={cropsInput} onChange={(e) => setCropsInput(e.target.value)} className="bg-card" />
          <Select value={profile.irrigation_method} onValueChange={(v) => setProfile({ ...profile, irrigation_method: v })}>
            <SelectTrigger className="bg-card"><Droplets className="h-4 w-4 mr-2 text-muted-foreground" /><SelectValue placeholder={t.irrigationMethod} /></SelectTrigger>
            <SelectContent>{irrigationMethods.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={profile.farming_experience} onValueChange={(v) => setProfile({ ...profile, farming_experience: v })}>
            <SelectTrigger className="bg-card"><Sprout className="h-4 w-4 mr-2 text-muted-foreground" /><SelectValue placeholder={t.farmingExperience} /></SelectTrigger>
            <SelectContent>{experienceLevels.map((e) => <SelectItem key={e} value={e}>{e}</SelectItem>)}</SelectContent>
          </Select>
        </div>

        <Button onClick={handleSave} disabled={loading} className="w-full h-11 gradient-hero text-primary-foreground font-display font-bold">
          <Save className="h-4 w-4 mr-2" />
          {loading ? t.saving : t.saveProfile}
        </Button>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
