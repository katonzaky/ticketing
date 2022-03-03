import { Subjects, Publisher, PaymentCreatedEvent } from '@kzticketing/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
	readonly subject = Subjects.PaymentCreated;
}
