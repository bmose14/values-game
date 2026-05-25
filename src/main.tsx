import React from "react";
import ReactDOM from "react-dom/client";
import { AnimatePresence, Reorder, motion } from "framer-motion";
import { Check, Copy, GripVertical, Heart, Plus, RotateCcw, Share2, Sparkles } from "lucide-react";
import "./styles.css";

type Value = {
  title: string;
  description: string;
};

type Step = 1 | 2 | 3 | 4;
type ShareStatus = "idle" | "shared" | "copied" | "saved";

const baseValues: Value[] = [
  { title: "Personal Freedom", description: "Autonomy, independence, and self-direction" },
  { title: "Inner Stability", description: "Emotional steadiness, calm, and reliability" },
  { title: "Practicality", description: "Clear judgment, usefulness, and real-world sense" },
  { title: "Efficiency", description: "Reducing waste and moving with purpose" },
  { title: "Ambition", description: "Drive to build and achieve" },
  { title: "Wisdom", description: "Judgment, perspective, and emotional steadiness" },
  { title: "Intellectual Curiosity", description: "Desire to learn and explore deeply" },
  { title: "Creative Expression", description: "Imagination, originality, and artistic instinct" },
  { title: "Self-Discipline", description: "Consistency and self-mastery" },
  { title: "Authentic Living", description: "Being real instead of performative" },
  { title: "Sense of Purpose", description: "Living with meaning and direction" },
  { title: "Spiritual Connection", description: "Connection to something greater than yourself" },
  { title: "Long-Term Commitment", description: "Choosing someone repeatedly over time" },
  { title: "Life Partnership", description: "Building and navigating life as a team" },
  { title: "Loyalty", description: "Commitment through difficulty" },
  { title: "Trust", description: "Safety, honesty, and reliability" },
  { title: "Kindness", description: "Warmth shown consistently in ordinary moments" },
  { title: "Affection", description: "Physical and emotional warmth, care, and closeness" },
  { title: "Patience", description: "Calm through imperfection and delay" },
  { title: "Chemistry", description: "Magnetic attraction and tension" },
  { title: "Deep Friendship", description: "Trust, companionship, and mutual liking" },
  { title: "Romantic Playfulness", description: "Teasing, flirting, and spontaneity" },
  { title: "Shared Humor", description: "Playful wit and laughter together" },
  { title: "Honesty", description: "Openness, candor, and willingness to be direct" },
  { title: "Deep Devotion", description: "Steady commitment through changing seasons" },
  { title: "Family Bonds", description: "Strong family ties and future legacy" },
  { title: "Raising Children", description: "Guiding and shaping the next generation" },
  { title: "Sense of Home", description: "Creating a warm, private world together" },
  { title: "Everyday Domestic Life", description: "Building ordinary life together well" },
  { title: "Shared Rituals", description: "Traditions, rhythms, and recurring moments together" },
  { title: "Sense of Community", description: "Belonging within a tribe or network" },
  { title: "Shared Adventure", description: "Novelty, risk, and meaningful experiences" },
  { title: "Financial Abundance", description: "Wealth, security, and life optionality" },
  { title: "Refinement", description: "Appreciation for beauty, quality, and elegance" },
  { title: "Physical Well-Being", description: "Vitality, energy, and long-term health" },
  { title: "Life Balance", description: "Harmony between work, love, health, and rest" },
  { title: "Lasting Legacy", description: "Building something that outlives you" },
  { title: "Excitement", description: "Intensity, stimulation, and emotional highs" },
  { title: "Comfort", description: "Ease, pleasure, and convenience" },
  { title: "Aesthetic Living", description: "Beautiful spaces, experiences, and atmosphere" },
  { title: "Unity with Nature", description: "Feeling grounded and connected to the natural world" },
  { title: "Prestige", description: "Recognition, exclusivity, and status" },
];

const rankLabels = ["Core Value", "Very Important", "Important", "Meaningful", "Still Matters"];

