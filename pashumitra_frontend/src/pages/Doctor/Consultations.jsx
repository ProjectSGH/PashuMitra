"use client"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  MessageCircle,
  Video,
  FileText,
  ChevronDown,
  Clock,
  Calendar,
  Users,
} from "lucide-react"
import axios from "axios"

// Reusable animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5 },
  },
}

const cardVariants = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.4 },
  },
  hover: {
    scale: 1.02,
    transition: { duration: 0.2 },
  },
}

const consultationsData = [
  {
    id: 1,
    patientName: "John Smith",
    animalType: "Cow",
    priority: "High",
    status: "Pending",
    issue: "Mastitis symptoms - swollen udder, reduced milk production",
    timeAgo: "10 min ago",
    actions: ["Start Chat", "Video Call"],
  },
  {
    id: 2,
    patientName: "Maria Garcia",
    animalType: "Buffalo",
    priority: "Medium",
    status: "Pending",
    issue: "Loss of appetite, lethargic behavior for 2 days",
    timeAgo: "25 min ago",
    actions: ["Start Chat", "Video Call"],
  },
  {
    id: 3,
    patientName: "Ahmed Hassan",
    animalType: "Goat",
    priority: "Low",
    status: "In Progress",
    issue: "Skin condition with patches and itching",
    timeAgo: "1 hour ago",
    actions: ["Continue Chat"],
  },
  {
    id: 4,
    patientName: "Sarah Johnson",
    animalType: "Sheep",
    priority: "Low",
    status: "Completed",
    issue: "Vaccination schedule consultation",
    timeAgo: "2 hours ago",
    actions: ["View Summary"],
  },
]

const priorityColors = {
  High: "bg-red-100 text-red-800 border-red-200",
  Medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
  Low: "bg-green-100 text-green-800 border-green-200",
}

const statusColors = {
  Pending: "bg-blue-100 text-blue-800 border-blue-200",
  "In Progress": "bg-orange-100 text-orange-800 border-orange-200",
  Completed: "bg-gray-100 text-gray-800 border-gray-200",
}

const buttonStyles = {
  "Start Chat": "bg-blue-600 hover:bg-blue-700 text-white",
  "Video Call": "bg-green-600 hover:bg-green-700 text-white",
  "Continue Chat": "bg-orange-600 hover:bg-orange-700 text-white",
  "View Summary": "bg-gray-600 hover:bg-gray-700 text-white",
}

