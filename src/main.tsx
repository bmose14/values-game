import React from "react";
import ReactDOM from "react-dom/client";
import { AnimatePresence, Reorder, motion } from "framer-motion";
import { Check, ChevronLeft, ChevronRight, Copy, EyeOff, GripVertical, Heart, Plus, RotateCcw, Share2, Sparkles } from "lucide-react";
import "./styles.css";

type Value = {
  title: string;
  description: string;
};

type Step = 1 | 2 | 3 | 4 | 5 | 6;
type ShareStatus = "idle" | "shared" | "copied" | "saved";
type Theme =
  | "freedom"
  | "stability"
  | "family"
  | "growth"
  | "adventure"
  | "pleasure"
  | "sensuality"
  | "spirituality"
  | "practicality"
  | "status"
  | "connection"
  | "beauty"
  | "custom";

type ResultProfile = {
  archetype: string;
  summary: string;
  prompts: string[];
};

const baseValues: Value[] = [
  { title: "INNER HARMONY", description: "Feeling calm, centered, and at peace within yourself" },
  { title: "EQUALITY", description: "Wanting fairness, mutual respect, and shared power" },
  { title: "SOCIAL POWER", description: "Having influence, leverage, and a strong place in the room" },
  { title: "PLEASURE", description: "Enjoying life through comfort, sensuality, and delight" },
  { title: "FREEDOM", description: "Valuing autonomy, movement, and self-direction" },
  { title: "SPIRITUAL LIFE", description: "Feeling connected to something greater than yourself" },
  { title: "SENSE OF BELONGING", description: "Feeling accepted, included, and rooted with others" },
  { title: "SOCIAL ORDER", description: "Preferring structure, rules, and a dependable social world" },
  { title: "FULFILLMENT OF LIFE", description: "Wanting a life that feels whole, meaningful, and complete" },
  { title: "MEANING OF LIFE", description: "Seeking purpose, direction, and a clear reason to live" },
  { title: "KINDNESS", description: "Choosing warmth, care, and generosity toward others" },
  { title: "WEALTH", description: "Creating financial security, options, and room to breathe" },
  { title: "NATIONAL SECURITY", description: "Valuing safety, order, and protection at a larger scale" },
  { title: "SELF-RESPECT", description: "Holding yourself to a standard and wanting to live with dignity" },
  { title: "SUCCESS", description: "Wanting results, achievement, and visible momentum" },
  { title: "CREATIVITY", description: "Expressing imagination, originality, and fresh thinking" },
  { title: "PEACE IN THE WORLD", description: "Wanting harmony, reduced conflict, and a gentler world" },
  { title: "RESPECT FOR TRADITIONS", description: "Valuing rituals, continuity, and inherited wisdom" },
  { title: "MATURE LOVE", description: "Seeing love as steady, committed, and worth sacrifice" },
  { title: "SELF-DISCIPLINE", description: "Choosing consistency, restraint, and self-control" },
  { title: "CONFIDENTIALITY", description: "Protecting trust by keeping private things private" },
  { title: "FAMILY SAFETY", description: "Wanting home, children, and loved ones to feel protected" },
  { title: "SOCIAL RECOGNITION", description: "Wanting to be seen, respected, and publicly valued" },
  { title: "UNITY WITH NATURE", description: "Feeling grounded through the natural world and the outdoors" },
  { title: "DIVERSITY OF LIFE", description: "Welcoming variety, change, and many different experiences" },
  { title: "WISDOM", description: "Valuing good judgment, perspective, and mature thinking" },
  { title: "EMPOWERMENT", description: "Wanting agency, confidence, and real capacity to act" },
  { title: "TRUE FRIENDSHIP", description: "Wanting trust, companionship, and genuine mutual liking" },
  { title: "WORLD OF BEAUTY", description: "Seeking beauty, refinement, and aesthetically rich surroundings" },
  { title: "SOCIAL JUSTICE", description: "Caring about fairness, dignity, and how people are treated" },
  { title: "INDEPENDENCE", description: "Preferring self-reliance and the freedom to stand on your own" },
  { title: "SELF-CONTROL", description: "Staying steady by managing impulses and emotions" },
  { title: "VALUE OF SEX", description: "Seeing sex as meaningful, connective, and important" },
  { title: "AMBITIOUSNESS", description: "Pursuing growth, achievement, and high goals" },
  { title: "TOLERANCE", description: "Making room for differences, imperfection, and mixed views" },
  { title: "MODESTY", description: "Preferring humility, restraint, and not making a fuss" },
  { title: "THIRST FOR ADVENTURE", description: "Wanting exploration, novelty, and meaningful risk" },
  { title: "PROTECTION OF THE ENVIRONMENT", description: "Caring about the natural world and long-term stewardship" },
  { title: "INFLUENCE", description: "Wanting the ability to shape outcomes and affect others" },
  { title: "RESPECT FOR PARENTS AND ELDERLY PEOPLE", description: "Honoring family, age, and the people who came before" },
  { title: "CHOOSING MY OWN GOALS", description: "Wanting to set your own path rather than inherit one" },
  { title: "HEALTH", description: "Protecting physical vitality, energy, and long-term well-being" },
  { title: "COMPETENCE", description: "Being capable, effective, and able to solve problems" },
  { title: "ACCEPTING ALL SIDES OF LIFE", description: "Making peace with complexity, hardship, and contradiction" },
  { title: "HONESTY", description: "Telling the truth and wanting truth in return" },
  { title: "REPUTATION", description: "Caring how you are known and whether your name carries weight" },
  { title: "BEING HEARD", description: "Wanting your voice to matter and your perspective to land" },
  { title: "INTELLECT", description: "Valuing thought, learning, and mental sharpness" },
  { title: "ENJOYMENT OF LIFE", description: "Wanting life to feel good, alive, and worth savoring" },
  { title: "USEFULNESS", description: "Wanting to contribute, help, and matter in practical ways" },
  { title: "FAITH", description: "Trusting in God, belief, or a larger spiritual order" },
  { title: "RESPONSIBILITY", description: "Owning obligations, consequences, and follow-through" },
  { title: "CURIOSITY", description: "Wanting to learn, explore, and keep discovering" },
  { title: "FORGIVENESS", description: "Making room for repair, mercy, and a second chance" },
  { title: "CLEANLINESS", description: "Preferring order, neatness, and a tidy environment" },
  { title: "SELF-EVALUATION", description: "Looking inward, reflecting honestly, and improving over time" },
];

