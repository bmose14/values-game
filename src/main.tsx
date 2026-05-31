import React from "react";
import ReactDOM from "react-dom/client";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Copy, EyeOff, Heart, Plus, RotateCcw, Share2, Sparkles } from "lucide-react";
import "./styles.css";

type Value = {
  title: string;
  description: string;
};

type Step = 0 | 1 | 2 | 3 | 4 | 5 | 6;
type ShareStatus = "idle" | "shared" | "copied" | "saved";

const baseValues: Value[] = [
  // Family & partnership orientation
  { title: "interdependence", description: "Believing strong people still need each other" },
  { title: "shared life", description: "Wanting partnership to shape life, not just decorate it" },
  { title: "mature love", description: "Love rooted in commitment, sacrifice, and long-term care" },
  { title: "long-term partnership", description: "Building a meaningful life with one person over time" },
  { title: "family devotion", description: "Prioritizing deep family bonds and future generations" },
  { title: "parenthood", description: "Valuing the role of raising and guiding children" },
  { title: "rootedness", description: "Desire for home, family, continuity, and a settled life" },
  { title: "ordinary life", description: "Finding meaning in routine, rituals, and shared daily life" },
  { title: "loyalty", description: "Remaining committed during difficult seasons" },
  { title: "responsibility", description: "Taking ownership of obligations and consequences" },
  { title: "sacrifice", description: "Willingness to give up something good for something greater" },
  { title: "sense of belonging", description: "Feeling deeply connected to people and community" },
  { title: "home life", description: "Creating a warm, stable private world together" },
  { title: "tradition", description: "Respecting family rituals, continuity, and inherited wisdom" },
  // Character & emotional maturity
  { title: "emotional stability", description: "Remaining calm and reliable under stress" },
  { title: "self-discipline", description: "Consistency and control over impulses, emotions, and behavior" },
  { title: "clear expectations", description: "Saying what you need before silence becomes resentment" },
  { title: "uncomfortable honesty", description: "Willingness to share difficult truths before they become betrayals" },
  { title: "forgiveness", description: "Ability to repair, release resentment, and move forward" },
  { title: "resilience", description: "Ability to endure hardship and adapt" },
  { title: "practicality", description: "Prioritizing what works in real life" },
  { title: "resourcefulness", description: "Solving problems with creativity and resilience" },
  { title: "wisdom", description: "Judgment, maturity, and perspective" },
  { title: "kindness", description: "Warmth shown consistently in ordinary moments" },
  { title: "tenderness", description: "Softness, affection, and emotional warmth" },
  // Mind, spirit & inner life
  { title: "curiosity", description: "Desire to learn, explore, and stay mentally alive" },
  { title: "creativity", description: "Imagination, originality, and expression" },
  { title: "spiritual life", description: "Connection to something greater than yourself" },
  { title: "unity with nature", description: "Feeling grounded and connected to the natural world" },
  // Novelty & lifestyle orientation
  { title: "freedom", description: "Autonomy and self-direction" },
  { title: "adventure", description: "Desire for exploration and meaningful experiences" },
  { title: "spontaneity", description: "Preference for novelty, flexibility, and unplanned experiences" },
  { title: "luxury experiences", description: "Seeking refinement, travel, and elevated experiences" },
  { title: "social vibrancy", description: "Desire for an active and culturally rich social life" },
  { title: "personal fulfillment", description: "Prioritizing self-discovery and individual experience" },
  { title: "reinvention", description: "Desire for continuous transformation and change" },
  { title: "comfort", description: "Preference for ease, pleasure, and low friction" },
  // Attraction, sex, beauty & ambition
  { title: "value of sex", description: "Viewing sex as meaningful and connective" },
  { title: "chemistry", description: "Magnetic attraction and romantic tension" },
  { title: "playfulness", description: "Flirtation, humor, and lightness in love" },
  { title: "beauty", description: "Appreciation for aesthetics, atmosphere, and elegance" },
  { title: "health", description: "Physical vitality and long-term well-being" },
  { title: "ambition", description: "Drive to build, achieve, and grow" },
  { title: "financial abundance", description: "Creating security, freedom, and optionality" },
  { title: "competence", description: "Capability, effectiveness, and mastery" },
];

