import { ModifierArray, ModifierMap } from './index.d';
import { KeybindingFormat, ModifierKey } from '../enums';

export function fromMap(src: Record<string, boolean>): string[] {
  return Object.keys(src).reduce(
    (out, prop) => (src[prop] ? [...out, prop] : out),
    [] as string[]
  );
}

export function fromArray(src: ModifierArray): string[] {
  return src.reduce(
    (out, isActive, index) =>
      isActive ? [...out, ModifierKey[index].toLowerCase()] : out,
    [] as string[]
  );
}
