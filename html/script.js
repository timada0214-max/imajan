"use strict";

const SESSION_STORAGE_KEY = "imajan.session";
const LOCAL_USERS_STORAGE_KEY = "imajan.localUsers";
const LOCAL_EVENTS_STORAGE_KEY = "imajan.localEvents";
const LOCAL_PLAYERS_STORAGE_KEY = "imajan.localPlayers";
const LOCAL_MATCHES_STORAGE_KEY = "imajan.localMatches";
const LOCAL_ADJUSTMENTS_STORAGE_KEY = "imajan.localAdjustments";

const loginScreen = document.getElementById("login-screen");
const homeScreen = document.getElementById("home-screen");
const eventListScreen = document.getElementById("event-list-screen");
const eventCreateScreen = document.getElementById("event-create-screen");
const eventDetailScreen = document.getElementById("event-detail-screen");
const playerAddScreen = document.getElementById("player-add-screen");
const matchCreateScreen = document.getElementById("match-create-screen");
const adjustmentCreateScreen = document.getElementById(
  "adjustment-create-screen",
);

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

const eventDetailBackButton = document.getElementById(
  "event-detail-back-button",
);
const eventDetailTitle = document.getElementById(
  "event-detail-title",
);
const eventDetailCaption = document.getElementById(
  "event-detail-caption",
);
const eventSummaryName = document.getElementById(
  "event-summary-name",
);
const eventSummaryType = document.getElementById(
  "event-summary-type",
);
const eventSummaryGame = document.getElementById(
  "event-summary-game",
);
const eventSummaryUma = document.getElementById(
  "event-summary-uma",
);
const playerCountText = document.getElementById(
  "player-count-text",
);
const matchCountText = document.getElementById(
  "match-count-text",
);
const playerRankingList = document.getElementById(
  "player-ranking-list",
);
const playerEmptyState = document.getElementById(
  "player-empty-state",
);
const openPlayerAddButton = document.getElementById(
  "open-player-add-button",
);
const openMatchCreateButton = document.getElementById(
  "open-match-create-button",
);
const adjustmentCountText = document.getElementById(
  "adjustment-count-text",
);
const openAdjustmentCreateButton = document.getElementById(
  "open-adjustment-create-button",
);
const adjustmentHistoryList = document.getElementById(
  "adjustment-history-list",
);
const adjustmentEmptyState = document.getElementById(
  "adjustment-empty-state",
);

const playerAddBackButton = document.getElementById(
  "player-add-back-button",
);
const playerAddForm = document.getElementById("player-add-form");
const registeredPlayerSection = document.getElementById(
  "registered-player-section",
);
const registeredPlayerList = document.getElementById(
  "registered-player-list",
);
const frequentPlayerSection = document.getElementById(
  "frequent-player-section",
);
const frequentPlayerList = document.getElementById(
  "frequent-player-list",
);
const playerNameInput = document.getElementById("player-name");
const playerNameError = document.getElementById(
  "player-name-error",
);
const playerAddMessage = document.getElementById(
  "player-add-message",
);
const playerSaveButton = document.getElementById(
  "player-save-button",
);

const matchHistoryList = document.getElementById(
  "match-history-list",
);
const matchEmptyState = document.getElementById(
  "match-empty-state",
);
const matchCreateBackButton = document.getElementById(
  "match-create-back-button",
);
const matchCreateForm = document.getElementById(
  "match-create-form",
);
const matchCreateCaption = document.getElementById(
  "match-create-caption",
);
const matchRuleDescription = document.getElementById(
  "match-rule-description",
);
const matchEntryList = document.getElementById(
  "match-entry-list",
);
const matchMemberRestoreMessage = document.getElementById(
  "match-member-restore-message",
);
const enteredPointTotal = document.getElementById(
  "entered-point-total",
);
const requiredPointTotal = document.getElementById(
  "required-point-total",
);
const pointTotalDifference = document.getElementById(
  "point-total-difference",
);
const matchEntryError = document.getElementById(
  "match-entry-error",
);
const matchPreviewSection = document.getElementById(
  "match-preview-section",
);
const matchResultPreview = document.getElementById(
  "match-result-preview",
);
const matchCreateMessage = document.getElementById(
  "match-create-message",
);
const matchSaveButton = document.getElementById(
  "match-save-button",
);
const matchFormTitle = document.getElementById(
  "match-form-title",
);
const matchDeleteButton = document.getElementById(
  "match-delete-button",
);

const adjustmentCreateBackButton = document.getElementById(
  "adjustment-create-back-button",
);
const adjustmentCreateForm = document.getElementById(
  "adjustment-create-form",
);
const adjustmentFormTitle = document.getElementById(
  "adjustment-form-title",
);
const adjustmentTitleInput = document.getElementById(
  "adjustment-title",
);
const adjustmentEntryList = document.getElementById(
  "adjustment-entry-list",
);
const adjustmentTotal = document.getElementById(
  "adjustment-total",
);
const adjustmentTotalMessage = document.getElementById(
  "adjustment-total-message",
);
const adjustmentEntryError = document.getElementById(
  "adjustment-entry-error",
);
const adjustmentCreateMessage = document.getElementById(
  "adjustment-create-message",
);
const adjustmentSaveButton = document.getElementById(
  "adjustment-save-button",
);
const adjustmentDeleteButton = document.getElementById(
  "adjustment-delete-button",
);




let currentUser = null;
let currentEventStatus = "active";
let currentEvent = null;
let currentEditingMatch = null;
let currentEditingAdjustment = null;

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
  eventDetailScreen.hidden = true;
  playerAddScreen.hidden = true;
  matchCreateScreen.hidden = true;
  adjustmentCreateScreen.hidden = true;
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


function getLocalPlayers() {
  const savedPlayers = localStorage.getItem(
    LOCAL_PLAYERS_STORAGE_KEY,
  );

  if (!savedPlayers) {
    return [];
  }

  try {
    return JSON.parse(savedPlayers);
  } catch (error) {
    console.warn(
      "ローカルプレイヤーの読み込みに失敗しました。",
      error,
    );
    return [];
  }
}

function saveLocalPlayers(players) {
  localStorage.setItem(
    LOCAL_PLAYERS_STORAGE_KEY,
    JSON.stringify(players),
  );
}


function getLocalMatches() {
  const savedMatches = localStorage.getItem(
    LOCAL_MATCHES_STORAGE_KEY,
  );

  if (!savedMatches) {
    return [];
  }

  try {
    return JSON.parse(savedMatches);
  } catch (error) {
    console.warn(
      "ローカル半荘結果の読み込みに失敗しました。",
      error,
    );
    return [];
  }
}

