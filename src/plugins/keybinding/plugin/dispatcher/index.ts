import { EventProducer, EventProducerOptions } from './index.d';
import { EventBody } from '../event/index.d';
import { EventName } from '../enums';
import { noop } from '../util';

export default function createEventProducer<T>({
  // Adapters
  emit,
  // Hooks
  beforeAttach = noop,
  afterAttach = noop,
  beforeDetach = noop,
  afterDetach = noop
}: EventProducerOptions<T>): EventProducer<T> {
  return {
    attached: new Set<T>(),
    attach(this: EventProducer<T>, consumer: T) {
      beforeAttach.call(this, consumer);
      this.attached.add(consumer);
      afterAttach.call(this, consumer);
    },
    detach(this: EventProducer<T>, consumer: T) {
      beforeDetach.call(this, consumer);
      this.attached.delete(consumer);
      afterDetach.call(this, consumer);
    },
    broadcast(evtName: EventName, evtBody: EventBody): void {
      this.attached.forEach(consumer => {
        emit(consumer, evtName, {
          type: evtBody.type || evtName,
          ...evtBody
        });
      });
    }
  };
}
