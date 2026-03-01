import type { Scenario } from "./types";

export const scenarios: Scenario[] = [
  {
    id: "classic",
    title: "The Classic Trolley Problem",
    category: "Transportation",
    difficulty: "Warm-Up",
    narrative:
      "A runaway trolley is barreling down the tracks toward five workers who cannot hear it coming. You are standing next to a lever that can divert the trolley onto a side track, where only one worker is present. The trolley will kill whoever is in its path.",
    stakes: "5 lives vs. 1 life",
    optionA: {
      id: "A",
      label: "Pull the Lever",
      description:
        "Divert the trolley to the side track, saving five people but directly causing the death of one person.",
      philosophy: "utilitarian",
    },
    optionB: {
      id: "B",
      label: "Do Nothing",
      description:
        "Allow the trolley to continue on its course. You don't intervene, and five people die — but you didn't actively cause anyone's death.",
      philosophy: "deontological",
    },
    visualType: "classic",
    peopleOnMain: 5,
    peopleOnAlt: 1,
    insight: {
      origin: "First formulated by philosopher Philippa Foot in 1967 to examine the moral distinction between killing and letting die.",
      philosopherA: "Jeremy Bentham would pull the lever — the calculus is clear: five lives outweigh one.",
      philosopherB: "Immanuel Kant would argue you must not use the one person merely as a means to save others.",
      realWorld: "This dilemma echoes real triage decisions in emergency medicine, where doctors must allocate scarce resources.",
    },
    variant: {
      twist: "What if the one person on the side track was your spouse or child?",
      question: "Does personal connection change the moral calculus, or should impartial reasoning always prevail?",
    },
  },
  {
    id: "footbridge",
    title: "The Footbridge Dilemma",
    category: "Transportation",
    difficulty: "Hard",
    narrative:
      "You are standing on a footbridge above the trolley tracks. A runaway trolley is heading toward five people. Next to you is a very large stranger. If you push them off the bridge onto the tracks, their body will stop the trolley — saving the five, but killing the stranger.",
    stakes: "5 lives vs. 1 life (direct physical action)",
    optionA: {
      id: "A",
      label: "Push the Stranger",
      description:
        "Push the large person onto the tracks to stop the trolley. Five people are saved, but you directly and physically cause one death.",
      philosophy: "utilitarian",
    },
    optionB: {
      id: "B",
      label: "Don't Push",
      description:
        "Refuse to use another person as a means to an end. Five people die, but you haven't violated anyone's bodily autonomy.",
      philosophy: "deontological",
    },
    visualType: "bridge",
    peopleOnMain: 5,
    peopleOnAlt: 1,
    insight: {
      origin: "Introduced by Judith Jarvis Thomson in 1985 as a variant that tests the limits of utilitarian reasoning by adding physical contact.",
      philosopherA: "Peter Singer would argue the physical nature of the act is morally irrelevant — consequences are what matter.",
      philosopherB: "Thomas Aquinas's doctrine of double effect distinguishes between intended harm and foreseen side effects.",
      realWorld: "Studies show most people who pull the lever in the classic version refuse to push — revealing the psychological weight of direct physical action.",
    },
    variant: {
      twist: "What if instead of pushing, you could pull a trapdoor lever dropping them onto the tracks?",
      question: "Does the mechanism of harm matter morally, or only the outcome?",
    },
  },
  {
    id: "surgeon",
    title: "The Surgeon's Dilemma",
    category: "Medical Ethics",
    difficulty: "Gut-Wrenching",
    narrative:
      "You are a surgeon with five patients, each in need of a different organ transplant or they will die today. A healthy patient has come in for a routine checkup. You could harvest their organs to save the five dying patients. No one would ever find out.",
    stakes: "5 patients vs. 1 healthy individual",
    optionA: {
      id: "A",
      label: "Harvest the Organs",
      description:
        "Sacrifice the healthy patient to save five dying ones. The math works out — five lives for one — but you violate the trust placed in you as a doctor.",
      philosophy: "utilitarian",
    },
    optionB: {
      id: "B",
      label: "Refuse to Operate",
      description:
        "Uphold the Hippocratic oath and the patient's right to life. Five patients die, but you haven't murdered an innocent person.",
      philosophy: "deontological",
    },
    visualType: "hospital",
    peopleOnMain: 5,
    peopleOnAlt: 1,
    insight: {
      origin: "Proposed by philosopher Judith Jarvis Thomson to show why pure utilitarian math can lead to intuitively monstrous conclusions.",
      philosopherA: "A strict act-utilitarian would accept this, but rule-utilitarians like John Stuart Mill would reject it — a world where doctors harvest patients would collapse trust in medicine.",
      philosopherB: "Kant's categorical imperative forbids treating the healthy patient merely as a means — their humanity demands respect.",
      realWorld: "This scenario underlies debates about organ donation policy, informed consent, and the sacred trust between doctor and patient.",
    },
    variant: {
      twist: "What if the healthy patient was a convicted serial killer on death row?",
      question: "Does a person's moral standing affect their right to bodily autonomy?",
    },
  },
  {
    id: "autonomous-car",
    title: "The Self-Driving Car",
    category: "Technology",
    difficulty: "Hard",
    narrative:
      "You are programming the ethics module for a self-driving car. The car's brakes fail while carrying one passenger. It must choose: swerve into a barrier (killing the passenger) to avoid hitting five pedestrians crossing the road, or continue straight.",
    stakes: "5 pedestrians vs. 1 passenger",
    optionA: {
      id: "A",
      label: "Swerve into Barrier",
      description:
        "Program the car to sacrifice its passenger to save five pedestrians. More lives are saved, but the car actively kills the person who trusted it.",
      philosophy: "utilitarian",
    },
    optionB: {
      id: "B",
      label: "Continue Straight",
      description:
        "The car protects its passenger — the person who chose to trust it. Five pedestrians die, but the car upholds its duty to its occupant.",
      philosophy: "deontological",
    },
    visualType: "car",
    peopleOnMain: 5,
    peopleOnAlt: 1,
    insight: {
      origin: "The modern trolley problem — raised by MIT's Moral Machine project (2014), which collected 40 million decisions from people in 233 countries.",
      philosopherA: "Utilitarians argue autonomous vehicles should minimize total casualties, even at the passenger's expense.",
      philosopherB: "Contract theorists argue the car has a special obligation to the person who purchased and trusted it.",
      realWorld: "This is not hypothetical — automakers and legislators are actively debating how to program ethical decision-making into self-driving vehicles.",
    },
    variant: {
      twist: "What if the five pedestrians were jaywalking illegally, while the passenger followed all rules?",
      question: "Should moral responsibility factor into who gets protected?",
    },
  },
  {
    id: "lifeboat",
    title: "The Lifeboat Crisis",
    category: "Survival",
    difficulty: "Gut-Wrenching",
    narrative:
      "A ship has sunk. You're in a lifeboat rated for 10 people, but 11 are aboard and it's taking on water. If nothing changes, everyone drowns within the hour. One elderly passenger volunteers to go overboard, but you must make the call to accept or reject their sacrifice.",
    stakes: "10 lives vs. 1 volunteer",
    optionA: {
      id: "A",
      label: "Accept the Sacrifice",
      description:
        "Allow the elderly passenger to sacrifice themselves. Ten people survive. The total suffering is minimized, but you've sanctioned a death.",
      philosophy: "utilitarian",
    },
    optionB: {
      id: "B",
      label: "Refuse, Stay Together",
      description:
        "Refuse to let anyone die by choice. Everyone shares the same fate. You preserve the principle that no life is expendable, even at the risk of all.",
      philosophy: "deontological",
    },
    visualType: "lifeboat",
    peopleOnMain: 10,
    peopleOnAlt: 1,
    insight: {
      origin: "Based on the real 1884 case of R v Dudley and Stephens, where shipwrecked sailors killed and ate a cabin boy to survive.",
      philosopherA: "Utilitarian Garrett Hardin used 'lifeboat ethics' to argue that sometimes sacrificing the few is the only rational choice.",
      philosopherB: "Kantians hold that even voluntary sacrifice cannot be sanctioned by authority — each person's life has infinite, non-negotiable worth.",
      realWorld: "Lifeboat ethics appear in pandemic ventilator allocation, immigration policy debates, and disaster triage protocols.",
    },
    variant: {
      twist: "What if instead of volunteering, you had to choose who goes overboard — and there's a young child among the passengers?",
      question: "Does age or potential future life change the moral weight of a person?",
    },
  },
  {
    id: "time-traveler",
    title: "The Time Traveler's Burden",
    category: "Sci-Fi Ethics",
    difficulty: "Soul-Crushing",
    narrative:
      "You have a one-time-use time machine. You can go back and prevent a catastrophic event that will kill 10,000 people — but the only way is to eliminate one specific innocent person whose existence inadvertently triggers the chain of events. They have no idea what they'll cause.",
    stakes: "10,000 future lives vs. 1 innocent past life",
    optionA: {
      id: "A",
      label: "Change the Past",
      description:
        "Eliminate the innocent person to prevent the catastrophe. Ten thousand people live, but you've killed someone who has done nothing wrong.",
      philosophy: "utilitarian",
    },
    optionB: {
      id: "B",
      label: "Leave History Alone",
      description:
        "Refuse to take an innocent life, regardless of consequences. The catastrophe happens, but you haven't played god with someone's fate.",
      philosophy: "deontological",
    },
    visualType: "time",
    peopleOnMain: 100,
    peopleOnAlt: 1,
    insight: {
      origin: "A modern philosophical thought experiment combining trolley logic with temporal paradoxes and questions of moral luck.",
      philosopherA: "Consequentialists argue that if you can prevent 10,000 deaths with certainty, inaction is morally equivalent to letting them die.",
      philosopherB: "Bernard Williams argued that moral integrity matters — becoming a killer corrupts your character regardless of outcomes.",
      realWorld: "This mirrors debates about preemptive military strikes, preventive detention, and the ethics of acting on predictive intelligence.",
    },
    variant: {
      twist: "What if the innocent person was a child, and the catastrophe they'd unknowingly cause was 50 years away?",
      question: "Does temporal distance affect moral responsibility for future harms?",
    },
  },
  {
    id: "surveillance",
    title: "The Surveillance State",
    category: "Privacy & Security",
    difficulty: "Hard",
    narrative:
      "You lead a city's security division. A new AI surveillance system can predict violent crimes with 99% accuracy, potentially saving hundreds of lives per year. But it requires total surveillance of every citizen — reading messages, watching through cameras, tracking all movement. Privacy effectively ceases to exist.",
    stakes: "Hundreds of lives saved vs. privacy of millions",
    optionA: {
      id: "A",
      label: "Deploy the System",
      description:
        "Activate total surveillance to prevent violent crimes. Hundreds of lives are saved, but every citizen loses their fundamental right to privacy.",
      philosophy: "utilitarian",
    },
    optionB: {
      id: "B",
      label: "Reject the System",
      description:
        "Preserve civil liberties and the right to privacy. Some preventable deaths will occur, but individual rights remain inviolable.",
      philosophy: "deontological",
    },
    visualType: "surveillance",
    peopleOnMain: 50,
    peopleOnAlt: 0,
    insight: {
      origin: "Directly inspired by Jeremy Bentham's Panopticon (1791) — a prison where inmates never know if they're being watched, and thus always behave.",
      philosopherA: "Bentham himself would likely approve — if surveillance maximizes safety and well-being, the math favors deployment.",
      philosopherB: "John Stuart Mill warned that even beneficial tyranny destroys the individual spirit. Privacy is essential to human flourishing.",
      realWorld: "China's social credit system, NSA mass surveillance revealed by Edward Snowden, and predictive policing algorithms all echo this dilemma.",
    },
    variant: {
      twist: "What if the surveillance was opt-in, and only those who consented were monitored — but this created a two-tier society?",
      question: "Can freedom be preserved if safety becomes a privilege of the watched?",
    },
  },
  {
    id: "whistleblower",
    title: "The Whistleblower's Choice",
    category: "Corporate Ethics",
    difficulty: "Soul-Crushing",
    narrative:
      "You work at a pharmaceutical company. You discover that a widely-used medication has a rare but lethal side effect affecting 1 in 100,000 users — about 50 people per year. Exposing this will bankrupt the company, destroying 10,000 jobs and ending access to 20 other life-saving drugs the company produces exclusively.",
    stakes: "50 lives/year + transparency vs. 10,000 jobs + 20 drugs",
    optionA: {
      id: "A",
      label: "Stay Silent",
      description:
        "Keep the secret. The company survives, 10,000 people keep their jobs, 20 drugs remain available — but ~50 people per year die from a known, hidden defect.",
      philosophy: "utilitarian",
    },
    optionB: {
      id: "B",
      label: "Blow the Whistle",
      description:
        "Expose the truth. People have a right to know what they're putting in their bodies, regardless of the economic fallout. Honesty and transparency are non-negotiable.",
      philosophy: "deontological",
    },
    visualType: "whistleblower",
    peopleOnMain: 50,
    peopleOnAlt: 0,
    insight: {
      origin: "Inspired by real pharmaceutical scandals — the Vioxx recall (2004), where Merck suppressed data showing the drug doubled heart attack risk.",
      philosopherA: "Rule utilitarians would weigh the total harm: 50 deaths/year vs. 10,000 jobs and 20 drugs. The calculus is genuinely unclear.",
      philosopherB: "Kant's principle of publicity asks: could this maxim be made public? If the company would be ashamed of secrecy, the act is wrong.",
      realWorld: "Whistleblower protections exist precisely because society recognizes this tension — the Dodd-Frank Act and EU Whistleblower Directive attempt to make truth-telling safer.",
    },
    variant: {
      twist: "What if you could leak anonymously, protecting yourself but making the information harder to verify?",
      question: "Does accountability require personal sacrifice, or is anonymous truth still truth?",
    },
  },
  // ═══════════════ EXTENDED MODE SCENARIOS ═══════════════
  {
    id: "vaccine-lottery",
    title: "The Vaccine Lottery",
    category: "Public Health",
    difficulty: "Soul-Crushing",
    narrative:
      "A deadly pandemic is ravaging humanity. Scientists have developed a vaccine that provides lifetime immunity, but it has a 1% fatality rate — there's no way to predict who will die. Without the vaccine, the disease will eventually kill 15% of the population. The government must decide: mandatory vaccination for all, or let the disease run its course.",
    stakes: "1% vaccine deaths vs. 15% disease deaths",
    optionA: {
      id: "A",
      label: "Mandate the Vaccine",
      description:
        "Force everyone to take the vaccine. 1% will die from it, but you'll save the 14% who would have died from the disease. Net lives saved: millions.",
      philosophy: "utilitarian",
    },
    optionB: {
      id: "B",
      label: "Keep It Voluntary",
      description:
        "Respect bodily autonomy absolutely. Let individuals choose their own risk. More people will die overall, but no one was forced to sacrifice themselves.",
      philosophy: "deontological",
    },
    visualType: "vaccine",
    peopleOnMain: 15,
    peopleOnAlt: 1,
    insight: {
      origin: "Echoes historical debates about smallpox vaccination mandates and modern COVID-19 policy controversies.",
      philosopherA: "Utilitarians like Peter Singer argue that if the math clearly saves lives, mandates are justified — individual autonomy doesn't trump millions of deaths.",
      philosopherB: "Libertarian philosophers like Robert Nozick would argue that bodily autonomy is inviolable — you cannot force someone to risk death, even for the greater good.",
      realWorld: "This mirrors real debates about vaccine mandates, where public health benefits clash with individual liberty and informed consent.",
    },
    variant: {
      twist: "What if the 1% who die from the vaccine are disproportionately from marginalized communities due to healthcare disparities?",
      question: "Does systemic inequality change the ethics of a policy that's 'fair' on paper?",
    },
    extended: true,
  },
  {
    id: "ai-judge",
    title: "The AI Judge",
    category: "Justice",
    difficulty: "Hard",
    narrative:
      "An AI system has been developed that can predict recidivism with 99% accuracy and determine sentences with perfect consistency — no racial bias, no class bias, no bad days. However, it has no capacity for mercy, context, or redemption. It cannot consider that a theft was to feed a starving child, or that a person has genuinely reformed. It applies the law exactly as written.",
    stakes: "Perfect fairness vs. human judgment",
    optionA: {
      id: "A",
      label: "Deploy the AI Judge",
      description:
        "Replace human judges with the AI system. Eliminate bias and inconsistency forever. Accept that edge cases will be handled without compassion.",
      philosophy: "utilitarian",
    },
    optionB: {
      id: "B",
      label: "Keep Human Judges",
      description:
        "Preserve the capacity for mercy, even though it comes with inconsistency and bias. Justice requires human understanding, not just rule application.",
      philosophy: "deontological",
    },
    visualType: "judge",
    peopleOnMain: 100,
    peopleOnAlt: 0,
    insight: {
      origin: "Inspired by growing use of algorithmic sentencing tools like COMPAS, which predict recidivism but have been criticized for racial bias.",
      philosopherA: "Rule utilitarians would favor consistency — if the AI produces better average outcomes and eliminates discrimination, it's the moral choice.",
      philosopherB: "Kant emphasized that humans must be treated as ends, not means — reducing a person to data points for algorithmic processing violates their dignity.",
      realWorld: "Courts already use AI risk assessment tools. The debate over algorithmic justice is happening now in courtrooms worldwide.",
    },
    variant: {
      twist: "What if the AI could be programmed with 'mercy parameters' — but then who decides what deserves mercy?",
      question: "Is programmed compassion still compassion, or just another rule?",
    },
    extended: true,
  },
  {
    id: "memory-wipe",
    title: "The Memory Wipe",
    category: "Personal Identity",
    difficulty: "Gut-Wrenching",
    narrative:
      "Neuroscience has advanced to the point where memories can be selectively erased. A violent criminal — a serial killer who murdered 12 people — has been captured. Instead of life imprisonment or execution, you can wipe their memories completely, creating a new person with no recollection of their crimes or violent tendencies. The 'new' person would be released, effectively innocent.",
    stakes: "Punishment vs. rehabilitation through erasure",
    optionA: {
      id: "A",
      label: "Wipe Their Memory",
      description:
        "Erase everything. Create a new, innocent person from the shell of a monster. No more threat to society, no expensive imprisonment, a productive citizen.",
      philosophy: "utilitarian",
    },
    optionB: {
      id: "B",
      label: "Traditional Punishment",
      description:
        "The person who committed the crimes must face consequences. Erasing memories doesn't undo the harm or provide justice to victims. Prison or execution.",
      philosophy: "deontological",
    },
    visualType: "memory",
    peopleOnMain: 12,
    peopleOnAlt: 1,
    insight: {
      origin: "Draws from philosophical debates about personal identity (Locke, Parfit) and questions raised by films like Eternal Sunshine and A Clockwork Orange.",
      philosopherA: "Consequentialists focus on outcomes: if the threat is neutralized and a productive citizen is created, that's the best result for everyone.",
      philosopherB: "Deontologists argue that justice requires the actual wrongdoer to face consequences — a memory-wiped person is effectively a different person escaping justice.",
      realWorld: "Memory modification research is advancing. PTSD treatments already involve weakening traumatic memories. Where is the ethical line?",
    },
    variant: {
      twist: "What if the victims' families were offered the choice: wipe his memory, or execute him?",
      question: "Should victims have veto power over how justice is served?",
    },
    extended: true,
  },
  {
    id: "genetic-edit",
    title: "The Genetic Editor",
    category: "Bioethics",
    difficulty: "Soul-Crushing",
    narrative:
      "CRISPR technology has advanced to allow safe editing of embryos. Scientists can now eliminate genes linked to violent aggression, addiction, and antisocial behavior with 95% effectiveness. A government proposes mandatory genetic screening and editing for all embryos before birth. Crime rates would plummet, but humanity would be fundamentally altered.",
    stakes: "Reduced suffering vs. human authenticity",
    optionA: {
      id: "A",
      label: "Mandate Genetic Editing",
      description:
        "Edit out the capacity for violence and addiction. Future generations will be kinder, healthier, less prone to crime. Humanity improves.",
      philosophy: "utilitarian",
    },
    optionB: {
      id: "B",
      label: "Ban Genetic Editing",
      description:
        "Preserve human nature as it is — flaws and all. The capacity for darkness is part of what makes us human. We have no right to design our descendants.",
      philosophy: "deontological",
    },
    visualType: "genetic",
    peopleOnMain: 0,
    peopleOnAlt: 0,
    insight: {
      origin: "Inspired by the 2018 'CRISPR babies' scandal in China and ongoing debates about germline editing in bioethics.",
      philosopherA: "Transhumanists argue we have a moral obligation to reduce suffering — if we can eliminate violence genetically, refusing to do so is choosing suffering.",
      philosopherB: "Bioconservatives like Leon Kass argue that 'playing God' with human nature violates dignity and could have unforeseen consequences for human flourishing.",
      realWorld: "Germline editing is already possible. International moratoriums exist but are hard to enforce. This dilemma may become reality within decades.",
    },
    variant: {
      twist: "What if only wealthy nations could afford the editing, creating a genetic divide between 'improved' and 'natural' humans?",
      question: "Does unequal access make a beneficial technology unethical?",
    },
    extended: true,
  },
];
