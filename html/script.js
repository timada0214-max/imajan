"use strict";

const loginForm = document.getElementById("login-form");
const nicknameInput = document.getElementById("nickname");
const pinInput = document.getElementById("pin");

const nicknameError = document.getElementById("nickname-error");
const pinError = document.getElementById("pin-error");
const formMessage = document.getElementById("form-message");

const loginButton = document.getElementById("login-button");
const signupButton = document.getElementById("signup-button");
const togglePinButton = document.getElementById("toggle-pin");

/**
 * 入力値の前後の空白を取り除きます。
 */
function getNickname() {
  return nicknameInput.value.trim();
}

/**
 * PINから数字以外を取り除きます。
 */
function normalizePin(value) {
  return value.replace(/\D/g, "").slice(0, 4);
}

/**
 * 個別のエラー表示を消します。
 */
function clearFieldErrors() {
  nicknameError.textContent = "";
  pinError.textContent = "";

  nicknameInput.classList.remove("input-error");
  pinInput.classList.remove("input-error");
}

/**
 * 画面上部のメッセージを消します。
 */
function clearFormMessage() {
  formMessage.textContent = "";
  formMessage.className = "form-message";
}

/**
 * 入力内容を検証します。
 */
function validateLoginForm() {
  clearFieldErrors();
  clearFormMessage();

  const nickname = getNickname();
  const pin = pinInput.value;

  let isValid = true;

  if (!nickname) {
    nicknameError.textContent = "ニックネームを入力してください。";
    nicknameInput.classList.add("input-error");
    isValid = false;
  } else if (nickname.length > 20) {
    nicknameError.textContent =
      "ニックネームは20文字以内で入力してください。";
    nicknameInput.classList.add("input-error");
    isValid = false;
  }

  if (!pin) {
    pinError.textContent = "PINを入力してください。";
    pinInput.classList.add("input-error");
    isValid = false;
  } else if (!/^\d{4}$/.test(pin)) {
    pinError.textContent = "PINは4桁の数字で入力してください。";
    pinInput.classList.add("input-error");
    isValid = false;
  }

  return isValid;
}

/**
 * ログイン処理です。
 *
 * 現在はローカル確認用です。
 * 次の工程でGASのloginUser()に接続します。
 */
async function handleLogin(event) {
  event.preventDefault();

  if (!validateLoginForm()) {
    return;
  }

  loginButton.disabled = true;
  loginButton.textContent = "確認中...";

  try {
    await new Promise((resolve) => {
      window.setTimeout(resolve, 500);
    });

    formMessage.textContent =
      "入力確認に成功しました。次の工程でGASに接続します。";

    formMessage.className = "form-message is-success";
  } catch (error) {
    console.error(error);

    formMessage.textContent =
      "処理中にエラーが発生しました。もう一度お試しください。";

    formMessage.className = "form-message is-error";
  } finally {
    loginButton.disabled = false;
    loginButton.textContent = "ログイン";
  }
}

/**
 * PINの表示・非表示を切り替えます。
 */
function togglePinVisibility() {
  const isHidden = pinInput.type === "password";

  pinInput.type = isHidden ? "text" : "password";
  togglePinButton.textContent = isHidden ? "隠す" : "表示";

  togglePinButton.setAttribute(
    "aria-label",
    isHidden ? "PINを隠す" : "PINを表示する"
  );
}

/**
 * 初回登録ボタンの仮処理です。
 */
function handleSignup() {
  clearFormMessage();

  formMessage.textContent =
    "利用者登録画面は、ログイン接続後に追加します。";

  formMessage.className = "form-message is-success";
}

/**
 * PIN欄には数字だけを残します。
 */
function handlePinInput() {
  pinInput.value = normalizePin(pinInput.value);

  pinError.textContent = "";
  pinInput.classList.remove("input-error");
  clearFormMessage();
}

loginForm.addEventListener("submit", handleLogin);
togglePinButton.addEventListener("click", togglePinVisibility);
signupButton.addEventListener("click", handleSignup);

nicknameInput.addEventListener("input", () => {
  nicknameError.textContent = "";
  nicknameInput.classList.remove("input-error");
  clearFormMessage();
});

pinInput.addEventListener("input", handlePinInput);