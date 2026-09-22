import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";

import { durations, easings, motionCssVariables, stagger } from "@/lib/motion";

/**
 * The rule from the app's MOTION.md, carried over unchanged: never inline a
 * duration, easing, spring or travel distance — every value comes from
 * `src/lib/motion.ts`. This is the guard that keeps it true as the page grows.
 *
 * Scope is the code the landing page is built from: `components/demo`,
 * `components/site`, `pages` and `layouts`. The vendored shadcn primitives in
 * `components/ui` are library code the page does not use, and carry their own
 * defaults; they are deliberately out of scope rather than overlooked.
 */
const ROOTS = ["src/components/demo", "src/components/site", "src/pages", "src/layouts"];

const RULES: { name: string; pattern: RegExp }[] = [
  { name: "a numeric duration", pattern: /\bduration\s*:\s*[\d.]/ },
  { name: "a numeric delay", pattern: /\bdelay\s*:\s*[\d.]/ },
  /*
   * A decimal anywhere in a timing expression, not only straight after the
   * colon: `delay: rated ? starIndex * 0.05 : 0` got past the two rules above.
   */
  {
    name: "a decimal literal in a timing expression",
    pattern: /\b(delay|duration)\s*:[^,}\n]*\d*\.\d/,
  },
  /*
   * Travel written as a number in an animation target. Zero is a resting
   * position, not a distance, so it is allowed; named layout geometry outside
   * an animation prop (the track stack's OFFSET) is not in scope.
   */
  {
    name: "a numeric travel distance",
    pattern:
      /\b(initial|animate|exit|whileInView|whileHover|whileTap)=\{\{[^}]*\b[xy]\s*:\s*-?[1-9]/,
  },
  { name: "a literal easing", pattern: /\bease\s*:\s*["'`[]/ },
  { name: "a spring constant", pattern: /\b(stiffness|damping|mass|bounce)\s*:/ },
  { name: "`transition: all`", pattern: /transition\s*:\s*all\b|\btransition-all\b/ },
  {
    name: "a hard-coded CSS duration or easing utility",
    pattern: /\b(duration|delay)-(\d|\[)|\bease-(in|out|in-out|linear|\[)\b/,
  },
];

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) return sourceFiles(path);
    return /\.(tsx?|astro)$/.test(entry) && !/\.test\./.test(entry) ? [path] : [];
  });
}

/** Every rule a line breaks. Comments are skipped: explaining a value is fine. */
function violations(line: string): string[] {
  const code = line.trim();
  if (code.startsWith("//") || code.startsWith("*") || code.startsWith("/*")) return [];
  return RULES.filter((rule) => rule.pattern.test(line)).map((rule) => rule.name);
}

describe("motion discipline", () => {
  /*
   * The guard tests itself first. A pattern that quietly stopped matching
   * would pass every file forever, which is worse than having no guard.
   */
  it("recognises every kind of inlined value it is meant to catch", () => {
    for (const sample of [
      "transition={{ duration: 0.3 }}",
      "transition={{ delay: 0.12 }}",
      'transition={{ ease: "easeOut" }}',
      "transition={{ ease: [0.4, 0, 0.2, 1] }}",
      "const spring = { stiffness: 300, damping: 20 };",
      'className="transition-all"',
      'className="transition-colors duration-150"',
      'className="duration-[250ms] ease-in-out"',
      // Both got past earlier versions of this guard.
      "delay: rated ? starIndex * 0.05 : 0,",
      "initial={{ opacity: 0, y: 4 }}",
    ]) {
      expect(violations(sample), sample).not.toEqual([]);
    }
  });

  it("lets values drawn from the registry through", () => {
    for (const sample of [
      "transition={{ duration: durations.quick, ease: easings.standard }}",
      "duration: travel / speeds.gallery,",
      "ease: easings.linear,",
      "transition={{ ...presets.gentle, delay: index * stagger.relaxed }}",
      'className="transition-colors duration-(--motion-base) ease-(--ease-standard)"',
      "delay: rated ? starIndex * stagger.base : 0,",
      "initial={{ opacity: 0, y: distance.hover }}",
      "whileInView={{ opacity: 1, y: 0 }}",
    ]) {
      expect(violations(sample), sample).toEqual([]);
    }
  });

  it("finds no inlined motion values anywhere on the page", () => {
    const found = ROOTS.flatMap(sourceFiles).flatMap((file) =>
      readFileSync(file, "utf8")
        .split("\n")
        .flatMap((line, index) =>
          violations(line).map(
            (rule) => `${relative(process.cwd(), file)}:${index + 1} — ${rule}: ${line.trim()}`,
          ),
        ),
    );

    expect(found).toEqual([]);
  });
});

describe("motionCssVariables", () => {
  /*
   * The CSS side of the page (the bar's colour change, the section reveals)
   * reads these variables, so they have to carry the registry's numbers rather
   * than a copy of them.
   */
  const css = motionCssVariables();

  it("carries the registry's durations", () => {
    expect(css).toContain(`--motion-base: ${durations.base}s`);
    expect(css).toContain(`--motion-editorial: ${durations.editorial}s`);
  });

  it("carries the registry's easings as cubic-béziers", () => {
    expect(css).toContain(`--ease-enter: cubic-bezier(${easings.enter.join(", ")})`);
    expect(css).toContain(`--ease-standard: cubic-bezier(${easings.standard.join(", ")})`);
  });

  it("carries the stagger between revealed siblings", () => {
    expect(css).toContain(`--reveal-stagger: ${stagger.relaxed}s`);
  });

  it("carries the copy's line reveal", () => {
    expect(css).toContain(`--line-duration: ${durations.line}s`);
    expect(css).toContain(`--ease-rise: cubic-bezier(${easings.rise.join(", ")})`);
    expect(css).toContain(`--line-stagger: ${stagger.line}s`);
  });
});
