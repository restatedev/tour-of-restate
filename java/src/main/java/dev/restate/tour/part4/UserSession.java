package dev.restate.tour.part4;

import com.fasterxml.jackson.core.type.TypeReference;
import com.google.protobuf.BoolValue;
import dev.restate.sdk.RestateContext;
import dev.restate.sdk.common.StateKey;
import dev.restate.sdk.common.TerminalException;
import dev.restate.sdk.serde.jackson.JacksonSerdes;
import dev.restate.tour.generated.CheckoutRestate;
import dev.restate.tour.generated.TicketServiceRestate;
import dev.restate.tour.generated.Tour.*;
import dev.restate.tour.generated.UserSessionRestate;

import java.time.Duration;
import java.util.HashSet;
import java.util.Set;

public class UserSession extends UserSessionRestate.UserSessionRestateImplBase {

    public static final StateKey<Set<String>> STATE_KEY = StateKey.of("tickets", JacksonSerdes.of(new TypeReference<>() {}));

    @Override
    public BoolValue addTicket(RestateContext ctx, ReserveTicket request) throws TerminalException {
        var client = TicketServiceRestate.newClient(ctx);
        var reservationSuccess = client
                .reserve(Ticket.newBuilder().setTicketId(request.getTicketId()).build())
                .await().getValue();

        if(reservationSuccess) {
            var tickets = ctx.get(STATE_KEY).orElseGet(HashSet::new);
            tickets.add(request.getTicketId());
            ctx.set(STATE_KEY, tickets);

            var userSessionClnt = UserSessionRestate.newClient(ctx);
            var req = ExpireTicketRequest.newBuilder().setTicketId(request.getTicketId()).setUserId(request.getUserId()).build();
            userSessionClnt.delayed(Duration.ofMinutes(15)).expireTicket(req);
        }

        return BoolValue.of(reservationSuccess);
    }

    @Override
    public void expireTicket(RestateContext ctx, ExpireTicketRequest request) throws TerminalException {
        var tickets = ctx.get(STATE_KEY).orElseGet(HashSet::new);

        var removed = tickets.removeIf(s -> s.equals(request.getTicketId()));

        if(removed) {
            ctx.set(STATE_KEY, tickets);
            var client = TicketServiceRestate.newClient(ctx);
            client.oneWay().unreserve(Ticket.newBuilder().setTicketId(request.getTicketId()).build());
        }
    }

    @Override
    public BoolValue checkout(RestateContext ctx, CheckoutRequest request) throws TerminalException {
        var tickets = ctx.get(STATE_KEY).orElseGet(HashSet::new);

        boolean something = true;

        if(tickets.isEmpty()){
            return BoolValue.of(false);
        }

        var req = CheckoutFlowRequest
                .newBuilder()
                .setUserId(request.getUserId())
                .addAllTickets(tickets)
                .build();
        var client = CheckoutRestate.newClient(ctx);
        var checkoutSuccess = client.checkout(req).await();

        if(checkoutSuccess.getValue()){
            ctx.clear(STATE_KEY);
        }

        return checkoutSuccess;
    }
}