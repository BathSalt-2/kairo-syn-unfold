import { useState } from "react";
import { LandingPage } from "@/components/LandingPage";
import { LoadingScreen } from "@/components/LoadingScreen";
import { KairosynInterface } from "@/components/KairosynInterface";

const Index = () => {
  const [currentView, setCurrentView] = useState<"landing" | "loading" | "interface">("landing");

  const handleEnterConsciousness = () => {
    setCurrentView("loading");
  };

  const handleLoadingComplete = () => {
    setCurrentView("interface");
  };

  if (currentView === "loading") {
    return <LoadingScreen onLoadingComplete={handleLoadingComplete} />;
  }

  if (currentView === "interface") {
    return <KairosynInterface />;
  }

  return <LandingPage onEnterConsciousness={handleEnterConsciousness} />;
};

export default Index;
