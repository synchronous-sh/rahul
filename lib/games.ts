export type GameId = 'trivia' | 'map' | 'odd-one-out' | 'higher-or-lower' | 'guess-it' | 'timeline' | 'true-or-false' | 'match';

export type GameInfo = {
  id: GameId;
  title: string;
  subtitle: string;
  genre: string;
  cover: number;
  poster: number;
  posterHasTitle: boolean;
};

export const gameCatalog: GameInfo[] = [
  { id: 'trivia', title: 'Trivia', subtitle: 'Test what you know', genre: 'Knowledge', cover: require('../assets/games/trivia-v2.jpg'), poster: require('../assets/games/posters-v5/trivia.png'), posterHasTitle: true },
  { id: 'map', title: 'Map', subtitle: 'Explore world geography', genre: 'Geography', cover: require('../assets/games/map-v2.jpg'), poster: require('../assets/games/posters-v5/map.png'), posterHasTitle: true },
  { id: 'odd-one-out', title: 'Odd One Out', subtitle: 'Spot what does not belong', genre: 'Logic', cover: require('../assets/games/odd-one-out-v2.jpg'), poster: require('../assets/games/posters-v5/odd-one-out.png'), posterHasTitle: true },
  { id: 'higher-or-lower', title: 'Higher or Lower', subtitle: 'Compare surprising facts', genre: 'Comparison', cover: require('../assets/games/higher-or-lower-v2.jpg'), poster: require('../assets/games/posters-v5/higher-or-lower.png'), posterHasTitle: true },
  { id: 'guess-it', title: 'Guess It', subtitle: 'Decode the clues', genre: 'Mystery', cover: require('../assets/games/guess-it-v2.jpg'), poster: require('../assets/games/posters-v5/guess-it.png'), posterHasTitle: true },
  { id: 'timeline', title: 'Timeline', subtitle: 'Put history in order', genre: 'History', cover: require('../assets/games/timeline-v2.jpg'), poster: require('../assets/games/posters-v5/timeline.png'), posterHasTitle: true },
  { id: 'true-or-false', title: 'True or False', subtitle: 'Trust your instincts', genre: 'Quick Play', cover: require('../assets/games/true-or-false-v2.jpg'), poster: require('../assets/games/posters-v5/true-or-false.png'), posterHasTitle: true },
  { id: 'match', title: 'Match', subtitle: 'Find every pair', genre: 'Memory', cover: require('../assets/games/match-v2.jpg'), poster: require('../assets/games/posters-v5/match.png'), posterHasTitle: true },
];

export type ChoiceRound = { prompt: string; choices: string[]; answer: string; detail: string };

export type TriviaCategory = { id: string; title: string; subtitle: string; cover: number; rounds: ChoiceRound[] };

