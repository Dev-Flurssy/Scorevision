import {
  FaBolt,
  FaBullseye,
  FaChartBar,
  FaChartPie,
  FaClipboardList,
  FaLightbulb,
  FaTrophy,
} from "react-icons/fa6";

export { FaBolt };

export const Features = [
  {
    icon: <FaChartBar />,
    title: "Subject Analysis",
    desc: "Average, pass rate, and variance per subject",
  },
  {
    icon: <FaBullseye />,
    title: "At-Risk Detection",
    desc: "Automatically flags students below threshold",
  },
  {
    icon: <FaTrophy />,
    title: "Top Performers",
    desc: "Ranks and highlights highest achievers",
  },
  {
    icon: <FaClipboardList />,
    title: "Attendance Correlation",
    desc: "Links attendance to academic performance",
  },
  {
    icon: <FaLightbulb />,
    title: "AI Recommendations",
    desc: "Narrative insights — not just raw numbers",
  },
  {
    icon: <FaChartPie />,
    title: "Visual Charts",
    desc: "Bar, pie, and performance charts via Recharts",
  },
];

export const Stacks = [
  "React 18",
  "TypeScript",
  "Node.js",
  "Express",
  "Python",
  "Pandas",
  "NumPy",
  "Recharts",
  "Vite",
  "Multer",
];
