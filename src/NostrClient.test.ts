import { NostrClient } from './NostrClient'
// import { generatePrivateKey, getPublicKey, getSignature } from 'nostr-tools'
// import { buildEvent, filterBuilder } from './util'

jest.setTimeout(60000)

describe('NostrClient', () => {
  let nostrClient: NostrClient
  // let prvk1
  // let pubk1
  // let signEvent
  beforeAll(async () => {
    // prvk1 = generatePrivateKey()
    // pubk1 = getPublicKey(prvk1)
    // signEvent = async (e) => {
    //   return getSignature(e, prvk1)
    // }
    nostrClient = new NostrClient([
      //'wss://relay.rip',
      'wss://test.relay.report'
      // 'ws://localhost:7777'
    ])
  })

  afterAll(() => {
    nostrClient.disconnect()
  })

  // describe('list', () => {

  //   it('it should return a list of events', async () => {
  //     const e = await buildEvent({
  //       pubkey: pubk1,
  //       kind: 1,
  //       tags: [],
  //       content: "Test note 1",
  //     }, signEvent)
  //     await nostrClient.publish(e)
  //     const filter = filterBuilder().kinds(1).toFilters()
  //     const events = await nostrClient.list(filter)
  //     expect(events.length).toBeGreaterThan(0)
  //   })
  // })

  // describe('metadata related events', () => {

  //   const metadata = {name: "Test"}
  //   beforeAll(async () => {
  //     const e = await buildEvent({
  //       pubkey: pubk1,
  //       kind: 0,
  //       tags: [],
  //       content: JSON.stringify(metadata),
  //     }, signEvent)
  //     await nostrClient.publish(e)
  //   })

  //   it('findMetadataEvent it should return the users metadata event', async () => {
  //     const event = await nostrClient.findMetadataEvent(pubk1)
  //     console.log(event)
  //     expect(event?.content).toEqual(metadata)
  //   })

  //   it('findMetadataEvents it should return map with the users metadata event', async () => {
  //     const eventMap = await nostrClient.findMetadataEvents([pubk1])
  //     console.log(eventMap)
  //     expect(eventMap.get(pubk1)?.content).toEqual(metadata)
  //   })
  // })

  describe('metadata related events', () => {


    it('findMetadataEvent it should return the users metadata event', async () => {
      const pubk1 = '11828ba961df0bbad7534185981ba2143b67d357fc71a17faf611f3310ab6616'
      const event = await nostrClient.findMetadataEvent(pubk1)
      console.log(event)
    })
  })
})
