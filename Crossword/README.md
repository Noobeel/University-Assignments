<h1 align="center"> Crossword Solver </h1>

## Run Program
---
```
python crossword.py
```

## Description
---
This program converts a list of words as strings into a 20 x 20 matrix of characters (strings of length 1) that contains a crossword puzzle with these words.

There are multiple ways to build a crossword puzzle from the given list of words; many different outputs can be correct for the same list of words. The program goes through the list of words only once and any discarded words are not checked again.

A legal placement of a word W has the following properties:
- All of the word W lies on the 20x20 grid
- If W is not the first word, then W must intersect with one or more words on the grid
- The placement of W must not create any new 'words', i.e., W cannot be adjacent to any letter which is not in the word(s) with which W intersects

```
For example, when given the list:

["addle", "apple", "clowning", "incline", "plan", "burr"]

The program displays:

        a d d l e
        p
        p
      c l o w n i n g
        e       n
                c
                l
                i
          p l a n
                e

        or

        a d d l e
        p     o
        p     o
      c l o w n i n g
        e       n
                c
                l
                i
          p l a n
                e

An illegal example:

        a d d l e
        p r o v e
        p
      c l o w n i n g
        e       n o
                c
                l
                i
          p l a n
                e
```
