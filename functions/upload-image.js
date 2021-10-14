const cloudinary = require("cloudinary").v2;

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET
});

module.exports.handler = async (event, context) => {
	try {
		const upload = await cloudinary.uploader.upload(event.body);
		return {
			statusCode: 200,
			body: JSON.stringify(upload)
		}
	} catch(e) {
		console.log(e);
	}
}
