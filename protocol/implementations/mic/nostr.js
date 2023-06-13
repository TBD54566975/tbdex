const {RelayPool} = require('nostr')

const relays = ["wss://nostr-tbd.website", "wss://relay.damus.io", "wss://relay.snort.social"]

let messages = []

const pool = RelayPool(relays)

pool.on('open', relay => {
	relay.subscribe("subid", {limit: 10000, kinds:[0]})
});

pool.on('eose', relay => {
	relay.close()
    console.log("num of messages: " + messages.length)
    console.log(messages)
});

pool.on('event', (relay, sub_id, ev) => {
	//console.log(ev);
    messages = messages.concat(ev);
});