const rankLabels = ["Core Value", "Very Important", "Important", "Meaningful", "Still Matters"];
declare const __APP_VERSION__: string;
declare const __APP_LAST_UPDATED__: string;

const APP_VERSION = __APP_VERSION__;
const APP_LAST_UPDATED = __APP_LAST_UPDATED__;

function pluralize(word: string, count: number) {
  return count === 1 ? word : `${word}s`;
}

function buildChooseText(availableCount: number, limit: number) {
  const cap = Math.min(limit, availableCount);
  return `Choose up to ${cap} ${pluralize("value", cap)} that matter most to you from this list. Tap the eye icon in the top-left corner of any card to hide it from view.`;
}

function buildNarrowText(availableCount: number, limit: number) {
  const cap = Math.min(limit, availableCount);
  if (availableCount === 0) {
    return "You have 0 picks so far. Move forward when you're ready.";
  }

  return `From your ${availableCount} ${pluralize("pick", availableCount)}, keep up to ${cap} that matter most.`;
}

function buildProgress(step: Step) {
  if (step === 0) return 0;
  if (step === 6) return 100;
  return Math.round(((step - 1) / 5) * 100);
}

function App() {
  const [step, setStep] = React.useState<Step>(0);
  const [firstPicks, setFirstPicks] = React.useState<string[]>([]);
  const [secondPicks, setSecondPicks] = React.useState<string[]>([]);
  const [topTenPicks, setTopTenPicks] = React.useState<string[]>([]);
  const [hiddenFirst, setHiddenFirst] = React.useState<string[]>([]);
  const [hiddenSecond, setHiddenSecond] = React.useState<string[]>([]);
  const [finalPicks, setFinalPicks] = React.useState<string[]>([]);
  const [ranking, setRanking] = React.useState<string[]>([]);
  const [shareStatus, setShareStatus] = React.useState<ShareStatus>("idle");
  const [firstRoundCustomValues, setFirstRoundCustomValues] = React.useState<Value[]>([]);
  const [secondRoundCustomValues, setSecondRoundCustomValues] = React.useState<Value[]>([]);
  const [deckValues, setDeckValues] = React.useState<Value[]>(() => shuffleValues(baseValues));

  const customValues = React.useMemo(
    () => [...firstRoundCustomValues, ...secondRoundCustomValues],
    [firstRoundCustomValues, secondRoundCustomValues],
  );
  const values = React.useMemo(() => [...deckValues, ...customValues], [customValues, deckValues]);
  const splitIndex = Math.ceil(deckValues.length / 2);
  const firstRoundValues = React.useMemo(
    () => [...deckValues.slice(0, splitIndex), ...firstRoundCustomValues],
    [deckValues, firstRoundCustomValues, splitIndex],
  );
  const secondRoundValues = React.useMemo(
    () => [...deckValues.slice(splitIndex), ...secondRoundCustomValues],
    [deckValues, secondRoundCustomValues, splitIndex],
  );
  const selectedTwenty = React.useMemo(
    () => values.filter((value) => firstPicks.includes(value.title) || secondPicks.includes(value.title)),
    [firstPicks, secondPicks, values],
  );
  const selectedTen = values.filter((value) => topTenPicks.includes(value.title));
  const rankedValues = ranking.map((title) => values.find((value) => value.title === title)).filter(Boolean) as Value[];
  const progress = buildProgress(step);
  const canGoBack = step > 0;
  const canGoForward = step >= 1 && step <= 5;
  const showFooter = step === 0 || step === 6;

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
    setHiddenFirst((current) => {
      const isHidden = current.includes(title);
      if (isHidden) return current.filter((item) => item !== title);
      return [...current, title];
    });

    setFirstPicks((current) => current.filter((item) => item !== title));
  }

  function toggleSecond(title: string) {
    setSecondPicks((current) => {
      if (current.includes(title)) return current.filter((item) => item !== title);
      if (current.length >= 10) return current;
      return [...current, title];
    });
  }

  function toggleHiddenSecond(title: string) {
    setHiddenSecond((current) => {
      const isHidden = current.includes(title);
      if (isHidden) return current.filter((item) => item !== title);
      return [...current, title];
    });

    setSecondPicks((current) => current.filter((item) => item !== title));
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
      const next = Math.max(0, current - 1) as Step;

      if (current === 2) {
        setSecondPicks([]);
        setHiddenSecond([]);
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
    setStep(0);
    setDeckValues(shuffleValues(baseValues));
    setFirstPicks([]);
    setSecondPicks([]);
    setTopTenPicks([]);
    setHiddenFirst([]);
    setHiddenSecond([]);
    setFinalPicks([]);
    setRanking([]);
    setShareStatus("idle");
    setFirstRoundCustomValues([]);
    setSecondRoundCustomValues([]);
  }

  function shuffleValues(items: Value[]) {
    const next = [...items];
    for (let index = next.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [next[index], next[randomIndex]] = [next[randomIndex], next[index]];
    }

    return next;
  }

  function addCustomValue(title: string, round: "first" | "second") {
    const cleanTitle = title.trim().replace(/\s+/g, " ");
    if (!cleanTitle) return false;
    if (values.some((value) => value.title.toLowerCase() === cleanTitle.toLowerCase())) return false;

    const nextValue = { title: cleanTitle, description: "A value you added" };
    if (round === "first") {
      setFirstRoundCustomValues((current) => [...current, nextValue]);
    } else {
      setSecondRoundCustomValues((current) => [...current, nextValue]);
    }
    return true;
  }

  async function shareResults() {
    const text = buildShareText(rankedValues);
    const imageBlob = await createShareCardBlob(rankedValues);
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
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col px-4 pb-36 pt-5 sm:max-w-xl">
        <header className="mb-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-rosewood/70">
              <Heart className="h-4 w-4 fill-blush text-rosewood" />
              The Values Game
            </div>
            {step > 0 && (
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
          {step === 0 && (
            <IntroStep
              key="step-0"
              onContinue={() => setStep(1)}
            />
          )}
          {step === 1 && (
            <PickStep
              key="step-1"
              title="Pick 10"
              text={buildChooseText(firstRoundValues.length, 10)}
              roundLabel="Round 1 of 5"
              values={firstRoundValues}
              selected={firstPicks}
              target={10}
              onToggle={toggleFirst}
              hidden={hiddenFirst}
              onToggleHidden={toggleHiddenFirst}
              onContinue={() => setStep(2)}
              onAddCustom={(title) => addCustomValue(title, "first")}
            />
          )}
          {step === 2 && (
            <PickStep
              key="step-2"
              title="Pick 10"
              text={buildChooseText(secondRoundValues.length, 10)}
              roundLabel="Round 2 of 5"
              values={secondRoundValues}
              selected={secondPicks}
              target={10}
              onToggle={toggleSecond}
              hidden={hiddenSecond}
              onToggleHidden={toggleHiddenSecond}
              onContinue={() => setStep(3)}
              onAddCustom={(title) => addCustomValue(title, "second")}
            />
          )}
          {step === 3 && (
            <PickStep
              key="step-3"
              title="Narrow to 10"
              text={buildNarrowText(selectedTwenty.length, 10)}
              roundLabel="Round 3 of 5"
              values={selectedTwenty}
              selected={topTenPicks}
              target={10}
              onToggle={toggleTopTen}
              onContinue={() => setStep(4)}
            />
          )}
          {step === 4 && (
            <PickStep
              key="step-4"
              title="Narrow to 5"
              text={buildNarrowText(selectedTen.length, 5)}
              roundLabel="Round 4 of 5"
              values={selectedTen}
              selected={finalPicks}
              target={5}
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
        {showFooter && (
          <footer
            className={`border-t border-white/65 pt-6 text-center text-[11px] leading-5 text-ink/55 ${
              step === 0 ? "mt-8 pb-40" : "mt-6 pb-10"
            }`}
          >
            <div>
              Developed by Brian Moseley · {APP_VERSION}
            </div>
            <div>
              Last Updated: {APP_LAST_UPDATED}
            </div>
            <div>
              Feedback or comments email{" "}
              <a className="font-semibold text-rosewood/70" href="mailto:bmose14+values@gmail.com">
                bmose14+values@gmail.com
              </a>
            </div>
          </footer>
        )}
      </div>
    </main>
  );
}

function PickStep({
  title,
  text,
  roundLabel,
  values: stepValues,
  selected,
  target,
  onToggle,
  hidden,
  onToggleHidden,
  onContinue,
  onAddCustom,
}: {
  title: string;
  text: string;
  roundLabel: string;
  values: Value[];
  selected: string[];
  target: number;
  onToggle: (title: string) => void;
  hidden?: string[];
  onToggleHidden?: (title: string) => void;
  onContinue: () => void;
  onAddCustom?: (title: string) => boolean;
}) {
  const left = Math.max(target - selected.length, 0);
  const progress = target ? Math.min(selected.length / target, 1) * 100 : 0;
  const [activeValue, setActiveValue] = React.useState<Value | null>(null);

  React.useEffect(() => {
    setActiveValue((current) => {
      if (current && stepValues.some((value) => value.title === current.title)) return current;
      return null;
    });
  }, [stepValues]);

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
      <div className="mb-3 flex items-end justify-between gap-3">
        <div>
          <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-rosewood/62">{roundLabel}</div>
          <h2 className="font-serif text-3xl leading-none text-ink">{title}</h2>
          <p className="mt-1 text-xs leading-5 text-ink/62">{text}</p>
        </div>
        <div className="shrink-0 rounded-2xl bg-rosewood px-3 py-2 text-right text-[11px] font-bold leading-4 text-white shadow-soft">
          <div>{selected.length} selected</div>
          <div className="text-white/72">{left} left</div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 pb-24 pt-10">
        {stepValues.map((value, index) => (
          <ValueCard
            key={value.title}
            value={value}
            selected={selected.includes(value.title)}
            hidden={hidden?.includes(value.title) ?? false}
            onToggle={handleToggle}
            onToggleHidden={onToggleHidden}
            index={index}
          />
        ))}
        {onAddCustom && <AddValueCard onAdd={onAddCustom} />}
      </div>

      <div className="fixed inset-x-4 bottom-[5.1rem] z-10 mx-auto max-w-md rounded-[1rem] border border-white/80 bg-white/88 px-3 py-2 shadow-soft backdrop-blur-xl sm:max-w-xl">
        <div className="mb-2 rounded-[0.85rem] bg-linen/75 px-2.5 py-2">
          <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-honey">
            {activeValue ? "What it means" : "Tap a card"}
          </div>
          <div className="mt-1 font-serif text-base leading-5 text-ink">
            {activeValue?.title ?? "See the meaning before you decide"}
          </div>
          <p className="mt-1 text-[11px] leading-4 text-ink/62">
            {activeValue?.description ?? "Each value has a short explanation to help you choose from instinct and clarity."}
          </p>
        </div>
        <div className="mb-1 flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.18em] text-rosewood/62">
          <span>{left} left to pick</span>
          <span>
            {selected.length}/{target}
          </span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-rosewood/10">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-rosewood via-honey to-sage"
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          />
        </div>
      </div>

      <ActionBar
        label="Continue"
        onClick={onContinue}
      />
    </motion.section>
  );
}

function IntroStep({ onContinue }: { onContinue: () => void }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18 }}
      transition={{ duration: 0.28 }}
      className="flex flex-1 flex-col"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-[1.25rem] border border-white/80 bg-white/70 p-4 shadow-soft backdrop-blur"
      >
        <Sparkles className="mb-2 h-4 w-4 text-honey" />
        <h1 className="font-serif text-4xl leading-[0.92] text-rosewood">The Values Game</h1>
        <p className="mt-2 text-[13px] italic leading-5 text-ink/62">"You can have anything you want, but not everything you want."</p>
        <div className="mt-3 space-y-2 text-[13px] leading-5 text-ink/74">
          <p>Most people think they know what they want. Usually, they know their preferences.</p>
          <p>Values are different.</p>
          <p>Preferences are what you like when everything is easy. Values are what you choose when good things compete.</p>
          <p>This is a short card game that helps you see what matters most.</p>
        </div>
        <div className="mt-3 rounded-[1rem] border border-rosewood/10 bg-white/80 p-3">
          <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-rosewood/70">How to play</div>
          <div className="mt-2 space-y-2 text-[12px] leading-5 text-ink/72">
            <p>You’ll be shown a series of value cards. Choose up to 10 qualities that matter most to you. Tap the eye icon in the top-left corner of any card to hide it from view.</p>
            <p>Once you’ve picked your 10, you’ll narrow them down until only your top values remain.</p>
            <p>The point isn’t to choose the “right” answers. It’s to see what rises to the top when there are multiple appealing options.</p>
          </div>
        </div>
      </motion.div>

      <ActionBar label="Begin" onClick={onContinue} />
    </motion.section>
  );
}

