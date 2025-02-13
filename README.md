# FoodHealthApp

An app that uses vision API from Gemini to count calories in food image

API: gemini-2.0-flash
DEVICE: Requires a working camera on a smartphone or computer (i.e. laptop, desktop)

From the frontend app, it takes a photo of a food image using the device camera. Once captured it is then sent to a backend service that connects to the Gemini API. The image is analyzed and returns the calorie count along with nutritional information about the food image captured.

Requirements:

- NodeJS v22.12.0
- Gemini API Key (visit the Google AI for Developers website)