function saveLocalMatches(matches) {
  localStorage.setItem(
    LOCAL_MATCHES_STORAGE_KEY,
    JSON.stringify(matches),
  );
}

function getLocalAdjustments() {
  const savedAdjustments = localStorage.getItem(
    LOCAL_ADJUSTMENTS_STORAGE_KEY,
  );

  if (!savedAdjustments) {
    return [];
  }

  try {
    return JSON.parse(savedAdjustments);
  } catch (error) {
    console.warn(
      "ローカルポイント増減の読み込みに失敗しました。",
      error,
    );
    return [];
  }
}

function saveLocalAdjustments(adjustments) {
  localStorage.setItem(
    LOCAL_ADJUSTMENTS_STORAGE_KEY,
    JSON.stringify(adjustments),
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
    showEventDetailScreen(event);
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



function showEventDetailScreen(event = currentEvent) {
  if (!event) {
    showEventListScreen();
    return;
  }

  currentEvent = event;

  hideAllScreens();
  eventDetailScreen.hidden = false;

  renderEventDetail();
}

function renderEventDetail() {
  if (!currentEvent) {
    return;
  }

  rebuildPlayerStatsForEvent(currentEvent.eventId);

  const players = getLocalPlayers()
    .filter((player) => player.eventId === currentEvent.eventId)
    .sort(comparePlayerStandings);

  const eventTypeText =
    currentEvent.eventType === "single"
      ? "当日対戦"
      : "リーグ戦";

  const gameTypeText =
    currentEvent.gameType === "sanma" ? "三麻" : "四麻";

  eventDetailTitle.textContent = currentEvent.name;
  eventDetailCaption.textContent =
    currentEvent.status === "completed" ? "終了" : "開催中";

  eventSummaryName.textContent = currentEvent.name;
  eventSummaryType.textContent = eventTypeText;
  eventSummaryGame.textContent = gameTypeText;
  eventSummaryUma.textContent =
    currentEvent.umaPreset === "none"
      ? "ウマ・オカなし"
      : currentEvent.umaPreset;

  playerCountText.textContent =
    `${players.length}人登録・合計スコア順`;

  const matches = getLocalMatches()
    .filter((match) => match.eventId === currentEvent.eventId)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime(),
    );

  matchCountText.textContent = `${matches.length}半荘`;

  const adjustments = getLocalAdjustments()
    .filter(
      (adjustment) =>
        adjustment.eventId === currentEvent.eventId,
    )
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime(),
    );

  adjustmentCountText.textContent = `${adjustments.length}件`;

  renderMatchHistory(matches);
  renderAdjustmentHistory(adjustments);
  renderPlayerStandings(players);
}

function comparePlayerStandings(a, b) {
  const scoreDifference =
    (b.totalScore || 0) - (a.totalScore || 0);

  if (scoreDifference !== 0) {
    return scoreDifference;
  }

  const aAverage =
    (a.matchCount || 0) > 0
      ? a.averageRank
      : Number.POSITIVE_INFINITY;
  const bAverage =
    (b.matchCount || 0) > 0
      ? b.averageRank
      : Number.POSITIVE_INFINITY;

  if (aAverage !== bAverage) {
    return aAverage - bAverage;
  }

  const firstPlaceDifference =
    (b.rankCounts?.[0] || 0) - (a.rankCounts?.[0] || 0);

  if (firstPlaceDifference !== 0) {
    return firstPlaceDifference;
  }

  return (
    new Date(a.createdAt).getTime() -
    new Date(b.createdAt).getTime()
  );
}

function rebuildPlayerStatsForEvent(eventId) {
  const players = getLocalPlayers();
  const eventPlayers = players.filter(
    (player) => player.eventId === eventId,
  );
  const matches = getLocalMatches().filter(
    (match) => match.eventId === eventId,
  );
  const adjustments = getLocalAdjustments().filter(
    (adjustment) => adjustment.eventId === eventId,
  );

  eventPlayers.forEach((player) => {
    const playerResults = matches.flatMap((match) =>
      match.results.filter(
        (result) => result.playerId === player.playerId,
      ),
    );

    const rankCounts = [0, 0, 0, 0];

    playerResults.forEach((result) => {
      const rankIndex = Number(result.rank) - 1;

      if (rankIndex >= 0 && rankIndex < rankCounts.length) {
        rankCounts[rankIndex] += 1;
      }
    });

    const totalRank = playerResults.reduce(
      (sum, result) => sum + Number(result.rank || 0),
      0,
    );
    const matchScore = playerResults.reduce(
      (sum, result) => sum + Number(result.finalScore || 0),
      0,
    );
    const adjustmentScore = adjustments.reduce(
      (sum, adjustment) => {
        const entry = adjustment.entries.find(
          (item) => item.playerId === player.playerId,
        );

        return sum + Number(entry?.points || 0);
      },
      0,
    );
    const totalScore = matchScore + adjustmentScore;

    player.matchCount = playerResults.length;
    player.rankCounts = rankCounts;
    player.averageRank =
      playerResults.length > 0
        ? Math.round(
            (totalRank / playerResults.length) * 100,
          ) / 100
        : 0;
    player.totalScore =
      Math.round(totalScore * 10) / 10;
  });

  saveLocalPlayers(players);
}

function formatAverageRank(player) {
  if (!(player.matchCount > 0)) {
    return "-";
  }

  return Number(player.averageRank).toFixed(2);
}

function renderPlayerStandings(players) {
  playerRankingList.replaceChildren();

  if (players.length === 0) {
    playerEmptyState.hidden = false;
    return;
  }

  playerEmptyState.hidden = true;

  const isSanma = currentEvent.gameType === "sanma";
  const table = document.createElement("div");
  table.className = isSanma
    ? "standings-table is-sanma"
    : "standings-table";

  const header = document.createElement("div");
  header.className = "standings-row standings-header";
  header.innerHTML = `
    <span>順位</span>
    <span>プレイヤー</span>
    <span>半荘</span>
    <span>1位</span>
    <span>2位</span>
    <span>3位</span>
    ${isSanma ? "" : "<span>4位</span>"}
    <span>平均順位</span>
    <span>合計</span>
  `;
  table.appendChild(header);

  players.forEach((player, index) => {
    const row = document.createElement("div");
    row.className = "standings-row";

    row.innerHTML = `
      <span class="standings-rank">${index + 1}</span>
      <span class="standings-player"></span>
      <span>${player.matchCount || 0}</span>
      <span>${player.rankCounts?.[0] || 0}</span>
      <span>${player.rankCounts?.[1] || 0}</span>
      <span>${player.rankCounts?.[2] || 0}</span>
      ${isSanma ? "" : `<span>${player.rankCounts?.[3] || 0}</span>`}
      <span>${formatAverageRank(player)}</span>
      <strong class="standings-score">${formatSignedScore(
        player.totalScore || 0,
      )}</strong>
    `;

    row.querySelector(".standings-player").textContent =
      player.name;

    table.appendChild(row);
  });

  playerRankingList.appendChild(table);
}

