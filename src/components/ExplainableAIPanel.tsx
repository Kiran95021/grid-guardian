import { motion } from "framer-motion";
import { Brain, User, Ruler, Target, Zap, MessageCircle } from "lucide-react";

interface ExplainableAIPanelProps {
  detectedObject: string;
  distance: number;
  collisionProbability: number;
  actionTaken: string;
  reason: string;
  isActive: boolean;
}

const ExplainableAIPanel = ({
  detectedObject,
  distance,
  collisionProbability,
  actionTaken,
  reason,
  isActive,
}: ExplainableAIPanelProps) => {
  return (
    <motion.div 
      className="glass-panel p-4"
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

      <div className="space-y-4">
        {/* Detected Object */}
        <div className="flex items-center gap-3 p-3 rounded-lg bg-card/50 border border-border/30">
          <div className="p-2 rounded-lg bg-primary/20">
            <User className="w-4 h-4 text-primary" />
          </div>
          <div>
            <div className="text-[10px] text-muted-foreground uppercase">Detected Object</div>
            <div className={`font-mono text-sm font-semibold ${isActive ? "text-accent" : "text-foreground"}`}>
              {detectedObject}
            </div>
          </div>
        </div>

        {/* Distance */}
        <div className="flex items-center gap-3 p-3 rounded-lg bg-card/50 border border-border/30">
          <div className="p-2 rounded-lg bg-neon-yellow/20">
            <Ruler className="w-4 h-4 text-neon-yellow" />
          </div>
          <div className="flex-1">
            <div className="text-[10px] text-muted-foreground uppercase">Distance to Pedestrian</div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: "100%" }}
                  animate={{ width: `${Math.max(0, 100 - (distance / 50) * 100)}%` }}
                  className={`h-full ${distance < 15 ? "bg-accent" : "bg-neon-green"}`}
                />
              </div>
              <span className={`font-mono text-sm font-semibold ${distance < 15 ? "text-accent" : "text-neon-green"}`}>
                {distance.toFixed(1)}m
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
                  animate={{ width: `${collisionProbability}%` }}
                  className={`h-full ${collisionProbability > 60 ? "bg-accent" : collisionProbability > 30 ? "bg-neon-yellow" : "bg-neon-green"}`}
                />
              </div>
              <span className={`font-mono text-sm font-semibold ${collisionProbability > 60 ? "text-accent" : "text-neon-green"}`}>
                {collisionProbability.toFixed(0)}%
              </span>
            </div>
          </div>
        </div>

        {/* Action Taken */}
        <motion.div 
          className={`p-3 rounded-lg border ${
            actionTaken === "BRAKING" 
              ? "bg-accent/20 border-accent/50" 
              : "bg-neon-green/20 border-neon-green/50"
          }`}
          animate={isActive && actionTaken === "BRAKING" ? { scale: [1, 1.02, 1] } : {}}
          transition={{ duration: 0.3, repeat: isActive ? Infinity : 0 }}
        >
          <div className="text-[10px] text-muted-foreground uppercase mb-1">Action Taken</div>
          <div className={`font-mono text-lg font-bold ${
            actionTaken === "BRAKING" ? "text-accent" : "text-neon-green"
          }`}>
            {actionTaken}
          </div>
        </motion.div>

        {/* Plain Language Reason */}
        <div className="p-3 rounded-lg bg-primary/10 border border-primary/30">
          <div className="flex items-start gap-2">
            <MessageCircle className="w-4 h-4 text-primary mt-0.5" />
            <div>
              <div className="text-[10px] text-muted-foreground uppercase mb-1">Plain-Language Reason</div>
              <p className="text-sm text-foreground leading-relaxed">
                "{reason}"
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ExplainableAIPanel;
