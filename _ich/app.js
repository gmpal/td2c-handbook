(() => {
  "use strict";

  /**
   * German Grammar Exercises App
   * -----------------------------------------------------------
   * Modular app logic for loading exercises, validating answers,
   * scoring, progress tracking, hints, and dark mode toggling.
   */

  const STORAGE_KEY = "german-grammar-progress-v1";

  const EXERCISE_TYPE_LABELS = {
    cases: "Fälle",
    "verb-conjugations": "Verbkonjugation",
    articles: "Artikel",
    prepositions: "Präpositionen",
    adjectives: "Adjektive",
    syntax: "Satzbau",
  };

  const THEME_VARIABLES = [
    "bg",
    "surface",
    "surface-muted",
    "surface-strong",
    "text",
    "text-muted",
    "text-subtle",
    "primary",
    "primary-contrast",
    "secondary",
    "accent",
    "warning",
    "danger",
    "border",
    "focus",
    "overlay",
    "success-bg",
    "warning-bg",
    "danger-bg",
    "link",
    "link-hover",
  ];

  const THEMES = {
    light: {
      bg: "#f8fafc",
      surface: "#ffffff",
      "surface-muted": "#f1f5f9",
      "surface-strong": "#e2e8f0",
      text: "#0f172a",
      "text-muted": "#475569",
      "text-subtle": "#64748b",
      primary: "#1d4ed8",
      "primary-contrast": "#ffffff",
      secondary: "#0ea5e9",
      accent: "#22c55e",
      warning: "#f97316",
      danger: "#ef4444",
      border: "#cbd5f5",
      focus: "#2563eb",
      overlay: "rgba(15, 23, 42, 0.45)",
      "success-bg": "#dcfce7",
      "warning-bg": "#ffedd5",
      "danger-bg": "#fee2e2",
      link: "#1d4ed8",
      "link-hover": "#1e3a8a",
    },
    dark: {
      bg: "#0b1120",
      surface: "#111827",
      "surface-muted": "#1f2937",
      "surface-strong": "#243041",
      text: "#e2e8f0",
      "text-muted": "#cbd5f5",
      "text-subtle": "#94a3b8",
      primary: "#60a5fa",
      "primary-contrast": "#0b1120",
      secondary: "#38bdf8",
      accent: "#4ade80",
      warning: "#fb923c",
      danger: "#f87171",
      border: "#334155",
      focus: "#93c5fd",
      overlay: "rgba(2, 6, 23, 0.6)",
      "success-bg": "#022c22",
      "warning-bg": "#3b1f0e",
      "danger-bg": "#3f1414",
      link: "#93c5fd",
      "link-hover": "#bfdbfe",
    },
  };

  const DEFAULT_EXERCISES = {
    levels: ["A1", "A2", "B1", "B2"],
    exerciseTypes: [
      "cases",
      "verb-conjugations",
      "articles",
      "prepositions",
      "adjectives",
      "syntax",
    ],
    exercises: {
      cases: [
        {
          id: "cases-a1-001",
          level: "A1",
          format: "multiple-choice",
          title: "Akkusativ erkennen",
          prompt: "Wähle den richtigen Fall: Ich sehe ___ Hund.",
          choices: ["den", "dem", "des"],
          answer: "den",
          hint: "Direktes Objekt → Akkusativ.",
          explanation: "Das direkte Objekt steht im Akkusativ.",
        },
        {
          id: "cases-a1-002",
          level: "A1",
          format: "case",
          title: "Subjekt bestimmen",
          prompt: "Welcher Fall? „Der Mann“ in „Der Mann liest.“",
          choices: ["Nominativ", "Akkusativ", "Dativ", "Genitiv"],
          answer: "Nominativ",
          hint: "Das Subjekt steht im Nominativ.",
          explanation: "„Der Mann“ ist das Subjekt.",
        },
        {
          id: "cases-a2-001",
          level: "A2",
          format: "multiple-choice",
          title: "Dativ mit Verben",
          prompt: "Ich helfe ___ Mann.",
          choices: ["der", "den", "dem"],
          answer: "dem",
          hint: "„helfen“ verlangt den Dativ.",
          explanation: "Nach „helfen“ folgt der Dativ.",
        },
        {
          id: "cases-a2-002",
          level: "A2",
          format: "case",
          title: "Indirektes Objekt",
          prompt: "Welcher Fall? „die Frau“ in „Er gibt der Frau das Buch.“",
          choices: ["Nominativ", "Akkusativ", "Dativ", "Genitiv"],
          answer: "Dativ",
          hint: "Indirektes Objekt → Dativ.",
          explanation: "„der Frau“ ist das indirekte Objekt.",
        },
        {
          id: "cases-b1-001",
          level: "B1",
          format: "fill-blank",
          title: "Genitiv bei Besitz",
          prompt: "Das Auto ___ Nachbarn ist neu.",
          answer: "des",
          hint: "Genitiv maskulin: des.",
          explanation: "Besitz wird oft mit dem Genitiv ausgedrückt.",
        },
        {
          id: "cases-b1-002",
          level: "B1",
          format: "fill-blank",
          title: "Genitiv nach Präpositionen",
          prompt: "Trotz ___ Regens gehen wir raus.",
          answer: "des",
          hint: "„trotz“ verlangt den Genitiv.",
          explanation: "Nach „trotz“ steht der Genitiv.",
        },
        {
          id: "cases-b2-001",
          level: "B2",
          format: "fill-blank",
          title: "Genitiv feminin",
          prompt: "Anstatt ___ Antwort kam eine Frage.",
          answer: "einer",
          hint: "Genitiv feminin: einer.",
          explanation: "„anstatt“ verlangt den Genitiv.",
        },
        {
          id: "cases-b2-002",
          level: "B2",
          format: "case",
          title: "Akkusativ nach Präposition",
          prompt:
            "Welcher Fall? „den Bericht“ in „Sie erinnert sich an den Bericht.“",
          choices: ["Nominativ", "Akkusativ", "Dativ", "Genitiv"],
          answer: "Akkusativ",
          hint: "„an“ + Akkusativ bei Ziel/Objekt.",
          explanation: "„an“ verlangt hier den Akkusativ.",
        },
      ],
      "verb-conjugations": [
        {
          id: "verbs-a1-001",
          level: "A1",
          format: "fill-blank",
          title: "sein im Präsens",
          prompt: "Konjugiere: Ich ___ müde.",
          answer: "bin",
          hint: "1. Person Singular von „sein“.",
          explanation: "Ich bin müde.",
        },
        {
          id: "verbs-a1-002",
          level: "A1",
          format: "conjugation-table",
          title: "kommen im Präsens",
          prompt: "Konjugiere „kommen“ im Präsens.",
          verb: "kommen",
          tense: "Präsens",
          table: [
            { pronoun: "ich", answer: "komme" },
            { pronoun: "du", answer: "kommst" },
            { pronoun: "er/sie/es", answer: "kommt" },
            { pronoun: "wir", answer: "kommen" },
            { pronoun: "ihr", answer: "kommt" },
            { pronoun: "sie/Sie", answer: "kommen" },
          ],
          hint: "Achte auf die Endungen -e, -st, -t.",
        },
        {
          id: "verbs-a2-001",
          level: "A2",
          format: "fill-blank",
          title: "sein im Präteritum",
          prompt: "Konjugiere: Du ___ gestern spät zu Hause.",
          answer: "warst",
          hint: "Präteritum von „sein“.",
          explanation: "Du warst gestern spät zu Hause.",
        },
        {
          id: "verbs-a2-002",
          level: "A2",
          format: "conjugation-table",
          title: "haben im Präteritum",
          prompt: "Konjugiere „haben“ im Präteritum.",
          verb: "haben",
          tense: "Präteritum",
          table: [
            { pronoun: "ich", answer: "hatte" },
            { pronoun: "du", answer: "hattest" },
            { pronoun: "er/sie/es", answer: "hatte" },
            { pronoun: "wir", answer: "hatten" },
            { pronoun: "ihr", answer: "hattet" },
            { pronoun: "sie/Sie", answer: "hatten" },
          ],
          hint: "Alle Formen basieren auf „hatte“.",
        },
        {
          id: "verbs-b1-001",
          level: "B1",
          format: "fill-blank",
          title: "Trennbare Verben",
          prompt: "Wir ___ morgen früh ab.",
          answer: "fahren",
          hint: "Infinitiv: abfahren.",
          explanation: "Wir fahren morgen früh ab.",
        },
        {
          id: "verbs-b1-002",
          level: "B1",
          format: "fill-blank",
          title: "Konjunktiv II",
          prompt: "Wenn ich mehr Zeit ___, würde ich reisen.",
          answer: "hätte",
          hint: "Konjunktiv II von „haben“.",
          explanation: "Wenn ich mehr Zeit hätte, würde ich reisen.",
        },
        {
          id: "verbs-b2-001",
          level: "B2",
          format: "conjugation-table",
          title: "werden im Konjunktiv II",
          prompt: "Konjugiere „werden“ im Konjunktiv II.",
          verb: "werden",
          tense: "Konjunktiv II",
          table: [
            { pronoun: "ich", answer: "würde" },
            { pronoun: "du", answer: "würdest" },
            { pronoun: "er/sie/es", answer: "würde" },
            { pronoun: "wir", answer: "würden" },
            { pronoun: "ihr", answer: "würdet" },
            { pronoun: "sie/Sie", answer: "würden" },
          ],
          hint: "Konjunktiv II von „werden“: würde-.",
        },
        {
          id: "verbs-b2-002",
          level: "B2",
          format: "fill-blank",
          title: "Plusquamperfekt",
          prompt: "Als wir ankamen, ___ sie bereits gegangen.",
          answer: "war",
          hint: "Plusquamperfekt mit „sein“.",
          explanation: "Sie war bereits gegangen.",
        },
      ],
      articles: [
        {
          id: "articles-a1-001",
          level: "A1",
          format: "multiple-choice",
          title: "Bestimmte Artikel",
          prompt: "Wähle den richtigen Artikel: ___ Haus ist groß.",
          choices: ["Der", "Die", "Das"],
          answer: "Das",
          hint: "„Haus“ ist Neutrum.",
          explanation: "Das Haus ist groß.",
        },
        {
          id: "articles-a1-002",
          level: "A1",
          format: "multiple-choice",
          title: "Unbestimmte Artikel",
          prompt: "Ich habe ___ Katze.",
          choices: ["eine", "einen", "einem"],
          answer: "eine",
          hint: "„Katze“ ist feminin.",
          explanation: "Ich habe eine Katze.",
        },
        {
          id: "articles-a2-001",
          level: "A2",
          format: "fill-blank",
          title: "Artikel im Akkusativ",
          prompt: "Wir gehen in ___ Kino.",
          answer: ["das", "ins"],
          hint: "„in das“ → „ins“.",
          explanation: "Wir gehen in das (= ins) Kino.",
        },
        {
          id: "articles-a2-002",
          level: "A2",
          format: "fill-blank",
          title: "Artikel im Dativ",
          prompt: "Sie spricht mit ___ Arzt.",
          answer: "dem",
          hint: "„mit“ verlangt den Dativ.",
          explanation: "Sie spricht mit dem Arzt.",
        },
        {
          id: "articles-b1-001",
          level: "B1",
          format: "multiple-choice",
          title: "Adjektiv + Artikel",
          prompt: "Das ist ___ beste Lösung.",
          choices: ["die", "der", "das"],
          answer: "die",
          hint: "„Lösung“ ist feminin.",
          explanation: "Das ist die beste Lösung.",
        },
        {
          id: "articles-b1-002",
          level: "B1",
          format: "fill-blank",
          title: "Dativ bei Präposition",
          prompt: "Er arbeitet bei ___ Firma.",
          answer: "einer",
          hint: "„bei“ + Dativ feminin.",
          explanation: "Er arbeitet bei einer Firma.",
        },
        {
          id: "articles-b2-001",
          level: "B2",
          format: "fill-blank",
          title: "Genitiv Artikel",
          prompt: "Trotz ___ hohen Preise blieb er.",
          answer: "der",
          hint: "Genitiv Plural: der.",
          explanation: "Trotz der hohen Preise blieb er.",
        },
        {
          id: "articles-b2-002",
          level: "B2",
          format: "multiple-choice",
          title: "Artikel im Akkusativ",
          prompt: "Kennst du ___ Frau von Herrn Meier?",
          choices: ["die", "der", "das"],
          answer: "die",
          hint: "Direktes Objekt → Akkusativ.",
          explanation: "Kennst du die Frau von Herrn Meier?",
        },
      ],
      prepositions: [
        {
          id: "prep-a1-001",
          level: "A1",
          format: "multiple-choice",
          title: "Herkunft",
          prompt: "Ich komme ___ Deutschland.",
          choices: ["aus", "nach", "bei"],
          answer: "aus",
          hint: "Herkunft: aus + Dativ.",
          explanation: "Ich komme aus Deutschland.",
        },
        {
          id: "prep-a1-002",
          level: "A1",
          format: "fill-blank",
          title: "Richtung",
          prompt: "Wir gehen ___ Schule.",
          answer: ["zur", "in die"],
          hint: "„zur“ = zu der.",
          explanation: "Wir gehen zur Schule / in die Schule.",
        },
        {
          id: "prep-a2-001",
          level: "A2",
          format: "matching",
          title: "Präpositionen + Kasus",
          prompt: "Ordne die Präpositionen dem richtigen Fall zu.",
          pairs: [
            { left: "mit", right: "Dativ" },
            { left: "nach", right: "Dativ" },
            { left: "zu", right: "Dativ" },
            { left: "für", right: "Akkusativ" },
            { left: "ohne", right: "Akkusativ" },
            { left: "durch", right: "Akkusativ" },
          ],
          hint: "mit/nach/zu → Dativ, für/ohne/durch → Akkusativ.",
        },
        {
          id: "prep-a2-002",
          level: "A2",
          format: "multiple-choice",
          title: "Warten auf",
          prompt: "Sie wartet ___ den Bus.",
          choices: ["auf", "bei", "mit"],
          answer: "auf",
          hint: "„warten auf“ ist eine feste Verbindung.",
          explanation: "Sie wartet auf den Bus.",
        },
        {
          id: "prep-b1-001",
          level: "B1",
          format: "fill-blank",
          title: "Wechselpräposition",
          prompt: "Ich stelle die Lampe ___ den Tisch.",
          answer: "auf",
          hint: "Richtung → Akkusativ.",
          explanation: "Ich stelle die Lampe auf den Tisch.",
        },
        {
          id: "prep-b1-002",
          level: "B1",
          format: "matching",
          title: "Genitivpräpositionen",
          prompt: "Ordne die Präpositionen dem richtigen Fall zu.",
          pairs: [
            { left: "während", right: "Genitiv" },
            { left: "trotz", right: "Genitiv" },
            { left: "wegen", right: "Genitiv" },
            { left: "innerhalb", right: "Genitiv" },
          ],
          hint: "Diese Präpositionen stehen meist mit Genitiv.",
        },
        {
          id: "prep-b2-001",
          level: "B2",
          format: "fill-blank",
          title: "Bestehen auf",
          prompt: "Er besteht ___ eine Antwort.",
          answer: "auf",
          hint: "„bestehen auf“ + Akkusativ.",
          explanation: "Er besteht auf eine Antwort.",
        },
        {
          id: "prep-b2-002",
          level: "B2",
          format: "fill-blank",
          title: "Genitivformel",
          prompt: "___ des Sturms bleibt die Fähre im Hafen.",
          answer: "wegen",
          hint: "„wegen“ + Genitiv.",
          explanation: "Wegen des Sturms bleibt die Fähre im Hafen.",
        },
      ],
      adjectives: [
        {
          id: "adj-a1-001",
          level: "A1",
          format: "fill-blank",
          title: "Adjektiv nach Artikel",
          prompt: "Ich habe einen ___ Hund.",
          answer: "kleinen",
          hint: "Akkusativ maskulin.",
          explanation: "einen kleinen Hund",
        },
        {
          id: "adj-a1-002",
          level: "A1",
          format: "fill-blank",
          title: "Neutrum im Nominativ",
          prompt: "Das ist ein ___ Auto.",
          answer: "neues",
          hint: "Nominativ Neutrum.",
          explanation: "ein neues Auto",
        },
        {
          id: "adj-a2-001",
          level: "A2",
          format: "fill-blank",
          title: "Neutrum im Akkusativ",
          prompt: "Sie trägt ein ___ Kleid.",
          answer: "schönes",
          hint: "Akkusativ Neutrum = wie Nominativ.",
          explanation: "ein schönes Kleid",
        },
        {
          id: "adj-a2-002",
          level: "A2",
          format: "fill-blank",
          title: "Maskulin im Akkusativ",
          prompt: "Wir treffen einen ___ Freund.",
          answer: "alten",
          hint: "Akkusativ maskulin.",
          explanation: "einen alten Freund",
        },
        {
          id: "adj-b1-001",
          level: "B1",
          format: "fill-blank",
          title: "Dativ maskulin",
          prompt: "Er hilft seinem ___ Bruder.",
          answer: "jüngeren",
          hint: "Dativ maskulin.",
          explanation: "seinem jüngeren Bruder",
        },
        {
          id: "adj-b1-002",
          level: "B1",
          format: "fill-blank",
          title: "Starke Deklination",
          prompt: "Wir kaufen frische ___ Äpfel.",
          answer: "rote",
          hint: "Plural ohne Artikel: starke Endung -e.",
          explanation: "frische rote Äpfel",
        },
        {
          id: "adj-b2-001",
          level: "B2",
          format: "fill-blank",
          title: "Dativ Plural",
          prompt: "Mit ___ Argumenten überzeugte sie uns.",
          answer: "starken",
          hint: "Dativ Plural endet auf -en.",
          explanation: "mit starken Argumenten",
        },
        {
          id: "adj-b2-002",
          level: "B2",
          format: "fill-blank",
          title: "Genitiv Plural",
          prompt: "Trotz ___ Temperaturen gingen wir.",
          answer: "niedriger",
          hint: "Genitiv Plural: niedriger.",
          explanation: "trotz niedriger Temperaturen",
        },
      ],
      syntax: [
        {
          id: "syntax-a1-001",
          level: "A1",
          format: "rearrangement",
          title: "Einfacher Satz",
          prompt: "Ordne die Wörter zu einem Satz.",
          tokens: ["ich", "gehe", "morgen", "einkaufen"],
          answer: "Ich gehe morgen einkaufen.",
          hint: "Verb an zweiter Stelle.",
        },
        {
          id: "syntax-a1-002",
          level: "A1",
          format: "rearrangement",
          title: "Zeitangabe",
          prompt: "Ordne die Wörter zu einem Satz.",
          tokens: ["wir", "besuchen", "Oma", "am", "Samstag"],
          answer: "Wir besuchen Oma am Samstag.",
          hint: "Subjekt + Verb + Objekt + Zeit.",
        },
        {
          id: "syntax-a2-001",
          level: "A2",
          format: "rearrangement",
          title: "Nebensatz mit weil",
          prompt: "Ordne die Wörter zu einem Satz.",
          tokens: ["weil", "er", "krank", "ist", "bleibt", "er", "zu", "Hause"],
          answer: "Weil er krank ist, bleibt er zu Hause.",
          hint: "Im Nebensatz steht das Verb am Ende.",
        },
        {
          id: "syntax-a2-002",
          level: "A2",
          format: "rearrangement",
          title: "Zeit vor Verb",
          prompt: "Ordne die Wörter zu einem Satz.",
          tokens: ["nach", "der", "Arbeit", "trifft", "sie", "Freunde"],
          answer: "Nach der Arbeit trifft sie Freunde.",
          hint: "Zeitangabe am Anfang → Verb an zweiter Stelle.",
        },
        {
          id: "syntax-b1-001",
          level: "B1",
          format: "rearrangement",
          title: "Nebensatz mit obwohl",
          prompt: "Ordne die Wörter zu einem Satz.",
          tokens: ["obwohl", "es", "regnet", "gehen", "wir", "spazieren"],
          answer: "Obwohl es regnet, gehen wir spazieren.",
          hint: "Hauptsatz beginnt nach dem Komma.",
        },
        {
          id: "syntax-b1-002",
          level: "B1",
          format: "rearrangement",
          title: "Wenn-Satz",
          prompt: "Ordne die Wörter zu einem Satz.",
          tokens: ["wenn", "ich", "Zeit", "habe", "lese", "ich"],
          answer: "Wenn ich Zeit habe, lese ich.",
          hint: "Verb am Ende des Nebensatzes.",
        },
        {
          id: "syntax-b2-001",
          level: "B2",
          format: "rearrangement",
          title: "Konditionalsatz",
          prompt: "Ordne die Wörter zu einem Satz.",
          tokens: ["hätte", "ich", "mehr", "Zeit", "würde", "ich", "reisen"],
          answer: "Hätte ich mehr Zeit, würde ich reisen.",
          hint: "Verb an Position 1 im Konditionalsatz.",
        },
        {
          id: "syntax-b2-002",
          level: "B2",
          format: "rearrangement",
          title: "Sobald-Satz",
          prompt: "Ordne die Wörter zu einem Satz.",
          tokens: ["sobald", "der", "Kurs", "endet", "schicken", "wir", "die", "Unterlagen"],
          answer: "Sobald der Kurs endet, schicken wir die Unterlagen.",
          hint: "Verb am Ende des Nebensatzes.",
        },
      ],
    },
  };

  const state = {
    selectedLevel: null,
    selectedType: null,
    session: null,
    hintIndex: 0,
    selectedChoice: null,
    arrangement: null,
    advanceOnClose: false,
    storageAvailable: true,
    progress: null,
    preferences: null,
  };

  const dom = {};

  const initialize = () => {
    mapDomElements();
    const storedState = loadStoredState();
    state.progress = storedState.progress;
    state.preferences = storedState.preferences;

    applyTheme(state.preferences.theme);
    setupThemeToggle();
    bindNavigation();
    bindExerciseActions();
    bindModals();
    updateProgressUI();
    updateSelectionSummary();
    setIdleExerciseCard();
  };

  const mapDomElements = () => {
    dom.typeButtons = Array.from(
      document.querySelectorAll("[data-exercise-type]")
    );
    dom.levelButtons = Array.from(document.querySelectorAll("[data-level]"));
    dom.startButton = document.querySelector('[data-action="start"]');
    dom.resetButton = document.querySelector('[data-action="reset"]');
    dom.exerciseTitle = document.querySelector(".exercise-title");
    dom.currentLevel = document.querySelector("[data-current-level]");
    dom.currentType = document.querySelector("[data-current-type]");
    dom.exerciseStage = document.querySelector("[data-exercise-stage]");
    dom.exerciseCard = document.querySelector("[data-exercise-card]");
    dom.questionIndex = document.querySelector("[data-question-index]");
    dom.questionTotal = document.querySelector("[data-question-total]");
    dom.correctCount = document.querySelector("[data-correct-count]");
    dom.incorrectCount = document.querySelector("[data-incorrect-count]");
    dom.exerciseDescription = document.querySelector(".exercise-description");
    dom.feedbackModal = document.querySelector("[data-feedback-modal]");
    dom.feedbackStatus = document.querySelector("[data-feedback-status]");
    dom.feedbackMessage = document.querySelector("[data-feedback-message]");
    dom.hintModal = document.querySelector("[data-hint-modal]");
    dom.hintMessage = document.querySelector("[data-hint-message]");
    dom.progressCards = Array.from(
      document.querySelectorAll(".progress-card")
    );
  };

  const bindNavigation = () => {
    dom.typeButtons.forEach((button) => {
      button.addEventListener("click", () => {
        state.selectedType = button.dataset.exerciseType;
        updateSelectionSummary();
      });
    });

    dom.levelButtons.forEach((button) => {
      button.addEventListener("click", () => {
        state.selectedLevel = button.dataset.level;
        updateSelectionSummary();
      });
    });

    if (dom.startButton) {
      dom.startButton.addEventListener("click", startSession);
    }

    if (dom.resetButton) {
      dom.resetButton.addEventListener("click", resetSelection);
    }
  };

  const bindExerciseActions = () => {
    if (!dom.exerciseStage) return;

    dom.exerciseStage.addEventListener("submit", (event) => {
      if (!event.target.matches("[data-exercise-form]")) return;
      event.preventDefault();
      handleSubmit();
    });

    dom.exerciseStage.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;

      if (target.matches("[data-action='hint']")) {
        showHint();
        return;
      }

      if (target.matches("[data-choice]")) {
        selectChoice(target);
        return;
      }

      if (target.matches("[data-token]")) {
        selectToken(target);
        return;
      }

      if (target.matches("[data-action='reset-arrangement']")) {
        resetArrangement();
        return;
      }

      if (target.matches("[data-action='restart']")) {
        startSession();
      }
    });
  };

  const bindModals = () => {
    if (dom.feedbackModal) {
      dom.feedbackModal.addEventListener("close", () => {
        if (state.advanceOnClose) {
          state.advanceOnClose = false;
          goToNextExercise();
        }
      });

      const closeButton = dom.feedbackModal.querySelector(
        "[data-action='close-modal']"
      );
      if (closeButton) {
        closeButton.addEventListener("click", () => {
          state.advanceOnClose = false;
          closeDialog(dom.feedbackModal);
        });
      }
    }
  };

  const setupThemeToggle = () => {
    const header = document.querySelector(".site-header");
    if (!header) return;

    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "btn btn-ghost";
    toggle.dataset.action = "toggle-theme";
    toggle.addEventListener("click", () => {
      const nextTheme = getEffectiveTheme() === "dark" ? "light" : "dark";
      state.preferences.theme = nextTheme;
      applyTheme(nextTheme);
      saveStoredState();
      updateThemeToggleLabel(toggle);
    });

    updateThemeToggleLabel(toggle);
    header.appendChild(toggle);
  };

  const updateThemeToggleLabel = (button) => {
    const effectiveTheme = getEffectiveTheme();
    button.textContent =
      effectiveTheme === "dark" ? "Hellmodus" : "Dunkelmodus";
    button.setAttribute(
      "aria-label",
      `Zur ${effectiveTheme === "dark" ? "hellen" : "dunklen"} Ansicht wechseln`
    );
  };

  const getEffectiveTheme = () => {
    if (state.preferences.theme === "system") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return state.preferences.theme;
  };

  const applyTheme = (theme) => {
    if (!theme || theme === "system") {
      THEME_VARIABLES.forEach((variable) => {
        document.documentElement.style.removeProperty(`--${variable}`);
      });
      document.documentElement.style.colorScheme = "";
      return;
    }

    const palette = THEMES[theme];
    if (!palette) return;

    Object.entries(palette).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--${key}`, value);
    });
    document.documentElement.style.colorScheme = theme;
  };

  const updateSelectionSummary = () => {
    dom.typeButtons.forEach((button) => {
      const isActive = button.dataset.exerciseType === state.selectedType;
      button.setAttribute("aria-pressed", String(isActive));
    });

    dom.levelButtons.forEach((button) => {
      const isActive = button.dataset.level === state.selectedLevel;
      button.setAttribute("aria-pressed", String(isActive));
    });

    if (dom.exerciseTitle) {
      dom.exerciseTitle.textContent = state.selectedType
        ? EXERCISE_TYPE_LABELS[state.selectedType]
        : "Bitte Übung wählen";
    }

    if (dom.currentLevel) {
      dom.currentLevel.textContent = state.selectedLevel ?? "—";
    }

    if (dom.currentType) {
      dom.currentType.textContent = state.selectedType
        ? EXERCISE_TYPE_LABELS[state.selectedType]
        : "—";
    }

    if (dom.startButton) {
      dom.startButton.disabled = !(state.selectedLevel && state.selectedType);
    }
  };

  const startSession = () => {
    clearInlineFeedback();

    if (!state.selectedLevel || !state.selectedType) {
      setInlineFeedback(
        "Bitte wähle zuerst ein Niveau und einen Übungstyp.",
        false
      );
      return;
    }

    const exercises =
      DEFAULT_EXERCISES.exercises[state.selectedType]?.filter(
        (exercise) => exercise.level === state.selectedLevel
      ) ?? [];

    if (exercises.length === 0) {
      setInlineFeedback("Für diese Auswahl gibt es keine Übungen.", false);
      return;
    }

    state.session = {
      exercises: shuffleArray(exercises),
      index: 0,
      correct: 0,
      incorrect: 0,
    };
    state.hintIndex = 0;
    updateExerciseCounters();
    renderExercise(state.session.exercises[state.session.index]);
  };

  const resetSelection = () => {
    state.selectedLevel = null;
    state.selectedType = null;
    state.session = null;
    state.selectedChoice = null;
    state.arrangement = null;
    updateSelectionSummary();
    updateExerciseCounters();
    setIdleExerciseCard();
  };

  const setIdleExerciseCard = () => {
    if (!dom.exerciseCard) return;
    dom.exerciseCard.innerHTML = `
      <h3>Bereit für den Start?</h3>
      <p>Wähle eine Übung links aus, um zu beginnen.</p>
      <div class="exercise-feedback" data-inline-feedback hidden></div>
      <form class="exercise-form" data-exercise-form>
        <label for="exercise-input">Antwort</label>
        <input
          id="exercise-input"
          name="answer"
          type="text"
          placeholder="Antwort eingeben"
          autocomplete="off"
        />
        <div class="exercise-controls">
          <button type="submit" class="primary-action" data-action="submit">
            Prüfen
          </button>
          <button type="button" class="secondary-action" data-action="hint">
            Hinweis
          </button>
        </div>
      </form>
    `;
  };

  const renderExercise = (exercise) => {
    if (!dom.exerciseCard || !exercise) return;

    state.selectedChoice = null;
    state.arrangement = null;
    state.hintIndex = 0;

    const headerHtml = `
      <div class="exercise-header">
        <div>
          <p class="exercise-type">${EXERCISE_TYPE_LABELS[state.selectedType]}</p>
          <h3>${exercise.title}</h3>
        </div>
        <span class="badge">Niveau ${exercise.level}</span>
      </div>
      <p class="exercise-prompt">${exercise.prompt}</p>
    `;

    const bodyHtml = createExerciseBody(exercise);
    const formHtml = `
      <form class="exercise-form" data-exercise-form>
        ${bodyHtml}
        <div class="exercise-controls">
          <button type="submit" class="primary-action" data-action="submit">
            Prüfen
          </button>
          <button type="button" class="secondary-action" data-action="hint">
            Hinweis
          </button>
        </div>
      </form>
    `;

    dom.exerciseCard.className = `exercise-card exercise exercise-${exercise.format}`;
    dom.exerciseCard.innerHTML = `
      ${headerHtml}
      <div class="exercise-body">${formHtml}</div>
      <div class="exercise-feedback" data-inline-feedback hidden></div>
    `;

    if (dom.exerciseDescription) {
      dom.exerciseDescription.textContent = exercise.explanation
        ? exercise.explanation
        : "Beantworte die Aufgabe und prüfe sofort dein Ergebnis.";
    }
  };

  const createExerciseBody = (exercise) => {
    switch (exercise.format) {
      case "multiple-choice":
      case "case":
        return buildMultipleChoice(exercise);
      case "matching":
        return buildMatching(exercise);
      case "rearrangement":
        return buildRearrangement(exercise);
      case "conjugation-table":
        return buildConjugationTable(exercise);
      case "fill-blank":
      default:
        return buildFillBlank(exercise);
    }
  };

  const buildFillBlank = (exercise) => `
      <div class="input-group">
        <label for="exercise-input">${exercise.title}</label>
        <input
          id="exercise-input"
          name="answer"
          type="text"
          placeholder="Antwort eingeben"
          autocomplete="off"
        />
        <small class="form-help">Groß-/Kleinschreibung wird ignoriert.</small>
      </div>
    `;

  const buildMultipleChoice = (exercise) => {
    const options = (exercise.choices ?? []).map(
      (choice) => `
        <button type="button" class="option" data-choice="${choice}">
          ${choice}
        </button>`
    );

    return `
      <div class="exercise-mc">
        <div class="option-list">
          ${options.join("")}
        </div>
      </div>
    `;
  };

  const buildMatching = (exercise) => {
    const rightOptions = shuffleArray(
      Array.from(new Set(exercise.pairs.map((pair) => pair.right)))
    );
    const optionsHtml = () =>
      rightOptions
        .map((option) => `<option value="${option}">${option}</option>`)
        .join("");

    const rows = exercise.pairs
      .map(
        (pair) => `
        <div class="matching-item">
          <span>${pair.left}</span>
          <select data-match-left="${pair.left}">
            <option value="">Bitte wählen</option>
            ${optionsHtml()}
          </select>
        </div>
      `
      )
      .join("");

    return `
      <div class="exercise-matching">
        <div class="matching-grid">
          ${rows}
        </div>
        <small class="form-help">Ordne alle Begriffe korrekt zu.</small>
      </div>
    `;
  };

  const buildRearrangement = (exercise) => {
    state.arrangement = {
      selected: [],
      remaining: exercise.tokens.map((token, index) => ({ token, index })),
    };

    const tokenButtons = state.arrangement.remaining
      .map(
        (item) =>
          `<button type="button" class="pill" data-token="${item.token}" data-token-index="${item.index}">${item.token}</button>`
      )
      .join("");

    return `
      <div class="exercise-dragdrop">
        <div class="pill-group" data-remaining>
          ${tokenButtons}
        </div>
        <div class="drop-zone" data-selected>
          <span class="form-help">Klicke die Wörter in der richtigen Reihenfolge.</span>
        </div>
        <button type="button" class="secondary-action" data-action="reset-arrangement">
          Neu anordnen
        </button>
      </div>
    `;
  };

  const buildConjugationTable = (exercise) => {
    const rows = exercise.table
      .map(
        (row) => `
        <tr>
          <td>${row.pronoun}</td>
          <td>
            <input
              type="text"
              name="${row.pronoun}"
              data-pronoun="${row.pronoun}"
              placeholder="Form eintragen"
              autocomplete="off"
            />
          </td>
        </tr>
      `
      )
      .join("");

    return `
      <div class="input-group">
        <p class="form-help">Verb: <strong>${exercise.verb}</strong> · ${
      exercise.tense
    }</p>
        <table class="conjugation-table">
          <thead>
            <tr>
              <th>Person</th>
              <th>Form</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </div>
    `;
  };

  const handleSubmit = () => {
    if (!state.session) {
      setInlineFeedback("Bitte starte zuerst eine Übung.", false);
      return;
    }

    const exercise = state.session.exercises[state.session.index];
    if (!exercise) {
      setInlineFeedback("Keine aktive Aufgabe gefunden.", false);
      return;
    }

    try {
      const { value, error } = collectAnswer(exercise);
      if (error) {
        setInlineFeedback(error, false);
        return;
      }

      const validation = validateAnswer(exercise, value);
      const wasCorrect = validation.correct;

      updateSessionScore(exercise, wasCorrect);
      updateProgressUI();

      const feedbackMessage = buildFeedbackMessage(exercise, validation);
      setInlineFeedback(feedbackMessage.inline, wasCorrect);
      showFeedbackModal(feedbackMessage.modal, wasCorrect);
    } catch (error) {
      setInlineFeedback(
        "Beim Prüfen ist ein Fehler aufgetreten. Bitte versuche es erneut.",
        false
      );
      console.error(error);
    }
  };

  const collectAnswer = (exercise) => {
    const card = dom.exerciseCard;
    if (!card) return { value: null, error: "Übung nicht geladen." };

    switch (exercise.format) {
      case "multiple-choice":
      case "case": {
        if (!state.selectedChoice) {
          return { value: null, error: "Bitte wähle eine Antwort aus." };
        }
        return { value: state.selectedChoice, error: null };
      }
      case "matching": {
        const selects = Array.from(card.querySelectorAll("[data-match-left]"));
        const selections = {};
        for (const select of selects) {
          const left = select.dataset.matchLeft;
          const value = select.value;
          if (!value) {
            return {
              value: null,
              error: "Bitte ordne alle Begriffe zu.",
            };
          }
          selections[left] = value;
        }
        return { value: selections, error: null };
      }
      case "rearrangement": {
        if (!state.arrangement || state.arrangement.selected.length === 0) {
          return { value: null, error: "Bitte ordne die Wörter an." };
        }
        if (state.arrangement.selected.length < exercise.tokens.length) {
          return { value: null, error: "Bitte verwende alle Wörter." };
        }
        return {
          value: state.arrangement.selected.join(" "),
          error: null,
        };
      }
      case "conjugation-table": {
        const inputs = Array.from(card.querySelectorAll("[data-pronoun]"));
        const answers = {};
        for (const input of inputs) {
          if (!input.value.trim()) {
            return {
              value: null,
              error: "Bitte fülle alle Felder aus.",
            };
          }
          answers[input.dataset.pronoun] = input.value.trim();
        }
        return { value: answers, error: null };
      }
      case "fill-blank":
      default: {
        const input = card.querySelector("input[name='answer']");
        const value = input?.value?.trim();
        if (!value) {
          return { value: null, error: "Bitte gib eine Antwort ein." };
        }
        return { value, error: null };
      }
    }
  };

  const validateAnswer = (exercise, value) => {
    switch (exercise.format) {
      case "matching":
        return validateMatching(exercise, value);
      case "conjugation-table":
        return validateConjugationTable(exercise, value);
      case "rearrangement":
        return validateTextAnswer(exercise.answer, value);
      case "multiple-choice":
      case "case":
      case "fill-blank":
      default:
        return validateTextAnswer(exercise.answer, value);
    }
  };

  const validateMatching = (exercise, selections) => {
    const incorrect = [];
    exercise.pairs.forEach((pair) => {
      const expected = normalizeText(pair.right);
      const actual = normalizeText(selections[pair.left] ?? "");
      if (expected !== actual) {
        incorrect.push(`${pair.left} → ${pair.right}`);
      }
    });

    return {
      correct: incorrect.length === 0,
      incorrect,
    };
  };

  const validateConjugationTable = (exercise, answers) => {
    const incorrect = [];
    exercise.table.forEach((row) => {
      const expected = normalizeText(row.answer);
      const actual = normalizeText(answers[row.pronoun] ?? "");
      if (expected !== actual) {
        incorrect.push(`${row.pronoun}: ${row.answer}`);
      }
    });

    return {
      correct: incorrect.length === 0,
      incorrect,
    };
  };

  const validateTextAnswer = (expected, actual) => {
    const expectedAnswers = Array.isArray(expected) ? expected : [expected];
    const normalizedActual = normalizeText(actual);
    const correct = expectedAnswers.some(
      (answer) => normalizeText(answer) === normalizedActual
    );

    return { correct };
  };

  const buildFeedbackMessage = (exercise, validation) => {
    if (validation.correct) {
      return {
        inline: `Richtig! ${exercise.explanation ?? ""}`.trim(),
        modal: "Richtig! Gute Arbeit.",
      };
    }

    const correctAnswer = formatCorrectAnswer(exercise);
    const additional =
      validation.incorrect && validation.incorrect.length > 0
        ? `Korrekt wäre: ${validation.incorrect.join(", ")}.`
        : `Richtig wäre: ${correctAnswer}`;

    return {
      inline: `Leider falsch. ${additional}`.trim(),
      modal: `Leider falsch. ${additional}`,
    };
  };

  const formatCorrectAnswer = (exercise) => {
    if (exercise.format === "matching") {
      return exercise.pairs
        .map((pair) => `${pair.left} → ${pair.right}`)
        .join(", ");
    }

    if (exercise.format === "conjugation-table") {
      return exercise.table
        .map((row) => `${row.pronoun}: ${row.answer}`)
        .join(", ");
    }

    if (Array.isArray(exercise.answer)) {
      return exercise.answer.join(" / ");
    }

    return exercise.answer;
  };

  const selectChoice = (button) => {
    const card = dom.exerciseCard;
    if (!card) return;

    card.querySelectorAll("[data-choice]").forEach((option) => {
      option.classList.remove("is-selected");
      option.setAttribute("aria-pressed", "false");
    });

    button.classList.add("is-selected");
    button.setAttribute("aria-pressed", "true");
    state.selectedChoice = button.dataset.choice;
    clearInlineFeedback();
  };

  const selectToken = (button) => {
    if (!state.arrangement) return;
    const token = button.dataset.token;
    const tokenIndex = Number(button.dataset.tokenIndex);
    if (!token || Number.isNaN(tokenIndex)) return;

    const remainingIndex = state.arrangement.remaining.findIndex(
      (item) => item.index === tokenIndex
    );
    if (remainingIndex === -1) return;

    const [selectedItem] = state.arrangement.remaining.splice(remainingIndex, 1);
    state.arrangement.selected.push(selectedItem.token);

    const remainingContainer = dom.exerciseCard.querySelector("[data-remaining]");
    const selectedContainer = dom.exerciseCard.querySelector("[data-selected]");
    if (!remainingContainer || !selectedContainer) return;

    button.remove();
    clearInlineFeedback();
    const helper = selectedContainer.querySelector(".form-help");
    if (helper) helper.remove();
    const selectedButton = document.createElement("span");
    selectedButton.className = "pill";
    selectedButton.textContent = selectedItem.token;
    selectedContainer.appendChild(selectedButton);
  };

  const resetArrangement = () => {
    if (!state.session) return;
    const exercise = state.session.exercises[state.session.index];
    if (!exercise || exercise.format !== "rearrangement") return;
    renderExercise(exercise);
  };

  const showHint = () => {
    if (!state.session) {
      setInlineFeedback("Bitte starte zuerst eine Übung.", false);
      return;
    }

    const exercise = state.session.exercises[state.session.index];
    if (!exercise?.hint) {
      setInlineFeedback("Für diese Aufgabe gibt es keinen Hinweis.", false);
      return;
    }

    const hints = Array.isArray(exercise.hint) ? exercise.hint : [exercise.hint];
    const hintIndex = Math.min(state.hintIndex, hints.length - 1);
    const hint = hints[hintIndex];
    state.hintIndex = Math.min(state.hintIndex + 1, hints.length);

    if (dom.hintMessage) {
      dom.hintMessage.textContent = hint;
    }

    openDialog(dom.hintModal);
  };

  const showFeedbackModal = (message, correct) => {
    if (dom.feedbackStatus) {
      dom.feedbackStatus.textContent = correct
        ? "Richtig beantwortet!"
        : "Antwort prüfen";
    }

    if (dom.feedbackMessage) {
      dom.feedbackMessage.textContent = message;
    }

    state.advanceOnClose = true;
    openDialog(dom.feedbackModal);
  };

  const openDialog = (dialog) => {
    if (!dialog) return;
    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    } else {
      dialog.setAttribute("open", "true");
    }
  };

  const closeDialog = (dialog) => {
    if (!dialog) return;
    if (typeof dialog.close === "function") {
      dialog.close();
    } else {
      dialog.removeAttribute("open");
    }
  };

  const updateSessionScore = (exercise, wasCorrect) => {
    if (!state.session) return;

    if (wasCorrect) {
      state.session.correct += 1;
    } else {
      state.session.incorrect += 1;
    }

    updateExerciseCounters();
    updateProgressStorage(exercise, wasCorrect);
  };

  const updateExerciseCounters = () => {
    const total = state.session?.exercises.length ?? 0;
    const current = state.session ? state.session.index + 1 : 0;
    if (dom.questionTotal) dom.questionTotal.textContent = String(total);
    if (dom.questionIndex) dom.questionIndex.textContent = String(current);
    if (dom.correctCount)
      dom.correctCount.textContent = String(state.session?.correct ?? 0);
    if (dom.incorrectCount)
      dom.incorrectCount.textContent = String(state.session?.incorrect ?? 0);
  };

  const goToNextExercise = () => {
    if (!state.session) return;
    if (state.session.index < state.session.exercises.length - 1) {
      state.session.index += 1;
      updateExerciseCounters();
      renderExercise(state.session.exercises[state.session.index]);
      return;
    }

    renderCompletion();
  };

  const renderCompletion = () => {
    if (!dom.exerciseCard) return;

    dom.exerciseCard.className = "exercise-card exercise";
    dom.exerciseCard.innerHTML = `
      <h3>Übung abgeschlossen</h3>
      <p>Du hast ${state.session?.correct ?? 0} von ${
      state.session?.exercises.length ?? 0
    } Aufgaben richtig beantwortet.</p>
      <button type="button" class="primary-action" data-action="restart">
        Noch einmal starten
      </button>
      <div class="exercise-feedback" data-inline-feedback hidden></div>
    `;
  };

  const updateProgressStorage = (exercise, wasCorrect) => {
    if (!state.progress) return;

    const exerciseStats =
      state.progress.perExercise[exercise.id] ?? (state.progress.perExercise[exercise.id] = {
        attempts: 0,
        correct: 0,
      });

    exerciseStats.attempts += 1;
    if (wasCorrect) {
      exerciseStats.correct += 1;
      state.progress.totalCorrect += 1;
    } else {
      state.progress.totalIncorrect += 1;
    }
    state.progress.totalAttempts += 1;

    updateStreak();
    state.progress.lastExercise = {
      id: exercise.id,
      title: exercise.title,
      date: new Date().toISOString(),
    };

    saveStoredState();
  };

  const updateStreak = () => {
    if (!state.progress) return;
    const today = new Date();
    const todayKey = today.toISOString().slice(0, 10);

    if (!state.progress.streak.lastDate) {
      state.progress.streak.current = 1;
      state.progress.streak.lastDate = todayKey;
      return;
    }

    if (state.progress.streak.lastDate === todayKey) {
      return;
    }

    const lastDate = new Date(state.progress.streak.lastDate);
    const diffDays = Math.floor(
      (today.setHours(0, 0, 0, 0) - lastDate.setHours(0, 0, 0, 0)) /
        (1000 * 60 * 60 * 24)
    );

    if (diffDays === 1) {
      state.progress.streak.current += 1;
    } else {
      state.progress.streak.current = 1;
    }
    state.progress.streak.lastDate = todayKey;
  };

  const updateProgressUI = () => {
    if (!state.progress || dom.progressCards.length < 3) return;

    const totalExercises = countTotalExercises();
    const completedExercises = Object.values(state.progress.perExercise).filter(
      (stats) => stats.correct > 0
    ).length;
    const percent = totalExercises
      ? Math.round((completedExercises / totalExercises) * 100)
      : 0;

    const [overallCard, streakCard, lastCard] = dom.progressCards;
    const progressBar = overallCard.querySelector(".progress-bar");
    const progressFill = overallCard.querySelector(".progress-bar__fill");
    const progressMeta = overallCard.querySelector(".progress-meta");

    if (progressBar) {
      progressBar.setAttribute("aria-valuenow", String(percent));
    }
    if (progressFill) {
      progressFill.style.width = `${percent}%`;
    }
    if (progressMeta) {
      progressMeta.textContent = `${percent}% abgeschlossen`;
    }

    const streakValue = streakCard.querySelector(".progress-value");
    if (streakValue) {
      streakValue.textContent = `${state.progress.streak.current} Tage`;
    }

    const lastValue = lastCard.querySelector(".progress-value");
    if (lastValue) {
      lastValue.textContent = state.progress.lastExercise
        ? state.progress.lastExercise.title
        : "Noch keine";
    }
  };

  const countTotalExercises = () =>
    Object.values(DEFAULT_EXERCISES.exercises).reduce(
      (total, list) => total + list.length,
      0
    );

  const setInlineFeedback = (message, isCorrect) => {
    const feedback = dom.exerciseCard?.querySelector("[data-inline-feedback]");
    if (!feedback) return;
    feedback.hidden = false;
    feedback.textContent = message;
    feedback.className = `exercise-feedback ${
      isCorrect ? "correct" : "incorrect"
    }`;
  };

  const clearInlineFeedback = () => {
    const feedback = dom.exerciseCard?.querySelector("[data-inline-feedback]");
    if (!feedback) return;
    feedback.hidden = true;
    feedback.textContent = "";
    feedback.className = "exercise-feedback";
  };

  const normalizeText = (value) =>
    String(value)
      .toLowerCase()
      .replace(/[.,!?]/g, "")
      .replace(/\s+/g, " ")
      .trim();

  const shuffleArray = (items) => {
    const array = [...items];
    for (let i = array.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const loadStoredState = () => {
    const defaultState = {
      progress: {
        totalAttempts: 0,
        totalCorrect: 0,
        totalIncorrect: 0,
        streak: { current: 0, lastDate: null },
        lastExercise: null,
        perExercise: {},
      },
      preferences: {
        theme: "system",
      },
    };

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultState;
      const parsed = JSON.parse(raw);
      return {
        progress: { ...defaultState.progress, ...parsed.progress },
        preferences: { ...defaultState.preferences, ...parsed.preferences },
      };
    } catch (error) {
      state.storageAvailable = false;
      console.warn("LocalStorage nicht verfügbar.", error);
      return defaultState;
    }
  };

  const saveStoredState = () => {
    if (!state.storageAvailable) return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          progress: state.progress,
          preferences: state.preferences,
        })
      );
    } catch (error) {
      state.storageAvailable = false;
      console.warn("LocalStorage konnte nicht aktualisiert werden.", error);
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize);
  } else {
    initialize();
  }
})();
