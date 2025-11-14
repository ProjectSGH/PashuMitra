import { motion } from "framer-motion";
import { 
  Home, 
  ArrowLeft, 
  AlertTriangle, 
  User, 
  Stethoscope, 
  Store, 
  Search,
  MapPin,
  MessageCircle,
  History,
  FileText,
  Banknote,
  ShoppingCart,
  Contact,
  Bell,
  Package,
  Truck,
  Users
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ErrorPage() {
  const navigate = useNavigate();
  
  // Get user data from localStorage and parse it properly
  const userData = localStorage.getItem("user");
  const token = localStorage.getItem("token");

  // Parse user data and extract role
  let userRole = null;
  let parsedUser = null;
  
  if (userData) {
    try {
      parsedUser = JSON.parse(userData);
      userRole = parsedUser.role; // Extract role from user object
      console.log("🔍 Debug - Parsed user data:", parsedUser);
      console.log("🔍 Debug - User role:", userRole);
    } catch (error) {
      console.error("Error parsing user data:", error);
    }
  }

  console.log("🔍 Debug - Token exists:", !!token);
  console.log("🔍 Debug - User data exists:", !!userData);
  console.log("🔍 Debug - Final userRole:", userRole);

  // Check if user is considered "logged in" (has user data in localStorage)
  const isUserLoggedIn = !!(userData && userRole);

  // Unified role-based suggestions
  const roleBasedSuggestions = {
    farmer: [
      { name: "Farmer Dashboard", path: "/farmer/home", icon: User },
      { name: "Search Medicine", path: "/farmer/medicine-search", icon: Search },
      { name: "Nearby Stores", path: "/farmer/nearbystore", icon: MapPin },
      { name: "Consult Doctor", path: "/farmer/doctor-consult", icon: Stethoscope },
      { name: "My Consultations", path: "/farmer/my-consultations", icon: History },
      { name: "My Orders", path: "/farmer/my-orders", icon: ShoppingCart },
      { name: "Awareness", path: "/farmer/awareness", icon: FileText },
      { name: "Community Bank", path: "/farmer/community-bank", icon: Banknote },
      { name: "Profile", path: "/farmer/profile", icon: User },
      { name: "Contact Us", path: "/farmer/contact", icon: Contact },
      { name: "Notifications", path: "/farmer/notifications", icon: Bell },
    ],
    Farmer: [
      { name: "Farmer Dashboard", path: "/farmer/home", icon: User },
      { name: "Search Medicine", path: "/farmer/medicine-search", icon: Search },
      { name: "Nearby Stores", path: "/farmer/nearbystore", icon: MapPin },
      { name: "Consult Doctor", path: "/farmer/doctor-consult", icon: Stethoscope },
      { name: "My Consultations", path: "/farmer/my-consultations", icon: History },
      { name: "My Orders", path: "/farmer/my-orders", icon: ShoppingCart },
      { name: "Awareness", path: "/farmer/awareness", icon: FileText },
      { name: "Community Bank", path: "/farmer/community-bank", icon: Banknote },
      { name: "Profile", path: "/farmer/profile", icon: User },
      { name: "Contact Us", path: "/farmer/contact", icon: Contact },
      { name: "Notifications", path: "/farmer/notifications", icon: Bell },
    ],
    doctor: [
      { name: "Doctor Dashboard", path: "/doctor/home", icon: User },
      { name: "Consultations", path: "/doctor/consultations", icon: MessageCircle },
      { name: "Patient History", path: "/doctor/Patient_History", icon: History },
      { name: "Awareness", path: "/doctor/Awareness", icon: FileText },
      { name: "Profile", path: "/doctor/Profile", icon: User },
      { name: "Contact Us", path: "/doctor/Contact", icon: Contact },
      { name: "Notifications", path: "/doctor/notifications", icon: Bell },
    ],
    Doctor: [
      { name: "Doctor Dashboard", path: "/doctor/home", icon: User },
      { name: "Consultations", path: "/doctor/consultations", icon: MessageCircle },
      { name: "Patient History", path: "/doctor/Patient_History", icon: History },
      { name: "Awareness", path: "/doctor/Awareness", icon: FileText },
      { name: "Profile", path: "/doctor/Profile", icon: User },
      { name: "Contact Us", path: "/doctor/Contact", icon: Contact },
      { name: "Notifications", path: "/doctor/notifications", icon: Bell },
    ],
    medicalstore: [
      { name: "Store Dashboard", path: "/medicalstore/home", icon: Store },
      { name: "Inventory", path: "/medicalstore/inventory", icon: Package },
      { name: "Requests", path: "/medicalstore/requests", icon: Users },
      { name: "Transfer", path: "/medicalstore/transfer", icon: Truck },
      { name: "Transport", path: "/medicalstore/transport", icon: Truck },
      { name: "Community Bank", path: "/medicalstore/communityBank", icon: Banknote },
      { name: "Profile", path: "/medicalstore/profile", icon: User },
      { name: "Contact Us", path: "/medicalstore/contact", icon: Contact },
      { name: "Notifications", path: "/medicalstore/notifications", icon: Bell },
    ],
    MedicalStore: [
      { name: "Store Dashboard", path: "/medicalstore/home", icon: Store },
      { name: "Inventory", path: "/medicalstore/inventory", icon: Package },
      { name: "Requests", path: "/medicalstore/requests", icon: Users },
      { name: "Transfer", path: "/medicalstore/transfer", icon: Truck },
      { name: "Transport", path: "/medicalstore/transport", icon: Truck },
      { name: "Community Bank", path: "/medicalstore/communityBank", icon: Banknote },
      { name: "Profile", path: "/medicalstore/profile", icon: User },
      { name: "Contact Us", path: "/medicalstore/contact", icon: Contact },
      { name: "Notifications", path: "/medicalstore/notifications", icon: Bell },
    ],
    default: [
      { name: "Home", path: "/", icon: Home },
      { name: "Login", path: "/login", icon: User },
      { name: "About Us", path: "/about", icon: User },
      { name: "Contact Us", path: "/contact", icon: Contact },
      { name: "Farmer Signup", path: "/signup/farmer", icon: User },
      { name: "Doctor Signup", path: "/signup/doctor", icon: Stethoscope },
      { name: "Store Signup", path: "/signup/store", icon: Store },
    ]
  };

  // Get suggestions based on user role
  const getSuggestions = () => {
    if (!isUserLoggedIn) {
      console.log("🔍 User not logged in, using default suggestions");
      return roleBasedSuggestions.default;
    }
    
    // Check for exact match in our suggestions
    if (userRole && roleBasedSuggestions[userRole]) {
      const suggestions = roleBasedSuggestions[userRole];
      console.log("🔍 Found role-specific suggestions:", suggestions.length);
      return suggestions;
    }
    
    // Try case-insensitive match
    const normalizedRole = String(userRole).toLowerCase();
    const matchedRole = Object.keys(roleBasedSuggestions).find(role => 
      role.toLowerCase() === normalizedRole
    );
    
    if (matchedRole && roleBasedSuggestions[matchedRole]) {
      const suggestions = roleBasedSuggestions[matchedRole];
      console.log("🔍 Found case-insensitive match:", matchedRole);
      return suggestions;
    }
    
    console.log("🔍 No role match found, using default");
    return roleBasedSuggestions.default;
  };

  const suggestions = getSuggestions();

  // Function to get role display name
  const getRoleDisplayName = (role) => {
    if (!role) return "";
    
    const roleNames = {
      farmer: "Farmer",
      Farmer: "Farmer",
      doctor: "Doctor",
      Doctor: "Doctor", 
      medicalstore: "Medical Store",
      MedicalStore: "Medical Store"
    };
    
    return roleNames[role] || role;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl w-full bg-white rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="p-8">
          {/* Error Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6"
            >
              <AlertTriangle className="w-10 h-10 text-red-500" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-4xl font-bold text-gray-800 mb-4"
            >
              404
            </motion.h1>

            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xl font-semibold text-gray-700 mb-2"
            >
              Page Not Found
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-gray-500"
            >
              The page you're looking for doesn't exist or has been moved.
            </motion.p>

          </div>

          {/* Quick Actions for users with user data (even without token) */}
          {isUserLoggedIn && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mb-8"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                Quick Links for {getRoleDisplayName(userRole)}
                {!token && (
                  <span className="text-sm text-orange-600 block mt-1">
                    {/* (Session may have expired - please log in again) */}
                  </span>
                )}
              </h3>
              
              {suggestions.length > 0 && suggestions !== roleBasedSuggestions.default ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto pr-2">
                  {suggestions.map((suggestion, index) => (
                    <motion.button
                      key={suggestion.name}
                      whileHover={{ scale: 1.02, y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                      onClick={() => navigate(suggestion.path)}
                      className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors border border-blue-100 text-left"
                    >
                      <suggestion.icon className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      <span className="text-sm font-medium text-gray-700">
                        {suggestion.name}
                      </span>
                    </motion.button>
                  ))}
                </div>
              ) : (
                <div className="text-center p-6 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-gray-600 mb-2">
                    No role-specific links found for: <span className="font-mono">"{userRole}"</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Showing default links instead.
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {/* Show default suggestions if not logged in */}
          {!isUserLoggedIn && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mb-8"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                Get Started with PashuMitra
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {suggestions.map((suggestion, index) => (
                  <motion.button
                    key={suggestion.name}
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    onClick={() => navigate(suggestion.path)}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-100 text-left"
                  >
                    <suggestion.icon className="w-5 h-5 text-gray-600 flex-shrink-0" />
                    <span className="text-sm font-medium text-gray-700">
                      {suggestion.name}
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(-1)}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors border border-gray-200 min-w-32"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/")}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors min-w-32"
            >
              <Home className="w-4 h-4" />
              Go Home
            </motion.button>

            {/* Login button if user data exists but token is missing */}
            {isUserLoggedIn && !token && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/login")}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors min-w-32"
              >
                <User className="w-4 h-4" />
                Login Again
              </motion.button>
            )}
          </motion.div>

          {/* Support */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="mt-8 pt-6 border-t border-gray-200 text-center"
          >
            <p className="text-sm text-gray-500">
              Still need help?{" "}
              <button
                onClick={() => navigate("/contact")}
                className="text-blue-600 hover:text-blue-700 font-medium underline"
              >
                Contact our support team
              </button>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}