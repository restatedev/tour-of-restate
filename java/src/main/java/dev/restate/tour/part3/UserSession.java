package dev.restate.tour.part3;

import com.fasterxml.jackson.core.type.TypeReference;
import com.google.protobuf.BoolValue;
import dev.restate.sdk.RestateContext;
import dev.restate.sdk.common.StateKey;
import dev.restate.sdk.common.TerminalException;
import dev.restate.sdk.serde.jackson.JacksonSerdes;
import dev.restate.tour.generated.*;
import dev.restate.tour.generated.Tour.*;

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

        if (reservationSuccess) {
            var tickets = ctx.get(STATE_KEY).orElseGet(HashSet::new);
            tickets.add(request.getTicketId());
            ctx.set(STATE_KEY, tickets);

            ctx.delayedCall(UserSessionGrpc.getExpireTicketMethod(),
                    ExpireTicketRequest.newBuilder().setTicketId(request.getTicketId()).setUserId(request.getUserId()).build(),
                    Duration.ofMinutes(15));
        }

        return BoolValue.of(reservationSuccess);
    }

    @Override
    public void expireTicket(RestateContext ctx, ExpireTicketRequest request) throws TerminalException {
        var tickets = ctx.get(STATE_KEY).orElseGet(HashSet::new);

        var removed = tickets.removeIf(s -> s.equals(request.getTicketId()));

        if (removed) {
            ctx.set(STATE_KEY, tickets);

            ctx.oneWayCall(
                    TicketServiceGrpc.getUnreserveMethod(),
                    Ticket.newBuilder().setTicketId(request.getTicketId()).build()
            );
        }
    }

    @Override
    public BoolValue checkout(RestateContext ctx, CheckoutRequest request) throws TerminalException {
        // 1. Retrieve the tickets from state
        var tickets = ctx.get(STATE_KEY).orElseGet(HashSet::new);

        // 2. If there are no tickets, return `false`
        if (tickets.isEmpty()) {
            return BoolValue.of(false);
        }

        // 3. Call the `checkout` function of the checkout service with the tickets
        var req = CheckoutFlowRequest
                .newBuilder()
                .setUserId(request.getUserId())
                .addAllTickets(tickets)
                .build();
        var client = CheckoutRestate.newClient(ctx);
        var checkoutSuccess = client.checkout(req).await();

        // 4. If this was successful, empty the tickets.
        // Otherwise, let the user try again.
        if (checkoutSuccess.getValue()) {
            ctx.clear(STATE_KEY);
        }

        return checkoutSuccess;
    }
}
