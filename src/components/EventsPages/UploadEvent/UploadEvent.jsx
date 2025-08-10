import React, { useState } from "react";
import "./UploadEvent.css";

const UploadEvent = ({ category, onEventAdded }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileName, setFileName] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    organization: "",
    description: "",
    venue: "",
    registrationLink: "",
    date: "",
    poster: null
  });

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({
      name: "",
      organization: "",
      description: "",
      venue: "",
      registrationLink: "",
      date: "",
      poster: null
    });
    setFileName("");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      setFormData({ ...formData, poster: file });
      setFileName(file.name);
    } else {
      setFileName("");
      setFormData({ ...formData, poster: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Get token from localStorage
    const token = localStorage.getItem("userToken") || localStorage.getItem("token");
    console.log("Token from localStorage:", token ? "Token exists" : "No token found");
    
    if (!token) {
      alert("Please log in to post an event.");
      return;
    }

    // Validate required fields
    if (!formData.name.trim()) {
      alert("Event name is required");
      return;
    }

    if (!category) {
      alert("Category is required");
      return;
    }

    console.log("Form data:", formData);
    console.log("Category:", category);

    try {
      // Create FormData for file upload
      const payload = new FormData();
      payload.append("name", formData.name.trim());
      payload.append("organization", formData.organization.trim());
      payload.append("description", formData.description.trim());
      payload.append("venue", formData.venue.trim());
      payload.append("registrationLink", formData.registrationLink.trim());
      payload.append("date", formData.date.trim());
      payload.append("category", category);
      
      if (formData.poster) {
        payload.append("poster", formData.poster);
      }

      console.log("Payload prepared, sending request...");
      
      const res = await fetch("http://localhost:3001/api/events", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
          // Note: Don't set Content-Type header when using FormData
          // The browser will set it automatically with the boundary
        },
        body: payload
      });

      console.log("Response status:", res.status);
      console.log("Response ok:", res.ok);

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: "Unknown error" }));
        console.error("Server response:", errorData);
        throw new Error(errorData.message || `Failed to submit event: ${res.status} ${res.statusText}`);
      }

      const responseData = await res.json();
      console.log("Event created successfully:", responseData);

      // Extract the event from the response (backend returns { success, message, event })
      const newEvent = responseData.event || responseData;

      // Update event list in parent component instantly
      if (onEventAdded) {
        onEventAdded(newEvent);
      }

      // Show success message
      alert("Event posted successfully!");
      
      // Close modal and reset form
      closeModal();
      
    } catch (error) {
      console.error("Error submitting event:", error);
      alert(`Failed to post event: ${error.message}`);
    }
  };

  return (
    <>
      <div className="post-event-btn-wrapper">
        <button className="post-event-btn" onClick={openModal}>
          Post Event
        </button>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Post Your Event</h2>

            <form className="event-form" onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Event Name"
                value={formData.name}
                onChange={handleChange}
              />
              <input
                type="text"
                name="organization"
                placeholder="Organization / Society Name"
                value={formData.organization}
                onChange={handleChange}
              />
              <textarea
                name="description"
                placeholder="Describe your event"
                value={formData.description}
                onChange={handleChange}
              />
              <input
                type="text"
                name="venue"
                placeholder="Event Venue"
                value={formData.venue}
                onChange={handleChange}
              />
              <input
                type="url"
                name="registrationLink"
                placeholder="Registration Link"
                value={formData.registrationLink}
                onChange={handleChange}
              />
              <input
                type="text"
                name="date"
                placeholder="Date & Time of Event"
                value={formData.date}
                onChange={handleChange}
              />

              <div className="file-upload-wrapper">
                <input
                  type="file"
                  id="posterUpload"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <label htmlFor="posterUpload" className="file-upload-label">
                  Upload Poster of the Event
                </label>
                {fileName && <span className="file-name">{fileName}</span>}
              </div>

              <div className="form-buttons">
                <button type="submit" className="submit-btn">
                  Submit Form
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={closeModal}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default UploadEvent;




