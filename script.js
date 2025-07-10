const timerElement = document.getElementById("timer");
let time = 60;
let countdown;
const hintText = document.getElementById("hint-text");
const wordElement = document.getElementById("word");
const wrongLettersElement = document.getElementById("wrong-letters");
const playAgainButton = document.getElementById("play-button");
const popup = document.getElementById("popup-container");
const notification = document.getElementById("notification-container");
const finalMessage = document.getElementById("final-message");
const finalMessageRevealWord = document.getElementById("final-message-reveal-word");
const figureParts = document.querySelectorAll(".figure-part");

const words = [
  { word: "application", hint: "A formal request for something" },
  { word: "programming", hint: "What coders do" },
  { word: "interface", hint: "A shared boundary between systems" },
  { word: "wizard", hint: "A magical character or helpful setup tool" },
  { word: "element", hint: "A fundamental part of something" },
  { word: "prototype", hint: "First model or early sample" },
  { word: "callback", hint: "Function passed into another function" },
  { word: "undefined", hint: "Default state of a declared JS variable" },
  { word: "arguments", hint: "Inputs to a function" },
  { word: "settings", hint: "Where you configure things" },
  { word: "selector", hint: "CSS tool to target HTML" },
  { word: "container", hint: "A box or wrapper element" },
  { word: "instance", hint: "An object created from a class" },
  { word: "response", hint: "What you get after a request" },
  { word: "console", hint: "Where you log debug messages" },
  { word: "constructor", hint: "A special method for object creation" },
  { word: "token", hint: "Used for authentication or parsing" },
  { word: "function", hint: "A reusable block of code" },
  { word: "return", hint: "What a function gives back" },
  { word: "length", hint: "Array or string property" },
  { word: "type", hint: "Defines what kind of data something is" },
  { word: "node", hint: "A runtime or DOM element" }
];

let selectedWordObj = words[Math.floor(Math.random() * words.length)];
let selectedWord = selectedWordObj.word;
hintText.innerText = selectedWordObj.hint;

let playable = true;

const correctLetters = [];
const wrongLetters = [];

function displayWord() {
  wordElement.innerHTML = `
    ${selectedWord
      .split("")
      .map(
        (letter) => `
          <span class="letter">
            ${correctLetters.includes(letter) ? letter : ""}
          </span>`
      )
      .join("")}
  `;
  const innerWord = wordElement.innerText.replace(/\n/g, "");
  if (innerWord === selectedWord) {
    finalMessage.innerText = "Congratulations! You won! 😃";
    finalMessageRevealWord.innerText = "";
    popup.style.display = "flex";
    playable = false;
    clearInterval(countdown); // stop timer on win
  }
}

function updateWrongLettersElement() {
  wrongLettersElement.innerHTML = `
    ${wrongLetters.length > 0 ? "<p>Wrong</p>" : ""}
    ${wrongLetters.map((letter) => `<span>${letter}</span>`).join("")}
  `;
  figureParts.forEach((part, index) => {
    const errors = wrongLetters.length;
    part.style.display = index < errors ? "block" : "none";
  });

  if (wrongLetters.length === figureParts.length) {
    finalMessage.innerText = "Unfortunately you lost. 😕";
    finalMessageRevealWord.innerText = `...the word was: ${selectedWord}`;
    popup.style.display = "flex";
    playable = false;
    clearInterval(countdown); // stop timer on loss
  }
}

function showNotification() {
  notification.classList.add("show");
  setTimeout(() => {
    notification.classList.remove("show");
  }, 2000);
}

function startTimer() {
  time = 60;
  timerElement.innerText = time;
  countdown = setInterval(() => {
    time--;
    timerElement.innerText = time;

    if (time <= 0) {
      clearInterval(countdown);
      finalMessage.innerText = "Time's up! You lost ⏰";
      finalMessageRevealWord.innerText = `...the word was: ${selectedWord}`;
      popup.style.display = "flex";
      playable = false;
    }
  }, 1000);
}

window.addEventListener("keypress", (e) => {
  if (playable) {
    const letter = e.key.toLowerCase();
    if (letter >= "a" && letter <= "z") {
      if (selectedWord.includes(letter)) {
        if (!correctLetters.includes(letter)) {
          correctLetters.push(letter);
          displayWord();
        } else {
          showNotification();
        }
      } else {
        if (!wrongLetters.includes(letter)) {
          wrongLetters.push(letter);
          updateWrongLettersElement();
        } else {
          showNotification();
        }
      }
    }
  }
});

playAgainButton.addEventListener("click", () => {
  playable = true;
  correctLetters.splice(0);
  wrongLetters.splice(0);

  selectedWordObj = words[Math.floor(Math.random() * words.length)];
  selectedWord = selectedWordObj.word;
  hintText.innerText = selectedWordObj.hint;

  displayWord();
  updateWrongLettersElement();
  popup.style.display = "none";

  clearInterval(countdown); // stop previous timer
  startTimer(); // restart timer
});

// Init
displayWord();
startTimer();
