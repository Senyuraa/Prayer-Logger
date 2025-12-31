import { auth } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

window.signup = () => {
  const email = emailInput.value;
  const password = passwordInput.value;

  createUserWithEmailAndPassword(auth, email, password)
    .then(() => window.location.href = "dashboard.html")
    .catch(e => alert(e.message));
};

window.login = () => {
  const email = emailInput.value;
  const password = passwordInput.value;

  signInWithEmailAndPassword(auth, email, password)
    .then(() => window.location.href = "dashboard.html")
    .catch(e => alert(e.message));
};
if (snap.exists()) {
  const data = snap.data();
  Object.keys(data).forEach(p => {
    document.getElementById(p).checked = data[p];
  });
  updateScore(); // smooth + accurate
}
