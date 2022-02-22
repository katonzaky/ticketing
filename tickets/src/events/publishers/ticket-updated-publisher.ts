import { Publisher, Subjects, TicketUpdatedEvent } from '@kzticketing/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
	readonly subject = Subjects.TicketUpdated;
}
