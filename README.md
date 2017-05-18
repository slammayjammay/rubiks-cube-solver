# `rubiks-cube-solver`
> 3x3x3

Takes a string representing a [Rubik's Cube state](#rubiks-cube-state) as input and outputs a string of [Rubik's Cube notations](#rubiks-cube-notations) for the solution, following the [Fridrich Method](https://ruwix.com/the-rubiks-cube/advanced-cfop-fridrich/).

# Usage
```js
const solver = require('rubiks-cube-solver');

let cubeState = [
  'llflfbbrr', // front
  'dubrrdfbd', // right
  'lddfububr', // up
  'rfudddfff', // down
  'dubrluulu', // left
  'rrbfbulll' // back
].join('');

let solveMoves = solver(cubeState);
console.log(solveMoves);
```

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
If you have a solved cube in front of you, you can follow along! I will take a solved cube and make these moves...
```
R U R' U' L F' R2 D' U' L'
```
...and then determine the cube state.

1) Orientation
* We'll go with the default orientation -- **front** is **green** and **up** is **white**.

2) Providing colors
* First, we will provide the colors of the **front** face. Because of our chosen orientation, this face is **green**.
  * Then we will orient the cube such that the **green** face is facing us and our chosen **up** face (white) is facing up. (This orientation is the same as our default orientation)
  * Going through each color in the correct order, we end up with the colors (actual colors): `orange orange green orange green blue blue red red`.
  * Knowing that our chosen **left** face is orange, our **back** face is blue, etc., we translate these colors to the characters used for the state: `llflfbbrr`
* Next, we move on the the **right** face -- red.
  * Then we orient the cube so that the red face is facing us and the **up** face (white) faces up.
  * And we get these colors: `yellow white blue red red yellow green blue yellow`. The state string for these colors is `dubrrdfbd`.
* Next is **up** -- white. At this point, our cube state is (state for **front**) + (state for **right**) = `llflfbbrrdubrrdfbd`
  * For this face, we will orient such that our chosen **up** face (white) faces us and our chosen **front** face (green) faces down.
  * We get the colors `orange yellow yellow green white blue white blue red` which translates to `lddfububr`.
* Continuing this process we get:
  * **down** face as `rfudddfff`.
  * **left** face as `dubrluulu`.
  * **back** face as `rrbfbulll`.

Done! Our Rubik's Cube state is
```
llflfbbrrdubrrdfbdlddfububrrfudddfffdubrluulurrbfbulll
```

The outputted solution to this is: (71 moves)
```
U2 L U2 Lprime Uprime F Uprime Bprime
Uprime R Uprime L D Lprime D B Dprime
Bprime Dprime L Dprime Lprime F Dprime
Fprime D F D Fprime D2 Lprime D L D2
Lprime D L D2 Bprime D2 B D2 Bprime D
B2 F2 Rprime F Rprime Fprime R2 F Rprime
F Bprime L Bprime Lprime F L B Lprime
Fprime L B Lprime F L Bprime Lprime Fprime
```
and are the moves you must do while orienting the cube in your chosen orientation.

# <a name="rubiks-cube-notations"></a>Rubik's Cube Notations
[This](https://ruwix.com/the-rubiks-cube/notation/) is a list of all the different notations, but I'll try to explain here as well.

There are notations for moving each face on a Rubik's Cube: either clockwise, counter-clockwise, or a 180 degree turn. For example, `F` denotes a clockwise rotation of the `front` face, `F'` for a counter-clockwise rotation, or `F2` for the 180 degree turn. Each face has their own notation: **F**ront, **R**ight, **U**p, **D**own, **L**eft, **B**ack. There are also notations for middle moves: `M`, `E`, and `S`. I don't know why those letters are used.

As an aside, official notation uses `'` (apostrophe) to denote a counter-clockwise rotation, but since we're in JavaScript instead append `prime` (e.g. replace `R'` with `Rprime`). Also, this solver does not recognize the moves `X`, `Y`, or `Z`.
