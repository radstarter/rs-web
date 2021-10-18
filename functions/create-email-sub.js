const faunadb = require('faunadb');
const q = faunadb.query;

exports.handler = async (event, context) => {
	const client = new faunadb.Client({
		secret: process.env.FAUNADBMAIL
	});

	const data = JSON.parse(event.body);
	console.log("Data created", data);

	return client.query(q.Create(q.Collection("Subscribtion"), data))
		.then((response) => {
			return {
				statusCode: 200,
				body: JSON.stringify(response)
			}
		}).catch((error) => {
			return {
				statusCode: 400,
				body: JSON.stringify(error)
			}
		})

}
