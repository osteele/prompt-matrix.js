import { describe, expect } from "@jest/globals";
import { expandPrompt, SyntaxErrorException } from "./expandPrompt";

describe("expand", () => {
  it("should simply return a string that doesn't contain any metacharacters", () => {
    const prompt = "foo";
    const expected = ["foo"];
    expect(expandPrompt(prompt)).toEqual(expected);
  });

  it("should expand a string with one set of alternations", () => {
    const prompt = "<foo|bar>";
    const expected = ["foo", "bar"];
    expect(expandPrompt(prompt)).toEqual(expected);
  });

  it("should expand a string with multiple sets of alternations", () => {
    const prompt = "<a|b><c|d>";
    const expected = ["ac", "ad", "bc", "bd"];
    expect(expandPrompt(prompt)).toEqual(expected);
  });

  it("should expand a string with nested alternations", () => {
    const prompt = "<a|b<c|d>>";
    const expected = ["a", "bc", "bd"];
    expect(expandPrompt(prompt)).toEqual(expected);
  });

  it("should throw an error for an unmatched opening angle bracket", () => {
    const prompt = "<a|b";
    expect(() => expandPrompt(prompt)).toThrow(SyntaxErrorException);
  });

  it("should throw an error for an unmatched closing angle bracket", () => {
    const prompt = "<a|b>>";
    expect(() => expandPrompt(prompt)).toThrow(SyntaxErrorException);
  });

  it("should work with custom bracket and separator characters", () => {
    const prompt = "{a,b}{c,d}";
    const alternator = ",";
    const brackets = ["{", "}"] as [string, string];
    const expected = ["ac", "ad", "bc", "bd"];
    expect(expandPrompt(prompt, { alternator, brackets })).toEqual(expected);
  });

  it("should expand a string with square brackets", () => {
    const input = "a[b]c";
    const expectedOutput = ["abc", "ac"];
    expect(expandPrompt(input)).toEqual(expectedOutput);
  });

  it("should expand a string with square brackets and vertical bars", () => {
    const input = "a[b|c]d";
    const expectedOutput = ["abd", "acd", "ad"];
    expect(expandPrompt(input)).toEqual(expectedOutput);
  });

  it("should expand a string with nested square and angle brackets", () => {
    const input = "<a|b[c|d]e>";
    const expectedOutput = ["a", "bce", "bde", "be"];
    expect(expandPrompt(input)).toEqual(expectedOutput);
  });

  it("should expand a string with both angle and square brackets", () => {
    const input = "[a|b]<c|d>";
    const expectedOutput = ["ac", "ad", "bc", "bd", "c", "d"];
    expect(expandPrompt(input)).toEqual(expectedOutput);
  });

  it("should throw an error for an unmatched opening square bracket", () => {
    const prompt = "[a|b";
    expect(() => expandPrompt(prompt)).toThrow(SyntaxErrorException);
  });

  it("should throw an error for an unmatched closing square bracket", () => {
    const prompt = "[a|b]]";
    expect(() => expandPrompt(prompt)).toThrow(SyntaxErrorException);
  });
});
