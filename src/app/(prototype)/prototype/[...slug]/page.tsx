import { notFound } from "next/navigation";

// Any unmatched /prototype/* URL gets the S8 page rather than Next's default 404.
export default function CatchAll() {
  notFound();
}
