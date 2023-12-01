package dev.restate.tour.part2;

import com.fasterxml.jackson.core.type.TypeReference;
import com.google.protobuf.BoolValue;
import dev.restate.sdk.blocking.RestateContext;
import dev.restate.sdk.core.CoreSerdes;
import dev.restate.sdk.core.StateKey;
import dev.restate.sdk.core.TerminalException;
import dev.restate.sdk.core.serde.jackson.JacksonSerdes;
import dev.restate.tour.auxiliary.PaymentClient;
import dev.restate.tour.auxiliary.TicketStatus;
import dev.restate.tour.generated.TicketServiceRestate;
import dev.restate.tour.generated.Tour.Ticket;
import io.grpc.Status;

public class TicketService extends TicketServiceRestate.TicketServiceRestateImplBase {
    public static final StateKey<TicketStatus> STATE_KEY = StateKey.of("status", JacksonSerdes.of(new TypeReference<>() {}));

    @Override
    public BoolValue reserve(RestateContext ctx, Ticket request) throws TerminalException {
        var status = ctx.get(STATE_KEY).orElse(TicketStatus.Available);

        if(status.equals(TicketStatus.Available)){
            ctx.set(STATE_KEY, TicketStatus.Reserved);
            return BoolValue.of(true);
        } else {
            return BoolValue.of(false);
        }
    }

    @Override
    public void unreserve(RestateContext ctx, Ticket request) throws TerminalException {
        var status = ctx.get(STATE_KEY).orElse(TicketStatus.Available);

        if(!status.equals(TicketStatus.Sold)){
            ctx.clear(STATE_KEY);
        }

        ctx.sideEffect(CoreSerdes.BOOLEAN, () -> {
            var result = PaymentClient.get().call("tx-id", 500);
            if(result){
                throw new io.grpc.StatusRuntimeException(Status.UNKNOWN);
            } else {
                return result;
            }
        });
    }

    @Override
    public void markAsSold(RestateContext ctx, Ticket request) throws TerminalException {
        var status = ctx.get(STATE_KEY).orElse(TicketStatus.Available);

        if(status.equals(TicketStatus.Reserved)){
            ctx.set(STATE_KEY, TicketStatus.Sold);
        }
    }
}
