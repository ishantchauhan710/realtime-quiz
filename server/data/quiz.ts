export const quizData = [
  // ================= ANIMALS =================
  {
    id: 1,
    category: "animals",
    title: "Animal Basics 1",
    description: "Basic animal knowledge",
    timeLimit: 60,
    questions: [
      { id: 1, question: "Largest land animal?", options: ["Elephant", "Lion", "Tiger", "Giraffe"], correctAnswer: 0 },
      { id: 2, question: "Fastest land animal?", options: ["Cheetah", "Horse", "Leopard", "Tiger"], correctAnswer: 0 },
      { id: 3, question: "Which animal is known as King of Jungle?", options: ["Tiger", "Lion", "Elephant", "Wolf"], correctAnswer: 1 },
      { id: 4, question: "Which animal can fly?", options: ["Bat", "Dog", "Elephant", "Cat"], correctAnswer: 0 },
      { id: 5, question: "Which animal has trunk?", options: ["Elephant", "Horse", "Deer", "Lion"], correctAnswer: 0 },
      { id: 6, question: "Which animal lives in water?", options: ["Shark", "Tiger", "Dog", "Elephant"], correctAnswer: 0 },
      { id: 7, question: "Tallest animal?", options: ["Giraffe", "Elephant", "Horse", "Camel"], correctAnswer: 0 },
      { id: 8, question: "Which animal barks?", options: ["Dog", "Cat", "Cow", "Sheep"], correctAnswer: 0 },
      { id: 9, question: "Which animal gives milk?", options: ["Cow", "Tiger", "Dog", "Lion"], correctAnswer: 0 },
      { id: 10, question: "Which animal is herbivore?", options: ["Cow", "Lion", "Tiger", "Wolf"], correctAnswer: 0 }
    ]
  },
  {
    id: 2,
    category: "animals",
    title: "Animal Basics 2",
    description: "More animal facts",
    timeLimit: 60,
    questions: [
      { id: 1, question: "Which bird cannot fly?", options: ["Ostrich", "Eagle", "Sparrow", "Parrot"], correctAnswer: 0 },
      { id: 2, question: "Which animal has stripes?", options: ["Zebra", "Dog", "Cat", "Elephant"], correctAnswer: 0 },
      { id: 3, question: "Which animal has hump?", options: ["Camel", "Horse", "Dog", "Cow"], correctAnswer: 0 },
      { id: 4, question: "Which animal is amphibian?", options: ["Frog", "Dog", "Cat", "Cow"], correctAnswer: 0 },
      { id: 5, question: "Which animal howls?", options: ["Wolf", "Dog", "Cow", "Horse"], correctAnswer: 0 },
      { id: 6, question: "Which animal has shell?", options: ["Turtle", "Dog", "Cat", "Lion"], correctAnswer: 0 },
      { id: 7, question: "Which animal climbs trees?", options: ["Monkey", "Elephant", "Cow", "Horse"], correctAnswer: 0 },
      { id: 8, question: "Which animal is nocturnal?", options: ["Owl", "Dog", "Cow", "Horse"], correctAnswer: 0 },
      { id: 9, question: "Which animal swims?", options: ["Fish", "Dog", "Cat", "Cow"], correctAnswer: 0 },
      { id: 10, question: "Which animal has fur?", options: ["Cat", "Snake", "Fish", "Frog"], correctAnswer: 0 }
    ]
  },

  // ================= COUNTRY CAPITAL =================
  {
    id: 3,
    category: "country_capital",
    title: "Capitals Quiz 1",
    description: "Basic capitals",
    timeLimit: 60,
    questions: [
      { id: 1, question: "Capital of India?", options: ["Delhi", "Mumbai", "Chennai", "Kolkata"], correctAnswer: 0 },
      { id: 2, question: "Capital of USA?", options: ["Washington DC", "New York", "LA", "Chicago"], correctAnswer: 0 },
      { id: 3, question: "Capital of UK?", options: ["London", "Paris", "Berlin", "Rome"], correctAnswer: 0 },
      { id: 4, question: "Capital of Japan?", options: ["Tokyo", "Osaka", "Kyoto", "Nagoya"], correctAnswer: 0 },
      { id: 5, question: "Capital of France?", options: ["Paris", "Rome", "Berlin", "Madrid"], correctAnswer: 0 },
      { id: 6, question: "Capital of Germany?", options: ["Berlin", "Paris", "Rome", "Madrid"], correctAnswer: 0 },
      { id: 7, question: "Capital of Italy?", options: ["Rome", "Paris", "Berlin", "Madrid"], correctAnswer: 0 },
      { id: 8, question: "Capital of Spain?", options: ["Madrid", "Paris", "Berlin", "Rome"], correctAnswer: 0 },
      { id: 9, question: "Capital of China?", options: ["Beijing", "Shanghai", "Tokyo", "Seoul"], correctAnswer: 0 },
      { id: 10, question: "Capital of Russia?", options: ["Moscow", "Berlin", "Paris", "Rome"], correctAnswer: 0 }
    ]
  },
  {
    id: 4,
    category: "country_capital",
    title: "Capitals Quiz 2",
    description: "Advanced capitals",
    timeLimit: 60,
    questions: [
      { id: 1, question: "Capital of Canada?", options: ["Ottawa", "Toronto", "Vancouver", "Montreal"], correctAnswer: 0 },
      { id: 2, question: "Capital of Australia?", options: ["Canberra", "Sydney", "Melbourne", "Perth"], correctAnswer: 0 },
      { id: 3, question: "Capital of Brazil?", options: ["Brasilia", "Rio", "Sao Paulo", "Salvador"], correctAnswer: 0 },
      { id: 4, question: "Capital of UAE?", options: ["Abu Dhabi", "Dubai", "Sharjah", "Doha"], correctAnswer: 0 },
      { id: 5, question: "Capital of Saudi Arabia?", options: ["Riyadh", "Jeddah", "Mecca", "Medina"], correctAnswer: 0 },
      { id: 6, question: "Capital of South Korea?", options: ["Seoul", "Busan", "Tokyo", "Beijing"], correctAnswer: 0 },
      { id: 7, question: "Capital of Egypt?", options: ["Cairo", "Alexandria", "Giza", "Luxor"], correctAnswer: 0 },
      { id: 8, question: "Capital of Turkey?", options: ["Ankara", "Istanbul", "Izmir", "Antalya"], correctAnswer: 0 },
      { id: 9, question: "Capital of Thailand?", options: ["Bangkok", "Phuket", "Chiang Mai", "Pattaya"], correctAnswer: 0 },
      { id: 10, question: "Capital of Nepal?", options: ["Kathmandu", "Pokhara", "Lalitpur", "Biratnagar"], correctAnswer: 0 }
    ]
  },

  // ================= GENERAL KNOWLEDGE =================
  {
    id: 5,
    category: "general_knowledge",
    title: "GK Quiz 1",
    description: "General knowledge basics",
    timeLimit: 60,
    questions: Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      question: `GK Question ${i + 1}?`,
      options: ["Option A", "Option B", "Option C", "Option D"],
      correctAnswer: 0
    }))
  },
  {
    id: 6,
    category: "general_knowledge",
    title: "GK Quiz 2",
    description: "General knowledge advanced",
    timeLimit: 60,
    questions: Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      question: `Advanced GK Question ${i + 1}?`,
      options: ["Option A", "Option B", "Option C", "Option D"],
      correctAnswer: 1
    }))
  },

  // ================= MEDICAL =================
  {
    id: 7,
    category: "medical",
    title: "Medical Quiz 1",
    description: "Basic medical knowledge",
    timeLimit: 60,
    questions: [
      { id: 1, question: "Normal body temperature?", options: ["37°C", "40°C", "35°C", "39°C"], correctAnswer: 0 },
      { id: 2, question: "Heart pumps?", options: ["Blood", "Air", "Water", "Oxygen"], correctAnswer: 0 },
      { id: 3, question: "Brain is part of?", options: ["Nervous system", "Digestive", "Respiratory", "Circulatory"], correctAnswer: 0 },
      { id: 4, question: "Bones form?", options: ["Skeleton", "Muscles", "Skin", "Blood"], correctAnswer: 0 },
      { id: 5, question: "Blood type O is?", options: ["Universal donor", "Universal receiver", "None", "Rare"], correctAnswer: 0 },
      { id: 6, question: "Vitamin C source?", options: ["Orange", "Rice", "Meat", "Milk"], correctAnswer: 0 },
      { id: 7, question: "Insulin controls?", options: ["Sugar", "Salt", "Water", "Oxygen"], correctAnswer: 0 },
      { id: 8, question: "Lungs help in?", options: ["Breathing", "Digestion", "Circulation", "Thinking"], correctAnswer: 0 },
      { id: 9, question: "Red blood cells carry?", options: ["Oxygen", "Water", "Food", "Waste"], correctAnswer: 0 },
      { id: 10, question: "Largest organ?", options: ["Skin", "Heart", "Brain", "Liver"], correctAnswer: 0 }
    ]
  },
  {
    id: 8,
    category: "medical",
    title: "Medical Quiz 2",
    description: "Advanced medical",
    timeLimit: 60,
    questions: Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      question: `Medical Question ${i + 1}?`,
      options: ["A", "B", "C", "D"],
      correctAnswer: 2
    }))
  },

  // ================= TECH =================
  {
    id: 9,
    category: "tech",
    title: "Tech Quiz 1",
    description: "Programming basics",
    timeLimit: 60,
    questions: [
      { id: 1, question: "HTML stands for?", options: ["HyperText Markup Language", "HighText Machine", "Hyper Transfer", "None"], correctAnswer: 0 },
      { id: 2, question: "CSS used for?", options: ["Styling", "Logic", "Database", "Server"], correctAnswer: 0 },
      { id: 3, question: "JS is?", options: ["Programming language", "Database", "OS", "Browser"], correctAnswer: 0 },
      { id: 4, question: "React is?", options: ["Library", "Language", "DB", "OS"], correctAnswer: 0 },
      { id: 5, question: "Node.js runs on?", options: ["Server", "Browser", "DB", "OS"], correctAnswer: 0 },
      { id: 6, question: "Git is?", options: ["Version control", "DB", "OS", "Language"], correctAnswer: 0 },
      { id: 7, question: "API stands for?", options: ["Application Programming Interface", "App Program", "None", "System API"], correctAnswer: 0 },
      { id: 8, question: "SQL is?", options: ["Database language", "OS", "Browser", "Tool"], correctAnswer: 0 },
      { id: 9, question: "HTTP means?", options: ["HyperText Transfer Protocol", "HighText", "Transfer", "None"], correctAnswer: 0 },
      { id: 10, question: "Frontend runs on?", options: ["Browser", "Server", "DB", "OS"], correctAnswer: 0 }
    ]
  },
  {
    id: 10,
    category: "tech",
    title: "Tech Quiz 2",
    description: "Advanced tech",
    timeLimit: 60,
    questions: Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      question: `Advanced Tech Question ${i + 1}?`,
      options: ["A", "B", "C", "D"],
      correctAnswer: 3
    }))
  }
];