let dialogs= {
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
 { text: "That's nice", next: "end"}
]
}