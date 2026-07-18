"use strict";

const SESSION_STORAGE_KEY = "imajan.session";
const LOCAL_USERS_STORAGE_KEY = "imajan.localUsers";
const LOCAL_EVENTS_STORAGE_KEY = "imajan.localEvents";

const loginScreen = document.getElementById("login-screen");
const homeScreen = document.getElementById("home-screen");
const eventListScreen = document.getElementById("event-list-screen");
const eventCreateScreen = document.getElementById("event-create-screen");

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

const eventListBackButton = document.getElementById(
  "event-list-back-button",
);
const eventListCreateButton = document.getElementById(
  "event-list-create-button",
);
const emptyStateCreateButton = document.getElementById(
  "empty-state-create-button",
);

const activeEventsTab = document.getElementById("active-events-tab");
const completedEventsTab = document.getElementById(
  "completed-events-tab",
);
const activeEventCount = document.getElementById("active-event-count");
const completedEventCount = document.getElementById(
  "completed-event-count",
);
const eventListContainer = document.getElementById(
  "event-list-container",
);
const eventEmptyState = document.getElementById("event-empty-state");
const emptyStateTitle = document.getElementById("empty-state-title");
const emptyStateDescription = document.getElementById(
  "empty-state-description",
);

const eventCreateBackButton = document.getElementById(
  "event-create-back-button",
);
const eventCreateForm = document.getElementById("event-create-form");
const eventNameInput = document.getElementById("event-name");
const eventNameError = document.getElementById("event-name-error");
const umaPresetSelect = document.getElementById("uma-preset");
const eventCreateMessage = document.getElementById(
  "event-create-message",
);
const eventSaveButton = document.getElementById("event-save-button");

const rankScore1 = document.getElementById("rank-score-1");
const rankScore2 = document.getElementById("rank-score-2");
const rankScore3 = document.getElementById("rank-score-3");
const rankScore4 = document.getElementById("rank-score-4");
const rankScore4Wrap = document.getElementById(
  "rank-score-4-wrap",
);


let currentUser = null;
let currentEventStatus = "active";

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
 * すべての画面を非表示にします。
 */
function hideAllScreens() {
  loginScreen.hidden = true;
  homeScreen.hidden = true;
  eventListScreen.hidden = true;
  eventCreateScreen.hidden = true;
}

/**
 * ログイン画面を表示します。
 */
