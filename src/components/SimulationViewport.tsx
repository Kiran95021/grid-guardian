import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { VehicleState, PedestrianState } from "@/hooks/useSimulationEngine";

interface SimulationViewportProps {
  vehicle: VehicleState;
  pedestrian: PedestrianState;
  isRunning: boolean;
  emergencyBraking: boolean;
}

const SimulationViewport = ({ 
  vehicle, 
  pedestrian, 
  isRunning,
  emergencyBraking 
}: SimulationViewportProps) => {
  const [lidarAngle, setLidarAngle] = useState(0);
  const [trafficLight, setTrafficLight] = useState<"red" | "yellow" | "green">("green");

  // LiDAR rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setLidarAngle((prev) => (prev + 4) % 360);
    }, 40);
    return () => clearInterval(interval);
  }, []);

  // Traffic light cycle
  useEffect(() => {
    const cycle = setInterval(() => {
      setTrafficLight((prev) => 
        prev === "green" ? "yellow" : prev === "yellow" ? "red" : "green"
      );
    }, 5000);
    return () => clearInterval(cycle);
  }, []);

  return (
    <div className="relative w-full h-full glass-panel overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 grid-background opacity-20" />
      
      {/* Emergency braking overlay */}
      <AnimatePresence>
        {emergencyBraking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.2, 0.5, 0.2] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, repeat: Infinity }}
            className="absolute inset-0 bg-accent/20 z-40 pointer-events-none border-4 border-accent"
          />
        )}
      </AnimatePresence>

      {/* Road Layout */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
        {/* Main horizontal road */}
        <rect x="0" y="45" width="100" height="20" fill="hsl(220 25% 10%)" />
        
        {/* Vehicle path (neon cyan) */}
        <motion.line 
          x1="0" y1="55" x2="40" y2="55" 
          stroke="hsl(195 100% 50%)" 
          strokeWidth="0.6"
          animate={{ strokeOpacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.line 
          x1="60" y1="55" x2="100" y2="55" 
          stroke="hsl(195 100% 50%)" 
          strokeWidth="0.6"
          animate={{ strokeOpacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        />
        
        {/* Lane dividers */}
        <line x1="0" y1="55" x2="100" y2="55" stroke="hsl(45 100% 50%)" strokeWidth="0.3" strokeDasharray="3,2" />
        
        {/* Vertical road (intersection) */}
        <rect x="40" y="0" width="20" height="100" fill="hsl(220 25% 10%)" />
        <line x1="50" y1="0" x2="50" y2="45" stroke="hsl(45 100% 50%)" strokeWidth="0.3" strokeDasharray="3,2" />
        <line x1="50" y1="65" x2="50" y2="100" stroke="hsl(45 100% 50%)" strokeWidth="0.3" strokeDasharray="3,2" />
        
        {/* Road edges */}
        <line x1="0" y1="45" x2="40" y2="45" stroke="hsl(0 0% 100%)" strokeWidth="0.4" />
        <line x1="60" y1="45" x2="100" y2="45" stroke="hsl(0 0% 100%)" strokeWidth="0.4" />
        <line x1="0" y1="65" x2="40" y2="65" stroke="hsl(0 0% 100%)" strokeWidth="0.4" />
        <line x1="60" y1="65" x2="100" y2="65" stroke="hsl(0 0% 100%)" strokeWidth="0.4" />
        
        {/* Stop line */}
        <line x1="39" y1="45" x2="39" y2="65" stroke="hsl(0 0% 100%)" strokeWidth="0.8" />
        
        {/* Crosswalk */}
        {[...Array(6)].map((_, i) => (
          <rect key={i} x={41 + i * 3} y="65" width="2" height="6" fill="hsl(0 0% 90%)" />
        ))}
        {[...Array(6)].map((_, i) => (
          <rect key={`top-${i}`} x={41 + i * 3} y="39" width="2" height="6" fill="hsl(0 0% 90%)" />
        ))}
      </svg>

      {/* Traffic Light */}
      <div className="absolute top-[38%] left-[36%] flex flex-col gap-1 z-10 bg-card/80 p-1 rounded">
        <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
          trafficLight === "red" ? "bg-neon-red shadow-[0_0_10px_hsl(var(--neon-red))]" : "bg-neon-red/20"
        }`} />
        <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
          trafficLight === "yellow" ? "bg-neon-yellow shadow-[0_0_10px_hsl(var(--neon-yellow))]" : "bg-neon-yellow/20"
        }`} />
        <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
          trafficLight === "green" ? "bg-neon-green shadow-[0_0_10px_hsl(var(--neon-green))]" : "bg-neon-green/20"
        }`} />
      </div>

      {/* Pedestrian */}
      <AnimatePresence>
        {pedestrian.isActive && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="absolute z-30"
            style={{ 
              left: `${pedestrian.x}%`, 
              top: `${pedestrian.y}%`,
              transform: "translate(-50%, -50%)"
            }}
          >
            {/* Collision warning */}
            {pedestrian.isJWalking && (
              <motion.div
                animate={{ opacity: [1, 0.3, 1], scale: [1, 1.1, 1] }}
                transition={{ duration: 0.4, repeat: Infinity }}
                className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-accent/90 rounded text-[9px] font-mono text-white font-bold whitespace-nowrap"
              >
                ⚠ COLLISION RISK
              </motion.div>
            )}
            
            <motion.div 
              className="w-8 h-8 rounded-full border-3 flex items-center justify-center border-accent bg-accent/30"
              animate={{ 
                boxShadow: ["0 0 0 0 hsl(var(--accent))", "0 0 25px 8px hsl(var(--accent) / 0.4)", "0 0 0 0 hsl(var(--accent))"]
              }}
              transition={{ duration: 0.6, repeat: Infinity }}
            >
              <span className="text-lg">🚶</span>
            </motion.div>
            
            <div className="text-[8px] font-mono text-accent font-bold text-center mt-1">
              J-WALKER
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ego Vehicle with LiDAR */}
      <div
        className="absolute z-20"
        style={{ 
          left: `${vehicle.x}%`, 
          top: `${vehicle.y}%`, 
          transform: "translate(-50%, -50%)" 
        }}
      >
        {/* LiDAR visualization */}
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Outer pulse rings */}
          <motion.div 
            className="absolute w-48 h-48 rounded-full border-2 border-primary/30"
            style={{ transform: "translate(-50%, -50%)" }}
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute w-36 h-36 rounded-full border border-primary/40"
            style={{ transform: "translate(-50%, -50%)" }}
            animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
          />
          <motion.div 
            className="absolute w-24 h-24 rounded-full border border-primary/50"
            style={{ transform: "translate(-50%, -50%)" }}
            animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
          />
          
          {/* Scanning beam */}
          <motion.div
            className="absolute w-24 h-0.5 bg-gradient-to-r from-primary via-primary to-transparent origin-left"
            style={{ 
              rotate: lidarAngle,
              left: "50%",
              top: "50%",
              translateX: "-50%",
              translateY: "-50%",
            }}
          />
          
          {/* Point cloud */}
          {[...Array(24)].map((_, i) => {
            const angle = (i * 15 + lidarAngle) * (Math.PI / 180);
            const distance = 30 + Math.sin(i * 0.5) * 15;
            return (
              <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 rounded-full bg-primary"
                style={{
                  left: `calc(50% + ${Math.cos(angle) * distance}px)`,
                  top: `calc(50% + ${Math.sin(angle) * distance}px)`,
                  boxShadow: "0 0 4px hsl(195 100% 50% / 0.6)"
                }}
                animate={{ opacity: [0.3, 0.8, 0.3] }}
                transition={{ duration: 0.5, delay: i * 0.02 }}
              />
            );
          })}
        </div>

        {/* Vehicle body */}
        <motion.div 
          className="relative w-16 h-10 bg-gradient-to-r from-primary to-cyber-glow rounded-md shadow-[0_0_30px_hsl(var(--primary)/0.5)] border-2 border-primary/60"
          animate={emergencyBraking ? { x: [0, -3, 3, -2, 2, 0] } : {}}
          transition={{ duration: 0.15, repeat: emergencyBraking ? 5 : 0 }}
        >
          {/* Sensor dome */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-cyber-glow-intense rounded-full animate-pulse shadow-[0_0_15px_hsl(var(--primary))]" />
          
          {/* Headlights */}
          <div className="absolute top-2 left-2 w-2 h-2 bg-foreground/90 rounded-sm" />
          <div className="absolute top-2 right-2 w-2 h-2 bg-foreground/90 rounded-sm" />
          
          {/* Brake lights */}
          {vehicle.isBraking && (
            <>
              <motion.div 
                className="absolute bottom-1 left-1 w-2 h-1 bg-neon-red rounded-sm"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 0.2, repeat: Infinity }}
              />
              <motion.div 
                className="absolute bottom-1 right-1 w-2 h-1 bg-neon-red rounded-sm"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 0.2, repeat: Infinity }}
              />
            </>
          )}
          
          {/* Status label */}
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className={`absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded text-[8px] font-mono font-bold whitespace-nowrap ${
              vehicle.isBraking 
                ? "bg-accent/90 text-white" 
                : vehicle.isMoving 
                  ? "bg-primary/80 text-primary-foreground"
                  : "bg-muted/80 text-muted-foreground"
            }`}
          >
            {vehicle.isBraking ? "BRAKING" : vehicle.isMoving ? "MOVING" : "STOPPED"}
          </motion.div>
        </motion.div>
      </div>

      {/* HUD Overlay */}
      <div className="absolute top-3 left-3 flex flex-col gap-1">
        <div className="text-[10px] font-mono text-primary font-semibold">URBANDRIVE_AI_v2.0</div>
        <div className="text-[9px] font-mono text-muted-foreground">
          LIDAR: {(lidarAngle / 3.6).toFixed(0)}° | RES: 0.1m
        </div>
      </div>

      <div className="absolute top-3 right-3 text-right">
        <div className={`text-[10px] font-mono font-semibold ${
          trafficLight === "red" ? "text-neon-red" : 
          trafficLight === "yellow" ? "text-neon-yellow" : "text-neon-green"
        }`}>
          SIGNAL: {trafficLight.toUpperCase()}
        </div>
        <div className="text-[9px] font-mono text-muted-foreground">
          {isRunning ? "● LIVE" : "○ IDLE"}
        </div>
      </div>

      {/* Speed indicator */}
      <div className="absolute bottom-3 left-3 bg-card/80 backdrop-blur-sm rounded px-2 py-1">
        <div className="text-[9px] text-muted-foreground">SPEED</div>
        <div className="text-lg font-mono font-bold text-primary">
          {(vehicle.speed * 3.6).toFixed(0)}
          <span className="text-[10px] text-muted-foreground ml-1">km/h</span>
        </div>
      </div>

      {/* Scanline effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        <div className="w-full h-6 scanline" />
      </div>
    </div>
  );
};

export default SimulationViewport;
