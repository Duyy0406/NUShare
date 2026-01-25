package main

import (
	"log"
	"net/http"
	"os"

	"nushare-backend/database"
	"nushare-backend/handlers"
	appMiddleware "nushare-backend/middleware"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"github.com/joho/godotenv"
)

func main() {
	// Load .env variables
	if err := godotenv.Load(); err != nil {
		log.Println("Warning: No .env file found or error loading it")
	}

	// Connect to Database
	database.Connect()

	// Setup Router
	r := chi.NewRouter()

	// CORS Middleware
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{
			"http://localhost:5173",
			"https://6975f0d4dc0a6c0008033b62--eloquent-empanada-439f15.netlify.app/"
	},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	// Middleware: Basic request logging and crash recovery
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)

	// API Routes
	r.Route("/api", func(r chi.Router) {
		// Public routes
		r.Post("/register", handlers.Register)
		r.Post("/login", handlers.Login)
		r.Get("/topics", handlers.GetTopics)
		r.Get("/topics/{id}", handlers.GetTopicPosts)
		r.Get("/posts/{id}", handlers.GetPost)
		r.Get("/posts/{id}/comments", handlers.GetPostComments)

		// Protected routes
		r.Group(func(r chi.Router) {
			r.Use(appMiddleware.Auth)

			r.Get("/profile", func(w http.ResponseWriter, r *http.Request) {
				w.Write([]byte("Access Granted"))
			})
			r.Post("/posts", handlers.CreatePost)
			r.Post("/comments", handlers.CreateComment)
			r.Delete("/posts/{id}", handlers.DeletePost)

			// Admin-only routes
			r.Group(func(r chi.Router) {
				r.Use(appMiddleware.AdminOnly)
				r.Post("/topics", handlers.CreateTopic)
			})
		})
	})

	// Test Route
	r.Get("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("NUShare Backend is running!"))
	})

	// Start Server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on port %s", port)
	if err := http.ListenAndServe(":"+port, r); err != nil {
		log.Fatal(err)
	}
}
