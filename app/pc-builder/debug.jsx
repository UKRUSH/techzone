"use client";

import { useState } from "react";

const PCBuilderDebug = () => {
  const [message, setMessage] = useState("PC Builder Debug Page");

  return (
    <div style={{ 
      minHeight: "100vh", 
      backgroundColor: "black", 
      color: "white", 
      padding: "20px",
      fontFamily: "Arial, sans-serif"
    }}>
      <h1 style={{ color: "yellow", fontSize: "48px", textAlign: "center" }}>
        {message}
      </h1>
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <button 
          onClick={() => setMessage("Button clicked!")}
          style={{
            backgroundColor: "yellow",
            color: "black",
            padding: "15px 30px",
            fontSize: "18px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          Click Me
        </button>
      </div>
      <div style={{ marginTop: "50px", textAlign: "center" }}>
        <p style={{ fontSize: "20px", color: "gray" }}>
          If you can see this, React is working correctly.
        </p>
        <p style={{ fontSize: "16px", color: "gray" }}>
          Time: {new Date().toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
};

export default PCBuilderDebug;