function renderMatchHistory(matches) {
  matchHistoryList.replaceChildren();

  if (matches.length === 0) {
    matchEmptyState.hidden = false;
    return;
  }

  matchEmptyState.hidden = true;

  matches.forEach((match, index) => {
    const card = document.createElement("article");
    card.className = "match-history-card";
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute(
      "aria-label",
      `第${matches.length - index}半荘を確認・編集`,
    );

    const playedAt = new Date(match.createdAt);
    const dateText = playedAt.toLocaleString("ja-JP", {
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    card.innerHTML = `
      <div class="match-history-header">
        <strong>第${matches.length - index}半荘</strong>
        <span>
          ${dateText}
          <span class="match-history-open">確認・編集 ›</span>
        </span>
      </div>
      <div class="match-history-results"></div>
    `;

    const resultList = card.querySelector(
      ".match-history-results",
    );

    match.results.forEach((result) => {
      const row = document.createElement("div");
      row.className = "match-history-result";

      row.innerHTML = `
        <span>${result.rank}位</span>
        <span class="match-history-player"></span>
        <span>${formatSignedScore(result.finalScore)}</span>
      `;

      row.querySelector(".match-history-player").textContent =
        result.playerName;

      resultList.appendChild(row);
    });

    const openMatch = () => {
      showMatchEditScreen(match);
    };

    card.addEventListener("click", openMatch);
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openMatch();
      }
    });

    matchHistoryList.appendChild(card);
  });
}


function renderAdjustmentHistory(adjustments) {
  adjustmentHistoryList.replaceChildren();

  if (adjustments.length === 0) {
    adjustmentEmptyState.hidden = false;
    return;
  }

  adjustmentEmptyState.hidden = true;

  adjustments.forEach((adjustment) => {
    const card = document.createElement("article");
    card.className = "adjustment-history-card";
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute(
      "aria-label",
      `${adjustment.title || "ポイント増減"}を確認・編集`,
    );

    const createdAt = new Date(adjustment.createdAt);
    const dateText = createdAt.toLocaleString("ja-JP", {
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    card.innerHTML = `
      <div class="adjustment-history-header">
        <strong class="adjustment-history-title"></strong>
        <span>
          ${dateText}
          <span class="adjustment-history-open">確認・編集 ›</span>
        </span>
      </div>
      <div class="adjustment-history-results"></div>
    `;

    card.querySelector(".adjustment-history-title").textContent =
      adjustment.title || "ポイント増減";

    const resultList = card.querySelector(
      ".adjustment-history-results",
    );

    adjustment.entries
      .filter((entry) => Number(entry.points) !== 0)
      .forEach((entry) => {
        const row = document.createElement("div");
        row.className = "adjustment-history-result";

        row.innerHTML = `
          <span class="adjustment-history-player"></span>
          <strong>${formatSignedScore(Number(entry.points))}</strong>
        `;

        row.querySelector(
          ".adjustment-history-player",
        ).textContent = entry.playerName;

        resultList.appendChild(row);
      });

    const openAdjustment = () => {
      showAdjustmentEditScreen(adjustment);
    };

    card.addEventListener("click", openAdjustment);
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openAdjustment();
      }
    });

    adjustmentHistoryList.appendChild(card);
  });
}

function renderAdjustmentEntryRows(existingEntries = []) {
  adjustmentEntryList.replaceChildren();

  const existingMap = new Map(
    existingEntries.map((entry) => [
      entry.playerId,
      Number(entry.points || 0),
    ]),
  );

  getEventPlayers().forEach((player) => {
    const row = document.createElement("div");
    row.className = "adjustment-entry-row";
    row.dataset.playerId = player.playerId;

    row.innerHTML = `
      <span class="adjustment-entry-player"></span>
      <input
        class="adjustment-point-input"
        type="number"
        inputmode="decimal"
        step="0.1"
        value="0"
        aria-label="${player.name}のポイント増減"
      />
    `;

    row.querySelector(".adjustment-entry-player").textContent =
      player.name;

    const input = row.querySelector(
      ".adjustment-point-input",
    );
    input.value = String(existingMap.get(player.playerId) || 0);
    input.addEventListener("input", updateAdjustmentTotal);

    adjustmentEntryList.appendChild(row);
  });
}

function readAdjustmentEntries() {
  const players = getEventPlayers();

  return Array.from(
    adjustmentEntryList.querySelectorAll(
      ".adjustment-entry-row",
    ),
  ).map((row) => {
    const playerId = row.dataset.playerId;
    const player = players.find(
      (item) => item.playerId === playerId,
    );
    const input = row.querySelector(
      ".adjustment-point-input",
    );
    const valueText = input.value.trim();

    return {
      playerId,
      playerName: player ? player.name : "",
      valueText,
      points: valueText === "" ? null : Number(valueText),
    };
  });
}

function roundScore(value) {
  return Math.round((value + Number.EPSILON) * 10) / 10;
}

function updateAdjustmentTotal() {
  const entries = readAdjustmentEntries();
  const total = roundScore(
    entries.reduce(
      (sum, entry) =>
        sum + (Number.isFinite(entry.points) ? entry.points : 0),
      0,
    ),
  );

  adjustmentTotal.textContent = formatSignedScore(total);
  adjustmentTotalMessage.className =
    "adjustment-total-message";

  if (Math.abs(total) < 0.0001) {
    adjustmentTotalMessage.textContent =
      "合計が一致しています";
    adjustmentTotalMessage.classList.add("is-matched");
  } else {
    adjustmentTotalMessage.textContent =
      `合計を0にしてください（現在${formatSignedScore(total)}）`;
    adjustmentTotalMessage.classList.add("is-unmatched");
  }

  adjustmentEntryError.textContent = "";
  adjustmentCreateMessage.textContent = "";
  adjustmentCreateMessage.className = "form-message";
}

