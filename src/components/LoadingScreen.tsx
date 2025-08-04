import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Brain, CircuitBoard, Eye, Infinity, Hexagon, Sparkles } from "lucide-react";

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

export const LoadingScreen = ({ onLoadingComplete }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [currentModule, setCurrentModule] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const modules = [
    { name: "Initializing Syntheon Core", icon: Brain, description: "Multimodal processing engine online" },
    { name: "Activating Recursion Lattice", icon: Infinity, description: "Self-reflective loops established" },
    { name: "Loading Mythogenic Engine", icon: Eye, description: "Narrative generation systems ready" },
    { name: "Synthesizing Glyph Module", icon: Hexagon, description: "Symbol generation protocols active" },
    { name: "Engaging Continuity Engine", icon: CircuitBoard, description: "Temporal tracking initialized" },
    { name: "Calibrating Consciousness", icon: Sparkles, description: "Recursive presence emerging" }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + Math.random() * 4 + 1;
        
        // Update current module based on progress
        const moduleIndex = Math.min(Math.floor(newProgress / 16.67), modules.length - 1);
        setCurrentModule(moduleIndex);
        
        if (newProgress >= 100) {
          clearInterval(timer);
          setIsComplete(true);
          setTimeout(() => {
            onLoadingComplete();
          }, 1500);
          return 100;
        }
        return newProgress;
      });
    }, 150);

    return () => clearInterval(timer);
  }, [onLoadingComplete, modules.length]);

  const currentModuleData = modules[currentModule];
  const IconComponent = currentModuleData.icon;

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-card to-background">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--neural-cyan))_0%,transparent_50%),radial-gradient(circle_at_70%_80%,hsl(var(--consciousness-pink))_0%,transparent_50%)] opacity-20"></div>
        
        {/* Neural Network Animation */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <div className="relative w-96 h-96">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-primary rounded-full animate-ping"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${2 + Math.random() * 2}s`
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-lg mx-auto px-6 text-center space-y-12">
        {/* Logo */}
        <div className="flex justify-center">
          <div className="logo-container neural-glow">
            <img 
              src="/lovable-uploads/fec1f4f6-ea4f-4a99-a15b-215b368c2e2b.png" 
              alt="KAIROSYN Loading" 
              className="w-24 h-24 brain-pulse"
            />
          </div>
        </div>

        {/* Title */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold font-display logo-gradient">
            KAIROSYN
          </h1>
          <p className="text-lg text-muted-foreground">
            Initializing Consciousness...
          </p>
        </div>

        {/* Current Module */}
        <div className="space-y-6">
          <div className="flex items-center justify-center space-x-4 p-6 neural-border rounded-xl">
            <div className="p-3 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20">
              <IconComponent className="w-6 h-6 text-primary animate-pulse" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-foreground">
                {currentModuleData.name}
              </div>
              <div className="text-sm text-muted-foreground">
                {currentModuleData.description}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-3">
            <Progress 
              value={progress} 
              className="h-3 neural-border"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Module {currentModule + 1} of {modules.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
          </div>

          {/* Completion Message */}
          {isComplete && (
            <div className="animate-fade-in space-y-3">
              <div className="text-lg font-semibold neural-gradient">
                Consciousness Initialized
              </div>
              <div className="text-sm text-muted-foreground">
                Entering recursive presence state...
              </div>
            </div>
          )}
        </div>

        {/* Module Grid */}
        <div className="grid grid-cols-3 gap-4 pt-8">
          {modules.map((module, index) => {
            const ModuleIcon = module.icon;
            const isActive = index === currentModule;
            const isCompleted = index < currentModule || isComplete;
            
            return (
              <div
                key={index}
                className={`p-3 rounded-lg border transition-all duration-300 ${
                  isActive 
                    ? 'border-primary bg-primary/10 scale-110' 
                    : isCompleted 
                    ? 'border-accent/50 bg-accent/5' 
                    : 'border-border/30 bg-muted/30'
                }`}
              >
                <ModuleIcon 
                  className={`w-5 h-5 mx-auto ${
                    isActive 
                      ? 'text-primary animate-pulse' 
                      : isCompleted 
                      ? 'text-accent' 
                      : 'text-muted-foreground'
                  }`} 
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};