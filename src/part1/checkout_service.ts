import {
  CheckoutFlowRequest,
  CheckoutService as ICheckoutService,
} from "../generated/proto/example";
import { BoolValue } from "../generated/proto/google/protobuf/wrappers";

export class CheckoutService implements ICheckoutService {
  async checkout(request: CheckoutFlowRequest): Promise<BoolValue> {
    return BoolValue.create({ value: true });
  }
}
