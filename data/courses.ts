import { feed, paths } from "@/data/content";

export type PathId = keyof typeof paths;
type LessonDetail = { core: string; mechanism: string; application: string };

const detail = (
  core: string,
  mechanism: string,
  application: string,
): LessonDetail => ({ core, mechanism, application });
const curriculum: Record<PathId, LessonDetail[]> = {
  ai: [
    detail(
      "Artificial intelligence is software designed to perform tasks that normally require human judgment.",
      "AI systems turn inputs into outputs by applying rules or patterns learned from examples.",
      "Recommendation systems use AI to rank the items most relevant to a person.",
    ),
    detail(
      "Machine learning lets a system improve from data instead of relying only on hand-written rules.",
      "Training adjusts a model to reduce the difference between its predictions and known answers.",
      "A spam filter learns from messages labeled as spam or safe.",
    ),
    detail(
      "A neural network is a layered model that learns useful representations from examples.",
      "Training changes connection weights so later layers can recognize increasingly complex patterns.",
      "Image recognition networks build from edges to shapes and then objects.",
    ),
    detail(
      "A transformer connects each part of a sequence to the other parts that matter most.",
      "Attention assigns changing importance to tokens based on their context.",
      "A transformer can resolve what “it” refers to by attending to earlier words.",
    ),
    detail(
      "A large language model predicts and generates language using patterns learned from vast text collections.",
      "It produces one token at a time while conditioning each choice on the preceding context.",
      "LLMs can summarize, translate, explain, and draft text from instructions.",
    ),
    detail(
      "An AI agent combines a model with goals, memory, and tools to complete multi-step work.",
      "The agent plans, acts, checks results, and revises until it reaches a stopping condition.",
      "A research agent can search sources, compare evidence, and assemble a report.",
    ),
  ],
  finance: [
    detail(
      "Money is a shared medium of exchange, a unit of account, and a way to store value.",
      "Trust and scarcity allow money to coordinate transactions across time.",
      "Prices expressed in one currency make unlike products easy to compare.",
    ),
    detail(
      "Banks connect savers who supply capital with borrowers who need it.",
      "They transform short-term deposits into loans while managing liquidity and credit risk.",
      "A mortgage turns pooled deposits and bank funding into long-term housing credit.",
    ),
    detail(
      "A stock represents a fractional ownership claim on a company.",
      "Its value reflects expected future cash flows, risk, and what investors are willing to pay today.",
      "Shareholders can benefit from dividends and growth in the company’s value.",
    ),
    detail(
      "A bond is a loan that promises scheduled interest and principal payments.",
      "Bond prices generally move opposite to market interest rates because existing payments are fixed.",
      "Governments issue bonds to finance projects over long periods.",
    ),
    detail(
      "An interest rate is the price paid to use money over time.",
      "Rates influence borrowing, saving, asset values, and demand throughout an economy.",
      "Lower mortgage rates can make the same home payment support a larger loan.",
    ),
    detail(
      "Valuation estimates what an asset is worth from the cash it may generate and the risk involved.",
      "Future cash flows are discounted because money today is more useful and certain.",
      "Investors compare a company’s market price with an estimate of its intrinsic value.",
    ),
    detail(
      "Risk is the possibility that an outcome differs materially from what was expected.",
      "Diversification reduces exposure to any one source of uncertainty but cannot remove all risk.",
      "Holding many companies is less fragile than depending on one stock.",
    ),
    detail(
      "An option gives its buyer the right, but not the obligation, to trade an asset at a set price.",
      "Its value depends on price, time, volatility, rates, and the strike price.",
      "A protective put can limit the downside of owning a stock.",
    ),
  ],
  history: [
    detail(
      "Ancient civilizations formed when agriculture supported dense settlements and specialized work.",
      "Surplus food enabled governments, trade, writing, and organized religion to develop.",
      "River valleys supported early cities in Mesopotamia, Egypt, India, and China.",
    ),
    detail(
      "Ancient Greece linked independent city-states through language, trade, and shared culture.",
      "Competition among poleis produced different political systems and intellectual traditions.",
      "Athens developed direct civic participation while Sparta organized around military power.",
    ),
    detail(
      "Rome grew by combining military force, infrastructure, law, and selective citizenship.",
      "Roads and institutions helped govern a vast territory while integrating conquered peoples.",
      "Roman legal ideas continued to influence states long after the empire divided.",
    ),
    detail(
      "The medieval world was a network of kingdoms, faiths, cities, and trade routes rather than an isolated age.",
      "Landholding, religious authority, and commerce distributed power across overlapping institutions.",
      "Long-distance trade connected Europe with Africa and Asia.",
    ),
    detail(
      "The Industrial Revolution shifted production from human craft toward powered machinery and factories.",
      "Fossil energy, capital, and mechanization sharply increased output and urbanization.",
      "Textile mills concentrated workers and machines in new industrial cities.",
    ),
    detail(
      "The world wars were industrial conflicts shaped by alliances, nationalism, empire, and mass mobilization.",
      "Technology expanded the scale of destruction while total war drew civilian economies into combat.",
      "Their aftermath redrew borders and created new international institutions.",
    ),
  ],
  science: [
    detail(
      "The scientific method tests explanations against observable evidence.",
      "Questions lead to hypotheses, predictions, controlled tests, and revision.",
      "A result becomes stronger when independent teams can reproduce it.",
    ),
    detail(
      "Matter is anything with mass that occupies space and is built from atoms.",
      "Atomic structure and bonding determine a material’s physical and chemical properties.",
      "Water behaves differently from its elements because bonded atoms create new properties.",
    ),
    detail(
      "Energy is the capacity to cause change and can transfer between systems.",
      "Energy changes form while total energy remains conserved in a closed system.",
      "A falling object converts gravitational potential energy into motion.",
    ),
    detail(
      "Life maintains organization by using energy, storing information, and reproducing.",
      "Cells regulate chemical reactions and copy genetic instructions across generations.",
      "Natural selection changes populations when inherited traits affect reproduction.",
    ),
    detail(
      "Earth systems link the atmosphere, oceans, rocks, ice, and living organisms.",
      "Matter and energy circulate through cycles that operate on different timescales.",
      "Ocean currents redistribute heat and influence regional climate.",
    ),
    detail(
      "The universe contains all space, time, matter, and energy and has expanded from a hotter, denser state.",
      "Gravity organizes matter into stars, galaxies, and large-scale structure.",
      "Light from distant galaxies lets astronomers observe the universe’s past.",
    ),
  ],
  business: [
    detail(
      "A customer is the person or organization whose problem a business chooses to solve.",
      "Understanding needs, alternatives, and willingness to pay guides product decisions.",
      "Interviews can reveal why people abandon a checkout process.",
    ),
    detail(
      "A business model explains how an organization creates, delivers, and captures value.",
      "Revenue, costs, channels, resources, and partners must reinforce one another.",
      "A subscription trades one-time purchases for recurring access.",
    ),
    detail(
      "Operations turn resources into reliable products and services.",
      "Process design manages capacity, quality, inventory, time, and variation.",
      "A restaurant kitchen sequences work so meals arrive together.",
    ),
    detail(
      "Strategy is a coherent set of choices about where to compete and how to win.",
      "Tradeoffs concentrate resources on an advantage competitors cannot easily copy.",
      "A low-cost airline simplifies service to keep aircraft productive.",
    ),
    detail(
      "Growth expands value by reaching more customers, increasing use, or adding complementary offerings.",
      "Sustainable growth requires demand, operational capacity, and sound unit economics.",
      "A marketplace grows faster when each new participant benefits the others.",
    ),
    detail(
      "Leadership aligns people around direction, decisions, and standards.",
      "Clear context and accountability let teams act without waiting for constant approval.",
      "A leader explains the goal and constraints while delegating the method.",
    ),
  ],
  technology: [
    detail(
      "Computing represents information and transforms it through precise operations.",
      "Processors execute instructions while memory holds data and active state.",
      "An app converts a tap into calculations, stored changes, and pixels.",
    ),
    detail(
      "Networks let devices exchange data through shared protocols.",
      "Information is divided into packets that can travel across multiple links and routes.",
      "Internet routing can send traffic around a failed connection.",
    ),
    detail(
      "Software is a structured set of instructions and data that produces behavior on hardware.",
      "Abstraction lets developers combine reliable components without managing every low-level detail.",
      "An operating system coordinates apps, storage, memory, and devices.",
    ),
    detail(
      "Security protects confidentiality, integrity, and availability against mistakes and attacks.",
      "Layered controls reduce risk through authentication, authorization, encryption, and monitoring.",
      "Multi-factor authentication limits damage from a stolen password.",
    ),
    detail(
      "Robotics joins sensing, computation, and physical action in a feedback loop.",
      "A robot measures its environment, chooses an action, and corrects based on the result.",
      "A warehouse arm uses vision to adjust its grip for unfamiliar objects.",
    ),
    detail(
      "Technology futures emerge from interacting advances, costs, rules, and human adoption.",
      "Forecasts improve when they separate technical possibility from economic and social feasibility.",
      "A powerful invention may spread slowly if infrastructure is missing.",
    ),
  ],
  psychology: [
    detail(
      "Perception is the brain’s interpretation of sensory signals, not a direct copy of reality.",
      "Expectations and context help the brain resolve incomplete or ambiguous input.",
      "The same color can look different against light and dark backgrounds.",
    ),
    detail(
      "Memory reconstructs prior experience through encoding, storage, and retrieval.",
      "Attention shapes what is encoded, while every retrieval can update the memory.",
      "A leading question can alter how a person later remembers an event.",
    ),
    detail(
      "Learning is a lasting change in knowledge or behavior produced by experience.",
      "Feedback strengthens useful associations and helps the brain update predictions.",
      "Spaced practice produces stronger retention than one long study session.",
    ),
    detail(
      "Emotion coordinates attention, physiology, interpretation, and action.",
      "The brain evaluates meaning and prepares the body to respond before reflection is complete.",
      "Anxiety can narrow attention toward possible threats.",
    ),
    detail(
      "A habit is a behavior triggered automatically by a familiar context.",
      "Repeated cue-response pairings reduce the need for deliberate choice.",
      "Placing running shoes by the door can make exercise easier to initiate.",
    ),
    detail(
      "Decision making combines goals, evidence, uncertainty, and mental shortcuts.",
      "People compare imperfect options using both deliberate reasoning and fast heuristics.",
      "Framing the same outcome as a gain or loss can change a choice.",
    ),
  ],
  space: [
    detail(
      "The solar system contains the Sun and the objects held in orbit by its gravity.",
      "Differences in distance, composition, and formation history created distinct planets.",
      "Rocky planets formed mainly inside the hotter inner solar system.",
    ),
    detail(
      "A star is a self-gravitating sphere powered by nuclear fusion.",
      "Fusion balances gravitational collapse while producing light and heavier elements.",
      "A star’s mass largely determines its lifetime and final state.",
    ),
    detail(
      "A galaxy is a gravitational system of stars, gas, dust, and dark matter.",
      "Galaxies grow through star formation, gas inflow, and mergers.",
      "The Milky Way is a barred spiral galaxy with billions of stars.",
    ),
    detail(
      "Gravity is the curvature of spacetime produced by mass and energy.",
      "Objects follow paths through that curvature, creating orbits and falling motion.",
      "The Moon continually falls around Earth rather than escaping or hitting it.",
    ),
    detail(
      "Spaceflight requires enough velocity and energy to follow a desired path beyond Earth.",
      "Rockets expel mass backward, producing thrust that changes momentum.",
      "Orbital insertion turns an upward launch into sustained sideways motion.",
    ),
    detail(
      "Cosmology studies the origin, structure, expansion, and fate of the universe.",
      "Observations of light, matter, and expansion test models of cosmic history.",
      "The cosmic microwave background preserves evidence from the early universe.",
    ),
  ],
  cooking: [
    detail(
      "Heat drives the physical and chemical changes that turn ingredients into food.",
      "Conduction, convection, and radiation transfer energy at different rates.",
      "A heavy pan transfers heat steadily and improves browning.",
    ),
    detail(
      "Seasoning balances salt, acidity, sweetness, bitterness, aroma, and heat.",
      "Taste compounds change perception by enhancing some flavors and suppressing others.",
      "A small amount of acid can make a rich sauce taste lighter.",
    ),
    detail(
      "Texture comes from the structure, moisture, temperature, and size of food components.",
      "Cooking changes proteins, starches, fats, and water in ways that alter mouthfeel.",
      "Resting meat lets temperature and juices redistribute.",
    ),
    detail(
      "Baking uses controlled ratios and heat to build structure from flour, liquid, fat, and gases.",
      "Gluten, starch gelatinization, and expanding gas set the final crumb.",
      "Overmixing a tender cake can build too much gluten.",
    ),
    detail(
      "A sauce combines flavor with a controlled liquid texture.",
      "Reduction, emulsification, starch, or gelatin can thicken and stabilize it.",
      "A vinaigrette temporarily suspends oil droplets in an acidic liquid.",
    ),
    detail(
      "Timing coordinates changes that happen at different speeds.",
      "Preparation order accounts for carryover cooking, resting, and ingredient sensitivity.",
      "Adding herbs late preserves aromas that long heat would drive away.",
    ),
  ],
  sports: [
    detail(
      "Movement is coordinated force produced through joints, muscles, and the nervous system.",
      "Technique directs force efficiently while balance controls the body’s center of mass.",
      "A sprinter applies force backward to accelerate forward.",
    ),
    detail(
      "Strength is the ability to produce force against resistance.",
      "Progressive overload stimulates muscles and the nervous system to adapt.",
      "Gradually increasing resistance builds capacity while managing injury risk.",
    ),
    detail(
      "Endurance is the ability to sustain useful output over time.",
      "The heart, lungs, blood, and muscles adapt to deliver and use oxygen efficiently.",
      "Easy aerobic training builds capacity without excessive fatigue.",
    ),
    detail(
      "Skill is reliable performance built through perception, decision, and precise action.",
      "Focused practice with immediate feedback refines movement patterns.",
      "Variable practice helps an athlete adapt a technique to new situations.",
    ),
    detail(
      "Recovery is the process through which training stress becomes adaptation.",
      "Sleep, nutrition, and lower-load periods restore systems and consolidate learning.",
      "Hard sessions separated by recovery outperform nonstop maximal effort.",
    ),
    detail(
      "Teamwork coordinates specialized roles toward a shared objective.",
      "Communication and trust reduce uncertainty and speed collective decisions.",
      "Defenders move as a unit to close space instead of chasing independently.",
    ),
  ],
  economics: [
    detail(
      "Scarcity means limited resources cannot satisfy every possible use.",
      "Every choice therefore has an opportunity cost: the best alternative given up.",
      "Spending an hour studying means that hour cannot also be used for work.",
    ),
    detail(
      "Supply and demand describe how willingness to sell and buy interact to form prices.",
      "Prices move as conditions change until planned purchases and sales become compatible.",
      "A poor harvest can reduce supply and raise food prices.",
    ),
    detail(
      "Inflation is a sustained rise in the general price level, reducing money’s purchasing power.",
      "Demand, supply constraints, expectations, and monetary conditions can all contribute.",
      "Broad inflation differs from a one-time increase in one product.",
    ),
    detail(
      "Labor markets match people’s time and skills with organizations that need work performed.",
      "Wages reflect productivity, bargaining, alternatives, institutions, and scarcity.",
      "Training can raise wages when it develops skills employers value.",
    ),
    detail(
      "Trade lets people and regions specialize and exchange for mutual gain.",
      "Comparative advantage depends on relative opportunity costs, not absolute superiority.",
      "Two countries can benefit from trade even if one is more productive at everything.",
    ),
    detail(
      "Economic growth raises the amount of valuable output an economy can produce.",
      "Productivity improves through skills, capital, institutions, technology, and better allocation.",
      "A better production process can increase output without adding work hours.",
    ),
  ],
  design: [
    detail(
      "Visual hierarchy signals what matters first, next, and last.",
      "Scale, contrast, spacing, and placement guide attention through an interface.",
      "A strong page title and quieter metadata reduce scanning effort.",
    ),
    detail(
      "Typography gives written language structure, tone, and readability.",
      "Type size, line length, weight, and spacing shape comprehension.",
      "Shorter line lengths can make dense explanations easier to follow.",
    ),
    detail(
      "Color communicates grouping, state, emphasis, and mood.",
      "Useful palettes preserve contrast and avoid relying on color alone for meaning.",
      "An error state pairs red with an icon and clear message.",
    ),
    detail(
      "Interaction design defines how a product responds to user intent.",
      "Clear affordances, feedback, and predictable state changes build confidence.",
      "A pressed button should immediately acknowledge the touch.",
    ),
    detail(
      "Design research reduces uncertainty by observing real people and contexts.",
      "Interviews, usability tests, and behavioral data reveal different kinds of evidence.",
      "Watching someone fail a task can expose a problem they would not mention.",
    ),
    detail(
      "A design system is a shared set of components, rules, and language.",
      "Reusable patterns improve consistency while still allowing purposeful variation.",
      "One button component can enforce accessible sizing across an entire app.",
    ),
  ],
};

