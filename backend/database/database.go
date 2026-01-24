package database

import (
	"log"
	"os"

	"nushare-backend/models"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func Connect() {
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		log.Fatal("DATABASE_URL not set in .env")
	}

	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	log.Println("Database connection established")

	// Apply schema changes
	err = DB.AutoMigrate(
		&models.User{},
		&models.Topic{},
		&models.Post{},
		&models.Comment{},
	)
	if err != nil {
		log.Fatal("Migration failed:", err)
	}
}
