import React, { useEffect, useState } from "react";
import shape01 from "../../../assets/img/banner/banner_shape01.png"; // Ensure this path is correct
import CountDownOne from "../CountDown/CountDownOne";
// import './assets/css/bootstrap.min.css';
// import './assets/css/animate.min.css';
// import './assets/css/fontawesome-all.min.css';
// import './assets/css/react-odometer-theme.css';
// import './assets/css/default.css';
// import './assets/css/style.css';
// import './assets/css/responsive.css';
// import 'bootstrap/dist/js/bootstrap.bundle.min.js'

interface BannerProps {
  // Define any props if needed here
}

const Banner: React.FC<BannerProps> = (props) => {
  // State to store the current date
  const [currentDate, setCurrentDate] = useState<string>("");

  useEffect(() => {
    // Function to get the current date in the format 'DD MMMM YYYY'
    const getCurrentDate = () => {
      const today = new Date();
      const day = today.getDate();
      const month = today.toLocaleString('default', { month: 'long' });
      const year = today.getFullYear();
      return `${day < 10 ? '0' + day : day} ${month} ${year}`;
    };

    // Set the current date when the component mounts
    setCurrentDate(getCurrentDate());

    // Optional: If you want the date to update every day (even when the component is still mounted), you could use a setInterval
    const interval = setInterval(() => {
      setCurrentDate(getCurrentDate());
    }, 86400000); // Update every 24 hours (86400000 milliseconds)

    // Clear interval on component unmount to prevent memory leaks
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="banner-area banner-bg">
      <div className="banner-shape-wrap">
        <img src={shape01} alt="Banner Shape" className="img-one" />
      </div>
      <br />
      <br />

      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="banner-content text-center">
              <h2 className="title">
                WELCOME TO <span>REPORTEASE</span>
              </h2>
            </div>
            <div className="banner-progress-wrap">
              <ul>
                <li>Organize</li>
                <li>Analyze</li>
                <li>Achieve</li>
              </ul>
              <div className="progress">
                <div
                  className="progress-bar"
                  role="progressbar"
                  style={{ width: "92%" }}
                  aria-valuenow={75}
                  aria-valuemin={0}
                  aria-valuemax={100}
                />
              </div>
              <h4 className="title">
                Simplify Reporting Processes <span>Enhance Decision-Making Power</span>
              </h4>
            </div>
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-xl-10">
            <div className="banner-countdown-wrap text-center">
              <h2 className="title">{currentDate}</h2>
              <CountDownOne />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
