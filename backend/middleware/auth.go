package middleware

import (
	"context"
	"net/http"
	"strings"

	"nushare-backend/utils"
)

// Define context keys as a distinct type to prevent collision with other packages
type key int

const (
	UserIDKey key = iota
	IsAdminKey
)

// Auth verifies the JWT token from the Authorization header
func Auth(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			http.Error(w, "Authorization header required", http.StatusUnauthorized)
			return
		}

		// Header format must be "Bearer <token>"
		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			http.Error(w, "Invalid authorization format", http.StatusUnauthorized)
			return
		}

		tokenString := parts[1]
		claims, err := utils.ValidateToken(tokenString)
		if err != nil {
			http.Error(w, "Invalid or expired token", http.StatusUnauthorized)
			return
		}

		// JWT numbers are unmarshaled as float64 by default
		userIDFloat, ok := claims["user_id"].(float64)
		if !ok {
			http.Error(w, "Invalid token claims", http.StatusUnauthorized)
			return
		}

		isAdmin, _ := claims["is_admin"].(bool)

		// Inject valid claims into the request context for downstream handlers
		ctx := context.WithValue(r.Context(), UserIDKey, uint(userIDFloat))
		ctx = context.WithValue(ctx, IsAdminKey, isAdmin)

		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

// AdminOnly enforces admin privileges on top of authentication
func AdminOnly(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		isAdmin, ok := r.Context().Value(IsAdminKey).(bool)
		if !ok || !isAdmin {
			http.Error(w, "Admin privileges required", http.StatusForbidden)
			return
		}
		next.ServeHTTP(w, r)
	})
}
