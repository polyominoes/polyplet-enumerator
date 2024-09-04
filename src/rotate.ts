import { normalize } from "./normalize";
import { Coord } from "./util/coord";

export function rotate(input: Coord[]): Coord[] {
  return normalize(input.map(([x, y]) => [-y, x]));
}
