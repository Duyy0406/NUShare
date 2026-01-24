package handlers

import (
	"encoding/json"
	"net/http"
	"nushare-backend/database"
	"nushare-backend/middleware"
	"nushare-backend/models"
)

type CreatePostRequest struct {
	Title   string `json:"title"`
	Content string `json:"content"`
	TopicID uint   `json:"topic_id"`
}

func CreatePost(w http.ResponseWriter, r *http.Request) {
	// Get User ID from Context
	userID, ok := r.Context().Value(middleware.UserIDKey).(uint)
	if !ok {
		http.Error(w, "User identification failed", http.StatusInternalServerError)
		return
	}

	// Parse Request
	var req CreatePostRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	if req.Title == "" || req.Content == "" || req.TopicID == 0 {
		http.Error(w, "Title, Content and TopicID are required", http.StatusBadRequest)
		return
	}

	// Save to DB
	post := models.Post{
		Title:   req.Title,
		Content: req.Content,
		TopicID: req.TopicID,
		UserID:  userID,
	}

	if result := database.DB.Create(&post); result.Error != nil {
		http.Error(w, "Failed to create post", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(post)
}