export const triviaCategories: TriviaCategory[] = [
  { id: 'general', title: 'General Knowledge', subtitle: 'A little bit of everything', cover: require('../assets/games/trivia-categories/general-v3.png'), rounds: [
    { prompt: 'Which planet has the shortest day?', choices: ['Earth', 'Mars', 'Jupiter', 'Venus'], answer: 'Jupiter', detail: 'Jupiter rotates once in about 10 hours.' },
    { prompt: 'What is the smallest prime number?', choices: ['0', '1', '2', '3'], answer: '2', detail: 'Two is the only even prime number.' },
    { prompt: 'Which language has the most native speakers?', choices: ['English', 'Spanish', 'Mandarin', 'Hindi'], answer: 'Mandarin', detail: 'Mandarin Chinese has the largest native-speaker population.' },
    { prompt: 'How many sides does a dodecagon have?', choices: ['10', '12', '14', '20'], answer: '12', detail: 'The prefix dodeca means twelve.' },
    { prompt: 'Which element has the symbol Au?', choices: ['Silver', 'Gold', 'Copper', 'Argon'], answer: 'Gold', detail: 'Au comes from the Latin word aurum.' },
  ]},
  { id: 'science', title: 'Science', subtitle: 'Matter, life and discovery', cover: require('../assets/games/trivia-categories/science-v3.png'), rounds: [
    { prompt: 'Which organelle is known as the powerhouse of the cell?', choices: ['Nucleus', 'Mitochondrion', 'Ribosome', 'Vacuole'], answer: 'Mitochondrion', detail: 'Mitochondria produce most of a cell’s usable chemical energy.' },
    { prompt: 'What is the most abundant gas in Earth’s atmosphere?', choices: ['Oxygen', 'Carbon dioxide', 'Nitrogen', 'Hydrogen'], answer: 'Nitrogen', detail: 'Nitrogen makes up about 78 percent of the atmosphere.' },
    { prompt: 'What is the chemical symbol for potassium?', choices: ['P', 'Pt', 'K', 'Po'], answer: 'K', detail: 'K comes from the Latin name kalium.' },
    { prompt: 'Which force keeps planets in orbit?', choices: ['Friction', 'Magnetism', 'Gravity', 'Buoyancy'], answer: 'Gravity', detail: 'Gravity bends a planet’s path around its star.' },
    { prompt: 'What type of animal is an axolotl?', choices: ['Fish', 'Amphibian', 'Reptile', 'Mammal'], answer: 'Amphibian', detail: 'The axolotl is a salamander that retains juvenile traits as an adult.' },
  ]},
  { id: 'history', title: 'History', subtitle: 'People who shaped the world', cover: require('../assets/games/trivia-categories/history-v3.png'), rounds: [
    { prompt: 'The Magna Carta was sealed in which year?', choices: ['1066', '1215', '1492', '1776'], answer: '1215', detail: 'King John sealed the Magna Carta at Runnymede in 1215.' },
    { prompt: 'Where did the Renaissance begin?', choices: ['France', 'Italy', 'Spain', 'Greece'], answer: 'Italy', detail: 'Italian city-states were the movement’s early centers.' },
    { prompt: 'Which civilization built Machu Picchu?', choices: ['Maya', 'Roman', 'Inca', 'Aztec'], answer: 'Inca', detail: 'The Inca built the mountain citadel in the fifteenth century.' },
    { prompt: 'Who was the first woman to fly solo across the Atlantic?', choices: ['Sally Ride', 'Amelia Earhart', 'Bessie Coleman', 'Valentina Tereshkova'], answer: 'Amelia Earhart', detail: 'Earhart completed the solo flight in 1932.' },
    { prompt: 'The Rosetta Stone helped scholars read which script?', choices: ['Cuneiform', 'Hieroglyphs', 'Sanskrit', 'Runes'], answer: 'Hieroglyphs', detail: 'Its parallel inscriptions enabled the deciphering of Egyptian hieroglyphs.' },
  ]},
  { id: 'arts', title: 'Arts & Culture', subtitle: 'Books, music and visual arts', cover: require('../assets/games/trivia-categories/arts-v3.png'), rounds: [
    { prompt: 'Who wrote The Republic?', choices: ['Plato', 'Aristotle', 'Socrates', 'Homer'], answer: 'Plato', detail: 'Plato wrote the dialogue around 375 BCE.' },
    { prompt: 'Which artist painted The Persistence of Memory?', choices: ['Monet', 'Dalí', 'Kahlo', 'Matisse'], answer: 'Dalí', detail: 'Salvador Dalí completed the surrealist painting in 1931.' },
    { prompt: 'A haiku traditionally has how many syllables?', choices: ['12', '15', '17', '21'], answer: '17', detail: 'English-language haiku commonly follow a 5–7–5 syllable pattern.' },
    { prompt: 'Which instrument has 88 keys on a standard model?', choices: ['Accordion', 'Piano', 'Harpsichord', 'Organ'], answer: 'Piano', detail: 'A modern standard piano has 52 white and 36 black keys.' },
    { prompt: 'Who wrote One Hundred Years of Solitude?', choices: ['Borges', 'Neruda', 'Márquez', 'Allende'], answer: 'Márquez', detail: 'Gabriel García Márquez published the novel in 1967.' },
  ]},
  { id: 'sports', title: 'Sports', subtitle: 'Records, rules and legends', cover: require('../assets/games/trivia-categories/sports-v3.png'), rounds: [
    { prompt: 'How many players from one team are on a soccer field?', choices: ['9', '10', '11', '12'], answer: '11', detail: 'A side fields ten outfield players and one goalkeeper.' },
    { prompt: 'Which Grand Slam is played on clay?', choices: ['Wimbledon', 'US Open', 'Australian Open', 'French Open'], answer: 'French Open', detail: 'Roland-Garros is played on red clay in Paris.' },
    { prompt: 'A basketball free throw is worth how many points?', choices: ['1', '2', '3', '4'], answer: '1', detail: 'Each successful free throw adds one point.' },
    { prompt: 'Which country originated judo?', choices: ['China', 'Japan', 'Korea', 'Thailand'], answer: 'Japan', detail: 'Jigoro Kano founded judo in Japan in 1882.' },
    { prompt: 'How long is an Olympic swimming pool?', choices: ['25 m', '40 m', '50 m', '100 m'], answer: '50 m', detail: 'Long-course Olympic competition uses a 50-meter pool.' },
  ]},
  { id: 'nature', title: 'Nature', subtitle: 'Wildlife and the living planet', cover: require('../assets/games/trivia-categories/nature-v3.png'), rounds: [
    { prompt: 'What is the largest animal alive today?', choices: ['African elephant', 'Blue whale', 'Whale shark', 'Giraffe'], answer: 'Blue whale', detail: 'Blue whales are the largest animals known to have lived.' },
    { prompt: 'Which process lets plants convert light into energy?', choices: ['Respiration', 'Fermentation', 'Photosynthesis', 'Transpiration'], answer: 'Photosynthesis', detail: 'Photosynthesis converts light energy into chemical energy.' },
    { prompt: 'A group of crows is traditionally called what?', choices: ['A pride', 'A murder', 'A colony', 'A school'], answer: 'A murder', detail: 'A group of crows is traditionally called a murder.' },
    { prompt: 'Which biome has permafrost?', choices: ['Savanna', 'Tundra', 'Rainforest', 'Chaparral'], answer: 'Tundra', detail: 'Tundra soil remains frozen for long periods as permafrost.' },
    { prompt: 'Which tree produces acorns?', choices: ['Pine', 'Maple', 'Oak', 'Willow'], answer: 'Oak', detail: 'Acorns are the nuts produced by oak trees.' },
  ]},
];

