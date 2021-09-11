# Pronunciation Trainer

## Folder structure

index.html

/decks
  * this is where all lesson files go
  * for example for Lesson 1 we would create one file lesson1.json and one folder lesson1/ for all the media files

/js
 * trainer.js: the main JavaScript application

/styles
 * trainer.css: the stylesheet for the app

## Creating decks (TBD)

Currently this process is manual and error-prone. I will attempt to automate as much as possible.
- Create an Anki deck e.g. hsk1_lesson1.apkg
- Convert hsk1_lesson1.apkg file into a hsk1_lesson.json
- Cleanup the hsk1_lesson.json file
- Move hsk1_lesson1.json file into decks/. Move related audio files into decks/hsk1_lesson1/

