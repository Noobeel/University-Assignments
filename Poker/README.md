<h1 align="center"> Poker Dealer </h1>

## Description
---
This program deals two 2-card poker hands and a shared five card pool according to the rules of Texas Holdem poker. This program will determine the winning hand and return it. Incremental betting/passing/folding are ignored.

## Program Input
---
Input to the program will be the first 9 values in a permutation of the integers 1-52. This represents a shuffling of a standard deck of cards. The order of suits in an unshuffled deck are Clubs, Diamonds, Hearts, Spades. Within each suit, the ranks are ordered from Ace, 2-10, Jack, Queen, King.

The table below shows all 52 cards and their corresponding integer values in a shuffling:

|          |     |    |    |    |    |    |    |    |    |    |      |       |      |
|:--------:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:----:|:-----:|:----:|
|          | 1   | 2  | 3  | 4  | 5  | 6  | 7  | 8  | 9  | 10 | 11   | 12    | 13   |
| Clubs    | Ace | 2  | 3  | 4  | 5  | 6  | 7  | 8  | 9  | 10 | Jack | Queen | King |
|          | 14  | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24   | 25    | 26   |
| Diamonds | Ace | 2  | 3  | 4  | 5  | 6  | 7  | 8  | 9  | 10 | Jack | Queen | King |
|          | 27  | 28 | 29 | 30 | 31 | 32 | 33 | 34 | 35 | 36 | 37   | 38    | 39   |
| Hearts   | Ace | 2  | 3  | 4  | 5  | 6  | 7  | 8  | 9  | 10 | Jack | Queen | King |
|          | 40  | 41 | 42 | 43 | 44 | 45 | 46 | 47 | 48 | 49 | 50   | 51    | 52   |
| Spades   | Ace | 2  | 3  | 4  | 5  | 6  | 7  | 8  | 9  | 10 | Jack | Queen | King |

An input sequence that started with the integers:
[38, 48, 11, 6, ...] would represent Queen of Hearts, 9 of Spades, Jack of Clubs, 6 of Clubs, and so on.
This program is not tested with broken or invalid input and therefore does not have error-checks.

This program will accept this permutation as input and use it to deal two poker hands of two cards each in an alternating fashion. I.e., the first card goes to hand 1, the second card goes to hand 2, the third card goes to hand 1, fourth to hand 2. The remaining fivecards will form the shared pool. Once dealt, the program will analyze each hand according to Texas Holdem poker rules and decide a winner.

When determining hand strength, each player considers  their own cards as well as those in the shared pool. Effectively, each player has seven cards from which they will form the strongest possible hand.

## Tie Breaking
---
According to the standard rules of poker, the ranks of the cards are used to decide the winner when both hands have the same strength. For example, if both hands are a flush, then the hand with the card of highest rank is declared the winner. If both hands have a pair, then the hand whose pair is higher wins. For example, a pair of Kings beats a pair of Sevens. If both hands have the same pair, i.e.each hand has a pair of threes, then the hand with the next highest card wins (called the kicker).

It is possible for two hands to remain tied even after all tie-breaking mechanisms based on rank are considered. An absurd example would be if the five cards in the shared pool formed a royal flush, in which case both players would have the exact same best hand (the royal flush). This program will not be tested on such inputs. All inputs will produce a clear and unambiguous winner.

## Language Specific Input Types
---
Suit must be capitalized and face cards are represented numerically: <br>
11 = Jack, 12 = Queen, 13 = King, 1 = Ace.

1) Smalltalk: <br>
    Input: Array like #(1 2 3 4 5 6 7 8 9) <br>
    Output: Array like #('3S' '4S' '5S' '6S' '7S')

2)  Rust: <br>
    Input: Array [u32;9] like [1, 2, 3, 4, 5, 6, 7, 8, 9] <br>
    Output: Vec\<String> like ["3S", "4S", "5S", "6S", "7S"]

## Sample Inputs and Outputs:
---
- [9, 8, 7, 6, 5, 4, 3, 2, 1] -> ["2C", "3C", "4C", "5C", "6C"]
- [40, 41, 42, 43, 48, 49, 50, 51, 52] -> ["10S", "11S", "12S", "13S", "1S"]
- [40, 41, 27, 28, 1,  14, 15, 42, 29] -> ["1C", "1D", "1H", "1S"]
- [30, 13, 27, 44, 12, 17, 33, 41, 43] -> ["4D", "4H", "4S"]
- [27, 45, 3,  48, 44, 43, 41, 33, 12] -> ["2S", "4S", "5S", "6S", "9S"]
- [17, 31, 30, 51, 44, 43, 41, 33, 12] -> ["4D", "4H", "4S"]
- [17, 39, 30, 52, 44, 25, 41, 51, 12] -> ["12C", "12D", "12S", "13H", "13S"]
- [11, 25, 9, 39, 50, 48, 3,  49, 45] -> ["10S", "11S", "12D", "13H", "9S"]
- [50, 26, 39, 3, 11, 27, 20, 48, 52] -> ["11C", "11S", "13H", "13S"]
- [40, 52, 46, 11, 48, 27, 29, 32, 37]-> ["1H", "1S"]