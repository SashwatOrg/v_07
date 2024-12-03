import React from "react";
import { useHorizontalScroll } from "../../../lib/hooks/useHorizontalScroll";
import RoadmapItem from "./RoadmapItem";

interface RoadmapItemType {
  roadmapTitle: string;
  title: string;
  info: string[];
}

const Roadmap: React.FC = () => {
  const roadmap_items: RoadmapItemType[] = [
    {
      roadmapTitle: "Phase 1: Q4 2024",
      title: "Concept",
      info: [
        "Define goals and scope.",
        "Research existing solutions.",
        "Identify features: security, collaboration, automation.",
      ],
    },
    {
      roadmapTitle: "Phase 2: Q1 2025",
      title: "Design",
      info: [
        "Design system architecture with RBAC and encryption.",
        "Create a prototype for report customization.",
        "Define APIs for data integration.",
      ],
    },
    {
      roadmapTitle: "Phase 3: Q2 2025",
      title: "Development",
      info: [
        "Build portal with secure authentication (OAuth 2.0, 2FA).",
        "Add collaboration and version control modules.",
        "Use AWS services for storage and processing.",
      ],
    },
    {
      roadmapTitle: "Phase 4: Q3 2025",
      title: "Testing",
      info: [
        "Beta test with students, coordinators, and admins.",
        "Test data visualization and reports.",
        "Check performance and scalability.",
      ],
    },
    {
      roadmapTitle: "Phase 5: Q4 2025",
      title: "Launch",
      info: [
        "Launch the Annual Report Portal.",
        "Add NLP summaries and AI chatbot.",
        "Gather feedback and refine features.",
      ],
    },
    {
      roadmapTitle: "Phase 6: Q1 2026",
      title: "Expansion",
      info: [
        "Add more data integrations.",
        "Implement analytics dashboards.",
        "Optimize for scaling to other institutes.",
      ],
    },
  ];

  // Ensuring the ref is typed as HTMLDivElement
  const scrollRef = useHorizontalScroll() as React.RefObject<HTMLDivElement>;

  return (
    <section id="roadmap" className="roadmap-area pt-130 pb-130">
      <div className="container custom-container-two">
        <div className="row justify-content-center">
          <div className="col-xl-5 col-lg-8">
            <div className="section-title text-center mb-60">
              <span className="sub-title">Our Roadmap</span>
              <h2 className="title">
                <span>REPORTEASE</span> Strategy and <br /> Project Plan
              </h2>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-12">
            <div
              className="bt-roadmap_x bt-roadmap-scrollbar"
              ref={scrollRef}
              style={{ overflowX: "auto", whiteSpace: "nowrap" }}
            >
              <div className="bt-roadmap-wrap d-flex">
                {roadmap_items.map((item, index) => (
                  <RoadmapItem key={index} item={item} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Roadmap;
