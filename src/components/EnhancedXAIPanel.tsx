import { motion } from "framer-motion";
import { Brain, User, Ruler, Target, Zap, MessageCircle, AlertTriangle } from "lucide-react";
import type { SensorData, DecisionState } from "@/hooks/useSimulationEngine";

interface EnhancedXAIPanelProps {
  sensors: SensorData;
  decision: DecisionState;
  isActive: boolean;
}

const EnhancedXAIPanel = ({ sensors, decision, isActive }: EnhancedXAIPanelProps) => {
  const getStatusColor = (status: DecisionState["status"]) => {
    switch (status) {
      case "SAFE": return "neon-green";
      case "WARNING": return "neon-yellow";
      case "CRITICAL": return "accent";
    }
  };

  return (
    <motion.div 
      className="glass-panel p-4 h-full"
      animate={isActive ? { borderColor: "hsl(var(--accent))" } : { borderColor: "hsl(var(--border))" }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Brain className="w-4 h-4 text-accent" />
        <h3 className="font-display text-sm text-accent cyber-glow-text">EXPLAINABLE AI</h3>
        {isActive && (
          <motion.div
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            className="ml-auto"
          >
            <Zap className="w-4 h-4 text-accent" />
          </motion.div>
        )}
      </div>

      <div className="space-y-3">
        {/* Detected Object */}
        <div className={`flex items-center gap-3 p-3 rounded-lg border ${
          sensors.pedestrianDetected 
            ? "bg-accent/20 border-accent/50" 
            : "bg-card/50 border-border/30"
        }`}>
          <div className={`p-2 rounded-lg ${sensors.pedestrianDetected ? "bg-accent/30" : "bg-primary/20"}`}>
            <User className={`w-4 h-4 ${sensors.pedestrianDetected ? "text-accent" : "text-primary"}`} />
          </div>
          <div>
            <div className="text-[10px] text-muted-foreground uppercase">Detected Object</div>
            <div className={`font-mono text-sm font-semibold ${
              sensors.pedestrianDetected ? "text-accent" : "text-foreground"
            }`}>
              {sensors.pedestrianDetected ? "Pedestrian (J-Walker)" : "None"}
            </div>
          </div>
        </div>

        {/* Distance */}
        <div className="flex items-center gap-3 p-3 rounded-lg bg-card/50 border border-border/30">
          <div className="p-2 rounded-lg bg-neon-yellow/20">
            <Ruler className="w-4 h-4 text-neon-yellow" />
          </div>
          <div className="flex-1">
            <div className="text-[10px] text-muted-foreground uppercase">Distance</div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  animate={{ width: `${Math.max(0, 100 - (sensors.distanceToPedestrian / 50) * 100)}%` }}
                  className={`h-full ${
                    sensors.distanceToPedestrian < 15 ? "bg-accent" : "bg-neon-green"
                  }`}
                />
              </div>
              <span className={`font-mono text-sm font-semibold min-w-[3.5rem] text-right ${
                sensors.distanceToPedestrian < 15 ? "text-accent" : "text-foreground"
              }`}>
                {sensors.distanceToPedestrian > 100 ? "—" : `${sensors.distanceToPedestrian.toFixed(1)}m`}
              </span>
            </div>
          </div>
        </div>

        {/* Collision Probability */}
        <div className="flex items-center gap-3 p-3 rounded-lg bg-card/50 border border-border/30">
          <div className="p-2 rounded-lg bg-accent/20">
            <Target className="w-4 h-4 text-accent" />
          </div>
          <div className="flex-1">
            <div className="text-[10px] text-muted-foreground uppercase">Collision Probability</div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  animate={{ width: `${decision.collisionProbability}%` }}
                  className={`h-full ${
                    decision.collisionProbability > 60 ? "bg-accent" : 
                    decision.collisionProbability > 30 ? "bg-neon-yellow" : "bg-neon-green"
                  }`}
                />
              </div>
              <span className={`font-mono text-sm font-semibold min-w-[2.5rem] text-right ${
                decision.collisionProbability > 60 ? "text-accent" : "text-foreground"
              }`}>
                {decision.collisionProbability.toFixed(0)}%
              </span>
            </div>
          </div>
        </div>

        {/* Action Taken */}
        <motion.div 
          className={`p-3 rounded-lg border ${
            decision.action === "BRAKING" 
              ? "bg-accent/20 border-accent/50" 
              : decision.action === "SLOW_DOWN"
                ? "bg-neon-yellow/20 border-neon-yellow/50"
                : "bg-neon-green/20 border-neon-green/50"
          }`}
          animate={decision.action === "BRAKING" ? { scale: [1, 1.02, 1] } : {}}
          transition={{ duration: 0.3, repeat: decision.action === "BRAKING" ? Infinity : 0 }}
        >
          <div className="flex items-center gap-2">
            {decision.action === "BRAKING" && (
              <AlertTriangle className="w-5 h-5 text-accent" />
            )}
            <div>
              <div className="text-[10px] text-muted-foreground uppercase">Action Taken</div>
              <div className={`font-mono text-lg font-bold text-${getStatusColor(decision.status)}`}>
                {decision.action}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Plain Language Reason */}
        <div className="p-3 rounded-lg bg-primary/10 border border-primary/30">
          <div className="flex items-start gap-2">
            <MessageCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-[10px] text-muted-foreground uppercase mb-1">Plain-Language Reason</div>
              <p className="text-xs text-foreground leading-relaxed">
                "{decision.explanation}"
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EnhancedXAIPanel;