const rankLabels = ["Core Value", "Very Important", "Important", "Meaningful", "Still Matters"];

const valueThemes: Record<string, Theme[]> = {
  "INNER HARMONY": ["spirituality", "stability"],
  EQUALITY: ["connection", "stability"],
  "SOCIAL POWER": ["status", "growth"],
  PLEASURE: ["sensuality", "connection"],
  FREEDOM: ["freedom"],
  "SPIRITUAL LIFE": ["spirituality", "stability"],
  "SENSE OF BELONGING": ["connection", "family"],
  "SOCIAL ORDER": ["stability", "practicality"],
  "FULFILLMENT OF LIFE": ["spirituality", "growth"],
  "MEANING OF LIFE": ["spirituality", "growth"],
  KINDNESS: ["connection", "stability"],
  WEALTH: ["practicality", "status"],
  "NATIONAL SECURITY": ["stability", "status"],
  "SELF-RESPECT": ["stability", "connection"],
  SUCCESS: ["growth", "status"],
  CREATIVITY: ["growth", "beauty"],
  "PEACE IN THE WORLD": ["spirituality", "connection"],
  "RESPECT FOR TRADITIONS": ["stability", "family"],
  "MATURE LOVE": ["connection", "family", "stability"],
  "SELF-DISCIPLINE": ["practicality", "stability"],
  CONFIDENTIALITY: ["stability", "connection"],
  "FAMILY SAFETY": ["family", "stability"],
  "SOCIAL RECOGNITION": ["status", "connection"],
  "UNITY WITH NATURE": ["spirituality", "stability"],
  "DIVERSITY OF LIFE": ["growth", "adventure"],
  WISDOM: ["stability", "growth"],
  EMPOWERMENT: ["freedom", "status"],
  "TRUE FRIENDSHIP": ["connection", "family"],
  "WORLD OF BEAUTY": ["beauty", "status"],
  "SOCIAL JUSTICE": ["connection", "spirituality"],
  INDEPENDENCE: ["freedom"],
  "SELF-CONTROL": ["practicality", "stability"],
  "VALUE OF SEX": ["sensuality", "connection"],
  AMBITIOUSNESS: ["growth", "status"],
  TOLERANCE: ["connection", "stability"],
  MODESTY: ["stability", "family"],
  "THIRST FOR ADVENTURE": ["adventure", "freedom"],
  "PROTECTION OF THE ENVIRONMENT": ["spirituality", "stability"],
  INFLUENCE: ["status", "growth"],
  "RESPECT FOR PARENTS AND ELDERLY PEOPLE": ["family", "stability"],
  "CHOOSING MY OWN GOALS": ["freedom", "growth"],
  HEALTH: ["stability", "practicality"],
  COMPETENCE: ["practicality", "growth"],
  "ACCEPTING ALL SIDES OF LIFE": ["spirituality", "stability"],
  HONESTY: ["connection", "stability"],
  REPUTATION: ["status", "stability"],
  "BEING HEARD": ["connection", "status"],
  INTELLECT: ["growth", "practicality"],
  "ENJOYMENT OF LIFE": ["pleasure", "connection"],
  USEFULNESS: ["practicality", "connection"],
  FAITH: ["spirituality", "stability"],
  RESPONSIBILITY: ["practicality", "stability"],
  CURIOSITY: ["growth", "adventure"],
  FORGIVENESS: ["connection", "stability"],
  CLEANLINESS: ["practicality", "stability"],
  "SELF-EVALUATION": ["growth", "stability"],
};

