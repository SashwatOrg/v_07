import React from "react";
import img01 from "../../../assets/img/team/01.png";
import img02 from "../../../assets/img/team/02.png";
import img03 from "../../../assets/img/team/03.png";
import img04 from "../../../assets/img/team/06.png";
import img07 from "../../../assets/img/team/04.png";
import img06 from "../../../assets/img/team/05.png";
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
      name: "Viraj Mandlik",
      designation: "Team Leader",
      alt: "Cameron Williamson, Founder & CO",
    },
    {
      src: img02,
      name: "Guru Dahiphale",
      designation: "Frontend Developer",
      alt: "Eleanor Pena, Head of Design",
    },
    {
      src: img03,
      name: "VIshal Kesharvani",
      designation: "Cloud Engineer",
      alt: "Bessie Cooper, VP People",
    },
    {
      src: img04,
      name: "Hanumant Kakde",
      designation: "Backend Developer",
      alt: "Darlene Robertson, Product Manager",
    },
    {
      src: img06,
      name: "Parth Kulkarni",
      designation: "Database Management",
      alt: "Courtney Henry, Founder",
    },
    {
      src: img07,
      name: "Siddhi Chhapre",
      designation: "Backend Developer",
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

