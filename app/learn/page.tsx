"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface PhilosophySection {
  id: string;
  title: string;
  subtitle: string;
  color: string;
  thinkers: { name: string; era: string; keyIdea: string }[];
  corePrinciple: string;
  description: string;
  strengths: string[];
  criticisms: string[];
  trolleyAnswer: string;
}

const philosophies: PhilosophySection[] = [
  {
    id: "utilitarianism",
    title: "Utilitarianism",
    subtitle: "The greatest good for the greatest number",
    color: "#c9a96e",
    thinkers: [
      {
        name: "Jeremy Bentham",
        era: "1748–1832",
        keyIdea:
          "Developed the 'felicific calculus' — a method of calculating the total amount of pleasure and pain an action would produce.",
      },
      {
        name: "John Stuart Mill",
        era: "1806–1873",
        keyIdea:
          "Refined Bentham's ideas by distinguishing between higher and lower pleasures, arguing that intellectual pleasures are superior.",
      },
      {
        name: "Peter Singer",
        era: "1946–present",
        keyIdea:
          "Applied utilitarian logic to animal rights and global poverty, arguing we have obligations to reduce suffering wherever it occurs.",
      },
    ],
    corePrinciple:
      "An action is morally right if it produces the best overall consequences — the maximum well-being for the maximum number of people.",
    description:
      "Utilitarianism is a consequentialist theory: the morality of an action is determined entirely by its outcomes. If pulling the lever saves five people at the cost of one, a utilitarian says pull it — because five lives outweigh one. The math is clear, even if the emotional weight is heavy.",
    strengths: [
      "Provides a clear, systematic decision-making framework",
      "Focuses on tangible outcomes rather than abstract rules",
      "Naturally egalitarian — everyone's well-being counts equally",
      "Adaptable to new moral situations without relying on tradition",
    ],
    criticisms: [
      "Can justify harming minorities if it benefits the majority",
      "Difficult to accurately predict all consequences of an action",
      "Reduces complex moral situations to simple arithmetic",
      "May conflict with deeply held intuitions about individual rights",
    ],
    trolleyAnswer:
      "Pull the lever. Five lives saved is objectively better than one life lost. The utilitarian doesn't enjoy the trade-off but recognizes it as the rational, morally optimal choice.",
  },
  {
    id: "deontology",
    title: "Deontological Ethics",
    subtitle: "Duty above consequences",
    color: "#e8dcc8",
    thinkers: [
      {
        name: "Immanuel Kant",
        era: "1724–1804",
        keyIdea:
          "Proposed the Categorical Imperative: act only according to principles you could will to be universal laws. Never treat people merely as means to an end.",
      },
      {
        name: "W.D. Ross",
        era: "1877–1971",
        keyIdea:
          "Developed a pluralistic deontology with multiple prima facie duties (fidelity, reparation, justice, etc.) that must be balanced against each other.",
      },
      {
        name: "Christine Korsgaard",
        era: "1952–present",
        keyIdea:
          "Argued that moral obligations arise from our capacity for reflective self-governance — we are bound by the principles we endorse upon reflection.",
      },
    ],
    corePrinciple:
      "Certain actions are inherently right or wrong, regardless of their consequences. Moral duties and rules must be followed because they are right in themselves.",
    description:
      "Deontological ethics holds that some actions are wrong no matter how good their consequences. Actively killing one person to save five involves using that person as a mere instrument — violating their dignity and autonomy. For Kant, the person on the side track has the same right to life as anyone else, and deliberately redirecting death toward them is morally impermissible.",
    strengths: [
      "Protects individual rights and human dignity absolutely",
      "Provides moral certainty — some things are simply wrong",
      "Prevents 'ends justify the means' reasoning",
      "Respects the moral agency and autonomy of all persons",
    ],
    criticisms: [
      "Can lead to worse overall outcomes by being inflexible",
      "Difficult to resolve conflicts between competing duties",
      "May seem irrational when small sacrifices prevent great suffering",
      "Rules may be culturally specific rather than truly universal",
    ],
    trolleyAnswer:
      "Don't pull the lever. Actively redirecting the trolley makes you a moral agent of someone's death. Allowing the five to die is tragic, but it's not the same as choosing to kill. The moral distinction between action and inaction matters profoundly.",
  },
  {
    id: "virtue-ethics",
    title: "Virtue Ethics",
    subtitle: "What would a good person do?",
    color: "#8a7a5a",
    thinkers: [
      {
        name: "Aristotle",
        era: "384–322 BC",
        keyIdea:
          "Believed virtue lies in the 'golden mean' between extremes. A virtuous person develops character traits through practice and habit, aiming for eudaimonia (flourishing).",
      },
      {
        name: "Philippa Foot",
        era: "1920–2010",
        keyIdea:
          "Created the original trolley problem thought experiment. Argued that virtue ethics could resolve moral dilemmas by focusing on the character of the agent.",
      },
      {
        name: "Alasdair MacIntyre",
        era: "1929–present",
        keyIdea:
          "Argued that modern moral philosophy has lost its way and that we must return to Aristotelian virtue traditions embedded in community practices.",
      },
    ],
    corePrinciple:
      "Morality is about developing virtuous character traits — courage, compassion, wisdom, justice — rather than following rules or calculating outcomes.",
    description:
      "Virtue ethics shifts the question from 'What should I do?' to 'What kind of person should I be?' Instead of applying rules or calculating consequences, a virtue ethicist asks what a person of practical wisdom (phronesis) would do in this situation. The answer depends on the specific context and the character of the moral agent.",
    strengths: [
      "Captures the complexity of real moral decision-making",
      "Emphasizes moral development and character growth",
      "Provides a rich understanding of human psychology and motivation",
      "Avoids rigid rules while maintaining moral seriousness",
    ],
    criticisms: [
      "Provides less concrete guidance for specific dilemmas",
      "Virtues may conflict (compassion vs. justice)",
      "Who counts as a 'virtuous person' can be culturally biased",
      "Difficult to teach or formalize in ethical training",
    ],
    trolleyAnswer:
      "It depends. A virtue ethicist wouldn't give a universal answer. They'd consider: What does compassion demand? What does courage look like here? What would a practically wise person do, given all the circumstances? The anguish itself is morally important — rushing to an answer misses the point.",
  },
];

