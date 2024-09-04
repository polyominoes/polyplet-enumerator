import { fromBuffer } from "./fromBuffer";
import { prisma } from "./prisma";
import { toBuffer } from "./toBuffer";
import { Coord } from "./util/coord";
import { range } from "./util/range";
import { validate } from "./validate";

export async function main(upTo: number): Promise<void> {
  const {
    _max: { n: last },
  } = await prisma.polyomino.aggregate({ _max: { n: true } });

  for (const i of range(last ?? 1, upTo + 1)) {
    if (i === 1) {
      const trivialOnlySolution: Coord[] = [[0, 0]];
      const buffer = toBuffer(trivialOnlySolution);
      await prisma.polyomino.upsert({
        where: { canonized_form: buffer },
        create: { n: i, canonized_form: buffer, is_processed_for_next: false },
        update: {},
      });
    } else {
      while (true) {
        const job = await prisma.polyomino.findFirst({
          where: { n: i - 1, is_processed_for_next: false },
        });
        if (!job) break;
        await prisma.$transaction(async (tx) => {
          const previous = fromBuffer(job.canonized_form);
          for (const toInsert of Array.from(new Array(previous.length)).flatMap(
            (_, i) => [
              ...validate([...previous, [previous[i][0] + 1, previous[i][1]]]),
              ...validate([...previous, [previous[i][0] - 1, previous[i][1]]]),
              ...validate([...previous, [previous[i][0], previous[i][1] + 1]]),
              ...validate([...previous, [previous[i][0], previous[i][1] - 1]]),
            ]
          )) {
            await prisma.polyomino.upsert({
              where: { n: i, canonized_form: toInsert },
              create: { n: i, canonized_form: toInsert },
              update: {},
            });
          }
          await prisma.polyomino.update({
            where: { canonized_form: job.canonized_form },
            data: { is_processed_for_next: true },
          });
        });
      }
    }
  }
}
