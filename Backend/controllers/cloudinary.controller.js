const cloudinary = require("../config/cloudinary");

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
