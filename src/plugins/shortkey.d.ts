export declare interface ShortKeyEventResp {
  type: string;
  combination?: string[];
  modifiers: Record<string, boolean>;
  key: string;
  repeat?: boolean;
}

export declare type ShortKeyCallback = (resp: ShortKeyEventResp) => void;
