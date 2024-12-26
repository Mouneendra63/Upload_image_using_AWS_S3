Frontend (React):
	•	A user selects an image file using an input field.
	•	The file is uploaded to the backend via an Axios POST request using FormData to include the file.
	•	After successful upload, the backend returns a URL pointing to the file stored in AWS S3, which the frontend uses to display or store the image link.
	2.	Backend (Node.js, Express, Multer, AWS S3, MongoDB):
	•	Multer handles the file upload, temporarily storing it in memory.
	•	The file is then uploaded to AWS S3, where it is stored in a public bucket.
	•	The file URL from S3 is saved in MongoDB to allow for easy retrieval later.
	•	The backend responds to the frontend with the URL of the uploaded file.


React: Handles user interaction and sends the file to the backend.
	•	Multer: Middleware to handle the file upload and temporarily store it.
	•	AWS S3: Stores the file in a cloud bucket and provides a public URL.
	•	MongoDB: Stores the file’s URL for later access.


Receive File: The backend receives the file using Multer.
	2.	Upload to S3: The file is uploaded to AWS S3 using the AWS SDK.
	3.	Save URL: After successful upload, the S3 URL is saved in MongoDB.
	4.	Return URL: The URL is sent back to the frontend for display or further processing.
