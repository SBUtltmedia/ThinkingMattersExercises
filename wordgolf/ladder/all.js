/******************************************************************************
 * File: adapter.js
 * Author: Keith Schwarz (htiek@cs.stanford.edu)
 * 
 * Glue code to adapt the HTML document for word ladders with the actual file
 * that computes word ladders.
 */

/* A utility function to report a result. */
function reportResult(input) {
    document.getElementById("display").innerHTML = input;
}

/* Starts up the word ladder processor. */
function launchWordLadder() {
    /* Begin by pulling up the contents of the start and end word. */
    var startWord = document.getElementById("start").value.trim().toLowerCase();
    var endWord   = document.getElementById("end").value.trim().toLowerCase();

    /* Confirm that these words are of the same length and that they exist in
     * the word list.
     */
    if (startWord.length !== endWord.length) {
        reportResult("Start and end words must have the same length.");
        return;
    }
    else if (kWords[startWord] === undefined) {
        reportResult('"' + startWord + '" is not in our dictionary.');
        return;
    }
    else if (kWords[endWord] === undefined) {
        reportResult('"' + startWord + '" is not in our dictionary.');
        return;
    }

    /* If everything checks out okay, run the word ladder program to get back 
     * a ladder.
     */
    var ladder = findWordLadder(startWord, endWord, kWords);

    /* If we didn't get anything back, report an error. */
    if (ladder === undefined) {
        reportResult("No ladder found from " + startWord + " to " + endWord);
    }
    /* Otherwise, print out the resulting ladder. */
    else {
        var result = "";
        for (var i = 0; i < ladder.length; ++i) {
            result += ladder[i];

            /* If this isn't the last word, output an arrow in-between this
             * word and the next.
             */
            if (i !== ladder.length - 1)
                result += " &rarr; ";
        }
        reportResult(result);
    }
}

/******************************************************************************
 * File: ladder.js
 * Author: Keith Schwarz (htiek@cs.stanford.edu)
 *
 * An implementation of the word ladders game using JavaScript.  In the word
 * ladders game, two English words of the same length are given, and the goal
 * is to find a chain of words starting with the first word and ending with the
 * second word such that each intermediate word differs by exactly one letter
 * from the word before it.  For example,
 * 
 *                    code -> lode -> love -> live
 *
 * is a word ladder from "code" to "live."
 *
 * This file finds word ladders between different words by running a breadth-
 * first search from the source word to the destination word.
 */

/**
 * A utility class representing a word ladder.  Internally, the ladder is
 * represented as a linked list, which allows for faster cloning.
 */
function WordLadder(word) {
    /* This is a linked list; initially the prev pointer is null. */
    this.prev = null;

    /* The word stored here is given by the input word. */
    this.word = word;
}

/**
 * Returns the last word in the word ladder.
 */
WordLadder.prototype.lastWord = function() {
    return this.word;
}

/**
 * Creates and returns a new word ladder formed by adding a new word onto the
 * end of this ladder.
 */
WordLadder.prototype.extendLadder = function(word) {
    /* Construct a new linked list cell and chain it onto the end. */
    var result = new WordLadder(word);
    result.prev = this;
    return result;
}

/**
 * Converts a word ladder into a standard array.
 */
WordLadder.prototype.toArray = function() {
    /* Begin with the empty array. */
    var result = [];

    /* Walk back to the start of the linked list, appending each word to the
     * result array.
     */
    for (var curr = this; curr !== null; curr = curr.prev)
        result.push(curr.word);

    /* Reverse and return the array. */
    result.reverse();
    return result;    
}

/**
 * Function: findSuccessors(word, words);
 * Usage: successors = findSuccessors("cat", words);
 * ----------------------------------------------------------------------------
 * Given a word, returns all words that differ from that word by just one
 * letter.
 */
