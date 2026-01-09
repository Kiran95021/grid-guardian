import { useState, useCallback } from "react";
import MissionHeader from "@/components/MissionHeader";
import UrbanViewport from "@/components/UrbanViewport";
import DecisionFeed from "@/components/DecisionFeed";
import PriorityMatrix from "@/components/PriorityMatrix";
import ScenarioControls from "@/components/ScenarioControls";
import ResponseTimeGraph from "@/components/ResponseTimeGraph";
import SystemStatus from "@/components/SystemStatus";
import PerceptionConfidence from "@/components/PerceptionConfidence";
import AlertBanner from "@/components/AlertBanner";

const Index = () => {
  const [fogActive, setFogActive] = useState(false);
  const [trafficSurge, setTrafficSurge] = useState(false);
  const [jWalkerActive, setJWalkerActive] = useState(false);
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [obstacleDetected, setObstacleDetected] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const handleJWalker = useCallback(() => {
    if (jWalkerActive) return;
    setJWalkerActive(true);
    setEmergencyMode(true);
    setShowAlert(true);
    setAlertMessage("EMERGENCY BRAKING ENGAGED - Pedestrian detected crossing outside designated area");
    
    setTimeout(() => {
      setJWalkerActive(false);
      setEmergencyMode(false);
    }, 3000);
  }, [jWalkerActive]);

  const handleFog = useCallback(() => {
    setFogActive((prev) => !prev);
  }, []);

  const handleTrafficSurge = useCallback(() => {
    setTrafficSurge((prev) => !prev);
  }, []);

  const handleObstacleDetected = useCallback(() => {
    setObstacleDetected(true);
    setTimeout(() => setObstacleDetected(false), 500);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Scanline overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden opacity-30">
        <div className="w-full h-1 bg-primary/10 scanline" />
      </div>

      {/* Alert Banner */}
      <AlertBanner 
        show={showAlert} 
        message={alertMessage}
        onDismiss={() => setShowAlert(false)}
      />

      <div className="container mx-auto p-4 space-y-4">
        {/* Header */}
        <MissionHeader emergencyMode={emergencyMode} />

        {/* Main 3-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left Column - Controls & Status */}
          <div className="lg:col-span-3 space-y-4">
            <ScenarioControls
              onJWalker={handleJWalker}
              onFog={handleFog}
              onTrafficSurge={handleTrafficSurge}
              fogActive={fogActive}
              trafficActive={trafficSurge}
              jWalkerActive={jWalkerActive}
            />
            <SystemStatus 
              fogActive={fogActive} 
              emergencyMode={emergencyMode} 
            />
            <PerceptionConfidence fogActive={fogActive} />
          </div>

          {/* Center Column - Main Viewport & Graphs */}
          <div className="lg:col-span-6 space-y-4">
            <div className="aspect-[16/10] min-h-[400px]">
              <UrbanViewport
                fogActive={fogActive}
                trafficSurge={trafficSurge}
                jWalkerActive={jWalkerActive}
                onObstacleDetected={handleObstacleDetected}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-64">
                <ResponseTimeGraph obstacleDetected={obstacleDetected} />
              </div>
              <div className="h-64">
                <PriorityMatrix 
                  emergencyMode={emergencyMode}
                  fogMode={fogActive}
                  trafficSurge={trafficSurge}
                />
              </div>
            </div>
          </div>

          {/* Right Column - Decision Feed */}
          <div className="lg:col-span-3">
            <div className="h-[calc(100vh-180px)] min-h-[600px]">
              <DecisionFeed 
                emergencyEvent={jWalkerActive}
                fogActive={fogActive}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="glass-panel p-3 flex items-center justify-between text-[10px] text-muted-foreground font-mono">
          <div className="flex items-center gap-4">
            <span>AV-TWIN v3.2.1</span>
            <span>|</span>
            <span>BUILD: 2024.01.15</span>
            <span>|</span>
            <span className="text-neon-green">● CONNECTED</span>
          </div>
          <div className="flex items-center gap-4">
            <span>LATENCY: 12ms</span>
            <span>|</span>
            <span>FPS: 60</span>
            <span>|</span>
            <span>© AUTONOMOUS SYSTEMS LAB</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
