export type TraceInput = { x: number; y: number; speed: number; time: number; target?: Element | null };
const subscribers = new Set<(sample: TraceInput) => void>();
export const publishTrace = (sample: TraceInput) => { for (const subscriber of subscribers) subscriber(sample); };
export function subscribeTrace(subscriber: (sample: TraceInput) => void) {
  subscribers.add(subscriber);
  return () => { subscribers.delete(subscriber); };
}
