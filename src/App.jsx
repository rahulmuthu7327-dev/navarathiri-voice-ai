import { useEffect, useRef, useState } from "react";
import "./App.css";
import dataset from "./data/navarathiri_voice_ai_dataset.json";

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

  // All conversations
  const [conversation, setConversation] = useState([]);

  // Currently selected conversation
  const [selectedConversationId, setSelectedConversationId] =
    useState(null);

  // Currently speaking conversation
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
  // TAMIL + TANGLISH ALIASES
  // =====================================================

  const tamilAliases = {
    // Navarathiri
    "நவராத்திரி பற்றி": "navarathiri",
    "நவராத்திரி": "navarathiri",
    "நவராத்திரி என்ன": "what is navarathiri",

    // Day 1
    "முதல் நாள்": "day 1",
    "முதலாம் நாள்": "day 1",
    "நாள் ஒன்று": "day 1",
    "நாள் 1": "day 1",

    // Day 2
    "இரண்டாம் நாள்": "day 2",
    "இரண்டாவது நாள்": "day 2",
    "நாள் இரண்டு": "day 2",
    "நாள் 2": "day 2",

    // Day 3
    "மூன்றாம் நாள்": "day 3",
    "மூன்றாவது நாள்": "day 3",
    "நாள் மூன்று": "day 3",
    "நாள் 3": "day 3",

    // Day 4
    "நான்காம் நாள்": "day 4",
    "நான்காவது நாள்": "day 4",
    "நாள் நான்கு": "day 4",
    "நாள் 4": "day 4",

    // Day 5
    "ஐந்தாம் நாள்": "day 5",
    "ஐந்தாவது நாள்": "day 5",
    "நாள் ஐந்து": "day 5",
    "நாள் 5": "day 5",

    // Day 6
    "ஆறாம் நாள்": "day 6",
    "ஆறாவது நாள்": "day 6",
    "நாள் ஆறு": "day 6",
    "நாள் 6": "day 6",

    // Day 7
    "ஏழாம் நாள்": "day 7",
    "ஏழாவது நாள்": "day 7",
    "நாள் ஏழு": "day 7",
    "நாள் 7": "day 7",

    // Day 8
    "எட்டாம் நாள்": "day 8",
    "எட்டாவது நாள்": "day 8",
    "நாள் எட்டு": "day 8",
    "நாள் 8": "day 8",

    // Day 9
    "ஒன்பதாம் நாள்": "day 9",
    "ஒன்பதாவது நாள்": "day 9",
    "நாள் ஒன்பது": "day 9",
    "நாள் 9": "day 9",

    // Navadurga
    "துர்கை": "durga",
    "துர்கா": "durga",
    "பார்வதி": "parvati",
    "சக்தி": "shakti",

    // Ramayana
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

    // Mahabharata
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

    // Common Tamil question words
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
      /[?!.,:;'"`]/g,
      " "
    );

    normalizedText = normalizedText.replace(/\s+/g, " ");

    return normalizedText.trim();
  };

  // =====================================================
  // GET ALL 9 NAVARATHIRI DAYS
  // =====================================================

  const getNavarathiriDays = () => {
    return dataset.entries
      .filter(
        (entry) =>
          entry.category?.toLowerCase().includes("navarathiri") &&
          Number(entry.day) >= 1 &&
          Number(entry.day) <= 9
      )
      .sort((a, b) => Number(a.day) - Number(b.day));
  };

  // =====================================================
  // CREATE VISUAL DATA
  // =====================================================

  const createChartData = (entry) => {
    if (!entry) return null;

    const category = entry.category?.toLowerCase() || "";
    const title = entry.title?.toLowerCase() || "";
    const visualType = entry.visual_type?.toLowerCase() || "";

    // Specific Navarathiri Day
    if (Number(entry.day) >= 1 && Number(entry.day) <= 9) {
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

    // Navarathiri Overview
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

    // Ramayana
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

    // Mahabharata
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
    const text = item.question?.toLowerCase() || "";
    const chartType = item.chart?.type || "";

    if (chartType === "navarathiri-day") {
      return Number(item.chart.day) === 9 ? "🌺" : "🌸";
    }

    if (chartType === "navarathiri") {
      return "🪔";
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

  const speakAnswer = (text, selectedLanguage, conversationId = null) => {
    if (!window.speechSynthesis) {
      console.log("Speech Synthesis is not supported.");
      return;
    }

    window.speechSynthesis.cancel();

    setIsSpeaking(false);
    setSpeakingConversationId(null);

    const speak = () => {
      const voices = window.speechSynthesis.getVoices();
      const speech = new SpeechSynthesisUtterance(text);

      if (selectedLanguage === "tamil") {
        const tamilVoice = voices.find(
          (voice) =>
            voice.lang &&
            voice.lang.toLowerCase().startsWith("ta")
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
              voice.lang.toLowerCase() === "en-in"
          ) ||
          voices.find(
            (voice) =>
              voice.lang &&
              voice.lang.toLowerCase().startsWith("en")
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
        setSpeakingConversationId(conversationId);
      };

      speech.onend = () => {
        setIsSpeaking(false);
        setSpeakingConversationId(null);
      };

      speech.onerror = (event) => {
        console.log("Speech error:", event.error);
        setIsSpeaking(false);
        setSpeakingConversationId(null);
      };

      window.speechSynthesis.speak(speech);
    };

    const voices = window.speechSynthesis.getVoices();

    if (voices.length === 0) {
      window.speechSynthesis.onvoiceschanged = () => {
        speak();
        window.speechSynthesis.onvoiceschanged = null;
      };
    } else {
      speak();
    }
  };

  // =====================================================
  // LISTEN TO SELECTED ANSWER
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
  // FIND BEST ANSWER
  // =====================================================

  const findAnswer = (userQuestion) => {
    const originalText = userQuestion.toLowerCase().trim();

    if (!originalText) return;

    const normalizedText = normalizeQuestion(originalText);

    const scoredEntries = dataset.entries
      .map((entry) => {
        let score = 0;

        const title = entry.title?.toLowerCase() || "";
        const keywords = entry.keywords || [];

        // Exact title
        if (
          normalizedText.includes(title) &&
          title.length > 2
        ) {
          score += 20;
        }

        // Keyword matching
        keywords.forEach((keyword) => {
          const normalizedKeyword =
            keyword.toLowerCase().trim();

          if (!normalizedKeyword) return;

          if (normalizedText.includes(normalizedKeyword)) {
            score += 10;
          }

          if (originalText.includes(normalizedKeyword)) {
            score += 8;
          }
        });

        // Day matching
        if (
          entry.day &&
          normalizedText.includes(`day ${entry.day}`)
        ) {
          score += 25;
        }

        // Goddess matching
        if (
          entry.goddess &&
          normalizedText.includes(
            entry.goddess.toLowerCase()
          )
        ) {
          score += 20;
        }

        // Category matching
        const category =
          entry.category?.toLowerCase() || "";

        if (
          category &&
          normalizedText.includes(category)
        ) {
          score += 4;
        }

        return {
          entry,
          score,
        };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score);

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
        createChartData(matchedEntry);

      const newId = `${Date.now()}-${Math.random()}`;

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

      setSelectedConversationId(newId);

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
        ? "மன்னிக்கவும், இந்த கேள்விக்கான தகவல் தற்போது என் dataset-ல் இல்லை. நவராத்திரி, ராமாயணம் அல்லது மகாபாரதம் தொடர்பான கேள்வியை கேளுங்கள்."
        : "Sorry, I don't have information about this question yet. Try asking about Navarathiri, Ramayana or Mahabharata.";

    const newId = `${Date.now()}-${Math.random()}`;

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

    const recognition = new SpeechRecognition();

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
        event.results[0][0].transcript;

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
  // SELECT HISTORY ITEM
  // =====================================================

  const selectConversation = (item) => {
    stopSpeaking();

    setSelectedConversationId(item.id);
    setQuestion(item.question);
    setAnswer(item.answer);
    setChartData(item.chart);
  };

  // =====================================================
  // LANGUAGE CHANGE
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
        item.id === selectedConversationId
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

        {/* HEADER */}

        <div className="visual-header">
          <span>📊</span>

          <span>
            {displayLanguage === "tamil"
              ? "தலைப்பு சுருக்கம்"
              : "Topic Overview"}
          </span>
        </div>

        {/* =========================================
            NAVARATHIRI OVERVIEW
        ========================================= */}

        {chart.type === "navarathiri" && (
          <>
            <div className="visual-main">

              <div className="visual-icon">
                🪔
              </div>

              <div>
                <h3>
                  {displayLanguage === "tamil"
                    ? "நவராத்திரி"
                    : "Navarathiri"}
                </h3>

                <p>
                  {displayLanguage === "tamil"
                    ? "9 நாட்கள் • பாரம்பரியம் • ஆன்மீகம்"
                    : "9 Days • Tradition • Spirituality"}
                </p>
              </div>

            </div>

            <div className="nine-day-preview">

              {chart.days?.map((day) => (
                <div
                  className="day-item"
                  key={`${day.day}-${day.goddess}`}
                >

                  <span>
                    {day.day}
                  </span>

                  <strong>
                    {displayLanguage === "tamil"
                      ? day.goddess_tamil
                      : day.goddess}
                  </strong>

                  <small>
                    {displayLanguage === "tamil"
                      ? `நாள் ${day.day}`
                      : `Day ${day.day}`}
                  </small>

                  <p>
                    {displayLanguage === "tamil"
                      ? day.tamil
                      : day.english}
                  </p>

                </div>
              ))}

            </div>
          </>
        )}

        {/* =========================================
            SINGLE NAVARATHIRI DAY
        ========================================= */}

        {chart.type === "navarathiri-day" && (
          <div className="single-day-visual">

            <div className="single-day-number">
              {chart.day}
            </div>

            <div className="single-day-content">

              <span className="single-day-label">
                {displayLanguage === "tamil"
                  ? `நவராத்திரி நாள் ${chart.day}`
                  : `Navarathiri Day ${chart.day}`}
              </span>

              <h3>
                {displayLanguage === "tamil"
                  ? chart.goddessTamil
                  : chart.goddess}
              </h3>

              <p className="day-description">
                {displayLanguage === "tamil"
                  ? "நவதுர்கை மரபில் தொடர்புடைய தேவி"
                  : "Goddess associated with the commonly described Navadurga sequence"}
              </p>

              <div className="day-significance">

                <span>
                  ✦{" "}
                  {displayLanguage === "tamil"
                    ? "சிறப்பு"
                    : "Special Significance"}
                </span>

                <p>
                  {displayLanguage === "tamil"
                    ? chart.tamil
                    : chart.english}
                </p>

              </div>

            </div>

          </div>
        )}

        {/* =========================================
            RAMAYANA
        ========================================= */}

        {chart.type === "ramayana" && (
          <div className="epic-visual">

            <div className="epic-icon">
              🏹
            </div>

            <div className="epic-content">

              <h3>
                Ramayana
              </h3>

              <div className="epic-flow">

                <span>👑 Rama</span>
                <b>→</b>
                <span>🌳 Exile</span>
                <b>→</b>
                <span>🙏 Hanuman</span>
                <b>→</b>
                <span>🏰 Lanka</span>
                <b>→</b>
                <span>✨ Return</span>

              </div>

              <p>
                {displayLanguage === "tamil"
                  ? "ராமரின் வாழ்க்கைப் பயணத்தின் முக்கிய நிகழ்வுகள்"
                  : "Major events in Rama's journey"}
              </p>

            </div>

          </div>
        )}

        {/* =========================================
            MAHABHARATA
        ========================================= */}

        {chart.type === "mahabharata" && (
          <div className="epic-visual">

            <div className="epic-icon">
              ⚔️
            </div>

            <div className="epic-content">

              <h3>
                Mahabharata
              </h3>

              <div className="epic-flow">

                <span>👑 Pandavas</span>
                <b>VS</b>
                <span>👑 Kauravas</span>
                <b>→</b>
                <span>⚔️ Kurukshetra</span>
                <b>→</b>
                <span>📖 Gita</span>

              </div>

              <p>
                {displayLanguage === "tamil"
                  ? "மகாபாரதத்தின் முக்கிய கதைக்களம்"
                  : "Major storyline of the Mahabharata"}
              </p>

            </div>

          </div>
        )}

        {/* =========================================
            DEFAULT TOPIC
        ========================================= */}

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

      {/* Background Glow */}

      <div className="glow glow-one"></div>
      <div className="glow glow-two"></div>

      <div className="app-layout">

        {/* =================================================
            SIDEBAR
        ================================================= */}

        <aside className="history-sidebar">

          {/* BRAND */}

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

          {/* HISTORY TITLE */}

          <div className="history-heading">

            <span>
              CHAT HISTORY
            </span>

            <span className="history-count">
              {conversation.length}
            </span>

          </div>

          {/* HISTORY */}

          <div className="history-list">

            {conversation.length === 0 ? (

              <div className="empty-history">

                <div className="empty-history-icon">
                  🪔
                </div>

                <p>
                  {language === "tamil"
                    ? "உங்கள் கேள்விகள் இங்கே சேமிக்கப்படும்"
                    : "Your conversations will appear here"}
                </p>

              </div>

            ) : (

              conversation.map((item) => (

                <button
                  key={item.id}
                  className={`history-item ${
                    selectedConversationId === item.id
                      ? "history-active"
                      : ""
                  }`}
                  onClick={() =>
                    selectConversation(item)
                  }
                >

                  <span className="history-item-icon">
                    {getHistoryIcon(item)}
                  </span>

                  <span className="history-item-text">
                    {item.question}
                  </span>

                </button>

              ))

            )}

          </div>

          {/* SIDEBAR BOTTOM */}

          <div className="sidebar-bottom">

            <button
              className="clear-history"
              onClick={clearHistory}
              disabled={conversation.length === 0}
            >

              <span>🗑</span>

              <span>
                {language === "tamil"
                  ? "வரலாற்றை அழி"
                  : "Clear History"}
              </span>

            </button>

            {/* LANGUAGE */}

            <div className="sidebar-language">

              <button
                className={
                  language === "tamil"
                    ? "sidebar-lang-active"
                    : ""
                }
                onClick={() =>
                  changeLanguage("tamil")
                }
              >
                தமிழ்
              </button>

              <span>|</span>

              <button
                className={
                  language === "english"
                    ? "sidebar-lang-active"
                    : ""
                }
                onClick={() =>
                  changeLanguage("english")
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

          {/* MAIN CONTENT */}

          <main className="main">

            <div className="hero">

              {/* TOP BADGE */}

              <div className="badge">
                ✦ VOICE AI • NAVARATHIRI
              </div>

              {/* TITLE */}

              <h2>

                {selectedConversation
                  ? "Your Conversation"
                  : (
                    <>
                      Your Personal
                      <span>
                        {" "}Navarathiri{" "}
                      </span>
                      Assistant
                    </>
                  )}

              </h2>

              <p>
                {language === "tamil"
                  ? "நவராத்திரி, ராமாயணம் மற்றும் மகாபாரதம் பற்றி கேளுங்கள்."
                  : "Ask anything about Navarathiri, Ramayana and Mahabharata."}
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
                        {selectedConversation.question}
                      </p>

                    </div>

                    {/* AI ANSWER */}

                    <div className="answer-box">

                      {/* ANSWER HEADER + VOICE BUTTON */}

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

                      {/* ANSWER */}

                      <p>
                        {selectedConversation.answer}
                      </p>

                      {/* SPEAKING STATUS */}

                      {isSpeaking &&
                        speakingConversationId ===
                          selectedConversation.id && (
                          <div className="speaking-status">

                            🔊{" "}

                            {selectedConversation.language ===
                            "tamil"
                              ? "பதில் சொல்கிறேன்..."
                              : "Speaking answer..."}

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
                    ref={conversationEndRef}
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
                onClick={startListening}
              >

                <span className="mic-icon">
                  🎙
                </span>

              </button>

              <div className="mic-text">

                {isListening
                  ? language === "tamil"
                    ? "கேட்கிறேன்..."
                    : "Listening..."

                  : isSpeaking
                  ? language === "tamil"
                    ? "பதில் சொல்கிறேன்..."
                    : "Speaking..."

                  : language === "tamil"
                  ? "பேசுவதற்கு அழுத்தவும்"
                  : "Tap to speak"}

              </div>

              {/* =================================================
                  SUGGESTIONS
              ================================================= */}

              <div className="suggestions">

                {/* NAVARATHIRI */}

                <button
                  onClick={() =>
                    handleSuggestion(
                      "What is Navarathiri?"
                    )
                  }
                >
                  🪔 What is Navarathiri?
                </button>

                {/* DAY 1 */}

                <button
                  onClick={() =>
                    handleSuggestion(
                      "What is Day 1 of Navarathiri?"
                    )
                  }
                >
                  🌸 Navarathiri Day 1
                </button>

                {/* DAY 2 */}

                <button
                  onClick={() =>
                    handleSuggestion(
                      "What is Day 2 of Navarathiri?"
                    )
                  }
                >
                  🌸 Navarathiri Day 2
                </button>

                {/* DAY 3 */}

                <button
                  onClick={() =>
                    handleSuggestion(
                      "What is Day 3 of Navarathiri?"
                    )
                  }
                >
                  🌸 Navarathiri Day 3
                </button>

                {/* DAY 4 */}

                <button
                  onClick={() =>
                    handleSuggestion(
                      "What is Day 4 of Navarathiri?"
                    )
                  }
                >
                  🌸 Navarathiri Day 4
                </button>

                {/* DAY 5 */}

                <button
                  onClick={() =>
                    handleSuggestion(
                      "What is Day 5 of Navarathiri?"
                    )
                  }
                >
                  🌸 Navarathiri Day 5
                </button>

                {/* DAY 6 */}

                <button
                  onClick={() =>
                    handleSuggestion(
                      "What is Day 6 of Navarathiri?"
                    )
                  }
                >
                  🌸 Navarathiri Day 6
                </button>

                {/* DAY 7 */}

                <button
                  onClick={() =>
                    handleSuggestion(
                      "What is Day 7 of Navarathiri?"
                    )
                  }
                >
                  🌸 Navarathiri Day 7
                </button>

                {/* DAY 8 */}

                <button
                  onClick={() =>
                    handleSuggestion(
                      "What is Day 8 of Navarathiri?"
                    )
                  }
                >
                  🌸 Navarathiri Day 8
                </button>

                {/* DAY 9 */}

                <button
                  onClick={() =>
                    handleSuggestion(
                      "What is Day 9 of Navarathiri?"
                    )
                  }
                >
                  🌺 Navarathiri Day 9
                </button>

                {/* RAMAYANA */}

                <button
                  onClick={() =>
                    handleSuggestion(
                      "Tell me about Ramayana"
                    )
                  }
                >
                  🏹 Ramayana
                </button>

                {/* MAHABHARATA */}

                <button
                  onClick={() =>
                    handleSuggestion(
                      "Tell me about Mahabharata"
                    )
                  }
                >
                  ⚔️ Mahabharata
                </button>

                {/* HANUMAN */}

                <button
                  onClick={() =>
                    handleSuggestion(
                      "Who is Hanuman?"
                    )
                  }
                >
                  🙏 Who is Hanuman?
                </button>

                {/* PANDAVAS */}

                <button
                  onClick={() =>
                    handleSuggestion(
                      "Who are the Pandavas?"
                    )
                  }
                >
                  🏹 Who are the Pandavas?
                </button>

                {/* GITA */}

                <button
                  onClick={() =>
                    handleSuggestion(
                      "What is Bhagavad Gita?"
                    )
                  }
                >
                  📖 Bhagavad Gita
                </button>

                {/* VIJAYADASHAMI */}

                <button
                  onClick={() =>
                    handleSuggestion(
                      "Tell me about Vijayadashami"
                    )
                  }
                >
                  🌺 Vijayadashami
                </button>

              </div>

            </div>

          </main>

          {/* FOOTER */}

          <footer>

            <span>
              Navarathiri AI
            </span>

            <span>•</span>

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