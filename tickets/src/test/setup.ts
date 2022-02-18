import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';
import jwt from 'jsonwebtoken';

declare global {
	var signin: () => string;
}

let mongo: any;
beforeAll(async () => {
	process.env.JWT_KEY = 'asdf';
	mongo = new MongoMemoryServer();
	await mongo.start();
	const mongoUri = mongo.getUri();

	await mongoose.connect(mongoUri, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});
});

beforeEach(async () => {
	const collections = await mongoose.connection.db.collections();

	for (let collection of collections) {
		await collection.deleteMany({});
	}
});

afterAll(async () => {
	await mongoose.connection.close();
	await mongo.stop();
});

global.signin = () => {
	// Build a JWT payload. {id,email}
	const id = new mongoose.Types.ObjectId().toHexString();

	const payload = {
		id: id,
		email: 'test@test.com',
	};

	// Create the JWT
	const token = jwt.sign(payload, process.env.JWT_KEY!);

	// Build session object {jwt: MY_JWT}
	const session = { jwt: token };

	// Turn sesion into JSON
	const sessionJSON = JSON.stringify(session);

	// Take JSON and encode it to base64
	const base64 = Buffer.from(sessionJSON).toString('base64');

	// Return a string that the cookie with the encoded data
	return `express:sess=${base64}`;
};