function App() {
  const [step, setStep] = React.useState<Step>(1);
  const [firstPicks, setFirstPicks] = React.useState<string[]>([]);
  const [secondPicks, setSecondPicks] = React.useState<string[]>([]);
  const [topTenPicks, setTopTenPicks] = React.useState<string[]>([]);
  const [finalPicks, setFinalPicks] = React.useState<string[]>([]);
  const [ranking, setRanking] = React.useState<string[]>([]);
  const [shareStatus, setShareStatus] = React.useState<ShareStatus>("idle");
  const [customValues, setCustomValues] = React.useState<Value[]>([]);
  const [hiddenFirst, setHiddenFirst] = React.useState<string[]>([]);

  const values = React.useMemo(() => [...baseValues, ...customValues], [customValues]);
  const splitIndex = Math.ceil(baseValues.length / 2);
  const firstRoundValues = React.useMemo(() => [...baseValues.slice(0, splitIndex), ...customValues], [customValues, splitIndex]);
  const secondRoundValues = React.useMemo(() => baseValues.slice(splitIndex), [splitIndex]);
  const selectedTwenty = React.useMemo(
    () => values.filter((value) => firstPicks.includes(value.title) || secondPicks.includes(value.title)),
    [firstPicks, secondPicks, values],
  );
  const selectedTen = values.filter((value) => topTenPicks.includes(value.title));
  const rankedValues = ranking.map((title) => values.find((value) => value.title === title)).filter(Boolean) as Value[];
  const progress = step === 6 ? 100 : Math.round(((step - 1) / 5) * 100);
  const canGoBack = step > 1;
  const canGoForward =
    (step === 1 && firstPicks.length === 10) ||
    (step === 2 && secondPicks.length === 10) ||
    (step === 3 && topTenPicks.length === 10) ||
    (step === 4 && finalPicks.length === 5) ||
    step === 5;

  React.useLayoutEffect(() => {
    const resetScroll = () => {
      window.scrollTo(0, 0);
      document.scrollingElement?.scrollTo(0, 0);
    };

    resetScroll();
    requestAnimationFrame(resetScroll);
    window.setTimeout(resetScroll, 80);
    window.setTimeout(resetScroll, 420);
    window.setTimeout(resetScroll, 760);
  }, [step]);

  function toggleFirst(title: string) {
    setFirstPicks((current) => {
      if (current.includes(title)) return current.filter((item) => item !== title);
      if (current.length >= 10) return current;
      return [...current, title];
    });
  }

  function toggleHiddenFirst(title: string) {
    setHiddenFirst((current) =>
      current.includes(title) ? current.filter((item) => item !== title) : [...current, title]
    );
  }

  function toggleSecond(title: string) {
    setSecondPicks((current) => {
      if (current.includes(title)) return current.filter((item) => item !== title);
      if (current.length >= 10) return current;
      return [...current, title];
    });
  }

  function toggleTopTen(title: string) {
    setTopTenPicks((current) => {
      if (current.includes(title)) return current.filter((item) => item !== title);
      if (current.length >= 10) return current;
      return [...current, title];
    });
  }

  function toggleFinal(title: string) {
    setFinalPicks((current) => {
      if (current.includes(title)) return current.filter((item) => item !== title);
      if (current.length >= 5) return current;
      return [...current, title];
    });
  }

  function goToRank() {
    setRanking(finalPicks);
    setStep(5);
  }

  function goBack() {
    setStep((current) => {
      const next = Math.max(1, current - 1) as Step;
      if (current === 2) {
        setSecondPicks([]);
        setTopTenPicks([]);
        setFinalPicks([]);
        setRanking([]);
      } else if (current === 3) {
        setTopTenPicks([]);
        setFinalPicks([]);
        setRanking([]);
      } else if (current === 4) {
        setFinalPicks([]);
        setRanking([]);
      } else if (current === 5) {
        setRanking([]);
      }
      return next;
    });
  }

  function goForward() {
    if (!canGoForward) return;

    if (step === 1) {
      setStep(2);
      return;
    }

    if (step === 2) {
      setStep(3);
      return;
    }

    if (step === 3) {
      setStep(4);
      return;
    }

    if (step === 4) {
      goToRank();
      return;
    }

    if (step === 5) {
      setStep(6);
    }
  }

  function restart() {
    setStep(1);
    setFirstPicks([]);
    setSecondPicks([]);
    setTopTenPicks([]);
    setFinalPicks([]);
    setRanking([]);
    setShareStatus("idle");
    setHiddenFirst([]);
  }

  function addCustomValue(title: string) {
    const cleanTitle = title.trim().replace(/\s+/g, " ");
    if (!cleanTitle) return false;
    if (values.some((value) => value.title.toLowerCase() === cleanTitle.toLowerCase())) return false;

    setCustomValues((current) => [
      ...current,
      { title: cleanTitle, description: "A value you added" },
    ]);
    return true;
  }

  async function shareResults() {
    const profile = buildResultProfile(rankedValues);
    const text = buildShareText(rankedValues, profile);
    const imageBlob = await createShareCardBlob(rankedValues, profile);
    const imageFile = new File([imageBlob], "the-values-game-results.png", { type: "image/png" });
    setShareStatus("idle");

    if (navigator.canShare?.({ files: [imageFile] }) && navigator.share) {
      try {
        await navigator.share({ title: "The Values Game", text, files: [imageFile] });
        setShareStatus("shared");
        window.setTimeout(() => setShareStatus("idle"), 1800);
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }

    if (navigator.share) {
      try {
        await navigator.share({ title: "The Values Game", text });
        setShareStatus("shared");
        window.setTimeout(() => setShareStatus("idle"), 1800);
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }

    downloadBlob(imageBlob, "the-values-game-results.png");

    try {
      await navigator.clipboard.writeText(text);
      setShareStatus("copied");
    } catch {
      setShareStatus("saved");
    }

    window.setTimeout(() => setShareStatus("idle"), 2200);
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-linen text-ink">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col px-4 pb-44 pt-5 sm:max-w-xl">
        <header className="mb-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-rosewood/70">
              <Heart className="h-4 w-4 fill-blush text-rosewood" />
              The Values Game
            </div>
            {(firstPicks.length > 0 || step > 1 || hiddenFirst.length > 0) && (
              <div className="flex items-center gap-2">
                <button
                  className="grid h-10 w-10 place-items-center rounded-full bg-white/80 text-rosewood shadow-soft transition active:scale-95 disabled:cursor-not-allowed disabled:text-ink/20 disabled:shadow-none"
                  onClick={goBack}
                  disabled={!canGoBack}
                  aria-label="Go back"
                  title="Go back"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  className="grid h-10 w-10 place-items-center rounded-full bg-white/80 text-rosewood shadow-soft transition active:scale-95 disabled:cursor-not-allowed disabled:text-ink/20 disabled:shadow-none"
                  onClick={goForward}
                  disabled={!canGoForward}
                  aria-label="Go forward"
                  title="Go forward"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              <button
                className="grid h-10 w-10 place-items-center rounded-full bg-white/80 text-rosewood shadow-soft transition active:scale-95"
                onClick={restart}
                aria-label="Restart"
                title="Restart"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              </div>
            )}
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white shadow-inner">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-rosewood via-honey to-sage"
              animate={{ width: `${progress}%` }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
            />
          </div>
        </header>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <PickStep
              key="step-1"
              title="Pick 10"
              text="Choose the 10 qualities that matter most to you from this first half, in no particular order."
              roundLabel="Round 1 of 5"
              progressLabel="Pick 10"
              intro
              values={firstRoundValues}
              selected={firstPicks}
              target={10}
              stepProgress={Math.round((firstPicks.length / 10) * 100)}
              onToggle={toggleFirst}
              onContinue={() => setStep(2)}
              onAddCustom={addCustomValue}
              hiddenTitles={hiddenFirst}
              onToggleHidden={toggleHiddenFirst}
            />
          )}
          {step === 2 && (
            <PickStep
              key="step-2"
              title="Pick 10"
              text="Now choose the 10 qualities that matter most to you from the second half, in no particular order."
              roundLabel="Round 2 of 5"
              progressLabel="Pick 10"
              values={secondRoundValues}
              selected={secondPicks}
              target={10}
              stepProgress={Math.round((secondPicks.length / 10) * 100)}
              onToggle={toggleSecond}
              onContinue={() => setStep(3)}
            />
          )}
          {step === 3 && (
            <PickStep
              key="step-3"
              title="Narrow to 10"
              text="Now choose the 10 you couldn't live without from the 20 you picked."
              roundLabel="Round 3 of 5"
              progressLabel="Narrow to 10"
              values={selectedTwenty}
              selected={topTenPicks}
              target={10}
              stepProgress={Math.round((topTenPicks.length / 10) * 100)}
              onToggle={toggleTopTen}
              onContinue={() => setStep(4)}
            />
          )}
          {step === 4 && (
            <PickStep
              key="step-4"
              title="Narrow to 5"
              text="Now choose the 5 you couldn't live without."
              roundLabel="Round 4 of 5"
              progressLabel="Narrow to 5"
              values={selectedTen}
              selected={finalPicks}
              target={5}
              stepProgress={Math.round((finalPicks.length / 5) * 100)}
              onToggle={toggleFinal}
              onContinue={goToRank}
            />
          )}
          {step === 5 && (
            <RankStep
              key="step-5"
              roundLabel="Round 5 of 5"
              values={values}
              ranking={ranking}
              setRanking={setRanking}
              onContinue={() => setStep(6)}
            />
          )}
          {step === 6 && (
            <Results
              key="results"
              rankedValues={rankedValues}
              onShare={shareResults}
              onRestart={restart}
              shareStatus={shareStatus}
            />
          )}
        </AnimatePresence>
        <footer className="mt-auto pb-36 pt-8 text-center text-[11px] leading-5 text-ink/45">
          Developed by Brian Moseley · May 2026 · For feedback email{" "}
          <a className="font-semibold text-rosewood/70" href="mailto:bmose14@gmail.com">
            bmose14@gmail.com
          </a>
        </footer>
      </div>
    </main>
  );
}

function PickStep({
  title,
  text,
  roundLabel,
  progressLabel,
  intro = false,
  values: stepValues,
  selected,
  target,
  stepProgress,
  onToggle,
  onContinue,
  onAddCustom,
  hiddenTitles = [],
  onToggleHidden,
}: {
  title: string;
  text: string;
  roundLabel: string;
  progressLabel: string;
  intro?: boolean;
  values: Value[];
  selected: string[];
  target: number;
  stepProgress: number;
  onToggle: (title: string) => void;
  onContinue: () => void;
  onAddCustom?: (title: string) => boolean;
  hiddenTitles?: string[];
  onToggleHidden?: (title: string) => void;
}) {
  const canContinue = selected.length === target;
  const left = Math.max(target - selected.length, 0);
  const [activeValue, setActiveValue] = React.useState<Value | null>(null);

  React.useEffect(() => {
    setActiveValue((current) => {
      if (selected.length === 0) return null;
      if (current && stepValues.some((value) => value.title === current.title)) return current;
      return null;
    });
  }, [selected.length, stepValues]);

  function handleToggle(value: Value) {
    setActiveValue(value);
    onToggle(value.title);
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18 }}
      transition={{ duration: 0.28 }}
      className="flex flex-1 flex-col"
    >
      {intro && (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-3 rounded-[1.25rem] border border-white/80 bg-white/70 p-3.5 shadow-soft backdrop-blur"
        >
          <Sparkles className="mb-2 h-4 w-4 text-honey" />
          <h1 className="font-serif text-4xl leading-[0.92] text-rosewood">The Values Game</h1>
          <p className="mt-2 text-[13px] leading-5 text-ink/74">
            Most people think they know their type. But few have actually taken the time to understand their values.
          </p>
        </motion.div>
      )}

      <div className="mb-3 flex items-end justify-between gap-3">
        <div>
          <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-rosewood/62">{roundLabel}</div>
          <h2 className="font-serif text-3xl leading-none text-ink">{title}</h2>
          <p className="mt-1 text-xs leading-5 text-ink/62">{text}</p>
        </div>
        <div className="shrink-0 rounded-2xl bg-rosewood px-3 py-2 text-right text-[11px] font-bold leading-4 text-white shadow-soft">
          <div>{selected.length} picked</div>
          <div className="text-white/78">{left} left</div>
        </div>
      </div>

      {activeValue && selected.length > 0 && (
        <motion.div
          key={activeValue.title}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="pointer-events-none sticky top-4 z-20 mx-auto mb-3 max-w-md rounded-[1rem] border border-white/80 bg-white/95 p-3 shadow-lift backdrop-blur-xl"
        >
          <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-honey">What it means</div>
          <div className="mt-1 font-serif text-xl leading-5 text-ink">{activeValue.title}</div>
          <p className="mt-1 text-xs leading-5 text-ink/62">{activeValue.description}</p>
        </motion.div>
      )}

      <div className="grid grid-cols-4 gap-2 pb-60 pt-4">
        {stepValues.map((value, index) => (
          <ValueCard
            key={value.title}
            value={value}
            selected={selected.includes(value.title)}
            hidden={hiddenTitles.includes(value.title)}
            onToggle={handleToggle}
            onToggleHidden={onToggleHidden ? () => onToggleHidden(value.title) : undefined}
            canHide={!selected.includes(value.title) && Boolean(onToggleHidden)}
            index={index}
          />
        ))}
        {onAddCustom && <AddValueCard onAdd={onAddCustom} />}
      </div>

      <div className="pointer-events-none fixed inset-x-4 bottom-[5.5rem] z-10 mx-auto max-w-md rounded-[1.15rem] border border-white/85 bg-white/95 px-4 py-3 shadow-lift backdrop-blur-xl">
        <div className="mb-2 flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.18em] text-rosewood/68">
          <span>{progressLabel}</span>
          <span>
            {selected.length}/{target}
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-[#f4e9e2]">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-rosewood via-[#b06a61] to-sage"
            animate={{ width: `${Math.min(stepProgress, 100)}%` }}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
          />
        </div>
        <div className="mt-2 text-[11px] leading-4 text-ink/58">
          {selected.length === target ? "You’re ready to continue." : `${left} more to go.`}
        </div>
      </div>

      <ActionBar
        label={canContinue ? "Continue" : `${selected.length} selected · ${left} left`}
        disabled={!canContinue}
        onClick={onContinue}
      />
    </motion.section>
  );
}

