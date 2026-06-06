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
          "Developed the 'felicific calculus' - a method of calculating the total amount of pleasure and pain an action would produce.",
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
      "An action is morally right if it produces the best overall consequences - the maximum well-being for the maximum number of people.",
    description:
      "Utilitarianism is a consequentialist theory: the morality of an action is determined entirely by its outcomes. If pulling the lever saves five people at the cost of one, a utilitarian says pull it - because five lives outweigh one. The math is clear, even if the emotional weight is heavy.",
    strengths: [
      "Clear Decision Framework: It provides a systematic, rational method to resolve ethical dilemmas by calculating net happiness, removing personal and emotional bias from difficult choices.",
      "Consequences Focus: By evaluating actions based on real-world outcomes rather than abstract rules, it remains practical and directly focused on human and societal welfare.",
      "Radical Equality: It operates on a strictly egalitarian principle where every individual's happiness counts equally, regardless of social status, wealth, or power.",
      "Dynamic Adaptability: Unbound by historical tradition or dogma, it can dynamically evaluate new moral situations-like AI ethics or medical triage-solely based on their utility."
    ],
    criticisms: [
      "The Tyranny of the Majority: A pure utilitarian calculus can justify sacrificing the rights of a minority or harming an innocent person if the aggregate benefit to the majority is high enough.",
      "The Prediction Problem: It requires predicting the future consequences of every action, which is often highly uncertain or impossible in complex, real-world scenarios.",
      "Reductionist Arithmetic: It attempts to reduce complex moral problems, human lives, and deep emotional realities to a simple numerical scale, stripping away qualitative human experience.",
      "Rights Incompatibility: It conflicts with the moral intuition that certain rights-like bodily autonomy or justice-are absolute and cannot be traded away for utility."
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
          "Argued that moral obligations arise from our capacity for reflective self-governance - we are bound by the principles we endorse upon reflection.",
      },
    ],
    corePrinciple:
      "Certain actions are inherently right or wrong, regardless of their consequences. Moral duties and rules must be followed because they are right in themselves.",
    description:
      "Deontological ethics holds that some actions are wrong no matter how good their consequences. Actively killing one person to save five involves using that person as a mere instrument - violating their dignity and autonomy. For Kant, the person on the side track has the same right to life as anyone else, and deliberately redirecting death toward them is morally impermissible.",
    strengths: [
      "Inviolable Human Dignity: It establishes that individual rights and human dignity are absolute, ensuring that humans are treated as ends in themselves and never as disposable tools for others.",
      "Moral Certainty: It provides clear, consistent guidelines by declaring that certain actions-like lying, murder, or betrayal-are universally wrong, offering a firm ethical baseline.",
      "Prevents Rationalized Harm: By rejecting the idea that the ends can justify the means, it stops people from justifying atrocities or harms in the name of a hypothetical 'greater good'.",
      "Respects Agency: It recognizes individual moral responsibility, holding you accountable only for your own choices and duties rather than the uncontrollable actions of others."
    ],
    criticisms: [
      "Irrational Inflexibility: Its rigid rules can lead to morally disastrous outcomes when strict adherence to a duty (like truth-telling) causes avoidable, catastrophic harm.",
      "Conflicting Duties: It struggles to provide guidance when two absolute moral duties collide, such as the duty to protect an innocent life versus the duty to tell the truth.",
      "Cold Rigidity: It can appear rational but cold when it forbids minor actions-like telling a white lie to spare feelings-even when doing so prevents suffering.",
      "Cultural Dogmatism: Rules proposed as universal moral laws may instead reflect the specific historical or cultural biases of the philosophers who formulated them."
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
      "Morality is about developing virtuous character traits - courage, compassion, wisdom, justice - rather than following rules or calculating outcomes.",
    description:
      "Virtue ethics shifts the question from 'What should I do?' to 'What kind of person should I be?' Instead of applying rules or calculating consequences, a virtue ethicist asks what a person of practical wisdom (phronesis) would do in this situation. The answer depends on the specific context and the character of the moral agent.",
    strengths: [
      "Holistic Experience: It captures the rich complexity of real morality by focusing on character, emotional maturity, and personal growth rather than mechanical calculations or rigid rules.",
      "Character Focus: It shifts ethics from a checklist of rules to a lifelong journey of self-improvement, encouraging the habituation of virtues like courage and honesty.",
      "Psychological Realism: It aligns with human psychology by recognizing that emotions, intentions, and personal relationships are core components of moral decision-making.",
      "Contextual Flexibility: It avoids rigid dogmatism by acknowledging that the right action is highly dependent on context and the practical wisdom of the person in the situation."
    ],
    criticisms: [
      "Lack of Guidance: It does not provide clear, actionable steps for resolving specific moral dilemmas, leaving decision-makers without a clear path when choices are tough.",
      "Conflicting Virtues: It offers no systematic way to resolve conflicts when different virtues point in opposite directions, such as when compassion demands a lie but honesty demands the truth.",
      "Subjective & Biased: What constitutes a 'virtue' or a 'virtuous person' can be highly subjective and deeply influenced by cultural or societal biases.",
      "Hard to Formalize: Because it relies on character development, it is difficult to codify into legal systems, institutional policy, or algorithmic decision-making."
    ],
    trolleyAnswer:
      "It depends. A virtue ethicist wouldn't give a universal answer. They'd consider: What does compassion demand? What does courage look like here? What would a practically wise person do, given all the circumstances? The anguish itself is morally important - rushing to an answer misses the point.",
  },
];

