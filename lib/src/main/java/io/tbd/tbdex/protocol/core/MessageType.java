package io.tbd.tbdex.protocol.core;

public enum MessageType {
  Ask(io.tbd.tbdex.protocol.messages.Ask.class),
  Close(io.tbd.tbdex.protocol.messages.Close.class),
  ConditionalOffer(io.tbd.tbdex.protocol.messages.ConditionalOffer.class),
  OfferAccept(io.tbd.tbdex.protocol.messages.OfferAccept.class),
  IdvRequest(io.tbd.tbdex.protocol.messages.IdvRequest.class),
  IdvSubmission(io.tbd.tbdex.protocol.messages.IdvSubmission.class),
  SettlementRequest(io.tbd.tbdex.protocol.messages.SettlementRequest.class),
  SettlementDetails(io.tbd.tbdex.protocol.messages.SettlementDetails.class),
  SettlementReceipt(io.tbd.tbdex.protocol.messages.SettlementReceipt.class);

  private final Class<? extends MessageBody> messageBodyClass;

  MessageType(Class<? extends MessageBody> messageBodyClass) {
    this.messageBodyClass = messageBodyClass;
  }

  public Class<? extends MessageBody> getMessageBodyClass() {
    return this.messageBodyClass;
  }
}
