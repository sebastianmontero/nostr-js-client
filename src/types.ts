import {
  Event
} from 'nostr-tools'


export type JSONEvent<K extends number = number> = Pick<Event<K>, 'id' | 'pubkey' | 'kind' | 'tags' | 'created_at' | 'sig' > & {
  content: any
};