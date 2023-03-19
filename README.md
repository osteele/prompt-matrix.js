# Prompt Matrix

Prompt Matrix is a small library that expands a string that specifies a prompt
matrix into a list of strings.

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
import { expand } from 'prompt-matrix';

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
const string = "<I|We> love <coding|programming>";
const result = expandPrompt(string);
console.log(result);
// Output:
// [ 'I love coding',
//   'I love programming',
//   'We love coding',
//   'We love programming' ]
```

Example 2: Using custom brackets and separator

```typescript
const string = "{A,B,C}|{1,2,3}|{X,Y,Z}";
const brackets = ["{", "}"];
const separator = ",";
const result = expandPrompt(string, brackets, separator);
console.log(result);
// Output:
// [ 'A,1,X', 'A,1,Y', 'A,1,Z', 'A,2,X', 'A,2,Y', 'A,2,Z', 'A,3,X', 'A,3,Y', 'A,3,Z',
//   'B,1,X', 'B,1,Y', 'B,1,Z', 'B,2,X', 'B,2,Y', 'B,2,Z', 'B,3,X', 'B,3,Y', 'B,3,Z',
//   'C,1,X', 'C,1,Y', 'C,1,Z', 'C,2,X', 'C,2,Y', 'C,2,Z', 'C,3,X', 'C,3,Y', 'C,3,Z' ]
```

Example 3: Using nested brackets

```typescript
const string = "<A<B<C|D>|E>|F>";
const result = expandPrompt(string);
console.log(result);
// Output:
// [ 'ABC', 'ABD', 'AE', 'F' ]
```

Example 4: Using escaped characters

```typescript
const string = "The value is <1\\,000|2\\,000|3\\,000>";
const result = expandPrompt(string);
console.log(result);
// Output:
// [ 'The value is 1,000', 'The value is 2,000', 'The value is 3,000' ]
```

Example 5: Using a single option

```typescript
const string = "<Option>";
const result = expandPrompt(string);
console.log(result);
// Output:
// [ 'Option' ]
```

Example 6: Using an empty string

```typescript
const string = "<Option1||Option2>";
const result = expandPrompt(string);
console.log(result);
// Output:
// [ 'Option1', '', 'Option2' ]
```

Example 7: Using a combination of nested brackets and empty strings

```typescript
const string = "<A<B||C<D|E>|F>|G>";
const result = expandPrompt(string);
console.log(result);
// Output:
// [ 'ABF', 'ACD', 'ACE', 'G' ]
```

## License

Prompt Matrix is licensed under the MIT License.
