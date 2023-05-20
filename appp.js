function drawWinner() {
  const participantsInput = document.getElementById("participants").value;
  const participants = participantsInput.split(",").map((name) => name.trim());

  const name = document.getElementById("name").value;
  const winnerProbability = name === "" ? 0 : 0.8;

  const nonWinners = participants.filter((participant) => participant !== name);
  const winner = Math.random() < winnerProbability ? name : nonWinners[Math.floor(Math.random() * nonWinners.length)];

  document.getElementById("winner").textContent = `${winner}中奖了！`;
}
