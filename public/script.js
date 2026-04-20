// ======================
// GENERATE IDEA
// ======================
async function generateIdea() {
  const prompt = document.getElementById("prompt").value;
  const resultDiv = document.getElementById("result");
  const loader = document.getElementById("loading");

  if (!prompt.trim()) {
    resultDiv.innerText = "Please enter a prompt!";
    return;
  }

  loader.classList.remove("hidden");
  resultDiv.innerHTML = "";

  try {
    const response = await fetch("https://ai-app-idea-generator-ai-app-idea-generator.up.railway.app/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    const data = await response.json();

    loader.classList.add("hidden");

    if (data.success) {
      typeWriter(data.idea, resultDiv);
    } else {
      resultDiv.innerText = data.error;
    }
  } catch (error) {
    loader.classList.add("hidden");
    resultDiv.innerText = "Error occurred!";
  }
}

// ======================
// HEADING DETECTION
// ======================
function isHeading(line) {
  const clean = line.toLowerCase().trim();

  return (
    clean.startsWith("app name") ||
    clean.startsWith("description") ||
    clean.startsWith("target audience") ||
    clean.startsWith("features") ||
    clean.startsWith("monetization") ||
    clean.startsWith("tech stack")
  );
}

function typeWriter(text, element, speed = 8) {
  element.innerHTML = "";
  element.classList.add("card");

  const lines = text.split("\n");
  let i = 0;

  function typeLine() {
    if (i < lines.length) {
      let line = lines[i].trim();

      if (line === "") {
        i++;
        setTimeout(typeLine, speed);
        return;
      }

      //  FIX: SPLIT LABEL AND VALUE
      if (isHeading(line)) {
        const parts = line.split(":");

        const label = parts[0]; // App Name
        const value = parts.slice(1).join(":"); 

        element.innerHTML += `
          <div class="heading">${label}:</div>
          <div class="text">${value.trim()}</div>
        `;
      }

      // 🔹 BULLETS
      else if (line.startsWith("-") || line.startsWith("•")) {
        element.innerHTML += `<div class="text">• ${line.replace(/[-•]/, "")}</div>`;
      }

      // 🔸 NORMAL TEXT
      else {
        element.innerHTML += `<div class="text">${line}</div>`;
      }

      i++;
      setTimeout(typeLine, speed);
    }
  }

  typeLine();
}


// ======================
// COPY TEXT
// ======================
function copyText() {
  const text = document.getElementById("result").innerText;

  if (!text.trim()) {
    alert("Nothing to copy!");
    return;
  }

  navigator.clipboard.writeText(text);
  alert("Copied!");
}

// ======================
// DOWNLOAD (TXT FILE SAFE)
// ======================
function downloadPDF() {
  const text = document.getElementById("result").innerText;

  if (!text.trim()) {
    alert("No idea to download!");
    return;
  }

  const blob = new Blob([text], { type: "text/plain" });
  const link = document.createElement("a");

  link.href = URL.createObjectURL(blob);
  link.download = "ai-idea.txt";
  link.click();
}
