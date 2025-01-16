import React, { useEffect, useState } from "react";
import QuizGenerator from "./QuizGenerator";
import CustomAlert from "./CustomAlert";
import "./Materials.css";

const API_URL = "https://quality-owl-simply.ngrok-free.app/materials";

const MOCK_MATERIALS = [
  { id: 1, name: "Mock Material 1", filename: "mock-material-1.txt", file_url: "http://localhost:3000/mock-material-1.txt" },
  { id: 2, name: "Mock Material 2", filename: "mock-material-2.pdf", file_url: "https://example.com/mock-material-2.pdf" },
  { id: 3, name: "Mock Material 3", filename: "mock-material-3.docx", file_url: null },
];

const Materials = () => {
  const [materials, setMaterials] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alertMessage, setAlertMessage] = useState(null);

  const fetchMaterials = async () => {
    try {
      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          "Authorization": `Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJleHAiOjE3MzcwMjYwMjV9.S2JTLy91iQaZ3Ky6TD8glscRD2BdomubLsYQvdXRNJM`,
          "ngrok-skip-browser-warning": "6024",
          "Connection":"keep-alive", 
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setMaterials(data);
    } catch (error) {
      console.error("Error fetching materials. Using mock data instead:", error);
      setMaterials(MOCK_MATERIALS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
      return file_url.replace("http://localhost:3000", "https://quality-owl-simply.ngrok-free.app");
    }
    return file_url;
  };

  const handleAddMaterial = () => {
    const name = prompt("Enter the name to display for the new material:");
    if (!name) return;

    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "*/*";

    fileInput.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) {
        setAlertMessage("You must select a file!");
        return;
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("name", name);
      formData.append("filename", file.name);

      try {
        const response = await fetch(`${API_URL}/`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJleHAiOjE3MzcwMjYwMjV9.S2JTLy91iQaZ3Ky6TD8glscRD2BdomubLsYQvdXRNJM`,
          },
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Failed to upload material");
        }

        const newMaterial = await response.json();
        setMaterials((prevMaterials) => [...prevMaterials, newMaterial]);

        console.log("Material uploaded successfully:", newMaterial);
      } catch (error) {
        console.error("Error uploading material:", error);
        setAlertMessage("Failed to upload material. Please try again.");
      }
    };

    fileInput.click();
  };

  const handleRenameMaterial = async (id) => {
    const newName = prompt("Enter the new name for the material:");
    if (!newName) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJleHAiOjE3MzcwMjYwMjV9.S2JTLy91iQaZ3Ky6TD8glscRD2BdomubLsYQvdXRNJM`,
        },
        body: JSON.stringify({ name: newName }),
      });

      if (!response.ok) {
        throw new Error("Failed to rename material");
      }

      setMaterials((prevMaterials) =>
        prevMaterials.map((material) =>
          material.id === id ? { ...material, name: newName } : material
        )
      );

      console.log(`Material ID ${id} renamed to "${newName}"`);
    } catch (error) {
      console.error("Error renaming material:", error);
      setAlertMessage("Failed to rename material.");
    }
  };

  const handleDeleteMaterial = async (id) => {
    if (!window.confirm("Are you sure you want to delete this material?")) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJleHAiOjE3MzcwMjYwMjV9.S2JTLy91iQaZ3Ky6TD8glscRD2BdomubLsYQvdXRNJM`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete material");
      }

      setMaterials((prevMaterials) =>
        prevMaterials.filter((material) => material.id !== id)
      );

      console.log(`Material ID ${id} deleted successfully`);
    } catch (error) {
      console.error("Error deleting material:", error);
      setAlertMessage("Failed to delete material.");
    }
  };

  const handleDownload = async (url, filename) => {
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Authorization": `Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJleHAiOjE3MzcwMjYwMjV9.S2JTLy91iQaZ3Ky6TD8glscRD2BdomubLsYQvdXRNJM`,
          "ngrok-skip-browser-warning": "6024",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to download file. Status: ${response.status}`);
      }

      const blob = await response.blob();
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = filename || "download";
      link.click();
      URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Error downloading file:", error);
      setAlertMessage("Failed to download file. Please try again.");
    }
  };

  return (
    <div className="materials-container">
      {alertMessage && (
        <CustomAlert message={alertMessage} onClose={() => setAlertMessage(null)} />
      )}
      <div className="materials-section">
        <div className="materials-header">
          <h2>Materials</h2>
          <button onClick={handleAddMaterial} className="add-material-btn">
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
                    <button onClick={() => handleRenameMaterial(material.id)}>Rename</button>
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
      <div className="quiz-generator-section">
        <QuizGenerator selectedMaterials={selectedMaterials} />
      </div>
    </div>
  );
};

export default Materials;
