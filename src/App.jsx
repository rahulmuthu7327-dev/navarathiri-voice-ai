import { Fragment, useEffect, useRef, useState } from "react";
import "./App.css";
import "./sundarakanda.css";
import dataset from "./data/navarathiri_voice_ai_dataset.json";
import sundarakandaDataset from "./data/sundarakanda_dataset.json";

// =====================================================
// CONSTANTS
// =====================================================

const SK_CATEGORY = "sundarakanda";

const ALL_ENTRIES = [
  ...sundarakandaDataset.entries,
  ...dataset.entries,
];

// =====================================================
// SUNDARAKANDA VISUAL STAGES
// =====================================================

const SK_STAGES = [
  {
    icon: "🌊",
    en: "Ocean",
    ta: "கடல்",
    enNote: "The great leap",
    taNote: "பெரும் பாய்ச்சல்",
  },
  {
    icon: "🙏",
    en: "Hanuman",
    ta: "அனுமன்",
    enNote: "Devoted messenger",
    taNote: "பக்தியுள்ள தூதர்",
  },
  {
    icon: "🏰",
    en: "Lanka",
    ta: "இலங்கை",
    enNote: "The search begins",
    taNote: "தேடல் தொடக்கம்",
  },
  {
    icon: "🌸",
    en: "Sita",
    ta: "சீதை",
    enNote: "Hope in Ashoka Vatika",
    taNote: "அசோகவனத்தில் நம்பிக்கை",
  },
  {
    icon: "🔥",
    en: "Lanka Burns",
    ta: "இலங்கை எரிகிறது",
    enNote: "Courage before Ravana",
    taNote: "ராவணன் முன் துணிவு",
  },
  {
    icon: "🏹",
    en: "Rama",
    ta: "ராமர்",
    enNote: "News of success",
    taNote: "செய்தியுடன் திரும்புதல்",
  },
];

// =====================================================
// TAMIL STEM RULES
// =====================================================

const TAMIL_STEM_RULES = [
  [/சுந்தர\s*காண்ட[\u0B80-\u0BFF]*/g, " sundarakanda "],
  [/அசோக\s*வன[\u0B80-\u0BFF]*/g, " ashoka vatika "],
  [
    /ராவண[\u0B80-\u0BFF]*\s*(சபை|அவை)[\u0B80-\u0BFF]*/g,
    " ravana court ",
  ],
  [
    /இலங்கை[\u0B80-\u0BFF]*\s*எரி[\u0B80-\u0BFF]*/g,
    " lanka burning ",
  ],
  [/இலங்கை[\u0B80-\u0BFF]*/g, " lanka "],
  [/சீதை[\u0B80-\u0BFF]*/g, " sita "],
  [/அனும[\u0B80-\u0BFF]*/g, " hanuman "],
  [
    /இராமனின்\s*மோதிர[\u0B80-\u0BFF]*/g,
    " rama ring ",
  ],
  [/சூடாமணி[\u0B80-\u0BFF]*/g, " chudamani "],
  [
    /சீதை[\u0B80-\u0BFF]*\s*(எங்கே|காண்|கண்ட)[\u0B80-\u0BFF]*/g,
    " sita found ",
  ],
  [/இராவண[\u0B80-\u0BFF]*/g, " ravana "],
];

// =====================================================
// SUGGESTIONS
// =====================================================

const SUGGESTIONS = [
  {
    label: "🪔 What is Navarathiri?",
    query: "What is Navarathiri?",
  },

  ...Array.from({ length: 9 }, (_, index) => ({
    label: `${
      index === 8 ? "🌺" : "🌸"
    } Navarathiri Day ${index + 1}`,
    query: `What is Day ${index + 1} of Navarathiri?`,
  })),

  {
    label: "🏹 Ramayana",
    query: "Tell me about Ramayana",
  },

  {
    label: "🙏 Sundarakanda",
    query: "Tell me about Sundarakanda",
  },

  {
    label: "🌊 Hanuman's Great Leap",
    query: "Tell me about Hanuman's great leap",
  },

  {
    label: "🌸 Finding Sita",
    query: "Where did Hanuman find Sita?",
  },

  {
    label: "🔥 Burning of Lanka",
    query: "Tell me about the burning of Lanka",
  },

  {
    label: "💎 Sita's Chudamani",
    query: "What did Sita give Hanuman?",
  },

  {
    label: "🙏 Sundarakanda Significance",
    query: "What is the significance of Sundarakanda?",
  },

  {
    label: "⚔️ Mahabharata",
    query: "Tell me about Mahabharata",
  },

  {
    label: "🙏 Who is Hanuman?",
    query: "Who is Hanuman?",
  },

  {
    label: "🏹 Who are the Pandavas?",
    query: "Who are the Pandavas?",
  },

  {
    label: "📖 Bhagavad Gita",
    query: "What is Bhagavad Gita?",
  },

  {
    label: "🌺 Vijayadashami",
    query: "Tell me about Vijayadashami",
  },
];

// =====================================================
// CLEAN TEXT
// =====================================================

