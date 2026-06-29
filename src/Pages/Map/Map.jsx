import React from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

const Map = () => {
  // Faisalabad Clock Tower (Ghanta Ghar)
  const faisalabad = [31.418715, 73.079109];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f3f4f6",
        padding: "40px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          background: "#fff",
          borderRadius: "20px",
          overflow: "hidden",
          boxShadow: "0 15px 40px rgba(0,0,0,0.15)",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "linear-gradient(135deg,#2563eb,#1d4ed8)",
            color: "#fff",
            padding: "25px",
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: "32px",
              fontWeight: "700",
            }}
          >
            📍 Faisalabad Property Map
          </h1>

          <p
            style={{
              marginTop: "10px",
              opacity: 0.9,
              fontSize: "16px",
            }}
          >
            Explore property locations in Faisalabad using PropSightAI.
          </p>
        </div>

        {/* Map */}
        <MapContainer
          center={faisalabad}
          zoom={13}
          minZoom={11}
          maxZoom={18}
          scrollWheelZoom={true}
          style={{
            height: "650px",
            width: "100%",
          }}
        >
          <TileLayer
            attribution="© OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Center Marker */}
          <Marker position={faisalabad}>
            <Popup>
              <strong>Faisalabad</strong>
              <br />
              Property listings available here.
            </Popup>
          </Marker>

          {/* Highlight Area */}
          <Circle
            center={faisalabad}
            radius={5000}
            pathOptions={{
              color: "#2563eb",
              fillColor: "#3b82f6",
              fillOpacity: 0.15,
            }}
          />
        </MapContainer>

        {/* Footer */}
        <div
          style={{
            padding: "20px",
            background: "#fafafa",
            borderTop: "1px solid #eee",
          }}
        >
          <h3 style={{ marginBottom: "10px" }}>
            📌 Selected City
          </h3>

          <p
            style={{
              color: "#666",
              margin: 0,
              lineHeight: "1.7",
            }}
          >
            Currently displaying <strong>Faisalabad</strong>.
            Future versions of PropSightAI will load live property locations
            from your Spring Boot backend.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Map;