const trolleyFacts = [
  {
    fact: "Philippa Foot introduced the trolley problem in 1967, but it was Judith Jarvis Thomson who made it famous in 1985 by introducing the 'fat man' variant (the footbridge scenario).",
  },
  {
    fact: "In studies across 233 countries and territories, the MIT Moral Machine experiment found that moral preferences vary significantly by culture — Eastern countries are more likely to spare the elderly, while Western countries favor the young.",
  },
  {
    fact: "Functional MRI studies show that personal dilemmas (like pushing someone) activate emotional brain regions (ventromedial prefrontal cortex), while impersonal dilemmas (like pulling a lever) activate more cognitive regions.",
  },
  {
    fact: "Autonomous vehicle manufacturers face real-world trolley problems. Mercedes-Benz initially said their cars would prioritize passenger safety, sparking global ethical debate. They later reversed this position.",
  },
  {
    fact: "The 'trolley problem' has become so culturally ubiquitous that it appears in The Good Place, The Simpsons, and countless memes — making it one of philosophy's rare crossovers into popular culture.",
  },
];

export default function LearnPage() {
  const router = useRouter();
  const [expandedId, setExpandedId] = useState<string | null>(
    "utilitarianism"
  );
  const [pageExit, setPageExit] = useState(false);

  const handleNavigate = (path: string) => {
    setPageExit(true);
    setTimeout(() => router.push(path), 500);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className={`min-h-screen bg-[#0c0b09] text-[#e8dcc8] transition-all duration-500 ease-out ${pageExit ? "opacity-0 scale-[0.97] blur-sm" : "opacity-100 scale-100 blur-0"}`}>
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Navigation */}
        <button
          onClick={() => handleNavigate("/")}
          className="inline-flex items-center gap-1.5 text-[#8a7a5a] hover:text-[#c9a96e] transition-colors text-sm mb-8 cursor-pointer"
        >
          <svg
            viewBox="0 0 16 16"
            fill="currentColor"
            className="w-3.5 h-3.5"
          >
            <path d="M11 1L4 8l7 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to the Simulator
        </button>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#e8dcc8] mb-3 tracking-tight">
            The Philosophy Behind the Dilemma
          </h1>
          <p className="text-[#8a7a5a] text-lg leading-relaxed max-w-2xl">
            Before you face the trolley, understand the centuries of thought
            that make these dilemmas so difficult. Three major ethical
            frameworks — each with its own answer to the question: what is
            the right thing to do?
          </p>
        </div>

        {/* Philosophy sections */}
        <div className="space-y-4 mb-16">
          {philosophies.map((phil) => {
            const isExpanded = expandedId === phil.id;

            return (
              <div
                key={phil.id}
                className="rounded-2xl border border-[#c9a96e]/10 overflow-hidden transition-all duration-300"
                style={{
                  borderColor: isExpanded
                    ? `${phil.color}30`
                    : undefined,
                }}
              >
                {/* Header / toggle */}
                <button
                  onClick={() =>
                    setExpandedId(isExpanded ? null : phil.id)
                  }
                  className="w-full flex items-center justify-between p-6 text-left cursor-pointer hover:bg-[#1a1710]/60 transition-colors"
                >
                  <div>
                    <h2
                      className="text-2xl font-serif font-bold"
                      style={{ color: phil.color }}
                    >
                      {phil.title}
                    </h2>
                    <p className="text-[#8a7a5a] text-sm mt-0.5 italic">
                      {phil.subtitle}
                    </p>
                  </div>
                  <span
                    className={`text-[#8a7a5a] transition-transform duration-300 text-lg ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                  >
                    ▼
                  </span>
                </button>

                {/* Expanded content */}
                {isExpanded && (
                  <div className="px-6 pb-6 animate-in fade-in slide-in-from-top-2 duration-400">
                    {/* Core principle */}
                    <div
                      className="p-4 rounded-xl mb-6"
                      style={{
                        backgroundColor: `${phil.color}08`,
                        borderLeft: `3px solid ${phil.color}40`,
                      }}
                    >
                      <p className="text-[10px] font-mono tracking-widest uppercase mb-1" style={{ color: phil.color }}>
                        Core Principle
                      </p>
                      <p className="text-[#c4b99a] text-sm leading-relaxed font-serif italic">
                        {phil.corePrinciple}
                      </p>
                    </div>

                    {/* Description */}
                    <p className="text-[#c4b99a] leading-relaxed mb-6">
                      {phil.description}
                    </p>

                    {/* Key thinkers */}
                    <h3 className="text-sm font-mono tracking-widest uppercase text-[#8a7a5a] mb-3">
                      Key Thinkers
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
                      {phil.thinkers.map((thinker) => (
                        <div
                          key={thinker.name}
                          className="p-3 rounded-lg bg-[#1a1710]/80 border border-[#c9a96e]/10"
                        >
                          <p className="font-semibold text-[#e8dcc8] text-sm">
                            {thinker.name}
                          </p>
                          <p className="text-[10px] text-[#6a6050] font-mono mb-2">
                            {thinker.era}
                          </p>
                          <p className="text-[#8a7a5a] text-xs leading-relaxed">
                            {thinker.keyIdea}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Strengths & criticisms */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div>
                        <h4 className="text-xs font-mono tracking-widest uppercase text-[#c9a96e] mb-2">
                          Strengths
                        </h4>
                        <ul className="space-y-1.5">
                          {phil.strengths.map((s, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-2 text-sm text-[#c4b99a]"
                            >
                              <span className="text-[#c9a96e] mt-0.5 flex-shrink-0">
                                +
                              </span>
                              {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-xs font-mono tracking-widest uppercase text-[#8a7a5a] mb-2">
                          Criticisms
                        </h4>
                        <ul className="space-y-1.5">
                          {phil.criticisms.map((c, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-2 text-sm text-[#8a7a5a]"
                            >
                              <span className="text-[#6a6050] mt-0.5 flex-shrink-0">
                                -
                              </span>
                              {c}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Trolley answer */}
                    <div className="p-4 rounded-xl bg-[#1a1710]/80 border border-[#c9a96e]/10">
                      <p className="text-[10px] font-mono tracking-widest uppercase text-[#6a6050] mb-1">
                        The Trolley Answer
                      </p>
                      <p className="text-[#c4b99a] text-sm leading-relaxed font-serif italic">
                        &ldquo;{phil.trolleyAnswer}&rdquo;
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Did you know */}
        <div className="mb-16">
          <h2 className="text-2xl font-serif font-bold text-[#e8dcc8] mb-6">
            Did You Know?
          </h2>
          <div className="space-y-3">
            {trolleyFacts.map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-4 rounded-xl bg-[#1a1710]/60 border border-[#c9a96e]/10"
              >
                <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-[#c9a96e]/10 flex items-center justify-center text-xs font-bold text-[#c9a96e] font-mono">
                  {i + 1}
                </span>
                <p className="text-[#c4b99a] text-sm leading-relaxed">
                  {item.fact}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pb-12">
          <p className="text-[#8a7a5a] text-sm mb-4 font-serif italic">
            Now that you understand the frameworks, see where you stand.
          </p>
          <button
            onClick={() => handleNavigate("/test")}
            className="inline-block px-8 py-3 bg-[#c9a96e] text-[#0c0b09] font-semibold rounded-xl hover:bg-[#d4b88a] transition-all duration-300 shadow-lg shadow-[#c9a96e]/10 hover:shadow-[#c9a96e]/25 tracking-wide cursor-pointer"
          >
            Face the Dilemmas
          </button>
        </div>
      </div>
    </div>
  );
}
