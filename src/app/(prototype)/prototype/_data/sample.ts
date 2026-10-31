// Hardcoded sample data for the low-fidelity prototypes only. Nothing here is real or persisted.
// Delete with the rest of src/app/(prototype) before release (RAID).

export type Priority = "Urgent" | "High" | "Normal";
export type Sentiment = "Upset" | "Neutral" | "Calm";
export type CustomerStatus = "Received" | "In progress" | "Replied";
export type EditLevel = "none" | "minor" | "major";

export const CATEGORIES = [
  "Payment & billing",
  "Delivery",
  "Returns & refunds",
  "Product question",
  "Account",
  "Other",
] as const;
export type Category = (typeof CATEGORIES)[number];

export const PRIORITIES: readonly Priority[] = ["Urgent", "High", "Normal"];

export type FaqEntry = { id: string; title: string; body: string };

export const FAQ: readonly FaqEntry[] = [
  {
    id: "FAQ 1",
    title: "Changing or cancelling an order",
    body: "Orders can be changed or cancelled within 1 hour of being placed from the order page. After that, the order is packed and you can return it once it arrives.",
  },
  {
    id: "FAQ 2",
    title: "Delivery times",
    body: "Standard delivery takes 3–5 working days. Express delivery takes 1–2 working days when ordered before 2 pm.",
  },
  {
    id: "FAQ 3",
    title: "Refund timelines",
    body: "Refunds are issued to the original payment method within 2 working days of approval. Banks can take a further 3–5 working days to show the money.",
  },
  {
    id: "FAQ 4",
    title: "Parcel not arrived",
    body: "If tracking shows delivered but you have no parcel, check with neighbours and your safe place. If it hasn't turned up after 48 hours, we open a claim with the courier and send a replacement or refund.",
  },
  {
    id: "FAQ 5",
    title: "Returns policy",
    body: "You can return unworn items within 30 days. Print a free returns label from your order page and drop the parcel at any partner shop.",
  },
  {
    id: "FAQ 6",
    title: "Size guide",
    body: "Our jackets follow standard UK sizing. If you're between sizes, choose the larger size for layering. Each product page shows chest and sleeve measurements.",
  },
  {
    id: "FAQ 7",
    title: "Duplicate charges",
    body: "A second charge is usually a temporary authorisation hold that disappears within 3 working days. If both charges have completed, we refund the duplicate in full.",
  },
  {
    id: "FAQ 8",
    title: "Signing in to your account",
    body: "Use 'Forgot password' on the sign-in page to get a reset link. Links expire after 30 minutes.",
  },
];

export type Triage = {
  category: Category;
  priority: Priority;
  sentiment: Sentiment;
  /** Model confidence 0–1 per label. Word bands per UX-1. */
  confidence: { category: number; priority: number; sentiment: number };
  reason: string;
  /** Only produced when the description is over the summary threshold (UX-2). */
  summary?: string;
  /** null = no draft (non-English, no FAQ match). */
  draft: string | null;
  sources: string[];
  flag?: "non-english" | "no-faq-match";
  confirmedBy?: string;
};

export type SentReply = {
  agent: string;
  sentAt: string;
  body: string;
  editLevel: EditLevel;
};

export type Ticket = {
  ref: string;
  token: string;
  subject: string;
  description: string;
  customerFirstName: string;
  customerFullName: string;
  customerEmail: string;
  receivedAt: string;
  age: string;
  status: CustomerStatus;
  /** null = AI unavailable after retry: "Needs triage" (US-09). */
  triage: Triage | null;
  reply?: SentReply;
  rating?: { score: number; comment?: string };
  labelHistory?: string[];
  contactReveals?: string[];
};

export const AGENT = { firstName: "Daniel", fullName: "Daniel Kim", email: "daniel@larkfield.example" };
export const LEAD = { firstName: "Priya", fullName: "Priya Shah", email: "priya@larkfield.example" };

export const SUMMARY_WORD_THRESHOLD = 125; // UX-2

export function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function confidenceWord(value: number): "High" | "Medium" | "Low" {
  // UX-1 bands: High >= 0.85, Medium 0.60–0.85, Low < 0.60.
  if (value >= 0.85) return "High";
  if (value >= 0.6) return "Medium";
  return "Low";
}

export function isLowConfidence(triage: Triage): boolean {
  return Math.min(triage.confidence.category, triage.confidence.priority) < 0.6;
}

