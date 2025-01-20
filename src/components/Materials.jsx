import React, { useEffect, useState } from "react";
import QuizGenerator from "./QuizGenerator";
import CustomAlert from "./CustomAlert";
import { getAuthToken, getUserEmail } from "./CallbackHandler";
import config from "./config";

import "./Materials.css";

const API_URL = `${config.apiUrl}/materials`;

const Materials = () => {
  const [materials, setMaterials] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alertMessage, setAlertMessage] = useState(null);

  const fetchMaterials = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        setAlertMessage("Authorization token is missing. Please log in.");
        return;
      }

      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          "Authorization": token,
          "ngrok-skip-browser-warning": "6024",
          "Connection": "keep-alive",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setMaterials(data);
    } catch (error) {
      console.error("Error fetching materials:", error);
      setAlertMessage("Failed to fetch materials. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const userEmail = getUserEmail();
    if (!userEmail) {
      setAlertMessage("User not found. Please log in.");
      setLoading(false);
      return;
    }
    fetchMaterials();
  }, []);

  const handleMaterialSelect = (id) => {
    setSelectedMaterials((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((materialId) => materialId !== id)
        : [...prevSelected, id]
    );
  };

  const getFileUrl = (file_url) => {
    if (!file_url || file_url === "") return null;
    if (file_url.startsWith("http://localhost:3000")) {
      return file_url.replace("http://localhost:3000", config.apiUrl);
    }
    return file_url;
  };

  return (
    <div className="materials-container">
      {alertMessage ? (
        <CustomAlert message={alertMessage} onClose={() => setAlertMessage(null)} />
      ) : (
        <div className="materials-section">
          <div className="materials-header">
            <h2>Materials</h2>
          </div>
          {loading ? (
            <p>Loading materials...</p>
          ) : (
            <div className="materials-grid">
              {materials.map((material) => {
                const downloadUrl = getFileUrl(material.file_url);

                return (
                  <div key={material.id} className="material-item">
                    <input
                      type="checkbox"
                      className="select-checkbox"
                      checked={selectedMaterials.includes(material.id)}
                      onChange={() => handleMaterialSelect(material.id)}
                    />
                    <div className="material-details">
                      <h3>{material.name}</h3>
                      <p>{material.filename}</p>
                    </div>
                    <div className="material-actions">
                      <button
                        onClick={() => handleDeleteMaterial(material.id)}
                        className="delete-btn"
                      >
                        Delete
                      </button>
                      {downloadUrl ? (
                        <button onClick={() => handleDownload(downloadUrl, material.filename)}>
                          Download
                        </button>
                      ) : (
                        <span>Download not available</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
      <div className="quiz-generator-section">
        <QuizGenerator selectedMaterials={selectedMaterials} />
      </div>
    </div>
  );
};

export default Materials;
