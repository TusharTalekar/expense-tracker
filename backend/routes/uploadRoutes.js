const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary");
const streamifier = require("streamifier");

require("dotenv").config();
const router = express.Router();

// cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


// multer setup using memory storage
const storage = multer.memoryStorage();  //telling multer to store uploaded images to ram rather than file system
const upload = multer({ storage }); // can be used as middleware to handle file uploads


router.post("/", upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file Uploaded." });
        }


        // function to handle stream upload to cloudinary
        const streamUpload = (fileBuffer) => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream((error, result) => {
                    // if (error) {
                    //     reject(error);
                    // } else {
                    //     resolve(result);
                    // }
                    // // check first error and then result not if(result){}

                    if (result && result.secure_url) {
                        // If the 'result' object is defined and has a secure_url, it's a success
                        resolve(result);
                    } else if (error && error.secure_url) {
                        // Handle the case where the successful result is in the 'error' parameter
                        resolve(error);
                    } else {
                        // Otherwise, it's a genuine error
                        reject(error || new Error("Unknown upload error"));
                    }
                });
                // use streamifier to convert file buffer into a stream
                streamifier.createReadStream(fileBuffer).pipe(stream);
            });
        };
        if (!req.file.buffer || req.file.buffer.length === 0) {
            console.error("req.file.buffer is empty or invalid.");
            return res.status(400).json({ message: "Uploaded file buffer is empty or invalid." });
        }

        // call streamUpload function to upload file
        const result = await streamUpload(req.file.buffer);

        // respond with image url 
        res.status(200).json({ imageUrl: result.secure_url });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error." });
    }
});

module.exports = router;
