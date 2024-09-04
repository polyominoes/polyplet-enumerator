import { Coord } from "./util/coord";

export function transpose(input: Coord[]): Coord[] {
  return input.map(([x, y]) => [y, x]);
}
