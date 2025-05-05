import React, { useState, useEffect, useRef } from "react";
import {
  ref,
  set,
  onValue,
  update,
  get,
} from "firebase/database";
import { db } from "../firebase";
import "./StatusPage.css";

function StatusPage({ currentUser }) {
  const [textStatus, setTextStatus] = useState("");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [imageFile, setImageFile] = useState(null);
  const [sponsorLink, setSponsorLink] = useState("");
  const [statuses, setStatuses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const observedRefs = useRef({});

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 5 * 1024 * 1024) {
      alert("Ifoto irengeje 5MB. Hitamo ifoto ntoya.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageFile(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handlePostStatus = () => {
    const timestamp = Date.now();
    const statusId = `status_${currentUser.phone}_${timestamp}`;

    const newStatus = {
      id: statusId,
      user: {
        phone: currentUser.phone,
        username: currentUser.username,
      },
      type: imageFile ? "image" : "text",
      text: textStatus,
      image: imageFile || null,
      bgColor,
      sponsor: sponsorLink || null,
      timestamp,
      views: 0,
    };

    set(ref(db, `statuses/${statusId}`), newStatus);

    // Gusubiza ibintu kuri default
    setTextStatus("");
    setImageFile(null);
    setSponsorLink("");
    setBgColor("#ffffff");
    setShowForm(false);
  };

  const incrementView = async (statusId) => {
    const viewsRef = ref(db, `statuses/${statusId}/views`);
    const snapshot = await get(viewsRef);
    const currentViews = snapshot.exists() ? snapshot.val() : 0;
    update(ref(db, `statuses/${statusId}`), { views: currentViews + 1 });
  };

  useEffect(() => {
    const statusRef = ref(db, "statuses");
    onValue(statusRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loadedStatuses = Object.values(data).sort(
          (a, b) => b.timestamp - a.timestamp
        );
        setStatuses(loadedStatuses);
      } else {
        setStatuses([]);
      }
    });
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const statusId = entry.target.dataset.statusid;
          if (entry.isIntersecting && !observedRefs.current[statusId]) {
            observedRefs.current[statusId] = true;
            incrementView(statusId);
          }
        });
      },
      { threshold: 0.5 }
    );

    const elements = document.querySelectorAll(".status-card");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [statuses]);

  return (
    <div className="status-container">
      <h2>Status Page</h2>

      {showForm && (
        <div className="status-form">
          <h3>Shyiraho Status</h3>
          <textarea
            placeholder="Andika status..."
            value={textStatus}
            onChange={(e) => setTextStatus(e.target.value)}
            style={{
              width: "100%",
              height: 60,
              backgroundColor: bgColor,
              padding: 10,
              marginBottom: 10,
            }}
          />

          <label>
            Hitamo Ibara:
            <input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              style={{ marginLeft: 10 }}
            />
          </label>

          <br /><br />

          <label>
            Shyiraho Ifoto:
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </label>

          {imageFile && (
            <img
              src={imageFile}
              alt="preview"
              className="status-preview"
            />
          )}

          <br /><br />

          <input
            type="text"
            placeholder="Shyiramo link ya sponsor (niba ibayeho)"
            value={sponsorLink}
            onChange={(e) => setSponsorLink(e.target.value)}
            style={{ width: "100%", marginBottom: 10 }}
          />

          <button onClick={handlePostStatus}>Ohereza Status</button>
        </div>
      )}

      <div>
        <h3>Status z'abandi</h3>
        {statuses.map((status) => (
          <div
            key={status.id}
            className="status-card"
            data-statusid={status.id}
            style={{
              backgroundColor: status.bgColor || "#eee",
              padding: 10,
              marginBottom: 10,
              borderRadius: 10,
            }}
          >
            <h4>{status.user?.username || status.user?.phone}</h4>
            {status.type === "text" && <p>{status.text}</p>}
            {status.type === "image" && (
              <>
                <img
                  src={status.image}
                  alt="status"
                  className="status-image"
                />
                {status.text && <p>{status.text}</p>}
              </>
            )}
            {status.sponsor && (
              <a href={status.sponsor} target="_blank" rel="noreferrer">
                Sponsored Link
              </a>
            )}
            <p style={{ fontSize: 12, color: "#555" }}>
              Views: {status.views || 0}
            </p>
          </div>
        ))}
      </div>

      <button className="floating-btn" onClick={() => setShowForm(!showForm)}>
        +
      </button>
    </div>
  );
}

export default StatusPage;
