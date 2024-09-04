import { canonizeFixed } from "./canonizeFixed";
import { rotate } from "./rotate";
import { toBuffer } from "./toBuffer";
import { transpose } from "./transpose";
import { Coord } from "./util/coord";

export function canonizeFree(fixed: Coord[]): Buffer {
  const canonizedFixed = canonizeFixed(fixed);
  const c90 = canonizeFixed(rotate(fixed));
  const c180 = canonizeFixed(rotate(c90));
  const c270 = canonizeFixed(rotate(c180));
  const transposed = canonizeFixed(transpose(fixed));
  const t90 = canonizeFixed(rotate(transposed));
  const t180 = canonizeFixed(rotate(t90));
  const t270 = canonizeFixed(rotate(t180));
  return [
    toBuffer(canonizedFixed),
    toBuffer(c90),
    toBuffer(c180),
    toBuffer(c270),
    toBuffer(transposed),
    toBuffer(t90),
    toBuffer(t180),
    toBuffer(t270),
  ].sort(Buffer.compare)[0];
}
