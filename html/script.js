"use strict";

const SESSION_STORAGE_KEY = "imajan.session";
const LOCAL_USERS_STORAGE_KEY = "imajan.localUsers";

const loginScreen = document.getElementById("login-screen");
const homeScreen = document.getElementById("home-screen");

const loginForm = document.getElementById("login-form");
const nicknameInput = document.getElementById("nickname");
const pinInput = document.getElementById("pin");

const nicknameError = document.getElementById("nickname-error");
const pinError = document.getElementById("pin-error");
const formMessage = document.getElementById("form-message");

const loginButton = document.getElementById("login-button");
const signupButton = document.getElementById("signup-button");
const togglePinButton = document.getElementById("toggle-pin");

const welcomeNickname = document.getElementById("welcome-nickname");
const logoutButton = document.getElementById("logout-button");
const eventListButton = document.getElementById("event-list-button");
const createEventButton = document.getElementById("create-event-button");
const homeMessage = document.getElementById("home-message");

/**
 * 現在の画面がGAS HTML Service上で動いているかを判定します。
 */
function isGasRuntime() {
  return Boolean(
    window.google &&
      window.google.script &&
      window.google.script.run,
  );
}

/**
 * 入力値の前後の空白を取り除きます。
 */
function getNickname() {
  return nicknameInput.value.trim();
}

/**
 * 暗証番号から数字以外を取り除きます。
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
 * ログイン画面のメッセージを消します。
 */
function clearFormMessage() {
  formMessage.textContent = "";
  formMessage.className = "form-message";
}

/**
 * ログイン画面にメッセージを表示します。
 */
function showFormMessage(message, type = "error") {
  formMessage.textContent = message;
  formMessage.className = `form-message is-${type}`;
}

/**
 * ホーム画面のメッセージを表示します。
 */
function showHomeMessage(message) {
  homeMessage.textContent = message;
  homeMessage.className = "home-message is-notice";
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
    pinError.textContent = "暗証番号を入力してください。";
    pinInput.classList.add("input-error");
    isValid = false;
  } else if (!/^\d{4}$/.test(pin)) {
    pinError.textContent =
      "暗証番号は4桁の数字で入力してください。";
    pinInput.classList.add("input-error");
    isValid = false;
  }

  return isValid;
}

/**
 * ログイン状態をlocalStorageへ保存します。
 */
function saveSession(user) {
  localStorage.setItem(
    SESSION_STORAGE_KEY,
    JSON.stringify({
      userId: user.userId,
      nickname: user.nickname,
      createdAt: user.createdAt || "",
    }),
  );
}

/**
 * 保存済みのログイン状態を取得します。
 */
function loadSession() {
  const savedSession = localStorage.getItem(SESSION_STORAGE_KEY);

  if (!savedSession) {
    return null;
  }

  try {
    const user = JSON.parse(savedSession);

    if (!user.userId || !user.nickname) {
      throw new Error("保存されたユーザー情報が不完全です。");
    }

    return user;
  } catch (error) {
    console.warn("ログイン情報の読み込みに失敗しました。", error);
    localStorage.removeItem(SESSION_STORAGE_KEY);
    return null;
  }
}

/**
 * 保存済みのログイン状態を削除します。
 */
function clearSession() {
  localStorage.removeItem(SESSION_STORAGE_KEY);
}

/**
 * ログイン画面を表示します。
 */
function showLoginScreen() {
  homeScreen.hidden = true;
  loginScreen.hidden = false;

  welcomeNickname.textContent = "";
  homeMessage.textContent = "";
  homeMessage.className = "home-message";

  window.setTimeout(() => {
    nicknameInput.focus();
  }, 0);
}

/**
 * ホーム画面を表示します。
 */
function showHomeScreen(user) {
  loginScreen.hidden = true;
  homeScreen.hidden = false;

  welcomeNickname.textContent = user.nickname;

  loginForm.reset();
  clearFieldErrors();
  clearFormMessage();

  pinInput.type = "password";
  togglePinButton.textContent = "表示";
  togglePinButton.setAttribute(
    "aria-label",
    "暗証番号を表示する",
  );
}

/**
 * GASのサーバー関数をPromise形式で呼び出します。
 */
function callGasFunction(functionName, payload) {
  return new Promise((resolve, reject) => {
    google.script.run
      .withSuccessHandler(resolve)
      .withFailureHandler(reject)
      [functionName](payload);
  });
}

/**
 * サーバー応答からユーザー情報を取り出します。
 */
function extractUserFromResponse(response) {
  if (!response || response.success !== true || !response.data) {
    const message =
      response && response.message
        ? response.message
        : "処理に失敗しました。";

    throw new Error(message);
  }

  return response.data;
}

/**
 * ローカル確認用のユーザー一覧を取得します。
 */
function getLocalUsers() {
  const savedUsers = localStorage.getItem(
    LOCAL_USERS_STORAGE_KEY,
  );

  if (!savedUsers) {
    return [];
  }

  try {
    return JSON.parse(savedUsers);
  } catch (error) {
    console.warn("ローカルユーザーの読み込みに失敗しました。", error);
    return [];
  }
}

/**
 * ローカル確認用のユーザー一覧を保存します。
 */
