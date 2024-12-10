import React from "react";
import img01 from "../../../assets/img/team/01.png";
import img02 from "../../../assets/img/team/02.png";
import img03 from "../../../assets/img/team/03.png";
import img04 from "../../../assets/img/team/06.png";
import img07 from "../../../assets/img/team/04.png";
import img06 from "../../../assets/img/team/05.png";
import img08 from "../../../assets/img/team/07.png";
import img09 from "../../../assets/img/team/08.jpeg";
import TeamOneItem from "./TeamOneItem";

interface TeamMember {
  src: string;
  name: string;
  designation: string;
  linkedin: string;
  github: string;
  instagram: string;
}

const TeamOne: React.FC = () => {
  const team_members: TeamMember[] = [
    {
      src: img08,
      name: "Mr. Amar More",
      designation: "Faculty Mentor",
      linkedin: "https://www.linkedin.com/in/amar-more-a356159/",
      github: "       ",
      instagram: "      ",
    },
    {
      src: img09,
      name: "Mst. Neeraj Kumar",
      designation: "Industrial Mentor",
      linkedin: "https://www.linkedin.com/in/neeraj-kumar-091415237/",
      github: "     ",
      instagram: "        ",
    },
    {
      src: img01,
      name: "Viraj Mandlik",
      designation: "Team Leader",
      linkedin: "https://www.linkedin.com/in/viraj-mandlik-21a79a290/",
      github: "     ",
      instagram: "https://www.instagram.com/v_r_a_07/",
    },
    {
      src: img02,
      name: "Guru Dahiphale",
      designation: "Frontend Developer",
      linkedin: "https://www.linkedin.com/in/guru-dahiphale-02862225b/",
      github: "https://github.com/Guruvd07",
      instagram: "https://www.instagram.com/guruvd_07/",
    },
    {
      src: img03,
      name: "Vishal Kesharvani",
      designation: "Cloud Engineer",
      linkedin: "https://www.linkedin.com/in/vishal-kesharwani-76708025b?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
      github: "https://github.com/vishal-kesharwani",
      instagram: "https://www.instagram.com/vii.shaa.ll?igsh=bmtidWk1aWE3ajds",
    },
    {
      src: img04,
      name: "Hanumant Kakde",
      designation: "Backend Developer",
      linkedin: "https://www.linkedin.com/in/hanumant-kakde-7bb26b258/",
      github: "https://github.com/HBTK",
      instagram: "https://www.instagram.com/hanumant_kakde/",
    },
    {
      src: img06,
      name: "Parth Kulkarni",
      designation: "Database Management",
      linkedin: "https://www.linkedin.com/in/parthkulkarni16",
      github: "https://github.com/parthdk16",
      instagram: "https://www.instagram.com/parthkulkarni",
    },
    {
      src: img07,
      name: "Siddhi Chhapre",
      designation: "Backend Developer",
      linkedin: "https://www.linkedin.com/in/siddhi-c-05a0b9306/",
      github: "     ",
      instagram: "https://www.instagram.com/_siddhi.21_/",
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

        {/* First Row with two members */}
        <div className="row first-row">
          {team_members.slice(0, 2).map((member, index) => (
            <div key={index} className="team-item">
              <TeamOneItem item={member} />
            </div>
          ))}
        </div>

        {/* Remaining Rows */}
        <div className="row">
          {team_members.slice(2).map((member, index) => (
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
