import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Button } from "./button";

// Proves the unit setup handles JSX and the DOM before stories rely on it.
describe("Button", () => {
  it("renders an accessible button", () => {
    render(<Button>Submit ticket</Button>);
    expect(screen.getByRole("button", { name: "Submit ticket" })).toBeDefined();
  });

  it("starts each test with a clean DOM", () => {
    expect(screen.queryByRole("button")).toBeNull();
  });
});
