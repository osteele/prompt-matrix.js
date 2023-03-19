# Prompt Matrix

[![npm version](https://badge.fury.io/js/prompt-matrix.svg)](https://badge.fury.io/js/prompt-matrix)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Prompt Matrix is a small library that expands a string that specifies a prompt
matrix into a list of strings. For example, the string `"The <dog|cat> in the
hat"` expands to the list `["The dog in the hat", "The cat in the hat"]`.

The motivating case for this package is to compare the effects of different
prompts in text and image generation systems such as Stable Diffusion and GPT-3.

## Features

A prompt string may contain multiple alternations. For example, `"The <dog|cat>
in the <cardigan|hat>"` produces a list of the four strings `"The dog in the
cardigan"`, `"The dog in the hat"`, `"The cat in the cardigan"`, and `"The cat
in the hat"`.

A prompt string may contain nested alternations. For example, `"The
<<small|large> dog|cat>"` produces the strings `"The small dog"`, `"The large
do"`, and `"The cat"`.

Brackets `[]` enclose optional elements. For example, `"The [small] cat"` is
equivalent to `"The <small,> cat"`, and both produce the strings `"The small
cat"` and `"The  cat"`.

The special characters `<>{}|` can be replaced by different strings, or disabled
by specifying
`None` or the empty string.

> **Note**: The disjunction is bounded by the enclosing brackets, if any. `"The
dog|cat in the cardigan|hat"` generates the three strings `"The dog"`, `"cat in
the gardigan"`, and `"hat"`. This is in contrast to some other systems, that
scope a disjunction to the text delimited by surrounding whitespace.

## Installation

To install Prompt Matrix, run:

```sh
npm install prompt-matrix
```

## Usage

Prompt Matrix provides two functions for expanding a prompt matrix: expand and
iterExpand. Both take a string that specifies a prompt matrix and return an
array of strings that are the expansion of the prompt matrix.

```typescript
import { expandPrompt } from 'prompt-matrix';

const prompt = "<hi|hello> <there|you>";
const expansion = expandPrompt(prompt);
console.log(expansion); // ["hi there", "hi you", "hello there", "hello you"]
```

`expandPrompt` returns an array of strings with all possible combinations of the
prompt matrix elements.

```typescript
import { generatePromptExpansions } from 'prompt-matrix';

const prompt = "<hi|hello> <there|you>";
for (const expansion of generatePromptExpansions(prompt)) {
  console.log(expansion); // "hi there", "hi you", "hello there", "hello you"
}
```

`generatePromptExpansions` returns a generator that yields the expansions one by one, which
can be useful for large prompt matrices where generating all possible
combinations at once might be memory-intensive.

## Examples

Example 1: Basic usage

```typescript
const string = "The <dog|cat> in the hat";
const result = expandPrompt(string);
console.log(result);
// Output:
// ["The dog in the hat",
//  "The cat in the hat"]
```

Example 2: Using multiple alternations

```typescript
const string = "The <dog|cat> in the <cardigan|hat>";
const result = expandPrompt(string);
console.log(result);
// Output:
// ["The dog in the cardigan",
//  "The dog in the hat",
//  "The cat in the cardigan",
//  "The cat in the hat"]
```

Example 3: Using nested brackets

```typescript
const string = "The <<small|large> <brown|black> dog|<red|blue> fish>";
const result = expandPrompt(string);
console.log(result);
// Output:
// ["The small brown dog",
//  "The small black dog",
//  "The large brown dog",
//  "The large black dog",
//  "The red fish",
//  "The blue fish"]
```

Example 4: Using custom brackets and separator

```typescript
const string = "The {dog,cat} in the {cardigan,hat}";
const alternator = ",";
const brackets = ["{", "}"];
const result = expandPrompt(string, {alternator, brackets});
console.log(result);
// Output:
// ["The dog in the cardigan",
//  "The dog in the hat",
//  "The cat in the cardigan",
//  "The cat in the hat"]
```

## License

Prompt Matrix is licensed under the MIT License.
