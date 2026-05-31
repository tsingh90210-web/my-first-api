const { PrismaClient } = require('@prisma/client')
const express = require('express')

const prisma = new PrismaClient()
const app = express()
app.use(express.json())

// Test route
app.get('/', (req, res) => {
  res.send('API is running! 🚀')
})

// Get all categories
app.get('/categories', async (req, res) => {
  const allCategories = await prisma.categoryInfo.findMany()
  res.json(allCategories)
})

// Create new category
app.post('/categories', async (req, res) => {
  const newCat = await prisma.categoryInfo.create({
    data: req.body
  })
  res.json(newCat)
})

// Start server
const PORT = 3000
app.listen(PORT, () => {
  console.log(`✅ Server ready at http://localhost:${PORT}`)
})