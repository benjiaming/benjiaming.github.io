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

## Creating decks

Currently this process is manual and error-prone. I will attempt to automate as much as possible.
- Create an Anki deck e.g. hsk1_lesson1.apkg
- Convert hsk1_lesson1.apkg file into a hsk1_lesson.json
- Cleanup the hsk1_lesson.json file
- Move hsk1_lesson1.json file into decks/. Move related audio files into decks/hsk1_lesson1/

## Running the trainer locally

Running the trainer requires an HTTP server to serve the json and audio files. The easiest way to run an HTTP server is the follow [these instructions](https://developer.mozilla.org/en-US/docs/Learn/Common_questions/set_up_a_local_testing_server).

In short, you need:
1. Download Python from [https://www.python.org/](python.org).
2. On the first installer page, make sure you check the "Add Python 3.xxx to PATH" checkbox.
3. Open your command prompt (Windows) / terminal (macOS/ Linux). To check if Python is installed, enter the following command:
4.
   ```bash
   cd trainer/ # this is the name of the folder where you downloaded this trainer
   python -m SimpleHTTPServer
   ```
5. Open Google Chrome with this URL:
http://localhost:8000/zhongwen/?deck=test_deck



