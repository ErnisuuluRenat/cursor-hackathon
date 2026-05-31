"use client";

export default function MapScreen() {
  const adventurePins = [
    { id: 1, name: "Japan Trip", coords: { x: "75%", y: "45%" }, desc: "Epic Tokyo Exploration", coolness: 85, icon: "🇯🇵" },
    { id: 2, name: "Hiking in Almaty", coords: { x: "45%", y: "30%" }, desc: "Gore-tex & glaciers", coolness: 72, icon: "⛰️" },
    { id: 3, name: "Beach Volleyball", coords: { x: "25%", y: "60%" }, desc: "Golden sunset games", coolness: 60, icon: "🏐" },
  ];

  return (
    <div className="app-container" style={{ position: "relative", minHeight: "450px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "1.5rem", fontSize: "1.5rem" }}>
        🗺️ Adventure Map (карта)
      </h2>
      <p style={{ textAlign: "center", fontSize: "0.9rem", color: "var(--text-muted)", marginBottom: "1.5rem" }}>
        Explore where your crew has left their legendary footprints this summer.
      </p>

      {/* Stylized Vector World Map Background */}
      <div
        style={{
          width: "100%",
          height: "260px",
          background: "radial-gradient(circle, #1e1b4b 0%, #090915 100%)",
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--glass-border)",
          position: "relative",
          overflow: "hidden",
          boxShadow: "inset 0 0 30px rgba(0, 0, 0, 0.8)",
        }}
      >
        {/* Custom styled vector Grid lines for high fidelity futuristic mapping */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />

        {/* Dynamic map glowing pins */}
        {adventurePins.map((pin) => (
          <div
            key={pin.id}
            style={{
              position: "absolute",
              left: pin.coords.x,
              top: pin.coords.y,
              transform: "translate(-50%, -50%)",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              zIndex: 10,
            }}
          >
            {/* Glowing ripple effect */}
            <div
              style={{
                position: "absolute",
                width: "30px",
                height: "30px",
                borderRadius: "50%",
                background: "var(--secondary)",
                opacity: 0.4,
                animation: "ping 2s cubic-bezier(0, 0, 0.2, 1) infinite",
              }}
            />
            {/* Main Pin circle */}
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, var(--secondary) 0%, #0d9488 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 15px var(--secondary)",
                fontSize: "1.2rem",
                border: "2px solid #ffffff",
              }}
              title={pin.name}
            >
              {pin.icon}
            </div>

            {/* Micro details popup card */}
            <div
              style={{
                background: "rgba(10, 10, 22, 0.95)",
                border: "1px solid var(--glass-border)",
                borderRadius: "8px",
                padding: "0.5rem 0.75rem",
                width: "140px",
                position: "absolute",
                top: "42px",
                boxShadow: "0 4px 15px rgba(0,0,0,0.5)",
                pointerEvents: "none",
                textAlign: "center",
              }}
            >
              <h4 style={{ fontSize: "0.8rem", color: "#ffffff", fontWeight: 700 }}>{pin.name}</h4>
              <p style={{ fontSize: "0.7rem", margin: "0.15rem 0 0", color: "var(--text-muted)" }}>{pin.desc}</p>
              <div style={{ fontSize: "0.75rem", color: "var(--primary)", fontWeight: "bold", marginTop: "0.25rem" }}>
                Score: {pin.coolness}/100
              </div>
            </div>
          </div>
        ))}
      </div>

      <style jsx global>{`
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