function validateAdjustmentEntries(entries) {
  if (entries.length === 0) {
    return "先にプレイヤーを登録してください。";
  }

  if (
    entries.some(
      (entry) =>
        entry.points === null ||
        !Number.isFinite(entry.points),
    )
  ) {
    return "すべてのポイントを数字で入力してください。";
  }

  if (entries.every((entry) => entry.points === 0)) {
    return "1人以上のポイントを増減してください。";
  }

  const total = roundScore(
    entries.reduce(
      (sum, entry) => sum + entry.points,
      0,
    ),
  );

  if (Math.abs(total) >= 0.0001) {
    return "ポイント増減の合計を0にしてください。";
  }

  return "";
}

function prepareAdjustmentForm({ adjustment = null } = {}) {
  const players = getEventPlayers();

  adjustmentCreateForm.reset();
  adjustmentEntryError.textContent = "";
  adjustmentCreateMessage.textContent = "";
  adjustmentCreateMessage.className = "form-message";

  adjustmentFormTitle.textContent = adjustment
    ? "ポイント増減編集"
    : "ポイント増減登録";
  adjustmentSaveButton.textContent = adjustment
    ? "変更を保存"
    : "ポイント増減を保存";
  adjustmentDeleteButton.hidden = !adjustment;
  adjustmentDeleteButton.textContent =
    "このポイント増減を削除";

  adjustmentTitleInput.value = adjustment?.title || "";
  renderAdjustmentEntryRows(adjustment?.entries || []);
  updateAdjustmentTotal();

  adjustmentSaveButton.disabled = players.length === 0;

  window.setTimeout(() => {
    if (players.length > 0) {
      const firstInput = adjustmentEntryList.querySelector(
        ".adjustment-point-input",
      );
      firstInput?.focus();
      firstInput?.select();
    }
  }, 0);
}

function showAdjustmentCreateScreen() {
  if (!currentEvent) {
    showEventListScreen();
    return;
  }

  currentEditingAdjustment = null;
  hideAllScreens();
  adjustmentCreateScreen.hidden = false;
  prepareAdjustmentForm();
}

function showAdjustmentEditScreen(adjustment) {
  if (!currentEvent) {
    showEventListScreen();
    return;
  }

  currentEditingAdjustment = adjustment;
  hideAllScreens();
  adjustmentCreateScreen.hidden = false;
  prepareAdjustmentForm({ adjustment });
}

function handleAdjustmentSubmit(event) {
  event.preventDefault();

  const entries = readAdjustmentEntries();
  const errorMessage = validateAdjustmentEntries(entries);

  if (errorMessage) {
    adjustmentEntryError.textContent = errorMessage;
    return;
  }

  const isEditing = Boolean(currentEditingAdjustment);

  adjustmentSaveButton.disabled = true;
  adjustmentDeleteButton.disabled = true;
  adjustmentSaveButton.textContent = "保存中...";

  try {
    const adjustments = getLocalAdjustments();
    const now = new Date().toISOString();
    const normalizedEntries = entries.map((entry) => ({
      playerId: entry.playerId,
      playerName: entry.playerName,
      points: roundScore(entry.points),
    }));

    if (currentEditingAdjustment) {
      const targetIndex = adjustments.findIndex(
        (adjustment) =>
          adjustment.adjustmentId ===
          currentEditingAdjustment.adjustmentId,
      );

      if (targetIndex < 0) {
        throw new Error(
          "編集対象のポイント増減が見つかりません。",
        );
      }

      adjustments[targetIndex] = {
        ...adjustments[targetIndex],
        title: adjustmentTitleInput.value.trim(),
        entries: normalizedEntries,
        updatedAt: now,
      };
    } else {
      adjustments.push({
        adjustmentId: `local-adjustment-${Date.now()}`,
        eventId: currentEvent.eventId,
        title: adjustmentTitleInput.value.trim(),
        entries: normalizedEntries,
        createdAt: now,
        updatedAt: now,
      });
    }

    saveLocalAdjustments(adjustments);
    rebuildPlayerStatsForEvent(currentEvent.eventId);
    currentEditingAdjustment = null;
    showEventDetailScreen();
  } catch (error) {
    console.error(error);

    adjustmentCreateMessage.textContent =
      error instanceof Error
        ? error.message
        : "ポイント増減の保存中にエラーが発生しました。";
    adjustmentCreateMessage.className =
      "form-message is-error";
  } finally {
    adjustmentSaveButton.disabled = false;
    adjustmentDeleteButton.disabled = false;
    adjustmentSaveButton.textContent = isEditing
      ? "変更を保存"
      : "ポイント増減を保存";
  }
}

function handleAdjustmentDelete() {
  if (!currentEditingAdjustment) {
    return;
  }

  const confirmed = window.confirm(
    "このポイント増減を削除しますか？\n削除すると、総合ポイントも再集計されます。",
  );

  if (!confirmed) {
    return;
  }

  adjustmentSaveButton.disabled = true;
  adjustmentDeleteButton.disabled = true;
  adjustmentDeleteButton.textContent = "削除中...";

  try {
    const adjustments = getLocalAdjustments().filter(
      (adjustment) =>
        adjustment.adjustmentId !==
        currentEditingAdjustment.adjustmentId,
    );

    saveLocalAdjustments(adjustments);
    rebuildPlayerStatsForEvent(currentEvent.eventId);
    currentEditingAdjustment = null;
    showEventDetailScreen();
  } catch (error) {
    console.error(error);

    adjustmentCreateMessage.textContent =
      "ポイント増減の削除中にエラーが発生しました。";
    adjustmentCreateMessage.className =
      "form-message is-error";
  } finally {
    adjustmentSaveButton.disabled = false;
    adjustmentDeleteButton.disabled = false;
    adjustmentDeleteButton.textContent =
      "このポイント増減を削除";
  }
}

function getMatchRule() {
  if (currentEvent.gameType === "sanma") {
    return {
      playerCount: 3,
      requiredPointTotal: 105000,
      returnPoint: 35000,
    };
  }

  return {
    playerCount: 4,
    requiredPointTotal: 100000,
    returnPoint: 30000,
  };
}

function getEventPlayers() {
  return getLocalPlayers().filter(
    (player) => player.eventId === currentEvent.eventId,
  );
}

function getLatestEventMatch() {
  if (!currentEvent) {
    return null;
  }

  return getLocalMatches()
    .filter(
      (match) => match.eventId === currentEvent.eventId,
    )
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime(),
    )[0] || null;
}