function showLoginScreen() {
  hideAllScreens();
  loginScreen.hidden = false;

  currentUser = null;
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
function showHomeScreen(user = currentUser) {
  if (!user) {
    showLoginScreen();
    return;
  }

  hideAllScreens();
  homeScreen.hidden = false;

  currentUser = user;
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
 * イベント一覧画面を表示します。
 */
function showEventListScreen() {
  if (!currentUser) {
    showLoginScreen();
    return;
  }

  hideAllScreens();
  eventListScreen.hidden = false;

  renderEventList();
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
 * ローカル確認用のイベント一覧を取得します。
 */
function getLocalEvents() {
  const savedEvents = localStorage.getItem(
    LOCAL_EVENTS_STORAGE_KEY,
  );

  if (!savedEvents) {
    return [];
  }

  try {
    return JSON.parse(savedEvents);
  } catch (error) {
    console.warn("ローカルイベントの読み込みに失敗しました。", error);
    return [];
  }
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
 * 日付を画面表示用に整形します。
 */
function formatDate(dateText) {
  if (!dateText) {
    return "日付未設定";
  }

  const date = new Date(dateText);

  if (Number.isNaN(date.getTime())) {
    return dateText;
  }

  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

/**
 * イベントカードを生成します。
 */
function createEventCard(event) {
  const button = document.createElement("button");
  button.className = "event-card";
  button.type = "button";

  const statusText =
    event.status === "completed" ? "終了" : "開催中";
  const statusClass =
    event.status === "completed"
      ? "event-status is-completed"
      : "event-status";

  const gameType =
    event.gameType === "sanma" ? "三麻" : "四麻";

  button.innerHTML = `
    <span class="event-card-main">
      <span class="${statusClass}">${statusText}</span>
      <h2 class="event-title"></h2>
      <span class="event-meta">
        <span>${gameType}</span>
        <span>${formatDate(event.updatedAt || event.createdAt)}</span>
        <span>${event.matchCount || 0}半荘</span>
      </span>
    </span>
    <span class="event-card-arrow" aria-hidden="true">›</span>
  `;

  button.querySelector(".event-title").textContent =
    event.name || "名称未設定のイベント";

  button.addEventListener("click", () => {
    window.alert(
      "イベント詳細画面は、イベント作成画面の後に実装します。",
    );
  });

  return button;
}

/**
 * イベント一覧を描画します。
 */
function renderEventList() {
  const events = getLocalEvents().filter(
    (event) => !event.ownerUserId || event.ownerUserId === currentUser.userId,
  );

  const activeEvents = events.filter(
    (event) => event.status !== "completed",
  );
  const completedEvents = events.filter(
    (event) => event.status === "completed",
  );

  activeEventCount.textContent = String(activeEvents.length);
  completedEventCount.textContent = String(
    completedEvents.length,
  );

  const filteredEvents =
    currentEventStatus === "completed"
      ? completedEvents
      : activeEvents;

  eventListContainer.replaceChildren();

  if (filteredEvents.length === 0) {
    eventEmptyState.hidden = false;

    if (currentEventStatus === "completed") {
      emptyStateTitle.textContent =
        "終了したイベントはありません";
      emptyStateDescription.textContent =
        "イベントを終了すると、ここに表示されます。";
      emptyStateCreateButton.hidden = true;
    } else {
      emptyStateTitle.textContent =
        "開催中のイベントはありません";
      emptyStateDescription.textContent =
        "新しいイベントを作成すると、ここに表示されます。";
      emptyStateCreateButton.hidden = false;
    }

    return;
  }

  eventEmptyState.hidden = true;

  filteredEvents
    .sort((a, b) => {
      const aDate = new Date(
        a.updatedAt || a.createdAt || 0,
      ).getTime();
      const bDate = new Date(
        b.updatedAt || b.createdAt || 0,
      ).getTime();

      return bDate - aDate;
    })
    .forEach((event) => {
      eventListContainer.appendChild(createEventCard(event));
    });
}

/**
 * イベント一覧の表示区分を切り替えます。
 */
function switchEventStatus(status) {
  currentEventStatus = status;

  const isActive = status === "active";

  activeEventsTab.classList.toggle("is-active", isActive);
  completedEventsTab.classList.toggle(
    "is-active",
    !isActive,
  );

  activeEventsTab.setAttribute(
    "aria-selected",
    String(isActive),
  );
  completedEventsTab.setAttribute(
    "aria-selected",
    String(!isActive),
  );

  renderEventList();
}


const UMA_PRESETS = {
  "10-30": {
    yonma: [50, 10, -10, -30],
    sanma: [40, 0, -40],
  },
  "10-20": {
    yonma: [40, 10, -10, -20],
    sanma: [30, 0, -30],
  },
  "5-10": {
    yonma: [25, 5, -5, -10],
    sanma: [20, 0, -20],
  },
  none: {
    yonma: [0, 0, 0, 0],
    sanma: [0, 0, 0],
  },
};

function getSelectedRadioValue(name) {
  const selected = document.querySelector(
    `input[name="${name}"]:checked`,
  );

  return selected ? selected.value : "";
}

function formatSignedScore(score) {
  return score > 0 ? `+${score}` : String(score);
}

function updateScorePreview() {
  const gameType = getSelectedRadioValue("gameType") || "yonma";
  const preset = umaPresetSelect.value || "10-30";
  const scores = UMA_PRESETS[preset][gameType];

  rankScore1.textContent = formatSignedScore(scores[0]);
  rankScore2.textContent = formatSignedScore(scores[1]);
  rankScore3.textContent = formatSignedScore(scores[2]);

  if (gameType === "sanma") {
    rankScore4Wrap.hidden = true;
  } else {
    rankScore4Wrap.hidden = false;
    rankScore4.textContent = formatSignedScore(scores[3]);
  }
}

function validateEventForm() {
  eventNameError.textContent = "";
  eventNameInput.classList.remove("input-error");
  eventCreateMessage.textContent = "";
  eventCreateMessage.className = "form-message";

  const name = eventNameInput.value.trim();

  if (!name) {
    eventNameError.textContent = "イベント名を入力してください。";
    eventNameInput.classList.add("input-error");
    return false;
  }

  if (name.length > 40) {
    eventNameError.textContent =
      "イベント名は40文字以内で入力してください。";
    eventNameInput.classList.add("input-error");
    return false;
  }

  return true;
}

function saveLocalEvent(event) {
  const events = getLocalEvents();
  events.push(event);

  localStorage.setItem(
    LOCAL_EVENTS_STORAGE_KEY,
    JSON.stringify(events),
  );
}

async function handleEventCreateSubmit(event) {
  event.preventDefault();

  if (!validateEventForm()) {
    return;
  }

  eventSaveButton.disabled = true;
  eventSaveButton.textContent = "作成中...";

  try {
    const now = new Date().toISOString();

    const newEvent = {
      eventId: `local-event-${Date.now()}`,
      ownerUserId: currentUser.userId,
      name: eventNameInput.value.trim(),
      eventType: getSelectedRadioValue("eventType"),
      gameType: getSelectedRadioValue("gameType"),
      umaPreset: umaPresetSelect.value,
      status: "active",
      matchCount: 0,
      createdAt: now,
      updatedAt: now,
    };

    saveLocalEvent(newEvent);

    currentEventStatus = "active";
    switchEventStatus("active");
    showEventListScreen();
  } catch (error) {
    console.error(error);

    eventCreateMessage.textContent =
      "イベントの作成中にエラーが発生しました。";
    eventCreateMessage.className =
      "form-message is-error";
  } finally {
    eventSaveButton.disabled = false;
    eventSaveButton.textContent = "イベントを作成";
  }
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
    signupButton.textContent =
      "入力した内容で新規登録";
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
 * 次工程で実装するイベント作成画面への仮導線です。
 */
function showEventCreateScreen() {
  if (!currentUser) {
    showLoginScreen();
    return;
  }

  hideAllScreens();
  eventCreateScreen.hidden = false;

  eventCreateForm.reset();
  eventNameError.textContent = "";
  eventNameInput.classList.remove("input-error");
  eventCreateMessage.textContent = "";
  eventCreateMessage.className = "form-message";

  updateScorePreview();
  window.setTimeout(() => eventNameInput.focus(), 0);
}

function handleCreateEvent() {
  showEventCreateScreen();
}

/**
 * 初期表示を行います。
 */
function initializeApp() {
  const savedUser = loadSession();

  if (savedUser) {
    currentUser = savedUser;
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

eventListButton.addEventListener(
  "click",
  showEventListScreen,
);
createEventButton.addEventListener(
  "click",
  handleCreateEvent,
);

eventListBackButton.addEventListener("click", () => {
  showHomeScreen();
});

eventListCreateButton.addEventListener(
  "click",
  handleCreateEvent,
);
emptyStateCreateButton.addEventListener(
  "click",
  handleCreateEvent,
);

activeEventsTab.addEventListener("click", () => {
  switchEventStatus("active");
});

completedEventsTab.addEventListener("click", () => {
  switchEventStatus("completed");
});

nicknameInput.addEventListener("input", () => {
  nicknameError.textContent = "";
  nicknameInput.classList.remove("input-error");
  clearFormMessage();
});

pinInput.addEventListener("input", handlePinInput);


eventCreateBackButton.addEventListener("click", () => {
  showEventListScreen();
});

eventCreateForm.addEventListener(
  "submit",
  handleEventCreateSubmit,
);

eventNameInput.addEventListener("input", () => {
  eventNameError.textContent = "";
  eventNameInput.classList.remove("input-error");
  eventCreateMessage.textContent = "";
  eventCreateMessage.className = "form-message";
});

umaPresetSelect.addEventListener("change", updateScorePreview);

document
  .querySelectorAll('input[name="gameType"]')
  .forEach((radio) => {
    radio.addEventListener("change", updateScorePreview);
  });

initializeApp();
