// ===========================
// WELCOME TRANSITION
// ===========================
window.onload = function () {

  typeEffect();

  setTimeout(() => {
    const welcome = document.getElementById("welcomePage");

    welcome.style.opacity = "0";
    welcome.style.transition = "0.5s";

    setTimeout(() => {
      welcome.style.display = "none";
      document.getElementById("mainApp").style.display = "block";
    }, 500);

  }, 2500);
};

// ===========================
// TYPING ANIMATION
// ===========================
const text = "Bone Fracture Detection Model";
let index = 0;

function typeEffect() {
  if (index < text.length) {
    document.getElementById("typedText").innerHTML += text.charAt(index);
    index++;
    setTimeout(typeEffect, 60);
  }
}

// ===========================
// BACKGROUND ANIMATION
// ===========================
const canvas = document.getElementById("networkCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

const particles = [];

for (let i = 0; i < 80; i++) {
  particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5),
    vy: (Math.random() - 0.5),
  });
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach((p) => {
    p.x += p.vx;
    p.y += p.vy;

    if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

    ctx.beginPath();
    ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
    ctx.fillStyle = "#3b82f6";
    ctx.fill();

    particles.forEach((p2) => {
      const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = "rgba(59,130,246,0.2)";
        ctx.stroke();
      }
    });
  });

  requestAnimationFrame(animate);
}
animate();

// ===========================
// IMAGE PREVIEW
// ===========================
const uploadInput = document.getElementById("imageUpload");
const previewImage = document.getElementById("previewImage");

uploadInput.addEventListener("change", function () {
  const file = this.files[0];
  if (file) {
    previewImage.src = URL.createObjectURL(file);
    previewImage.style.display = "block";
  }
});

// ===========================
// LOADER
// ===========================
function showLoader() {
  document.getElementById("loader").classList.remove("hidden");
}
function hideLoader() {
  document.getElementById("loader").classList.add("hidden");
}

// ===========================
// 🔥 ANALYZE IMAGE (FINAL FIXED)
// ===========================
function analyzeImage() {

  const file = document.getElementById("imageUpload").files[0];

  if (!file) {
    updateStatus("Upload an image first", "error");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  showLoader();

  fetch("http://127.0.0.1:5000/predict", {
    method: "POST",
    body: formData
  })
  .then(async (res) => {

    console.log("STATUS:", res.status);

    if (!res.ok) {
      throw new Error("Server error: " + res.status);
    }

    let data;
    try {
      data = await res.json();
    } catch (e) {
      throw new Error("Invalid JSON response");
    }

    return data;
  })
  .then((data) => {

    console.log("DATA RECEIVED:", data);

    // 🔥 HANDLE BACKEND ERROR
    if (data.error) {
      throw new Error(data.error);
    }

    if (!data || !data.result) {
      throw new Error("Invalid response");
    }

    // STATUS
    updateStatus(data.result, "success");

    // MAIN
    document.getElementById("confidenceText").innerText =
      "Confidence: " + data.confidence + "%";

    document.getElementById("fractureType").innerText =
      "Fracture Type: " + data.type;

    document.getElementById("typeConfidence").innerText =
      "Type Confidence: " + data.type_confidence + "%";

    // REPORT
    document.getElementById("resultText").innerText =
      "Result: " + data.result;

    document.getElementById("confidenceReport").innerText =
      "Confidence: " + data.confidence + "%";

    document.getElementById("typeReport").innerText =
      "Fracture Type: " + data.type;

    document.getElementById("typeConfidenceReport").innerText =
      "Type Confidence: " + data.type_confidence + "%";

    document.getElementById("recommendation").innerText =
      data.recommendation || "Consult orthopedic specialist";

    document.getElementById("note").innerText =
      data.note || "AI-generated prediction";

    animateGauge(data.confidence);

    hideLoader();
  })
  .catch((err) => {

    console.error("🔥 ERROR:", err);

    updateStatus("Error processing image", "error");

    hideLoader();
  });
}

// ===========================
// STATUS BADGE
// ===========================
function updateStatus(text, type) {
  const badge = document.getElementById("statusBadge");
  badge.innerText = text;

  if (type === "success") badge.style.background = "#22c55e";
  else if (type === "error") badge.style.background = "#ef4444";
  else badge.style.background = "#3b82f6";
}

// ===========================
// GAUGE
// ===========================
function animateGauge(value) {
  const gauge = document.getElementById("gaugeFill");
  const text = document.getElementById("gaugeText");

  let current = 0;

  const interval = setInterval(() => {
    if (current >= value) {
      clearInterval(interval);
    } else {
      current++;
      text.innerText = current + "%";

      const offset = 251 - (current / 100) * 251;
      gauge.style.strokeDashoffset = offset;
    }
  }, 10);
}

// ===========================
// GOOGLE MAPS
// ===========================

function findXrayCenter() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(pos => {
      window.open(
        `https://www.google.com/maps/search/x-ray+center/@${pos.coords.latitude},${pos.coords.longitude},15z`
      );
    });
  }
}

