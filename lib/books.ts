export type Book = {
  id: string;
  title: string;
  author: string;
  category: string;
  cover: string;
  sourceUrl: string;
  sourceLabel: string;
  summary: string;
  ideas: { heading: string; body: string }[];
};

export const books: Book[] = [
  {
    id: 'atomic-habits', title: 'Atomic Habits', author: 'James Clear', category: 'Psychology',
    cover: 'https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg', sourceUrl: 'https://jamesclear.com/atomic-habits', sourceLabel: 'View the official book',
    summary: 'A practical system for building better habits through small, repeatable changes. The central idea is that lasting improvement comes less from ambitious goals than from shaping the systems, cues, and environments that guide everyday behavior.',
    ideas: [
      { heading: 'Small changes compound', body: 'Tiny improvements can appear insignificant in a single day, yet their effects accumulate. The same compounding works in reverse when small harmful choices are repeated.' },
      { heading: 'Build identity-based habits', body: 'Start with the person you want to become, then use each action as evidence for that identity. “I am becoming a reader” is more durable than merely setting a goal to finish a book.' },
      { heading: 'Design the environment', body: 'Make useful cues visible and good actions easy. Add friction to unwanted behavior. A well-designed environment reduces the amount of motivation and willpower a habit requires.' },
    ],
  },
  {
    id: 'thinking-fast-and-slow', title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', category: 'Decision-making',
    cover: 'https://covers.openlibrary.org/b/isbn/9780374533557-L.jpg', sourceUrl: 'https://www.penguinrandomhouse.com/books/89308/thinking-fast-and-slow-by-daniel-kahneman/', sourceLabel: 'View at Penguin Random House',
    summary: 'An exploration of two modes of thought: fast, intuitive judgment and slow, effortful reasoning. Kahneman shows how useful mental shortcuts can also produce predictable errors in confidence, probability, and choice.',
    ideas: [
      { heading: 'Two systems shape judgment', body: 'Fast thinking produces quick impressions with little effort. Slow thinking checks evidence and handles complexity, but it is effortful and often accepts the fast system’s first answer.' },
      { heading: 'Bias is systematic', body: 'Anchoring, availability, and loss aversion are not random mistakes. They are recurring patterns that can be anticipated when decisions are designed and reviewed.' },
      { heading: 'Confidence is not accuracy', body: 'A coherent story can feel true even when evidence is incomplete. Better decisions separate the strength of a narrative from the quality and amount of supporting information.' },
    ],
  },
  {
    id: 'sapiens', title: 'Sapiens', author: 'Yuval Noah Harari', category: 'History',
    cover: 'https://covers.openlibrary.org/b/isbn/9780062316097-L.jpg', sourceUrl: 'https://www.ynharari.com/book/sapiens/', sourceLabel: 'View the official book',
    summary: 'A sweeping account of human history that asks how one primate species came to organize societies, build institutions, and reshape the planet. Its unifying theme is the power of shared stories to coordinate people at enormous scale.',
    ideas: [
      { heading: 'Cooperation changed the scale', body: 'Language and shared beliefs allowed humans to cooperate beyond small kin groups. Laws, money, nations, and companies work because many people accept common frameworks.' },
      { heading: 'Agriculture changed society', body: 'Farming supported larger populations and permanent settlements, while also creating demanding routines, hierarchies, and new forms of dependence.' },
      { heading: 'Progress has tradeoffs', body: 'Technological and economic growth do not automatically create individual well-being. The book repeatedly asks who gains, who pays, and how success should be measured.' },
    ],
  },
  {
    id: 'factfulness', title: 'Factfulness', author: 'Hans Rosling', category: 'Science',
    cover: 'https://covers.openlibrary.org/b/isbn/9781250107817-L.jpg', sourceUrl: 'https://www.gapminder.org/factfulness-book/', sourceLabel: 'View at Gapminder',
    summary: 'A guide to replacing dramatic assumptions about the world with a fact-based outlook. Rosling explains the instincts that distort our judgment and offers habits for checking scale, trends, risk, and uncertainty.',
    ideas: [
      { heading: 'The world is not simply divided', body: 'Binary labels such as developed and developing hide a wide range of living conditions. Looking at income levels and distributions produces a more accurate picture.' },
      { heading: 'Bad and better can coexist', body: 'A problem can remain serious while conditions improve. Recognizing progress does not mean ignoring suffering; it helps identify which interventions are working.' },
      { heading: 'Compare before reacting', body: 'Dramatic numbers need a denominator, a time horizon, and a relevant comparison. Rates and trends are usually more informative than isolated totals.' },
    ],
  },
  {
    id: 'the-psychology-of-money', title: 'The Psychology of Money', author: 'Morgan Housel', category: 'Finance',
    cover: 'https://covers.openlibrary.org/b/isbn/9780857197689-L.jpg', sourceUrl: 'https://www.harriman-house.com/psychologyofmoney', sourceLabel: 'View at Harriman House',
    summary: 'A collection of lessons about how emotion, personal history, incentives, and luck shape financial decisions. Its focus is not technical optimization, but the behaviors that help wealth endure over time.',
    ideas: [
      { heading: 'Behavior matters', body: 'Financial outcomes depend on patience, expectations, and the ability to remain consistent. Intelligence alone cannot protect a plan from fear, envy, or overconfidence.' },
      { heading: 'Leave room for error', body: 'A margin of safety makes a plan resilient when the future differs from the forecast. Survival preserves the ability to benefit from compounding.' },
      { heading: 'Define enough', body: 'Goals become dangerous when every gain immediately raises the amount required for satisfaction. Knowing what is sufficient protects both wealth and autonomy.' },
    ],
  },
  {
    id: 'the-design-of-everyday-things', title: 'The Design of Everyday Things', author: 'Don Norman', category: 'Design',
    cover: 'https://covers.openlibrary.org/b/isbn/9780465050659-L.jpg', sourceUrl: 'https://www.basicbooks.com/titles/don-norman/the-design-of-everyday-things/9780465072996/', sourceLabel: 'View at Basic Books',
    summary: 'A foundational explanation of why products become confusing and how thoughtful design makes possible actions visible, understandable, and forgiving. Norman shifts blame from users toward the systems they must operate.',
    ideas: [
      { heading: 'Make actions discoverable', body: 'Good interfaces reveal what can be done and how to do it. Clear signifiers reduce guessing and help users form an accurate mental model.' },
      { heading: 'Feedback closes the loop', body: 'Every action should produce a timely, understandable result. Without feedback, people cannot tell whether the system received their input or what changed.' },
      { heading: 'Design for mistakes', body: 'Errors are often predictable consequences of a system. Constraints, undo, confirmation, and safe defaults keep ordinary slips from becoming costly failures.' },
    ],
  },
];

export const getBook = (id?: string) => books.find((book) => book.id === id);
