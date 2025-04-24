import { Home, Package, Truck, Pill, Building2, Clock, User, Bell, HelpCircle, LogOut } from "lucide-react"
import { Link } from "react-router-dom";
const Navbar = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-md bg-blue-600 text-white flex items-center justify-center font-bold">
                  PM
                </div>
                <span className="ml-2 text-lg font-bold">PashuMitra</span>
              </div>
            </div>
            <nav className="ml-6 hidden md:flex space-x-4">
              <NavItem icon={<Home size={18} />} text="Home" />
              <NavItem icon={<Package size={18} />} text="Inventory" />
              <NavItem icon={<Truck size={18} />} text="Transport Requests" />
              <NavItem icon={<Pill size={18} />} text="Request Medicines" />
              <NavItem icon={<Building2 size={18} />} text="Medicine Bank" />
              <NavItem icon={<Clock size={18} />} text="Expiry Alerts" />
            </nav>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <NavItem icon={<User size={18} />} text="Profile" />
            <NavItem icon={<Bell size={18} />} text="Notifications" />
            <NavItem icon={<HelpCircle size={18} />} text="Help" />
            <NavItem icon={<LogOut size={18} />} text="Logout" isLogout />
          </div>
          <div className="md:hidden">
            <button className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
const NavItem = ({ icon, text, isLogout = false }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role?.toLowerCase(); // e.g., "farmer", "medicalstore"

  const routes = {
    Home: `/${role}/dashboard`,
    Profile: `/${role}/profile`, // ✅ role-based path
    "Transport Requests": `/${role}/transport`,
    "Request Medicines": `/${role}/request-medicines`,
    Logout: "/",
  };

  return (
    <Link
      to={routes[text] || "#"}
      className={`flex items-center px-2 py-1 text-sm font-medium rounded-md ${
        isLogout ? "text-red-600 hover:text-red-800" : "text-gray-600 hover:text-gray-900"
      } hover:bg-gray-100`}
    >
      {icon}
      <span className="ml-1">{text}</span>
    </Link>
  );
};

export default Navbar
