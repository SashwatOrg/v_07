
import React, { useState } from "react";

interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    question: "How do I generate the annual report?",
    answer:
      "Login to your account, input necessary data, and click 'Generate Report'. The system processes the data and provides you with a downloadable report.",
  },
  {
    question: "What types of data do I need to provide?",
    answer:
      "Provide data on user activities, services used, performance metrics for the year, etc., in CSV or Excel format.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Yes, the system encrypts your data to ensure it's secure during transfer and storage.",
  },
  {
    question: "Can I check the status of my report?",
    answer:
      "Yes, navigate to the 'My Reports' section to check the status and download your report once it's ready.",
  },
  {
    question: "How can I get technical support?",
    answer:
      "You can either use the chatbot or contact our support team via email or phone.",
  },
];

const Support: React.FC = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleAnswer = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        maxWidth: "90%",
        margin: "auto",
        borderRadius: "10px",
        backgroundColor: "#f9f9f9",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          color: "#333",
          marginBottom: "20px",
          fontSize: "2rem",
        }}
      >
        Frequently Asked Questions (FAQ)
      </h2>

      {faqs.map((faq, index) => (
        <div
          key={index}
          style={{
            marginBottom: "15px",
            padding: "15px",
            borderRadius: "8px",
            backgroundColor: "#fff",
            border: "1px solid #ddd",
            boxShadow: expandedIndex === index ? "0 4px 8px rgba(0, 0, 0, 0.1)" : "none",
          }}
        >
          <div
            onClick={() => toggleAnswer(index)}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              cursor: "pointer",
              color: "#007bff",
              fontSize: "1.2rem",
              fontWeight: "500",
            }}
          >
            <span>{faq.question}</span>
            <span
              style={{
                transform: expandedIndex === index ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.3s",
                fontSize: "1.5rem",
              }}
            >
              ▼
            </span>
          </div>
          {expandedIndex === index && (
            <p
              style={{
                marginTop: "10px",
                color: "#555",
                fontSize: "1rem",
                lineHeight: "1.6",
              }}
            >
              {faq.answer}
            </p>
          )}
        </div>
      ))}

      <button
        onClick={() => setExpandedIndex(null)}
        style={{
          display: "block",
          margin: "20px auto",
          padding: "10px 20px",
          fontSize: "1rem",
          color: "#fff",
          backgroundColor: "#007bff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          transition: "background-color 0.3s",
        }}
      >
        Collapse All
      </button>
    </div>
  );
};

export default Support;
