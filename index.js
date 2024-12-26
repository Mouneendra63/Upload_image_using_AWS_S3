const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const AWS = require('aws-sdk');

// Set up environment variables for security
require('dotenv').config();  // Make sure to install dotenv for loading environment variables

app.use(cors());
app.use(bodyParser.json());

const URI = "mongodb://localhost:27017/AWS";
mongoose.connect(URI).then(() => {
    console.log("Mongoose Connection Successful");
}).catch((err) => {
    console.log("Mongoose Connection Failed", err);
});

// Image Schema
const ImageSchema = new mongoose.Schema({
    name: String,
    url: String,
    page: String
});
const Imagemodel = mongoose.model('Image', ImageSchema);

// Configuring AWS S3 using environment variables (ensure the keys are set in your .env file)
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'us-east-1'
});

// Set up Multer for file handling
const storage = multer.memoryStorage();
const upload = multer({ storage });

app.get('/', (req, res) => {
    res.send("Hello World");
});

app.post('/uploads', upload.single("image"), async (req, res) => {
    const { name, page } = req.body;
    const file = req.file;

    if (!file) {
        return res.status(400).send("No file uploaded.");
    }

    // S3 upload parameters
    const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,  // Make sure to set this in your .env file
        Key: `${Date.now()}_${file.originalname}`,
        Body: file.buffer,
        ContentType: file.mimetype,
    };

    try {
        const s3Response = await s3.upload(params).promise();
        const imageUrl = s3Response.Location;

        // Save image details in MongoDB
        const imageDoc = new Imagemodel({
            name,
            url: imageUrl,
            page
        });

        await imageDoc.save();

        res.json({
            message: "Image uploaded successfully",
            imageUrl,
        });
    } catch (error) {
        console.log("Error uploading file to S3:", error);
        res.status(500).send("Error uploading image to S3.");
    }
});

app.listen(3000, () => {
    console.log(`Server is listening on port 3000`);
});