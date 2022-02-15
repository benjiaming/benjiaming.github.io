# Pronunciation Trainer

Live at https://ltl-school.com/chinese-pronunciation-tool/
## Folder structure

index.html: Main HTML file

convert.js: Anki->JSON convertor.

/decks
  * this is where all lesson files go
  * for example for Lesson 1 we would create one file lesson1.json and one folder lesson1/ for all the media files

/js
 * trainer.js: the main JavaScript application

/styles
 * trainer.css: the stylesheet for the app

## Creating decks

Currently this process is manual and error-prone. Also it requires node and https://github.com/CraigglesO/anki-to-json.

- Create an Anki deck e.g. hsk1_lesson1.apkg
- Convert & cleanup hsk1_lesson1.apkg file into a hsk1_lesson.json using `node convert.js hsk1_lesson1.apkg hsk1_lesson1`
- Move hsk1_lesson1.json file into decks/. Move hsk1_lesson1/media/*.mp3 into decks/hsk1_lesson1/

