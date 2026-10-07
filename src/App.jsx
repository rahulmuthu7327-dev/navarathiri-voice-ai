import { useEffect, useRef, useState } from "react";

import "./App.css";
import "./sundarakanda.css";

import navarathiriDataset from "./data/navarathiri_voice_ai_dataset.json";
import sundarakandaDataset from "./data/sundarakanda_dataset.json";
import expandedDataset from "./data/navarathiri_voice_ai_expanded_epics_dataset.json";

/* =========================================================
   BASIC TEXT HELPERS
========================================================= */

const cleanText = (value = "") =>
  String(value)
    .toLowerCase()
    .replace(/[?!.,:;'"`’‘“”]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const escapeRegExp = (value = "") =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/*
  IMPORTANT:
  English/Tanglish words use whole-word matching.
  So "rama" will NOT match "ramayana".
*/
const containsTerm = (text, term) => {
  const source = cleanText(text);
  const target = cleanText(term);

  if (!target) return false;

  if (/^[a-z0-9 ]+$/i.test(target)) {
    const pattern = new RegExp(
      `(^|\\s)${escapeRegExp(target)}(?=\\s|$)`,
      "i"
    );

    return pattern.test(` ${source} `);
  }

  // Tamil does not always have whitespace boundaries.
  return source.includes(target);
};

/* =========================================================
   SUNDARAKANDA DATA NORMALIZATION
========================================================= */

const rawSundarakandaEntries = Array.isArray(
  sundarakandaDataset.entries
)
  ? sundarakandaDataset.entries
  : Array.isArray(
      sundarakandaDataset.narratives
    )
  ? sundarakandaDataset.narratives
  : [];

const sundarakandaEntries =
  rawSundarakandaEntries.map(
    (entry, index) => ({
      ...entry,

      id: `sundarakanda_${
        entry.id ?? index + 1
      }`,

      title:
        entry.title ||
        entry.section ||
        `Sundarakanda Episode ${
          index + 1
        }`,

      category:
        entry.category ||
        "Sundarakanda",

      epic:
        entry.epic ||
        "Ramayana",

      visual_type:
        entry.visual_type ||
        "sundarakanda",

      keywords: [
        ...(Array.isArray(
          entry.keywords
        )
          ? entry.keywords
          : []),

        ...(Array.isArray(
          entry.keyCharacters
        )
          ? entry.keyCharacters
          : []),

        "sundarakanda",
        "sundarakandam",
        "sundara kanda",
      ],
    })
  );

/* =========================================================
   COMBINE ALL DATASETS
========================================================= */

const ALL_ENTRIES = [
  ...sundarakandaEntries,

  ...(navarathiriDataset.entries ||
    []),

  ...(expandedDataset.entries ||
    []),
].filter(
  (entry, index, array) =>
    index ===
    array.findIndex(
      (item) =>
        String(item.id) ===
        String(entry.id)
    )
);

/* =========================================================
   CHARACTER ALIASES
========================================================= */

const CHARACTER_ALIASES = {
  arjuna: [
    "arjuna",
    "arjun",
    "அர்ஜுனன்",
    "அர்ஜுனர்",
  ],

  bhima: [
    "bhima",
    "bheema",
    "பீமன்",
  ],

  yudhishthira: [
    "yudhishthira",
    "yudhishtran",
    "யுதிஷ்டிரர்",
    "யுதிஷ்டிரன்",
  ],

  nakula: [
    "nakula",
    "நகுலன்",
  ],

  sahadeva: [
    "sahadeva",
    "சகதேவன்",
  ],

  draupadi: [
    "draupadi",
    "droupadi",
    "திரௌபதி",
    "துரௌபதி",
    "பாஞ்சாலி",
  ],

  duryodhana: [
    "duryodhana",
    "துரியோதனன்",
  ],

  karna: [
    "karna",
    "கர்ணன்",
  ],

  bhishma: [
    "bhishma",
    "பீஷ்மர்",
  ],

  drona: [
    "drona",
    "துரோணர்",
  ],

  kunti: [
    "kunti",
    "குந்தி",
  ],

  gandhari: [
    "gandhari",
    "காந்தாரி",
  ],

  krishna: [
    "krishna",
    "கிருஷ்ணர்",
    "கிருஷ்ணா",
  ],

  rama: [
    "rama",
    "ஸ்ரீராமர்",
    "ராமர்",
  ],

  sita: [
    "sita",
    "சீதை",
  ],

  lakshmana: [
    "lakshmana",
    "லட்சுமணன்",
    "லட்சுமணர்",
  ],

  hanuman: [
    "hanuman",
    "anjaneya",
    "maruti",
    "ஹனுமான்",
    "அனுமன்",
    "ஆஞ்சநேயர்",
    "மாருதி",
  ],

  ravana: [
    "ravana",
    "ravanan",
    "ராவணன்",
    "இராவணன்",
  ],

  bharata: [
    "bharata",
    "பரதன்",
  ],

  sugreeva: [
    "sugriva",
    "sugreeva",
    "சுக்ரீவன்",
  ],

  vali: [
    "vali",
    "வாலி",
  ],

  vibhishana: [
    "vibhishana",
    "விபீஷணன்",
  ],
};

/* =========================================================
   TAMIL ALIASES
========================================================= */

const TAMIL_ALIASES = {
  "நவராத்திரி":
    "navarathiri",

  "நவராத்திரி பற்றி":
    "navarathiri",

  "நவராத்திரி என்ன":
    "what is navarathiri",

  "கொலு":
    "golu",

  "கோலு":
    "golu",

  "முதல் நாள்":
    "day 1",

  "முதலாம் நாள்":
    "day 1",

  "நாள் ஒன்று":
    "day 1",

  "நாள் 1":
    "day 1",

  "இரண்டாம் நாள்":
    "day 2",

  "இரண்டாவது நாள்":
    "day 2",

  "நாள் இரண்டு":
    "day 2",

  "நாள் 2":
    "day 2",

  "மூன்றாம் நாள்":
    "day 3",

  "மூன்றாவது நாள்":
    "day 3",

  "நாள் மூன்று":
    "day 3",

  "நாள் 3":
    "day 3",

  "நான்காம் நாள்":
    "day 4",

  "நான்காவது நாள்":
    "day 4",

  "நாள் நான்கு":
    "day 4",

  "நாள் 4":
    "day 4",

  "ஐந்தாம் நாள்":
    "day 5",

  "ஐந்தாவது நாள்":
    "day 5",

  "நாள் ஐந்து":
    "day 5",

  "நாள் 5":
    "day 5",

  "ஆறாம் நாள்":
    "day 6",

  "ஆறாவது நாள்":
    "day 6",

  "நாள் ஆறு":
    "day 6",

  "நாள் 6":
    "day 6",

  "ஏழாம் நாள்":
    "day 7",

  "ஏழாவது நாள்":
    "day 7",

  "நாள் ஏழு":
    "day 7",

  "நாள் 7":
    "day 7",

  "எட்டாம் நாள்":
    "day 8",

  "எட்டாவது நாள்":
    "day 8",

  "நாள் எட்டு":
    "day 8",

  "நாள் 8":
    "day 8",

  "ஒன்பதாம் நாள்":
    "day 9",

  "ஒன்பதாவது நாள்":
    "day 9",

  "நாள் ஒன்பது":
    "day 9",

  "நாள் 9":
    "day 9",

  /* RAMAYANA */

  "ராமாயணம்":
    "ramayana",

  "ராமாயணம் பற்றி":
    "ramayana",

  "ராமர்":
    "rama",

  "ஸ்ரீராமர்":
    "rama",

  "சீதை":
    "sita",

  "லட்சுமணன்":
    "lakshmana",

  "லட்சுமணர்":
    "lakshmana",

  "பரதன்":
    "bharata",

  "அனுமன்":
    "hanuman",

  "அனுமன் யார்":
    "hanuman",

  "ஹனுமான்":
    "hanuman",

  "ராவணன்":
    "ravana",

  "ராவணன் யார்":
    "ravana",

  "வாலி":
    "vali",

  "சுக்ரீவன்":
    "sugriva",

  "விபீஷணன்":
    "vibhishana",

  /* SUNDARAKANDA */

  "சுந்தரகாண்டம்":
    "sundarakanda",

  "சுந்தர காண்டம்":
    "sundarakanda",

  "சுந்தரகாண்டத்தைப் பற்றி":
    "sundarakanda",

  "சுந்தரகாண்டத்தின் முக்கியத்துவம்":
    "sundarakanda significance",

  "சுந்தரகாண்டம் முக்கியத்துவம்":
    "sundarakanda significance",

  "அனுமனின் பெரும் பாய்ச்சல்":
    "hanuman great leap",

  "அனுமன் கடலைத் தாண்டியது":
    "hanuman ocean crossing",

  "அனுமன் கடலை தாண்டியது":
    "hanuman ocean crossing",

  "அனுமன் சீதையை எங்கே கண்டார்":
    "where hanuman found sita",

  "சீதை எங்கே":
    "where sita",

  "அசோகவனம்":
    "ashoka vatika",

  "அசோக வனம்":
    "ashoka vatika",

  "இலங்கை எரிப்பு":
    "burning lanka",

  "இலங்கை எரிந்தது":
    "burning lanka",

  "சூடாமணி":
    "chudamani",

  "சீதையின் சூடாமணி":
    "chudamani",

  "இராமனின் மோதிரம்":
    "rama ring",

  "ராமனின் மோதிரம்":
    "rama ring",

  "ராவணன் அவை":
    "ravana court",

  "இராவணன் அவை":
    "ravana court",

  "லங்கினி":
    "lankini",

  "லங்கிணி":
    "lankini",

  "சுரசா":
    "surasa",

  "சிம்ஹிகா":
    "simhika",

  "மைநாகன்":
    "mainaka",

  "இந்திரஜித்":
    "indrajit",

  /* MAHABHARATA */

  "மகாபாரதம்":
    "mahabharata",

  "மகாபாரதம் பற்றி":
    "mahabharata",

  "பாண்டவர்கள்":
    "pandavas",

  "பாண்டவர்கள் யார்":
    "pandavas",

  "கௌரவர்கள்":
    "kauravas",

  "கௌரவர்கள் யார்":
    "kauravas",

  "குருக்ஷேத்திரம்":
    "kurukshetra",

  /* GITA */

  "பகவத் கீதை":
    "bhagavad gita",

  "பகவத் கீதை என்ன":
    "bhagavad gita",

  "கீதை":
    "gita",

  /* QUESTION WORDS */

  "முக்கியத்துவம்":
    "significance",

  "சிறப்பு":
    "importance",

  "எங்கே":
    "where",

  "யார்":
    "who",

  "யாரு":
    "who",

  "பற்றி":
    "about",

  "சொல்லு":
    "tell",

  "சொல்லுங்க":
    "tell",

  "என்ன":
    "what",

  "வாட் இஸ்":
    "what is",

  "வாட்":
    "what",

  "இஸ்":
    "is",

  "ஹூ இஸ்":
    "who is",

  "ஹூ":
    "who",

  "அபவுட்":
    "about",

  "டெல்":
    "tell",
};

/* =========================================================
   NORMALIZE QUESTION
========================================================= */

const normalizeQuestion = (
  question
) => {
  let result = cleanText(
    question
  );

  const aliases =
    Object.keys(
      TAMIL_ALIASES
    ).sort(
      (a, b) =>
        b.length - a.length
    );

  aliases.forEach(
    (alias) => {
      const escaped =
        escapeRegExp(alias);

      result =
        result.replace(
          new RegExp(
            escaped,
            "gi"
          ),
          ` ${TAMIL_ALIASES[alias]} `
        );
    }
  );

  return cleanText(
    result
  );
};

/* =========================================================
   ENTRY SEARCH TEXT
========================================================= */

const getEntrySearchText = (
  entry
) => {
  return cleanText(
    [
      entry.title,
      entry.category,
      entry.epic,
      entry.book,
      entry.section,

      ...(Array.isArray(
        entry.keywords
      )
        ? entry.keywords
        : []),

      ...(Array.isArray(
        entry.keyCharacters
      )
        ? entry.keyCharacters
        : []),

      entry.goddess,
      entry.goddess_tamil,
    ]
      .filter(Boolean)
      .join(" ")
  );
};

/* =========================================================
   SUNDARAKANDA CHECK
========================================================= */

const isSundarakandaEntry =
  (entry) => {
    const text =
      getEntrySearchText(
        entry
      );

    return (
      text.includes(
        "sundarakanda"
      ) ||
      text.includes(
        "sundara kanda"
      ) ||
      entry.category
        ?.toLowerCase()
        .includes(
          "sundarakanda"
        ) ||
      entry.visual_type
        ?.toLowerCase()
        .includes(
          "sundarakanda"
        )
    );
  };

/* =========================================================
   CHARACTER MATCH
========================================================= */

const entryMatchesCharacter =
  (
    entry,
    character
  ) => {
    const aliases =
      CHARACTER_ALIASES[
        character
      ] || [];

    const text =
      getEntrySearchText(
        entry
      );

    return aliases.some(
      (alias) =>
        containsTerm(
          text,
          alias
        )
    );
  };

/* =========================================================
   APP
========================================================= */

function App() {
  const [
    language,
    setLanguage,
  ] = useState("tamil");

  const [
    question,
    setQuestion,
  ] = useState("");

  const [
    answer,
    setAnswer,
  ] = useState("");

  const [
    isListening,
    setIsListening,
  ] = useState(false);

  const [
    isSpeaking,
    setIsSpeaking,
  ] = useState(false);

  const [
    conversation,
    setConversation,
  ] = useState([]);

  const [
    selectedConversationId,
    setSelectedConversationId,
  ] = useState(null);

  const [
    speakingConversationId,
    setSpeakingConversationId,
  ] = useState(null);

  const [
    chartData,
    setChartData,
  ] = useState(null);

  const conversationEndRef =
    useRef(null);

  /* =======================================================
     AUTO SCROLL
  ======================================================= */

  useEffect(() => {
    conversationEndRef.current?.scrollIntoView(
      {
        behavior: "smooth",
        block: "end",
      }
    );
  }, [
    conversation,
    selectedConversationId,
  ]);

  /* =======================================================
     SPEECH
  ======================================================= */

  const stopSpeaking =
    () => {
      if (
        window.speechSynthesis
      ) {
        window.speechSynthesis.cancel();
      }

      setIsSpeaking(false);
      setSpeakingConversationId(
        null
      );
    };

  const speakAnswer = (
    text,
    conversationId = null
  ) => {
    if (
      !window.speechSynthesis
    ) {
      return;
    }

    window.speechSynthesis.cancel();

    setIsSpeaking(false);
    setSpeakingConversationId(
      null
    );

    const speak = () => {
      const voices =
        window.speechSynthesis.getVoices();

      const speech =
        new SpeechSynthesisUtterance(
          text
        );

      if (
        language === "tamil"
      ) {
        const tamilVoice =
          voices.find(
            (voice) =>
              voice.lang
                ?.toLowerCase()
                .startsWith("ta")
          );

        if (tamilVoice) {
          speech.voice =
            tamilVoice;
          speech.lang =
            tamilVoice.lang;
        } else {
          speech.lang =
            "ta-IN";
        }
      } else {
        const englishVoice =
          voices.find(
            (voice) =>
              voice.lang
                ?.toLowerCase() ===
              "en-in"
          ) ||
          voices.find(
            (voice) =>
              voice.lang
                ?.toLowerCase()
                .startsWith("en")
          );

        if (englishVoice) {
          speech.voice =
            englishVoice;
          speech.lang =
            englishVoice.lang;
        } else {
          speech.lang =
            "en-IN";
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
        setSpeakingConversationId(
          null
        );
      };

      speech.onerror = () => {
        setIsSpeaking(false);
        setSpeakingConversationId(
          null
        );
      };

      window.speechSynthesis.speak(
        speech
      );
    };

    if (
      window.speechSynthesis.getVoices()
        .length === 0
    ) {
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

  /* =======================================================
     CREATE VISUAL
  ======================================================= */

  const createVisual =
    (entry) => {
      if (!entry) {
        return null;
      }

      if (
        Number(entry.day) >= 1 &&
        Number(entry.day) <= 9
      ) {
        return {
          type:
            "navarathiri-day",

          day: entry.day,

          goddess:
            entry.goddess,

          goddessTamil:
            entry.goddess_tamil,

          tamil:
            entry.tamil,

          english:
            entry.english,
        };
      }

      if (
        isSundarakandaEntry(
          entry
        )
      ) {
        return {
          type:
            "sundarakanda",

          title:
            entry.title,

          sequence:
            entry.sequence,
        };
      }

      const category =
        entry.category
          ?.toLowerCase() ||
        "";

      const epic =
        entry.epic
          ?.toLowerCase() ||
        "";

      if (
        category.includes(
          "navarathiri"
        )
      ) {
        return {
          type:
            "navarathiri",
        };
      }

      if (
        epic === "ramayana" ||
        category.includes(
          "ramayana"
        )
      ) {
        return {
          type:
            "ramayana",
        };
      }

      if (
        epic ===
          "mahabharata" ||
        category.includes(
          "mahabharata"
        )
      ) {
        return {
          type:
            "mahabharata",
        };
      }

      if (
        category.includes(
          "gita"
        ) ||
        entry.title
          ?.toLowerCase()
          .includes("gita")
      ) {
        return {
          type: "gita",
        };
      }

      return {
        type: "topic",
        title:
          entry.title,
        category:
          entry.category,
      };
    };

  /* =======================================================
     STRICT QUESTION RESOLVER
  ======================================================= */

  const findAnswer =
    (
      userQuestion
    ) => {
      const originalText =
        String(
          userQuestion || ""
        ).trim();

      if (
        !originalText
      ) {
        return;
      }

      const normalized =
        normalizeQuestion(
          originalText
        );

      const lowerOriginal =
        cleanText(
          originalText
        );

      /*
        -----------------------------------------------------
        STEP 1
        Detect exact Sundarakanda EVENT intent first.
        -----------------------------------------------------
      */

      let eventIntent =
        null;

      if (
        normalized.includes(
          "sundarakanda significance"
        ) ||
        (
          normalized.includes(
            "sundarakanda"
          ) &&
          (
            normalized.includes(
              "significance"
            ) ||
            normalized.includes(
              "importance"
            ) ||
            normalized.includes(
              "meaning"
            )
          )
        )
      ) {
        eventIntent =
          "sk_significance";
      }

      else if (
        normalized.includes(
          "chudamani"
        ) ||
        (
          normalized.includes(
            "what did sita give"
          ) &&
          normalized.includes(
            "hanuman"
          )
        ) ||
        (
          normalized.includes(
            "sita"
          ) &&
          normalized.includes(
            "give"
          ) &&
          normalized.includes(
            "hanuman"
          )
        )
      ) {
        eventIntent =
          "sk_chudamani";
      }

      else if (
        normalized.includes(
          "burning lanka"
        ) ||
        (
          normalized.includes(
            "burn"
          ) &&
          normalized.includes(
            "lanka"
          )
        )
      ) {
        eventIntent =
          "sk_burning";
      }

      else if (
        normalized.includes(
          "where did hanuman find sita"
        ) ||
        (
          normalized.includes(
            "where"
          ) &&
          normalized.includes(
            "hanuman"
          ) &&
          normalized.includes(
            "sita"
          )
        )
      ) {
        eventIntent =
          "sk_sita";
      }

      else if (
        normalized.includes(
          "great leap"
        ) ||
        (
          normalized.includes(
            "hanuman"
          ) &&
          normalized.includes(
            "ocean"
          ) &&
          (
            normalized.includes(
              "cross"
            ) ||
            normalized.includes(
              "crossing"
            ) ||
            normalized.includes(
              "leap"
            ) ||
            normalized.includes(
              "jump"
            )
          )
        )
      ) {
        eventIntent =
          "sk_leap";
      }

      else if (
        normalized.includes(
          "rama ring"
        )
      ) {
        eventIntent =
          "sk_ring";
      }

      else if (
        normalized.includes(
          "ravana court"
        )
      ) {
        eventIntent =
          "sk_court";
      }

      /*
        -----------------------------------------------------
        STEP 2
        Detect character.
        -----------------------------------------------------
      */

      let matchedCharacter =
        null;

      for (
        const [
          character,
          aliases,
        ] of Object.entries(
          CHARACTER_ALIASES
        )
      ) {
        if (
          aliases.some(
            (alias) =>
              containsTerm(
                normalized,
                alias
              ) ||
              containsTerm(
                lowerOriginal,
                alias
              )
          )
        ) {
          matchedCharacter =
            character;

          break;
        }
      }

      /*
        -----------------------------------------------------
        STEP 3
        Detect broad topic.
        -----------------------------------------------------
      */

      let topic =
        null;

      if (
        eventIntent
      ) {
        topic =
          "sundarakanda";
      }

      else if (
        normalized.includes(
          "sundarakanda"
        )
      ) {
        topic =
          "sundarakanda";
      }

      else if (
        normalized.includes(
          "ramayana"
        )
      ) {
        topic =
          "ramayana";
      }

      else if (
        normalized.includes(
          "mahabharata"
        ) ||
        normalized.includes(
          "kurukshetra"
        )
      ) {
        topic =
          "mahabharata";
      }

      else if (
        normalized.includes(
          "pandavas"
        )
      ) {
        topic =
          "pandavas";
      }

      else if (
        normalized.includes(
          "bhagavad gita"
        ) ||
        normalized === "gita"
      ) {
        topic =
          "gita";
      }

      else if (
        normalized.includes(
          "navarathiri"
        ) ||
        normalized.includes(
          "golu"
        ) ||
        normalized.includes(
          "kolu"
        )
      ) {
        topic =
          "navarathiri";
      }

      /*
        -----------------------------------------------------
        STEP 4
        If nothing specific was identified:
        NEVER GUESS.
        -----------------------------------------------------
      */

      if (
        !topic &&
        !matchedCharacter
      ) {
        const fallback =
          language === "tamil"
            ? "மன்னிக்கவும், இந்த கேள்வியில் எந்த குறிப்பிட்ட தலைப்பு அல்லது கதாபாத்திரம் என்று தெளிவாக தெரியவில்லை. நவராத்திரி, சுந்தரகாண்டம், ராமாயணம், மகாபாரதம், பாண்டவர்கள் அல்லது பகவத் கீதை என்று குறிப்பிட்டு கேளுங்கள்."
            : "I don't want to guess and give you the wrong answer. Please mention the exact topic or character, such as Navarathiri, Sundarakanda, Ramayana, Mahabharata, Pandavas or Bhagavad Gita.";

        addConversation(
          originalText,
          fallback,
          null
        );

        return;
      }

      /*
        -----------------------------------------------------
        STEP 5
        TOPIC FILTER FIRST.
        
        This is VERY important.
        
        Example:
        "Where did Hanuman find Sita?"
        
        We first select Sundarakanda.
        Only after that we look for Hanuman.
        
        So generic Hanuman character entry cannot win.
        -----------------------------------------------------
      */

      let candidates =
        ALL_ENTRIES;

      if (topic) {
        candidates =
          candidates.filter(
            (entry) => {
              const text =
                getEntrySearchText(
                  entry
                );

              const category =
                entry.category
                  ?.toLowerCase() ||
                "";

              const epic =
                entry.epic
                  ?.toLowerCase() ||
                "";

              if (
                topic ===
                "sundarakanda"
              ) {
                return isSundarakandaEntry(
                  entry
                );
              }

              if (
                topic ===
                "ramayana"
              ) {
                return (
                  text.includes(
                    "ramayana"
                  ) ||
                  text.includes(
                    "ramayanam"
                  ) ||
                  epic ===
                    "ramayana" ||
                  category.includes(
                    "ramayana"
                  )
                );
              }

              if (
                topic ===
                "mahabharata"
              ) {
                return (
                  text.includes(
                    "mahabharata"
                  ) ||
                  text.includes(
                    "mahabharatham"
                  ) ||
                  epic ===
                    "mahabharata" ||
                  category.includes(
                    "mahabharata"
                  )
                );
              }

              if (
                topic ===
                "pandavas"
              ) {
                return (
                  text.includes(
                    "pandava"
                  ) ||
                  epic ===
                    "mahabharata" ||
                  category.includes(
                    "mahabharata"
                  )
                );
              }

              if (
                topic ===
                "gita"
              ) {
                return (
                  text.includes(
                    "gita"
                  ) ||
                  text.includes(
                    "bhagavad"
                  )
                );
              }

              if (
                topic ===
                "navarathiri"
              ) {
                return (
                  text.includes(
                    "navarathiri"
                  ) ||
                  text.includes(
                    "navaratri"
                  ) ||
                  text.includes(
                    "navratri"
                  ) ||
                  text.includes(
                    "golu"
                  ) ||
                  category.includes(
                    "navarathiri"
                  )
                );
              }

              return false;
            }
          );
      }

      /*
        -----------------------------------------------------
        Character filter INSIDE selected topic.
        -----------------------------------------------------
      */

      if (
        matchedCharacter
      ) {
        const characterCandidates =
          candidates.filter(
            (entry) =>
              entryMatchesCharacter(
                entry,
                matchedCharacter
              )
          );

        /*
          Only replace the candidate set if the character
          actually exists inside the selected topic.

          This prevents:
          Sundarakanda + Hanuman
          from falling back to generic Hanuman character.
        */

        if (
          characterCandidates.length >
          0
        ) {
          candidates =
            characterCandidates;
        }
      }

      /*
        -----------------------------------------------------
        STEP 6
        Score ONLY relevant candidates.
        -----------------------------------------------------
      */

      const scored =
        candidates
          .map((entry) => {
            const searchable =
              getEntrySearchText(
                entry
              );

            const title =
              cleanText(
                entry.title ||
                  ""
              );

            const visualType =
              cleanText(
                entry.visual_type ||
                  ""
              );

            const keywords =
              Array.isArray(
                entry.keywords
              )
                ? entry.keywords.map(
                    cleanText
                  )
                : [];

            let score = 0;

            /*
              Exact title = strongest match.
            */

            if (
              title &&
              containsTerm(
                normalized,
                title
              )
            ) {
              score += 200;
            }

            /*
              Exact character.
            */

            if (
              matchedCharacter &&
              entryMatchesCharacter(
                entry,
                matchedCharacter
              )
            ) {
              score += 120;

              if (
                visualType ===
                "character"
              ) {
                score += 120;
              }
            }

            /*
              Keywords.
            */

            keywords.forEach(
              (keyword) => {
                if (
                  containsTerm(
                    normalized,
                    keyword
                  )
                ) {
                  const words =
                    keyword.split(
                      " "
                    ).length;

                  score +=
                    30 +
                    words * 15;
                }
              }
            );

            /*
              Topic reinforcement.
            */

            if (topic) {
              score += 30;
            }

            /*
              Navarathiri day.
            */

            if (
              entry.day &&
              normalized.includes(
                `day ${entry.day}`
              )
            ) {
              score += 180;
            }

            /*
              Goddess.
            */

            if (
              entry.goddess &&
              containsTerm(
                normalized,
                entry.goddess
              )
            ) {
              score += 140;
            }

            /*
              ---------------------------------------------
              SUNDARAKANDA EVENT SCORING
              ---------------------------------------------
            */

            if (
              topic ===
                "sundarakanda" &&
              isSundarakandaEntry(
                entry
              )
            ) {
              score += 50;
            }

            if (
              eventIntent ===
              "sk_significance"
            ) {
              if (
                searchable.includes(
                  "significance"
                ) ||
                searchable.includes(
                  "importance"
                ) ||
                searchable.includes(
                  "முக்கியத்துவம்"
                )
              ) {
                score += 300;
              }
            }

            if (
              eventIntent ===
              "sk_leap"
            ) {
              if (
                searchable.includes(
                  "great leap"
                ) ||
                searchable.includes(
                  "ocean"
                ) ||
                searchable.includes(
                  "leap"
                ) ||
                searchable.includes(
                  "கடல் தாண்டல்"
                )
              ) {
                score += 260;
              }
            }

            if (
              eventIntent ===
              "sk_sita"
            ) {
              if (
                searchable.includes(
                  "finding sita"
                ) ||
                searchable.includes(
                  "ashoka"
                ) ||
                searchable.includes(
                  "sita"
                )
              ) {
                score += 260;
              }
            }

            if (
              eventIntent ===
              "sk_burning"
            ) {
              if (
                searchable.includes(
                  "burn"
                ) ||
                searchable.includes(
                  "lanka"
                )
              ) {
                score += 260;
              }
            }

            if (
              eventIntent ===
              "sk_chudamani"
            ) {
              if (
                searchable.includes(
                  "chudamani"
                )
              ) {
                score += 320;
              }
            }

            if (
              eventIntent ===
              "sk_ring"
            ) {
              if (
                searchable.includes(
                  "ring"
                )
              ) {
                score += 260;
              }
            }

            if (
              eventIntent ===
              "sk_court"
            ) {
              if (
                searchable.includes(
                  "ravana"
                ) &&
                searchable.includes(
                  "court"
                )
              ) {
                score += 260;
              }
            }

            return {
              entry,
              score,
            };
          })
          .filter(
            (item) =>
              item.score > 0
          )
          .sort(
            (a, b) =>
              b.score - a.score
          );

      /*
        -----------------------------------------------------
        STEP 7
        Confidence check.
        -----------------------------------------------------
      */

      const best =
        scored[0];

      if (
        !best ||
        best.score < 50
      ) {
        const fallback =
          language === "tamil"
            ? "இந்த கேள்விக்கு சரியான dataset entry கிடைக்கவில்லை. தயவுசெய்து தலைப்பு அல்லது கதாபாத்திரத்தின் பெயரை இன்னும் தெளிவாக குறிப்பிடுங்கள்."
            : "I couldn't find a reliable matching entry. Please mention the exact topic or character name.";

        addConversation(
          originalText,
          fallback,
          null
        );

        return;
      }

      /*
        -----------------------------------------------------
        STEP 8
        FINAL ANSWER
        -----------------------------------------------------
      */

      const matchedEntry =
        best.entry;

      const responseText =
        language ===
        "tamil"
          ? matchedEntry.tamil
          : matchedEntry.english;

      if (
        !responseText
      ) {
        const fallback =
          language ===
          "tamil"
            ? "இந்த entry-க்கு தேர்ந்தெடுத்த மொழியில் பதில் இல்லை."
            : "This entry does not contain an answer in the selected language.";

        addConversation(
          originalText,
          fallback,
          null
        );

        return;
      }

      const visual =
        createVisual(
          matchedEntry
        );

      addConversation(
        originalText,
        responseText,
        visual
      );
    };

  /* =======================================================
     ADD CONVERSATION
  ======================================================= */

  const addConversation =
    (
      userQuestion,
      responseText,
      visual
    ) => {
      const id =
        `${Date.now()}-${Math.random()}`;

      setQuestion(
        userQuestion
      );

      setAnswer(
        responseText
      );

      setChartData(
        visual
      );

      setConversation(
        (previous) => [
          ...previous,
          {
            id,
            question:
              userQuestion,
            answer:
              responseText,
            chart:
              visual,
            language,
          },
        ]
      );

      setSelectedConversationId(
        id
      );

      speakAnswer(
        responseText,
        id
      );
    };

  /* =======================================================
     MICROPHONE
  ======================================================= */

  const startListening =
    () => {
      const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

      if (
        !SpeechRecognition
      ) {
        const message =
          language ===
          "tamil"
            ? "இந்த browser-ல் voice recognition support இல்லை."
            : "Voice recognition is not supported in this browser.";

        setAnswer(
          message
        );

        return;
      }

      stopSpeaking();

      const recognition =
        new SpeechRecognition();

      recognition.lang =
        language ===
        "tamil"
          ? "ta-IN"
          : "en-IN";

      recognition.interimResults =
        false;

      recognition.continuous =
        false;

      recognition.maxAlternatives =
        1;

      setIsListening(
        true
      );

      recognition.start();

      recognition.onresult =
        (event) => {
          const spokenText =
            event.results[0][0]
              .transcript;

          findAnswer(
            spokenText
          );
        };

      recognition.onerror =
        () => {
          setIsListening(
            false
          );

          setAnswer(
            language ===
            "tamil"
              ? "Voice கேட்கும்போது ஒரு பிரச்சனை ஏற்பட்டது. மீண்டும் முயற்சி செய்."
              : "There was a problem with voice recognition. Please try again."
          );
        };

      recognition.onend =
        () => {
          setIsListening(
            false
          );
        };
    };

  /* =======================================================
     SUGGESTIONS
  ======================================================= */

  const suggestions = [
    [
      "🪔",
      "What is Navarathiri?",
    ],

    [
      "🌸",
      "What is Day 1 of Navarathiri?",
    ],

    [
      "🌸",
      "What is Day 2 of Navarathiri?",
    ],

    [
      "🌸",
      "What is Day 3 of Navarathiri?",
    ],

    [
      "🌸",
      "What is Day 4 of Navarathiri?",
    ],

    [
      "🌸",
      "What is Day 5 of Navarathiri?",
    ],

    [
      "🌸",
      "What is Day 6 of Navarathiri?",
    ],

    [
      "🌸",
      "What is Day 7 of Navarathiri?",
    ],

    [
      "🌸",
      "What is Day 8 of Navarathiri?",
    ],

    [
      "🌺",
      "What is Day 9 of Navarathiri?",
    ],

    [
      "🏹",
      "Tell me about Ramayana",
    ],

    [
      "🙏",
      "Tell me about Sundarakanda",
    ],

    [
      "🌊",
      "Tell me about Hanuman's great leap",
    ],

    [
      "🌸",
      "Where did Hanuman find Sita?",
    ],

    [
      "🔥",
      "Tell me about the burning of Lanka",
    ],

    [
      "💎",
      "What did Sita give Hanuman?",
    ],

    [
      "🙏",
      "What is the significance of Sundarakanda?",
    ],

    [
      "⚔️",
      "Tell me about Mahabharata",
    ],

    [
      "🙏",
      "Who is Hanuman?",
    ],

    [
      "🏹",
      "Who is Arjuna?",
    ],

    [
      "⚔️",
      "Who is Karna?",
    ],

    [
      "🛡️",
      "Who is Bhishma?",
    ],

    [
      "🛡️",
      "Who is Drona?",
    ],

    [
      "👑",
      "Who is Draupadi?",
    ],

    [
      "👑",
      "Who is Kunti?",
    ],

    [
      "🪷",
      "Who is Krishna?",
    ],

    [
      "🏹",
      "Who are the Pandavas?",
    ],

    [
      "📖",
      "What is Bhagavad Gita?",
    ],
  ];

  /* =======================================================
     SELECTED CONVERSATION
  ======================================================= */

  const selectedConversation =
    conversation.find(
      (item) =>
        item.id ===
        selectedConversationId
    );

  /* =======================================================
     HISTORY ICON
  ======================================================= */

  const getHistoryIcon =
    (item) => {
      const text =
        cleanText(
          item.question
        );

      if (
        text.includes(
          "sundarakanda"
        )
      )
        return "🙏";

      if (
        text.includes(
          "ramayana"
        )
      )
        return "🏹";

      if (
        text.includes(
          "mahabharata"
        ) ||
        text.includes(
          "pandava"
        )
      )
        return "⚔️";

      if (
        text.includes(
          "gita"
        )
      )
        return "📖";

      if (
        text.includes(
          "navarathiri"
        )
      )
        return "🪔";

      return "✦";
    };

  /* =======================================================
     RENDER VISUAL
  ======================================================= */

  const renderVisual =
    (
      visual
    ) => {
      if (!visual)
        return null;

      /* NAVARATHIRI DAY */

      if (
        visual.type ===
        "navarathiri-day"
      ) {
        return (
          <div className="visual-card">
            <div className="visual-header">
              <span>🌸</span>
              <span>
                {language ===
                "tamil"
                  ? "நவராத்திரி நாள்"
                  : "Navarathiri Day"}
              </span>
            </div>

            <div className="single-day-visual">
              <div className="single-day-number">
                {
                  visual.day
                }
              </div>

              <div className="single-day-content">
                <span className="single-day-label">
                  {language ===
                  "tamil"
                    ? `நாள் ${visual.day}`
                    : `Day ${visual.day}`}
                </span>

                <h3>
                  {language ===
                  "tamil"
                    ? visual.goddessTamil
                    : visual.goddess}
                </h3>

                <p className="day-description">
                  {language ===
                  "tamil"
                    ? visual.tamil
                    : visual.english}
                </p>
              </div>
            </div>
          </div>
        );
      }

      /* SUNDARAKANDA */

      if (
        visual.type ===
        "sundarakanda"
      ) {
        return (
          <div className="visual-card">
            <div className="visual-header">
              <span>🙏</span>
              <span>
                Sundarakanda
              </span>
            </div>

            <div className="epic-visual">
              <div className="epic-icon">
                🙏
              </div>

              <div className="epic-content">
                <h3>
                  Sundarakanda
                </h3>

                <div className="epic-flow">
                  <span>
                    🌊 Ocean
                  </span>

                  <b>→</b>

                  <span>
                    🙏 Hanuman
                  </span>

                  <b>→</b>

                  <span>
                    🌸 Sita
                  </span>

                  <b>→</b>

                  <span>
                    🔥 Lanka
                  </span>

                  <b>→</b>

                  <span>
                    💎 Chudamani
                  </span>
                </div>

                <p>
                  {language ===
                  "tamil"
                    ? "அனுமனின் பக்தி, அறிவு, துணிவு மற்றும் தூதுப் பயணத்தை மையமாகக் கொண்ட சுந்தரகாண்டம்."
                    : "A visual summary of Hanuman's mission, devotion, courage and major Sundarakanda events."}
                </p>
              </div>
            </div>
          </div>
        );
      }

      /* RAMAYANA */

      if (
        visual.type ===
        "ramayana"
      ) {
        return (
          <div className="visual-card">
            <div className="visual-header">
              <span>🏹</span>
              <span>
                Ramayana
              </span>
            </div>

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
                </div>

                <p>
                  {language ===
                  "tamil"
                    ? "ராமாயணத்தின் முக்கிய கதாபாத்திரங்கள் மற்றும் நிகழ்வுகளின் சுருக்கம்."
                    : "A visual summary of the major Ramayana characters and events."}
                </p>
              </div>
            </div>
          </div>
        );
      }

      /* MAHABHARATA */

      if (
        visual.type ===
        "mahabharata"
      ) {
        return (
          <div className="visual-card">
            <div className="visual-header">
              <span>⚔️</span>
              <span>
                Mahabharata
              </span>
            </div>

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
                  {language ===
                  "tamil"
                    ? "மகாபாரதத்தின் முக்கிய கதைக்களம்."
                    : "A visual summary of the major Mahabharata storyline."}
                </p>
              </div>
            </div>
          </div>
        );
      }

      /* GITA */

      if (
        visual.type ===
        "gita"
      ) {
        return (
          <div className="visual-card">
            <div className="visual-header">
              <span>📖</span>
              <span>
                Bhagavad Gita
              </span>
            </div>

            <div className="epic-visual">
              <div className="epic-icon">
                📖
              </div>

              <div className="epic-content">
                <h3>
                  Bhagavad Gita
                </h3>

                <div className="epic-flow">
                  <span>
                    🏹 Arjuna
                  </span>

                  <b>↔</b>

                  <span>
                    🪷 Krishna
                  </span>

                  <b>→</b>

                  <span>
                    📖 Dharma
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      }

      return null;
    };

  /* =======================================================
     CLEAR HISTORY
  ======================================================= */

  const clearHistory =
    () => {
      stopSpeaking();

      setConversation(
        []
      );

      setSelectedConversationId(
        null
      );

      setQuestion("");
      setAnswer("");
      setChartData(
        null
      );
    };

  /* =======================================================
     LANGUAGE
  ======================================================= */

  const changeLanguage =
    (newLanguage) => {
      stopSpeaking();

      setLanguage(
        newLanguage
      );
    };

  /* =======================================================
     UI
  ======================================================= */

  return (
    <div className="app">

      <div
        className="glow glow-one"
        aria-hidden="true"
      />

      <div
        className="glow glow-two"
        aria-hidden="true"
      />

      <div className="app-layout">

        {/* =================================================
            SIDEBAR
        ================================================= */}

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
              {
                conversation.length
              }
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
                    key={
                      item.id
                    }
                    className={`history-item ${
                      selectedConversationId ===
                      item.id
                        ? "history-active"
                        : ""
                    }`}
                    onClick={() => {
                      stopSpeaking();

                      setSelectedConversationId(
                        item.id
                      );

                      setQuestion(
                        item.question
                      );

                      setAnswer(
                        item.answer
                      );

                      setChartData(
                        item.chart
                      );
                    }}
                  >

                    <span className="history-item-icon">
                      {getHistoryIcon(
                        item
                      )}
                    </span>

                    <span className="history-item-text">
                      {
                        item.question
                      }
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

              <span className="status-dot" />

              AI Ready

            </div>

          </header>

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
                      Your Personal{" "}
                      <span>
                        Navarathiri
                      </span>{" "}
                      Assistant
                    </>
                  )}

              </h2>

              <p>
                {language ===
                "tamil"
                  ? "நவராத்திரி, சுந்தரகாண்டம், ராமாயணம், மகாபாரதம் மற்றும் பகவத் கீதை பற்றி கேளுங்கள்."
                  : "Ask anything about Navarathiri, Sundarakanda, Ramayana, Mahabharata and Bhagavad Gita."}
              </p>

              {/* =================================================
                  CURRENT CONVERSATION
              ================================================= */}

              {selectedConversation && (

                <div className="conversation">

                  <div className="conversation-turn">

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

                    <div className="answer-box">

                      <div className="answer-top-row">

                        <div className="answer-title">
                          ✦ Navarathiri AI
                        </div>

                        <button
                          className={`answer-voice-button ${
                            isSpeaking &&
                            speakingConversationId ===
                              selectedConversation.id
                              ? "voice-playing"
                              : ""
                          }`}
                          onClick={() => {

                            if (
                              isSpeaking &&
                              speakingConversationId ===
                                selectedConversation.id
                            ) {
                              stopSpeaking();
                            } else {
                              speakAnswer(
                                selectedConversation.answer,
                                selectedConversation.id
                              );
                            }

                          }}
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

                            {language ===
                            "tamil"
                              ? "பதில் சொல்கிறேன்..."
                              : "Speaking answer..."}

                          </div>

                        )}

                    </div>

                    {selectedConversation.chart &&
                      renderVisual(
                        selectedConversation.chart
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

                {suggestions.map(
                  ([icon, text]) => (
                    <button
                      key={text}
                      onClick={() =>
                        findAnswer(
                          text
                        )
                      }
                    >
                      {icon}{" "}
                      {text}
                    </button>
                  )
                )}

              </div>

            </div>

          </main>

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