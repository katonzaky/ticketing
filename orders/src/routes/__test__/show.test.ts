import request from 'supertest';
import mongoose from 'mongoose';

import { app } from '../../app';
import { Order, OrderStatus } from '../../models/order';
import { Ticket } from '../../models/ticket';

const buildTicket = async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
  });
  await ticket.save();
  return ticket;
};

it('Returns an error if order id doesnt exist', async () => {
  const orderId = mongoose.Types.ObjectId();

  await request(app)
    .get(`/api/orders/${orderId}`)
    .set('Cookie', global.signin())
    .expect(404);
});

it('Returns an unauthorized error if current user is not authorized', async () => {
  const user1 = global.signin();
  const user2 = global.signin();

  const ticket = await buildTicket();

  const { body } = await request(app)
    .post('/api/orders')
    .set('Cookie', user1)
    .send({
      ticketId: ticket.id,
    })
    .expect(201);

  await request(app)
    .get(`/api/orders/${body.id}`)
    .set('Cookie', user2)
    .expect(401);
});

it('Returns order if order exist', async () => {
  const user1 = global.signin();

  const ticket = await buildTicket();

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user1)
    .send({
      ticketId: ticket.id,
    })
    .expect(201);

  const { body: fetchOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', user1)
    .expect(200);

  expect(fetchOrder.id).toEqual(order.id);
});