function ValueCard({
  value,
  selected,
  hidden,
  onToggle,
  onToggleHidden,
  canHide = false,
  index,
}: {
  value: Value;
  selected: boolean;
  hidden: boolean;
  onToggle: (value: Value) => void;
  onToggleHidden?: () => void;
  canHide?: boolean;
  index: number;
}) {
  function handleClick() {
    if (hidden) {
      onToggleHidden?.();
      return;
    }

    onToggle(value);
  }

  return (
    <div className="relative" style={{ perspective: "1200px" }}>
      <motion.button
        type="button"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0, rotateY: hidden ? 180 : 0 }}
        transition={{ delay: Math.min(index * 0.018, 0.25), type: "spring", stiffness: 120, damping: 16 }}
        whileTap={{ scale: 0.985 }}
        onClick={handleClick}
        className={`group relative flex aspect-[0.94] w-full items-center justify-center overflow-hidden rounded-[1rem] border px-1.5 py-2 text-center shadow-soft transition ${
          hidden
            ? "border-ink/10 bg-[#4b3d38] shadow-lift"
            : selected
              ? "border-rosewood/70 bg-[#fff4ef] shadow-lift ring-1 ring-rosewood/10"
              : "border-white/90 bg-white/82 hover:border-blush hover:bg-white"
        }`}
        style={{ transformStyle: "preserve-3d" }}
        aria-pressed={selected}
      >
        <div
          className="absolute inset-0 flex items-center justify-center rounded-[1rem] px-1.5 py-2"
          style={{ backfaceVisibility: "hidden" }}
        >
          <span
            className={`break-words font-serif text-[clamp(0.66rem,2.6vw,0.92rem)] font-semibold leading-[1.05] ${
              hidden ? "text-white/92" : selected ? "text-rosewood" : "text-ink"
            }`}
          >
            {value.title}
          </span>
        </div>

        <div
          className="absolute inset-0 flex items-center justify-center rounded-[1rem] px-2 py-2"
          style={{
            transform: "rotateY(180deg)",
            backfaceVisibility: "hidden",
          }}
        >
          <div className="h-full w-full rounded-[0.9rem] bg-[#ede6dc]" />
        </div>

        {!hidden && (
          <span
            className={`pointer-events-none absolute right-1 top-1 grid h-4 w-4 shrink-0 place-items-center rounded-full border transition ${
              selected ? "border-rosewood bg-rosewood text-white shadow-sm" : "border-ink/12 bg-linen text-transparent"
            }`}
          >
            <Check className="h-2.5 w-2.5" />
          </span>
        )}
      </motion.button>

      {!hidden && canHide && onToggleHidden && (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onToggleHidden();
          }}
          className="absolute left-1 top-1 z-10 grid h-5 w-5 place-items-center rounded-full border border-ink/12 bg-white/90 text-ink/42 transition hover:text-rosewood"
          title="Hide this card"
          aria-label={`Hide ${value.title}`}
        >
          <EyeOff className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}

