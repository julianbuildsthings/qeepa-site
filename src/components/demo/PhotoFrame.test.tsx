// @vitest-environment happy-dom
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { PhotoFrame } from "@/components/demo/PhotoFrame";
import { photos } from "@/lib/photos";
import { pipFilled } from "@/lib/tones";

const PHOTO = photos.jubs0079;

const pips = (container: HTMLElement) =>
  [...container.querySelectorAll("span")].filter((node) =>
    node.className.includes("rounded-[1px]"),
  );

describe("PhotoFrame", () => {
  it("renders the bare photo when given no metadata", () => {
    const { container } = render(<PhotoFrame src={PHOTO} />);
    expect(container.querySelectorAll("span")).toHaveLength(0);
    expect(container.querySelector("img")).toHaveAttribute("src", PHOTO);
  });

  it("loads lazily unless asked not to", () => {
    const lazy = render(<PhotoFrame src={PHOTO} />).container.querySelector("img");
    const eager = render(<PhotoFrame eager src={PHOTO} />).container.querySelector("img");
    expect(lazy).toHaveAttribute("loading", "lazy");
    expect(eager).toHaveAttribute("loading", "eager");
  });

  it("sets each piece of chrome on a backing, so it reads over any photo", () => {
    const { container } = render(<PhotoFrame frameNumber={4821} rating={3} src={PHOTO} />);
    const number = [...container.querySelectorAll("span")].find(
      (node) => node.textContent === "4821",
    );
    const pips = container.querySelector(".flex");
    expect(number?.className).toContain("backdrop-blur");
    expect(pips?.className).toContain("backdrop-blur");
  });

  it("stays hidden from assistive technology", () => {
    const { container } = render(<PhotoFrame src={PHOTO} />);
    expect(container.firstElementChild).toHaveAttribute("aria-hidden", "true");
  });

  it("shows five pips, filled to the rating", () => {
    const { container } = render(<PhotoFrame rating={3} src={PHOTO} />);
    const all = pips(container);
    expect(all).toHaveLength(5);
    const filled = all.filter((node) => node.style.backgroundColor === pipFilled);
    expect(filled).toHaveLength(3);
  });

  it("shows no pips at all when unrated, rather than five empty ones", () => {
    const { container } = render(<PhotoFrame rating={null} src={PHOTO} />);
    expect(pips(container)).toHaveLength(0);
  });

  it("colours the track dot by track", () => {
    const { container } = render(<PhotoFrame src={PHOTO} track="jpg" />);
    expect(container.querySelector(".bg-jpg")).not.toBeNull();
  });

  it("renders the frame number when given one", () => {
    const { container } = render(<PhotoFrame frameNumber={4821} src={PHOTO} />);
    expect(container.textContent).toContain("4821");
  });
});
