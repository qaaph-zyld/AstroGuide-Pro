# Sequential Thinking Guide

## Introduction

Sequential Thinking is a powerful tool designed to help break down complex problems into manageable steps, allowing for more structured and effective problem-solving. This guide explains how to use the Sequential Thinking tool effectively.

## What is Sequential Thinking?

Sequential Thinking is a method that:
- Breaks down complex problems into discrete steps
- Allows for revision and branching of thoughts
- Enables hypothesis generation and verification
- Provides a structured approach to problem-solving
- Maintains context over multiple steps

## When to Use Sequential Thinking

Use Sequential Thinking when:
- Facing complex problems that need step-by-step analysis
- Planning and designing with room for revision
- Working on analysis that might need course correction
- Dealing with problems where the full scope isn't clear initially
- Needing to maintain context over multiple steps
- Filtering out irrelevant information

## How to Use Sequential Thinking

### Basic Parameters

1. **thought**: Your current thinking step, which can include:
   - Regular analytical steps
   - Revisions of previous thoughts
   - Questions about previous decisions
   - Realizations about needing more analysis
   - Changes in approach
   - Hypothesis generation
   - Hypothesis verification

2. **thoughtNumber**: Current number in sequence

3. **totalThoughts**: Current estimate of thoughts needed (can be adjusted)

4. **nextThoughtNeeded**: Boolean indicating if more thinking is needed

5. **isRevision**: Boolean indicating if this thought revises previous thinking

6. **revisesThought**: If revising, which thought number is being reconsidered

7. **branchFromThought**: If branching, which thought number is the branching point

8. **branchId**: Identifier for the current branch (if any)

9. **needsMoreThoughts**: Boolean indicating if more thoughts are needed beyond initial estimate

### Process

1. **Start with an initial estimate** of needed thoughts, but be ready to adjust
2. **Express each thought clearly** and build on previous thoughts
3. **Question or revise previous thoughts** when necessary
4. **Add more thoughts** if needed, even at the "end"
5. **Express uncertainty** when present
6. **Mark thoughts that revise** previous thinking or branch into new paths
7. **Ignore irrelevant information**
8. **Generate a solution hypothesis** when appropriate
9. **Verify the hypothesis** based on the Chain of Thought steps
10. **Repeat the process** until satisfied with the solution
11. **Provide a single, correct answer** as the final output

## Best Practices

1. **Be flexible** with your thought process
2. **Don't hesitate to revise** earlier thoughts
3. **Clearly indicate** when you're branching or revising
4. **Keep track of thought numbers** for easy reference
5. **Only conclude** when you have a satisfactory answer
6. **Set nextThoughtNeeded to false** only when truly done

## Example Usage

```
Thought 1: "Let me understand the problem first..."
Thought 2: "Based on the information, I think..."
Thought 3: "Actually, I need to revise thought 2 because..."
Thought 4: "Now I can generate a hypothesis..."
Thought 5: "Testing this hypothesis against the facts..."
Thought 6: "The final answer is..."
```

## Conclusion

Sequential Thinking is a versatile tool that can help with a wide range of complex problems. By breaking down your thinking into discrete steps and allowing for revision and branching, you can approach problems more systematically and arrive at better solutions.
