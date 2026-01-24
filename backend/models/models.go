package models

import "gorm.io/gorm"

type User struct {
	gorm.Model
	Username     string    `gorm:"unique;not null" json:"username"`
	PasswordHash string    `gorm:"not null" json:"-"`
	IsAdmin      bool      `gorm:"default:false" json:"is_admin"`
	Posts        []Post    `json:"posts,omitempty"`
	Comments     []Comment `json:"comments,omitempty"`
}

type Topic struct {
	gorm.Model
	Name        string `gorm:"unique;not null" json:"name"`
	Description string `json:"description"`
	Posts       []Post `json:"posts,omitempty"`
}

type Post struct {
	gorm.Model
	Title    string    `gorm:"not null" json:"title"`
	Content  string    `gorm:"not null" json:"content"`
	UserID   uint      `json:"user_id"`
	TopicID  uint      `json:"topic_id"`
	User     User      `json:"user,omitempty"`
	Topic    Topic     `json:"topic,omitempty"`
	Comments []Comment `json:"comments,omitempty"`
}

type Comment struct {
	gorm.Model
	Content string `gorm:"not null" json:"content"`
	UserID  uint   `json:"user_id"`
	PostID  uint   `json:"post_id"`
	User    User   `json:"user,omitempty"`
}
