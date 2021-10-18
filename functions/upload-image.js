const cloudinary = require("cloudinary").v2;

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET
});

module.exports.handler = async (event, context) => {
	try {  
		let body = JSON.parse(event.body);
		if ( body.code == process.env.CODE_UPLOAD ) {
			const upload = await cloudinary.uploader.upload(body.image);
			return {
				statusCode: 200,
				body: JSON.stringify(upload)
			}
		} else {
			return {
				statusCode: 500
			}
		}
	} catch(e) {
		console.log(e);
	}
}
