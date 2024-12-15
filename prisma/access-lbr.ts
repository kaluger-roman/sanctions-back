import { TarrifKind } from "../src/billing/types";
import { billingService } from "../src/billing/billing.service";
import { prisma } from "./prisma";

const emails = [
  "aleksei.i.popov@bspb.ru",
  "elizaveta.v.guseva@bspb.ru",
  "mariya.a.kobickaya@bspb.ru",
  "evgeniya.i.savchenko@bspb.ru",
  "darya.o.gunkina@bspb.ru",
  "ekaterina.yu.panfilova@bspb.ru",
  "aleksandra.v.fedorova@bspb.ru",
  "tatyana.a.kudryavceva@bspb.ru",
];

const start = async () => {
  const users = await Promise.all(
    emails.map((email) => prisma.user.findFirst({ where: { email } })),
  );

  console.log(users);

  for await (const user of users) {
    if (user) {
      await billingService.updateUserTarrif({
        metadata: {
          userId: user.id,
          tarrifId: TarrifKind.demoPro,
        },
      } as any);
    }
  }

  console.log("done");
};

start();
