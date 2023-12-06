package dev.restate.tour.app;

import com.google.protobuf.BoolValue;
import dev.restate.sdk.RestateContext;
import dev.restate.sdk.common.TerminalException;
import dev.restate.tour.generated.TicketServiceRestate;
import dev.restate.tour.generated.Tour.Ticket;

public class TicketService extends TicketServiceRestate.TicketServiceRestateImplBase {
    @Override
    public BoolValue reserve(RestateContext ctx, Ticket request) throws TerminalException {
        return BoolValue.of(true);
    }

    @Override
    public void unreserve(RestateContext ctx, Ticket request) throws TerminalException {
    }

    @Override
    public void markAsSold(RestateContext ctx, Ticket request) throws TerminalException {
    }
}