const trolleyFacts = [
  {
    fact: (
      <>
        Philippa Foot introduced the trolley problem in 1967{" "}
        <a href="#fn-1" className="text-[#c9a96e] hover:underline text-[10px] font-mono font-bold align-super">
          [1]
        </a>
        , but it was Judith Jarvis Thomson who made it famous in 1985 by introducing the &ldquo;fat man&rdquo; variant (the footbridge scenario){" "}
        <a href="#fn-2" className="text-[#c9a96e] hover:underline text-[10px] font-mono font-bold align-super">
          [2]
        </a>
        .
      </>
    ),
  },
  {
    fact: (
      <>
        In studies across 233 countries and territories, the MIT Moral Machine experiment{" "}
        <a href="#fn-3" className="text-[#c9a96e] hover:underline text-[10px] font-mono font-bold align-super">
          [3]
        </a>{" "}
        found that moral preferences vary significantly by culture - Eastern countries are more likely to spare the elderly, while Western countries favor the young.
      </>
    ),
  },
  {
    fact: (
      <>
        Functional MRI studies{" "}
        <a href="#fn-4" className="text-[#c9a96e] hover:underline text-[10px] font-mono font-bold align-super">
          [4]
        </a>{" "}
        show that personal dilemmas (like pushing someone) activate emotional brain regions (ventromedial prefrontal cortex), while impersonal dilemmas (like pulling a lever) activate more cognitive regions.
      </>
    ),
  },
  {
    fact: (
      <>
        Autonomous vehicle manufacturers face real-world trolley problems. Mercedes-Benz initially said their cars would prioritize passenger safety, sparking global ethical debate. They later reversed this position{" "}
        <a href="#fn-5" className="text-[#c9a96e] hover:underline text-[10px] font-mono font-bold align-super">
          [5]
        </a>
        .
      </>
    ),
  },
  {
    fact: (
      <>
        The &ldquo;trolley problem&rdquo; has become so culturally ubiquitous that it appears in *The Good Place*, *The Simpsons*, and countless memes - making it one of philosophy&apos;s rare crossovers into popular culture.
      </>
    ),
  },
];

