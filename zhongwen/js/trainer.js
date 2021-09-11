function initTrainer() {
  if (!annyang) {
    document.getElementById("header").innerHTML = ""
    document.getElementsByClassName("container")[0].innerHTML =
      "Speech Recognition is not supported on this browser. Please use the newest version of Google Chrome."
    return
  }
  const jsonDeckURL = "/zhongwen/decks/"

  let phrases = {}

  const continueButton = document.getElementById("continue")
  const againButton = document.getElementById("again")
  const playButton = document.getElementById("play")
  const resultElement = document.getElementById("result")
  const judgementElement = document.getElementById("judgement")
  const phraseElement = document.getElementById("phrase")
  const rightElement = document.getElementById("right")
  const wrongElement = document.getElementById("wrong")
  const translationElement = document.getElementById("translation")
  const showTranslationElement = document.getElementById("show_translation")
  const translationContainerElement = document.getElementById(
    "translation_container"
  )
  const audioElement = document.getElementById("recording")
  const deckElement = document.getElementById("decks")
  const recordingBoxElement = document.getElementById("recording-box")
  const startRecordingBoxElement = document.getElementById(
    "start-recording-box"
  )

  audioElement.style.display = "none"

  let rightAnswers = 0
  let wrongAnswers = 0

  againButton.disabled = true

  let preferredLanguage = "zh-CN"

  let currentDeck, keys, randomIndex, phrase
  const synth = window.speechSynthesis
  const isMobile = navigator.userAgentData.mobile
  let mediaRecorder

  const queryString = window.location.search
  const urlParams = new URLSearchParams(queryString)
  let hasAzure = false

  let selectedDeck = deckElement.value
  if (urlParams.has("deck")) {
    selectedDeck = urlParams.get("deck")
    deckElement.value = selectedDeck
  }

  recordingBoxElement.hidden = true

  fetchDeck(selectedDeck).then(() => {
    currentDeck = phrases[selectedDeck]

    if (currentDeck["azure"]) {
      hasAzure = true
      delete currentDeck["azure"]
    }
    keys = Object.keys(currentDeck)
    randomIndex = Math.floor(Math.random() * keys.length)
    phrase = keys[randomIndex]

    phraseElement.innerText = phrase
    updateTranslation()
    setLanguage(selectedDeck)
    refreshCallback(phrase)
    startRecordingBoxElement.onclick = function () {
      startListening()
    }
  })

  showTranslationElement.onchange = function () {
    if (showTranslationElement.checked) {
      translationContainerElement.style.display = "block"
    } else {
      translationContainerElement.style.display = "none"
    }
  }
  decks.onchange = function (item) {
    selectedDeck = deckElement.value
    fetchDeck(selectedDeck).then(() => {
      setLanguage(selectedDeck)
      currentDeck = phrases[selectedDeck]

      keys = Object.keys(currentDeck)
      nextPhrase()
    })
  }
  againButton.onclick = speakAgain

  function speakAgain() {
    resetUI()
    startListening()
  }

  continueButton.onclick = nextPhrase

  document.onkeydown = function (e) {
    e.preventDefault()
    switch (e.key) {
      case "ArrowLeft":
        speakAgain()
        break
      case "ArrowUp":
        playPhrase()
        break
      case "ArrowRight":
        nextPhrase()
        break
    }
  }

  playButton.onclick = playPhrase

  function playPhrase() {
    if (hasAzure) {
      const azureAudio = `${jsonDeckURL}${selectedDeck}/${currentDeck[phrase][1]}`
      new Audio(azureAudio).play()
      console.log({ azureAudio })
      return
    }
    const utterThis = new SpeechSynthesisUtterance(phrase)
    const myLang = utterThis.lang
    utterThis.lang = preferredLanguage

    synth.speak(utterThis)
  }

  let onError = function (err) {
    console.log("The following error occured: " + err)
  }

  function onSuccess(stream) {
    let chunks = []
    mediaRecorder = new MediaRecorder(stream)
    mediaRecorder.start()

    mediaRecorder.ondataavailable = function (e) {
      chunks.push(e.data)
    }

    mediaRecorder.onstop = function (e) {
      audioElement.setAttribute("controls", "")
      audioElement.controls = true
      const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" })
      const audioURL = window.URL.createObjectURL(blob)
      audioElement.src = audioURL
      audioElement.style.display = "block"
      mediaRecorder.stop
    }
  }

  function startListening() {
    recordingBoxElement.hidden = false
    annyang.start({ autoRestart: true, continuous: false })
    console.log({ isMobile })
    if (isMobile) {
      console.log("Disabling recording")
    } else {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(onSuccess, onError)
    }
    startRecordingBoxElement.hidden = true
  }

  function stopListening() {
    recordingBoxElement.hidden = true
    annyang.abort()
    if (!isMobile) {
      mediaRecorder.stop()
    }
  }

  function resetUI() {
    audioElement.style.display = "none"
    resultElement.innerHTML = ""
    judgementElement.innerHTML = ""
  }

  function updateTranslation() {
    if (hasAzure) {
      translationElement.innerHTML = currentDeck[phrase][0]
    } else {
      translationElement.innerHTML = currentDeck[phrase]
    }
  }

  function nextPhrase() {
    resetUI()
    randomIndex = Math.floor(Math.random() * keys.length)
    phrase = keys[randomIndex]
    phraseElement.innerText = phrase
    updateTranslation()
    annyang.removeCallback()
    refreshCallback(phrase)
    startListening()
  }

  async function fetchDeck(deck) {
    const res = await fetch(jsonDeckURL + deck + ".json")
    phrases[deck] = await res.json()
  }

  function setLanguage(selectedDeck) {
    if (selectedDeck.includes("japanese")) {
      preferredLanguage = "ja-JP"
    } else if (selectedDeck.includes("czech")) {
      preferredLanguage = "cs"
    } else if (selectedDeck.includes("german")) {
      preferredLanguage = "de-DE"
    } else {
      preferredLanguage = "zh-CN"
    }
    console.log({ preferredLanguage })
    annyang.setLanguage(preferredLanguage)
  }

  function refreshCallback(expectedPhrase) {
    annyang.addCallback("result", function (actualPhrases) {
      stopListening()
      const normalizedPhrase = normalizePhrase(expectedPhrase)
      console.log({ actualPhrases, normalizedPhrase })
      const matchOf = actualPhrases
        .map((p) => normalizePhrase(p).toUpperCase())
        .indexOf(normalizedPhrase.toUpperCase())
      if (matchOf === -1) {
        markIncorrect(actualPhrases[0])
      } else {
        markCorrect(
          expectedPhrase,
          actualPhrases.indexOf(normalizedPhrase),
          actualPhrases[matchOf]
        )
      }
      annyang.abort()
      againButton.disabled = false
    })
  }

  function normalizePhrase(phrase) {
    let normalizedPhrase = phrase.replace(/[\.,\?\!/\(\)\"\']/g, "")
    if (["zh-CN", "ja-JP"].includes(preferredLanguage)) {
      normalizedPhrase = phrase.replace(/[。、，？！\s+]/g, "")
    }

    return normalizedPhrase
  }

  function markCorrect(phrase, position, actualPronunciation) {
    judgementElement.style.color = "green"
    let message = "GOOD JOB! "
    if (position === 0) {
      message += "I had no problem understanding you."
    } else if (position === 1) {
      message += "Your pronunciation was a little bit off though."
    } else {
      if (preferredLanguage === "zh-CN") {
        message += "You should work on your tones though. Want to try again?"
      } else {
        message += "Your pronunciation wasn't perfect though."
      }
      judgementElement.style.color = "orange"
    }
    judgementElement.innerText = message

    rightAnswers += 1
    rightElement.innerHTML = rightAnswers
    resultElement.innerHTML = actualPronunciation
  }

  function markIncorrect(actualPronunciation) {
    resultElement.innerHTML = actualPronunciation
    judgementElement.style.color = "red"
    judgementElement.innerText =
      "Oops. I couldn't understand you. Would you like to try again?"
    wrongAnswers += 1
    wrongElement.innerHTML = wrongAnswers
    const judgementResult = judgePronunciation(actualPronunciation, phrase)
    console.log({ judgementResult })
    resultElement.innerHTML += `<div><span>Please pay attention to this:  </span><span>${judgementResult}<span></div>`
  }

  function getDifference(s, t) {
    s = [...s].sort()
    t = [...t].sort()
    return t.filter((char, i) => char !== s[i])
  }

  function judgePronunciation(actualPronunciation, expectedPronunciation) {
    if (actualPronunciation === expectedPronunciation) {
      return ""
    }
    const diffs = getDifference(
      normalizePhrase(actualPronunciation),
      normalizePhrase(expectedPronunciation)
    )
    if (!diffs) {
      return ""
    }
    console.log({ diffs })
    const results = phrase.split("").map((c) => {
      if (diffs.includes(c)) {
        return `<span style="color: red">${c}</span>`
      }
      return c
    })
    return results.join("")
  }
}