function findSuccessors(word, words) {
    /* For each letter, try replacing that letter with something adjacent to
     * it and add it to the result list if this change yields a word.
     */
    var result = [];
    var msg = "";

    for (var i = 0; i < word.length; ++i) {
        for (var ch = 'a'.charCodeAt(0); ch <= 'z'.charCodeAt(0); ++ch) {
            /* Build the new word. */
            var candidate = word.substring(0, i) + String.fromCharCode(ch) + word.substring(i + 1);

            /* See if it's a word. */
            if (words[candidate] !== undefined)
                result.push(candidate);
        }
    }
    return result;
}

/**
 * Function: findWordLadder(startWord, endWord, words);
 * Usage: ladder = findWordLadder("kitty", "puppy", wordList);
 * ----------------------------------------------------------------------------
 * Finds a word ladder from startWord to endWord using the words specified as
 * keys in the words object.  It is assumed that the words have the same
 * length and are both legal words.  If a ladder is found, it is returned as an
 * array.  If not, undefined is returned.
 * 
 * Internally, this function works by running a breadth-first search of the 
 * word graph.  The shortest path to the destination word is thus found.
 */
function findWordLadder(startWord, endWord, words) {
    /* Maintain a work list of partial ladders, seeded with the start word. */
    var workList = new Queue();
    workList.enqueue(new WordLadder(startWord));

    /* Also maintain a list of words that we have already processed; initially
     * this is empty.
     */
    var usedWords = {};

    /* While the worklist isn't empty, process elements from it. */
    while (workList.length() !== 0) {
        /* Obtain the current ladder. */
        var ladder = workList.dequeue();

        /* Look at the last word in the ladder.  If we've already seen it, skip
         * this word.
         */
        if (usedWords[ladder.lastWord()] !== undefined) continue;

        /* Otherwise, add that to the used word list. */
        usedWords[ladder.lastWord()] = null;

        /* If the last word is the destination word, hand back this word
         * ladder.
         */
        if (ladder.lastWord() == endWord)
            return ladder.toArray();

        /* Now, find all possible successor words for this word, and for each
         * of them extend the word ladder.
         */
        var successors = findSuccessors(ladder.lastWord(), words);

        /* For each successor, chain it onto the current word ladder and put
         * it back into the queue.
         */
        for (var i = 0; i < successors.length; ++i)
            workList.enqueue(ladder.extendLadder(successors[i]));
    }
}

/******************************************************************************
 * File: queue.js
 * Author: Keith Schwarz (htiek@cs.stanford.edu)
 * 
 * An implementation of a queue using the two-stack queue implementation.  This
 * queue is fast in an amortized sense (O(1) amortized push and pop), and a
 * full analysis of this queue implementation can be found at the Min Queue
 * implementation at the Archive of Interesting Code:
 * 
 *           http://keithschwarz.com/interesting/code/?dir=min-queue
 * 
 * Intuitively, the queue works by maintaining two stacks - an 'in' stack and
 * an 'out' stack.  New elements added to the queue are pushed into the 'in'
 * stack.  When a dequeue is made, if the out stack is empty, all elements from
 * the 'in' stack are popped and pushed into the 'out' stack.  Elements are
 * then removed from the 'out' stack when elements are dequeued.
 */

/**
 * Constructs a new, empty two-stack queue.
 */
function Queue() {
    /* The in and out stacks are initially empty. */
    this.inStack = [];
    this.outStack = [];
}

/**
 * Enqueues a new element into the queue.
 */
Queue.prototype.enqueue = function(element) {
    /* Add the element to the 'in' stack. */
    this.inStack.push(element);
}

/**
 * Dequeues and removes the front element of the queue.
 */
Queue.prototype.dequeue = function() {
    /* If the out stack isn't empty, pop the top element and return it. */
    if (this.outStack.length !== 0) return this.outStack.pop();

    /* If there aren't any elements in the in stack, report an error. */
    if (this.inStack.length === 0)
        throw "Dequeue from an empty stack.";

    /* Otherwise, move everything from the in stack to the out stack. */
    while (this.inStack.length !== 0)
        this.outStack.push(this.inStack.pop());

    /* Pop the out stack and return it. */
    return this.outStack.pop();
}

/**
 * Reports how many elements are in the queue.
 */
Queue.prototype.length = function() {
    return this.inStack.length + this.outStack.length;
}