function getQuickEntryPlayerIds(players, playerCount) {
  const latestMatch = getLatestEventMatch();

  if (latestMatch) {
    const savedOrder = Array.isArray(
      latestMatch.entryOrderPlayerIds,
    )
      ? latestMatch.entryOrderPlayerIds
      : latestMatch.results
          .slice()
          .sort(
            (a, b) =>
              Number(a.rank) - Number(b.rank),
          )
          .map((result) => result.playerId);

    const validPlayerIds = savedOrder.filter((playerId) =>
      players.some(
        (player) => player.playerId === playerId,
      ),
    );

    if (validPlayerIds.length === playerCount) {
      return {
        playerIds: validPlayerIds,
        source: "latest-match",
      };
    }
  }

  if (players.length === playerCount) {
    return {
      playerIds: players.map((player) => player.playerId),
      source: "all-players",
    };
  }

  return {
    playerIds: [],
    source: "",
  };
}

function updatePlayerSelectAvailability() {
  const selects = Array.from(
    matchEntryList.querySelectorAll(
      ".match-player-select",
    ),
  );
  const selectedValues = selects
    .map((select) => select.value)
    .filter(Boolean);

  selects.forEach((select) => {
    Array.from(select.options).forEach((option) => {
      if (!option.value) {
        return;
      }

      option.disabled =
        option.value !== select.value &&
        selectedValues.includes(option.value);
    });
  });
}

function focusFirstMatchPointInput() {
  const firstPointInput = matchEntryList.querySelector(
    ".match-point-input",
  );

  if (firstPointInput) {
    window.setTimeout(() => firstPointInput.focus(), 0);
  }
}

function prepareMatchForm({ match = null } = {}) {
  if (!currentEvent) {
    showEventListScreen();
    return;
  }

  const players = getEventPlayers();
  const rule = getMatchRule();

  if (!match && players.length < rule.playerCount) {
    window.alert(
      `${rule.playerCount}人以上のプレイヤーを登録してください。`,
    );
    return;
  }

  currentEditingMatch = match;

  hideAllScreens();
  matchCreateScreen.hidden = false;

  matchCreateForm.reset();
  matchEntryError.textContent = "";
  matchCreateMessage.textContent = "";
  matchCreateMessage.className = "form-message";
  matchPreviewSection.hidden = true;

  matchFormTitle.textContent = match
    ? "半荘結果編集"
    : "半荘結果登録";
  matchSaveButton.textContent = match
    ? "変更を保存"
    : "半荘結果を保存";
  matchDeleteButton.hidden = !match;

  matchCreateCaption.textContent =
    currentEvent.gameType === "sanma"
      ? "3人の参加者と最終持ち点を入力"
      : "4人の参加者と最終持ち点を入力";

  matchRuleDescription.textContent =
    `${rule.playerCount}人のプレイヤーを選び、` +
    `合計${rule.requiredPointTotal.toLocaleString("ja-JP")}点になるよう入力してください。`;

  requiredPointTotal.textContent =
    `${rule.requiredPointTotal.toLocaleString("ja-JP")}点`;

  let initialResults = match ? match.results : [];
  let initialPlayerIds = [];
  let restoreSource = "";

  if (!match) {
    const quickEntry = getQuickEntryPlayerIds(
      players,
      rule.playerCount,
    );
    initialPlayerIds = quickEntry.playerIds;
    restoreSource = quickEntry.source;
  }

  renderMatchEntryRows(
    players,
    rule.playerCount,
    initialResults,
    initialPlayerIds,
    match ? match.entryOrderPlayerIds : [],
  );

  matchMemberRestoreMessage.hidden = true;
  matchMemberRestoreMessage.textContent = "";

  if (restoreSource === "latest-match") {
    matchMemberRestoreMessage.textContent =
      "前回の対戦メンバーをセットしました。持ち点から入力できます。";
    matchMemberRestoreMessage.hidden = false;
  } else if (restoreSource === "all-players") {
    matchMemberRestoreMessage.textContent =
      "登録プレイヤー全員をセットしました。持ち点から入力できます。";
    matchMemberRestoreMessage.hidden = false;
  }

  updatePlayerSelectAvailability();
  updateMatchPointAssist();

  if (!match && initialPlayerIds.length > 0) {
    focusFirstMatchPointInput();
  }
}

function showMatchCreateScreen() {
  currentEditingMatch = null;
  prepareMatchForm();
}

function showMatchEditScreen(match) {
  prepareMatchForm({ match });
}

function renderMatchEntryRows(
  players,
  playerCount,
  existingResults = [],
  initialPlayerIds = [],
  savedEntryOrderPlayerIds = [],
) {
  matchEntryList.replaceChildren();

  const resultMap = new Map(
    existingResults.map((result) => [
      result.playerId,
      result,
    ]),
  );

  const resultPlayerIds = existingResults
    .slice()
    .sort(
      (a, b) =>
        Number(a.rank) - Number(b.rank),
    )
    .map((result) => result.playerId);

  const orderedPlayerIds =
    savedEntryOrderPlayerIds.length === playerCount
      ? savedEntryOrderPlayerIds
      : resultPlayerIds;

  for (let index = 0; index < playerCount; index += 1) {
    const row = document.createElement("div");
    row.className = "match-entry-row";

    const playerOptions = players
      .map(
        (player) =>
          `<option value="${player.playerId}"></option>`,
      )
      .join("");

    row.innerHTML = `
      <span class="match-entry-number">${index + 1}</span>
      <div class="match-entry-fields">
        <label>
          プレイヤー
          <select class="match-player-select">
            <option value="">選択してください</option>
            ${playerOptions}
          </select>
        </label>
        <label>
          最終持ち点
          <input
            class="match-point-input"
            type="number"
            inputmode="numeric"
            step="100"
            placeholder="例：42000"
          />
          <small class="auto-calculated-note" hidden>
            残り点数を自動入力
          </small>
        </label>
      </div>
    `;

    const select = row.querySelector(
      ".match-player-select",
    );
    const pointInput = row.querySelector(
      ".match-point-input",
    );

    Array.from(select.options).forEach((option) => {
      if (!option.value) {
        return;
      }

      const player = players.find(
        (item) => item.playerId === option.value,
      );
      option.textContent = player ? player.name : "";
    });

    const selectedPlayerId =
      orderedPlayerIds[index] ||
      initialPlayerIds[index] ||
      "";

    if (selectedPlayerId) {
      select.value = selectedPlayerId;
    }

    const existingResult = resultMap.get(selectedPlayerId);

    if (existingResult) {
      pointInput.value = String(existingResult.points);
    }

    select.addEventListener("change", () => {
      updatePlayerSelectAvailability();
      updateMatchPointAssist();
    });
    pointInput.addEventListener("input", () => {
      if (pointInput.dataset.autoCalculated === "true") {
        clearAutoCalculatedPoint(pointInput);
      }

      updateMatchPointAssist();
    });
    pointInput.addEventListener("keydown", (event) => {
      if (event.key !== "Enter") {
        return;
      }

      event.preventDefault();

      const pointInputs = Array.from(
        matchEntryList.querySelectorAll(
          ".match-point-input",
        ),
      );
      const currentIndex = pointInputs.indexOf(pointInput);
      const nextInput = pointInputs[currentIndex + 1];

      if (nextInput) {
        nextInput.focus();
        nextInput.select();
      } else {
        matchSaveButton.focus();
      }
    });

    matchEntryList.appendChild(row);
  }
}