export const TICKETS: readonly Ticket[] = [
  {
    ref: "HD-24817",
    token: "9fK2xQ7pLmV4",
    subject: "Charged twice for my order",
    description:
      "Hi, I ordered a rain jacket on Monday (order 5521) and my bank app shows two payments of £89.00 to Larkfield Goods on the same day. I only placed one order and only got one confirmation email. Money is tight this month so I really need the second payment back as soon as possible. Can you please check and refund it?",
    customerFirstName: "Sofia",
    customerFullName: "Sofia Marin",
    customerEmail: "sofia.marin@example.com",
    receivedAt: "30 Oct, 10:42",
    age: "4m",
    status: "In progress",
    triage: {
      category: "Payment & billing",
      priority: "Urgent",
      sentiment: "Upset",
      confidence: { category: 0.96, priority: 0.88, sentiment: 0.9 },
      reason: "Two identical charges for one order, and the customer says money is tight.",
      draft:
        "Hi Sofia,\n\nI'm sorry about the double charge on order 5521. A second payment is often a temporary hold that your bank removes within 3 working days. I've checked your order and only one payment was taken by us, so the second one should disappear on its own.\n\nIf it's still showing as completed after 3 working days, reply here and we'll refund it in full straight away. Refunds reach your original payment method within 2 working days, and your bank may take a few more days to show it.\n\nBest wishes,\nDaniel",
      sources: ["FAQ 7", "FAQ 3"],
    },
  },
  {
    ref: "HD-24811",
    token: "Tr8wPq2nZc6Y",
    subject: "Parcel never arrived",
    description:
      "Tracking says my parcel was delivered yesterday at 2pm but there's nothing here. I've checked with both neighbours and the bin store. Order 5490.",
    customerFirstName: "Tom",
    customerFullName: "Tom Okafor",
    customerEmail: "tom.okafor@example.com",
    receivedAt: "30 Oct, 10:24",
    age: "22m",
    status: "In progress",
    triage: {
      category: "Delivery",
      priority: "High",
      sentiment: "Neutral",
      confidence: { category: 0.97, priority: 0.81, sentiment: 0.91 },
      reason: "Marked as delivered but not received; the customer has already checked with neighbours.",
      draft:
        "Hi Tom,\n\nI'm sorry your parcel hasn't turned up. Thanks for already checking with your neighbours. If it hasn't arrived within 48 hours of the delivery scan, we'll open a claim with the courier and send you a replacement or a refund, whichever you prefer.\n\nI'll check back tomorrow afternoon and let you know.\n\nBest wishes,\nDaniel",
      sources: ["FAQ 4"],
      confirmedBy: "Amara",
    },
  },
  {
    ref: "HD-24809",
    token: "Nd3kLs9vQe2B",
    subject: "Discount code not working",
    description:
      "I tried the code AUTUMN15 from your newsletter at checkout and it says it's not valid. The email says it's valid until the end of October.",
    customerFirstName: "Grace",
    customerFullName: "Grace Lee",
    customerEmail: "grace.lee@example.com",
    receivedAt: "30 Oct, 10:15",
    age: "31m",
    status: "Received",
    triage: null,
  },
  {
    ref: "HD-24805",
    token: "Jc7mWx4tHb8R",
    subject: "Which size jacket should I get?",
    description:
      "Hello, I'm looking at the Hartley waxed jacket in olive and I can't decide between a medium and a large. I'm usually a medium in most shops, but I've found that some brands come up quite small across the shoulders, and I'd like to be able to wear a thick jumper underneath it in winter. My chest measurement is about 40 inches and my arms are on the long side, so sleeve length matters to me too. I looked at the size chart on the product page but it lists the garment measurements rather than body measurements, so I'm not sure how much room to allow. I'd rather not have to send it back if I can avoid it, because I live quite far from a drop-off shop. Thanks for any help you can give.",
    customerFirstName: "Owen",
    customerFullName: "Owen Price",
    customerEmail: "owen.price@example.com",
    receivedAt: "30 Oct, 09:46",
    age: "1h",
    status: "In progress",
    triage: {
      category: "Product question",
      priority: "Normal",
      sentiment: "Calm",
      confidence: { category: 0.55, priority: 0.83, sentiment: 0.49 },
      reason: "Asks for sizing advice before buying; it could also be read as a returns question.",
      summary:
        "Choosing between medium and large in the Hartley jacket: 40\" chest, long arms, wants room for a jumper, and wants to avoid a return.",
      draft:
        "Hi Owen,\n\nThanks for getting in touch. Our jackets follow standard UK sizing. As you're between sizes and want room for a thick jumper, we'd suggest the large. The product page shows the chest and sleeve measurements for each size, so you can compare them with a jacket you already own.\n\nBest wishes,\nDaniel",
      sources: ["FAQ 6"],
    },
  },
  {
    ref: "HD-24802",
    token: "Qa5zRt1yUo9K",
    subject: "Returning a pair of boots",
    description:
      "Hi there, I bought the Ashby leather boots two weeks ago and unfortunately they rub badly on my left heel, even after wearing them around the house for a few evenings with thick socks. I've only worn them indoors and they are still in the original box with all the tags and paper. I'd like to return them for a refund rather than an exchange, as I don't think a different size would solve the problem. Could you tell me how to arrange the return, whether I need to print anything, and how long it usually takes for the money to come back to my card? Many thanks for your help.",
    customerFirstName: "Hannah",
    customerFullName: "Hannah Clarke",
    customerEmail: "hannah.clarke@example.com",
    receivedAt: "30 Oct, 09:30",
    age: "1h",
    status: "In progress",
    triage: {
      category: "Returns & refunds",
      priority: "Normal",
      sentiment: "Calm",
      confidence: { category: 0.94, priority: 0.9, sentiment: 0.88 },
      reason: "Wants to return unworn boots for a refund within the 30-day window.",
      draft:
        "Hi Hannah,\n\nI'm sorry the boots aren't comfortable. As they're unworn and within 30 days, you can return them for a full refund. Print a free returns label from your order page and drop the parcel at any partner shop.\n\nOnce we've approved the return, the refund goes back to your card within 2 working days. Your bank may take a further 3–5 working days to show it.\n\nBest wishes,\nDaniel",
      sources: ["FAQ 5", "FAQ 3"],
    },
  },
  {
    ref: "HD-24799",
    token: "Lm2bVc8xNs4E",
    subject: "Pedido incompleto",
    description:
      "Hola, recibí mi pedido 5470 pero falta la bufanda de lana. En la caja solo venían el gorro y los guantes. ¿Me pueden enviar la bufanda?",
    customerFirstName: "Lucía",
    customerFullName: "Lucía Fernández",
    customerEmail: "lucia.fernandez@example.com",
    receivedAt: "30 Oct, 09:12",
    age: "2h",
    status: "In progress",
    triage: {
      category: "Delivery",
      priority: "Normal",
      sentiment: "Neutral",
      confidence: { category: 0.78, priority: 0.74, sentiment: 0.72 },
      reason: "Spanish-language message about an item missing from a delivered order.",
      draft: null,
      sources: [],
      flag: "non-english",
    },
  },
  {
    ref: "HD-24795",
    token: "Wy6hFd3gPk1M",
    subject: "Can you engrave a gift message?",
    description:
      "I'd like to buy a leather wallet as a birthday present. Is it possible to have initials engraved on it, and if so how much does that cost?",
    customerFirstName: "Marcus",
    customerFullName: "Marcus Bell",
    customerEmail: "marcus.bell@example.com",
    receivedAt: "30 Oct, 08:58",
    age: "2h",
    status: "In progress",
    triage: {
      category: "Product question",
      priority: "Normal",
      sentiment: "Calm",
      confidence: { category: 0.91, priority: 0.92, sentiment: 0.85 },
      reason: "Asks about engraving, which no FAQ entry covers.",
      draft: null,
      sources: [],
      flag: "no-faq-match",
    },
  },
  {
    ref: "HD-24790",
    token: "Ps4nGv7cXr2D",
    subject: "Wrong colour sent",
    description: "I ordered the scarf in navy but received a grey one. Order 5432. Can I swap it?",
    customerFirstName: "Aisha",
    customerFullName: "Aisha Khan",
    customerEmail: "aisha.khan@example.com",
    receivedAt: "29 Oct, 16:20",
    age: "1d",
    status: "Replied",
    triage: {
      category: "Returns & refunds",
      priority: "Normal",
      sentiment: "Neutral",
      confidence: { category: 0.89, priority: 0.86, sentiment: 0.83 },
      reason: "Received the wrong colour and wants to exchange it.",
      draft:
        "Hi Aisha,\n\nI'm sorry we sent the wrong colour. You can return the grey scarf with a free label from your order page, and we'll send the navy one once it arrives.\n\nBest wishes,\nDaniel",
      sources: ["FAQ 5"],
      confirmedBy: "Daniel",
    },
    reply: {
      agent: "Daniel",
      sentAt: "29 Oct, 16:48",
      body: "Hi Aisha,\n\nI'm sorry we sent the wrong colour. I've arranged for a navy scarf to go out today by express delivery, and there's no need to send the grey one back.\n\nBest wishes,\nDaniel",
      editLevel: "major",
    },
    labelHistory: ["29 Oct 16:21 · AI suggested Returns & refunds / Normal", "29 Oct 16:45 · Confirmed by Daniel"],
    contactReveals: [],
  },
  {
    ref: "HD-24788",
    token: "Zk9qBt5mLw3H",
    subject: "Reset password email",
    description: "I asked for a password reset but the email never arrived. I've checked my spam folder.",
    customerFirstName: "Ben",
    customerFullName: "Ben Turner",
    customerEmail: "ben.turner@example.com",
    receivedAt: "29 Oct, 14:02",
    age: "1d",
    status: "Replied",
    triage: {
      category: "Account",
      priority: "Normal",
      sentiment: "Neutral",
      confidence: { category: 0.95, priority: 0.9, sentiment: 0.89 },
      reason: "Password reset email not received.",
      draft:
        "Hi Ben,\n\nSorry about that. Use 'Forgot password' on the sign-in page to get a new reset link. Links expire after 30 minutes.\n\nBest wishes,\nAmara",
      sources: ["FAQ 8"],
      confirmedBy: "Amara",
    },
    reply: {
      agent: "Amara",
      sentAt: "29 Oct, 14:30",
      body: "Hi Ben,\n\nSorry about that. I've sent a new reset link, which lasts 30 minutes. If it still doesn't arrive, reply here and I'll update your account directly.\n\nBest wishes,\nAmara",
      editLevel: "minor",
    },
    rating: { score: 4, comment: "Quick, thanks." },
    labelHistory: ["29 Oct 14:03 · AI suggested Account / Normal", "29 Oct 14:28 · Confirmed by Amara"],
    contactReveals: ["29 Oct 14:25 · Amara"],
  },
];

