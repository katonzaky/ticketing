import { Publisher, OrderCreatedEvent, Subjects } from '@kzticketing/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
