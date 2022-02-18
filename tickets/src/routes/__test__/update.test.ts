import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

it('returns a 404 if the provider id doesnt exist', async () => {
	const id = new mongoose.Types.ObjectId().toHexString();
	await request(app)
		.put(`/api/tickets/${id}`)
		.set('Cookie', global.signin())
		.send({
			title: 'asdads',
			price: 20,
		})
		.expect(404);
});

it('returns a 401 if the user is not authenticated', async () => {
	const id = new mongoose.Types.ObjectId().toHexString();
	await request(app)
		.put(`/api/tickets/${id}`)
		.send({
			title: 'asdads',
			price: 20,
		})
		.expect(401);
});

it('returns a 401 if the user does not own the ticket', async () => {
	const response = await request(app)
		.post('/api/tickets')
		.set('Cookie', global.signin())
		.send({ title: 'asdas', price: 20 });

	await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.set('Cookie', global.signin())
		.send({
			title: 'asdadasds',
			price: 40,
		})
		.expect(401);
});

it('returns a 400 if the user provides an invalid title or price', async () => {
	const cookie = global.signin();

	const response = await request(app)
		.post('/api/tickets')
		.set('Cookie', cookie)
		.send({ title: 'asdas', price: 20 });

	await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.set('Cookie', cookie)
		.send({
			title: '',
			price: 40,
		})
		.expect(400);

	await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.set('Cookie', cookie)
		.send({
			price: 40,
		})
		.expect(400);

	await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.set('Cookie', cookie)
		.send({
			ticket: '',
			price: -20,
		})
		.expect(400);
});

it('updates the ticket provided with valid inputs', async () => {
	const cookie = global.signin();

	const response = await request(app)
		.post('/api/tickets')
		.set('Cookie', cookie)
		.send({ title: 'asdas', price: 20 });

	await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.set('Cookie', cookie)
		.send({
			title: 'new title',
			price: 40,
		})
		.expect(200);

	const ticketResponse = await request(app)
		.get(`/api/tickets/${response.body.id}`)
		.send();

	console.log(ticketResponse.body);

	expect(ticketResponse.body.title).toEqual('new title');
	expect(ticketResponse.body.price).toEqual(40);
});
