import React from "react";
import { Link } from "react-router-dom";

// Import the image
import backgroundImage from "../../assets/img/images/collab.jpeg"; // Correct path based on your folder structure

// Define the prop types
interface WhoWeAreProps {
  imgSrc: string;
}

const WhoWeAre: React.FC<WhoWeAreProps> = () => {
  return (
    <section
      id="about"
      className="about-area pt-130 pb-130"
      style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
    >
      {/* Left Side with Background Image */}
      <div
        style={{
          backgroundImage: `url(${backgroundImage})`, // Using the imported image directly
          backgroundSize: "cover",
          backgroundPosition: "center",
          width: "100%",
          height: "65vh",
          borderTopLeftRadius: "10px",
          borderBottomLeftRadius: "20px",
          opacity: "0.8",
          flex: "1",
        }}
      />
      {/* Right Side with Content */}
      <div className="container" style={{ flex: "1", padding: "0 20px" }}>
        <div className="row align-items-center">
          <div className="col-lg-12">
            <div className="about-content wow fadeInRight" data-wow-delay=".2s">
              <div className="section-title mb-30">
                <span className="sub-title">Who we are</span>
                <h2 className="title">
                  Streamlining <span>Annual Report</span> Creation for Educational Institutes.
                </h2>
              </div>
              <p>
                We streamline the process of creating comprehensive annual
                reports for educational institutes. From data collection to
                report generation, we offer a complete solution to enhance
                transparency and optimize decision-making.
              </p>
              <Link to="/" className="btn">
                READ MORE
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhoWeAre;
