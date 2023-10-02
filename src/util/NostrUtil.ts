import { Event, getEventHash } from 'nostr-tools'
import { TagType } from '../enum'


export async function buildEvent<K extends number>(e: {
  pubkey: string,
  kind: K,
  tags: string[][],
  content: string,
  createdAt?: Date
}, signEvent: (event: any) => Promise<string>): Promise<Event<K>> {

  let event = e as Event<K>
  event.created_at = nostrDate(e.createdAt)
  event.id = getEventHash(event)
  event.sig = await signEvent(event)
  return event
}


export function toPublished(obj: any, e: Event<any>): any {
  return {
    ...obj,
    id: e.id,
    createdAt: fromNostrDate(e.created_at)
  }
}

export function nostrDate(date?: Date | number): number {
  date = date || new Date()
  return date instanceof Date ? Math.floor(date.getTime() / 1000) : date
}

export function fromNostrDate(date: number): Date {
  return new Date(date * 1000)
}

export function getTagValues<K extends number>(
  e: Event<K>,
  tagType: TagType,
  transformerFn: (params: string[]) => any = (params) => params[0]
): any[] {
  const values: string[] = []
  for (const [tt, ...params] of e.tags) {
    if (tt === tagType) {
      values.push(transformerFn(params))
    }
  }
  return values
}

export function getTagValue(
  e: Event,
  tagType: TagType,
  transformerFn?: (params: string[]) => any
): any {
  const values = getTagValues(e, tagType, transformerFn)
  if (!values.length) {
    throw new Error(`No tag of type: ${tagType} found for event: ${JSON.stringify(e)}`)
  }
  if (values.length > 1) {
    throw new Error(`Found more than one tag of type: ${tagType} for event: ${JSON.stringify(e)}`)
  }
  return values[0]
}