import { describe, expect, test } from "bun:test";
import { minorVersion, parseReleaseTag } from "./asylum";

describe("parseReleaseTag", () => {
  test("aceita a tag do workflow de release", () => {
    expect(parseReleaseTag("asylum-v2.0.14")).toBe("2.0.14");
  });

  test("aceita tag sem prefixo", () => {
    expect(parseReleaseTag("v3.1.0")).toBe("3.1.0");
    expect(parseReleaseTag("3.1.0")).toBe("3.1.0");
  });

  test("recusa o que não é versão", () => {
    expect(parseReleaseTag("nightly")).toBeNull();
    expect(parseReleaseTag("asylum-v2.0")).toBeNull();
    expect(parseReleaseTag("asylum-v2.0.14-beta")).toBeNull();
  });
});

test("minorVersion corta o patch", () => {
  expect(minorVersion("2.0.14")).toBe("2.0");
});
