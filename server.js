const express = require('express');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
app.use(express.json());

// --------------------------
// SWAGGER API DOCS CONFIG
// --------------------------
const swaggerOptions = {
definition: {
openapi: '3.0.0',
info: {
title: 'Internship Project API',
version: '1.0.0',
description: 'Complete API documentation for the internship project',
contact: {
name: 'Intern',
email: 'your-email@example.com'
}
},
servers: [
{
url: 'http://localhost:3000',
description: 'Local development server'
}
// ⚠️ After deployment, add your cloud URL here like:
// { "url": "https://your-app.onrender.com", "description": "Live production server" }
],
},
apis: [__filename], // Reads docs from comments in this file
};

const swaggerSpec = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// --------------------------
// EXAMPLE ROUTE (replace/add yours)
// --------------------------
/**
* @swagger
* /api/hello:
* get:
* summary: Get welcome message
* tags: [General]
* responses:
* 200:
* description: Successful response
* content:
* application/json:
* schema:
* type: object
* properties:
* message:
* type: string
* example: Hello! API is working correctly
*/
app.get('/api/hello', (req, res) => {
res.json({ message: 'Hello! API is working correctly' });
});

// 👇 ADD ALL YOUR EXISTING ROUTES HERE 👇


// --------------------------
// PORT SETUP (works everywhere)
// --------------------------
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
console.log(`✅ Server running on port ${PORT}`);
console.log(`📚 Swagger docs available at: /api-docs`);
});