export default function Consultations() {
  const [statusFilter, setStatusFilter] = useState("All Status")


// Display name state (update after mount)
// displayName state (used in greeting)
const [displayName, setDisplayName] = useState("Doctor");

useEffect(() => {
  const loadDisplayName = async () => {
    try {
      const raw = localStorage.getItem("user");
      const localUser = raw ? JSON.parse(raw) : null;

      // 1) If localStorage already has a good displayName/fullName, use it.
      let name =
        (localUser?.displayName || localUser?.fullName || "").toString().trim();

      // 2) If that is missing or is just the literal "Doctor", prefer doctorProfile or backend
      if (!name || name.toLowerCase() === "doctor") {
        // prefer nested doctorProfile if present in local storage
        if (localUser?.doctorProfile?.fullName) {
          name = localUser.doctorProfile.fullName.toString().trim();
        } else if (localUser?._id) {
          // fetch fresh user from backend (same endpoint you use in ProfileSchedule)
          try {
            const res = await axios.get(`http://localhost:5000/api/users/${localUser._id}`);
            const userData = res.data;
            name =
              (userData?.doctorProfile?.fullName ||
               userData?.fullName ||
               userData?.name ||
               `${userData?.firstName || ""} ${userData?.lastName || ""}`.trim() ||
               ""
              ).toString().trim();

            // update localStorage so future loads are faster
            const merged = { ...(localUser || {}), ...(userData || {}) };
            if (name) merged.displayName = name;
            localStorage.setItem("user", JSON.stringify(merged));
          } catch (err) {
            console.warn("Could not fetch user from backend:", err);
          }
        }
      }

      name = (name || "").trim();

      // 3) Final fallback and prefix logic
      const role = (localUser?.role || "").toString().toLowerCase().trim();
      const isDoctor = role === "doctor";
      const hasDrPrefix = /^dr\.?\s/i.test(name);

      if (!name) {
        setDisplayName(isDoctor ? "Doctor" : (localUser?.role || "User"));
      } else if (isDoctor && !hasDrPrefix && name.toLowerCase() !== "doctor") {
        setDisplayName(`Dr. ${name}`);
      } else {
        setDisplayName(name);
      }
    } catch (err) {
      console.error("Error computing displayName:", err);
      setDisplayName("Doctor");
    }
  };

  loadDisplayName();
}, []);

  const filteredConsultations =
    statusFilter === "All Status"
      ? consultationsData
      : consultationsData.filter((item) => item.status === statusFilter)

  const getButtonIcon = (action) => {
    switch (action) {
      case "Start Chat":
      case "Continue Chat":
        return <MessageCircle className="w-4 h-4" />
      case "Video Call":
        return <Video className="w-4 h-4" />
      case "View Summary":
        return <FileText className="w-4 h-4" />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/*  Stats Section Moved to Top */}
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          {/* Welcome */}
          <motion.div variants={itemVariants} className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {`Welcome back, ${displayName}!`}
            </h2>
            <p className="text-gray-600">
              Here's what's happening with your practice today.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          >
            {[
              {
                title: "Pending Consultations",
                value: "8",
                icon: MessageCircle,
                color: "blue",
              },
              {
                title: "Today's Appointments",
                value: "12",
                icon: Calendar,
                color: "green",
              },
              { title: "Follow-ups Due", value: "5", icon: Users, color: "yellow" },
            ].map((stat) => (
              <motion.div
                key={stat.title}
                variants={cardVariants}
                whileHover="hover"
                className="bg-white rounded-lg p-6 shadow-sm border"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                    <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Header */}
        <motion.div
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Consultations
            </h1>
            <p className="text-gray-600 text-sm md:text-base">
              Manage your consultation requests and ongoing sessions
            </p>
          </div>

          <motion.div
            className="relative"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
            >
              <option>All Status</option>
              <option>Pending</option>
              <option>In Progress</option>
              <option>Completed</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          </motion.div>
        </motion.div>

        {/* Consultations Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-6"
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
        >
          <AnimatePresence>
            {filteredConsultations.map((consultation, index) => (
              <motion.div
                key={consultation.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-200"
                variants={{
                  hidden: { opacity: 0, y: 30, scale: 0.95 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: {
                      duration: 0.5,
                      delay: index * 0.1,
                    },
                  },
                  exit: {
                    opacity: 0,
                    scale: 0.9,
                    transition: { duration: 0.3 },
                  },
                }}
                initial="hidden"
                animate="visible"
                exit="exit"
                whileHover={{ y: -4, scale: 1.02 }}
              >
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-900 text-lg mb-1">
                    {consultation.patientName}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {consultation.animalType}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <motion.span
                    className={`px-3 py-1 rounded-full text-xs font-medium border ${priorityColors[consultation.priority]}`}
                    whileHover={{ scale: 1.05 }}
                  >
                    {consultation.priority} Priority
                  </motion.span>
                  <motion.span
                    className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[consultation.status]}`}
                    whileHover={{ scale: 1.05 }}
                  >
                    {consultation.status}
                  </motion.span>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Issue:</p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {consultation.issue}
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="w-3 h-3 mr-1" />
                    {consultation.timeAgo}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {consultation.actions.map((action, index) => (
                      <motion.button
                        key={index}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors duration-200 ${buttonStyles[action]}`}
                        whileHover={{ scale: 1.07 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {getButtonIcon(action)}
                        {action}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}
