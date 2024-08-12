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

