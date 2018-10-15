import { EventName } from '../enums';
import { EventBody } from '../event/index.d';

export declare interface EventProducer<T> {
  /**
   * Consumer attached
   */
  attached: Set<T>;
  attach(consumer: T): void;
  detach(consumer: T): void;
  broadcast(evtName: EventName, evtBody: EventBody): void;
}

export declare interface EventProducerOptions<T> {
  emit(consumer: T, evtName: EventName, ...evtArgs: any[]): void;
  beforeAttach?(this: EventProducer<T>, consumer: T): void;
  afterAttach?(this: EventProducer<T>, consumer: T): void;
  beforeDetach?(this: EventProducer<T>, consumer: T): void;
  afterDetach?(this: EventProducer<T>, consumer: T): void;
}
