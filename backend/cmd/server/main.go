package main

import (
	"log"
	"net/http"
	"os"

	"nushare-backend/database"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/joho/godotenv"
)

func main() {
	// Load .env variables (looks in the current folder where you run the command)
	if err := godotenv.Load(); err != nil {
		log.Println("Warning: No .env file found or error loading it")
	}

	// Connect to Database
	database.Connect()

	// Setup Router
	r := chi.NewRouter()

	// Middleware: Basic request logging and crash recovery
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)

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