function AddValueCard({ onAdd }: { onAdd: (title: string) => boolean }) {
  const [isAdding, setIsAdding] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [error, setError] = React.useState("");

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const added = onAdd(title);
    if (!added) {
      setError("Try a new value");
      return;
    }

    setTitle("");
    setError("");
    setIsAdding(false);
  }

  if (isAdding) {
    return (
      <motion.form
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        onSubmit={submit}
        className="col-span-4 grid grid-cols-[1fr_auto] gap-2 rounded-[1rem] border border-rosewood/25 bg-white/88 p-2 shadow-soft"
      >
        <div>
          <input
            autoFocus
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
              setError("");
            }}
            placeholder="Add your own value"
            maxLength={24}
            className="h-10 w-full rounded-full border border-ink/10 bg-linen px-3 text-sm outline-none focus:border-rosewood"
          />
          {error && <div className="mt-1 px-2 text-[11px] font-semibold text-rosewood">{error}</div>}
        </div>
        <button
          type="submit"
          className="h-10 rounded-full bg-rosewood px-4 text-sm font-bold text-white shadow-soft active:scale-95"
        >
          Add
        </button>
      </motion.form>
    );
  }

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileTap={{ scale: 0.985 }}
      onClick={() => setIsAdding(true)}
      className="flex aspect-[0.94] w-full flex-col items-center justify-center gap-1 rounded-[1rem] border border-dashed border-rosewood/35 bg-white/55 px-1 text-center text-rosewood shadow-soft"
    >
      <Plus className="h-4 w-4" />
      <span className="text-[10px] font-bold leading-tight">Add Your Own</span>
    </motion.button>
  );
}

