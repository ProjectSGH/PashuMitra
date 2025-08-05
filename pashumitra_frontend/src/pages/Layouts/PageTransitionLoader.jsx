import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import resources from "../../resource";

const PageTransitionLoader = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    setLoading(true);

    const timeout = setTimeout(() => {
      setLoading(false);
    }, 350); // Adjust duration

    return () => clearTimeout(timeout);
  }, [location.pathname]);

  return loading ? (
    <div className="flex justify-center items-center min-h-[300px] py-24">
      <img src={resources.CustomLoader.src} alt="Loading..." className="w-20 h-20" />
    </div>
  ) : (
    children
  );
};

export default PageTransitionLoader;
