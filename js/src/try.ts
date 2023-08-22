// construct

class Rfq = {
  const validNextKinds = ['quote', 'close']
  get kind() {
    return 'rfq'
  }
}

// only works if you have the complete exchange starting with rfq
const validateExchange(...messages)

const validateRfqAndOffering(rfq, offering)

const rfq = new Rfq(rfqOpts)
const message = new Message({ rfq, ...rest })

const message = new Message({ data: rfq, private: {}, to, from, ...rest })

message.kind

class Message {
  #message: {
    metadata: {},
    data
  }
  constructor(messageOpts = {}) {
    if (messageOpts.rfq) {
      // set kind to rfq
    }

    this.#message.metadata.kind = messageOpts.data.kind
  }
  
  set kind(kind) {
    this.message.metadata.kind = kind
  }

  get kind() {
    return this.message.metadata.kind
  }

  get metadata() {
    return this.message.metadata
  }
}


const rfq2 = new Rfq({
  message: {
    from, to
  },
  data: {

  }
})

const resource = new Resource({ data: rfq,  metadata: {to, from, ...rest} })