function RankStep({
  roundLabel,
  values,
  ranking,
  setRanking,
  onContinue,
}: {
  roundLabel: string;
  values: Value[];
  ranking: string[];
  setRanking: (items: string[]) => void;
  onContinue: () => void;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18 }}
      className="flex flex-1 flex-col"
    >
      <div className="mb-5">
        <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-rosewood/62">{roundLabel}</div>
        <h2 className="font-serif text-4xl leading-none text-ink">Rank Your Top 5</h2>
        <p className="mt-2 text-sm leading-5 text-ink/62">
          Put them in order from most important to still important.
        </p>
      </div>

      <Reorder.Group axis="y" values={ranking} onReorder={setRanking} className="space-y-3 pb-24">
        {ranking.map((title, index) => {
          const value = values.find((item) => item.title === title);
          if (!value) return null;

          return (
            <Reorder.Item
              key={title}
              value={title}
              whileDrag={{ scale: 1.025, boxShadow: "0 24px 55px rgba(100, 58, 45, 0.20)" }}
              className="touch-none rounded-[1.35rem] border border-white/90 bg-white p-4 shadow-soft"
            >
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#fff4ef] font-serif text-2xl text-rosewood">
                  {index + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold uppercase tracking-[0.16em] text-honey">{rankLabels[index]}</div>
                  <div className="mt-1 font-serif text-2xl leading-6">{prettyTitle(value.title)}</div>
                  <div className="mt-1 text-sm leading-5 text-ink/55">{value.description}</div>
                </div>
                <GripVertical className="h-5 w-5 shrink-0 text-ink/24" />
              </div>
            </Reorder.Item>
          );
        })}
      </Reorder.Group>

      <ActionBar label="Reveal Results" onClick={onContinue} />
    </motion.section>
  );
}

