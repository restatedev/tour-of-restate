package dev.restate.tour.part1;

import com.google.protobuf.BoolValue;
import dev.restate.sdk.blocking.RestateContext;
import dev.restate.sdk.core.TerminalException;
import dev.restate.tour.generated.CheckoutRestate;
import dev.restate.tour.generated.TicketServiceGrpc;
import dev.restate.tour.generated.Tour.*;
import dev.restate.tour.generated.UserSessionRestate;

public class UserSession extends UserSessionRestate.UserSessionRestateImplBase {
    @Override
    public BoolValue addTicket(RestateContext ctx, ReserveTicket request) throws TerminalException {
        ctx.oneWayCall(
                TicketServiceGrpc.getReserveMethod(),
                Ticket.newBuilder().setTicketId(request.getTicketId()).build()
        );

        return BoolValue.of(true);
    }

    @Override
    public void expireTicket(RestateContext ctx, ExpireTicketRequest request) throws TerminalException {
        ctx.oneWayCall(
                TicketServiceGrpc.getUnreserveMethod(),
                Ticket.newBuilder().setTicketId(request.getTicketId()).build()
        );
    }

    @Override
    public BoolValue checkout(RestateContext ctx, CheckoutRequest request) throws TerminalException {
        var req = CheckoutFlowRequest.newBuilder()
                .setUserId(request.getUserId())
                .addTickets("456")
                .build();

        var client = CheckoutRestate.newClient(ctx);
        var success = client.checkout(req).await();

        return success;
    }

}