const cleanText = (text) =>
  (text || "")
    .toLowerCase()
    .replace(/[?!.,:;'"`’‘“”]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

function App() {
  // =====================================================
  // STATE
  // =====================================================

  const [language, setLanguage] = useState("tamil");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const [chartData, setChartData] = useState(null);

  const [conversation, setConversation] = useState([]);

  const [selectedConversationId, setSelectedConversationId] =
    useState(null);

  const [speakingConversationId, setSpeakingConversationId] =
    useState(null);

  const conversationEndRef = useRef(null);

  // =====================================================
  // AUTO SCROLL
  // =====================================================

  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [conversation, selectedConversationId]);

  // =====================================================
  // TAMIL ALIASES
  // =====================================================

  const tamilAliases = {
    "நவராத்திரி பற்றி": "navarathiri",
    "நவராத்திரி": "navarathiri",
    "நவராத்திரி என்ன": "what is navarathiri",

    "முதல் நாள்": "day 1",
    "முதலாம் நாள்": "day 1",
    "நாள் ஒன்று": "day 1",
    "நாள் 1": "day 1",

    "இரண்டாம் நாள்": "day 2",
    "இரண்டாவது நாள்": "day 2",
    "நாள் இரண்டு": "day 2",
    "நாள் 2": "day 2",

    "மூன்றாம் நாள்": "day 3",
    "மூன்றாவது நாள்": "day 3",
    "நாள் மூன்று": "day 3",
    "நாள் 3": "day 3",

    "நான்காம் நாள்": "day 4",
    "நான்காவது நாள்": "day 4",
    "நாள் நான்கு": "day 4",
    "நாள் 4": "day 4",

    "ஐந்தாம் நாள்": "day 5",
    "ஐந்தாவது நாள்": "day 5",
    "நாள் ஐந்து": "day 5",
    "நாள் 5": "day 5",

    "ஆறாம் நாள்": "day 6",
    "ஆறாவது நாள்": "day 6",
    "நாள் ஆறு": "day 6",
    "நாள் 6": "day 6",

    "ஏழாம் நாள்": "day 7",
    "ஏழாவது நாள்": "day 7",
    "நாள் ஏழு": "day 7",
    "நாள் 7": "day 7",

    "எட்டாம் நாள்": "day 8",
    "எட்டாவது நாள்": "day 8",
    "நாள் எட்டு": "day 8",
    "நாள் 8": "day 8",

    "ஒன்பதாம் நாள்": "day 9",
    "ஒன்பதாவது நாள்": "day 9",
    "நாள் ஒன்பது": "day 9",
    "நாள் 9": "day 9",

    "துர்கை": "durga",
    "துர்கா": "durga",
    "பார்வதி": "parvati",
    "சக்தி": "shakti",

    "ராமாயணம் பற்றி": "ramayana",
    "ராமாயணம்": "ramayana",
    "ராமர்": "rama",
    "ஸ்ரீராமர்": "rama",
    "சீதை": "sita",
    "லட்சுமணன்": "lakshmana",
    "லட்சுமணர்": "lakshmana",
    "பரதன்": "bharata",
    "சத்ருக்னன்": "shatrughna",
    "அனுமன் யார்": "hanuman",
    "அனுமன்": "hanuman",
    "ஹனுமான்": "hanuman",
    "ராவணன் யார்": "ravana",
    "ராவணன்": "ravana",
    "இலங்கை": "lanka",
    "அயோத்தி": "ayodhya",
    "வனவாசம்": "exile",
    "வாலி": "vali",
    "சுக்ரீவன்": "sugriva",

    "மகாபாரதம் பற்றி": "mahabharata",
    "மகாபாரதம்": "mahabharata",
    "பாண்டவர்கள் யார்": "pandavas",
    "பாண்டவர்கள்": "pandavas",
    "கௌரவர்கள் யார்": "kauravas",
    "கௌரவர்கள்": "kauravas",
    "கிருஷ்ணர்": "krishna",
    "கிருஷ்ணா": "krishna",
    "அர்ஜுனன்": "arjuna",
    "அர்ஜுனர்": "arjuna",
    "பீமன்": "bhima",
    "யுதிஷ்டிரர்": "yudhishthira",
    "நகுலன்": "nakula",
    "சகதேவன்": "sahadeva",
    "திரௌபதி": "draupadi",
    "துரௌபதி": "draupadi",
    "பாஞ்சாலி": "draupadi",
    "துரியோதனன்": "duryodhana",
    "கர்ணன்": "karna",
    "பீஷ்மர்": "bhishma",
    "துரோணர்": "drona",
    "காந்தாரி": "gandhari",
    "குந்தி": "kunti",
    "குருக்ஷேத்திரம்": "kurukshetra",
    "பகவத் கீதை": "bhagavad gita",
    "பகவத் கீதை என்ன": "bhagavad gita",

    "சுந்தரகாண்டம்": "sundarakanda",
    "சுந்தர காண்டம்": "sundarakanda",
    "சுந்தரகாண்டத்தைப் பற்றி": "sundarakanda",
    "சுந்தரகாண்டத்தின் முக்கியத்துவம்":
      "sundarakanda significance",
    "சுந்தரகாண்டம் முக்கியத்துவம்":
      "sundarakanda significance",

    "அனுமனின் பெரும் பாய்ச்சல்":
      "hanuman great leap",
    "அனுமன் கடலைத் தாண்டியது":
      "hanuman ocean crossing",
    "சீதை எங்கே": "where sita",
    "அனுமன் சீதையை எங்கே கண்டார்":
      "where hanuman found sita",
    "அசோகவனம்": "ashoka vatika",
    "இலங்கை எரிப்பு": "burning lanka",
    "இலங்கை எரிந்தது": "burning lanka",
    "சூடாமணி": "chudamani",
    "இராமனின் மோதிரம்": "rama ring",
    "இராவணன் அவை": "ravana court",
    "லங்கினி": "lankini",
    "சுரசா": "surasa",
    "சிம்ஹிகா": "simhika",
    "இந்திரஜித்": "indrajit",
    "முக்கியத்துவம்": "significance",
    "எங்கே": "where",
    "எப்படி": "how",

    "வாட் இஸ்": "what is",
    "வாட்": "what",
    "இஸ்": "is",
    "ஹூ இஸ்": "who is",
    "ஹூ": "who",
    "யார்": "who",
    "யாரு": "who",
    "வாட் ஆர்": "what are",
    "ஆர்": "are",
    "அபவுட்": "about",
    "பற்றி": "about",
    "டெல்": "tell",
    "சொல்லு": "tell",
    "சொல்லுங்க": "tell",
    "என்ன": "what",
  };

  // =====================================================
  // NORMALIZE QUESTION
  // =====================================================

  const normalizeQuestion = (userQuestion) => {
    let normalizedText = userQuestion.toLowerCase().trim();

    TAMIL_STEM_RULES.forEach(([pattern, replacement]) => {
      normalizedText = normalizedText.replace(
        pattern,
        replacement
      );
    });

    const aliases = Object.keys(tamilAliases).sort(
      (a, b) => b.length - a.length
    );

    aliases.forEach((alias) => {
      normalizedText = normalizedText.replace(
        new RegExp(alias, "gi"),
        ` ${tamilAliases[alias]} `
      );
    });

    normalizedText = normalizedText.replace(
      /[?!.,:;'"`’‘“”]/g,
      " "
    );

    normalizedText = normalizedText.replace(
      /\s+/g,
      " "
    );

    return normalizedText.trim();
  };

  // =====================================================
  // GET NAVARATHIRI DAYS
  // =====================================================

  const getNavarathiriDays = () => {
    return dataset.entries
      .filter(
        (entry) =>
          entry.category
            ?.toLowerCase()
            .includes("navarathiri") &&
          Number(entry.day) >= 1 &&
          Number(entry.day) <= 9
      )
      .sort(
        (a, b) =>
          Number(a.day) - Number(b.day)
      );
  };

  // =====================================================
  // CREATE VISUAL DATA
  // =====================================================

  const createChartData = (entry) => {
    if (!entry) return null;

    const category =
      entry.category?.toLowerCase() || "";

    const title =
      entry.title?.toLowerCase() || "";

    const visualType =
      entry.visual_type?.toLowerCase() || "";

    // SUNDARAKANDA

    if (
      category.includes(SK_CATEGORY) ||
      visualType.includes("sundarakanda") ||
      (entry.epic?.toLowerCase() === "ramayana" &&
        entry.book?.toLowerCase() ===
          "sundarakanda")
    ) {
      return {
        type: "sundarakanda",
        title: entry.title,
        category: entry.category,
        stage:
          typeof entry.stage === "number"
            ? entry.stage
            : null,
        keywords: entry.keywords || [],
        visualType: entry.visual_type,
      };
    }

    // NAVARATHIRI DAY

    if (
      Number(entry.day) >= 1 &&
      Number(entry.day) <= 9
    ) {
      return {
        type: "navarathiri-day",
        title: entry.title,
        category: entry.category,
        day: entry.day,
        goddess: entry.goddess,
        goddessTamil: entry.goddess_tamil,
        tamil: entry.tamil,
        english: entry.english,
        visualType: entry.visual_type,
      };
    }

    // NAVARATHIRI OVERVIEW

    if (
      visualType.includes("navarathiri") ||
      visualType.includes("nine") ||
      visualType.includes("day") ||
      category.includes("navarathiri") ||
      title.includes("navarathiri")
    ) {
      return {
        type: "navarathiri",
        title: entry.title,
        category: entry.category,
        keywords: entry.keywords || [],
        visualType: entry.visual_type,
        days: getNavarathiriDays(),
      };
    }

    // RAMAYANA

    if (
      category.includes("ramayana") ||
      title.includes("ramayana") ||
      visualType.includes("ram")
    ) {
      return {
        type: "ramayana",
        title: entry.title,
        category: entry.category,
        keywords: entry.keywords || [],
        visualType: entry.visual_type,
      };
    }

    // MAHABHARATA

    if (
      category.includes("mahabharata") ||
      title.includes("mahabharata") ||
      visualType.includes("maha")
    ) {
      return {
        type: "mahabharata",
        title: entry.title,
        category: entry.category,
        keywords: entry.keywords || [],
        visualType: entry.visual_type,
      };
    }

    return {
      type: "topic",
      title: entry.title,
      category: entry.category,
      keywords: entry.keywords || [],
      visualType: entry.visual_type,
    };
  };

  // =====================================================
  // HISTORY ICON
  // =====================================================

  const getHistoryIcon = (item) => {
    const text =
      item.question?.toLowerCase() || "";

    const chartType =
      item.chart?.type || "";

    if (
      chartType === "navarathiri-day"
    ) {
      return Number(item.chart.day) === 9
        ? "🌺"
        : "🌸";
    }

    if (
      chartType === "navarathiri"
    ) {
      return "🪔";
    }

    if (
      chartType === "sundarakanda" ||
      text.includes("sundara") ||
      text.includes("சுந்தர")
    ) {
      return "🙏";
    }

    if (
      text.includes("ramayana") ||
      text.includes("rama") ||
      text.includes("ராம")
    ) {
      return "🏹";
    }

    if (
      text.includes("hanuman") ||
      text.includes("அனுமன்")
    ) {
      return "🙏";
    }

    if (
      text.includes("mahabharata") ||
      text.includes("pandava") ||
      text.includes("kaurava") ||
      text.includes("மகாபாரத")
    ) {
      return "⚔️";
    }

    if (
      text.includes("gita") ||
      text.includes("கீதை")
    ) {
      return "📖";
    }

    return "✦";
  };

  // =====================================================
  // TEXT TO SPEECH
  // =====================================================

  const speakAnswer = (
    text,
    selectedLanguage,
    conversationId = null
  ) => {
    if (!window.speechSynthesis) {
      console.log(
        "Speech Synthesis is not supported."
      );
      return;
    }

    window.speechSynthesis.cancel();

    setIsSpeaking(false);
    setSpeakingConversationId(null);

    const speak = () => {
      const voices =
        window.speechSynthesis.getVoices();

      const speech =
        new SpeechSynthesisUtterance(text);

      if (selectedLanguage === "tamil") {
        const tamilVoice =
          voices.find(
            (voice) =>
              voice.lang &&
              voice.lang
                .toLowerCase()
                .startsWith("ta")
          );

        if (tamilVoice) {
          speech.voice = tamilVoice;
          speech.lang = tamilVoice.lang;
        } else {
          speech.lang = "ta-IN";
        }
      } else {
        const englishVoice =
          voices.find(
            (voice) =>
              voice.lang &&
              voice.lang
                .toLowerCase() === "en-in"
          ) ||
          voices.find(
            (voice) =>
              voice.lang &&
              voice.lang
                .toLowerCase()
                .startsWith("en")
          );

        if (englishVoice) {
          speech.voice = englishVoice;
          speech.lang = englishVoice.lang;
        } else {
          speech.lang = "en-IN";
        }
      }

      speech.rate = 0.9;
      speech.pitch = 1;
      speech.volume = 1;

      speech.onstart = () => {
        setIsSpeaking(true);
        setSpeakingConversationId(
          conversationId
        );
      };

      speech.onend = () => {
        setIsSpeaking(false);
        setSpeakingConversationId(null);
      };

      speech.onerror = (event) => {
        console.log(
          "Speech error:",
          event.error
        );

        setIsSpeaking(false);
        setSpeakingConversationId(null);
      };

      window.speechSynthesis.speak(speech);
    };

    const voices =
      window.speechSynthesis.getVoices();

    if (voices.length === 0) {
      window.speechSynthesis.onvoiceschanged =
        () => {
          speak();
          window.speechSynthesis.onvoiceschanged =
            null;
        };
    } else {
      speak();
    }
  };

  // =====================================================
  // LISTEN TO ANSWER
  // =====================================================

  const handleAnswerVoice = (item) => {
    if (!item) return;

    const isCurrentSpeaking =
      isSpeaking &&
      speakingConversationId === item.id;

    if (isCurrentSpeaking) {
      stopSpeaking();
      return;
    }

    speakAnswer(
      item.answer,
      item.language,
      item.id
    );
  };

  // =====================================================
  // FIND ANSWER
  // =====================================================

  const findAnswer = (userQuestion) => {
    const originalText =
      userQuestion.toLowerCase().trim();

    if (!originalText) return;

    const normalizedText =
      normalizeQuestion(originalText);

    const scoredEntries =
      ALL_ENTRIES
        .map((entry) => {
          let score = 0;

          const isSundarakanda =
            entry.category
              ?.toLowerCase()
              .includes(SK_CATEGORY) ||
            entry.book
              ?.toLowerCase() === SK_CATEGORY ||
            entry.visual_type
              ?.toLowerCase()
              .includes(SK_CATEGORY);

          let multiWordHit = false;

          const title =
            entry.title?.toLowerCase() || "";

          const keywords =
            entry.keywords || [];

          if (
            normalizedText.includes(title) &&
            title.length > 2
          ) {
            score += 20;
          }

          keywords.forEach((keyword) => {
            const normalizedKeyword =
              cleanText(keyword);

            if (!normalizedKeyword) return;

            const wordCount =
              normalizedKeyword.split(" ")
                .length;

            const isPhrase =
              isSundarakanda &&
              wordCount > 1;

            const weight = isPhrase
              ? 12 +
                8 * (wordCount - 1)
              : 10;

            const originalWeight =
              isPhrase
                ? weight - 2
                : 8;

            if (
              normalizedText.includes(
                normalizedKeyword
              )
            ) {
              score += weight;

              if (isPhrase) {
                multiWordHit = true;
              }
            }

            if (
              originalText.includes(
                normalizedKeyword
              )
            ) {
              score += originalWeight;
            }
          });

          if (
            entry.day &&
            normalizedText.includes(
              `day ${entry.day}`
            )
          ) {
            score += 25;
          }

          if (
            entry.goddess &&
            normalizedText.includes(
              entry.goddess.toLowerCase()
            )
          ) {
            score += 20;
          }

          const category =
            entry.category?.toLowerCase() ||
            "";

          if (
            category &&
            normalizedText.includes(category)
          ) {
            score += 4;
          }

          if (
            isSundarakanda &&
            multiWordHit
          ) {
            score += 10;
          }

          return {
            entry,
            score,
          };
        })
        .filter(
          (item) => item.score > 0
        )
        .sort(
          (a, b) =>
            b.score - a.score
        );

    const matchedEntry =
      scoredEntries.length > 0
        ? scoredEntries[0].entry
        : null;

    // =================================================
    // ANSWER FOUND
    // =================================================

    if (matchedEntry) {
      const responseText =
        language === "tamil"
          ? matchedEntry.tamil
          : matchedEntry.english;

      const newChartData =
        createChartData(
          matchedEntry
        );

      const newId =
        `${Date.now()}-${Math.random()}`;

      setQuestion(userQuestion);
      setAnswer(responseText);
      setChartData(newChartData);

      setConversation((previous) => [
        ...previous,
        {
          id: newId,
          question: userQuestion,
          answer: responseText,
          chart: newChartData,
          language,
        },
      ]);

      setSelectedConversationId(
        newId
      );

      speakAnswer(
        responseText,
        language,
        newId
      );

      return;
    }

    // =================================================
    // ANSWER NOT FOUND
    // =================================================

    const responseText =
      language === "tamil"
        ? "மன்னிக்கவும், இந்த கேள்விக்கான தகவல் தற்போது என் dataset-ல் இல்லை. நவராத்திரி, ராமாயணம், சுந்தரகாண்டம் அல்லது மகாபாரதம் தொடர்பான கேள்வியை கேளுங்கள்."
        : "Sorry, I don't have information about this question yet. Try asking about Navarathiri, Ramayana, Sundarakanda or Mahabharata.";

    const newId =
      `${Date.now()}-${Math.random()}`;

    setQuestion(userQuestion);
    setAnswer(responseText);
    setChartData(null);

    setConversation((previous) => [
      ...previous,
      {
        id: newId,
        question: userQuestion,
        answer: responseText,
        chart: null,
        language,
      },
    ]);

    setSelectedConversationId(newId);

    speakAnswer(
      responseText,
      language,
      newId
    );
  };

  // =====================================================
  // SUGGESTION
  // =====================================================

  const handleSuggestion = (text) => {
    findAnswer(text);
  };

  // =====================================================
  // MICROPHONE
  // =====================================================

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      const responseText =
        language === "tamil"
          ? "இந்த browser-ல் voice recognition support இல்லை."
          : "Voice recognition is not supported in this browser.";

      setAnswer(responseText);
      return;
    }

    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();

      setIsSpeaking(false);
      setSpeakingConversationId(null);
    }

    const recognition =
      new SpeechRecognition();

    recognition.lang =
      language === "tamil"
        ? "ta-IN"
        : "en-IN";

    recognition.interimResults = false;
    recognition.continuous = false;

    setIsListening(true);

    setQuestion("");
    setAnswer("");
    setChartData(null);

    recognition.start();

    recognition.onresult = (event) => {
      const spokenText =
        event.results[0][0]
          .transcript;

      findAnswer(spokenText);
    };

    recognition.onerror = (event) => {
      console.log(
        "Recognition error:",
        event.error
      );

      setIsListening(false);

      const responseText =
        language === "tamil"
          ? "Voice கேட்கும்போது ஒரு பிரச்சனை ஏற்பட்டது. மீண்டும் முயற்சி செய்."
          : "There was a problem with voice recognition. Please try again.";

      setAnswer(responseText);
    };

    recognition.onend = () => {
      setIsListening(false);
    };
  };

  // =====================================================
  // STOP SPEAKING
  // =====================================================

  const stopSpeaking = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();

      setIsSpeaking(false);
      setSpeakingConversationId(null);
    }
  };

  // =====================================================
  // CLEAR HISTORY
  // =====================================================

  const clearHistory = () => {
    stopSpeaking();

    setConversation([]);
    setSelectedConversationId(null);

    setQuestion("");
    setAnswer("");
    setChartData(null);
  };

  // =====================================================
  // SELECT HISTORY
  // =====================================================

  const selectConversation = (item) => {
    stopSpeaking();

    setSelectedConversationId(
      item.id
    );

    setQuestion(item.question);
    setAnswer(item.answer);
    setChartData(item.chart);
  };

  // =====================================================
  // CHANGE LANGUAGE
  // =====================================================

  const changeLanguage = (lang) => {
    stopSpeaking();

    setLanguage(lang);

    setQuestion("");
    setAnswer("");
    setChartData(null);
  };

  // =====================================================
  // SELECTED CONVERSATION
  // =====================================================

  const selectedConversation =
    conversation.find(
      (item) =>
        item.id ===
        selectedConversationId
    ) || null;

  // =====================================================
  // RENDER VISUAL
  // =====================================================

  const renderChart = (
    chart,
    displayLanguage = language
  ) => {
    if (!chart) return null;

    return (
      <div className="visual-card">

        <div className="visual-header">
          <span>📊</span>

          <span>
            {displayLanguage === "tamil"
              ? "தலைப்பு சுருக்கம்"
              : "Topic Overview"}
          </span>
        </div>

        {/* NAVARATHIRI */}

        {chart.type ===
          "navarathiri" && (
          <>
            <div className="visual-main">

              <div className="visual-icon">
                🪔
              </div>

              <div>
                <h3>
                  {displayLanguage ===
                  "tamil"
                    ? "நவராத்திரி"
                    : "Navarathiri"}
                </h3>

                <p>
                  {displayLanguage ===
                  "tamil"
                    ? "9 நாட்கள் • பாரம்பரியம் • ஆன்மீகம்"
                    : "9 Days • Tradition • Spirituality"}
                </p>
              </div>

            </div>

            <div className="nine-day-preview">

              {chart.days?.map(
                (day) => (
                  <div
                    className="day-item"
                    key={`${day.day}-${day.goddess}`}
                  >

                    <span>
                      {day.day}
                    </span>

                    <strong>
                      {displayLanguage ===
                      "tamil"
                        ? day.goddess_tamil
                        : day.goddess}
                    </strong>

                    <small>
                      {displayLanguage ===
                      "tamil"
                        ? `நாள் ${day.day}`
                        : `Day ${day.day}`}
                    </small>

                    <p>
                      {displayLanguage ===
                      "tamil"
                        ? day.tamil
                        : day.english}
                    </p>

                  </div>
                )
              )}

            </div>
          </>
        )}

        {/* SINGLE DAY */}

        {chart.type ===
          "navarathiri-day" && (
          <div className="single-day-visual">

            <div className="single-day-number">
              {chart.day}
            </div>

            <div className="single-day-content">

              <span className="single-day-label">
                {displayLanguage ===
                "tamil"
                  ? `நவராத்திரி நாள் ${chart.day}`
                  : `Navarathiri Day ${chart.day}`}
              </span>

              <h3>
                {displayLanguage ===
                "tamil"
                  ? chart.goddessTamil
                  : chart.goddess}
              </h3>

              <p className="day-description">
                {displayLanguage ===
                "tamil"
                  ? "நவதுர்கை மரபில் தொடர்புடைய தேவி"
                  : "Goddess associated with the commonly described Navadurga sequence"}
              </p>

              <div className="day-significance">

                <span>
                  ✦{" "}
                  {displayLanguage ===
                  "tamil"
                    ? "சிறப்பு"
                    : "Special Significance"}
                </span>

                <p>
                  {displayLanguage ===
                  "tamil"
                    ? chart.tamil
                    : chart.english}
                </p>

              </div>

            </div>

          </div>
        )}

        {/* SUNDARAKANDA */}

        {chart.type ===
          "sundarakanda" && (
          <div className="sk-visual">

            <div className="sk-visual-head">

              <div className="sk-visual-icon">
                🙏
              </div>

              <div>
                <h3>
                  {displayLanguage ===
                  "tamil"
                    ? "சுந்தரகாண்டம்"
                    : "Sundarakanda"}
                </h3>

                <p>
                  {displayLanguage ===
                  "tamil"
                    ? "அனுமனின் இலங்கைப் பயணம்"
                    : "Hanuman's journey to Lanka"}
                </p>
              </div>

            </div>

            <div className="sk-flow">

              {SK_STAGES.map(
                (stage, index) => (
                  <Fragment
                    key={stage.en}
                  >

                    <div
                      className={`sk-stage ${
                        chart.stage ===
                        null
                          ? "sk-stage-all"
                          : ""
                      } ${
                        chart.stage ===
                        index
                          ? "sk-stage-active"
                          : ""
                      }`}
                    >

                      <span className="sk-stage-icon">
                        {stage.icon}
                      </span>

                      <div className="sk-stage-text">

                        <strong>
                          {displayLanguage ===
                          "tamil"
                            ? stage.ta
                            : stage.en}
                        </strong>

                        <small>
                          {displayLanguage ===
                          "tamil"
                            ? stage.taNote
                            : stage.enNote}
                        </small>

                      </div>

                    </div>

                    {index <
                      SK_STAGES.length -
                        1 && (
                      <span className="sk-arrow">
                        →
                      </span>
                    )}

                  </Fragment>
                )
              )}

            </div>

            <div className="sk-themes">

              {(displayLanguage ===
              "tamil"
                ? [
                    "பக்தி",
                    "துணிவு",
                    "அறிவு",
                    "நம்பிக்கை",
                    "தர்மம்",
                  ]
                : [
                    "Devotion",
                    "Courage",
                    "Intelligence",
                    "Hope",
                    "Dharma",
                  ]
              ).map((theme) => (
                <span key={theme}>
                  {theme}
                </span>
              ))}

            </div>

          </div>
        )}

        {/* RAMAYANA */}

        {chart.type ===
          "ramayana" && (
          <div className="epic-visual">

            <div className="epic-icon">
              🏹
            </div>

            <div className="epic-content">

              <h3>
                Ramayana
              </h3>

              <div className="epic-flow">

                <span>
                  👑 Rama
                </span>

                <b>→</b>

                <span>
                  🌳 Exile
                </span>

                <b>→</b>

                <span>
                  🙏 Hanuman
                </span>

                <b>→</b>

                <span>
                  🏰 Lanka
                </span>

                <b>→</b>

                <span>
                  ✨ Return
                </span>

              </div>

              <p>
                {displayLanguage ===
                "tamil"
                  ? "ராமரின் வாழ்க்கைப் பயணத்தின் முக்கிய நிகழ்வுகள்"
                  : "Major events in Rama's journey"}
              </p>

            </div>

          </div>
        )}

        {/* MAHABHARATA */}

        {chart.type ===
          "mahabharata" && (
          <div className="epic-visual">

            <div className="epic-icon">
              ⚔️
            </div>

            <div className="epic-content">

              <h3>
                Mahabharata
              </h3>

              <div className="epic-flow">

                <span>
                  👑 Pandavas
                </span>

                <b>VS</b>

                <span>
                  👑 Kauravas
                </span>

                <b>→</b>

                <span>
                  ⚔️ Kurukshetra
                </span>

                <b>→</b>

                <span>
                  📖 Gita
                </span>

              </div>

              <p>
                {displayLanguage ===
                "tamil"
                  ? "மகாபாரதத்தின் முக்கிய கதைக்களம்"
                  : "Major storyline of the Mahabharata"}
              </p>

            </div>

          </div>
        )}

        {/* DEFAULT TOPIC */}

        {chart.type === "topic" && (
          <>
            <div className="visual-main">

              <div className="visual-icon">
                ✦
              </div>

              <div>

                <h3>
                  {chart.title}
                </h3>

                <p>
                  {chart.category}
                </p>

              </div>

            </div>

            <div className="visual-stats">

              <div className="stat">

                <strong>
                  {chart.keywords.length}
                </strong>

                <span>
                  Keywords
                </span>

              </div>

              <div className="stat">

                <strong>
                  {chart.category}
                </strong>

                <span>
                  Category
                </span>

              </div>

            </div>
          </>
        )}

      </div>
    );
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="app">

      {/* =================================================
          PREMIUM GOLU BACKGROUND
          Rendered by App.css pseudo-elements and lamp layers.
      ================================================= */}
      <div className="glow glow-one" aria-hidden="true"></div>
      <div className="glow glow-two" aria-hidden="true"></div>

      {/* =================================================
          APP LAYOUT
      ================================================= */}

      <div className="app-layout">

        {/* SIDEBAR */}

        <aside className="history-sidebar">

          <div className="sidebar-brand">

            <div className="sidebar-logo-icon">
              ✦
            </div>

            <div>
              <h2>
                Navarathiri AI
              </h2>

              <span>
                Voice Knowledge Assistant
              </span>
            </div>

          </div>

          <div className="history-heading">

            <span>
              CHAT HISTORY
            </span>

            <span className="history-count">
              {conversation.length}
            </span>

          </div>

          <div className="history-list">

            {conversation.length ===
            0 ? (

              <div className="empty-history">

                <div className="empty-history-icon">
                  🪔
                </div>

                <p>
                  {language ===
                  "tamil"
                    ? "உங்கள் கேள்விகள் இங்கே சேமிக்கப்படும்"
                    : "Your conversations will appear here"}
                </p>

              </div>

            ) : (

              conversation.map(
                (item) => (

                  <button
                    key={item.id}
                    className={`history-item ${
                      selectedConversationId ===
                      item.id
                        ? "history-active"
                        : ""
                    }`}
                    onClick={() =>
                      selectConversation(
                        item
                      )
                    }
                  >

                    <span className="history-item-icon">
                      {getHistoryIcon(
                        item
                      )}
                    </span>

                    <span className="history-item-text">
                      {item.question}
                    </span>

                  </button>

                )
              )

            )}

          </div>

          <div className="sidebar-bottom">

            <button
              className="clear-history"
              onClick={
                clearHistory
              }
              disabled={
                conversation.length ===
                0
              }
            >

              <span>
                🗑
              </span>

              <span>
                {language ===
                "tamil"
                  ? "வரலாற்றை அழி"
                  : "Clear History"}
              </span>

            </button>

            <div className="sidebar-language">

              <button
                className={
                  language ===
                  "tamil"
                    ? "sidebar-lang-active"
                    : ""
                }
                onClick={() =>
                  changeLanguage(
                    "tamil"
                  )
                }
              >
                தமிழ்
              </button>

              <span>
                |
              </span>

              <button
                className={
                  language ===
                  "english"
                    ? "sidebar-lang-active"
                    : ""
                }
                onClick={() =>
                  changeLanguage(
                    "english"
                  )
                }
              >
                English
              </button>

            </div>

          </div>

        </aside>

        {/* =================================================
            MAIN AREA
        ================================================= */}

        <div className="main-area">

          {/* HEADER */}

          <header className="main-header">

            <div>

              <span className="main-header-label">
                ✦ VOICE AI
              </span>

              <h1>
                Navarathiri AI
              </h1>

            </div>

            <div className="header-status">

              <span className="status-dot"></span>

              AI Ready

            </div>

          </header>

          {/* MAIN */}

          <main className="main">

            <div className="hero">

              <div className="badge">
                ✦ VOICE AI • NAVARATHIRI
              </div>

              <h2>

                {selectedConversation
                  ? "Your Conversation"
                  : (
                    <>
                      Your Personal

                      <span>
                        {" "}
                        Navarathiri{" "}
                      </span>

                      Assistant
                    </>
                  )}

              </h2>

              <p>
                {language ===
                "tamil"
                  ? "நவராத்திரி, ராமாயணம், சுந்தரகாண்டம் மற்றும் மகாபாரதம் பற்றி கேளுங்கள்."
                  : "Ask anything about Navarathiri, Ramayana, Sundarakanda and Mahabharata."}
              </p>

              {/* =================================================
                  SELECTED CHAT
              ================================================= */}

              {selectedConversation && (

                <div className="conversation">

                  <div className="conversation-turn">

                    {/* USER QUESTION */}

                    <div className="question-box">

                      <span>
                        🎤
                      </span>

                      <p>
                        {
                          selectedConversation.question
                        }
                      </p>

                    </div>

                    {/* AI ANSWER */}

                    <div className="answer-box">

                      <div className="answer-top-row">

                        <div className="answer-title">
                          ✦ Navarathiri AI
                        </div>

                        {/* SEPARATE LISTEN BUTTON */}

                        <button
                          className={`answer-voice-button ${
                            isSpeaking &&
                            speakingConversationId ===
                              selectedConversation.id
                              ? "voice-playing"
                              : ""
                          }`}
                          onClick={() =>
                            handleAnswerVoice(
                              selectedConversation
                            )
                          }
                          title={
                            isSpeaking &&
                            speakingConversationId ===
                              selectedConversation.id
                              ? "Stop voice"
                              : "Listen to answer"
                          }
                        >

                          <span>
                            {isSpeaking &&
                            speakingConversationId ===
                              selectedConversation.id
                              ? "🔇"
                              : "🔊"}
                          </span>

                          <span>
                            {isSpeaking &&
                            speakingConversationId ===
                              selectedConversation.id
                              ? "Stop"
                              : "Listen"}
                          </span>

                        </button>

                      </div>

                      <p>
                        {
                          selectedConversation.answer
                        }
                      </p>

                      {isSpeaking &&
                        speakingConversationId ===
                          selectedConversation.id && (

                          <div className="speaking-status">

                            🔊{" "}

                            {
                              selectedConversation.language ===
                              "tamil"
                                ? "பதில் சொல்கிறேன்..."
                                : "Speaking answer..."
                            }

                          </div>

                        )}

                    </div>

                    {/* VISUAL */}

                    {selectedConversation.chart &&
                      renderChart(
                        selectedConversation.chart,
                        selectedConversation.language
                      )}

                  </div>

                  <div
                    ref={
                      conversationEndRef
                    }
                  />

                </div>

              )}

              {/* =================================================
                  MICROPHONE
              ================================================= */}

              <button
                className={`mic-button ${
                  isListening
                    ? "listening"
                    : ""
                }`}
                onClick={
                  startListening
                }
              >

                <span className="mic-icon">
                  🎙
                </span>

              </button>

              <div className="mic-text">

                {isListening
                  ? language ===
                    "tamil"
                    ? "கேட்கிறேன்..."
                    : "Listening..."

                  : isSpeaking
                  ? language ===
                    "tamil"
                    ? "பதில் சொல்கிறேன்..."
                    : "Speaking..."

                  : language ===
                    "tamil"
                  ? "பேசுவதற்கு அழுத்தவும்"
                  : "Tap to speak"}

              </div>

              {/* =================================================
                  SUGGESTIONS
              ================================================= */}

              <div className="suggestions">

                {SUGGESTIONS.map(
                  (item) => (

                    <button
                      key={item.label}
                      onClick={() =>
                        handleSuggestion(
                          item.query
                        )
                      }
                    >
                      {item.label}
                    </button>

                  )
                )}

              </div>

            </div>

          </main>

          {/* FOOTER */}

          <footer>

            <span>
              Navarathiri AI
            </span>

            <span>
              •
            </span>

            <span>
              Ask. Listen. Learn.
            </span>

          </footer>

        </div>

      </div>

    </div>
  );
}

export default App;