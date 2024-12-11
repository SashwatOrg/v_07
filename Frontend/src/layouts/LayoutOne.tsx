import React, { ReactNode, useState, useEffect } from "react";
import FooterOne from "../components/Landingpage/Footer/FooterOne";
import HeaderOne from "../components/Landingpage/Header/HeaderOne";
import PageLoader from "../components/Landingpage/PageLoader/PageLoader";
// import "bootstrap/dist/js/bootstrap.bundle.min";
// import 'react-toastify/dist/ReactToastify.css'
// import './assets/css/bootstrap.min.css';
// import './assets/css/animate.min.css';
// import './assets/css/fontawesome-all.min.css';
// import './assets/css/react-odometer-theme.css';
// import './assets/css/default.css';
// import './assets/css/style.css';
// import './assets/css/responsive.css';
// import 'bootstrap/dist/js/bootstrap.bundle.min.js'
// Define the type for props to include 'children'
interface LayoutOneProps {
  children: ReactNode;
}

const LayoutOne: React.FC<LayoutOneProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true); // State to manage PageLoader visibility

  useEffect(() => {
    // Simulate a page load by hiding the loader after a delay
    const timer = setTimeout(() => setIsLoading(false), 2000); // Adjust the timeout as needed
    return () => clearTimeout(timer); // Cleanup the timer
  }, []);

  return (
    <div className="layout-container">
      {isLoading ? (
        <PageLoader /> // Show PageLoader if loading
      ) : (
        <>
          <HeaderOne /> {/* Header section */}
          <main role="main" className="main-content"> {/* Main content */}
            {children}
          </main>
          <FooterOne /> {/* Footer section */}
        </>
      )}
    </div>
  );
};

export default LayoutOne;



