import React, { useEffect, useState } from "react";
import SlickSlider from "../SlickSlider/SlickSlider";
// Updated image imports
import icon01 from "../../../assets/img/icon/choose_icon01.svg";  // Ensure the relative path is correct
import icon02 from "../../../assets/img/icon/choose_icon02.svg";
import icon03 from "../../../assets/img/icon/choose_icon03.svg";
import icon04 from "../../../assets/img/icon/choose_icon04.svg";
import WhyChooseUsItem from "./WhyChooseUsItem";

interface SliderItem {
  src: string;
  alt: string;
  link: string;
  title: React.ReactNode;
  description: string;
}

const WhyChooseUs: React.FC = () => {
  const slickSettings = {
    dots: false,
    infinite: true,
    speed: 1000,
    autoplay: true,
    arrows: false,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1200,
        settings: { slidesToShow: 3, slidesToScroll: 1, infinite: true },
      },
      {
        breakpoint: 992,
        settings: { slidesToShow: 2, slidesToScroll: 1 },
      },
      {
        breakpoint: 767,
        settings: { slidesToShow: 1, slidesToScroll: 1, arrows: false },
      },
      {
        breakpoint: 575,
        settings: { slidesToShow: 1, slidesToScroll: 1, arrows: false },
      },
    ],
  };

  const sliderItems: SliderItem[] = [
    {
      src: icon01,
      alt: "Comprehensive Data Integration",
      link: "/",
      title: "Comprehensive Data Integration",
      description:
        "Seamlessly collect and integrate data from various departments and stakeholders to ensure a unified and accurate report.",
    },
    {
      src: icon02,
      alt: "Customizable Reporting",
      link: "/",
      title: "Customizable Reporting",
      description:
        "Generate tailored reports that meet the specific needs of your institution, with flexible options to adjust data presentation and focus.",
    },
    {
      src: icon03,
      alt: "Role-Based Dashboards",
      link: "/",
      title: <>Role-Based Dashboards</>,
      description:
        "Enable cross-department collaboration with real-time data sharing, fostering efficient communication and decision-making.",
    },
    {
      src: icon04,
      alt: "Enhanced Transparency",
      link: "/",
      title: "Enhanced Transparency",
      description:
        "Streamline the process of creating comprehensive reports that improve institutional transparency and accountability.",
    },
    {
      src: icon01,
      alt: "Automated Reporting",
      link: "/",
      title: "Automated Reporting",
      description:
        "Save time and resources with automated report generation, ensuring timely and accurate annual reports for stakeholders.",
    },
    {
      src: icon03,
      alt: "Real-Time Collaboration",
      link: "/",
      title: <>Real-Time Collaboration</>,
      description:
        "Facilitate seamless collaboration between stakeholders with tools that allow updates and feedback in real-time.",
    },
    {
      src: icon04,
      alt: "Secure Data Management",
      link: "/",
      title: "Secure Data Management",
      description:
        "Protect sensitive institutional data with robust encryption and security measures.",
    },
  ];

  const initialState = 0;
  const [count, setCount] = useState<number>(initialState);
  const toMultiply = 100 / sliderItems.length;

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => (prev === sliderItems.length - 1 ? 0 : prev + 1));
    }, 3000);
    return () => clearInterval(interval);
  }, [sliderItems.length]);

  return (
    <section className="choose-area pb-130">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-6">
            <div className="section-title text-center mb-50">
              <span className="sub-title">Why Choose Us</span>
              <h2 className="title">
                Why choose our PLATFORM <span>REPORTEASE</span>
              </h2>
            </div>
          </div>
        </div>

        <div className="row choose-active">
          <SlickSlider settings={slickSettings}>
            {sliderItems.map((item, index) => (
              <div key={index} className="col-lg-3">
                <WhyChooseUsItem item={item} />
              </div>
            ))}
          </SlickSlider>
        </div>

        <div className="slide-progressbar">
          <div
            style={{
              backgroundSize: `${count * toMultiply}% 100%`,
            }}
            className="slide-filler"
          />
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