function findHospital() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(pos => {
      window.open(
        `https://www.google.com/maps/search/hospital/@${pos.coords.latitude},${pos.coords.longitude},15z`
      );
    });
  }
}

// ===========================
// PDF DOWNLOAD
// ===========================

function downloadReport() {

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // 🔹 Data from UI
  const result = document.getElementById("resultText").innerText || "N/A";
  const confidence = document.getElementById("confidenceReport").innerText || "N/A";
  const type = document.getElementById("typeReport").innerText || "N/A";
  const typeConf = document.getElementById("typeConfidenceReport").innerText || "N/A";
  const recommendation = document.getElementById("recommendation").innerText || "N/A";
  const note = document.getElementById("note").innerText || "N/A";

  // =========================
  // HEADER
  // =========================
  doc.setFillColor(2, 6, 23); // black
  doc.rect(0, 0, 210, 30, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.text("BoneAI Medical Report", 14, 18);

  // =========================
  // PATIENT INFO
  // =========================
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);

  doc.text("Report ID: AI-" + Math.floor(Math.random()*10000), 14, 40);
  doc.text("Date: " + new Date().toLocaleDateString(), 14, 48);

  // =========================
  // SECTION: DIAGNOSIS
  // =========================
  doc.setFontSize(14);
  doc.setTextColor(37, 99, 235);
  doc.text("Diagnosis", 14, 65);

  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text("Result: " + result, 14, 75);
  doc.text("Confidence: " + confidence, 14, 83);

  // =========================
  // SECTION: FRACTURE TYPE
  // =========================
  doc.setFontSize(14);
  doc.setTextColor(37, 99, 235);
  doc.text("Fracture Analysis", 14, 100);

  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text("Type: " + type, 14, 110);
  doc.text("Type Confidence: " + typeConf, 14, 118);

  // =========================
  // SECTION: RECOMMENDATION
  // =========================
  doc.setFontSize(14);
  doc.setTextColor(37, 99, 235);
  doc.text("Recommendation", 14, 135);

  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(recommendation, 14, 145);

  // =========================
  // SECTION: NOTE
  // =========================
  doc.setFontSize(14);
  doc.setTextColor(37, 99, 235);
  doc.text("Note", 14, 165);

  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(note, 14, 175);

  // =========================
  // FOOTER
  // =========================
  doc.setFontSize(10);
  doc.setTextColor(120, 120, 120);
  doc.text(
    "This report is generated by AI and should not replace professional medical advice.",
    14,
    285
  );

  // SAVE
  doc.save("BoneAI_Report.pdf");
}

// ===========================
// ASSISTANT
// ===========================

// ===========================
// SMART AI ASSISTANT
// ===========================


// toggle open/close
document.getElementById("assistantToggle").onclick = function () {

  const assistant = document.getElementById("assistant");

  if (assistant.style.display === "flex") {
    assistant.style.display = "none";
  } else {
    assistant.style.display = "flex";
  }
};

