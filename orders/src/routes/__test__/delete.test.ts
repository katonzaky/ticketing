import request from 'supertest';
import mongoose from 'mongoose';

import { app } from '../../app';
import { Order, OrderStatus } from '../../models/order';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';

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
    .delete(`/api/orders/${orderId}`)
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
    .patch(`/api/orders/${body.id}`)
    .set('Cookie', user2)
    .expect(401);
});

it('Cancels order status', async () => {
  const user1 = global.signin();

  const ticket = await buildTicket();

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user1)
    .send({
      ticketId: ticket.id,
    })
    .expect(201);

  await request(app)
    .patch(`/api/orders/${order.id}`)
    .set('Cookie', user1)
    .expect(204);

  const { body: fetchRequest } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', user1)
    .expect(200);

  expect(fetchRequest.status).toEqual(OrderStatus.Cancelled);
});

it('emits an order cancelled event', async () => {
  const user1 = global.signin();

  const ticket = await buildTicket();

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user1)
    .send({
      ticketId: ticket.id,
    })
    .expect(201);

  await request(app)
    .patch(`/api/orders/${order.id}`)
    .set('Cookie', user1)
    .expect(204);

  await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', user1)
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
