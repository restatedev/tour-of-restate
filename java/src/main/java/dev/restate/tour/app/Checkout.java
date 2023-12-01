package dev.restate.tour.app;

import com.google.protobuf.BoolValue;
import dev.restate.sdk.blocking.RestateContext;
import dev.restate.sdk.core.TerminalException;
import dev.restate.tour.generated.CheckoutRestate;
import dev.restate.tour.generated.Tour.CheckoutFlowRequest;

public class Checkout extends CheckoutRestate.CheckoutRestateImplBase {
    @Override
    public BoolValue checkout(RestateContext ctx, CheckoutFlowRequest request) throws TerminalException {
        return BoolValue.of(true);
    }
}
