import {
  Subjects,
  Publisher,
  ExpirationCompleteEvent,
} from '@kzticketing/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}
