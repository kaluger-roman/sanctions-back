import { TarrifKind } from "../src/billing/types";
import { billingService } from "../src/billing/billing.service";

const start = async () => {
  await billingService.updateUserTarrif({
    metadata: {
      userId: 1,
      tarrifId: TarrifKind.jurPro,
    },
  } as any);
};

start();
