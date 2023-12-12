package dev.restate.tour.part1;

import com.google.protobuf.BoolValue;
import dev.restate.sdk.RestateContext;
import dev.restate.sdk.common.TerminalException;
import dev.restate.tour.generated.CheckoutRestate;
import dev.restate.tour.generated.TicketServiceRestate;
import dev.restate.tour.generated.Tour.*;
import dev.restate.tour.generated.UserSessionRestate;

public class UserSession extends UserSessionRestate.UserSessionRestateImplBase {
    @Override
    public BoolValue addTicket(RestateContext ctx, ReserveTicket request) throws TerminalException {
        var ticketClnt = TicketServiceRestate.newClient(ctx);
        ticketClnt.oneWay().reserve(Ticket.newBuilder().setTicketId(request.getTicketId()).build());

        return BoolValue.of(true);
    }

    @Override
    public void expireTicket(RestateContext ctx, ExpireTicketRequest request) throws TerminalException {
        var ticketClnt = TicketServiceRestate.newClient(ctx);
        ticketClnt.oneWay().unreserve(Ticket.newBuilder().setTicketId(request.getTicketId()).build());
    }

    @Override
    public BoolValue checkout(RestateContext ctx, CheckoutRequest request) throws TerminalException {
        var checkoutClnt = CheckoutRestate.newClient(ctx);
        var checkoutSuccess = checkoutClnt.checkout(
                CheckoutFlowRequest.newBuilder().setUserId(request.getUserId()).addTickets("456").build()
        ).await();

        return checkoutSuccess;
    }

}
