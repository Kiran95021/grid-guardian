import { motion } from "framer-motion";
import { Play, RotateCcw, PersonStanding, Sparkles, Square } from "lucide-react";

interface SimulationControlsProps {
  isRunning: boolean;
  isDemoMode: boolean;
  onStart: () => void;
  onReset: () => void;
  onTriggerPedestrian: () => void;
  onDemoMode: () => void;
}

const SimulationControls = ({
  isRunning,
  isDemoMode,
  onStart,
  onReset,
  onTriggerPedestrian,
  onDemoMode,
}: SimulationControlsProps) => {
  return (
    <div className="glass-panel p-4">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-4 h-4 text-primary" />
        <h3 className="font-display text-sm text-primary cyber-glow-text">SIMULATION CONTROLS</h3>
      </div>

      <div className="space-y-3">
        {/* Demo Mode - Primary CTA */}
        <motion.button
          onClick={onDemoMode}
          disabled={isDemoMode}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`w-full p-4 rounded-lg border flex items-center justify-center gap-3 font-semibold transition-all ${
            isDemoMode
              ? "border-neon-green/50 bg-neon-green/20 text-neon-green cursor-not-allowed"
              : "border-primary bg-primary/20 text-primary hover:bg-primary/30 shadow-[0_0_15px_hsl(var(--primary)/0.3)]"
          }`}
        >
          {isDemoMode ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-5 h-5" />
              </motion.div>
              DEMO RUNNING...
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              START DEMO MODE
            </>
          )}
        </motion.button>

        <div className="h-px bg-border/30" />

        {/* Manual Controls */}
        <div className="grid grid-cols-2 gap-2">
          <motion.button
            onClick={onStart}
            disabled={isRunning || isDemoMode}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`p-3 rounded-lg border flex flex-col items-center gap-2 transition-all ${
              isRunning || isDemoMode
                ? "border-muted/30 bg-muted/10 text-muted-foreground cursor-not-allowed"
                : "border-neon-green/50 bg-neon-green/10 text-neon-green hover:bg-neon-green/20"
            }`}
          >
            <Play className="w-4 h-4" />
            <span className="text-xs">Start</span>
          </motion.button>

          <motion.button
            onClick={onReset}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="p-3 rounded-lg border border-muted/50 bg-muted/10 text-muted-foreground hover:bg-muted/20 flex flex-col items-center gap-2 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="text-xs">Reset</span>
          </motion.button>
        </div>

        {/* Trigger Pedestrian */}
        <motion.button
          onClick={onTriggerPedestrian}
          disabled={!isRunning && !isDemoMode}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`w-full p-3 rounded-lg border flex items-center justify-center gap-2 transition-all ${
            !isRunning && !isDemoMode
              ? "border-muted/30 bg-muted/10 text-muted-foreground cursor-not-allowed"
              : "border-accent/50 bg-accent/10 text-accent hover:bg-accent/20"
          }`}
        >
          <PersonStanding className="w-4 h-4" />
          <span className="text-sm font-medium">Trigger Pedestrian</span>
        </motion.button>
      </div>

      {/* Status Indicator */}
      <div className="mt-4 pt-3 border-t border-border/30">
        <div className="flex items-center justify-between text-[10px]">
          <span className="text-muted-foreground">SIMULATION STATUS</span>
          <span className={`font-mono font-semibold ${
            isDemoMode ? "text-neon-green" : isRunning ? "text-primary" : "text-muted-foreground"
          }`}>
            {isDemoMode ? "DEMO ACTIVE" : isRunning ? "RUNNING" : "IDLE"}
          </span>
        </div>
        <div className="mt-2 h-1 bg-muted rounded-full overflow-hidden">
          {(isRunning || isDemoMode) && (
            <motion.div
              className="h-full bg-primary"
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SimulationControls;
