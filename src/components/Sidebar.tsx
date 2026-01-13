import toast from "react-hot-toast";
import { useNavigate, NavLink } from "react-router-dom";


interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  // const dispatch = useAppDispatch();
  const navigate = useNavigate();
  // const [logout, { isLoading }] = useLogoutMutation();
  const isLoading = false; // Placeholder

  const menuItems = [
    { path: "/dashboard/products", label: "Books", icon: "�" },
    { path: "/dashboard/contactus", label: "Contact Us", icon: "✉️" },
    { path: "/dashboard/newsPaper", label: "News Paper", icon: "📰" },
    { path: "/dashboard/courses", label: "Courses", icon: "📚" },
  ];

  const handleLogout = async () => {
    // try {
    //   await logout().unwrap();
    //   dispatch(clearCredentials());
    //   toast.success("Logged out successfully");
    //   setTimeout(() => {
    //     navigate("/login", { replace: true });
    //   }, 300);
    // } catch (error: any) {
    //   // Even if API fails (like 404), logout locally
    //   // This is normal - some APIs don't have logout endpoint
    //   dispatch(clearCredentials());
      toast.success("Logged out successfully (Mock)");
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 300);
    // }
  };

  return (
    <>
      {/* Mobile Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-screen w-64 bg-white text-gray-800 shadow-lg border-r border-purple-100 flex flex-col z-50
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Header - Fixed at top */}
        <div className="p-6 pb-6 border-b border-purple-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Dr. Nelly's Books
              </h1>
              <p className="text-sm text-purple-500 mt-1">Admin Dashboard</p>
            </div>
            {/* Close button for mobile */}
            <button
              onClick={onClose}
              className="lg:hidden text-gray-400 hover:text-gray-600 focus:outline-none transition-colors p-1 hover:bg-gray-100 rounded-full"
              aria-label="Close menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Navigation Menu - Scrollable if needed */}
        <nav className="flex-1 overflow-y-auto px-6 py-4 space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/dashboard"}
              onClick={() => {
                // Close sidebar on mobile when clicking a link
                if (window.innerWidth < 1024) {
                  onClose();
                }
              }}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-200 transform scale-105"
                    : "text-gray-600 hover:bg-purple-50 hover:text-purple-600"
                }`
              }
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Logout Button - Fixed at bottom */}
        <div className="p-6 pt-4 border-t border-purple-200 flex-shrink-0">
          <button
            onClick={handleLogout}
            disabled={isLoading}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-gray-600 hover:bg-red-50 hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="text-xl">🚪</span>
            <span className="font-medium">
              {isLoading ? "Logging out..." : "Logout"}
            </span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
