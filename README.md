# `rubiks-cube-solver`
> 3x3x3

Takes a string representing a [Rubik's Cube state](#rubiks-cube-state) as input and outputs a string of [Rubik's Cube notations](#rubiks-cube-notations) for the solution, following the [Fridrich Method](https://ruwix.com/the-rubiks-cube/advanced-cfop-fridrich/).

# Usage
```js
const solver = require('rubiks-cube-solver');

let cubeState = [
  'flulfbddr', // front
  'rudrruddl', // right
  'dbbburrfb', // up
  'llffdrubf', // down
  'rludlubrf', // left
  'lubfbfudl' // back
].join('');

let solveMoves = solver(cubeState);
console.log(solveMoves);
```

## Options
### `partitioned` <small>boolean</small>
Returns an object with the four phases as keys (`cross`, `f2l`, `oll`, `pll`) and a string or array of strings for their solve moves.

The `cross` and `f2l` keys each point to an array of 4 strings -- the moves to get each cross edge and f2l pair into place.

The `oll` and `pll` keys each point to an algorithm string.

# <a name="rubiks-cube-state"></a>Rubik's Cube State
A cube state is a string containing a total of (6 faces) * (9 colors per face) = 56 characters, with no spaces. Each character represents the "color" for your chosen orientation (more on this below), and must be one of these 6: `f`, `r`, `u`, `d`, `l`, `b`. Instead of characters representing actual colors, like `g` for `green`, they represent the color of each face. The character `r` stands for "the middle color on the right face".

There is a specific process you must follow to correctly turn a Rubik's Cube into a string.

## Step 1: Choose an orientation
Any orientation can work. This starting orientation will be the same as the one you must use for the outputted solution. For example, the official default orientation is when the **front** face is **green**, the **up** face is **white**, and the **right** face is **red**. (Each face can be identified by their middle color)

## Step 2: Provide colors
Go through all the faces in this order: **front**, **right**, **up**, **down**, **left**, **back**, and provide the colors on each face, in order. To provide colors in the correct order, you must orient the cube correctly for each face.

When providing colors for the **front**, **right**, **back**, and **left** faces, orient the cube such that that face is facing you and the **up** face (the up face that you chose for your orientation!) is facing upward.

When providing colors for the **up** face, orient the cube such that the **up** face is facing toward you and your chosen **front** face is facing down.

When providing colors for the **down** face, orient the cube such that the **down** face is facing toward you and your chosen **front** face is facing up.

Once you've oriented the cube correctly for each face, provide colors starting from the upper left, moving horizontally to the right, and ending up on the bottom right -- like reading a book.

## Example
If you have a Rubik's Cube in front of you, you can follow along! I will take a solved cube and make these moves (when the **green** face is facing toward you and the **white** face is facing up)
```
R' U L B U F L2 D R D U' R
```
...and then determine the cube state.

1) Orientation
* We'll go with the default orientation -- **front** is **green** and **up** is **white**.

2) Providing colors
* First, we will provide the colors of the **front** face. Because of our chosen orientation, this face is **green**.
  * Then we will orient the cube such that the **green** face is facing us and our chosen **up** face (white) is facing up. (This orientation is the same as our default orientation)
  * Going through each color in the correct order, we end up with the colors: `green orange white orange green blue yellow yellow red`.
  * Knowing that **orange** is our **l**eft face, **green** is our **f**ront face, **yellow** is our **d**own face, etc., we translate these colors to the characters used for the state: `flulfbddr`
* Next, we move on the the **right** face -- red.
  * Then we orient the cube so that the **red** face is facing us and the **up** face (white) faces up.
  * And we get these colors: `red white yellow red red white yellow yellow orange`. The state string for these colors is `rudrruddl`.
* Next is **up** -- white. At this point, our cube state is (state for **front**) + (state for **right**) = `flulfbddrrudrruddl`
  * For this face, we will orient such that our chosen **up** face (white) faces us and our chosen **front** face (green) faces down.
  * We get the colors `yellow blue blue blue white red red green blue` which translates to `dbbburrfb`.
* Continuing this process we get:
  * **down** face as `llffdrubf`.
  * **left** face as `rludlubrf`.
  * **back** face as `lubfbfudl`.

Done! Now we just add them all up in order -- **front right up down left back** -- and our Rubik's Cube state becomes
```
flulfbddrrudrruddldbbburrfbllffdrubfrludlubrflubfbfudl
```

The solution to this is:
```
Cross:
Uprime F U B Uprime L U2 Lprime
Uprime R Uprime B U

F2L:
Dprime Bprime Dprime B Rprime
Dprime R D B D Bprime Dprime
B D Bprime Dprime B D Bprime
Fprime Dprime F D2 R Dprime
Rprime D2 R Dprime Rprime

OLL:
b D Bprime D B D2 bprime

PLL:
B2 dprime B Dprime B D Bprime
d B2 R Dprime Rprime Dprime
```
When making these moves, be sure to have the cube oriented in your chosen orientation from earlier.

# <a name="rubiks-cube-notations"></a>Rubik's Cube Notations
[This](https://ruwix.com/the-rubiks-cube/notation/) is a list of all the different notations, but I'll try to explain here as well.

There are notations for moving each face on a Rubik's Cube: either clockwise, counter-clockwise, or a 180 degree turn. For example, `F` denotes a clockwise rotation of the `front` face, `F'` for a counter-clockwise rotation, and `F2` for the 180 degree turn. Each face has their own notation: **F**ront, **R**ight, **U**p, **D**own, **L**eft, **B**ack. There are also notations for middle moves: `M`, `E`, and `S`. I don't know why those letters are used.

Notation is case-sensitive: upper-case denotes a single-layer turn and lower-case denotes a double-layer turn. A double-layer turn is a turn of a middle slice on top of a single-layer turn (in the context of a 3x3x3). For example, the move `r` is the same as `R M'` and `b'` is the same as `B' S`. The middle moves `M`, `E`, and `S` cannot be lower-case otherwise they would be ambiguous.

As an aside, official notation uses `'` (apostrophe) to denote a counter-clockwise rotation, but since we're in JavaScript instead append `prime` (e.g. replace `R'` with `Rprime`). Also, this solver does not recognize the moves `X`, `Y`, or `Z`.
