package handlers

import (
	"encoding/json"
	"net/http"

	"nushare-backend/database"
	"nushare-backend/models"
	"nushare-backend/utils"

	"gorm.io/gorm"
)

// RegisterRequest defines the payload required for user registration.
type RegisterRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

// LoginRequest defines the payload required for user authentication.
type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

// AuthResponse acts as the standard Data Transfer Object (DTO) for successful authentication.
type AuthResponse struct {
	Token    string `json:"token"`
	Username string `json:"username"`
}

// Register handles the creation of a new user account.
// It accepts a JSON body, hashes the password, and persists the user to the database.
func Register(w http.ResponseWriter, r *http.Request) {
	var req RegisterRequest

	// Decode the JSON request body
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	// Basic input validation
	if req.Username == "" || req.Password == "" {
		http.Error(w, "Username and password are required", http.StatusBadRequest)
		return
	}

	// Hash the password using bcrypt before storage (Security best practice)
	hashedPwd, err := utils.HashPassword(req.Password)
	if err != nil {
		http.Error(w, "Failed to process password", http.StatusInternalServerError)
		return
	}

	// Create user model instance
	user := models.User{
		Username:     req.Username,
		PasswordHash: hashedPwd,
	}

	// Persist to database.
	// This will fail if the username is not unique (due to model constraints).
	if result := database.DB.Create(&user); result.Error != nil {
		http.Error(w, "Username already exists", http.StatusConflict)
		return
	}

	// Respond with success (201 Created)
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"message": "User registered successfully"})
}

// Login authenticates a user and returns a JWT token.
func Login(w http.ResponseWriter, r *http.Request) {
	var req LoginRequest

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	// Look up user in database
	var user models.User
	if err := database.DB.Where("username = ?", req.Username).First(&user).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			http.Error(w, "Invalid username or password", http.StatusUnauthorized)
			return
		}
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	// Verify the password against the stored hash
	if !utils.CheckPasswordHash(req.Password, user.PasswordHash) {
		http.Error(w, "Invalid username or password", http.StatusUnauthorized)
		return
	}

	// Generate Session Token (JWT)
	token, err := utils.GenerateToken(user.ID, user.IsAdmin)
	if err != nil {
		http.Error(w, "Failed to generate session token", http.StatusInternalServerError)
		return
	}

	// Return token to client
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(AuthResponse{
		Token:    token,
		Username: user.Username,
	})
}
