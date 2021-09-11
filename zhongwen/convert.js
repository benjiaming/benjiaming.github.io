const ankiToJson = require("anki-to-json").default
const inputFile = process.argv[2]
const outputDir = process.argv[3]
var fs = require("fs")
console.log({ inputFile, outputDir })
if (!outputDir) {
  console.log("Usage: convert file.apkg output_dir")
  process.exit(1)
}
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

ankiToJson(inputFile, outputDir)

const notes = `./${outputDir}/notes.json`
waitforFile(notes, processFile)

function processFile(jsonData) {
  const deck = {
    azure: true,
  }
  let fields = []
  jsonData.forEach((card) => {
    fields = card['flds'].split('\u001f')
    let english_sound = fields[3]
    let pinyin = fields[4]
    if (!english_sound) {
      english_sound = fields[4]
    }
    deck[fields[0]] = [
      fields[1],
      fields[2].replace(/\s*\[sound:(.*?)\]/, "$1"),
      english_sound.replace(/\s*\[sound:(.*?)\]/, "$1"),
      pinyin
    ]
  })
  const outputName = `${outputDir}.json`
  console.log({outputName});
  fs.writeFile(outputName, JSON.stringify(deck), function (err) {
    if (err) throw err
    console.log("complete!")
  })
}
// Wait for file to exist, checks every 2 seconds by default
function waitforFile(path, fun, timeout = 2000) {
  const intervalObj = setInterval(function () {
    const file = path
    const fileExists = fs.existsSync(file)

    console.log("Checking for: ", file)
    console.log("Exists: ", fileExists)

    if (fileExists) {
      clearInterval(intervalObj)
      const jsonData = JSON.parse(fs.readFileSync(path, "utf-8"))
      fun(jsonData)
    }
  }, timeout)
}
