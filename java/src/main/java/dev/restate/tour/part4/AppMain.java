package dev.restate.tour.part4;

import dev.restate.sdk.http.vertx.RestateHttpEndpointBuilder;

public class AppMain {
    public static void main(String[] args) {
        RestateHttpEndpointBuilder.builder()
                .withService(new Checkout())
                .withService(new TicketService())
                .withService(new UserSession())
                .buildAndListen();
    }
}