const visualOrder: Record<PathId, string[]> = {
  ai: [
    "hbm",
    "agents",
    "internet",
    "batteries",
    "quantum",
    "interfaces",
    "memory",
    "supply",
    "brands",
    "cities",
    "stars",
    "recovery",
  ],
  finance: [
    "rates",
    "index-funds",
    "inflation",
    "cities",
    "costco",
    "brands",
    "supply",
    "batteries",
    "interfaces",
    "titanic",
    "internet",
    "recovery",
  ],
  history: [
    "titanic",
    "printing",
    "cities",
    "stars",
    "bread",
    "flight",
    "supply",
    "interfaces",
    "mars",
    "costco",
    "internet",
    "memory",
  ],
  science: [
    "flight",
    "sleep",
    "quantum",
    "mars",
    "stars",
    "memory",
    "recovery",
    "batteries",
    "spin",
    "bread",
    "sear",
    "internet",
  ],
  business: [
    "costco",
    "brands",
    "supply",
    "rates",
    "cities",
    "interfaces",
    "internet",
    "batteries",
    "recovery",
    "habits",
    "type",
    "index-funds",
  ],
  technology: [
    "batteries",
    "internet",
    "hbm",
    "agents",
    "quantum",
    "interfaces",
    "type",
    "supply",
    "flight",
    "rates",
    "cities",
    "stars",
  ],
  psychology: [
    "habits",
    "memory",
    "sleep",
    "recovery",
    "interfaces",
    "type",
    "cooking",
    "spin",
    "agents",
    "cities",
    "flight",
    "stars",
  ].map((id) => (id === "cooking" ? "bread" : id)),
  space: [
    "mars",
    "stars",
    "flight",
    "quantum",
    "hbm",
    "internet",
    "titanic",
    "sleep",
    "batteries",
    "cities",
    "printing",
    "recovery",
  ],
  cooking: [
    "bread",
    "sear",
    "costco",
    "sleep",
    "recovery",
    "habits",
    "science",
    "brands",
    "type",
    "supply",
    "cities",
    "memory",
  ].map((id) => (id === "science" ? "flight" : id)),
  sports: [
    "spin",
    "recovery",
    "flight",
    "sleep",
    "habits",
    "memory",
    "science",
    "batteries",
    "cities",
    "stars",
    "bread",
    "interfaces",
  ].map((id) => (id === "science" ? "quantum" : id)),
  economics: [
    "inflation",
    "cities",
    "rates",
    "index-funds",
    "costco",
    "supply",
    "brands",
    "internet",
    "batteries",
    "printing",
    "recovery",
    "interfaces",
  ],
  design: [
    "interfaces",
    "type",
    "brands",
    "cities",
    "internet",
    "agents",
    "printing",
    "batteries",
    "costco",
    "memory",
    "flight",
    "stars",
  ],
};

