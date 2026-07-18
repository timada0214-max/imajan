"use strict";

const SESSION_STORAGE_KEY = "imajan.session";
const LOCAL_USERS_STORAGE_KEY = "imajan.localUsers";
const LOCAL_EVENTS_STORAGE_KEY = "imajan.localEvents";
const LOCAL_PLAYERS_STORAGE_KEY = "imajan.localPlayers";
const LOCAL_MATCHES_STORAGE_KEY = "imajan.localMatches";

const loginScreen = document.getElementById("login-screen");
const homeScreen = document.getElementById("home-screen");
const eventListScreen = document.getElementById("event-list-screen");
const eventCreateScreen = document.getElementById("event-create-screen");
const eventDetailScreen = document.getElementById("event-detail-screen");
const playerAddScreen = document.getElementById("player-add-screen");
const matchCreateScreen = document.getElementById("match-create-screen");

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

const playerAddBackButton = document.getElementById(
  "player-add-back-button",
);
const playerAddForm = document.getElementById("player-add-form");
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
const enteredPointTotal = document.getElementById(
  "entered-point-total",
);
const requiredPointTotal = document.getElementById(
  "required-point-total",
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




let currentUser = null;
let currentEventStatus = "active";
let currentEvent = null;
let currentEditingMatch = null;

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

  renderMatchHistory(matches);
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
    const totalScore = playerResults.reduce(
      (sum, result) => sum + Number(result.finalScore || 0),
      0,
    );

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

  renderMatchEntryRows(
    players,
    rule.playerCount,
    match ? match.results : [],
  );
  updateMatchPreview();
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
) {
  matchEntryList.replaceChildren();

  const resultsByRank = [...existingResults].sort(
    (a, b) => Number(a.rank) - Number(b.rank),
  );

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

    const existingResult = resultsByRank[index];

    if (existingResult) {
      select.value = existingResult.playerId;
      pointInput.value = String(existingResult.points);
    }

    select.addEventListener("change", updateMatchPreview);
    pointInput.addEventListener("input", updateMatchPreview);

    matchEntryList.appendChild(row);
  }
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
        results,
        updatedAt: now,
      };
    } else {
      matches.push({
        matchId: `local-match-${Date.now()}`,
        eventId: currentEvent.eventId,
        gameType: currentEvent.gameType,
        umaPreset: currentEvent.umaPreset,
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

  window.setTimeout(() => playerNameInput.focus(), 0);
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

  const duplicatedPlayer = getLocalPlayers().find(
    (player) =>
      player.eventId === currentEvent.eventId &&
      player.name === name,
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
    const players = getLocalPlayers();
    const now = new Date().toISOString();

    players.push({
      playerId: `local-player-${Date.now()}`,
      eventId: currentEvent.eventId,
      name: playerNameInput.value.trim(),
      matchCount: 0,
      rankCounts: [0, 0, 0, 0],
      averageRank: 0,
      totalScore: 0,
      createdAt: now,
      updatedAt: now,
    });

    saveLocalPlayers(players);
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
