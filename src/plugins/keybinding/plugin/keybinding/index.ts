import { BindingDeclaration, KeybindingCombination } from './index.d';
import { ModifierKeys } from '../enums';

function normalizeDeclaration(declaration: BindingDeclaration): string[] {
  return typeof declaration === 'string' ? [declaration] : declaration;
}

export function parse(declaration: BindingDeclaration): KeybindingCombination {
  const keys = normalizeDeclaration(declaration);

  return keys.reduce(
    (parsed, key) => {
      const lowerKey = key.toLowerCase();
      switch (lowerKey) {
        case 'meta':
        case 'super':
        case 'command':
        case 'cmd':
          parsed.modifiers.push(ModifierKeys.Meta);
          break;
        case 'ctrl':
        case 'control':
          parsed.modifiers.push(ModifierKeys.Ctrl);
          break;
        case 'alt':
        case 'options':
          parsed.modifiers.push(ModifierKeys.Alt);
          break;
        case 'shift':
          parsed.modifiers.push(ModifierKeys.Shift);
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
    },
    {
      raw: declaration,
      modifiers: [] as ModifierKeys[],
      primary: ''
    }
  );
}
