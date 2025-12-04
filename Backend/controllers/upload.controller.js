const cloudinary = require("../config/cloudinary.js");

module.exports.uploadMedia = async (req, res) => {
    try {
        const file = req.file.path;

        const result = await cloudinary.uploader.upload(file, {
            folder: "recipes",
            resource_type: "auto"  // auto detects image/video
        });

        res.json({
            message: "File uploaded successfully",
            url: result.secure_url
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Cloudinary upload failed" });
    }
};

module.exports.uploadMultipleImages = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "No files uploaded" });
        }

        const uploadPromises = req.files.map((file) => {
            return cloudinary.uploader.upload(file.path, {
                folder: "recipes",
                resource_type: "image"
            });
        });

        const results = await Promise.all(uploadPromises);

        const urls = results.map((item) => item.secure_url);

        res.status(200).json({
            message: "Images uploaded successfully",
            urls
        });

    } catch (error) {
        console.error("Cloudinary upload error:", error);
        res.status(500).json({ message: "Upload failed", error });
    }
};