// close button
document.querySelector(".close-btn").onclick = function () {
  document.getElementById("assistant").style.display = "none";
};


document.getElementById("chatInput").addEventListener("keypress", function(e){

  if(e.key === "Enter"){

    let msg = this.value.toLowerCase().trim();
    let box = document.getElementById("chatBox");

    // USER MESSAGE
    box.innerHTML += `<p><b>You:</b> ${msg}</p>`;

    let reply = getAIResponse(msg);

    // AI MESSAGE
    box.innerHTML += `<p><b>AI:</b> ${reply}</p>`;

    this.value = "";

    // AUTO SCROLL
    box.scrollTop = box.scrollHeight;
  }
});


// ===========================
// AI LOGIC
// ===========================

function getAIResponse(msg){

  if(msg.includes("hi") || msg.includes("hello")){
    return "Hello 👋 How can I assist you with fracture analysis?";
  }

  if(msg.includes("fracture")){
    return "A fracture is a break in the bone. Upload an X-ray to detect it using AI.";
  }

  if(msg.includes("pain")){
    return "Pain after injury may indicate a fracture. Please upload an X-ray or consult a doctor.";
  }

  if(msg.includes("treatment")){
    return "Treatment depends on fracture type. It may include casting, surgery, or rest.";
  }

  if(msg.includes("report")){
    return "After analysis, you can download a detailed AI-generated medical report.";
  }

  if(msg.includes("confidence")){
    return "Confidence score shows how sure the AI is about the prediction.";
  }

  if(msg.includes("hospital")){
    return "You can use the 'Nearby Hospital' button to find medical help.";
  }

  if(msg.includes("xray") || msg.includes("x-ray")){
    return "Upload a clear X-ray image for accurate AI detection.";
  }

  return "I'm here to assist with fracture detection. Try asking about fracture, treatment, or X-ray.";
}

// ===========================
// TOGGLE ASSISTANT
// ===========================

function toggleAssistant() {

  const assistant = document.getElementById("assistant");

  if (assistant.style.display === "flex") {
    assistant.style.display = "none";
  } else {
    assistant.style.display = "flex";
  }
}

// ACTIVE SIDEBAR
document.querySelectorAll(".nav li").forEach(item => {
  item.addEventListener("click", function(){

    document.querySelectorAll(".nav li").forEach(i => i.classList.remove("active"));
    this.classList.add("active");

  });
});

// smooth card reveal
const cards = document.querySelectorAll(
  ".upload-card, .preview-card, .result-card, .report-card"
);

cards.forEach((card, i) => {
  card.style.opacity = "0";
  card.style.transform = "translateY(20px)";

  setTimeout(() => {
    card.style.transition = "0.5s ease";
    card.style.opacity = "1";
    card.style.transform = "translateY(0)";
  }, i * 150);
});

// SIDEBAR CLICK + SCROLL
document.querySelectorAll(".nav li").forEach(item => {
  item.addEventListener("click", function(){

    // active state
    document.querySelectorAll(".nav li").forEach(i => i.classList.remove("active"));
    this.classList.add("active");

    // scroll
    const sectionId = this.getAttribute("data-section");
    document.getElementById(sectionId).scrollIntoView({
      behavior: "smooth"
    });
  });
});

// LOAD ICONS
window.addEventListener("DOMContentLoaded", () => {
  if (window.lucide) {
    lucide.createIcons();
  }
});

document.querySelectorAll(".nav li").forEach(item => {
  item.addEventListener("click", function(){

    // active state
    document.querySelectorAll(".nav li").forEach(i => i.classList.remove("active"));
    this.classList.add("active");

    const sectionId = this.getAttribute("data-section");
    const section = document.getElementById(sectionId);

    // 🔥 PERFECT OFFSET FIX
    const y = section.getBoundingClientRect().top + window.pageYOffset - 120;

    window.scrollTo({
      top: y,
      behavior: "smooth"
    });
  });
});