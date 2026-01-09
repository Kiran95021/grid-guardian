import { useState, useCallback, useRef, useEffect } from "react";

export interface VehicleState {
  x: number;
  y: number;
  speed: number; // m/s
  targetSpeed: number;
  acceleration: number; // m/s²
  heading: number; // degrees
  isMoving: boolean;
  isBraking: boolean;
}

export interface PedestrianState {
  id: string;
  x: number;
  y: number;
  speed: number; // m/s
  heading: number;
  isActive: boolean;
  isJWalking: boolean;
}

export interface SensorData {
  pedestrianDetected: boolean;
  distanceToPedestrian: number; // meters
  relativeSpeed: number; // m/s (positive = approaching)
  timeToCollision: number; // seconds
  sensorConfidence: number; // 0-100%
}

export interface DecisionState {
  status: "SAFE" | "WARNING" | "CRITICAL";
  action: "CONTINUE" | "SLOW_DOWN" | "BRAKING" | "STOPPED";
  collisionProbability: number; // 0-100%
  explanation: string;
  timestamp: number;
}

export interface SimulationMetrics {
  vehicleSpeed: number;
  reactionTime: number;
  timeToCollision: number;
  safetyStatus: "SAFE" | "WARNING" | "CRITICAL";
  totalDecisions: number;
  emergencyBrakes: number;
}

interface SimulationState {
  isRunning: boolean;
  isDemoMode: boolean;
  vehicle: VehicleState;
  pedestrian: PedestrianState;
  sensors: SensorData;
  decision: DecisionState;
  metrics: SimulationMetrics;
  actionLog: Array<{
    id: string;
    timestamp: number;
    action: string;
    reason: string;
    priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  }>;
}

const INITIAL_VEHICLE: VehicleState = {
  x: 15,
  y: 55,
  speed: 0,
  targetSpeed: 8, // 8 m/s ≈ 30 km/h
  acceleration: 0,
  heading: 0,
  isMoving: false,
  isBraking: false,
};

const INITIAL_PEDESTRIAN: PedestrianState = {
  id: "ped-1",
  x: 52,
  y: 80,
  speed: 0,
  heading: -90, // moving up
  isActive: false,
  isJWalking: false,
};

const INITIAL_SENSORS: SensorData = {
  pedestrianDetected: false,
  distanceToPedestrian: 999,
  relativeSpeed: 0,
  timeToCollision: 999,
  sensorConfidence: 98,
};

const INITIAL_DECISION: DecisionState = {
  status: "SAFE",
  action: "CONTINUE",
  collisionProbability: 0,
  explanation: "No hazards detected. System ready.",
  timestamp: Date.now(),
};

const INITIAL_METRICS: SimulationMetrics = {
  vehicleSpeed: 0,
  reactionTime: 0,
  timeToCollision: 999,
  safetyStatus: "SAFE",
  totalDecisions: 0,
  emergencyBrakes: 0,
};

// Constants for thresholds
const SAFE_DISTANCE = 15; // meters
const WARNING_DISTANCE = 25; // meters
const CRITICAL_TTC = 2; // seconds
const WARNING_TTC = 4; // seconds
const RISK_THRESHOLD = 60; // collision probability %
const MAX_DECEL = 8; // m/s² (comfortable emergency braking)
const NORMAL_DECEL = 3; // m/s² (normal braking)