export default function LearnPage() {
  const router = useRouter();
  const [pageExit, setPageExit] = useState(false);
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({
    utilitarianism: true,
    deontology: true,
    "virtue-ethics": true,
  });

  const toggleExpanded = (id: string) => {
    setExpandedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

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
        {}
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

        {}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#e8dcc8] mb-3 tracking-tight">
            The Philosophy Behind the Dilemma
          </h1>
          <p className="text-[#8a7a5a] text-lg leading-relaxed max-w-2xl">
            Before you face the trolley, understand the centuries of thought
            that make these dilemmas so difficult. Three major ethical
            frameworks - each with its own answer to the question: what is
            the right thing to do?
          </p>
        </div>

        {}
        <div className="space-y-6 mb-16">
          {philosophies.map((phil) => {
            const isExpanded = expandedIds[phil.id];

            return (
              <div
                key={phil.id}
                className="rounded-2xl border border-[#c9a96e]/10 overflow-hidden bg-[#1a1710]/30 backdrop-blur-sm transition-all duration-300"
                style={{ borderColor: isExpanded ? `${phil.color}30` : undefined }}
              >
                {}
                <button
                  onClick={() => toggleExpanded(phil.id)}
                  className="w-full flex items-center justify-between p-6 text-left cursor-pointer hover:bg-[#1a1710]/60 transition-colors"
                >
                  <div>
                    <h2
                      className="text-3xl font-serif font-bold"
                      style={{ color: phil.color }}
                    >
                      {phil.title}
                    </h2>
                    <p className="text-[#8a7a5a] text-sm mt-1 italic font-serif">
                      {phil.subtitle}
                    </p>
                  </div>
                  <span
                    className={`text-[#8a7a5a] transition-transform duration-300 text-xl ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                  >
                    ▼
                  </span>
                </button>

                {}
                {isExpanded && (
                  <div className="px-6 pb-6 space-y-6 animate-in fade-in slide-in-from-top-2 duration-400">
                    {}
                    <div
                      className="p-4 rounded-xl"
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

                    {}
                    <p className="text-[#c4b99a] leading-relaxed">
                      {phil.description}
                    </p>

                    {}
                    <div>
                      <h3 className="text-xs font-mono tracking-widest uppercase text-[#8a7a5a] mb-3">
                        Key Thinkers
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {phil.thinkers.map((thinker) => (
                          <div
                            key={thinker.name}
                            className="p-3.5 rounded-xl bg-[#1a1710]/80 border border-[#c9a96e]/10 flex flex-col"
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
                    </div>

                    {}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                      <div>
                        <h4 className="text-xs font-mono tracking-widest uppercase text-[#c9a96e] mb-3 border-b border-[#c9a96e]/10 pb-1">
                          Strengths
                        </h4>
                        <ul className="space-y-3">
                          {phil.strengths.map((s, i) => {
                            const [title, desc] = s.split(": ");
                            return (
                              <li
                                key={i}
                                className="flex items-start gap-2.5 text-sm text-[#c4b99a] leading-relaxed"
                              >
                                <span className="text-[#c9a96e] mt-0.5 flex-shrink-0 font-bold">
                                  +
                                </span>
                                <p>
                                  <strong className="text-[#e8dcc8]">{title}</strong>: {desc}
                                </p>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-xs font-mono tracking-widest uppercase text-[#8a7a5a] mb-3 border-b border-[#8a7a5a]/10 pb-1">
                          Criticisms
                        </h4>
                        <ul className="space-y-3">
                          {phil.criticisms.map((c, i) => {
                            const [title, desc] = c.split(": ");
                            return (
                              <li
                                key={i}
                                className="flex items-start gap-2.5 text-sm text-[#8a7a5a] leading-relaxed"
                              >
                                <span className="text-[#6a6050] mt-0.5 flex-shrink-0 font-bold">
                                  -
                                </span>
                                <p>
                                  <strong className="text-[#c4b99a]">{title}</strong>: {desc}
                                </p>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </div>

                    {}
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

        {}
        <div className="mb-16">
          <h2 className="text-2xl font-serif font-bold text-[#e8dcc8] mb-6">
            The Science and Culture of Moral Decisions
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

        {}
        <div className="mb-16 border-t border-[#c9a96e]/10 pt-8">
          <h3 className="text-xs font-mono tracking-widest uppercase text-[#8a7a5a] mb-4">
            Sources & Further Reading
          </h3>
          <ol className="space-y-3 text-xs text-[#8a7a5a] font-serif leading-relaxed">
            <li id="fn-1" className="scroll-mt-6">
              <span className="font-mono text-[10px] mr-1.5">[1]</span>
              Foot, Philippa. (1967). &ldquo;The Problem of Abortion and the Doctrine of the Double Effect.&rdquo; *Oxford Review*. Available at{" "}
              <a
                href="https://philpapers.org/rec/FOOTPO-2"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-[#c9a96e] transition-colors"
              >
                PhilPapers
              </a>.
            </li>
            <li id="fn-2" className="scroll-mt-6">
              <span className="font-mono text-[10px] mr-1.5">[2]</span>
              Thomson, Judith Jarvis. (1985). &ldquo;The Trolley Problem.&rdquo; *Yale Law Journal*. Available at{" "}
              <a
                href="https://www.jstor.org/stable/796133"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-[#c9a96e] transition-colors"
              >
                JSTOR
              </a>.
            </li>
            <li id="fn-3" className="scroll-mt-6">
              <span className="font-mono text-[10px] mr-1.5">[3]</span>
              Awad, E., Dsouza, S., Kim, R., et al. (2018). &ldquo;The Moral Machine Experiment.&rdquo; *Nature*. Visit the interactive research platform at{" "}
              <a
                href="https://www.moralmachine.net/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-[#c9a96e] transition-colors"
              >
                MIT Moral Machine
              </a>.
            </li>
            <li id="fn-4" className="scroll-mt-6">
              <span className="font-mono text-[10px] mr-1.5">[4]</span>
              Greene, Joshua D., et al. (2001). &ldquo;An fMRI Investigation of Emotional Engagement in Moral Judgment.&rdquo; *Science*. Available at{" "}
              <a
                href="https://www.science.org/doi/10.1126/science.1062872"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-[#c9a96e] transition-colors"
              >
                Science Magazine
              </a>.
            </li>
            <li id="fn-5" className="scroll-mt-6">
              <span className="font-mono text-[10px] mr-1.5">[5]</span>
              Weller, C. (2016). &ldquo;Mercedes-Benz autonomous cars will choose passenger safety over pedestrians.&rdquo; *Business Insider*. Read the report and reversal debate at{" "}
              <a
                href="https://www.businessinsider.com/mercedes-benz-self-driving-cars-will-save-driver-2016-10"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-[#c9a96e] transition-colors"
              >
                Business Insider
              </a>.
            </li>
          </ol>
        </div>

        {}
        <div className="text-center pb-12 max-w-xl mx-auto border-t border-[#c9a96e]/10 pt-10">
          <p className="text-[#c4b99a] text-base mb-6 font-serif italic leading-relaxed">
            &ldquo;Knowing the arguments doesn&apos;t make the choice easier. That&apos;s what makes the trolley problem worth taking seriously.&rdquo;
          </p>
          <button
            onClick={() => handleNavigate("/test")}
            className="inline-block px-10 py-4 bg-[#c9a96e] text-[#0c0b09] font-bold text-lg rounded-xl hover:bg-[#d4b88a] transition-all duration-300 shadow-lg shadow-[#c9a96e]/10 hover:shadow-[#c9a96e]/25 tracking-wide cursor-pointer"
          >
            Begin the Simulation
          </button>
        </div>
      </div>
    </div>
  );
}
