import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

declare global {
	var signin: (id?: string) => string;
}

jest.mock('../nats-wrapper');

process.env.STRIPE_KEY =
	'sk_test_51KYzCBFtk5CYB3IaBSmlpd7xZortwSIGID21u05kntYlyt9iK2wzsHnt8I7KsuS6JPqnb3yNFsIMQQQmz7K3jzgC00Psi2i9j4';

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
	jest.clearAllMocks();
	const collections = await mongoose.connection.db.collections();

	for (let collection of collections) {
		await collection.deleteMany({});
	}
});

afterAll(async () => {
	await mongoose.connection.close();
	await mongo.stop();
});

global.signin = (id?: string) => {
	// Build a JWT payload. {id,email}
	const generateID = id || new mongoose.Types.ObjectId().toHexString();

	const payload = {
		id: generateID,
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