export const useSimulationEngine = () => {
  const [state, setState] = useState<SimulationState>({
    isRunning: false,
    isDemoMode: false,
    vehicle: INITIAL_VEHICLE,
    pedestrian: INITIAL_PEDESTRIAN,
    sensors: INITIAL_SENSORS,
    decision: INITIAL_DECISION,
    metrics: INITIAL_METRICS,
    actionLog: [],
  });

  const animationRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);
  const reactionStartRef = useRef<number>(0);
  const demoPhaseRef = useRef<number>(0);

  // Calculate distance between vehicle and pedestrian
  const calculateDistance = useCallback((vehicle: VehicleState, pedestrian: PedestrianState): number => {
    const dx = (pedestrian.x - vehicle.x) * 0.5; // Scale factor for viewport
    const dy = (pedestrian.y - vehicle.y) * 0.5;
    return Math.sqrt(dx * dx + dy * dy) * 2; // Convert to meters (approx)
  }, []);

  // Calculate time to collision
  const calculateTTC = useCallback((distance: number, relativeSpeed: number): number => {
    if (relativeSpeed <= 0) return 999;
    return distance / relativeSpeed;
  }, []);

  // Calculate collision probability based on distance, TTC, and speeds
  const calculateCollisionProbability = useCallback((
    distance: number,
    ttc: number,
    vehicleSpeed: number
  ): number => {
    if (distance > WARNING_DISTANCE * 2) return 0;
    
    let probability = 0;
    
    // Distance factor (closer = higher probability)
    if (distance < SAFE_DISTANCE) {
      probability += 50 * (1 - distance / SAFE_DISTANCE);
    }
    
    // TTC factor
    if (ttc < CRITICAL_TTC) {
      probability += 40 * (1 - ttc / CRITICAL_TTC);
    } else if (ttc < WARNING_TTC) {
      probability += 20 * (1 - ttc / WARNING_TTC);
    }
    
    // Speed factor
    probability += (vehicleSpeed / 15) * 10;
    
    return Math.min(100, Math.max(0, probability));
  }, []);

  // Decision engine
  const makeDecision = useCallback((
    sensors: SensorData,
    vehicleSpeed: number
  ): DecisionState => {
    const { pedestrianDetected, distanceToPedestrian, timeToCollision } = sensors;
    const collisionProbability = calculateCollisionProbability(
      distanceToPedestrian,
      timeToCollision,
      vehicleSpeed
    );

    // Decision logic
    if (!pedestrianDetected || distanceToPedestrian > WARNING_DISTANCE * 2) {
      return {
        status: "SAFE",
        action: "CONTINUE",
        collisionProbability,
        explanation: "No hazards detected. Maintaining current speed.",
        timestamp: Date.now(),
      };
    }

    if (collisionProbability >= RISK_THRESHOLD || timeToCollision < CRITICAL_TTC) {
      return {
        status: "CRITICAL",
        action: "BRAKING",
        collisionProbability,
        explanation: `Pedestrian detected at ${distanceToPedestrian.toFixed(1)}m. Time-to-collision: ${timeToCollision.toFixed(1)}s. Emergency braking applied to avoid collision.`,
        timestamp: Date.now(),
      };
    }

    if (distanceToPedestrian < WARNING_DISTANCE || timeToCollision < WARNING_TTC) {
      return {
        status: "WARNING",
        action: "SLOW_DOWN",
        collisionProbability,
        explanation: `Pedestrian approaching at ${distanceToPedestrian.toFixed(1)}m. Reducing speed as precaution.`,
        timestamp: Date.now(),
      };
    }

    return {
      status: "SAFE",
      action: "CONTINUE",
      collisionProbability,
      explanation: "Pedestrian detected at safe distance. Monitoring situation.",
      timestamp: Date.now(),
    };
  }, [calculateCollisionProbability]);

  // Add to action log
  const addToLog = useCallback((action: string, reason: string, priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL") => {
    setState(prev => ({
      ...prev,
      actionLog: [
        {
          id: `log-${Date.now()}`,
          timestamp: Date.now(),
          action,
          reason,
          priority,
        },
        ...prev.actionLog.slice(0, 4), // Keep last 5
      ],
    }));
  }, []);

  // Main simulation loop
  const simulationLoop = useCallback((timestamp: number) => {
    if (!lastTimeRef.current) lastTimeRef.current = timestamp;
    const deltaTime = Math.min((timestamp - lastTimeRef.current) / 1000, 0.1); // Cap at 100ms
    lastTimeRef.current = timestamp;

    setState(prev => {
      if (!prev.isRunning) return prev;

      let newVehicle = { ...prev.vehicle };
      let newPedestrian = { ...prev.pedestrian };
      let newMetrics = { ...prev.metrics };

      // Update vehicle position and speed
      if (newVehicle.isMoving) {
        // Apply acceleration/deceleration
        if (newVehicle.isBraking) {
          newVehicle.acceleration = -MAX_DECEL;
        } else if (prev.decision.action === "SLOW_DOWN") {
          newVehicle.acceleration = -NORMAL_DECEL;
        } else if (newVehicle.speed < newVehicle.targetSpeed) {
          newVehicle.acceleration = 2; // Gentle acceleration
        } else {
          newVehicle.acceleration = 0;
        }

        // Update speed
        newVehicle.speed = Math.max(0, newVehicle.speed + newVehicle.acceleration * deltaTime);
        
        // Update position (x moves right)
        newVehicle.x += (newVehicle.speed * deltaTime) * 2; // Scale for viewport

        // Stop conditions
        if (newVehicle.speed <= 0 && newVehicle.isBraking) {
          newVehicle.speed = 0;
          newVehicle.isMoving = false;
        }

        // Clamp position
        newVehicle.x = Math.min(48, newVehicle.x); // Stop before intersection center
      }

      // Update pedestrian if active
      if (newPedestrian.isActive) {
        newPedestrian.y -= newPedestrian.speed * deltaTime * 3; // Moving up (toward road)
        
        // Clamp pedestrian position
        if (newPedestrian.y < 52) {
          newPedestrian.y = 52;
          newPedestrian.speed = 0;
        }
      }

      // Calculate sensor data
      const distance = calculateDistance(newVehicle, newPedestrian);
      const relativeSpeed = newPedestrian.isActive 
        ? newVehicle.speed + newPedestrian.speed 
        : newVehicle.speed;
      const ttc = calculateTTC(distance, relativeSpeed);

      const newSensors: SensorData = {
        pedestrianDetected: newPedestrian.isActive && distance < WARNING_DISTANCE * 2,
        distanceToPedestrian: distance,
        relativeSpeed,
        timeToCollision: ttc,
        sensorConfidence: prev.sensors.sensorConfidence,
      };

      // Make decision
      const newDecision = makeDecision(newSensors, newVehicle.speed);

      // Apply braking if needed
      if (newDecision.action === "BRAKING" && !newVehicle.isBraking) {
        newVehicle.isBraking = true;
        newMetrics.emergencyBrakes += 1;
        
        // Calculate reaction time
        if (reactionStartRef.current > 0) {
          newMetrics.reactionTime = (Date.now() - reactionStartRef.current) / 1000;
        }
      }

      // Update metrics
      newMetrics.vehicleSpeed = newVehicle.speed;
      newMetrics.timeToCollision = ttc;
      newMetrics.safetyStatus = newDecision.status;
      
      if (newDecision.action !== prev.decision.action) {
        newMetrics.totalDecisions += 1;
      }

      return {
        ...prev,
        vehicle: newVehicle,
        pedestrian: newPedestrian,
        sensors: newSensors,
        decision: newDecision,
        metrics: newMetrics,
      };
    });

    animationRef.current = requestAnimationFrame(simulationLoop);
  }, [calculateDistance, calculateTTC, makeDecision]);

  // Start simulation
  const startSimulation = useCallback(() => {
    setState(prev => ({
      ...prev,
      isRunning: true,
      vehicle: {
        ...INITIAL_VEHICLE,
        isMoving: true,
        speed: 2,
      },
    }));
    
    addToLog("SYSTEM", "Simulation started. Vehicle accelerating.", "LOW");
    lastTimeRef.current = 0;
    animationRef.current = requestAnimationFrame(simulationLoop);
  }, [simulationLoop, addToLog]);

  // Trigger pedestrian
  const triggerPedestrian = useCallback(() => {
    reactionStartRef.current = Date.now();
    
    setState(prev => ({
      ...prev,
      pedestrian: {
        ...prev.pedestrian,
        isActive: true,
        isJWalking: true,
        speed: 1.5, // 1.5 m/s walking speed
        y: 75,
      },
    }));
    
    addToLog("DETECTION", "Pedestrian entered roadway unexpectedly", "HIGH");
  }, [addToLog]);

  // Demo mode - deterministic sequence
  const startDemoMode = useCallback(() => {
    if (state.isDemoMode) return;

    // Reset first
    resetSimulation();

    setTimeout(() => {
      setState(prev => ({
        ...prev,
        isRunning: true,
        isDemoMode: true,
        vehicle: {
          ...INITIAL_VEHICLE,
          isMoving: true,
          speed: 0,
        },
      }));

      addToLog("SYSTEM", "Demo mode initiated. Beginning autonomous operation.", "LOW");
      lastTimeRef.current = 0;
      demoPhaseRef.current = 0;
      animationRef.current = requestAnimationFrame(simulationLoop);

      // Phase 1: Accelerate (0-2s)
      setTimeout(() => {
        setState(prev => ({
          ...prev,
          vehicle: { ...prev.vehicle, targetSpeed: 8 },
        }));
        addToLog("CONTROL", "Accelerating to cruise speed (30 km/h)", "LOW");
      }, 500);

      // Phase 2: Pedestrian appears (2.5s)
      setTimeout(() => {
        reactionStartRef.current = Date.now();
        setState(prev => ({
          ...prev,
          pedestrian: {
            ...prev.pedestrian,
            isActive: true,
            isJWalking: true,
            speed: 1.8,
            y: 78,
          },
        }));
        addToLog("DETECTION", "Pedestrian detected crossing road ahead", "HIGH");
      }, 2500);

      // Phase 3: Decision made (3s)
      setTimeout(() => {
        addToLog("DECISION", "Collision risk critical. Initiating emergency stop.", "CRITICAL");
      }, 3000);

      // Phase 4: Vehicle stopped (5s)
      setTimeout(() => {
        addToLog("SAFETY", "Vehicle stopped safely. Collision avoided.", "MEDIUM");
      }, 5000);

      // Phase 5: End demo (7s)
      setTimeout(() => {
        setState(prev => ({
          ...prev,
          isDemoMode: false,
          decision: {
            ...prev.decision,
            explanation: "Demo complete. Vehicle stopped safely. Pedestrian cleared crossing area.",
          },
        }));
        addToLog("SYSTEM", "Demo complete. All safety protocols executed successfully.", "LOW");
      }, 7000);
    }, 100);
  }, [state.isDemoMode, simulationLoop, addToLog]);

  // Reset simulation
  const resetSimulation = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    setState({
      isRunning: false,
      isDemoMode: false,
      vehicle: INITIAL_VEHICLE,
      pedestrian: INITIAL_PEDESTRIAN,
      sensors: INITIAL_SENSORS,
      decision: INITIAL_DECISION,
      metrics: INITIAL_METRICS,
      actionLog: [],
    });

    lastTimeRef.current = 0;
    reactionStartRef.current = 0;
    demoPhaseRef.current = 0;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return {
    state,
    actions: {
      startSimulation,
      triggerPedestrian,
      startDemoMode,
      resetSimulation,
    },
  };
};
