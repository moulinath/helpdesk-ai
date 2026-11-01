import { describe, expect, it } from "vitest";

import { TicketInputSchema, ticketFieldErrors } from "./schema";

const VALID = {
  name: "Sofia Marin",
  email: "sofia.marin@example.com",
  subject: "Charged twice for my order",
  description: "My bank shows two payments of £89.00 for order 5521.",
};

describe("TicketInputSchema (US-01 AC1)", () => {
  it("accepts a valid ticket and trims every field", () => {
    const parsed = TicketInputSchema.parse({ ...VALID, name: "  Sofia Marin  " });
    expect(parsed.name).toBe("Sofia Marin");
  });

  it("enforces subject 5–120 and description 20–5,000 characters, after trimming", () => {
    expect(TicketInputSchema.safeParse({ ...VALID, subject: "Help" }).success).toBe(false);
    expect(TicketInputSchema.safeParse({ ...VALID, subject: "Help!" }).success).toBe(true);
    expect(TicketInputSchema.safeParse({ ...VALID, subject: "x".repeat(121) }).success).toBe(false);
    expect(TicketInputSchema.safeParse({ ...VALID, description: `   ${"x".repeat(19)}   ` }).success).toBe(false);
    expect(TicketInputSchema.safeParse({ ...VALID, description: "x".repeat(20) }).success).toBe(true);
    expect(TicketInputSchema.safeParse({ ...VALID, description: "x".repeat(5001) }).success).toBe(false);
  });
});

describe("ticketFieldErrors (US-01 AC2)", () => {
  it("returns no errors for valid input", () => {
    expect(ticketFieldErrors(VALID)).toEqual({});
  });

  it("gives one plain-language message per field", () => {
    expect(ticketFieldErrors({ name: "", email: "sofia@", subject: "Help", description: "Charged twice" })).toEqual({
      name: "Please enter your name.",
      email: "Please enter an email address like name@example.com.",
      subject: "Please make the subject a little longer (at least 5 characters).",
      description: "Please add a bit more detail (at least 20 characters).",
    });
  });

  it("says a field is missing rather than too short when it's empty", () => {
    expect(ticketFieldErrors({ ...VALID, subject: "   " }).subject).toBe("Please enter your subject.");
  });
});
