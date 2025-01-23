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
          Authorization: token,
          "ngrok-skip-browser-warning": "6024",
          Connection: "keep-alive",
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

  const handleDeleteMaterial = async (id) => {
    if (!window.confirm("Are you sure you want to delete this material?")) {
      return;
    }
  
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: token,
        },
      });
  
      if (!response.ok) {
        throw new Error("Failed to delete material.");
      }
  
      fetchMaterials();
    } catch (error) {
      console.error("Error deleting material:", error);
      setAlertMessage("Failed to delete material. Please try again later.");
    }
  };

  const handleAddMaterial = async () => {
    const name = prompt("Enter the name for the new material:");
    if (!name) return;

    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("file", file);
      formData.append("name", name);
      formData.append("filename", file.name);

      try {
        const token = getAuthToken();
        const response = await fetch(API_URL, {
          method: "POST",
          headers: {
            Authorization: token,
          },
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Failed to add material.");
        }

        fetchMaterials();
      } catch (error) {
        console.error("Error adding material:", error);
        setAlertMessage("Failed to add material. Please try again later.");
      }
    };
    fileInput.click();
  };

  const handleRenameMaterial = async (id) => {
    const newName = prompt("Enter the new name for the material:");
    if (!newName) return;

    try {
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ name: newName }),
      });

      if (!response.ok) {
        throw new Error("Failed to rename material.");
      }

      fetchMaterials();
    } catch (error) {
      console.error("Error renaming material:", error);
      setAlertMessage("Failed to rename material. Please try again later.");
    }
  };

  const handleDownload = (url, filename) => {
    if (!url) {
      alert("Download link not available.");
      return;
    }

    // Replace localhost URL if needed
    const adjustedUrl = url.startsWith("http://localhost:3000")
      ? url.replace("http://localhost:3000", "https://quality-owl-simply.ngrok-free.app")
      : url;

    const link = document.createElement("a");
    link.href = adjustedUrl;
    link.download = filename || "download";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
            <button className="add-material-btn" onClick={handleAddMaterial}>
              Add New Material
            </button>
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
                        onClick={() => handleRenameMaterial(material.id)}
                        className="rename-btn"
                      >
                        Rename
                      </button>
                      <button
                        onClick={() => handleDownload(downloadUrl, material.filename)}
                        className="download-btn"
                      >
                        Download
                      </button>
                      <button
                        onClick={() => handleDeleteMaterial(material.id)}
                        className="delete-btn"
                      >
                        Delete
                      </button>
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
