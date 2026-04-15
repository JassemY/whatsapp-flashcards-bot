/**
 * Pre-populated quiz questions by topic
 * Format: { topic, question, options: [A, B, C, D], correctAnswer: 1-4 }
 */

const QUIZ_DATA = {
  Biology: [
    {
      question: "What is the powerhouse of the cell?",
      options: ["Nucleus", "Mitochondria", "Ribosome", "Endoplasmic Reticulum"],
      correctAnswer: 2
    },
    {
      question: "Which process do plants use to convert sunlight into energy?",
      options: ["Respiration", "Photosynthesis", "Fermentation", "Digestion"],
      correctAnswer: 2
    },
    {
      question: "How many chambers does a human heart have?",
      options: ["2", "3", "4", "6"],
      correctAnswer: 3
    },
    {
      question: "What is the largest organ in the human body?",
      options: ["Brain", "Heart", "Skin", "Liver"],
      correctAnswer: 3
    },
    {
      question: "Which blood type is the universal donor?",
      options: ["A", "B", "AB", "O"],
      correctAnswer: 4
    }
  ],

  History: [
    {
      question: "In what year did World War II end?",
      options: ["1943", "1944", "1945", "1946"],
      correctAnswer: 3
    },
    {
      question: "Who was the first President of the United States?",
      options: ["Thomas Jefferson", "George Washington", "Benjamin Franklin", "John Adams"],
      correctAnswer: 2
    },
    {
      question: "Which empire built the Great Wall of China?",
      options: ["Qin Dynasty", "Ming Dynasty", "Han Dynasty", "Both A and B"],
      correctAnswer: 4
    },
    {
      question: "In what year did the Titanic sink?",
      options: ["1910", "1912", "1915", "1920"],
      correctAnswer: 2
    },
    {
      question: "Who invented the electric light bulb?",
      options: ["Nikola Tesla", "Thomas Edison", "Alexander Bell", "Michael Faraday"],
      correctAnswer: 2
    }
  ],

  Geography: [
    {
      question: "What is the capital of France?",
      options: ["Lyon", "Paris", "Marseille", "Nice"],
      correctAnswer: 2
    },
    {
      question: "Which is the largest continent by area?",
      options: ["Africa", "Europe", "Asia", "North America"],
      correctAnswer: 3
    },
    {
      question: "What is the longest river in the world?",
      options: ["Amazon", "Yangtze", "Nile", "Mississippi"],
      correctAnswer: 3
    },
    {
      question: "Which country is known as the Land of the Rising Sun?",
      options: ["China", "Japan", "South Korea", "Thailand"],
      correctAnswer: 2
    },
    {
      question: "What is the capital of Australia?",
      options: ["Sydney", "Melbourne", "Brisbane", "Canberra"],
      correctAnswer: 4
    }
  ],

  Science: [
    {
      question: "What is the chemical symbol for Gold?",
      options: ["Go", "Gd", "Au", "Ag"],
      correctAnswer: 3
    },
    {
      question: "How many bones are in the adult human skeleton?",
      options: ["186", "206", "226", "246"],
      correctAnswer: 2
    },
    {
      question: "What is the speed of light?",
      options: ["300,000 km/s", "150,000 km/s", "500,000 km/s", "100,000 km/s"],
      correctAnswer: 1
    },
    {
      question: "What is the most abundant element in the Earth's atmosphere?",
      options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Argon"],
      correctAnswer: 2
    },
    {
      question: "What is the freezing point of water in Celsius?",
      options: ["-100°C", "0°C", "32°C", "100°C"],
      correctAnswer: 2
    }
  ],

  "General Knowledge": [
    {
      question: "How many continents are there?",
      options: ["5", "6", "7", "8"],
      correctAnswer: 3
    },
    {
      question: "Which planet is known as the Red Planet?",
      options: ["Venus", "Jupiter", "Mars", "Saturn"],
      correctAnswer: 3
    },
    {
      question: "How many sides does a hexagon have?",
      options: ["5", "6", "7", "8"],
      correctAnswer: 2
    },
    {
      question: "What is the smallest prime number?",
      options: ["0", "1", "2", "3"],
      correctAnswer: 3
    },
    {
      question: "Which animal is the fastest land animal?",
      options: ["Lion", "Greyhound", "Cheetah", "Gazelle"],
      correctAnswer: 3
    }
  ],

  Mathematics: [
    {
      question: "What is the square root of 144?",
      options: ["10", "11", "12", "13"],
      correctAnswer: 3
    },
    {
      question: "What is 15 × 12?",
      options: ["160", "170", "180", "190"],
      correctAnswer: 3
    },
    {
      question: "What is 25% of 200?",
      options: ["25", "50", "75", "100"],
      correctAnswer: 2
    },
    {
      question: "What is the value of π (pi) approximately?",
      options: ["2.14", "3.14", "4.14", "5.14"],
      correctAnswer: 2
    },
    {
      question: "What is 10^3 (10 to the power of 3)?",
      options: ["30", "100", "1000", "10000"],
      correctAnswer: 3
    }
  ]
};

module.exports = QUIZ_DATA;
