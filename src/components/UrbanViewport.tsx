import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Vehicle {
  id: string;
  x: number;
  y: number;
  type: "ego" | "aggressive" | "following" | "unpredictable";
  speed: number;
  direction: number;
}

interface Pedestrian {
  id: string;
  x: number;
  y: number;
  isJWalking: boolean;
}

interface UrbanViewportProps {
  fogActive: boolean;
  trafficSurge: boolean;
  jWalkerActive: boolean;
  onObstacleDetected: () => void;
  onIntersectionReached?: () => void;
}

const UrbanViewport = ({ fogActive, trafficSurge, jWalkerActive, onObstacleDetected, onIntersectionReached }: UrbanViewportProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [egoVehicle, setEgoVehicle] = useState({ x: 50, y: 60 });
  const [lidarAngle, setLidarAngle] = useState(0);
  const [lidarPulseIntensity, setLidarPulseIntensity] = useState(1);
  const [vehicles, setVehicles] = useState<Vehicle[]>([
    { id: "v1", x: 30, y: 40, type: "following", speed: 1, direction: 0 },
    { id: "v2", x: 70, y: 35, type: "aggressive", speed: 2, direction: 180 },
  ]);
  const [pedestrians, setPedestrians] = useState<Pedestrian[]>([
    { id: "p1", x: 85, y: 55, isJWalking: false },
  ]);
  const [trafficLights, setTrafficLights] = useState<"red" | "yellow" | "green">("green");
  const [emergencyBraking, setEmergencyBraking] = useState(false);
  const [atIntersection, setAtIntersection] = useState(false);

  // Enhanced LiDAR rotation with pulsing
  useEffect(() => {
    const interval = setInterval(() => {
      setLidarAngle((prev) => (prev + 4) % 360);
      setLidarPulseIntensity((prev) => 0.6 + Math.sin(Date.now() / 300) * 0.4);
    }, 40);
    return () => clearInterval(interval);
  }, []);

  // Traffic light cycle with intersection detection
  useEffect(() => {
    const cycle = setInterval(() => {
      setTrafficLights((prev) => {
        const next = prev === "green" ? "yellow" : prev === "yellow" ? "red" : "green";
        if (next === "red") {
          setAtIntersection(true);
          onIntersectionReached?.();
          setTimeout(() => setAtIntersection(false), 3000);
        }
        return next;
      });
    }, 5000);
    return () => clearInterval(cycle);
  }, [onIntersectionReached]);

  // Vehicle movement
  useEffect(() => {
    const interval = setInterval(() => {
      setVehicles((prev) =>
        prev.map((v) => ({
          ...v,
          x: v.type === "aggressive" 
            ? ((v.x - v.speed * 0.5 + 100) % 100)
            : ((v.x + v.speed * 0.3 + 100) % 100),
        }))
      );
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Traffic surge effect
  useEffect(() => {
    if (trafficSurge) {
      const newVehicles: Vehicle[] = Array.from({ length: 5 }, (_, i) => ({
        id: `surge-${i}`,
        x: Math.random() * 80 + 10,
        y: Math.random() * 30 + 25,
        type: Math.random() > 0.5 ? "following" : "aggressive" as const,
        speed: Math.random() * 2 + 0.5,
        direction: Math.random() > 0.5 ? 0 : 180,
      }));
      setVehicles((prev) => [...prev, ...newVehicles]);
    } else {
      setVehicles((prev) => prev.filter((v) => !v.id.startsWith("surge")));
    }
  }, [trafficSurge]);

  // J-Walker effect with enhanced visuals
  useEffect(() => {
    if (jWalkerActive) {
      setEmergencyBraking(true);
      onObstacleDetected();
      setPedestrians((prev) => [
        ...prev,
        { id: "jwalker", x: 45, y: 58, isJWalking: true },
      ]);
      setTimeout(() => {
        setEmergencyBraking(false);
        setPedestrians((prev) => prev.filter((p) => p.id !== "jwalker"));
      }, 3000);
    }
  }, [jWalkerActive, onObstacleDetected]);

  const getBoundingBoxColor = (type: Vehicle["type"]) => {
    switch (type) {
      case "aggressive": return "border-neon-red";
      case "following": return "border-neon-green";
      default: return "border-primary";
    }
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full glass-panel overflow-hidden"
    >
      {/* Grid background */}
      <div className="absolute inset-0 grid-background opacity-30" />
      
      {/* Fog/Static noise overlay */}
      <AnimatePresence>
        {fogActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-30 pointer-events-none"
            style={{
              background: `
                repeating-linear-gradient(
                  0deg,
                  transparent,
                  transparent 2px,
                  rgba(255,255,255,0.03) 2px,
                  rgba(255,255,255,0.03) 4px
                )
              `,
            }}
          >
            {/* Animated static noise */}
            <div className="absolute inset-0 opacity-60" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
              animation: 'staticNoise 0.1s steps(10) infinite',
            }} />
            <div className="absolute inset-0 bg-muted/50 backdrop-blur-sm" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
              <div className="text-neon-yellow font-mono text-sm blink-alert">⚠ SENSOR DEGRADATION</div>
              <div className="text-muted-foreground text-xs mt-1">Visibility Reduced</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Emergency braking overlay */}
      <AnimatePresence>
        {emergencyBraking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, repeat: Infinity }}
            className="absolute inset-0 bg-accent/20 z-40 pointer-events-none border-4 border-accent"
          />
        )}
      </AnimatePresence>

      {/* Roads with neon cyan path */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Main horizontal road */}
        <rect x="0" y="45" width="100" height="20" fill="hsl(220 25% 12%)" />
        
        {/* Neon cyan vehicle path */}
        <motion.line 
          x1="0" y1="55" x2="40" y2="55" 
          stroke="hsl(195 100% 50%)" 
          strokeWidth="0.8"
          strokeOpacity={0.6}
          animate={{ strokeOpacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.line 
          x1="60" y1="55" x2="100" y2="55" 
          stroke="hsl(195 100% 50%)" 
          strokeWidth="0.8"
          strokeOpacity={0.6}
          animate={{ strokeOpacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        />
        
        {/* Lane dividers */}
        <line x1="0" y1="55" x2="100" y2="55" stroke="hsl(45 100% 50%)" strokeWidth="0.3" strokeDasharray="3,2" />
        
        {/* Vertical road */}
        <rect x="40" y="0" width="20" height="100" fill="hsl(220 25% 12%)" />
        <line x1="50" y1="0" x2="50" y2="45" stroke="hsl(45 100% 50%)" strokeWidth="0.3" strokeDasharray="3,2" />
        <line x1="50" y1="65" x2="50" y2="100" stroke="hsl(45 100% 50%)" strokeWidth="0.3" strokeDasharray="3,2" />
        
        {/* Road markings */}
        <line x1="0" y1="45" x2="40" y2="45" stroke="hsl(0 0% 100%)" strokeWidth="0.4" />
        <line x1="60" y1="45" x2="100" y2="45" stroke="hsl(0 0% 100%)" strokeWidth="0.4" />
        <line x1="0" y1="65" x2="40" y2="65" stroke="hsl(0 0% 100%)" strokeWidth="0.4" />
        <line x1="60" y1="65" x2="100" y2="65" stroke="hsl(0 0% 100%)" strokeWidth="0.4" />
        
        {/* Crosswalk */}
        {[...Array(5)].map((_, i) => (
          <rect key={i} x={41 + i * 4} y="65" width="2" height="5" fill="hsl(0 0% 90%)" />
        ))}
      </svg>

      {/* Traffic Lights */}
      <div className="absolute top-[42%] left-[38%] flex flex-col gap-1 z-10">
        <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
          trafficLights === "red" ? "bg-neon-red shadow-[0_0_10px_hsl(var(--neon-red))]" : "bg-neon-red/20"
        }`} />
        <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
          trafficLights === "yellow" ? "bg-neon-yellow shadow-[0_0_10px_hsl(var(--neon-yellow))]" : "bg-neon-yellow/20"
        }`} />
        <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
          trafficLights === "green" ? "bg-neon-green shadow-[0_0_10px_hsl(var(--neon-green))]" : "bg-neon-green/20"
        }`} />
      </div>

      {/* Other Vehicles with Bounding Boxes */}
      {vehicles.map((vehicle) => (
        <motion.div
          key={vehicle.id}
          className={`absolute w-8 h-5 ${getBoundingBoxColor(vehicle.type)} border-2 rounded-sm flex items-center justify-center`}
          style={{
            left: `${vehicle.x}%`,
            top: `${vehicle.y}%`,
            transform: `rotate(${vehicle.direction}deg)`,
          }}
          animate={{ x: [-2, 2, -2], y: [-1, 1, -1] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        >
          <div className={`w-6 h-3 rounded-sm ${
            vehicle.type === "aggressive" ? "bg-neon-red/60" : 
            vehicle.type === "following" ? "bg-neon-green/60" : "bg-primary/60"
          }`} />
          <span className="absolute -top-5 text-[8px] font-mono text-muted-foreground whitespace-nowrap">
            {vehicle.type.toUpperCase()}
          </span>
        </motion.div>
      ))}

      {/* Pedestrians with enhanced J-Walker visuals */}
      {pedestrians.map((ped) => (
        <motion.div
          key={ped.id}
          className={`absolute flex flex-col items-center ${
            ped.isJWalking ? "z-50" : "z-10"
          }`}
          style={{ left: `${ped.x}%`, top: `${ped.y}%` }}
          animate={ped.isJWalking ? { x: [-30, 0], scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 0.5 }}
        >
          {ped.isJWalking && (
            <motion.div
              animate={{ opacity: [1, 0.3, 1], scale: [1, 1.1, 1] }}
              transition={{ duration: 0.3, repeat: Infinity }}
              className="absolute -top-8 px-2 py-1 bg-accent/90 rounded text-[8px] font-mono text-accent-foreground font-bold whitespace-nowrap"
            >
              ⚠ COLLISION RISK
            </motion.div>
          )}
          <motion.div 
            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
              ped.isJWalking 
                ? "border-accent bg-accent/40" 
                : "border-neon-green bg-neon-green/40"
            }`}
            animate={ped.isJWalking ? { 
              boxShadow: ["0 0 0 0 hsl(var(--accent))", "0 0 20px 5px hsl(var(--accent) / 0.5)", "0 0 0 0 hsl(var(--accent))"]
            } : {}}
            transition={{ duration: 0.5, repeat: ped.isJWalking ? Infinity : 0 }}
          >
            <span className="text-[10px]">🚶</span>
          </motion.div>
          <span className={`mt-1 text-[7px] font-mono whitespace-nowrap ${
            ped.isJWalking ? "text-accent font-bold" : "text-muted-foreground"
          }`}>
            {ped.isJWalking ? "J-WALKER" : "PED"}
          </span>
        </motion.div>
      ))}

      {/* Ego Vehicle with Enhanced LiDAR */}
      <div
        className="absolute z-20"
        style={{ left: `${egoVehicle.x}%`, top: `${egoVehicle.y}%`, transform: "translate(-50%, -50%)" }}
      >
        {/* LiDAR Point Cloud Effect - Enhanced pulsing */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div 
            className="w-44 h-44 rounded-full border-2 border-primary/40"
            style={{ transform: "translate(-50%, -50%)" }}
            animate={{ 
              scale: [1, 1.15, 1],
              opacity: [0.3, 0.6, 0.3],
              borderColor: ["hsl(195 100% 50% / 0.3)", "hsl(195 100% 50% / 0.6)", "hsl(195 100% 50% / 0.3)"]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute w-36 h-36 rounded-full border border-primary/30"
            style={{ transform: "translate(-50%, -50%)" }}
            animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
          />
          <motion.div 
            className="absolute w-28 h-28 rounded-full border border-primary/20"
            style={{ transform: "translate(-50%, -50%)" }}
            animate={{ scale: [1, 1.08, 1], opacity: [0.1, 0.4, 0.1] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
          />
          
          {/* Scanning line */}
          <motion.div
            className="absolute w-22 h-1 bg-gradient-to-r from-primary via-primary to-transparent origin-left"
            style={{ 
              rotate: lidarAngle,
              left: "50%",
              top: "50%",
              translateX: "-50%",
              translateY: "-50%",
              opacity: lidarPulseIntensity,
            }}
          />
          
          {/* Point cloud dots */}
          {[...Array(32)].map((_, i) => {
            const angle = (i * 11.25 + lidarAngle) * (Math.PI / 180);
            const distance = 25 + Math.random() * 25;
            return (
              <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 rounded-full bg-primary"
                style={{
                  left: `calc(50% + ${Math.cos(angle) * distance}px)`,
                  top: `calc(50% + ${Math.sin(angle) * distance}px)`,
                  opacity: 0.2 + Math.random() * 0.6,
                  boxShadow: "0 0 4px hsl(195 100% 50% / 0.5)"
                }}
                animate={{ scale: [0.5, 1.2, 0.5] }}
                transition={{ duration: 0.4, delay: i * 0.03 }}
              />
            );
          })}
        </div>

        {/* Ego Vehicle */}
        <motion.div 
          className="relative w-14 h-8 bg-gradient-to-r from-primary to-cyber-glow rounded-md shadow-[0_0_25px_hsl(var(--primary)/0.6)] border border-primary/60"
          animate={emergencyBraking ? { x: [0, -4, 4, -2, 2, 0] } : {}}
          transition={{ duration: 0.2, repeat: emergencyBraking ? 3 : 0 }}
        >
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-cyber-glow-intense rounded-full animate-pulse shadow-[0_0_10px_hsl(var(--primary))]" />
          <div className="absolute top-1.5 left-1.5 w-2 h-1.5 bg-foreground/90 rounded-sm" />
          <div className="absolute top-1.5 right-1.5 w-2 h-1.5 bg-foreground/90 rounded-sm" />
          {atIntersection && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-primary/80 rounded text-[7px] font-mono text-primary-foreground whitespace-nowrap"
            >
              HOLDING
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Viewport HUD */}
      <div className="absolute top-3 left-3 flex flex-col gap-1">
        <div className="text-[10px] font-mono text-primary">SIMVERSE_VIEWPORT_v3.0</div>
        <div className="text-[10px] font-mono text-muted-foreground">
          LIDAR: {(lidarAngle / 3.6).toFixed(0)}° | RES: 0.1m | FPS: 60
        </div>
      </div>

      <div className="absolute top-3 right-3 text-right">
        <div className={`text-[10px] font-mono ${trafficLights === "red" ? "text-neon-red" : trafficLights === "yellow" ? "text-neon-yellow" : "text-neon-green"}`}>
          SIGNAL: {trafficLights.toUpperCase()}
        </div>
        <div className="text-[10px] font-mono text-muted-foreground">
          OBJECTS: {vehicles.length + pedestrians.length}
        </div>
      </div>

      {/* Scanline effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="w-full h-8 scanline" />
      </div>
    </div>
  );
};

export default UrbanViewport;