/** Arrives when the agent clicks Refresh on the "new urgent ticket" notice (UX-3). */
export const INCOMING_URGENT: Ticket = {
  ref: "HD-24820",
  token: "Ux1cVb6nMa8S",
  subject: "Account locked after payment",
  description: "My account was locked straight after I paid and I can't see my order. I've been charged £240.",
  customerFirstName: "Ella",
  customerFullName: "Ella Novak",
  customerEmail: "ella.novak@example.com",
  receivedAt: "30 Oct, 10:47",
  age: "now",
  status: "Received",
  triage: {
    category: "Account",
    priority: "Urgent",
    sentiment: "Upset",
    confidence: { category: 0.86, priority: 0.91, sentiment: 0.8 },
    reason: "Charged a large amount and locked out of the account.",
    draft:
      "Hi Ella,\n\nI'm sorry you've been locked out straight after paying. Your payment and order are safe. Use 'Forgot password' on the sign-in page to get a reset link (it lasts 30 minutes), and I'll check the order on our side in the meantime.\n\nBest wishes,\nDaniel",
    sources: ["FAQ 8"],
  },
};

export function findByRef(ref: string): Ticket | undefined {
  return TICKETS.find((t) => t.ref === ref);
}

export function findByToken(token: string): Ticket | undefined {
  return TICKETS.find((t) => t.token === token);
}

