import React from "react";
import { Link } from "react-router-dom";
// Adjust the import path to be correct based on the folder structure
import img01 from "../../../assets/img/images/about_img01.png"; // Ensure the correct relative path

interface WhoWeAreProps {
  imgSrc?: string; // Optional prop if needed for dynamic images
}

const WhoWeAre: React.FC<WhoWeAreProps> = ({ imgSrc = img01 }) => {
  return (
    <section id="about" className="about-area pt-130 pb-130">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6">
            <div className="about-img wow fadeInLeft" data-wow-delay=".2s">
              <img src={imgSrc} alt="About Us" />
            </div>
          </div>
          <div className="col-lg-6">
            <div className="about-content wow fadeInRight" data-wow-delay=".2s">
              <div className="section-title mb-30">
                <span className="sub-title">Who we are</span>
                <h2 className="title">
                  Streamlining <span>Annual Report</span> Creation for Educational Institutes.
                </h2>
              </div>
              <p>
                We streamline the process of creating comprehensive annual reports for educational institutes. From data collection to report generation, we offer a complete solution to enhance transparency and optimize decision-making.
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
