package dev.restate.tour.part1;

import com.google.protobuf.BoolValue;
import dev.restate.sdk.blocking.RestateContext;
import dev.restate.sdk.core.TerminalException;
import dev.restate.tour.generated.TicketServiceRestate;
import dev.restate.tour.generated.Tour.Ticket;

public class TicketService extends TicketServiceRestate.TicketServiceRestateImplBase {

    @Override
    public BoolValue reserve(RestateContext ctx, Ticket request) throws TerminalException {
        try {
            Thread.sleep(35000);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
        return BoolValue.of(true);
    }

    @Override
    public void unreserve(RestateContext ctx, Ticket request) throws TerminalException {
    }

    @Override
    public void markAsSold(RestateContext ctx, Ticket request) throws TerminalException {
    }
}