const plain = (value: string) => value.replace(/\?+$/, "").trim();

export function getLesson(pathId: PathId, lessonIndex: number) {
  const path = paths[pathId];
  const safeIndex = Math.max(0, Math.min(lessonIndex, path.lessons.length - 1));
  const rawTitle = path.lessons[safeIndex];
  // Sentence templates below assume a noun phrase; lesson names like "What is AI?"
  // break grammar and double up punctuation ("...defines What is AI??") unless normalized.
  const title = plain(rawTitle);
  const info = curriculum[pathId][Math.floor(safeIndex / 2)];
  const previous = plain(
    safeIndex
      ? path.lessons[safeIndex - 1]
      : `the basic questions studied in ${path.title}`,
  );
  const next = plain(path.lessons[Math.min(safeIndex + 1, path.lessons.length - 1)]);
  const images = visualOrder[pathId].map(
    (id) => feed.find((item) => item.id === id)?.image ?? feed[0].image,
  );
  const misconception = `${title} is just a term to memorize, not something with an underlying process that produces a result.`;
  const cards = [
    {
      eyebrow: "Lesson overview",
      title: `Understanding ${title}`,
      body: `This lesson develops a usable understanding of ${title}. You will begin with its purpose, define it precisely, examine its mechanism, work through a concrete application, and learn where the idea can be misapplied.`,
      callout:
        "Take time to explain each card aloud. Active recall is more effective than simply rereading.",
    },
    {
      eyebrow: "Start with a question",
      title: `Why study ${title}?`,
      body: `${info.application} The example gives us a practical question: what process makes that result possible, and under which conditions should we expect it? ${title} provides a framework for answering that question.`,
      callout: `By the end, you should be able to explain the example without using “it just happens” as a shortcut.`,
    },
    {
      eyebrow: "Definition",
      title: `A precise meaning`,
      body: `${info.core} The important part is the relationship expressed by the definition. Memorizing the words is not enough; understanding means being able to recognize the same relationship in a new situation.`,
      callout: `In one sentence, restate ${title} without looking back at the first sentence.`,
    },
    {
      eyebrow: "Prior knowledge",
      title: `What this builds on`,
      body: `A clear understanding of ${previous} gives you the background needed here. Recall its central idea, then notice what the current lesson adds: a new process, distinction, or scale of explanation within ${path.title}.`,
      callout: `If ${previous} feels uncertain, review it before continuing; later lessons assume this foundation.`,
    },
    {
      eyebrow: "Parts of the explanation",
      title: `Four questions to ask`,
      body: `When you encounter ${title}, identify four things: the starting conditions, the actors or components involved, the process connecting them, and the result. Then ask what limits the result or would make it change.`,
      callout:
        "These questions turn a broad topic into a testable explanation.",
    },
    {
      eyebrow: "Mechanism",
      title: `How ${title} works`,
      body: `${info.mechanism} This is the causal center of the lesson: it explains how an initial condition becomes an outcome rather than merely stating that the outcome exists.`,
      callout:
        "A mechanism should let you predict what changes when one important input changes.",
    },
    {
      eyebrow: "Causal walkthrough",
      title: `Follow the process`,
      body: `Begin with the relevant starting condition. The components then interact through this process: ${info.mechanism} The resulting change becomes observable, and comparing it with a different condition helps isolate the cause.`,
      callout:
        "Pause and identify where the explanation moves from cause to effect.",
    },
    {
      eyebrow: "Worked application",
      title: `Apply the idea`,
      body: `${info.application} This is an application of ${title} because the example contains the same defining relationship and mechanism—not merely because it belongs to the same broad subject.`,
      callout:
        "Name the starting condition, mechanism, and outcome in the example.",
    },
    {
      eyebrow: "Misconception",
      title: `${title}: a common mistake`,
      body: `${misconception} That approach fails because a label cannot explain evidence or support a prediction. A strong account must connect the definition to the mechanism and then to an observable example.`,
      callout: `If an explanation only repeats “${title},” ask what actually changes and why.`,
    },
    {
      eyebrow: "Limits and evidence",
      title: `Use the idea carefully`,
      body: `The concept is most useful when its assumptions match the situation. Check the quality of the evidence, consider other causes that could produce a similar result, and avoid extending the explanation beyond the conditions it was designed to address.`,
      callout:
        "Knowing a concept includes knowing what evidence could show that your application is wrong.",
    },
    {
      eyebrow: "Cumulative connection",
      title: `From ${title} to ${next}`,
      body: `${next} follows this lesson because it uses part of the model you have just built. Keep the definition and mechanism of ${title} available; the next lesson will extend or combine them rather than starting from zero.`,
      callout: `Describe one question about ${next} that your new understanding of ${title} helps you ask.`,
    },
    {
      eyebrow: "Review",
      title: `Your ${title} checklist`,
      body: `You are ready for the mastery check if you can: define ${title}; explain this mechanism—${info.mechanism}; analyze this application—${info.application}; identify the common misconception; and name a condition that could limit the explanation.`,
      callout:
        "The assessment has three questions. You need 3/3 to complete the lesson, and you can retry if needed.",
    },
  ];
  return {
    title: rawTitle,
    subject: path.title,
    estimatedMinutes: 18,
    slides: cards.map((card, index) => ({ ...card, image: images[index] })),
    quizzes: [
      {
        question: `Which statement best defines ${title}?`,
        options: [
          info.core,
          misconception,
          `${title} is identical to ${next} in every context.`,
        ],
        correct: 0,
        explanation: `The correct definition preserves the essential meaning of ${title}.`,
      },
      {
        question: `Which statement explains how ${title} works?`,
        options: [
          `It occurs automatically and has no identifiable cause.`,
          info.mechanism,
          `It works only because people use the term ${title}.`,
        ],
        correct: 1,
        explanation: "The mechanism links a starting condition to an outcome.",
      },
      {
        question: `Which is the best application of ${title}?`,
        options: [
          `An example with no connection to ${path.title}.`,
          `A claim that cannot be observed or compared.`,
          info.application,
        ],
        correct: 2,
        explanation:
          "The application shows the concept operating in a concrete context.",
      },
    ],
  };
}
