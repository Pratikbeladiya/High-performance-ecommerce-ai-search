import React from "react";

const metrics = [
  { title: "Today's Orders", value: 128, color: "#2563eb" },
  { title: "Pending Orders", value: 21, color: "#f59e0b" },
  { title: "Low Stock Items", value: 9, color: "#dc2626" },
  { title: "Active Users", value: 842, color: "#16a34a" },
];

const AdminAnalyticsSummary = () => {
  return (
    <div
      style={{
        padding: "20px",
        background: "#ffffff",
        borderRadius: "12px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
      }}
    >
      <h2 style={{ marginBottom: "18px" }}>Analytics Summary</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
          gap: "16px",
        }}
      >
        {metrics.map((item, index) => (
          <div
            key={index}
            style={{
              border: `2px solid ${item.color}`,
              borderRadius: "10px",
              padding: "16px",
            }}
          >
            <p
              style={{
                margin: 0,
                color: "#666",
                fontSize: "14px",
              }}
            >
              {item.title}
            </p>

            <h3
              style={{
                marginTop: "10px",
                color: item.color,
                fontSize: "28px",
              }}
            >
              {item.value}
            </h3>
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: "22px",
          padding: "14px",
          background: "#f8fafc",
          borderRadius: "8px",
        }}
      >
        <h4 style={{ marginBottom: "8px" }}>Quick Insight</h4>

        <ul style={{ margin: 0, paddingLeft: "18px", lineHeight: "28px" }}>
          <li>Monitor daily order activity.</li>
          <li>Track pending order growth.</li>
          <li>Review inventory health.</li>
          <li>Observe active customer count.</li>
        </ul>
      </div>
    </div>
  );
};

export default AdminAnalyticsSummary;
