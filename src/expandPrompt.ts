import { escapeRegExp } from "./helpers";

export class SyntaxErrorException extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export type PromptExpansionParameters = {
  alternator?: string;
  brackets?: [string, string];
  optionalBrackets?: [string, string];
};

type Keywords = {
  ALT: string;
  ALT_LBRA: string;
  ALT_RBRA: string;
  OPT_LBRA: string;
  OPT_RBRA: string;
};

const DEFAULT_KEYWORDS: Keywords = {
  ALT: "|",
  ALT_LBRA: "<",
  ALT_RBRA: ">",
  OPT_LBRA: "[",
  OPT_RBRA: "]",
};

class Expr {
  constructor(public children: (Expr | string)[] = []) {}
}

class ConcatExpr extends Expr {
  toString(): string {
    return "{" + this.children.map(String).join(" ") + "}";
  }
}

class AltExpr extends Expr {
  toString(): string {
    return "{" + this.children.map(String).join(" | ") + "}";
  }
}

function parseTokens(
  tokens: string[],
  keywords: Keywords,
  closeBracket: string | null = null
): Expr {
  let res = new ConcatExpr();
  let head = res;

  while (tokens.length > 0) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const token = tokens.shift()!;
    if (token === keywords.ALT_LBRA) {
      head.children.push(parseTokens(tokens, keywords, keywords.ALT_RBRA));
    } else if (token === keywords.OPT_LBRA) {
      let group = parseTokens(tokens, keywords, keywords.OPT_RBRA);
      if (!(group instanceof AltExpr)) {
        group = new AltExpr([group]);
      }
      group.children.push(new ConcatExpr());
      head.children.push(group);
      const new_head = new ConcatExpr();
      head.children.push(new_head);
      head = new_head;
    } else if (token === closeBracket) {
      return res;
    } else if (token === keywords.ALT_RBRA || token === keywords.OPT_RBRA) {
      throw new SyntaxErrorException("Unmatched closing bracket");
    } else if (token === keywords.ALT) {
      if (!(res instanceof AltExpr)) {
        res = new AltExpr([res]);
      }
      head = new ConcatExpr();
      res.children.push(head);
    } else {
      head.children.push(token);
    }
  }
  if (closeBracket) {
    throw new SyntaxErrorException("Unmatched opening bracket");
  }
  return res;
}

export function parse(string: string, keywords: Keywords): Expr {
  keywords = { ...DEFAULT_KEYWORDS, ...keywords };
  const pattern = new RegExp(
    "(" +
      Object.values(keywords).filter(Boolean).map(escapeRegExp).join("|") +
      ")"
  );
  const tokens = string.split(pattern).filter(Boolean);
  return parseTokens(tokens, keywords);
}

function* generateAltListChoices(
  exprs: (Expr | string)[]
): Generator<(Expr | string)[]> {
  if (exprs.length) {
    const [x, ...xs] = exprs;
    for (const y of generateExprChoices(x)) {
      for (const ys of generateAltListChoices(xs)) {
        yield [...y, ...ys];
      }
    }
  } else {
    yield [];
  }
}

function* generateExprChoices(
  expr: Expr | string
): Generator<(Expr | string)[]> {
  if (expr instanceof ConcatExpr) {
    yield* generateAltListChoices(expr.children);
  } else if (expr instanceof AltExpr) {
    for (const e of expr.children) {
      yield* generateExprChoices(e);
    }
  } else {
    yield [expr];
  }
}

export function* generatePromptExpansions(
  prompt: string,
  parameters?: PromptExpansionParameters
): Generator<string> {
  const { alternator, brackets, optionalBrackets } = {
    alternator: "|",
    brackets: ["<", ">"],
    optionalBrackets: ["[", "]"],
    ...parameters,
  };
  const keywords = {
    ALT: alternator,
    ALT_LBRA: brackets[0],
    ALT_RBRA: brackets[1],
    OPT_LBRA: optionalBrackets[0],
    OPT_RBRA: optionalBrackets[1],
  };
  const expr = parse(prompt, keywords);
  for (const words of generateExprChoices(expr)) {
    yield words.join("");
  }
}

export function expandPrompt(
  prompt: string,
  params?: PromptExpansionParameters
): string[] {
  return [...generatePromptExpansions(prompt, params)];
}

export function chooseRandomExpansion(
  prompt: string,
  parameters?: PromptExpansionParameters
): string | null {
  const choices = expandPrompt(prompt, parameters);
  return choices.length > 1
    ? choices[Math.floor(Math.random() * choices.length)]
    : null;
}
