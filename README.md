game-of-life
============

game of life exercise implemented using javascript with tests using jasmine.

Description (rules)
-----

Write some code that evolves generations through the "game of life".

The input will be a game board of cells, either alive (1) or dead (0).

The code should take this board and create a new board for the next
generation based on the following rules:

1. Any live cell with fewer than two live neighbours dies (under-population)
2. Any live cell with two or three live neighbours lives on to the next generation (survival)
3. Any live cell with more than three live neighbours dies (overcrowding)
4. Any dead cell with exactly three live neighbours becomes a live cell (reproduction)