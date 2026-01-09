import { useEffect, useRef, useState } from "react";
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
}

const UrbanViewport = ({ fogActive, trafficSurge, jWalkerActive, onObstacleDetected }: UrbanViewportProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [egoVehicle, setEgoVehicle] = useState({ x: 50, y: 60 });
  const [lidarAngle, setLidarAngle] = useState(0);
  const [vehicles, setVehicles] = useState<Vehicle[]>([
    { id: "v1", x: 30, y: 40, type: "following", speed: 1, direction: 0 },
    { id: "v2", x: 70, y: 35, type: "aggressive", speed: 2, direction: 180 },
  ]);
  const [pedestrians, setPedestrians] = useState<Pedestrian[]>([
    { id: "p1", x: 85, y: 55, isJWalking: false },
  ]);
  const [trafficLights, setTrafficLights] = useState<"red" | "yellow" | "green">("green");
  const [emergencyBraking, setEmergencyBraking] = useState(false);

  // LiDAR rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setLidarAngle((prev) => (prev + 3) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Traffic light cycle
  useEffect(() => {
    const cycle = setInterval(() => {
      setTrafficLights((prev) => {
        if (prev === "green") return "yellow";
        if (prev === "yellow") return "red";
        return "green";
      });
    }, 5000);
    return () => clearInterval(cycle);
  }, []);

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

  // J-Walker effect
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
      
      {/* Fog overlay */}
      <AnimatePresence>
        {fogActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-b from-muted/80 to-muted/40 backdrop-blur-md z-30 pointer-events-none"
          />
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
            className="absolute inset-0 bg-neon-red/20 z-40 pointer-events-none border-4 border-neon-red"
          />
        )}
      </AnimatePresence>

      {/* Roads */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Main horizontal road */}
        <rect x="0" y="45" width="100" height="20" fill="hsl(220 25% 12%)" />
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

      {/* Pedestrians */}
      {pedestrians.map((ped) => (
        <motion.div
          key={ped.id}
          className={`absolute w-4 h-4 rounded-full border-2 ${
            ped.isJWalking ? "border-neon-yellow bg-neon-yellow/40 blink-alert" : "border-neon-green bg-neon-green/40"
          }`}
          style={{ left: `${ped.x}%`, top: `${ped.y}%` }}
          animate={ped.isJWalking ? { x: [-20, 0], scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 0.5 }}
        >
          <span className="absolute -top-5 text-[8px] font-mono text-neon-yellow whitespace-nowrap">
            {ped.isJWalking ? "⚠ J-WALKER" : "PED"}
          </span>
        </motion.div>
      ))}

      {/* Ego Vehicle with LiDAR */}
      <div
        className="absolute z-20"
        style={{ left: `${egoVehicle.x}%`, top: `${egoVehicle.y}%`, transform: "translate(-50%, -50%)" }}
      >
        {/* LiDAR Point Cloud Effect */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div 
            className="w-40 h-40 rounded-full border border-primary/30 lidar-pulse"
            style={{ transform: "translate(-50%, -50%)" }}
          />
          <div 
            className="absolute w-32 h-32 rounded-full border border-primary/20"
            style={{ transform: "translate(-50%, -50%)" }}
          />
          <div 
            className="absolute w-24 h-24 rounded-full border border-primary/10"
            style={{ transform: "translate(-50%, -50%)" }}
          />
          
          {/* Scanning line */}
          <motion.div
            className="absolute w-20 h-0.5 bg-gradient-to-r from-primary to-transparent origin-left"
            style={{ 
              rotate: lidarAngle,
              left: "50%",
              top: "50%",
              translateX: "-50%",
              translateY: "-50%",
            }}
          />
          
          {/* Point cloud dots */}
          {[...Array(24)].map((_, i) => {
            const angle = (i * 15 + lidarAngle) * (Math.PI / 180);
            const distance = 30 + Math.random() * 20;
            return (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-primary"
                style={{
                  left: `calc(50% + ${Math.cos(angle) * distance}px)`,
                  top: `calc(50% + ${Math.sin(angle) * distance}px)`,
                  opacity: 0.3 + Math.random() * 0.7,
                }}
                animate={{ scale: [0.5, 1, 0.5] }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
              />
            );
          })}
        </div>

        {/* Ego Vehicle */}
        <motion.div 
          className="relative w-12 h-7 bg-primary rounded-md shadow-[0_0_20px_hsl(var(--primary)/0.5)] border border-primary/50"
          animate={emergencyBraking ? { x: [0, -3, 3, 0] } : {}}
          transition={{ duration: 0.1, repeat: emergencyBraking ? 5 : 0 }}
        >
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-cyber-glow-intense rounded-full animate-pulse" />
          <div className="absolute top-1 left-1 w-1.5 h-1 bg-foreground/80 rounded-sm" />
          <div className="absolute top-1 right-1 w-1.5 h-1 bg-foreground/80 rounded-sm" />
        </motion.div>
      </div>

      {/* Viewport HUD */}
      <div className="absolute top-3 left-3 flex flex-col gap-1">
        <div className="text-[10px] font-mono text-primary">URBAN_VIEWPORT_v2.1</div>
        <div className="text-[10px] font-mono text-muted-foreground">
          LIDAR: {(lidarAngle / 3.6).toFixed(0)}° | RES: 0.1m
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