/** Queue sort (S5): Urgent → High (incl. Needs triage, treated as High) → Normal; oldest first. */
export function effectivePriority(t: Ticket): Priority {
  return t.triage?.priority ?? "High";
}

export function sortQueue(tickets: readonly Ticket[]): Ticket[] {
  const rank: Record<Priority, number> = { Urgent: 0, High: 1, Normal: 2 };
  // Sample data is listed newest first, so a stable reverse keeps oldest first within a level.
  return [...tickets]
    .reverse()
    .sort((a, b) => rank[effectivePriority(a)] - rank[effectivePriority(b)]);
}

/** Arrive when the agent clicks Refresh on the "3 new tickets" notice (UX-3). */
export const INCOMING_NEW: readonly Ticket[] = [
  ["HD-24821", "Gift card balance", "How do I check how much is left on my gift card?", "Nina", "Account", 0.88],
  ["HD-24822", "Change delivery address", "I've just ordered but used my old address. Can you change it to my new one?", "Raj", "Delivery", 0.93],
  ["HD-24823", "Do you ship to Ireland?", "Thinking of ordering a coat. Do you deliver to Dublin and how long does it take?", "Cara", "Delivery", 0.9],
].map(([ref, subject, description, first, category, conf], i) => ({
  ref: ref as string,
  token: `NewSample${i}xQ`,
  subject: subject as string,
  description: description as string,
  customerFirstName: first as string,
  customerFullName: `${first as string} Sample`,
  customerEmail: `${(first as string).toLowerCase()}@example.com`,
  receivedAt: "30 Oct, 10:46",
  age: "now",
  status: "Received" as const,
  triage: {
    category: category as Category,
    priority: "Normal" as const,
    sentiment: "Calm" as const,
    confidence: { category: conf as number, priority: 0.9, sentiment: 0.85 },
    reason: "Routine question.",
    draft: null,
    sources: [],
    flag: "no-faq-match" as const,
  },
}));
