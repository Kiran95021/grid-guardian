import MissionHeader from "@/components/MissionHeader";
import SimulationViewport from "@/components/SimulationViewport";
import SimulationControls from "@/components/SimulationControls";
import SimulationMetricsPanel from "@/components/SimulationMetricsPanel";
import SensorDataPanel from "@/components/SensorDataPanel";
import EnhancedXAIPanel from "@/components/EnhancedXAIPanel";
import ActionLogPanel from "@/components/ActionLogPanel";
import DecisionLogic from "@/components/DecisionLogic";
import { useSimulationEngine } from "@/hooks/useSimulationEngine";

const Index = () => {
  const { state, actions } = useSimulationEngine();

  return (
    <div className="min-h-screen bg-background">
      {/* Scanline overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden opacity-20">
        <div className="w-full h-1 bg-primary/10 scanline" />
      </div>

      <div className="container mx-auto p-4 space-y-4">
        {/* Header */}
        <MissionHeader emergencyMode={state.decision.status === "CRITICAL"} />

        {/* Main 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left Column - Simulation Canvas */}
          <div className="lg:col-span-7 space-y-4">
            {/* Viewport */}
            <div className="aspect-[16/10] min-h-[350px]">
              <SimulationViewport
                vehicle={state.vehicle}
                pedestrian={state.pedestrian}
                isRunning={state.isRunning}
                emergencyBraking={state.vehicle.isBraking}
              />
            </div>

            {/* Controls & Decision Logic */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SimulationControls
                isRunning={state.isRunning}
                isDemoMode={state.isDemoMode}
                onStart={actions.startSimulation}
                onReset={actions.resetSimulation}
                onTriggerPedestrian={actions.triggerPedestrian}
                onDemoMode={actions.startDemoMode}
              />
              <DecisionLogic
                pedestrianDistance={state.sensors.distanceToPedestrian}
                collisionProbability={state.decision.collisionProbability}
                actionTaken={state.decision.action === "BRAKING" ? "BRAKING" : "CONTINUE"}
                isActive={state.decision.status === "CRITICAL"}
              />
            </div>
          </div>

          {/* Right Column - Explainability & Metrics */}
          <div className="lg:col-span-5 space-y-4">
            {/* XAI Panel */}
            <EnhancedXAIPanel
              sensors={state.sensors}
              decision={state.decision}
              isActive={state.decision.status === "CRITICAL"}
            />

            {/* Metrics & Sensors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SimulationMetricsPanel
                metrics={state.metrics}
                decision={state.decision}
              />
              <SensorDataPanel
                sensors={state.sensors}
                isActive={state.isRunning}
              />
            </div>

            {/* Action Log */}
            <ActionLogPanel logs={state.actionLog} />
          </div>
        </div>

        {/* Footer */}
        <footer className="glass-panel p-3 flex items-center justify-between text-[10px] text-muted-foreground font-mono">
          <div className="flex items-center gap-4">
            <span className="text-primary font-semibold">URBANDRIVE AI</span>
            <span>v2.0.0</span>
            <span className={state.isRunning ? "text-neon-green" : "text-muted-foreground"}>
              {state.isRunning ? "● RUNNING" : "○ IDLE"}
            </span>
          </div>
          <div className="hidden md:block text-primary/70 italic">
            "Every autonomous decision is logged, explained, and auditable."
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
