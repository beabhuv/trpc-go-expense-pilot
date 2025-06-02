package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type Expense struct {
	ID     int     `json:"id"`
	Amount float64 `json:"amount"`
	Note   string  `json:"note"`
}

var expenses []Expense
var idCounter = 1

func main() {
	r := gin.Default()
	r.GET("/api/expenses", func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.JSON(http.StatusOK, expenses)
	})
	r.POST("/api/expenses", func(c *gin.Context) {
		var expense Expense
		if err := c.ShouldBindJSON(&expense); err != nil {
			c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		expense.ID = idCounter
		idCounter++
		expenses = append(expenses, expense)
		c.JSON(http.StatusCreated, expense)
	})
	r.Run(":8080")
}