function App() {
  const [step, setStep] = React.useState<Step>(1);
  const [firstPicks, setFirstPicks] = React.useState<string[]>([]);
  const [finalPicks, setFinalPicks] = React.useState<string[]>([]);
  const [ranking, setRanking] = React.useState<string[]>([]);
  const [shareStatus, setShareStatus] = React.useState<ShareStatus>("idle");
  const [customValues, setCustomValues] = React.useState<Value[]>([]);

  const values = React.useMemo(() => [...baseValues, ...customValues], [customValues]);
  const selectedTen = values.filter((value) => firstPicks.includes(value.title));
  const rankedValues = ranking.map((title) => values.find((value) => value.title === title)).filter(Boolean) as Value[];
  const progress = step === 4 ? 100 : Math.round((step / 3) * 100);

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

  function toggleFinal(title: string) {
    setFinalPicks((current) => {
      if (current.includes(title)) return current.filter((item) => item !== title);
      if (current.length >= 5) return current;
      return [...current, title];
    });
  }

  function goToRank() {
    setRanking(finalPicks);
    setStep(3);
  }

  function restart() {
    setStep(1);
    setFirstPicks([]);
    setFinalPicks([]);
    setRanking([]);
    setShareStatus("idle");
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
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col px-4 pb-8 pt-5 sm:max-w-xl">
        <header className="mb-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-rosewood/70">
              <Heart className="h-4 w-4 fill-blush text-rosewood" />
              The Values Game
            </div>
            {(firstPicks.length > 0 || step > 1) && (
              <button
                className="grid h-10 w-10 place-items-center rounded-full bg-white/80 text-rosewood shadow-soft transition active:scale-95"
                onClick={restart}
                aria-label="Restart"
                title="Restart"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
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
              text="Choose the 10 qualities that matter most to you, in no particular order."
              roundLabel="Round 1 of 3"
              intro
              values={values}
              selected={firstPicks}
              target={10}
              onToggle={toggleFirst}
              onContinue={() => setStep(2)}
              onAddCustom={addCustomValue}
            />
          )}
          {step === 2 && (
            <PickStep
              key="step-2"
              title="Narrow to 5"
              text="Now choose the 5 you couldn't live without."
              roundLabel="Round 2 of 3"
              values={selectedTen}
              selected={finalPicks}
              target={5}
              onToggle={toggleFinal}
              onContinue={goToRank}
            />
          )}
          {step === 3 && (
            <RankStep
              key="step-3"
              roundLabel="Round 3 of 3"
              values={values}
              ranking={ranking}
              setRanking={setRanking}
              onContinue={() => setStep(4)}
            />
          )}
          {step === 4 && (
            <Results
              key="results"
              rankedValues={rankedValues}
              onShare={shareResults}
              onRestart={restart}
              shareStatus={shareStatus}
            />
          )}
        </AnimatePresence>
        <footer className="mt-auto pb-24 pt-8 text-center text-[11px] leading-5 text-ink/45">
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
  intro = false,
  values: stepValues,
  selected,
  target,
  onToggle,
  onContinue,
  onAddCustom,
}: {
  title: string;
  text: string;
  roundLabel: string;
  intro?: boolean;
  values: Value[];
  selected: string[];
  target: number;
  onToggle: (title: string) => void;
  onContinue: () => void;
  onAddCustom?: (title: string) => boolean;
}) {
  const canContinue = selected.length === target;
  const left = Math.max(target - selected.length, 0);
  const [activeValue, setActiveValue] = React.useState<Value>(stepValues[0]);

  React.useEffect(() => {
    setActiveValue((current) => {
      if (current && stepValues.some((value) => value.title === current.title)) return current;
      return stepValues[0];
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
          <div>{selected.length} selected</div>
          <div className="text-white/72">{left} left</div>
        </div>
      </div>

      {activeValue && (
        <motion.div
          key={activeValue.title}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-3 rounded-[1rem] border border-white/80 bg-white/76 p-3 shadow-soft"
        >
          <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-honey">What it means</div>
          <div className="mt-1 font-serif text-xl leading-5 text-ink">{activeValue.title}</div>
          <p className="mt-1 text-xs leading-5 text-ink/62">{activeValue.description}</p>
        </motion.div>
      )}

      <div className="grid grid-cols-4 gap-2 pb-24">
        {stepValues.map((value, index) => (
          <ValueCard
            key={value.title}
            value={value}
            selected={selected.includes(value.title)}
            onToggle={handleToggle}
            index={index}
          />
        ))}
        {onAddCustom && <AddValueCard onAdd={onAddCustom} />}
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
  onToggle,
  index,
}: {
  value: Value;
  selected: boolean;
  onToggle: (value: Value) => void;
  index: number;
}) {
  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.018, 0.25) }}
      whileTap={{ scale: 0.985 }}
      onClick={() => onToggle(value)}
      className={`group relative flex aspect-[0.94] w-full items-center justify-center rounded-[1rem] border px-1.5 py-2 text-center shadow-soft transition ${
        selected
          ? "border-rosewood/55 bg-[#fff4ef] shadow-lift"
          : "border-white/90 bg-white/82 hover:border-blush hover:bg-white"
      }`}
      aria-pressed={selected}
    >
      <span className="break-words font-serif text-[clamp(0.66rem,2.6vw,0.92rem)] font-semibold leading-[1.05] text-ink">
        {value.title}
      </span>
      <span
        className={`absolute right-1 top-1 grid h-4 w-4 shrink-0 place-items-center rounded-full border transition ${
          selected ? "border-rosewood bg-rosewood text-white" : "border-ink/12 bg-linen text-transparent"
        }`}
      >
        <Check className="h-2.5 w-2.5" />
      </span>
    </motion.button>
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
                  <div className="mt-1 font-serif text-2xl leading-6">{value.title}</div>
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
  const insights = buildInsights(rankedValues.map((value) => value.title));
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
        <h2 className="font-serif text-5xl leading-[0.95] text-rosewood">Your Love Compass</h2>
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

      <div className="mt-4 space-y-3">
        {insights.map((insight) => (
          <motion.div
            key={insight}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-[1.25rem] border border-white/80 bg-white/72 p-4 text-sm leading-6 text-ink/68 shadow-soft"
          >
            {insight}
          </motion.div>
        ))}
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
          className="h-14 w-full rounded-full bg-rosewood px-5 font-semibold text-white shadow-lift transition active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-ink/18 disabled:text-ink/40 disabled:shadow-none"
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

  return `You lead with ${first.title.toLowerCase()}, supported by ${second.title.toLowerCase()} and ${third.title.toLowerCase()}. In love, that points to someone who wants chemistry, choices, and daily life to line up in a way that feels honest.`;
}

function buildInsights(titles: string[]) {
  const has = (title: string) => titles.includes(title);
  const insights: string[] = [];

  if (has("Freedom")) insights.push("High Freedom suggests attraction grows when independence and trust can coexist.");
  if (has("Kindness")) insights.push("Kindness near the top points to warmth, care, and emotional generosity.");
  if (has("Ambition") || has("Growth")) insights.push("Ambition or Growth suggests you want a relationship that keeps becoming more alive.");

  return insights.slice(0, 4);
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
  ctx.fillText("My Love", 126, 278);
  ctx.fillText("Compass", 126, 378);

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
