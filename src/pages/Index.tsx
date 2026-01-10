import { useState, useCallback } from "react";
import MissionHeader from "@/components/MissionHeader";
import UrbanViewport from "@/components/UrbanViewport";
import DecisionRationale from "@/components/DecisionRationale";
import PriorityIndicator from "@/components/PriorityIndicator";
import ScenarioControls from "@/components/ScenarioControls";
import ResponseTimeGraph from "@/components/ResponseTimeGraph";
import SystemStatus from "@/components/SystemStatus";
import PerceptionConfidence from "@/components/PerceptionConfidence";
import AlertBanner from "@/components/AlertBanner";
import DecisionLogic from "@/components/DecisionLogic";
import ExplainableAIPanel from "@/components/ExplainableAIPanel";
import SafetyAnalytics from "@/components/SafetyAnalytics";
import SensorViewToggle from "@/components/SensorViewToggle";

const Index = () => {
  const [fogActive, setFogActive] = useState(false);
  const [trafficSurge, setTrafficSurge] = useState(false);
  const [jWalkerActive, setJWalkerActive] = useState(false);
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [obstacleDetected, setObstacleDetected] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [intersectionReached, setIntersectionReached] = useState(false);
  const [demoRunning, setDemoRunning] = useState(false);
  const [sensorViewEnabled, setSensorViewEnabled] = useState(false);
  const [currentResponseTime, setCurrentResponseTime] = useState(45);
  
  // Explainable AI state
  const [pedestrianDistance, setPedestrianDistance] = useState(50);
  const [collisionProbability, setCollisionProbability] = useState(5);
  const [actionTaken, setActionTaken] = useState<"BRAKING" | "CONTINUE">("CONTINUE");
  const [xaiReason, setXaiReason] = useState("No immediate hazards detected. Continuing normal operation.");

  const handleJWalker = useCallback(() => {
    if (jWalkerActive) return;
    setJWalkerActive(true);
    setEmergencyMode(true);
    setShowAlert(true);
    setAlertMessage("EMERGENCY BRAKING ENGAGED - Pedestrian detected crossing outside designated area");
    setCurrentResponseTime(85);
    
    setPedestrianDistance(8);
    setCollisionProbability(87);
    setActionTaken("BRAKING");
    setXaiReason("High collision risk due to sudden pedestrian crossing.");
    
    setTimeout(() => {
      setJWalkerActive(false);
      setEmergencyMode(false);
      setPedestrianDistance(50);
      setCollisionProbability(5);
      setActionTaken("CONTINUE");
      setXaiReason("No immediate hazards detected. Continuing normal operation.");
      setCurrentResponseTime(45);
    }, 3000);
  }, [jWalkerActive]);

  const handleFog = useCallback(() => setFogActive((prev) => !prev), []);
  const handleTrafficSurge = useCallback(() => setTrafficSurge((prev) => !prev), []);
  const handleObstacleDetected = useCallback(() => {
    setObstacleDetected(true);
    setTimeout(() => setObstacleDetected(false), 500);
  }, []);
  const handleIntersectionReached = useCallback(() => {
    setIntersectionReached(true);
    setTimeout(() => setIntersectionReached(false), 100);
  }, []);

  const handleDemoMode = useCallback(() => {
    if (demoRunning) return;
    setDemoRunning(true);
    
    setTimeout(() => { setIntersectionReached(true); setPedestrianDistance(35); setCollisionProbability(15); }, 500);
    setTimeout(() => { setPedestrianDistance(20); setCollisionProbability(45); }, 2000);
    setTimeout(() => { setPedestrianDistance(12); setCollisionProbability(72); setActionTaken("BRAKING"); setXaiReason("Pedestrian detected. Collision probability exceeds threshold."); setCurrentResponseTime(78); }, 3000);
    setTimeout(() => { setJWalkerActive(true); setEmergencyMode(true); setShowAlert(true); setAlertMessage("EMERGENCY BRAKING - Pedestrian in path"); setPedestrianDistance(5); setCollisionProbability(92); setCurrentResponseTime(92); }, 3500);
    setTimeout(() => { setCollisionProbability(0); setXaiReason("Vehicle stopped. Pedestrian cleared."); }, 5000);
    setTimeout(() => { setJWalkerActive(false); setEmergencyMode(false); setPedestrianDistance(50); setCollisionProbability(5); setActionTaken("CONTINUE"); setXaiReason("No immediate hazards detected."); setDemoRunning(false); setIntersectionReached(false); setCurrentResponseTime(45); }, 7000);
  }, [demoRunning]);

  const handleReset = useCallback(() => {
    setFogActive(false); setTrafficSurge(false); setJWalkerActive(false); setEmergencyMode(false);
    setObstacleDetected(false); setShowAlert(false); setAlertMessage(""); setIntersectionReached(false);
    setDemoRunning(false); setPedestrianDistance(50); setCollisionProbability(5); setActionTaken("CONTINUE");
    setXaiReason("No immediate hazards detected. Continuing normal operation."); setCurrentResponseTime(45);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden opacity-20">
        <div className="w-full h-1 bg-primary/10 scanline" />
      </div>

      <AlertBanner show={showAlert} message={alertMessage} onDismiss={() => setShowAlert(false)} />

      <div className="container mx-auto p-4 space-y-4">
        <MissionHeader emergencyMode={emergencyMode} />

        <div className="glass-panel p-3 text-center">
          <p className="text-sm text-primary font-mono tracking-wide">
            "Every autonomous decision is logged, explained, and auditable."
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left Column */}
          <div className="lg:col-span-3 space-y-4">
            <ScenarioControls onJWalker={handleJWalker} onFog={handleFog} onTrafficSurge={handleTrafficSurge} onDemoMode={handleDemoMode} onReset={handleReset} fogActive={fogActive} trafficActive={trafficSurge} jWalkerActive={jWalkerActive} demoRunning={demoRunning} />
            <SensorViewToggle sensorViewEnabled={sensorViewEnabled} onToggle={() => setSensorViewEnabled(!sensorViewEnabled)} />
            <DecisionLogic pedestrianDistance={pedestrianDistance} collisionProbability={collisionProbability} actionTaken={actionTaken} isActive={emergencyMode} />
            <SystemStatus fogActive={fogActive} emergencyMode={emergencyMode} />
          </div>

          {/* Center Column */}
          <div className="lg:col-span-6 space-y-4">
            <div className="aspect-[16/10] min-h-[400px]">
              <UrbanViewport fogActive={fogActive} trafficSurge={trafficSurge} jWalkerActive={jWalkerActive} sensorViewEnabled={sensorViewEnabled} onObstacleDetected={handleObstacleDetected} onIntersectionReached={handleIntersectionReached} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ExplainableAIPanel detectedObject={jWalkerActive ? "Pedestrian (J-Walker)" : "None"} distance={pedestrianDistance} collisionProbability={collisionProbability} actionTaken={actionTaken} reason={xaiReason} isActive={emergencyMode} />
              <SafetyAnalytics currentResponseTime={currentResponseTime} isEmergency={emergencyMode} isBraking={actionTaken === "BRAKING"} pedestrianDistance={pedestrianDistance} />
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-3 space-y-4">
            <div className="h-[calc(100vh-420px)] min-h-[300px]">
              <DecisionRationale pedestrianDetected={jWalkerActive} pedestrianDistance={pedestrianDistance} collisionProbability={collisionProbability} actionTaken={actionTaken} fogActive={fogActive} intersectionReached={intersectionReached} isEmergency={emergencyMode} />
            </div>
            <PriorityIndicator emergencyMode={emergencyMode} fogActive={fogActive} pedestrianDetected={jWalkerActive} />
            <PerceptionConfidence fogActive={fogActive} />
          </div>
        </div>

        <footer className="glass-panel p-3 flex items-center justify-between text-[10px] text-muted-foreground font-mono">
          <div className="flex items-center gap-4">
            <span className="text-primary font-semibold">URBANDRIVE AI</span>
            <span>v1.0.0</span>
            <span className="text-neon-green">● CONNECTED</span>
          </div>
          <div className="flex items-center gap-4">
            <span>LATENCY: 12ms</span>
            <span>SMART AUTONOMOUS VEHICLE SIMULATOR</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
