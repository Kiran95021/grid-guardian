import { motion } from "framer-motion";
import { Code, Eye, Gauge, AlertTriangle, CheckCircle } from "lucide-react";

interface DecisionLogicProps {
  pedestrianDistance: number;
  collisionProbability: number;
  actionTaken: "BRAKING" | "CONTINUE";
  isActive: boolean;
}

const DecisionLogic = ({ 
  pedestrianDistance, 
  collisionProbability, 
  actionTaken,
  isActive 
}: DecisionLogicProps) => {
  const safetyThreshold = 15; // meters
  const riskThreshold = 60; // percentage

  return (
    <div className="glass-panel p-4">
      <div className="flex items-center gap-2 mb-4">
        <Code className="w-4 h-4 text-primary" />
        <h3 className="font-display text-sm text-primary cyber-glow-text">DECISION LOGIC (SIMPLIFIED)</h3>
      </div>

      {/* Pseudocode Display */}
      <div className="bg-card/80 rounded-lg p-3 font-mono text-xs border border-border/50 mb-4">
        <div className="space-y-1">
          <div className={`${pedestrianDistance < safetyThreshold ? "text-accent font-semibold" : "text-muted-foreground"}`}>
            <span className="text-primary">IF</span> pedestrian_distance &lt; safety_threshold
          </div>
          <div className={`pl-4 ${collisionProbability > riskThreshold ? "text-accent font-semibold" : "text-muted-foreground"}`}>
            <span className="text-primary">AND</span> collision_probability &gt; risk_threshold
          </div>
          <div className={`pl-4 ${actionTaken === "BRAKING" ? "text-accent font-semibold" : "text-muted-foreground"}`}>
            <span className="text-primary">THEN</span> apply_brake
          </div>
          <div className={`${actionTaken === "CONTINUE" ? "text-neon-green font-semibold" : "text-muted-foreground"}`}>
            <span className="text-primary">ELSE</span> continue_driving
          </div>
        </div>
      </div>

      {/* Live Values */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="w-3 h-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Pedestrian Distance:</span>
          </div>
          <span className={`font-mono text-sm ${pedestrianDistance < safetyThreshold ? "text-accent" : "text-neon-green"}`}>
            {pedestrianDistance.toFixed(1)}m
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gauge className="w-3 h-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Collision Probability:</span>
          </div>
          <span className={`font-mono text-sm ${collisionProbability > riskThreshold ? "text-accent" : "text-neon-green"}`}>
            {collisionProbability.toFixed(0)}%
          </span>
        </div>

        <div className="h-px bg-border/30 my-2" />

        <motion.div 
          className={`flex items-center justify-center gap-2 p-3 rounded-lg border ${
            actionTaken === "BRAKING" 
              ? "bg-accent/20 border-accent/50" 
              : "bg-neon-green/20 border-neon-green/50"
          }`}
          animate={isActive ? { scale: [1, 1.02, 1] } : {}}
          transition={{ duration: 0.5, repeat: isActive ? Infinity : 0 }}
        >
          {actionTaken === "BRAKING" ? (
            <AlertTriangle className="w-4 h-4 text-accent" />
          ) : (
            <CheckCircle className="w-4 h-4 text-neon-green" />
          )}
          <span className={`font-mono text-sm font-bold ${
            actionTaken === "BRAKING" ? "text-accent" : "text-neon-green"
          }`}>
            ACTION: {actionTaken}
          </span>
        </motion.div>
      </div>

      {/* Future Scope Note */}
      <div className="mt-4 pt-3 border-t border-border/30">
        <div className="text-[10px] text-muted-foreground italic">
          Lane change, steering → <span className="text-primary">Simulated / Future Scope</span>
        </div>
      </div>
    </div>
  );
};

export default DecisionLogic;