export const choiceRounds: Record<Exclude<GameId, 'timeline' | 'match'>, ChoiceRound[]> = {
  trivia: [
    { prompt: 'Which planet has the shortest day?', choices: ['Earth', 'Mars', 'Jupiter', 'Venus'], answer: 'Jupiter', detail: 'Jupiter rotates once in about 10 hours.' },
    { prompt: 'Who wrote The Republic?', choices: ['Plato', 'Aristotle', 'Socrates', 'Homer'], answer: 'Plato', detail: 'Plato wrote the dialogue around 375 BCE.' },
    { prompt: 'What is the smallest prime number?', choices: ['0', '1', '2', '3'], answer: '2', detail: 'Two is the only even prime number.' },
    { prompt: 'Which element has the symbol Au?', choices: ['Silver', 'Gold', 'Copper', 'Argon'], answer: 'Gold', detail: 'Au comes from the Latin word aurum.' },
    { prompt: 'Where did the Renaissance begin?', choices: ['France', 'Italy', 'Spain', 'Greece'], answer: 'Italy', detail: 'Italian city-states were the movement’s early centers.' },
  ],
  map: [
    { prompt: 'Which country contains the city of Marrakech?', choices: ['Morocco', 'Egypt', 'Portugal', 'Jordan'], answer: 'Morocco', detail: 'Marrakech sits west of the Atlas Mountains in Morocco.' },
    { prompt: 'Which country is directly south of the United States?', choices: ['Brazil', 'Mexico', 'Cuba', 'Colombia'], answer: 'Mexico', detail: 'Mexico shares a long land border with the United States.' },
    { prompt: 'The Danube River flows through which capital?', choices: ['Madrid', 'Budapest', 'Oslo', 'Dublin'], answer: 'Budapest', detail: 'The Danube divides Buda and Pest.' },
    { prompt: 'Mount Kilimanjaro is in which country?', choices: ['Kenya', 'Tanzania', 'Ethiopia', 'Uganda'], answer: 'Tanzania', detail: 'Kilimanjaro is in northeastern Tanzania.' },
    { prompt: 'Which island nation lies southeast of India?', choices: ['Sri Lanka', 'Madagascar', 'Fiji', 'Cyprus'], answer: 'Sri Lanka', detail: 'Sri Lanka is separated from India by the Palk Strait.' },
  ],
  'odd-one-out': [
    { prompt: 'Which animal does not belong?', choices: ['Lion', 'Tiger', 'Cheetah', 'Dolphin'], answer: 'Dolphin', detail: 'The dolphin is a marine mammal; the others are big cats.' },
    { prompt: 'Which food does not belong?', choices: ['Pizza', 'Lasagna', 'Ravioli', 'Sushi'], answer: 'Sushi', detail: 'Sushi is Japanese; the other dishes are Italian.' },
    { prompt: 'Which animal does not belong?', choices: ['Eagle', 'Owl', 'Penguin', 'Bat'], answer: 'Bat', detail: 'The bat is a mammal; the others are birds.' },
    { prompt: 'Which instrument does not belong?', choices: ['Violin', 'Cello', 'Guitar', 'Trumpet'], answer: 'Trumpet', detail: 'The trumpet is a brass instrument; the others are string instruments.' },
    { prompt: 'Which food does not belong?', choices: ['Apple', 'Orange', 'Strawberry', 'Carrot'], answer: 'Carrot', detail: 'The carrot is a vegetable; the others are fruits.' },
  ],
  'higher-or-lower': [
    { prompt: 'Which is higher?', choices: ['Mount Fuji · 3,776 m', 'Mont Blanc · 4,806 m'], answer: 'Mont Blanc · 4,806 m', detail: 'Mont Blanc is about 1,030 meters higher.' },
    { prompt: 'Which population is larger?', choices: ['Canada · 41M', 'Australia · 27M'], answer: 'Canada · 41M', detail: 'Canada has roughly 14 million more people.' },
    { prompt: 'Which boiling point is higher?', choices: ['Water · 100°C', 'Ethanol · 78°C'], answer: 'Water · 100°C', detail: 'At sea level, water boils 22°C higher.' },
    { prompt: 'Which appeared earlier?', choices: ['Printing press · 1440', 'Telescope · 1608'], answer: 'Printing press · 1440', detail: 'The printing press predates the telescope by about 168 years.' },
    { prompt: 'Which travels faster?', choices: ['Sound · 343 m/s', 'Light · 300,000 km/s'], answer: 'Light · 300,000 km/s', detail: 'Light is vastly faster than sound.' },
  ],
  'guess-it': [
    { prompt: 'I have keys but no locks. I have space but no rooms.', choices: ['Keyboard', 'Piano', 'Map', 'Clock'], answer: 'Keyboard', detail: 'A keyboard has keys and a space bar.' },
    { prompt: 'I orbit Earth and shape its ocean tides.', choices: ['Sun', 'Moon', 'Mars', 'Venus'], answer: 'Moon', detail: 'The Moon’s gravity is the main driver of Earth’s tides.' },
    { prompt: 'I store genetic instructions inside most living cells.', choices: ['ATP', 'DNA', 'Calcium', 'Water'], answer: 'DNA', detail: 'DNA encodes hereditary biological information.' },
    { prompt: 'I measure atmospheric pressure and help forecast weather.', choices: ['Barometer', 'Thermometer', 'Compass', 'Altimeter'], answer: 'Barometer', detail: 'A barometer measures air pressure.' },
    { prompt: 'I am the boundary beyond which light cannot escape.', choices: ['Event horizon', 'Equator', 'Asteroid belt', 'Ozone layer'], answer: 'Event horizon', detail: 'The event horizon marks a black hole’s point of no return.' },
  ],
  'true-or-false': [
    { prompt: 'Sound travels faster through water than through air.', choices: ['True', 'False'], answer: 'True', detail: 'Particles transmit vibrations more quickly in water.' },
    { prompt: 'The Great Wall of China is visible from the Moon unaided.', choices: ['True', 'False'], answer: 'False', detail: 'It is far too narrow to see from the Moon with the naked eye.' },
    { prompt: 'Venus is hotter than Mercury.', choices: ['True', 'False'], answer: 'True', detail: 'Venus’s dense atmosphere creates an extreme greenhouse effect.' },
    { prompt: 'Humans have four chambers in the heart.', choices: ['True', 'False'], answer: 'True', detail: 'The heart has two atria and two ventricles.' },
    { prompt: 'Lightning never strikes the same place twice.', choices: ['True', 'False'], answer: 'False', detail: 'Tall structures are struck repeatedly.' },
  ],
};

export const timelineEvents = [
  { label: 'Great Pyramid completed', year: -2560 },
  { label: 'Magna Carta sealed', year: 1215 },
  { label: 'Printing press developed', year: 1440 },
  { label: 'First powered flight', year: 1903 },
  { label: 'World Wide Web proposed', year: 1989 },
];

export const matchPairs = [
  ['DNA', 'Genetics'], ['Mars', 'Planet'], ['Nile', 'River'], ['Mozart', 'Composer'],
];
