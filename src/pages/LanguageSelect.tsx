
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

const LanguageSelect = () => {
  const navigate = useNavigate();
  const { setLanguage } = useLanguage();

  const handleLanguageSelect = (lang: "en" | "te" | "hi") => {
    setLanguage(lang);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white shadow-sm">
        <CardContent className="pt-6 space-y-6">
          <h1 className="text-center text-xl text-gray-700 mb-6">Select Your Language / భాష ఎంచుకోండి / भाषा चुनें</h1>
          <div className="space-y-4">
            <Button 
              variant="outline" 
              className="w-full text-lg py-6 bg-white hover:bg-gray-50"
              onClick={() => handleLanguageSelect("en")}
            >
              English
            </Button>
            <Button 
              variant="outline" 
              className="w-full text-lg py-6 bg-white hover:bg-gray-50"
              onClick={() => handleLanguageSelect("te")}
            >
              తెలుగు (Telugu)
            </Button>
            <Button 
              variant="outline" 
              className="w-full text-lg py-6 bg-white hover:bg-gray-50"
              onClick={() => handleLanguageSelect("hi")}
            >
              हिंदी (Hindi)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default LanguageSelect;
