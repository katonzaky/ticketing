import { Publisher, OrderCancelledEvent, Subjects } from '@kzticketing/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
