let dialogs= {
        "godel": [{
          text: "Greetings! I am Kurt Gödel. Let's explore a puzzle related to incompleteness. Are you ready to begin?",
          options: [
            { response: "Yes, let's start", next: 1 },
            { response: "Can you explain incompleteness first?", next: 2 }
          ]
        },
        {
          text: "Excellent! Consider a formal system F that can express arithmetic. Which of the following statements about F is true according to the incompleteness theorems?",
          options: [
            { response: "F is always consistent and complete", next: 3 },
            { response: "If F is consistent, it cannot prove its own consistency", next: 4 },
            { response: "F can prove all true statements about arithmetic", next: 5 }
          ]
        },
        {
          text: "Certainly! The incompleteness theorems show that for any consistent formal system F powerful enough to encode arithmetic, there are statements that can be formulated in F that can neither be proved nor disproved within F. Shall we proceed with the puzzle?",
          options: [
            { response: "Yes, I'm ready now", next: 1 },
            { response: "I need more clarification", next: 6 }
          ]
        },
        {
          text: "I'm afraid that's incorrect. A key implication of the incompleteness theorems is that no consistent formal system powerful enough to encode arithmetic can be both consistent and complete. Would you like to try again?",
          options: [
            { response: "Yes, I'll try again", next: 1 },
            { response: "No, please explain more", next: 7 }
          ]
        },
        {
          text: "Correct! This is related to my Second Incompleteness Theorem. Let's delve deeper. What does this imply about the nature of mathematical truth?",
          options: [
            { response: "Mathematical truth is relative", next: 8 },
            { response: "Some mathematical truths are unprovable within their system", next: 9 },
            { response: "Mathematics is fundamentally inconsistent", next: 10 }
          ]
        },
        {
          text: "That's not quite right. The incompleteness theorems show that there are true statements about arithmetic that cannot be proved within the system. Would you like to explore this further?",
          options: [
            { response: "Yes, please explain", next: 11 },
            { response: "No, let's move on", next: 12 }
          ]
        },
        {
          text: "The incompleteness theorems deal with the limitations of formal systems. They show that for any consistent formal system F powerful enough to encode arithmetic, there are statements that can be formulated in F that can neither be proved nor disproved within F. Shall we continue with the puzzle?",
          options: [
            { response: "Yes, I'm ready", next: 1 },
            { response: "I need more time to think", next: 13 }
          ]
        },
        {
          text: "The incompleteness theorems demonstrate that in any consistent formal system F that can represent elementary arithmetic, there are statements that can neither be proved nor disproved within F. This doesn't mean F is inconsistent, but rather that it's incomplete. Would you like to explore another aspect?",
          options: [
            { response: "Yes, please", next: 14 },
            { response: "No, I think I understand now", next: 15 }
          ]
        },
        {
          text: "While the incompleteness theorems do pose challenges to certain philosophical views about mathematics, they don't imply that mathematical truth is relative. Would you like to reconsider your answer?",
          options: [
            { response: "Yes, I'll try again", next: 4 },
            { response: "No, please explain further", next: 16 }
          ]
        },
        {
          text: "Excellent! You've grasped a key implication of the incompleteness theorems. This leads us to an interesting question: What does this mean for the foundations of mathematics?",
          options: [
            { response: "It undermines the reliability of mathematics", next: 17 },
            { response: "It shows the limitations of formal systems", next: 18 },
            { response: "It proves that mathematics is inconsistent", next: 19 }
          ]
        },
        {
          text: "While the incompleteness theorems do reveal limitations in formal systems, they don't imply that mathematics itself is inconsistent. Would you like to explore this further?",
          options: [
            { response: "Yes, please explain", next: 20 },
            { response: "No, let's try a different question", next: 21 }
          ]
        },
        {
          text: "The incompleteness theorems show that in any consistent formal system F powerful enough to encode arithmetic, there are statements that can be formulated in F that can neither be proved nor disproved within F. This doesn't mean all truths are unprovable, but that some truths about arithmetic cannot be proved within the system itself. Shall we continue?",
          options: [
            { response: "Yes, I'm ready for the next question", next: 22 },
            { response: "I need more time to process this", next: 23 }
          ]
        },
        {
          text: "Very well. Let's consider another aspect of incompleteness. What does the Second Incompleteness Theorem say about a system's ability to prove its own consistency?",
          options: [
            { response: "It can always prove its own consistency", next: 24 },
            { response: "It cannot prove its own consistency if it is consistent", next: 25 },
            { response: "It can only prove its consistency if it's inconsistent", next: 26 }
          ]
        },
        {
          text: "Take your time. The concepts of incompleteness can be challenging. When you're ready to continue, just let me know.",
          options: [
            { response: "I'm ready now", next: 1 },
            { response: "I need more explanation", next: 27 }
          ]
        },
        {
          text: "Certainly! Let's explore the relationship between incompleteness and undecidability. What does it mean for a statement to be undecidable in a formal system?",
          options: [
            { response: "It's neither true nor false", next: 28 },
            { response: "It can't be proved or disproved within the system", next: 29 },
            { response: "It's always false", next: 30 }
          ]
        },
        {
          text: "I'm glad you feel you understand now. Remember, the incompleteness theorems have profound implications for the philosophy of mathematics and the limits of formal systems. Is there anything else you'd like to discuss?",
          options: [
            { response: "Yes, let's explore further", next: 31 },
            { response: "No, thank you for the explanation", next: "end" }
          ]
        },
        {
          text: "The incompleteness theorems don't imply that mathematical truth is relative. Instead, they show that there are true statements about arithmetic that cannot be proved within a given formal system. This suggests that mathematical truth might transcend any particular formal system. Would you like to explore this idea further?",
          options: [
            { response: "Yes, please", next: 32 },
            { response: "No, I think I understand now", next: 15 }
          ]
        },
        {
          text: "While the incompleteness theorems do reveal limitations in our ability to formalize mathematics completely, they don't undermine the reliability of mathematics itself. In fact, they've led to important developments in logic and the foundations of mathematics. Would you like to know more about these developments?",
          options: [
            { response: "Yes, please tell me more", next: 33 },
            { response: "No, let's move on", next: 34 }
          ]
        },
        {
          text: "Excellent! You're correct. The incompleteness theorems reveal fundamental limitations of formal systems, showing that no single formal system can capture all mathematical truths. This has profound implications for the philosophy of mathematics and our understanding of formal reasoning. Would you like to explore these implications further?",
          options: [
            { response: "Yes, let's dive deeper", next: 35 },
            { response: "No, I think I understand the main point", next: 36 }
          ]
        },
        {
          text: "The incompleteness theorems don't prove that mathematics is inconsistent. Rather, they show that consistent systems powerful enough to encode arithmetic cannot prove their own consistency. This is different from being inconsistent. Would you like to explore the concept of consistency further?",
          options: [
            { response: "Yes, please explain consistency", next: 37 },
            { response: "No, let's move on", next: 38 }
          ]
        },
        {
          text: "The incompleteness theorems show that for any consistent formal system F powerful enough to encode arithmetic, there are statements that can be formulated in F that can neither be proved nor disproved within F. This doesn't mean mathematics is inconsistent, but rather that no single formal system can capture all mathematical truths. Shall we explore another aspect of this?",
          options: [
            { response: "Yes, please", next: 39 },
            { response: "No, I think I understand now", next: 15 }
          ]
        },
        {
          text: "Let's consider the relationship between truth and provability. According to the incompleteness theorems, which of the following is correct?",
          options: [
            { response: "All true statements are provable", next: 40 },
            { response: "Some true statements are unprovable", next: 41 },
            { response: "All unprovable statements are false", next: 42 }
          ]
        },
        {
          text: "Take your time. These concepts can be challenging. When you're ready to continue, just let me know.",
          options: [
            { response: "I'm ready now", next: 22 },
            { response: "I need more time", next: 43 }
          ]
        },
        {
          text: "I'm afraid that's not correct. The Second Incompleteness Theorem actually states that for any consistent formal system F powerful enough to encode arithmetic, F cannot prove its own consistency. Would you like to explore why this is significant?",
          options: [
            { response: "Yes, please explain", next: 44 },
            { response: "No, let's try another question", next: 45 }
          ]
        },
        {
          text: "Correct! This is indeed what the Second Incompleteness Theorem states. What do you think this implies about our ability to establish the consistency of mathematical systems?",
          options: [
            { response: "We can never be sure of consistency", next: 46 },
            { response: "We need stronger systems to prove consistency", next: 47 },
            { response: "Consistency is not important", next: 48 }
          ]
        },
        {
          text: "That's not quite right. The Second Incompleteness Theorem doesn't say anything about inconsistent systems proving their consistency. Would you like to try again?",
          options: [
            { response: "Yes, I'll try again", next: 12 },
            { response: "No, please explain the correct answer", next: 49 }
          ]
        },
        {
          text: "The concept of incompleteness relates to the limitations of formal systems in capturing all truths about arithmetic. It shows that for any consistent formal system powerful enough to encode arithmetic, there are statements that can neither be proved nor disproved within that system. Would you like to explore a specific aspect of this?",
          options: [
            { response: "Let's discuss the First Incompleteness Theorem", next: 50 },
            { response: "Tell me about the Second Incompleteness Theorem", next: 51 }
          ]
        },
        {
          text: "That's not quite right. An undecidable statement in a formal system isn't necessarily neither true nor false. It's a statement that can't be proved or disproved within the system. Would you like to explore this concept further?",
          options: [
            { response: "Yes, please explain more", next: 52 },
            { response: "No, let's move on", next: 53 }
          ]
        },
        {
          text: "Correct! An undecidable statement is one that can neither be proved nor disproved within the given formal system. This is a key concept in understanding the incompleteness theorems. Would you like to explore its implications?",
          options: [
            { response: "Yes, let's discuss implications", next: 54 },
            { response: "No, I think I understand", next: 55 }
          ]
        },
        {
          text: "I'm afraid that's not correct. An undecidable statement isn't necessarily false. It's a statement that can't be proved or disproved within the system. Would you like to try again?",
          options: [
            { response: "Yes, I'll try again", next: 14 },
            { response: "No, please explain more", next: 56 }
          ]
        },
        {
          text: "Certainly! What aspect of the incompleteness theorems would you like to explore further?",
          options: [
            { response: "The nature of mathematical truth", next: 57 },
            { response: "The limits of formal systems", next: 58 },
            { response: "The impact on computer science", next: 59 }
          ]
        },
        {
          text: "This idea that mathematical truth might transcend formal systems leads to some fascinating philosophical questions. For instance, it suggests that there might be mathematical truths that are in some sense 'real' or 'objective', even if we can't prove them in any given system. What do you think about this perspective?",
          options: [
            { response: "It's a compelling idea", next: 60 },
            { response: "It seems counterintuitive", next: 61 },
            { response: "I'm not sure what to think", next: 62 }
          ]
        },
        {
          text: "The incompleteness theorems have led to significant developments in mathematical logic, computability theory, and the foundations of mathematics. For example, they've influenced our understanding of the limits of computation and the nature of mathematical truth. Would you like to explore one of these areas further?",
          options: [
            { response: "Let's discuss computability theory", next: 63 },
            { response: "Tell me more about mathematical truth", next: 64 },
            { response: "No, I think I have enough information", next: 65 }
          ]
        },
        {
          text: "Very well. Let's consider another aspect of the incompleteness theorems. What do you think they imply about the nature of mathematical knowledge?",
          options: [
            { response: "Mathematical knowledge is limited", next: 66 },
            { response: "Mathematical knowledge is infinite", next: 67 },
            { response: "Mathematical knowledge is uncertain", next: 68 }
          ]
        },
        {
          text: "The implications of the incompleteness theorems are indeed far-reaching. They suggest that mathematics is inexhaustible - there will always be true statements that cannot be proved within any given formal system. This has led to new perspectives on the nature of mathematical truth and the limits of formal reasoning. Is there a specific aspect of this you'd like to explore further?",
          options: [
            { response: "The nature of mathematical truth", next: 69 },
            { response: "The limits of formal reasoning", next: 70 },
            { response: "No, I think I understand the main ideas", next: 71 }
          ]
        },
        {
          text: "I'm glad you feel you understand the main point. The incompleteness theorems indeed reveal fundamental limitations of formal systems. Is there anything else you'd like to discuss about incompleteness or related topics?",
          options: [
            { response: "Yes, let's explore another topic", next: 72 },
            { response: "No, thank you for the explanation", next: "end" }
          ]
        }],
"npc1":[{ text: "Hello, how are you?",
    options: [    { response: "Bad", next: 1 },
                  { response: "Good", next: 2 }
             ]
  },
   { text: "Why, what's wrong?",
    options: [    { response: "My dog ran away", next: 3},
                  { response: "I broke up with my girlfriend", next: 4}
             ]
  },
 { text: "That's nice", next: "end"},
 { 
     text: "I'm sorry to hear that. Have you tried looking for your dog?",
     options: [
       { response: "Yes, but no luck", next: 5 },
       { response: "Not yet", next: 6 }
     ]
   },
   { 
     text: "Breakups are tough. Do you want to talk about it?",
     options: [
       { response: "Yes, please", next: 7 },
       { response: "No, thank you", next: 8 }
     ]
   },
   { 
     text: "Keep searching. I hope you find your dog soon.",
     next: "end"
   },
   { 
     text: "You should start looking as soon as possible. Time is of the essence.",
     next: "end"
   },
   { 
     text: "It feels like my world has ended. I don't know what to do.",
     options: [
       { response: "Take it one day at a time", next: 9 },
       { response: "You'll find someone better", next: 10 }
     ]
   },
   { 
     text: "Alright, but remember, it's okay to ask for help if you need it.",
     next: "end"
   },
   { 
     text: "That's good advice. Thank you.",
     next: "end"
   },
   { 
     text: "I hope so. It's just hard to see it right now.",
     next: "end"
   }
]
}