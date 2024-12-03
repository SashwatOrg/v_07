import React from "react";
import Banner from "../../Landingpage/Banner/Banner";
import ContactOne from "../../Landingpage/Contact/ContactOne";
import Roadmap from "../../Landingpage/Roadmap/Roadmap";
import Sales from "../../Landingpage/Sales/Sales";
import TeamOne from "../../Landingpage/Team/TeamOne";
import WhoWeAre from "../../Landingpage/WhoWeAre/WhoWeAre";
import WhyChooseUs from "../../Landingpage/WhyChooseUs/WhyChooseUs";
import LayoutOne from "../../../layouts/LayoutOne";
import aboutImg from "../../../assets/img/images/about_img01.png";
 // Image path import

const Home: React.FC = () => {
  return (
    <LayoutOne>
      <main className="fix">
        <Banner />
        {/* Pass the imgSrc prop here with the correct path */}
        <WhoWeAre imgSrc={aboutImg} />
        <WhyChooseUs />
        <Sales />
        <div className="area-bg">
          <Roadmap />
        </div>
        <TeamOne />
        <ContactOne />
      </main>
    </LayoutOne>
  );
};

export default Home;
