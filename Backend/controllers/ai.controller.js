const Groq = require("groq-sdk");
const Recipe = require("../models/recipe.model");
const axios = require("axios"); // Import axios

// Helper to search YouTube
async function searchYouTube(query) {
    try {
        const apiKey = process.env.YOUTUBE_API_KEY;
        if (!apiKey) return [];

        console.log(`Searching YouTube for: ${query}`);
        const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
            params: {
                part: 'snippet',
                q: query + " recipe tutorial",
                type: 'video',
                videoDuration: 'medium',
                maxResults: 5, // Fetch 3 videos
                order: 'relevance',
                key: apiKey
            }
        });

        if (response.data.items && response.data.items.length > 0) {
            return response.data.items.map(item => ({
                id: item.id.videoId,
                title: item.snippet.title,
                thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url,
                url: `https://www.youtube.com/watch?v=${item.id.videoId}`
            }));
        }
        return [];
    } catch (error) {
        console.error("YouTube Search Error:", error.message);
        return [];
    }
}


exports.generateRecipe = async (req, res) => {
    try {
        const { prompt, type } = req.body;

        if (!process.env.GROQ_API_KEY) {
            return res.status(500).json({ message: "Groq API Key is missing in server configuration." });
        }

        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

        let systemInstruction = `You are an expert AI Chef. Create a detailed, delicious recipe based on the user's request. 
    Output the recipe strictly in the following JSON format:
    {
      "title": "Recipe Title",
      "description": "Brief interesting description",
      "cuisine": "Cuisine Type",
      "difficulty": "Easy/Medium/Hard",
      "cookingTime": 30,
      "servings": 2,
      "menu": "One of [Breakfast, Lunch, Dinner, Dessert, Health, Quick Meal]",
      "ingredients": [
        { "name": "Ingredient Name", "quantity": "Quantity (e.g., 200g, 1 cup)" }
      ],
      "steps": [
        { "stepNumber": 1, "instruction": "Step instruction" }
      ],
      "tips": ["Tip 1", "Tip 2"],
      "nutrition": {
        "calories": "400 kcal",
        "protein": "20g",
        "carbs": "50g",
        "fat": "15g"
      }
    }
    IMPORTANT rules:
    1. "menu" field MUST be exactly one of: "Breakfast", "Lunch", "Dinner", "Dessert", "Health", "Quick Meal".
    2. Return ONLY the JSON object. Do not wrap it in markdown code blocks (like \`\`\`json). Do not add any conversational text before or after.`;

        let userPrompt = "";
        if (type === "ingredients") {
            userPrompt = `Create a recipe using these ingredients: ${prompt}. You can add common pantry items (oil, salt, spices).`;
        } else if (type === "cuisine") {
            userPrompt = `Create an authentic ${prompt} recipe.`;
        } else if (type === "dietary") {
            userPrompt = `Create a delicious recipe that fits this dietary requirement: ${prompt}.`;
        } else if (type === "quick") {
            userPrompt = `Create a quick and easy recipe that can be made in under 30 minutes: ${prompt}.`;
        } else {
            userPrompt = `Create a recipe based on this request: ${prompt}`;
        }

        console.log("Generating recipe (Groq) for:", userPrompt);

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: systemInstruction },
                { role: "user", content: userPrompt }
            ],
            // Using "llama-3.3-70b-versatile" as the current powerful alternative.
            model: "llama-3.3-70b-versatile",
            temperature: 0.7,
            max_tokens: 3000,
            top_p: 1,
            stream: false,
            stop: null
        });

        const text = chatCompletion.choices[0]?.message?.content || "";
        console.log("AI Response:", text);

        // Clean up markdown if present
        const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();

        try {
            const recipeData = JSON.parse(cleanedText);

            // --- FETCH YOUTUBE VIDEOS ---
            try {
                const videos = await searchYouTube(recipeData.title + " recipe");
                if (videos.length > 0) {
                    recipeData.recipeVideo = videos[0].url;
                    recipeData.videoType = "url";
                    recipeData.relatedVideos = videos;
                }
            } catch (ytError) {
                console.error("Failed to fetch YouTube videos:", ytError);
                // Continue without video (frontend/backend will use placeholder)
            }

            res.json(recipeData);
        } catch (parseError) {
            console.error("JSON Parse Error:", parseError);
            console.error("Raw Text:", cleanedText);
            // Attempt to recover if there is extra text
            const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                try {
                    const recoveredData = JSON.parse(jsonMatch[0]);

                    // Try fetch video for recovered data too
                    const videos = await searchYouTube(recoveredData.title + " recipe");
                    if (videos.length > 0) {
                        recoveredData.recipeVideo = videos[0].url;
                        recoveredData.videoType = "url";
                        recoveredData.relatedVideos = videos;
                    }

                    return res.json(recoveredData);
                } catch (e) {
                    // fail
                }
            }
            res.status(500).json({ message: "Failed to parse AI response. Please try again." });
        }

    } catch (error) {
        console.error("Groq Generation Error:", error);
        res.status(500).json({ message: "Failed to generate recipe. Please try again later.", error: error.message });
    }
};

exports.saveGeneratedRecipe = async (req, res) => {
    try {
        const recipeData = req.body;
        const userId = req.user._id;

        if (!recipeData || !recipeData.title) {
            return res.status(400).json({ message: "Invalid recipe data" });
        }

        // Add default placeholders for required fields not generated by AI
        const newRecipe = await Recipe.create({
            ...recipeData,
            thumbnail: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=2000&auto=format&fit=crop", // Default Food Image
            recipeVideo: recipeData.recipeVideo || "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Use fetched video or placeholder,
            videoType: "url",
            createdBy: userId,
            // Ensure menu is valid or default
            menu: ["Breakfast", "Lunch", "Dinner", "Dessert", "Health", "Quick Meal"].includes(recipeData.menu) ? recipeData.menu : "Quick Meal",
            isPublic: recipeData.isPublic || false // Default Private, but allow override
        });

        // Also add to user's saved recipes (Bookmark it)
        const user = await require("../models/user.model").findById(userId);
        if (user) {
            user.savedRecipes.push(newRecipe._id);
            await user.save();
        }

        res.status(201).json({ message: "Recipe saved successfully!", recipe: newRecipe });

    } catch (error) {
        console.error("Error saving AI recipe:", error);
        res.status(500).json({ message: "Failed to save recipe", error: error.message });
    }
};
