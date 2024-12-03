import React from "react";
import Banner from "../../components/Landingpage/Banner/Banner";
import ContactOne from "../../components/Landingpage/Contact/ContactOne";
import Roadmap from "../../components/Landingpage/Roadmap/Roadmap";
import Sales from "../../components/Landingpage/Sales/Sales";
import TeamOne from "../../components/Landingpage/Team/TeamOne";
import WhoWeAre from "../../components/Landingpage/WhoWeAre/WhoWeAre";
import WhyChooseUs from "../../components/Landingpage/WhyChooseUs/WhyChooseUs";
import LayoutOne from "../../layouts/LayoutOne";
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
