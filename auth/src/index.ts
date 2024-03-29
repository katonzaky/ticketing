import mongoose from 'mongoose';
import { app } from './app';

const start = async () => {
	console.log('Starting upzz....');
	if (!process.env.JWT_KEY) {
		throw new Error('JWT_KEY is undefined');
	}
	if (!process.env.MONGO_URI) {
		throw new Error('MOGNO_URI is undefined');
	}
	try {
		await mongoose.connect(process.env.MONGO_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
		});
		console.log('Connected to MongoDb');
	} catch (err) {
		console.error(err);
	}

	console.log('started!');

	app.listen(3000, () => {
		console.log('Listening on port 3000!!!!!!!!!');
	});
};

start();
