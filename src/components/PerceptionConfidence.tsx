import { motion } from "framer-motion";
import { Eye, AlertTriangle, CheckCircle } from "lucide-react";

interface PerceptionConfidenceProps {
  fogActive: boolean;
}

const PerceptionConfidence = ({ fogActive }: PerceptionConfidenceProps) => {
  const confidence = fogActive ? 45 : 94;
  const isLow = confidence < 70;

  return (
    <div className={`glass-panel p-4 transition-all duration-500 ${
      isLow ? "border-neon-yellow/50" : ""
    }`}>
      <div className="flex items-center gap-2 mb-3">
        <Eye className={`w-4 h-4 ${isLow ? "text-neon-yellow" : "text-primary"}`} />
        <h3 className="font-display text-sm text-primary cyber-glow-text">PERCEPTION</h3>
        {isLow ? (
          <AlertTriangle className="w-3 h-3 text-neon-yellow ml-auto animate-pulse" />
        ) : (
          <CheckCircle className="w-3 h-3 text-neon-green ml-auto" />
        )}
      </div>

      {/* Circular Gauge */}
      <div className="relative w-32 h-32 mx-auto">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke="hsl(220 25% 15%)"
            strokeWidth="8"
            fill="none"
          />
          {/* Progress circle */}
          <motion.circle
            cx="50"
            cy="50"
            r="40"
            stroke={isLow ? "hsl(45 100% 50%)" : "hsl(195 100% 50%)"}
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            initial={{ strokeDasharray: "0 251.2" }}
            animate={{ strokeDasharray: `${(confidence / 100) * 251.2} 251.2` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{
              filter: isLow 
                ? "drop-shadow(0 0 8px hsl(45 100% 50% / 0.5))" 
                : "drop-shadow(0 0 8px hsl(195 100% 50% / 0.5))"
            }}
          />
        </svg>
        
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span 
            className={`text-3xl font-display font-bold ${isLow ? "text-neon-yellow" : "text-primary"}`}
            animate={isLow ? { scale: [1, 1.05, 1] } : {}}
            transition={{ duration: 0.5, repeat: isLow ? Infinity : 0 }}
          >
            {confidence}%
          </motion.span>
          <span className="text-[10px] text-muted-foreground uppercase">Confidence</span>
        </div>
      </div>

      {/* Status message */}
      <div className={`mt-4 p-2 rounded text-center text-[11px] font-mono ${
        isLow 
          ? "bg-neon-yellow/10 text-neon-yellow border border-neon-yellow/30" 
          : "bg-neon-green/10 text-neon-green border border-neon-green/30"
      }`}>
        {isLow 
          ? "⚠ REDUCED VISIBILITY - CAUTION MODE" 
          : "✓ ALL SENSORS NOMINAL"
        }
      </div>
    </div>
  );
};

export default PerceptionConfidence;