function saveLocalUsers(users) {
  localStorage.setItem(
    LOCAL_USERS_STORAGE_KEY,
    JSON.stringify(users),
  );
}

/**
 * VS Codeからブラウザで確認するときの仮ログイン処理です。
 */
function loginUserLocally({ nickname, pin }) {
  const users = getLocalUsers();
  const user = users.find(
    (item) => item.nickname === nickname && item.pin === pin,
  );

  if (!user) {
    throw new Error(
      "ニックネームまたは暗証番号が正しくありません。先に新規登録してください。",
    );
  }

  return {
    success: true,
    data: {
      userId: user.userId,
      nickname: user.nickname,
      createdAt: user.createdAt,
    },
  };
}

/**
 * VS Codeからブラウザで確認するときの仮ユーザー登録処理です。
 */
function createUserLocally({ nickname, pin }) {
  const users = getLocalUsers();
  const duplicatedUser = users.find(
    (item) => item.nickname === nickname,
  );

  if (duplicatedUser) {
    throw new Error(
      "同じニックネームが既に登録されています。",
    );
  }

  const createdAt = new Date().toISOString();
  const user = {
    userId: `local-${Date.now()}`,
    nickname,
    pin,
    createdAt,
  };

  users.push(user);
  saveLocalUsers(users);

  return {
    success: true,
    data: {
      userId: user.userId,
      nickname: user.nickname,
      createdAt: user.createdAt,
    },
  };
}

/**
 * 実行環境に応じてログイン処理を呼び分けます。
 */
async function requestLogin(payload) {
  if (isGasRuntime()) {
    return callGasFunction("loginUser", payload);
  }

  await new Promise((resolve) => {
    window.setTimeout(resolve, 350);
  });

  return loginUserLocally(payload);
}

/**
 * 実行環境に応じて新規登録処理を呼び分けます。
 */
async function requestSignup(payload) {
  if (isGasRuntime()) {
    return callGasFunction("createUser", payload);
  }

  await new Promise((resolve) => {
    window.setTimeout(resolve, 350);
  });

  return createUserLocally(payload);
}

/**
 * ログイン処理です。
 */
async function handleLogin(event) {
  event.preventDefault();

  if (!validateLoginForm()) {
    return;
  }

  const payload = {
    nickname: getNickname(),
    pin: pinInput.value,
  };

  loginButton.disabled = true;
  signupButton.disabled = true;
  loginButton.textContent = "確認中...";

  try {
    const response = await requestLogin(payload);
    const user = extractUserFromResponse(response);

    saveSession(user);
    showHomeScreen(user);
  } catch (error) {
    console.error(error);

    showFormMessage(
      error.message ||
        "ログイン中にエラーが発生しました。もう一度お試しください。",
    );
  } finally {
    loginButton.disabled = false;
    signupButton.disabled = false;
    loginButton.textContent = "ログイン";
  }
}

/**
 * 新規登録処理です。
 */
async function handleSignup() {
  if (!validateLoginForm()) {
    return;
  }

  const payload = {
    nickname: getNickname(),
    pin: pinInput.value,
  };

  loginButton.disabled = true;
  signupButton.disabled = true;
  signupButton.textContent = "登録中...";

  try {
    const response = await requestSignup(payload);
    const user = extractUserFromResponse(response);

    saveSession(user);
    showHomeScreen(user);
  } catch (error) {
    console.error(error);

    showFormMessage(
      error.message ||
        "登録中にエラーが発生しました。もう一度お試しください。",
    );
  } finally {
    loginButton.disabled = false;
    signupButton.disabled = false;
    signupButton.textContent = "入力した内容で新規登録";
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
    isHidden
      ? "暗証番号を隠す"
      : "暗証番号を表示する",
  );
}

/**
 * 暗証番号欄には数字だけを残します。
 */
function handlePinInput() {
  pinInput.value = normalizePin(pinInput.value);

  pinError.textContent = "";
  pinInput.classList.remove("input-error");
  clearFormMessage();
}

/**
 * ログアウトします。
 */
function handleLogout() {
  clearSession();
  showLoginScreen();
}

/**
 * 次工程で実装する画面への仮導線です。
 */
function handlePendingFeature(featureName) {
  showHomeMessage(
    `${featureName}は次のSTEPで実装します。`,
  );
}

/**
 * 初期表示を行います。
 */
function initializeApp() {
  const savedUser = loadSession();

  if (savedUser) {
    showHomeScreen(savedUser);
    return;
  }

  showLoginScreen();
}

loginForm.addEventListener("submit", handleLogin);
togglePinButton.addEventListener(
  "click",
  togglePinVisibility,
);
signupButton.addEventListener("click", handleSignup);
logoutButton.addEventListener("click", handleLogout);

eventListButton.addEventListener("click", () => {
  handlePendingFeature("イベント一覧");
});

createEventButton.addEventListener("click", () => {
  handlePendingFeature("イベント作成");
});

nicknameInput.addEventListener("input", () => {
  nicknameError.textContent = "";
  nicknameInput.classList.remove("input-error");
  clearFormMessage();
});

pinInput.addEventListener("input", handlePinInput);

initializeApp();
