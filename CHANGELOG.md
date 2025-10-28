# Toy Path v0.1.0
<hr>

# October 14, 2025
- Erased and recreated the repository to reflect my new code, beginning from scratch.
- Began scaffolding with the HTML, CSS, Default JS file, and the Maps JS file.

# October 15, 2025
- Added mapObject class object
- Added Map array for 2nd map
- Named the maps

# October 16 & 17, 2025
- Displayed player character
- streamlined drawSquare()
- added colors for the player and water

# October 17, 2025
- Reorganized file tree for legibility and conformity to standards
- Added SpruceHandoff folder to hold a set of files that act as reminders for AI to help with any issues that arise.
- Finished adding all sprites to the play area.

# October 19, 2025
- Added rudimentary instructions for gameplay
- Added more to the scaffolding for common gameplay functions.

# October 20, 2025
- Set up DeltaTime
- Added movement for the player character
- Added logic to test next tile was traversable before moving player character.

# October 21, 2025
- Added Breadth First Search (BFS) function to find the shortest path to the lever.
- Added movement for the toy player character to get to the lever.

# October 22 & 23 & 24, 2025
- Completed the todo list
- Add fade transition between levels
- Balance breath drain/regeneration values
- Lower 'click' message time to 1 second
- Change 'click' message time to '*Click*' so it looks like an action vs a command to the player.
- Add shrinking and growing for inner square for the exits when the lever is flipped
- Add name of the level above the play area, maybe in its own canvas position just above the gameboard canvas
- Add more detailed instructions to the left of the gameboard canvas
- Began adding a Patrol Toy character that is introduced in the 3rd level.
- Began making Instruction manual and Box art for a game box.

# October 25, 2025
- Completed the code that defines and runs the Patrol Toy, allowing it to run a path.
- Added code that will reset the level if you run into the Patrol Toy.
- Added the code to test for the Manhattan Distance of the starting and ending tile for the Patrol Toy. If it is 1, then the path loops continuously; if not, the path just reverses.
- Added the other 8 levels to the game, mapping them to the Difficulty Saw.
- Corrected some errors with NPCs on the map arrays.

# October 26 & 27, 2025
- Added and Enum for the Game State itself.
- Created a scrolling Credits screen.

# October 28, 2025
- Finished crafting the Instruction Manual.
- Gave manual a touch up to be big enough to read, but not overwhelmingly big under the game's canvas.