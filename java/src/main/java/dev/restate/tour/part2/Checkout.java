package dev.restate.tour.part2;

import com.google.protobuf.BoolValue;
import dev.restate.sdk.RestateContext;
import dev.restate.sdk.common.TerminalException;
import dev.restate.tour.generated.CheckoutRestate;
import dev.restate.tour.generated.Tour.CheckoutFlowRequest;

public class Checkout extends CheckoutRestate.CheckoutRestateImplBase {
    @Override
    public BoolValue checkout(RestateContext ctx, CheckoutFlowRequest request) throws TerminalException {
        return BoolValue.of(true);
    }
}
