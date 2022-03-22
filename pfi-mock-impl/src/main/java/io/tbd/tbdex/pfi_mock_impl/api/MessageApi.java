package io.tbd.tbdex.pfi_mock_impl.api;

import io.tbd.tbdex.protocol.core.Message;
import io.tbd.tbdex.protocol.processors.AskProcessor;
import io.tbd.tbdex.protocol.processors.CloseProcessor;
import io.tbd.tbdex.protocol.processors.ConditionalOfferProcessor;
import io.tbd.tbdex.protocol.processors.OfferAcceptProcessor;
import javax.inject.Inject;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

@Path("/handle")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class MessageApi {
  @Inject AskProcessor askProcessor;
  @Inject CloseProcessor closeProcessor;
  @Inject ConditionalOfferProcessor conditionalOfferProcessor;
  @Inject OfferAcceptProcessor offerAcceptProcessor;

  @POST
  public void handle(Message message) {
    switch (message.type()) {
      case Ask:
        askProcessor.process(message);
      case Close:
        closeProcessor.process(message);
      case ConditionalOffer:
        conditionalOfferProcessor.process(message);
      case OfferAccept:
        offerAcceptProcessor.process(message);
    }
  }
}
