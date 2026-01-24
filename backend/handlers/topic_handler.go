package handlers

import (
	"encoding/json"
	"net/http"
	"nushare-backend/database"
	"nushare-backend/models"

	"github.com/go-chi/chi/v5"
)

// Request payload for creating a topic
type CreateTopicRequest struct {
	Name        string `json:"name"`
	Description string `json:"description"`
}

// GetTopics lists all available discussion topics
func GetTopics(w http.ResponseWriter, r *http.Request) {
	var topics []models.Topic

	// Fetch all topics from DB
	if result := database.DB.Find(&topics); result.Error != nil {
		http.Error(w, "Failed to fetch topics", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(topics)
}

// CreateTopic adds a new forum category
func CreateTopic(w http.ResponseWriter, r *http.Request) {
	var req CreateTopicRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	if req.Name == "" {
		http.Error(w, "Topic name is required", http.StatusBadRequest)
		return
	}

	topic := models.Topic{
		Name:        req.Name,
		Description: req.Description,
	}

	if result := database.DB.Create(&topic); result.Error != nil {
		http.Error(w, "Failed to create topic (name might be duplicate)", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(topic)
}

// GetTopicPosts fetches a specific topic and its associated posts
func GetTopicPosts(w http.ResponseWriter, r *http.Request) {
	topicID := chi.URLParam(r, "id")

	var topic models.Topic

	result := database.DB.Preload("Posts.User").First(&topic, topicID)

	if result.Error != nil {
		http.Error(w, "Topic not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(topic)
}
