package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"nushare-backend/database"
	"nushare-backend/middleware"
	"nushare-backend/models"

	"github.com/go-chi/chi/v5"
)

type CreateCommentRequest struct {
	Content string `json:"content"`
	PostID  uint   `json:"post_id"`
}

// CreateComment adds a reply to a post
func CreateComment(w http.ResponseWriter, r *http.Request) {
	userID, ok := r.Context().Value(middleware.UserIDKey).(uint)
	if !ok {
		http.Error(w, "User identification failed", http.StatusInternalServerError)
		return
	}

	var req CreateCommentRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	if req.Content == "" || req.PostID == 0 {
		http.Error(w, "Content and PostID are required", http.StatusBadRequest)
		return
	}

	comment := models.Comment{
		Content: req.Content,
		PostID:  req.PostID,
		UserID:  userID,
	}

	if result := database.DB.Create(&comment); result.Error != nil {
		http.Error(w, "Failed to create comment", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(comment)
}

// Fetches all comments for a specific post
func GetPostComments(w http.ResponseWriter, r *http.Request) {
	postIDStr := chi.URLParam(r, "id")
	postID, _ := strconv.Atoi(postIDStr)

	var comments []models.Comment

	result := database.DB.Where("post_id = ?", postID).Preload("User").Find(&comments)

	if result.Error != nil {
		http.Error(w, "Failed to fetch comments", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(comments)
}
