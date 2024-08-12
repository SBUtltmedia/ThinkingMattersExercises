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