function ValueCard({
  value,
  selected,
  hidden,
  onToggle,
  onToggleHidden,
  index,
}: {
  value: Value;
  selected: boolean;
  hidden: boolean;
  onToggle: (value: Value) => void;
  onToggleHidden?: (title: string) => void;
  index: number;
}) {
  function handleClick() {
    if (hidden) {
      onToggleHidden?.(value.title);
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
        className={`group relative flex aspect-[0.94] w-full items-center justify-center rounded-[1rem] border px-1.5 py-2 text-center shadow-soft transition ${
          hidden
            ? "border-ink/10 bg-[#4b3d38] shadow-lift"
            : selected
              ? "border-rosewood/55 bg-[#fff4ef] shadow-lift"
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
              hidden ? "text-white/92" : "text-ink"
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
            className={`absolute right-1 top-1 grid h-4 w-4 shrink-0 place-items-center rounded-full border transition ${
              selected ? "border-rosewood bg-rosewood text-white" : "border-ink/12 bg-linen text-transparent"
            }`}
          >
            <Check className="h-2.5 w-2.5" />
          </span>
        )}
      </motion.button>

      {!hidden && onToggleHidden && (
        <button
          type="button"
          className="absolute left-1 top-1 z-10 grid h-5 w-5 place-items-center rounded-full border border-ink/10 bg-white/90 text-ink/55 shadow-sm transition active:scale-95"
          onClick={(event) => {
            event.stopPropagation();
            onToggleHidden(value.title);
          }}
          aria-label={`Hide ${value.title}`}
          title={`Hide ${value.title}`}
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
        className="col-span-5 grid grid-cols-[1fr_auto] gap-2 rounded-[1rem] border border-rosewood/25 bg-white/88 p-2 shadow-soft"
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
  function moveItem(index: number, direction: -1 | 1) {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= ranking.length) return;

    const next = [...ranking];
    const [item] = next.splice(index, 1);
    next.splice(nextIndex, 0, item);
    setRanking(next);
  }

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

      <div className="space-y-3 pb-24">
        {ranking.map((title, index) => {
          const value = values.find((item) => item.title === title);
          if (!value) return null;

          return (
            <motion.div
              key={title}
              className="rounded-[1.35rem] border border-white/90 bg-white p-4 shadow-soft"
            >
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#fff4ef] font-serif text-2xl text-rosewood">
                  {index + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold uppercase tracking-[0.16em] text-honey">{rankLabels[index]}</div>
                  <div className="mt-1 font-serif text-2xl leading-6">{value.title}</div>
                  <div className="mt-1 text-sm leading-5 text-ink/55">{value.description}</div>
                </div>
                <div className="flex shrink-0 flex-col gap-1">
                  <button
                    type="button"
                    className="grid h-9 w-9 place-items-center rounded-full bg-ink/5 text-ink/45 transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-30"
                    onClick={() => moveItem(index, -1)}
                    disabled={index === 0}
                    aria-label={`Move ${value.title} up`}
                    title={`Move ${value.title} up`}
                  >
                    <ChevronUp className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    className="grid h-9 w-9 place-items-center rounded-full bg-ink/5 text-ink/45 transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-30"
                    onClick={() => moveItem(index, 1)}
                    disabled={index === ranking.length - 1}
                    aria-label={`Move ${value.title} down`}
                    title={`Move ${value.title} down`}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

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
        <p className="mt-3 text-sm leading-6 text-ink/62">{buildSummary(rankedValues)}</p>
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
                <div className="mt-0.5 font-serif text-2xl leading-6">{value.title}</div>
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

      <ShareCardPreview rankedValues={rankedValues} />
    </motion.section>
  );
}

function ShareCardPreview({ rankedValues }: { rankedValues: Value[] }) {
  return (
    <div className="mt-5 overflow-hidden rounded-[1.8rem] bg-[#2b2422] p-5 text-white shadow-lift">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <div className="text-xs font-bold uppercase tracking-[0.22em] text-blush">Share Card</div>
          <div className="mt-1 font-serif text-3xl">The Values Game</div>
        </div>
        <Sparkles className="h-5 w-5 text-honey" />
      </div>
      <div className="space-y-2">
        {rankedValues.map((value, index) => (
          <div key={value.title} className="flex items-center justify-between rounded-2xl bg-white/9 px-3 py-2">
            <span className="font-serif text-xl">{index + 1}. {value.title}</span>
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
    <div className="fixed inset-x-0 bottom-0 z-10 border-t border-white/80 bg-linen/88 px-4 py-4 backdrop-blur-xl">
      <div className="mx-auto max-w-md sm:max-w-xl">
        <button
          disabled={disabled}
          onClick={handleClick}
          className="h-14 w-full cursor-pointer rounded-full bg-rosewood px-5 font-semibold text-white shadow-lift transition active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-ink/18 disabled:text-ink/40 disabled:shadow-none"
        >
          {label}
        </button>
      </div>
    </div>
  );
}

function buildSummary(rankedValues: Value[]) {
  const [first, second, third] = rankedValues;
  if (!first || !second || !third) return "Your results are ready.";

  return `You lead with ${first.title.toLowerCase()}, supported by ${second.title.toLowerCase()} and ${third.title.toLowerCase()}.`;
}

function buildShareText(rankedValues: Value[]) {
  const lines = rankedValues.map((value, index) => `${index + 1}. ${value.title} - ${rankLabels[index]}`);
  return `My Values Game results:\n\n${lines.join("\n")}\n\n${buildSummary(rankedValues)}`;
}

async function createShareCardBlob(rankedValues: Value[]) {
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
  ctx.fillText("My Values", 126, 278);
  ctx.fillText("Profile", 126, 378);

  ctx.fillStyle = "rgba(255, 250, 243, 0.74)";
  ctx.font = "400 34px Inter, system-ui, sans-serif";
  wrapText(ctx, buildSummary(rankedValues), 126, 454, 780, 48, 3);

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
    ctx.fillText(value.title, 230, y + 78);
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