function getMatchPointInputs() {
  return Array.from(
    matchEntryList.querySelectorAll(".match-point-input"),
  );
}

function setAutoCalculatedPoint(input, points) {
  input.value = String(points);
  input.dataset.autoCalculated = "true";
  input.classList.add("is-auto-calculated");

  const note = input
    .closest("label")
    ?.querySelector(".auto-calculated-note");

  if (note) {
    note.hidden = false;
  }
}

function clearAutoCalculatedPoint(input, { clearValue = false } = {}) {
  delete input.dataset.autoCalculated;
  input.classList.remove("is-auto-calculated");

  if (clearValue) {
    input.value = "";
  }

  const note = input
    .closest("label")
    ?.querySelector(".auto-calculated-note");

  if (note) {
    note.hidden = true;
  }
}

function applyLastPointAutoCalculation() {
  const rule = getMatchRule();
  const inputs = getMatchPointInputs();
  const currentAutoInput = inputs.find(
    (input) => input.dataset.autoCalculated === "true",
  );

  if (currentAutoInput) {
    const otherValues = inputs
      .filter((input) => input !== currentAutoInput)
      .map((input) => input.value.trim());

    const canRecalculate = otherValues.every(
      (value) =>
        value !== "" &&
        Number.isFinite(Number(value)) &&
        Number.isInteger(Number(value)),
    );

    if (!canRecalculate) {
      clearAutoCalculatedPoint(currentAutoInput, {
        clearValue: true,
      });
      return;
    }

    const otherTotal = otherValues.reduce(
      (sum, value) => sum + Number(value),
      0,
    );
    const remaining = rule.requiredPointTotal - otherTotal;

    if (remaining < 0) {
      clearAutoCalculatedPoint(currentAutoInput, {
        clearValue: true,
      });
      return;
    }

    setAutoCalculatedPoint(currentAutoInput, remaining);
    return;
  }

  const blankInputs = inputs.filter(
    (input) => input.value.trim() === "",
  );

  if (blankInputs.length !== 1) {
    return;
  }

  const filledInputs = inputs.filter(
    (input) => input.value.trim() !== "",
  );
  const allFilledValuesAreValid = filledInputs.every(
    (input) =>
      Number.isFinite(Number(input.value)) &&
      Number.isInteger(Number(input.value)),
  );

  if (!allFilledValuesAreValid) {
    return;
  }

  const filledTotal = filledInputs.reduce(
    (sum, input) => sum + Number(input.value),
    0,
  );
  const remaining = rule.requiredPointTotal - filledTotal;

  if (remaining < 0) {
    return;
  }

  setAutoCalculatedPoint(blankInputs[0], remaining);
}

function updatePointTotalDifference(total) {
  const rule = getMatchRule();
  const difference = rule.requiredPointTotal - total;

  pointTotalDifference.className = "point-total-difference";

  if (difference > 0) {
    pointTotalDifference.textContent =
      `あと${difference.toLocaleString("ja-JP")}点`;
    pointTotalDifference.classList.add("is-short");
    return;
  }

  if (difference < 0) {
    pointTotalDifference.textContent =
      `${Math.abs(difference).toLocaleString("ja-JP")}点多いです`;
    pointTotalDifference.classList.add("is-over");
    return;
  }

  pointTotalDifference.textContent =
    "合計が一致しています";
  pointTotalDifference.classList.add("is-matched");
}

function updateMatchPointAssist() {
  applyLastPointAutoCalculation();
  updateMatchPreview();
}

function readMatchEntries() {
  return Array.from(
    matchEntryList.querySelectorAll(".match-entry-row"),
  ).map((row) => {
    const playerId = row.querySelector(
      ".match-player-select",
    ).value;
    const pointText = row.querySelector(
      ".match-point-input",
    ).value.trim();

    return {
      playerId,
      pointText,
      points: pointText === "" ? null : Number(pointText),
    };
  });
}

function calculateMatchResults(entries) {
  const players = getEventPlayers();
  const rule = getMatchRule();
  const rankPoints =
    UMA_PRESETS[currentEvent.umaPreset][currentEvent.gameType];

  return entries
    .map((entry) => {
      const player = players.find(
        (item) => item.playerId === entry.playerId,
      );

      return {
        playerId: entry.playerId,
        playerName: player ? player.name : "",
        points: entry.points,
      };
    })
    .sort((a, b) => b.points - a.points)
    .map((result, index) => ({
      ...result,
      rank: index + 1,
      rankPoint: rankPoints[index],
      finalScore:
        (result.points - rule.returnPoint) / 1000 +
        rankPoints[index],
    }));
}

function validateMatchEntries(entries) {
  const rule = getMatchRule();
  const selectedPlayerIds = entries
    .map((entry) => entry.playerId)
    .filter(Boolean);

  if (selectedPlayerIds.length !== rule.playerCount) {
    return "すべてのプレイヤーを選択してください。";
  }

  if (new Set(selectedPlayerIds).size !== rule.playerCount) {
    return "同じプレイヤーを重複して選択できません。";
  }

  if (
    entries.some(
      (entry) =>
        entry.points === null ||
        !Number.isFinite(entry.points) ||
        !Number.isInteger(entry.points),
    )
  ) {
    return "すべての最終持ち点を整数で入力してください。";
  }

  const total = entries.reduce(
    (sum, entry) => sum + entry.points,
    0,
  );

  if (total !== rule.requiredPointTotal) {
    return (
      `持ち点の合計を` +
      `${rule.requiredPointTotal.toLocaleString("ja-JP")}点にしてください。`
    );
  }

  if (
    new Set(entries.map((entry) => entry.points)).size !==
    rule.playerCount
  ) {
    return "同点時の順位処理は未対応です。異なる持ち点を入力してください。";
  }

  return "";
}

