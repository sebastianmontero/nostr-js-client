import {
  Event,
  SimplePool,
  Filter,
  type Sub,
  type SubscriptionOptions,
} from 'nostr-tools'

import {
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
    console.log("relays: ", this.relays)
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
   * const metadataEvents = await getMetadataEvents(['publicKey1', 'publicKey2']);
   */
  async getMetadataEvents(publicKeys: string[]): Promise<Map<String, Event<number>>> {
    console.log(publicKeys)
    const metadataFilter = filterBuilder()
      .kinds(0)
      // .authors(publicKeys)
      .toFilters()
    console.log("filter: ", metadataFilter)
    const metadataEvents = await this.list([])
    console.log("metadataEvents: ", metadataEvents)
    const profiles = new Map<String, Event<number>>()
    for(const metadataEvent of metadataEvents){
      profiles.set(metadataEvent.pubkey, metadataEvent)
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
   * const metadataEvent = await getMetadataEvent('publicKey1');
   */
  async getMetadataEvent(publicKey: string): Promise<Event<number>|undefined> {
    let metadataEvents = await this.getMetadataEvents([publicKey])
    console.log("metadataEvents2: ", metadataEvents)
    return metadataEvents.get(publicKey)
  }

}