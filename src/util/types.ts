import {
  Event
} from 'nostr-tools'

export type PaginationOpts = {
  since?: Date | number;
  until?: Date | number;
  limit?: number;
};

export type JSONEvent<K extends number = number> = Pick<Event<K>, 'id' | 'pubkey' | 'kind' | 'tags' | 'created_at' | 'sig' > & {
  content: any
};