function Results({
  rankedValues,
  onShare,
  onRestart,
  shareStatus,
}: {
  rankedValues: Value[];
  onShare: () => void;
  onRestart: () => void;
  shareStatus: ShareStatus;
}) {
  const profile = buildResultProfile(rankedValues);
  const shareLabel =
    shareStatus === "shared"
      ? "Shared"
      : shareStatus === "copied"
        ? "Image Saved + Text Copied"
        : shareStatus === "saved"
          ? "Image Saved"
          : "Share My Results";

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18 }}
      className="pb-8"
    >
      <div className="mb-5">
        <h2 className="font-serif text-5xl leading-[0.95] text-rosewood">Your Values Profile</h2>
        <div className="mt-3 text-xs font-bold uppercase tracking-[0.18em] text-honey">{profile.archetype}</div>
        <p className="mt-2 text-sm leading-6 text-ink/62">{profile.summary}</p>
      </div>

      <div className="rounded-[1.8rem] border border-white/90 bg-white p-5 shadow-lift">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-rosewood/70">Top 5</span>
          <Heart className="h-5 w-5 fill-blush text-rosewood" />
        </div>

        <div className="space-y-3">
          {rankedValues.map((value, index) => (
            <div key={value.title} className="flex gap-3 rounded-[1.15rem] bg-linen p-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white font-serif text-xl text-rosewood shadow-sm">
                {index + 1}
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.15em] text-honey">{rankLabels[index]}</div>
                <div className="mt-0.5 font-serif text-2xl leading-6">{prettyTitle(value.title)}</div>
                <div className="mt-1 text-sm leading-5 text-ink/57">{value.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-[1fr_auto] gap-3">
        <button
          className="flex h-14 items-center justify-center gap-2 rounded-full bg-rosewood px-5 font-semibold text-white shadow-lift transition active:scale-[0.98]"
          onClick={onShare}
        >
          {shareStatus === "idle" ? <Share2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {shareLabel}
        </button>
        <button
          className="grid h-14 w-14 place-items-center rounded-full bg-white text-rosewood shadow-soft transition active:scale-95"
          onClick={onRestart}
          aria-label="Restart"
          title="Restart"
        >
          <RotateCcw className="h-5 w-5" />
        </button>
      </div>

      <ShareCardPreview rankedValues={rankedValues} profile={profile} />
    </motion.section>
  );
}

function ShareCardPreview({ rankedValues, profile }: { rankedValues: Value[]; profile: ResultProfile }) {
  return (
    <div className="mt-5 overflow-hidden rounded-[1.8rem] bg-[#2b2422] p-5 text-white shadow-lift">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <div className="text-xs font-bold uppercase tracking-[0.22em] text-blush">Share Card</div>
          <div className="mt-1 font-serif text-3xl">The Values Game</div>
          <div className="mt-1 text-[11px] font-bold uppercase tracking-[0.16em] text-honey">{profile.archetype}</div>
        </div>
        <Sparkles className="h-5 w-5 text-honey" />
      </div>
      <div className="space-y-2">
        {rankedValues.map((value, index) => (
          <div key={value.title} className="flex items-center justify-between rounded-2xl bg-white/9 px-3 py-2">
            <span className="font-serif text-xl">
              {index + 1}. {prettyTitle(value.title)}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/54">{rankLabels[index]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ActionBar({
  label,
  disabled = false,
  onClick,
}: {
  label: string;
  disabled?: boolean;
  onClick: () => void;
}) {
  function handleClick() {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    onClick();
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-10 border-t border-white/80 bg-linen/96 px-4 py-4 backdrop-blur-xl">
      <div className="mx-auto max-w-md sm:max-w-xl">
        <button
          disabled={disabled}
          onClick={handleClick}
          className="h-14 w-full rounded-full bg-rosewood px-5 font-semibold text-white shadow-lift transition active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-ink/18 disabled:text-ink/45 disabled:shadow-none"
        >
          {label}
        </button>
      </div>
    </div>
  );
}

function buildResultProfile(rankedValues: Value[]): ResultProfile {
  const titles = rankedValues.map((value) => value.title);
  const [first, second] = rankedValues;
  const has = (title: string) => titles.includes(title);
  const hasAny = (...themes: Theme[]) =>
    rankedValues.some((value) => getValueThemes(value.title).some((theme) => themes.includes(theme)));
  const primaryHas = (...themes: Theme[]) =>
    rankedValues.slice(0, 2).some((value) => getValueThemes(value.title).some((theme) => themes.includes(theme)));

  let archetype = "The Considered Partner";
  if (has("VALUE OF SEX") && (has("PLEASURE") || has("MATURE LOVE"))) archetype = "The Practical Romantic";
  else if (has("FREEDOM") && (has("INDEPENDENCE") || has("CHOOSING MY OWN GOALS") || has("THIRST FOR ADVENTURE"))) {
    archetype = "The Independent Explorer";
  } else if (has("MATURE LOVE") && (has("TRUE FRIENDSHIP") || has("RESPONSIBILITY") || has("FORGIVENESS"))) {
    archetype = "The Devoted Partner";
  } else if (has("INNER HARMONY") && (has("SPIRITUAL LIFE") || has("UNITY WITH NATURE") || has("MEANING OF LIFE"))) {
    archetype = "The Reflective Seeker";
  } else if (has("WEALTH") && (has("SUCCESS") || has("SOCIAL POWER") || has("INFLUENCE"))) {
    archetype = "The Capable Builder";
  } else if (has("KINDNESS") && has("SENSE OF BELONGING")) {
    archetype = "The Grounded Connector";
  } else if (primaryHas("family", "stability")) {
    archetype = "The Grounded Builder";
  } else if (primaryHas("freedom", "adventure")) {
    archetype = "The Independent Partner";
  } else if (primaryHas("connection", "sensuality")) {
    archetype = "The Connected Romantic";
  } else if (primaryHas("growth", "status")) {
    archetype = "The Ambitious Builder";
  } else if (primaryHas("spirituality")) {
    archetype = "The Reflective Explorer";
  }

  const summary =
    first && second
      ? `Your top pair leans toward ${prettyTitle(first.title)} and ${prettyTitle(second.title)}. That usually points to the kind of daily life, intimacy, and responsibility you want a relationship to hold together.`
      : "Your results are ready.";

  const prompts = unique([
    hasAny("practicality")
      ? "Where should love be simple and practical, and where should it stay human and unoptimized?"
      : "",
    hasAny("freedom", "adventure")
      ? "How much independence do you each need before closeness starts to feel crowded?"
      : "",
    hasAny("family")
      ? "What does a good home life actually look like day to day, not just someday?"
      : "",
    hasAny("connection", "sensuality")
      ? "What makes intimacy feel meaningful instead of just exciting?"
      : "",
    hasAny("growth", "status")
      ? "What are you trying to build together, and what would you refuse to trade to get it?"
      : "",
    hasAny("spirituality")
      ? "What gives your life meaning when things are calm, ordinary, or hard?"
      : "",
  ]).slice(0, 2);

  return {
    archetype,
    summary,
    prompts: prompts.length
      ? prompts
      : [
          "Which of these values would change your day-to-day choices the most?",
          "Where do our top values naturally overlap, and where would they ask for patience?",
        ],
  };
}

function getValueThemes(title: string): Theme[] {
  return valueThemes[title] ?? ["custom"];
}

function prettyTitle(title: string) {
  if (title !== title.toUpperCase()) return title;
  return title
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function scoreThemes(rankedValues: Value[]) {
  const weights = [4, 3, 2, 1, 1];
  return rankedValues.reduce<Record<string, number>>((scores, value, index) => {
    getValueThemes(value.title).forEach((theme) => {
      scores[theme] = (scores[theme] ?? 0) + (weights[index] ?? 1);
    });
    return scores;
  }, {});
}

function unique(items: string[]) {
  return Array.from(new Set(items.filter(Boolean)));
}

function buildShareText(rankedValues: Value[], profile: ResultProfile) {
  const lines = rankedValues.map((value, index) => `${index + 1}. ${prettyTitle(value.title)} - ${rankLabels[index]}`);
  return `My Values Game results:\n\n${profile.archetype}\n${profile.summary}\n\n${lines.join("\n")}`;
}

async function createShareCardBlob(rankedValues: Value[], profile: ResultProfile) {
  await document.fonts?.ready;

  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1350;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not create share card.");

  ctx.fillStyle = "#fffaf3";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const blush = ctx.createRadialGradient(210, 90, 10, 210, 90, 520);
  blush.addColorStop(0, "rgba(245, 218, 216, 0.82)");
  blush.addColorStop(1, "rgba(245, 218, 216, 0)");
  ctx.fillStyle = blush;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const honey = ctx.createRadialGradient(930, 250, 20, 930, 250, 520);
  honey.addColorStop(0, "rgba(201, 148, 84, 0.34)");
  honey.addColorStop(1, "rgba(201, 148, 84, 0)");
  ctx.fillStyle = honey;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawRoundRect(ctx, 70, 72, 940, 1206, 56, "#2b2422");

  ctx.fillStyle = "#f5dad8";
  ctx.font = "700 26px Inter, system-ui, sans-serif";
  ctx.fillText("THE VALUES GAME", 126, 156);

  ctx.fillStyle = "#c99454";
  ctx.font = "500 34px Georgia, serif";
  ctx.fillText("✦", 82, 160);

  ctx.fillStyle = "#fffaf3";
  ctx.font = "600 92px Georgia, serif";
  ctx.fillText("My Love", 126, 266);
  ctx.fillText("Compass", 126, 366);

  ctx.fillStyle = "#c99454";
  ctx.font = "800 26px Inter, system-ui, sans-serif";
  ctx.fillText(profile.archetype.toUpperCase(), 126, 424);

  ctx.fillStyle = "rgba(255, 250, 243, 0.74)";
  ctx.font = "400 30px Inter, system-ui, sans-serif";
  wrapText(ctx, profile.summary, 126, 482, 780, 42, 3);

  rankedValues.forEach((value, index) => {
    const y = 626 + index * 126;
    drawRoundRect(ctx, 126, y, 828, 98, 30, "rgba(255, 255, 255, 0.09)");

    ctx.fillStyle = "#fffaf3";
    ctx.beginPath();
    ctx.arc(178, y + 49, 28, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#8a4f4b";
    ctx.font = "600 28px Georgia, serif";
    ctx.textAlign = "center";
    ctx.fillText(String(index + 1), 178, y + 59);
    ctx.textAlign = "left";

    ctx.fillStyle = "#c99454";
    ctx.font = "800 22px Inter, system-ui, sans-serif";
    ctx.fillText(rankLabels[index].toUpperCase(), 230, y + 35);

    ctx.fillStyle = "#fffaf3";
    ctx.font = "600 42px Georgia, serif";
    ctx.fillText(prettyTitle(value.title), 230, y + 78);
  });

  ctx.fillStyle = "rgba(255, 250, 243, 0.48)";
  ctx.font = "500 24px Inter, system-ui, sans-serif";
  ctx.fillText("Send yours back and compare the overlap.", 126, 1196);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Could not export share card."));
    }, "image/png");
  });
}

function drawRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  fillStyle: string,
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  ctx.fillStyle = fillStyle;
  ctx.fill();
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines: number,
) {
  const words = text.split(" ");
  let line = "";
  let linesDrawn = 0;

  for (const word of words) {
    const nextLine = line ? `${line} ${word}` : word;
    if (ctx.measureText(nextLine).width > maxWidth && line) {
      ctx.fillText(linesDrawn === maxLines - 1 ? `${line}...` : line, x, y);
      linesDrawn += 1;
      if (linesDrawn >= maxLines) return;
      line = word;
      y += lineHeight;
    } else {
      line = nextLine;
    }
  }

  if (line && linesDrawn < maxLines) {
    ctx.fillText(line, x, y);
  }
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
