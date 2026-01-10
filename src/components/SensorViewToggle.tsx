import { motion } from "framer-motion";
import { Eye, Scan, Box } from "lucide-react";

interface SensorViewToggleProps {
  sensorViewEnabled: boolean;
  onToggle: () => void;
}

const SensorViewToggle = ({ sensorViewEnabled, onToggle }: SensorViewToggleProps) => {
  return (
    <motion.button
      onClick={onToggle}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`w-full p-3 rounded-lg border flex items-center justify-between transition-all ${
        sensorViewEnabled
          ? "border-primary/50 bg-primary/20"
          : "border-border/30 bg-card/30 hover:border-primary/30"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${sensorViewEnabled ? "bg-primary/30" : "bg-muted/50"}`}>
          {sensorViewEnabled ? (
            <Scan className="w-4 h-4 text-primary" />
          ) : (
            <Eye className="w-4 h-4 text-muted-foreground" />
          )}
        </div>
        <div className="text-left">
          <div className={`text-sm font-medium ${sensorViewEnabled ? "text-primary" : "text-foreground"}`}>
            Sensor View
          </div>
          <div className="text-[10px] text-muted-foreground">
            {sensorViewEnabled ? "Bounding boxes & detection" : "Standard viewport"}
          </div>
        </div>
      </div>
      
      <div className={`w-10 h-5 rounded-full transition-all ${
        sensorViewEnabled ? "bg-primary" : "bg-muted"
      }`}>
        <motion.div
          animate={{ x: sensorViewEnabled ? 20 : 2 }}
          className="w-4 h-4 mt-0.5 rounded-full bg-foreground shadow-md"
        />
      </div>
    </motion.button>
  );
};

export default SensorViewToggle;