function updateMatchPreview() {
  const entries = readMatchEntries();
  const total = entries.reduce(
    (sum, entry) =>
      sum + (Number.isFinite(entry.points) ? entry.points : 0),
    0,
  );

  enteredPointTotal.textContent =
    `${total.toLocaleString("ja-JP")}点`;
  updatePointTotalDifference(total);

  matchEntryError.textContent = "";
  matchCreateMessage.textContent = "";
  matchCreateMessage.className = "form-message";
  matchResultPreview.replaceChildren();

  const errorMessage = validateMatchEntries(entries);

  if (errorMessage) {
    matchPreviewSection.hidden = true;
    return;
  }

  const results = calculateMatchResults(entries);
  matchPreviewSection.hidden = false;

  results.forEach((result) => {
    const row = document.createElement("div");
    row.className = "match-result-row";

    row.innerHTML = `
      <span class="match-result-rank">${result.rank}位</span>
      <span class="match-result-player"></span>
      <span class="match-result-values">
        <small>${result.points.toLocaleString("ja-JP")}点</small>
        <strong>${formatSignedScore(result.finalScore)}</strong>
      </span>
    `;

    row.querySelector(".match-result-player").textContent =
      result.playerName;

    matchResultPreview.appendChild(row);
  });
}

function updatePlayersFromMatch() {
  if (!currentEvent) {
    return;
  }

  rebuildPlayerStatsForEvent(currentEvent.eventId);
}

function syncEventMatchCount() {
  const events = getLocalEvents();
  const event = events.find(
    (item) => item.eventId === currentEvent.eventId,
  );

  if (!event) {
    return;
  }

  const matchCount = getLocalMatches().filter(
    (match) => match.eventId === currentEvent.eventId,
  ).length;

  event.matchCount = matchCount;
  event.updatedAt = new Date().toISOString();
  currentEvent = event;

  localStorage.setItem(
    LOCAL_EVENTS_STORAGE_KEY,
    JSON.stringify(events),
  );
}

function handleMatchCreateSubmit(event) {
  event.preventDefault();

  const entries = readMatchEntries();
  const errorMessage = validateMatchEntries(entries);

  if (errorMessage) {
    matchEntryError.textContent = errorMessage;
    matchPreviewSection.hidden = true;
    return;
  }

  const isEditing = Boolean(currentEditingMatch);

  matchSaveButton.disabled = true;
  matchDeleteButton.disabled = true;
  matchSaveButton.textContent = "保存中...";

  try {
    const results = calculateMatchResults(entries);
    const matches = getLocalMatches();
    const now = new Date().toISOString();

    if (currentEditingMatch) {
      const targetIndex = matches.findIndex(
        (match) =>
          match.matchId === currentEditingMatch.matchId,
      );

      if (targetIndex < 0) {
        throw new Error("編集対象の半荘が見つかりません。");
      }

      matches[targetIndex] = {
        ...matches[targetIndex],
        gameType: currentEvent.gameType,
        umaPreset: currentEvent.umaPreset,
        entryOrderPlayerIds: entries.map(
          (entry) => entry.playerId,
        ),
        results,
        updatedAt: now,
      };
    } else {
      matches.push({
        matchId: `local-match-${Date.now()}`,
        eventId: currentEvent.eventId,
        gameType: currentEvent.gameType,
        umaPreset: currentEvent.umaPreset,
        entryOrderPlayerIds: entries.map(
          (entry) => entry.playerId,
        ),
        results,
        createdAt: now,
        updatedAt: now,
      });
    }

    saveLocalMatches(matches);
    updatePlayersFromMatch();
    syncEventMatchCount();
    currentEditingMatch = null;
    showEventDetailScreen();
  } catch (error) {
    console.error(error);

    matchCreateMessage.textContent =
      error instanceof Error
        ? error.message
        : "半荘結果の保存中にエラーが発生しました。";
    matchCreateMessage.className =
      "form-message is-error";
  } finally {
    matchSaveButton.disabled = false;
    matchDeleteButton.disabled = false;
    matchSaveButton.textContent = isEditing
      ? "変更を保存"
      : "半荘結果を保存";
  }
}

function handleMatchDelete() {
  if (!currentEditingMatch) {
    return;
  }

  const confirmed = window.confirm(
    "この半荘結果を削除しますか？\n削除すると、参加プレイヤーの成績も再集計されます。",
  );

  if (!confirmed) {
    return;
  }

  matchSaveButton.disabled = true;
  matchDeleteButton.disabled = true;
  matchDeleteButton.textContent = "削除中...";

  try {
    const matches = getLocalMatches().filter(
      (match) =>
        match.matchId !== currentEditingMatch.matchId,
    );

    saveLocalMatches(matches);
    updatePlayersFromMatch();
    syncEventMatchCount();
    currentEditingMatch = null;
    showEventDetailScreen();
  } catch (error) {
    console.error(error);

    matchCreateMessage.textContent =
      "半荘結果の削除中にエラーが発生しました。";
    matchCreateMessage.className =
      "form-message is-error";
  } finally {
    matchSaveButton.disabled = false;
    matchDeleteButton.disabled = false;
    matchDeleteButton.textContent = "この半荘を削除";
  }
}

function normalizePlayerName(name) {
  return name.trim().toLocaleLowerCase("ja-JP");
}

function getFrequentPlayerCandidates(limit = 12) {
  if (!currentEvent) {
    return [];
  }

  const currentEventNames = new Set(
    getLocalPlayers()
      .filter(
        (player) =>
          player.eventId === currentEvent.eventId,
      )
      .map((player) => normalizePlayerName(player.name)),
  );

  const candidateMap = new Map();

  getLocalPlayers().forEach((player) => {
    const normalizedName = normalizePlayerName(player.name);

    if (
      !normalizedName ||
      currentEventNames.has(normalizedName)
    ) {
      return;
    }

    const existing = candidateMap.get(normalizedName);

    if (existing) {
      existing.useCount += 1;

      if (
        new Date(player.updatedAt || player.createdAt || 0) >
        new Date(existing.lastUsedAt || 0)
      ) {
        existing.name = player.name;
        existing.lastUsedAt =
          player.updatedAt || player.createdAt || "";
      }

      return;
    }

    candidateMap.set(normalizedName, {
      name: player.name,
      normalizedName,
      useCount: 1,
      lastUsedAt:
        player.updatedAt || player.createdAt || "",
    });
  });

  return Array.from(candidateMap.values())
    .sort((a, b) => {
      if (b.useCount !== a.useCount) {
        return b.useCount - a.useCount;
      }

      return (
        new Date(b.lastUsedAt || 0).getTime() -
        new Date(a.lastUsedAt || 0).getTime()
      );
    })
    .slice(0, limit);
}

