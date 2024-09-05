import { SymmetryGroup } from "@prisma/client";
import { canonizeFixed } from "./canonizeFixed";
import { rotate } from "./rotate";
import { toBuffer } from "./toBuffer";
import { transpose } from "./transpose";
import { bufferEqual } from "./util/bufferEqual";
import { Coord } from "./util/coord";

export function canonizeFree(
  fixed: Coord[]
): [buffer: Buffer, symmetryGroup: SymmetryGroup] {
  const canonizedFixed = canonizeFixed(fixed);
  const c90 = canonizeFixed(rotate(fixed));
  const c180 = canonizeFixed(rotate(c90));
  const c270 = canonizeFixed(rotate(c180));
  const transposed = canonizeFixed(transpose(fixed));
  const t90 = canonizeFixed(rotate(transposed));
  const t180 = canonizeFixed(rotate(t90));
  const t270 = canonizeFixed(rotate(t180));
  const canonizedFixedBuffer = toBuffer(canonizedFixed);
  const c90Buffer = toBuffer(c90);
  const c180Buffer = toBuffer(c180);
  const c270Buffer = toBuffer(c270);
  const transposedBuffer = toBuffer(transposed);
  const t90Buffer = toBuffer(t90);
  const t180Buffer = toBuffer(t180);
  const t270Buffer = toBuffer(t270);
  const buffer = [
    canonizedFixedBuffer,
    c90Buffer,
    c180Buffer,
    c270Buffer,
    transposedBuffer,
    t90Buffer,
    t180Buffer,
    t270Buffer,
  ].sort(Buffer.compare)[0];
  if (bufferEqual(canonizedFixedBuffer, c90Buffer)) {
    if (bufferEqual(canonizedFixedBuffer, transposedBuffer)) {
      return [buffer, "All"];
    }
    return [buffer, "Rotation4Fold"];
  } else if (
    bufferEqual(canonizedFixedBuffer, transposedBuffer) ||
    bufferEqual(canonizedFixedBuffer, t180Buffer)
  ) {
    if (bufferEqual(canonizedFixedBuffer, c180Buffer)) {
      return [buffer, "Rotation2FoldMirror45"];
    }
    return [buffer, "Mirror45"];
  } else if (
    bufferEqual(canonizedFixedBuffer, t90Buffer) ||
    bufferEqual(canonizedFixedBuffer, t270Buffer)
  ) {
    if (bufferEqual(canonizedFixedBuffer, c180Buffer)) {
      return [buffer, "Rotation2FoldMirror90"];
    }
    return [buffer, "Mirror90"];
  } else if (bufferEqual(canonizedFixedBuffer, c180Buffer)) {
    return [buffer, "Rotation2Fold"];
  }
  return [buffer, "None"];
}
