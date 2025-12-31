let chartInstance = null;
import { auth, db } from "./firebase.js";
import {
  doc, setDoc, getDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const today = new Date().toISOString().split("T")[0];

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "index.html";
    return;
  }

  const ref = doc(db, "users", user.uid, "prayers", today);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    const data = snap.data();
     Object.keys(data).forEach(p => {
    document.getElementById(p).checked = data[p];
    })
  }
});

window.savePrayers = async function () {
  const user = auth.currentUser;
  if (!user) return;

  const data = {
    fajr: fajr.checked,
    zuhr: zuhr.checked,
    asr: asr.checked,
    maghrib: maghrib.checked,
    isha: isha.checked
  };

  await setDoc(doc(db, "users", user.uid, "prayers", today), data);
  alert("Saved ✅");
};
function updateGraphToday(percent) {
  if (!chartInstance) return;

  const todayLabel = new Date().getDate().toString();

  const labels = chartInstance.data.labels;
  const data = chartInstance.data.datasets[0].data;

  const index = labels.indexOf(todayLabel);

  if (index !== -1) {
    data[index] = percent;
  } else {
    labels.push(todayLabel);
    data.push(percent);
  }

  chartInstance.update();
}

window.logout = function () {
  signOut(auth).then(() => {
    window.location.href = "index.html";
  });
};
const prayers = ["fajr", "zuhr", "asr", "maghrib", "isha"];

function updateScore() {
  let done = 0;
  prayers.forEach(p => {
    if (document.getElementById(p).checked) done++;
  });

  const percent = Math.round((done / 5) * 100);

  // TEXT
  document.getElementById("score").innerText = percent + "%";

  // ☕ COFFEE THEME CIRCLE (NO GREEN)
  document.querySelector(".circle").style.background =
    `conic-gradient(
      #8b5a2b ${percent * 3.6}deg,
      #efe2cf 0deg
    )`;

  // 🔄 GRAPH LIVE UPDATE
  updateGraphToday(percent);
}


prayers.forEach(p =>
  document.getElementById(p).addEventListener("change", updateScore)
);


prayers.forEach(p => {
  document.getElementById(p).addEventListener("change", updateScore);
});
import {
  collection, getDocs
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

async function loadMonthlyData() {
  const user = auth.currentUser;
  if (!user) return;

  const month = new Date().toISOString().slice(0, 7); // YYYY-MM
  const ref = collection(db, "users", user.uid, "prayers");
  const snap = await getDocs(ref);

  let labels = [];
  let values = [];

  snap.forEach(docSnap => {
    if (docSnap.id.startsWith(month)) {
      const d = docSnap.data();
      const done = Object.values(d).filter(v => v).length;
      const percent = (done / 5) * 100;

      labels.push(docSnap.id.slice(8)); // day
      values.push(percent);
    }
  });

  drawChart(labels, values);
}

function drawChart(labels, data) {
  const ctx = document.getElementById("monthlyChart");

  if (chartInstance) {
    chartInstance.destroy();
  }

  chartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [{
        label: "Prayer Consistency %",
        data,
        borderColor: "#8b5a2b",
        backgroundColor: "rgba(139,90,43,0.25)",
        tension: 0.4,
        fill: true
      }]
    },
    options: {
      animation: { duration: 300 },
      scales: {
        y: { min: 0, max: 100 }
      }
    }
  });
}


onAuthStateChanged(auth, user => {
  if (user) loadMonthlyData();
});