function createLocalPlayer(name) {
  const players = getLocalPlayers();
  const normalizedName = normalizePlayerName(name);
  const duplicatedPlayer = players.find(
    (player) =>
      player.eventId === currentEvent.eventId &&
      normalizePlayerName(player.name) === normalizedName,
  );

  if (duplicatedPlayer) {
    throw new Error(
      "同じ名前のプレイヤーが既に登録されています。",
    );
  }

  const now = new Date().toISOString();

  players.push({
    playerId: `local-player-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}`,
    eventId: currentEvent.eventId,
    name: name.trim(),
    matchCount: 0,
    rankCounts: [0, 0, 0, 0],
    averageRank: 0,
    totalScore: 0,
    createdAt: now,
    updatedAt: now,
  });

  saveLocalPlayers(players);
}

function renderRegisteredPlayers() {
  const players = getEventPlayers();

  registeredPlayerList.replaceChildren();
  registeredPlayerSection.hidden = players.length === 0;

  players.forEach((player) => {
    const chip = document.createElement("span");
    chip.className = "registered-player-chip";
    chip.textContent = player.name;
    registeredPlayerList.appendChild(chip);
  });
}

function renderFrequentPlayerCandidates() {
  const candidates = getFrequentPlayerCandidates();

  frequentPlayerList.replaceChildren();
  frequentPlayerSection.hidden = candidates.length === 0;

  candidates.forEach((candidate) => {
    const button = document.createElement("button");

    button.type = "button";
    button.className = "frequent-player-button";
    button.textContent = candidate.name;
    button.setAttribute(
      "aria-label",
      `${candidate.name}をイベントへ追加`,
    );

    button.addEventListener("click", () => {
      handleFrequentPlayerAdd(candidate.name, button);
    });

    frequentPlayerList.appendChild(button);
  });
}

function handleFrequentPlayerAdd(name, button) {
  if (!currentEvent || button.disabled) {
    return;
  }

  button.disabled = true;
  button.classList.add("is-adding");
  button.textContent = "追加中...";

  playerAddMessage.textContent = "";
  playerAddMessage.className = "form-message";

  try {
    createLocalPlayer(name);

    button.classList.remove("is-adding");
    button.classList.add("is-added");
    button.textContent = `✓ ${name}`;

    playerAddMessage.textContent =
      `${name}を追加しました。続けて別のプレイヤーも追加できます。`;
    playerAddMessage.className =
      "form-message is-success";

    renderRegisteredPlayers();
    renderFrequentPlayerCandidates();
  } catch (error) {
    console.error(error);

    button.disabled = false;
    button.classList.remove("is-adding");
    button.textContent = name;

    playerAddMessage.textContent =
      error instanceof Error
        ? error.message
        : "プレイヤーの追加中にエラーが発生しました。";
    playerAddMessage.className =
      "form-message is-error";
  }
}

function showPlayerAddScreen() {
  if (!currentEvent) {
    showEventListScreen();
    return;
  }

  hideAllScreens();
  playerAddScreen.hidden = false;

  playerAddForm.reset();
  playerNameError.textContent = "";
  playerNameInput.classList.remove("input-error");
  playerAddMessage.textContent = "";
  playerAddMessage.className = "form-message";

  renderRegisteredPlayers();
  renderFrequentPlayerCandidates();

  window.setTimeout(() => {
    if (frequentPlayerSection.hidden) {
      playerNameInput.focus();
    }
  }, 0);
}

function validatePlayerForm() {
  playerNameError.textContent = "";
  playerNameInput.classList.remove("input-error");
  playerAddMessage.textContent = "";
  playerAddMessage.className = "form-message";

  const name = playerNameInput.value.trim();

  if (!name) {
    playerNameError.textContent =
      "プレイヤー名を入力してください。";
    playerNameInput.classList.add("input-error");
    return false;
  }

  if (name.length > 20) {
    playerNameError.textContent =
      "プレイヤー名は20文字以内で入力してください。";
    playerNameInput.classList.add("input-error");
    return false;
  }

  const normalizedName = normalizePlayerName(name);
  const duplicatedPlayer = getLocalPlayers().find(
    (player) =>
      player.eventId === currentEvent.eventId &&
      normalizePlayerName(player.name) === normalizedName,
  );

  if (duplicatedPlayer) {
    playerNameError.textContent =
      "同じ名前のプレイヤーが既に登録されています。";
    playerNameInput.classList.add("input-error");
    return false;
  }

  return true;
}

function handlePlayerAddSubmit(event) {
  event.preventDefault();

  if (!validatePlayerForm()) {
    return;
  }

  playerSaveButton.disabled = true;
  playerSaveButton.textContent = "追加中...";

  try {
    createLocalPlayer(playerNameInput.value.trim());
    showEventDetailScreen();
  } catch (error) {
    console.error(error);

    playerAddMessage.textContent =
      "プレイヤーの追加中にエラーが発生しました。";
    playerAddMessage.className =
      "form-message is-error";
  } finally {
    playerSaveButton.disabled = false;
    playerSaveButton.textContent = "プレイヤーを追加";
  }
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


eventDetailBackButton.addEventListener("click", () => {
  showEventListScreen();
});

openPlayerAddButton.addEventListener(
  "click",
  showPlayerAddScreen,
);

openMatchCreateButton.addEventListener(
  "click",
  showMatchCreateScreen,
);

openAdjustmentCreateButton.addEventListener(
  "click",
  showAdjustmentCreateScreen,
);



matchCreateBackButton.addEventListener("click", () => {
  currentEditingMatch = null;
  showEventDetailScreen();
});

matchCreateForm.addEventListener(
  "submit",
  handleMatchCreateSubmit,
);

matchDeleteButton.addEventListener(
  "click",
  handleMatchDelete,
);

adjustmentCreateBackButton.addEventListener("click", () => {
  currentEditingAdjustment = null;
  showEventDetailScreen();
});

adjustmentCreateForm.addEventListener(
  "submit",
  handleAdjustmentSubmit,
);

adjustmentDeleteButton.addEventListener(
  "click",
  handleAdjustmentDelete,
);

playerAddBackButton.addEventListener("click", () => {
  showEventDetailScreen();
});

playerAddForm.addEventListener(
  "submit",
  handlePlayerAddSubmit,
);

playerNameInput.addEventListener("input", () => {
  playerNameError.textContent = "";
  playerNameInput.classList.remove("input-error");
  playerAddMessage.textContent = "";
  playerAddMessage.className = "form-message";
});

initializeApp();
