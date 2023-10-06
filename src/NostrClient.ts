import {
  Event,
  SimplePool,
  Filter,
  type Sub,
  type SubscriptionOptions,
} from 'nostr-tools'

import {
  JSONEvent,
  toJSONEvent
} from './util'

import {
  FilterBuilder,
  filterBuilder
} from './util'

export class NostrClient {
  private pool: SimplePool
  private relays: string[]

  constructor(relays: string[], options: { eoseSubTimeout?: number; getTimeout?: number } = {}) {
    this.pool = new SimplePool(options)
    this.relays = relays
  }

  addRelays(relays: string[]) {
    for (let r of relays) {
      this.addRelay(r)
    }
  }

  addRelay(relay: string) {
    if (!this.relays.includes(relay)) {
      this.relays.push(relay)
    }
  }

  removeRelays(relays: string[]) {
    for (let r of relays) {
      this.removeRelay(r)
    }
  }

  removeRelay(relay: string) {
    let pos = this.relays.indexOf(relay)
    if (pos !== -1) {
      this.relays.splice(pos, 1)
      this.pool.close([relay])
    }
  }

  get<K extends number = number>(
    filter: Filter<K>,
    opts?: SubscriptionOptions
  ): Promise<Event<K> | null> {
    return this.pool.get(this.relays, filter, opts)
  }

  list<K extends number = number>(
    filters: Filter<K>[],
    opts?: SubscriptionOptions
  ): Promise<Event<K>[]> {
    return this.pool.list(this.relays, filters, opts)
  }

  publish(event: Event<number>): Promise<void>[] {
    return this.pool.publish(this.relays, event)
  }


  sub<K extends number = number>(
    filters: Filter<K>[],
    onEventFn?: (element: Event) => void,
    opts?: SubscriptionOptions
  ): Sub<K> {
    const sub = this.pool.sub(this.relays, filters, opts)
    if (onEventFn) {
      sub.on('event', event => {
        onEventFn(event)
      })
    }
    return sub
  }

  disconnect(): void {
    this.pool.close(this.relays)
  }


  /**
   * Retrieves multiple metadataEvents by their public keys.
   * 
   * @async
   * @param {string[]} publicKeys
   * @returns {Promise<Map<String, Event<number>>>} 
   * @example
   * const metadataEvents = await findMetadataEvents(['publicKey1', 'publicKey2']);
   */
  async findMetadataEvents(publicKeys: string[]): Promise<Map<String, JSONEvent<number>>> {
    const filter = this.getMetadataFilter(publicKeys).toFilters()
    const events = await this.list(filter)
    const profiles = new Map<String, Event<number>>()
    for(const e of events){
      profiles.set(e.pubkey, toJSONEvent(e))
    }
    return profiles
  }

  /**
   * Retrieves a metadataEvent by public key.
   * 
   * @async
   * @param {string} publicKey 
   * @returns {Promise<Event<number>|undefined>}
   * @example
   * const metadataEvent = await findMetadataEvent('publicKey1');
   */
  async findMetadataEvent(publicKey: string): Promise<JSONEvent<number>|null> {
    const filter = this.getMetadataFilter(publicKey).toFilter()
    const event = await this.get(filter)
    return event ? toJSONEvent(event) : null
  }

  private getMetadataFilter(publicKeys: string | string[]): FilterBuilder<number> {
    return filterBuilder()
    .kinds(0)
    .authors(publicKeys)
  }

}