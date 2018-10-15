import {
  BindingDeclaration,
  KeybindingCombination,
  ModifierArray,
  ModifierMap
} from './index.d';
import { ModifierKey } from '../enums';

function normalizeDeclaration(declaration: BindingDeclaration): string[] {
  return typeof declaration === 'string' ? [declaration] : declaration;
}

export function updateModifiers(
  modifiers: ModifierArray,
  prop: ModifierKey,
  value: boolean
) {
  modifiers[prop] = value;
}

export function mapToArray(src: ModifierMap): ModifierArray {
  return [src.altKey, src.ctrlKey, src.metaKey, src.shiftKey];
}

export function arrayToMap(src: ModifierArray): ModifierMap {
  return {
    altKey: src[ModifierKey.Alt],
    ctrlKey: src[ModifierKey.Ctrl],
    metaKey: src[ModifierKey.Meta],
    shiftKey: src[ModifierKey.Shift]
  };
}

export function parse(declaration: BindingDeclaration): KeybindingCombination {
  const keys = normalizeDeclaration(declaration);
  const initialState: KeybindingCombination = {
    raw: declaration,
    modifiers: [false, false, false, false],
    primary: ''
  };

  return keys.reduce((parsed, key) => {
    const lowerKey = key.toLowerCase();
    switch (lowerKey) {
      case 'meta':
      case 'super':
      case 'command':
      case 'cmd':
        updateModifiers(parsed.modifiers, ModifierKey.Meta, true);
        break;
      case 'ctrl':
      case 'control':
        updateModifiers(parsed.modifiers, ModifierKey.Ctrl, true);
        break;
      case 'alt':
      case 'options':
        updateModifiers(parsed.modifiers, ModifierKey.Alt, true);
        break;
      case 'shift':
        updateModifiers(parsed.modifiers, ModifierKey.Shift, true);
        break;
      // Aliases
      case 'del':
        parsed.primary = 'delete';
        break;
      case 'esc':
        parsed.primary = 'escape';
        break;
      case 'up':
        parsed.primary = 'arrowup';
        break;
      case 'down':
        parsed.primary = 'arrowdown';
        break;
      case 'left':
        parsed.primary = 'arrowleft';
        break;
      case 'right':
        parsed.primary = 'arrowright';
        break;
      default:
        if (parsed.primary !== '') {
          // tslint:disable-next-line:no-console
          console.warn(
            `${JSON.stringify(declaration)}: ${
              parsed.primary
            } will be replaced by ${lowerKey}`
          );
        }
        parsed.primary = lowerKey;
    }
    return parsed;
  }, initialState);
}
