import React from "react";
import img01 from "../../../assets/img/team/01.png";
import img02 from "../../../assets/img/team/team_img02.png";
import img03 from "../../../assets/img/team/team_img03.png";
import img04 from "../../../assets/img/team/team_img04.png";
import img06 from "../../../assets/img/team/team_img06.png";
import img07 from "../../../assets/img/team/team_img07.png";
import TeamOneItem from "./TeamOneItem";

interface TeamMember {
  src: string;
  name: string;
  designation: string;
  alt: string;  // Added alt text for images
}

const TeamOne: React.FC = () => {
  const team_members: TeamMember[] = [
    {
      src: img01,
      name: "Cameron Williamson",
      designation: "Founder & CO",
      alt: "Cameron Williamson, Founder & CO",
    },
    {
      src: img02,
      name: "Eleanor Pena",
      designation: "Head of Design",
      alt: "Eleanor Pena, Head of Design",
    },
    {
      src: img03,
      name: "Bessie Cooper",
      designation: "Vp People",
      alt: "Bessie Cooper, VP People",
    },
    {
      src: img04,
      name: "Darlene Robertson",
      designation: "Product Manager",
      alt: "Darlene Robertson, Product Manager",
    },
    {
      src: img06,
      name: "Courtney Henry",
      designation: "Founder",
      alt: "Courtney Henry, Founder",
    },
    {
      src: img07,
      name: "Ronald Richards",
      designation: "Account Manager",
      alt: "Ronald Richards, Account Manager",
    },
  ];

  return (
    <section className="team-area pt-130">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-6">
            <div className="section-title text-center mb-70">
              <span className="sub-title">Our Team</span>
              <h2 className="title">
                The Leadership <br /> <span>Team</span>
              </h2>
            </div>
          </div>
        </div>

        <div className="row justify-content-center">
          {team_members.map((member, index) => (
            <div key={index} className="col-xl-3 col-md-4 col-sm-6">
              <TeamOneItem item={member} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamOne;
