# UrbanDrive AI – Smart Autonomous Vehicle Simulator

An advanced autonomous vehicle simulation platform with **Explainable AI (XAI)** capabilities, designed for testing, validating, and demonstrating autonomous driving decision-making in complex urban environments.

![UrbanDrive AI](https://img.shields.io/badge/Status-MVP-green) ![React](https://img.shields.io/badge/React-18.3-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue) ![License](https://img.shields.io/badge/License-MIT-yellow)

---

## 🚗 Problem Statement

Autonomous vehicles make split-second decisions that can mean the difference between safety and catastrophe. However, these AI-driven decisions are often **opaque "black boxes"** that are difficult to:

- **Audit** for regulatory compliance
- **Debug** when failures occur
- **Trust** by passengers and pedestrians
- **Validate** before real-world deployment

**UrbanDrive AI** solves this by providing a simulation environment where every autonomous decision is **logged, explained, and auditable**.

---

## ✨ Key Features

### 🎯 Core Simulation
- **3D Urban Viewport** – Interactive city environment with roads, intersections, and traffic signals
- **LiDAR Point Cloud Visualization** – Real-time sensor simulation with pulsing detection radius
- **Dynamic Object Detection** – Bounding boxes for vehicles (red/green) and pedestrians (yellow)

### 🧠 Explainable AI (XAI)
- **Decision Rationale Feed** – Real-time logging of every AI decision with timestamp, action, reason, and confidence
- **Simplified Decision Logic** – Human-readable pseudocode showing the AI's decision tree
- **Plain-Language Explanations** – Natural language descriptions of why actions were taken

### ⚡ Edge Case Testing
- **Sudden J-Walker** – Test emergency braking response to unexpected pedestrians
- **Sensor Noise (Fog)** – Simulate degraded visibility conditions
- **Traffic Surge** – Stress-test with increased vehicle density

### 📊 Analytics Dashboard
- **Priority Matrix** – Radar chart showing balance between Safety, Efficiency, Compliance, and Comfort
- **Response Time Graph** – Live visualization of reaction times
- **Perception Confidence** – Real-time sensor confidence levels

### 🎬 Demo Mode
- **One-Click Demo** – Deterministic scenario showcasing the complete braking pipeline
- **Full Reset** – Instantly restore initial state for repeated demonstrations

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        UrbanDrive AI                            │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │  Controls   │  │  Viewport   │  │    Decision Feed        │  │
│  │  ─────────  │  │  ─────────  │  │    ─────────────        │  │
│  │ • Demo Mode │  │ • 3D Scene  │  │ • Real-time logs        │  │
│  │ • J-Walker  │  │ • LiDAR     │  │ • XAI explanations      │  │
│  │ • Fog       │  │ • Vehicles  │  │ • Confidence scores     │  │
│  │ • Traffic   │  │ • Signals   │  │                         │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
│  ┌─────────────┐  ┌─────────────────────────────────────────┐   │
│  │ Decision    │  │           XAI Panel                     │   │
│  │ Logic       │  │  • Detected Object: Pedestrian          │   │
│  │ ─────────── │  │  • Distance: 8.0m                       │   │
│  │ IF ped<15m  │  │  • Collision Prob: 87%                  │   │
│  │ AND risk>60%│  │  • Action: BRAKING                      │   │
│  │ THEN brake  │  │  • Reason: "High collision risk..."     │   │
│  └─────────────┘  └─────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/your-team/urbandrive-ai.git

# Navigate to project directory
cd urbandrive-ai

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:8080`

### Demo Walkthrough

1. **Launch the application** – The simulator loads with a vehicle navigating an urban environment
2. **Click "START DEMO MODE"** – Watch a deterministic emergency braking scenario
3. **Observe the XAI Panel** – See real-time updates of distance, collision probability, and reasoning
4. **Check the Decision Feed** – View timestamped logs of every AI decision
5. **Click "RESET"** – Return to initial state for another demonstration

---

## 🛠️ Technology Stack

| Category | Technology |
|----------|------------|
| **Framework** | React 18 with TypeScript |
| **Build Tool** | Vite |
| **Styling** | Tailwind CSS with custom cyber-grid theme |
| **Animations** | Framer Motion |
| **Charts** | Recharts |
| **Icons** | Lucide React |
| **UI Components** | shadcn/ui |

---

## 📁 Project Structure

```
src/
├── components/
│   ├── AlertBanner.tsx        # Emergency alert notifications
│   ├── DecisionFeed.tsx       # Real-time XAI decision logs
│   ├── DecisionLogic.tsx      # Simplified pseudocode display
│   ├── ExplainableAIPanel.tsx # Comprehensive XAI panel
│   ├── MissionHeader.tsx      # Main header with branding
│   ├── PerceptionConfidence.tsx # Sensor confidence gauge
│   ├── PriorityMatrix.tsx     # Radar chart for priorities
│   ├── ResponseTimeGraph.tsx  # Live response time visualization
│   ├── ScenarioControls.tsx   # Demo mode & chaos injection
│   ├── SystemStatus.tsx       # System health indicators
│   └── UrbanViewport.tsx      # Main 3D simulation viewport
├── pages/
│   └── Index.tsx              # Main dashboard page
└── index.css                  # Custom cyber-grid theme
```

---

## 🎯 Use Cases

- **Autonomous Vehicle R&D** – Test and validate decision algorithms
- **Regulatory Compliance** – Demonstrate auditable AI decision-making
- **Education** – Teach autonomous vehicle concepts with visual feedback
- **Stakeholder Demos** – Show non-technical audiences how AV decisions work

---

## 📄 License

MIT License – See [LICENSE](LICENSE) for details.

---

## 👥 Team

Built with ❤️ for autonomous vehicle safety and transparency.

---

*"Every autonomous decision is logged, explained, and auditable."*
