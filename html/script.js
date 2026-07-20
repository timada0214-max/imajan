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

const loadingOverlay = document.getElementById("loading-overlay");
const loadingMessage = document.getElementById("loading-message");

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
const connectionStatusBadge = document.getElementById(
  "connection-status-badge",
);
const connectionDescription = document.getElementById(
  "connection-description",
);
const connectionTestButton = document.getElementById(
  "connection-test-button",
);
const connectionMessage = document.getElementById(
  "connection-message",
);

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
const standingsAllButton = document.getElementById(
  "standings-all-button",
);
const standingsRangeButton = document.getElementById(
  "standings-range-button",
);
const rangeSummaryPanel = document.getElementById(
  "range-summary-panel",
);
const rangeSelectedCount = document.getElementById(
  "range-selected-count",
);
const rangeSelectAllButton = document.getElementById(
  "range-select-all-button",
);
const rangeClearButton = document.getElementById(
  "range-clear-button",
);
const rangeToLatestButton = document.getElementById(
  "range-to-latest-button",
);
const rangeRecordList = document.getElementById(
  "range-record-list",
);
const rangeEmptyState = document.getElementById(
  "range-empty-state",
);
const standingsScopeCaption = document.getElementById(
  "standings-scope-caption",
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
const tieBreakSection = document.getElementById(
  "tie-break-section",
);
const tieBreakList = document.getElementById(
  "tie-break-list",
);
const tieBreakError = document.getElementById(
  "tie-break-error",
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
const matchSaveBackButton = document.getElementById(
  "match-save-back-button",
);
const matchSaveNextButton = document.getElementById(
  "match-save-next-button",
);
const matchFormActions = matchSaveNextButton.closest(
  ".match-form-actions",
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
let cloudEvents = [];
let eventLoadPromise = null;
let loadedEventOwnerUserId = null;
let cloudPlayers = [];
let playerLoadPromise = null;
let loadedPlayerOwnerUserId = null;
let cloudMatches = [];
let matchLoadPromise = null;
let loadedMatchOwnerUserId = null;
let cloudAdjustments = [];
let adjustmentLoadPromise = null;
let loadedAdjustmentOwnerUserId = null;
let currentEditingMatch = null;
let tieBreakOrderByPoints = new Map();
let standingsMode = "all";
let selectedRangeRecordKeys = new Set();
let rangeSelectionInitializedEventId = null;
let currentEditingAdjustment = null;
let loadingRequestCount = 0;
let loadingShowTimer = null;
let loadingLongWaitTimer = null;

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
 * 通信が300ms以上続いたときだけ、共通ローディングを表示します。
 * 5秒を超えた場合は、通信に時間がかかっている旨へ表示を切り替えます。
 */
function showLoading(message = "データを読み込んでいます…") {
  loadingRequestCount += 1;

  if (loadingRequestCount > 1) {
    return;
  }

  window.clearTimeout(loadingShowTimer);
  window.clearTimeout(loadingLongWaitTimer);

  loadingMessage.textContent = message;
  loadingShowTimer = window.setTimeout(() => {
    loadingOverlay.hidden = false;
  }, 300);

  loadingLongWaitTimer = window.setTimeout(() => {
    loadingMessage.textContent =
      "通信に時間がかかっています。もう少しお待ちください…";
  }, 5000);
}

/**
 * 共通ローディングを閉じます。複数の通信が重なった場合にも対応します。
 */
function hideLoading() {
  loadingRequestCount = Math.max(0, loadingRequestCount - 1);

  if (loadingRequestCount > 0) {
    return;
  }

  window.clearTimeout(loadingShowTimer);
  window.clearTimeout(loadingLongWaitTimer);
  loadingShowTimer = null;
  loadingLongWaitTimer = null;
  loadingOverlay.hidden = true;
  loadingMessage.textContent = "データを読み込んでいます…";
}

/**
 * ログイン画面を表示します。
 */
function showLoginScreen() {
  cloudEvents = [];
  loadedEventOwnerUserId = null;
  eventLoadPromise = null;
  cloudPlayers = [];
  loadedPlayerOwnerUserId = null;
  playerLoadPromise = null;
  cloudMatches = [];
  loadedMatchOwnerUserId = null;
  matchLoadPromise = null;
  cloudAdjustments = [];
  loadedAdjustmentOwnerUserId = null;
  adjustmentLoadPromise = null;

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
function getApiConfig() {
  const config = window.IMAJAN_CONFIG || {};

  return {
    gasWebAppUrl: String(config.GAS_WEB_APP_URL || "").trim(),
    timeoutMs: Number(config.API_TIMEOUT_MS) || 10000,
  };
}

function isGasWebAppConfigured() {
  const { gasWebAppUrl } = getApiConfig();

  return /^https:\/\/script\.google\.com\/macros\/s\/[^/]+\/exec$/.test(
    gasWebAppUrl,
  );
}

function setConnectionStatus(status, message = "") {
  const statusMap = {
    unconfigured: {
      text: "未設定",
      className: "is-unconfigured",
    },
    checking: {
      text: "確認中",
      className: "is-checking",
    },
    connected: {
      text: "接続済み",
      className: "is-connected",
    },
    error: {
      text: "接続エラー",
      className: "is-error",
    },
  };
  const nextStatus = statusMap[status] || statusMap.unconfigured;

  connectionStatusBadge.textContent = nextStatus.text;
  connectionStatusBadge.className =
    `connection-status-badge ${nextStatus.className}`;

  connectionMessage.textContent = message;
  connectionMessage.className =
    status === "connected"
      ? "form-message is-success"
      : status === "error"
        ? "form-message is-error"
        : "form-message";
}

function renderConnectionCard() {
  if (isGasWebAppConfigured()) {
    connectionDescription.textContent =
      "GASのURLが設定されています。接続確認後も、現時点のデータ保存はブラウザ内のままです。";
    connectionTestButton.disabled = false;
    setConnectionStatus("unconfigured");
    connectionStatusBadge.textContent = "未確認";
    return;
  }

  connectionDescription.textContent =
    "現在はこの端末のブラウザ内に保存しています。config.jsにGASのウェブアプリURLを設定してください。";
  connectionTestButton.disabled = false;
  setConnectionStatus("unconfigured");
}

async function callGasApi(action, payload = null) {
  const { gasWebAppUrl, timeoutMs } = getApiConfig();

  if (!isGasWebAppConfigured()) {
    throw new Error(
      "config.jsにGASのウェブアプリURLが設定されていません。",
    );
  }

  const controller = new AbortController();
  const timeoutId = window.setTimeout(
    () => controller.abort(),
    timeoutMs,
  );

  try {
    let response;

    if (payload === null) {
      const url = new URL(gasWebAppUrl);
      url.searchParams.set("action", action);
      url.searchParams.set("_", String(Date.now()));

      response = await fetch(url.toString(), {
        method: "GET",
        redirect: "follow",
        cache: "no-store",
        signal: controller.signal,
      });
    } else {
      response = await fetch(gasWebAppUrl, {
        method: "POST",
        redirect: "follow",
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify({
          action,
          payload,
        }),
        signal: controller.signal,
      });
    }

    if (!response.ok) {
      throw new Error(
        `GASからHTTP ${response.status}が返されました。`,
      );
    }

    const result = await response.json();

    if (!result || result.ok !== true) {
      const apiError = new Error(
        result?.error?.message ||
          "GASから正常な応答を受け取れませんでした。",
      );
      apiError.code =
        result?.error?.code || "API_RESPONSE_ERROR";
      throw apiError;
    }

    return result.data;
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error(
        "接続確認がタイムアウトしました。GASのURLとデプロイ設定を確認してください。",
      );
    }

    throw error;
  } finally {
    window.clearTimeout(timeoutId);
  }
}

async function handleConnectionTest() {
  connectionTestButton.disabled = true;
  setConnectionStatus("checking", "GASへ接続しています…");

  try {
    const data = await callGasApi("ping");

    setConnectionStatus(
      "connected",
      `${data.appName || "IMAJAN"} APIに接続しました。` +
        ` スプレッドシート：${data.spreadsheetName || "確認済み"}`,
    );
  } catch (error) {
    console.error("GAS接続確認に失敗しました。", error);
    setConnectionStatus("error", error.message);
  } finally {
    connectionTestButton.disabled = false;
  }
}

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
  renderConnectionCard();
}

/**
 * イベント一覧画面を表示します。
 */
async function showEventListScreen() {
  if (!currentUser) {
    showLoginScreen();
    return;
  }

  hideAllScreens();
  eventListScreen.hidden = false;

  renderEventList();
  showLoading("対局を読み込んでいます…");

  try {
    await loadEventsFromSheet();
    renderEventList();
  } catch (error) {
    console.error(error);

    eventEmptyState.hidden = false;
    emptyStateTitle.textContent =
      "対局を読み込めませんでした";
    emptyStateDescription.textContent =
      error.message ||
      "通信状態を確認して、もう一度お試しください。";
    emptyStateCreateButton.hidden = false;
  } finally {
    hideLoading();
  }
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
 * 現在ログイン中のユーザーについて、
 * スプレッドシートから読み込んだイベント一覧を返します。
 */
function getLocalEvents() {
  return cloudEvents;
}

/**
 * STEP9-3以前にlocalStorageへ保存されていたイベントを取得します。
 * 初回移行専用です。
 */
function getLegacyLocalEvents() {
  const savedEvents = localStorage.getItem(
    LOCAL_EVENTS_STORAGE_KEY,
  );

  if (!savedEvents) {
    return [];
  }

  try {
    return JSON.parse(savedEvents);
  } catch (error) {
    console.warn(
      "旧ローカルイベントの読み込みに失敗しました。",
      error,
    );
    return [];
  }
}


/**
 * 現在ログイン中のユーザーについて、
 * Playersシートから読み込んだプレイヤー一覧を返します。
 */
function getLocalPlayers() {
  return cloudPlayers;
}

/**
 * 画面内の集計値をキャッシュへ反映します。
 * STEP9-4以降、プレイヤーの基本情報はlocalStorageへ保存しません。
 */
function saveLocalPlayers(players) {
  cloudPlayers = Array.isArray(players) ? players : [];
}

/**
 * STEP9-4以前にlocalStorageへ保存されていたプレイヤーを取得します。
 * 初回移行専用です。
 */
function getLegacyLocalPlayers() {
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
      "旧ローカルプレイヤーの読み込みに失敗しました。",
      error,
    );
    return [];
  }
}


function getLocalMatches() {
  return cloudMatches;
}

function saveLocalMatches(matches) {
  cloudMatches = Array.isArray(matches) ? matches : [];
}

function getLegacyLocalMatches() {
  const savedMatches = localStorage.getItem(LOCAL_MATCHES_STORAGE_KEY);
  if (!savedMatches) return [];
  try { return JSON.parse(savedMatches); }
  catch (error) {
    console.warn("旧ローカル半荘結果の読み込みに失敗しました。", error);
    return [];
  }
}

function getLocalAdjustments() {
  return cloudAdjustments;
}

function saveLocalAdjustments(adjustments) {
  cloudAdjustments = Array.isArray(adjustments)
    ? adjustments
    : [];
}

function getLegacyLocalAdjustments() {
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
      "旧ローカルポイント増減の読み込みに失敗しました。",
      error,
    );
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
 * APIのユーザー情報を、既存画面が扱える形式へ整えます。
 */
function wrapUserApiResponse(user) {
  return {
    success: true,
    data: user,
  };
}

/**
 * localStorageに残っている旧ユーザーを探します。
 * STEP9-2以前に作成したアカウントの初回移行に使用します。
 */
function findMatchingLocalUser({ nickname, pin }) {
  return getLocalUsers().find(
    (user) =>
      user.nickname === nickname &&
      user.pin === pin,
  );
}

/**
 * スプレッドシート上のユーザーでログインします。
 *
 * STEP9-2以前のローカルユーザーだった場合は、
 * 初回ログイン時にUsersシートへ自動移行します。
 */
async function requestLogin(payload) {
  if (!isGasWebAppConfigured()) {
    throw new Error(
      "GAS接続が未設定です。config.jsを確認してください。",
    );
  }

  try {
    const user = await callGasApi("loginUser", payload);
    return wrapUserApiResponse(user);
  } catch (error) {
    const localUser = findMatchingLocalUser(payload);

    if (!localUser) {
      throw error;
    }

    try {
      const migratedUser = await callGasApi("createUser", {
        ...payload,
        preferredUserId: localUser.userId,
      });

      return wrapUserApiResponse(migratedUser);
    } catch (migrationError) {
      if (migrationError.code === "DUPLICATE_NICKNAME") {
        throw error;
      }

      throw migrationError;
    }
  }
}

/**
 * 新規ユーザーをUsersシートへ保存します。
 */
async function requestSignup(payload) {
  if (!isGasWebAppConfigured()) {
    throw new Error(
      "GAS接続が未設定です。config.jsを確認してください。",
    );
  }

  const user = await callGasApi("createUser", payload);
  return wrapUserApiResponse(user);
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
 * Dateオブジェクト由来の長い文字列を、対局画面向けの日付へ整形します。
 * 通常の対局名は変更しません。
 */
function formatDateLikeText(value) {
  const text = String(value || "").trim();

  if (!text) {
    return "";
  }

  const looksLikeDate =
    /^\d{4}-\d{1,2}-\d{1,2}(?:T|$)/.test(text) ||
    /^(?:Sun|Mon|Tue|Wed|Thu|Fri|Sat)\s/i.test(text) ||
    /GMT[+-]\d{4}/i.test(text);

  if (!looksLikeDate) {
    return text;
  }

  const date = new Date(text);

  if (Number.isNaN(date.getTime())) {
    return text;
  }

  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).format(date);
}

function getEventDisplayName(event) {
  return formatDateLikeText(event?.name) || "名称未設定の対局";
}

/**
 * イベントカードを生成します。
 */
function getEventMigrationKey(userId) {
  return `imajan.eventsMigrated.${userId}`;
}

function getLocalMatchCount(eventId) {
  return getLocalMatches().filter(
    (match) => match.eventId === eventId,
  ).length;
}

function normalizeCloudEvent(event) {
  return {
    ...event,
    umaPreset: String(event.umaPreset || ""),
    rankScore1: Number(event.rankScore1 || 0),
    rankScore2: Number(event.rankScore2 || 0),
    rankScore3: Number(event.rankScore3 || 0),
    rankScore4: Number(event.rankScore4 || 0),
    matchCount: Math.max(
      Number(event.matchCount || 0),
      getLocalMatchCount(event.eventId),
    ),
  };
}

async function migrateLegacyEventsToSheet() {
  if (!currentUser) {
    return;
  }

  const migrationKey = getEventMigrationKey(
    currentUser.userId,
  );

  if (localStorage.getItem(migrationKey) === "done") {
    return;
  }

  const legacyEvents = getLegacyLocalEvents().filter(
    (event) =>
      !event.ownerUserId ||
      event.ownerUserId === currentUser.userId,
  );

  for (const legacyEvent of legacyEvents) {
    await callGasApi("createEvent", {
      ownerUserId: currentUser.userId,
      name: legacyEvent.name,
      eventType: legacyEvent.eventType,
      gameType: legacyEvent.gameType,
      umaPreset: legacyEvent.umaPreset,
      status: legacyEvent.status || "active",
      preferredEventId: legacyEvent.eventId,
      createdAt: legacyEvent.createdAt,
      updatedAt: legacyEvent.updatedAt,
    });
  }

  localStorage.setItem(migrationKey, "done");
}

async function loadEventsFromSheet({ force = false } = {}) {
  if (!currentUser) {
    cloudEvents = [];
    loadedEventOwnerUserId = null;
    return [];
  }

  if (
    !force &&
    loadedEventOwnerUserId === currentUser.userId &&
    cloudEvents.length > 0
  ) {
    return cloudEvents;
  }

  if (eventLoadPromise) {
    return eventLoadPromise;
  }

  eventLoadPromise = (async () => {
    await migrateLegacyEventsToSheet();

    const events = await callGasApi("listEvents", {
      ownerUserId: currentUser.userId,
    });

    cloudEvents = Array.isArray(events)
      ? events.map(normalizeCloudEvent)
      : [];
    loadedEventOwnerUserId = currentUser.userId;

    return cloudEvents;
  })();

  try {
    return await eventLoadPromise;
  } finally {
    eventLoadPromise = null;
  }
}

function getPlayerMigrationKey(userId) {
  return `imajan.playersMigrated.${userId}`;
}

function normalizeCloudPlayer(player) {
  return {
    ...player,
    sortOrder: Number(player.sortOrder || 0),
    matchCount: 0,
    rankCounts: [0, 0, 0, 0],
    averageRank: 0,
    totalScore: 0,
  };
}

async function migrateLegacyPlayersToSheet() {
  if (!currentUser) {
    return;
  }

  const migrationKey = getPlayerMigrationKey(
    currentUser.userId,
  );

  if (localStorage.getItem(migrationKey) === "done") {
    return;
  }

  await loadEventsFromSheet();

  const ownedEventIds = new Set(
    cloudEvents.map((event) => event.eventId),
  );
  const legacyPlayers = getLegacyLocalPlayers().filter(
    (player) => ownedEventIds.has(player.eventId),
  );
  const eventPlayerCounts = new Map();

  for (const legacyPlayer of legacyPlayers) {
    const currentCount =
      eventPlayerCounts.get(legacyPlayer.eventId) || 0;

    await callGasApi("createPlayer", {
      ownerUserId: currentUser.userId,
      eventId: legacyPlayer.eventId,
      name: legacyPlayer.name,
      preferredPlayerId: legacyPlayer.playerId,
      sortOrder:
        Number(legacyPlayer.sortOrder || 0) || currentCount + 1,
      createdAt: legacyPlayer.createdAt,
      updatedAt: legacyPlayer.updatedAt,
    });

    eventPlayerCounts.set(
      legacyPlayer.eventId,
      currentCount + 1,
    );
  }

  localStorage.setItem(migrationKey, "done");
}

async function loadPlayersFromSheet({ force = false } = {}) {
  if (!currentUser) {
    cloudPlayers = [];
    loadedPlayerOwnerUserId = null;
    return [];
  }

  if (
    !force &&
    loadedPlayerOwnerUserId === currentUser.userId
  ) {
    return cloudPlayers;
  }

  if (playerLoadPromise) {
    return playerLoadPromise;
  }

  playerLoadPromise = (async () => {
    await migrateLegacyPlayersToSheet();

    const players = await callGasApi("listPlayers", {
      ownerUserId: currentUser.userId,
    });

    cloudPlayers = Array.isArray(players)
      ? players.map(normalizeCloudPlayer)
      : [];
    loadedPlayerOwnerUserId = currentUser.userId;

    return cloudPlayers;
  })();

  try {
    return await playerLoadPromise;
  } finally {
    playerLoadPromise = null;
  }
}

async function createPlayerOnSheet(name) {
  if (!currentUser || !currentEvent) {
    throw new Error("対局情報を確認できませんでした。");
  }

  const eventPlayers = getLocalPlayers().filter(
    (player) => player.eventId === currentEvent.eventId,
  );
  const player = await callGasApi("createPlayer", {
    ownerUserId: currentUser.userId,
    eventId: currentEvent.eventId,
    name: name.trim(),
    sortOrder: eventPlayers.length + 1,
  });
  const normalizedPlayer = normalizeCloudPlayer(player);

  cloudPlayers.push(normalizedPlayer);
  return normalizedPlayer;
}

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
    getEventDisplayName(event);

  button.addEventListener("click", () => {
    showEventDetailScreen(event, { scrollToTop: true });
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
        "終了した対局はありません";
      emptyStateDescription.textContent =
        "対局を終了すると、ここに表示されます。";
      emptyStateCreateButton.hidden = true;
    } else {
      emptyStateTitle.textContent =
        "開催中の対局はありません";
      emptyStateDescription.textContent =
        "新しい対局を作成すると、ここに表示されます。";
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



function getMatchMigrationKey(ownerUserId) {
  return `imajan.matchMigration.v1.${ownerUserId}`;
}

function normalizeCloudMatch(match) {
  const playerNameById = new Map(
    getLocalPlayers().map((player) => [
      String(player.playerId),
      player.name,
    ]),
  );

  return {
    matchId: String(match.matchId),
    eventId: String(match.eventId),
    gameType: String(match.gameType || "yonma"),
    umaPreset: String(match.umaPreset || ""),
    entryOrderPlayerIds: Array.isArray(match.entryOrderPlayerIds)
      ? match.entryOrderPlayerIds.map(String)
      : [],
    tieBreakOrderPlayerIds: Array.isArray(match.tieBreakOrderPlayerIds)
      ? match.tieBreakOrderPlayerIds.map(String)
      : [],
    results: Array.isArray(match.results)
      ? match.results.map((result) => ({
          playerId: String(result.playerId),
          playerName:
            String(result.playerName || "") ||
            playerNameById.get(String(result.playerId)) ||
            "不明なプレイヤー",
          points: Number(result.points),
          rank: Number(result.rank),
          rankPoint: Number(result.rankPoint),
          finalScore: Number(result.finalScore),
        }))
      : [],
    playedAt: String(match.playedAt || match.createdAt || ""),
    createdAt: String(match.createdAt || ""),
    updatedAt: String(match.updatedAt || ""),
  };
}

async function saveMatchOnSheet(match) {
  const saved = await callGasApi("saveMatch", { ownerUserId: currentUser.userId, ...match, preferredMatchId: match.matchId });
  const normalized = normalizeCloudMatch(saved);
  const index = cloudMatches.findIndex((item) => item.matchId === normalized.matchId);
  if (index >= 0) cloudMatches[index] = normalized; else cloudMatches.push(normalized);
  return normalized;
}

async function deleteMatchOnSheet(matchId) {
  await callGasApi("deleteMatch", { ownerUserId: currentUser.userId, matchId });
  cloudMatches = cloudMatches.filter((match) => match.matchId !== matchId);
}

async function migrateLegacyMatchesToSheet() {
  const key = getMatchMigrationKey(currentUser.userId);
  if (localStorage.getItem(key) === "done") return;
  const ownedEventIds = new Set(cloudEvents.filter((event) => event.ownerUserId === currentUser.userId).map((event) => event.eventId));
  const legacyMatches = getLegacyLocalMatches().filter((match) => ownedEventIds.has(String(match.eventId)));
  for (const match of legacyMatches) await saveMatchOnSheet(match);
  localStorage.setItem(key, "done");
}

async function loadMatchesFromSheet({ force = false } = {}) {
  if (!currentUser) return [];
  if (!force && loadedMatchOwnerUserId === currentUser.userId) return cloudMatches;
  if (matchLoadPromise) return matchLoadPromise;
  matchLoadPromise = (async () => {
    await loadEventsFromSheet();
    await migrateLegacyMatchesToSheet();
    const matches = await callGasApi("listMatches", { ownerUserId: currentUser.userId });
    cloudMatches = Array.isArray(matches) ? matches.map(normalizeCloudMatch) : [];
    loadedMatchOwnerUserId = currentUser.userId;
    return cloudMatches;
  })();
  try { return await matchLoadPromise; } finally { matchLoadPromise = null; }
}


function getAdjustmentMigrationKey(ownerUserId) {
  return `imajan.adjustmentMigration.v1.${ownerUserId}`;
}

function normalizeCloudAdjustment(adjustment) {
  const playerNameById = new Map(
    getLocalPlayers().map((player) => [
      String(player.playerId),
      player.name,
    ]),
  );

  return {
    adjustmentId: String(adjustment.adjustmentId),
    eventId: String(adjustment.eventId),
    title: String(adjustment.title || ""),
    entries: Array.isArray(adjustment.entries)
      ? adjustment.entries.map((entry) => ({
          playerId: String(entry.playerId),
          playerName:
            String(entry.playerName || "") ||
            playerNameById.get(String(entry.playerId)) ||
            "不明なプレイヤー",
          points: Number(entry.points),
        }))
      : [],
    adjustedAt: String(
      adjustment.adjustedAt || adjustment.createdAt || "",
    ),
    createdAt: String(adjustment.createdAt || ""),
    updatedAt: String(adjustment.updatedAt || ""),
  };
}

async function saveAdjustmentOnSheet(adjustment) {
  const saved = await callGasApi("saveAdjustment", {
    ownerUserId: currentUser.userId,
    ...adjustment,
    preferredAdjustmentId: adjustment.adjustmentId,
  });
  const normalized = normalizeCloudAdjustment(saved);
  const index = cloudAdjustments.findIndex(
    (item) => item.adjustmentId === normalized.adjustmentId,
  );

  if (index >= 0) {
    cloudAdjustments[index] = normalized;
  } else {
    cloudAdjustments.push(normalized);
  }

  return normalized;
}

async function deleteAdjustmentOnSheet(adjustmentId) {
  await callGasApi("deleteAdjustment", {
    ownerUserId: currentUser.userId,
    adjustmentId,
  });
  cloudAdjustments = cloudAdjustments.filter(
    (adjustment) => adjustment.adjustmentId !== adjustmentId,
  );
}

async function migrateLegacyAdjustmentsToSheet() {
  const migrationKey = getAdjustmentMigrationKey(
    currentUser.userId,
  );

  if (localStorage.getItem(migrationKey) === "done") {
    return;
  }

  const ownedEventIds = new Set(
    cloudEvents
      .filter(
        (event) => event.ownerUserId === currentUser.userId,
      )
      .map((event) => event.eventId),
  );
  const legacyAdjustments = getLegacyLocalAdjustments().filter(
    (adjustment) =>
      ownedEventIds.has(String(adjustment.eventId)),
  );

  for (const adjustment of legacyAdjustments) {
    await saveAdjustmentOnSheet(adjustment);
  }

  localStorage.setItem(migrationKey, "done");
}

async function loadAdjustmentsFromSheet({ force = false } = {}) {
  if (!currentUser) {
    return [];
  }

  if (
    !force &&
    loadedAdjustmentOwnerUserId === currentUser.userId
  ) {
    return cloudAdjustments;
  }

  if (adjustmentLoadPromise) {
    return adjustmentLoadPromise;
  }

  adjustmentLoadPromise = (async () => {
    await Promise.all([
      loadEventsFromSheet(),
      loadPlayersFromSheet(),
    ]);
    await migrateLegacyAdjustmentsToSheet();
    const adjustments = await callGasApi("listAdjustments", {
      ownerUserId: currentUser.userId,
    });
    cloudAdjustments = Array.isArray(adjustments)
      ? adjustments.map(normalizeCloudAdjustment)
      : [];
    loadedAdjustmentOwnerUserId = currentUser.userId;
    return cloudAdjustments;
  })();

  try {
    return await adjustmentLoadPromise;
  } finally {
    adjustmentLoadPromise = null;
  }
}


function scrollPageToTop() {
  requestAnimationFrame(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  });
}

async function showEventDetailScreen(
  event = currentEvent,
  { scrollToTop = false } = {},
) {
  if (!event) {
    showEventListScreen();
    return;
  }

  const isDifferentEvent =
    currentEvent?.eventId !== event.eventId;
  currentEvent = event;

  if (isDifferentEvent) {
    standingsMode = "all";
    selectedRangeRecordKeys = new Set();
    rangeSelectionInitializedEventId = null;
  }

  hideAllScreens();
  eventDetailScreen.hidden = false;
  showLoading("大会データを読み込んでいます…");

  try {
    await Promise.all([
      loadPlayersFromSheet(),
      loadMatchesFromSheet(),
      loadAdjustmentsFromSheet(),
    ]);
    renderEventDetail();

    if (scrollToTop) {
      scrollPageToTop();
    }
  } catch (error) {
    console.error(error);
    playerCountText.textContent =
      error.message || "プレイヤーを読み込めませんでした。";
  } finally {
    hideLoading();
  }
}

function getEventTimelineRecords(eventId = currentEvent?.eventId) {
  if (!eventId) {
    return [];
  }

  const matches = getLocalMatches()
    .filter((match) => match.eventId === eventId)
    .map((match) => ({
      key: `match:${match.matchId}`,
      type: "match",
      id: match.matchId,
      createdAt: match.createdAt,
      data: match,
    }));

  const adjustments = getLocalAdjustments()
    .filter((adjustment) => adjustment.eventId === eventId)
    .map((adjustment) => ({
      key: `adjustment:${adjustment.adjustmentId}`,
      type: "adjustment",
      id: adjustment.adjustmentId,
      createdAt: adjustment.createdAt,
      data: adjustment,
    }));

  return [...matches, ...adjustments].sort(
    (a, b) =>
      new Date(a.createdAt).getTime() -
      new Date(b.createdAt).getTime(),
  );
}

function createPlayerStatsFromRecords(eventId, records) {
  const players = getLocalPlayers()
    .filter((player) => player.eventId === eventId)
    .map((player) => ({
      ...player,
      rankCounts: [0, 0, 0, 0],
      matchCount: 0,
      averageRank: 0,
      totalScore: 0,
    }));

  const matches = records
    .filter((record) => record.type === "match")
    .map((record) => record.data);
  const adjustments = records
    .filter((record) => record.type === "adjustment")
    .map((record) => record.data);

  players.forEach((player) => {
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
      (sum, result) =>
        sum + Number(result.finalScore || 0),
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

    player.matchCount = playerResults.length;
    player.rankCounts = rankCounts;
    player.averageRank =
      playerResults.length > 0
        ? Math.round(
            (totalRank / playerResults.length) * 100,
          ) / 100
        : 0;
    player.totalScore =
      Math.round((matchScore + adjustmentScore) * 10) / 10;
  });

  return players.sort(comparePlayerStandings);
}

function formatRangeRecordDate(dateText) {
  const date = new Date(dateText);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleString("ja-JP", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getRangeRecordTitle(record, timelineIndex) {
  if (record.type === "adjustment") {
    return record.data.title || "ポイント増減";
  }

  const matchNumber =
    getEventTimelineRecords()
      .slice(0, timelineIndex + 1)
      .filter((item) => item.type === "match").length;

  return `第${matchNumber}半荘`;
}

function initializeRangeSelection(records) {
  if (
    rangeSelectionInitializedEventId === currentEvent?.eventId
  ) {
    const validKeys = new Set(
      records.map((record) => record.key),
    );

    selectedRangeRecordKeys = new Set(
      Array.from(selectedRangeRecordKeys).filter((key) =>
        validKeys.has(key),
      ),
    );
    return;
  }

  selectedRangeRecordKeys = new Set(
    records.map((record) => record.key),
  );
  rangeSelectionInitializedEventId = currentEvent?.eventId || null;
}

function renderRangeRecordList(records) {
  rangeRecordList.replaceChildren();
  rangeEmptyState.hidden = records.length > 0;

  records.forEach((record, index) => {
    const label = document.createElement("label");
    label.className = "range-record-item";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "range-record-checkbox";
    checkbox.checked = selectedRangeRecordKeys.has(record.key);
    checkbox.setAttribute(
      "aria-label",
      `${getRangeRecordTitle(record, index)}を集計対象にする`,
    );

    checkbox.addEventListener("change", () => {
      if (checkbox.checked) {
        selectedRangeRecordKeys.add(record.key);
      } else {
        selectedRangeRecordKeys.delete(record.key);
      }

      renderEventDetail();
    });

    const sequence = document.createElement("span");
    sequence.className = "range-record-sequence";
    sequence.textContent = String(index + 1);

    const content = document.createElement("span");
    content.className = "range-record-content";

    const title = document.createElement("span");
    title.className = "range-record-title";
    title.textContent = getRangeRecordTitle(record, index);

    const meta = document.createElement("span");
    meta.className = "range-record-meta";
    meta.textContent = formatRangeRecordDate(record.createdAt);

    content.append(title, meta);

    const type = document.createElement("span");
    type.className =
      `range-record-type ${
        record.type === "match"
          ? "is-match"
          : "is-adjustment"
      }`;
    type.textContent =
      record.type === "match" ? "半荘" : "ポイント増減";

    label.append(checkbox, sequence, content, type);
    rangeRecordList.appendChild(label);
  });

  rangeSelectedCount.textContent =
    `${selectedRangeRecordKeys.size}件選択`;
}

function getSelectedRangeRecords(records) {
  return records.filter((record) =>
    selectedRangeRecordKeys.has(record.key),
  );
}

function setStandingsMode(mode) {
  standingsMode = mode;
  renderEventDetail();
}

function selectAllRangeRecords() {
  const records = getEventTimelineRecords();

  selectedRangeRecordKeys = new Set(
    records.map((record) => record.key),
  );
  renderEventDetail();
}

function clearRangeRecords() {
  selectedRangeRecordKeys = new Set();
  renderEventDetail();
}

function selectFromOldestSelectedToLatest() {
  const records = getEventTimelineRecords();
  const selectedIndexes = records
    .map((record, index) =>
      selectedRangeRecordKeys.has(record.key) ? index : -1,
    )
    .filter((index) => index >= 0);

  if (selectedIndexes.length === 0) {
    window.alert(
      "開始位置にする記録を1件以上選択してください。",
    );
    return;
  }

  const startIndex = Math.min(...selectedIndexes);

  selectedRangeRecordKeys = new Set(
    records
      .slice(startIndex)
      .map((record) => record.key),
  );
  renderEventDetail();
}

function renderEventDetail() {
  if (!currentEvent) {
    return;
  }

  rebuildPlayerStatsForEvent(currentEvent.eventId);

  const timelineRecords = getEventTimelineRecords();
  initializeRangeSelection(timelineRecords);

  const allPlayers = getLocalPlayers()
    .filter((player) => player.eventId === currentEvent.eventId)
    .sort(comparePlayerStandings);
  const selectedRecords =
    getSelectedRangeRecords(timelineRecords);
  const rangePlayers = createPlayerStatsFromRecords(
    currentEvent.eventId,
    selectedRecords,
  );
  const players =
    standingsMode === "range" ? rangePlayers : allPlayers;

  const eventTypeText =
    currentEvent.eventType === "single"
      ? "当日対戦"
      : "リーグ戦";

  const gameTypeText =
    currentEvent.gameType === "sanma" ? "三麻" : "四麻";

  eventDetailTitle.textContent = getEventDisplayName(currentEvent);
  eventDetailCaption.textContent =
    currentEvent.status === "completed" ? "終了" : "開催中";

  eventSummaryName.textContent = getEventDisplayName(currentEvent);
  eventSummaryType.textContent = eventTypeText;
  eventSummaryGame.textContent = gameTypeText;
  const umaText = formatDateLikeText(currentEvent.umaPreset);
  eventSummaryUma.textContent =
    currentEvent.umaPreset === "none"
      ? "ウマ・オカなし"
      : umaText || "設定なし";

  standingsAllButton.classList.toggle(
    "is-active",
    standingsMode === "all",
  );
  standingsRangeButton.classList.toggle(
    "is-active",
    standingsMode === "range",
  );
  standingsAllButton.setAttribute(
    "aria-selected",
    String(standingsMode === "all"),
  );
  standingsRangeButton.setAttribute(
    "aria-selected",
    String(standingsMode === "range"),
  );
  rangeSummaryPanel.hidden = standingsMode !== "range";

  if (standingsMode === "range") {
    renderRangeRecordList(timelineRecords);

    const selectedMatchCount = selectedRecords.filter(
      (record) => record.type === "match",
    ).length;
    const selectedAdjustmentCount = selectedRecords.filter(
      (record) => record.type === "adjustment",
    ).length;

    standingsScopeCaption.textContent =
      `${selectedMatchCount}半荘・` +
      `${selectedAdjustmentCount}件のポイント増減を集計`;
  } else {
    standingsScopeCaption.textContent =
      "すべての半荘・ポイント増減を集計";
  }

  playerCountText.textContent =
    `${players.length}人登録・総合ポイント順（ポイント増減を含む）`;

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

function getStandingsScoreClass(score) {
  const numericScore = Number(score) || 0;

  if (numericScore > 0) {
    return "is-positive";
  }

  if (numericScore < 0) {
    return "is-negative";
  }

  return "is-zero";
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
    <span class="standings-player-column">プレイヤー</span>
    <span>総合Pt</span>
    <span>平均順位</span>
    <span>半荘数</span>
    <span>1位</span>
    <span>2位</span>
    <span>3位</span>
    ${isSanma ? "" : "<span>4位</span>"}
  `;
  table.appendChild(header);

  players.forEach((player, index) => {
    const row = document.createElement("div");
    row.className = "standings-row";

    const score = Number(player.totalScore) || 0;

    row.innerHTML = `
      <span class="standings-player-cell">
        <span class="standings-rank">${index + 1}</span>
        <span class="standings-player"></span>
      </span>
      <strong class="standings-score ${getStandingsScoreClass(
        score,
      )}">${formatSignedScore(score)}</strong>
      <span class="standings-average">${formatAverageRank(
        player,
      )}</span>
      <span>${player.matchCount || 0}</span>
      <span>${player.rankCounts?.[0] || 0}</span>
      <span>${player.rankCounts?.[1] || 0}</span>
      <span>${player.rankCounts?.[2] || 0}</span>
      ${isSanma ? "" : `<span>${player.rankCounts?.[3] || 0}</span>`}
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

      const currentPlayer = getLocalPlayers().find(
        (player) => String(player.playerId) === String(result.playerId),
      );
      row.querySelector(".match-history-player").textContent =
        currentPlayer?.name || result.playerName || "不明なプレイヤー";

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
      <div class="adjustment-point-control">
        <button
          class="adjustment-sign-button"
          type="button"
          aria-label="${player.name}のプラス・マイナスを切り替え"
          aria-pressed="false"
        >＋</button>
        <input
          class="adjustment-point-input"
          type="number"
          inputmode="decimal"
          min="0"
          step="0.1"
          value=""
          placeholder="0"
          aria-label="${player.name}のポイント増減"
        />
      </div>
    `;

    row.querySelector(".adjustment-entry-player").textContent =
      player.name;

    const input = row.querySelector(
      ".adjustment-point-input",
    );
    const signButton = row.querySelector(
      ".adjustment-sign-button",
    );
    const existingValue = existingMap.has(player.playerId)
      ? Number(existingMap.get(player.playerId))
      : null;

    if (existingValue !== null && existingValue !== 0) {
      input.value = String(Math.abs(existingValue));
    }

    const setNegative = (isNegative) => {
      row.dataset.negative = isNegative ? "true" : "false";
      signButton.textContent = isNegative ? "−" : "＋";
      signButton.classList.toggle("is-negative", isNegative);
      signButton.setAttribute(
        "aria-pressed",
        isNegative ? "true" : "false",
      );
    };

    setNegative(existingValue !== null && existingValue < 0);

    signButton.addEventListener("click", () => {
      setNegative(row.dataset.negative !== "true");
      updateAdjustmentTotal();
      input.focus();
    });
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

    const absolutePoints =
      valueText === "" ? null : Math.abs(Number(valueText));
    const isNegative = row.dataset.negative === "true";

    return {
      playerId,
      playerName: player ? player.name : "",
      valueText,
      points:
        absolutePoints === null
          ? null
          : isNegative
            ? -absolutePoints
            : absolutePoints,
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

async function handleAdjustmentSubmit(event) {
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

    const targetAdjustment = currentEditingAdjustment
      ? adjustments.find(
          (adjustment) =>
            adjustment.adjustmentId ===
            currentEditingAdjustment.adjustmentId,
        )
      : adjustments[adjustments.length - 1];

    await saveAdjustmentOnSheet(targetAdjustment);
    rebuildPlayerStatsForEvent(currentEvent.eventId);
    currentEditingAdjustment = null;
    showEventDetailScreen(currentEvent, { scrollToTop: true });
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

async function handleAdjustmentDelete() {
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
    await deleteAdjustmentOnSheet(
      currentEditingAdjustment.adjustmentId,
    );
    rebuildPlayerStatsForEvent(currentEvent.eventId);
    currentEditingAdjustment = null;
    showEventDetailScreen(currentEvent, { scrollToTop: true });
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

function getNextMatchNumber() {
  if (!currentEvent) {
    return 1;
  }

  const matchCount = getLocalMatches().filter(
    (match) => match.eventId === currentEvent.eventId,
  ).length;

  return matchCount + 1;
}

function setMatchSaveButtonsDisabled(disabled) {
  matchSaveBackButton.disabled = disabled;
  matchSaveNextButton.disabled = disabled;
  matchDeleteButton.disabled = disabled;
}

function restoreMatchSaveButtonLabels(isEditing) {
  matchSaveBackButton.textContent = "保存";
  matchSaveNextButton.textContent = isEditing
    ? "変更を保存"
    : "保存して次の半荘へ";
}

function showContinuousMatchSavedMessage(savedMatchNumber) {
  matchCreateMessage.textContent =
    `✓ 第${savedMatchNumber}半荘を保存しました`;
  matchCreateMessage.className =
    "form-message match-create-success";

  window.setTimeout(() => {
    if (
      !matchCreateScreen.hidden &&
      !currentEditingMatch &&
      matchCreateMessage.textContent ===
        `✓ 第${savedMatchNumber}半荘を保存しました`
    ) {
      matchCreateMessage.textContent = "";
      matchCreateMessage.className = "form-message";
    }
  }, 900);
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
  tieBreakError.textContent = "";
  tieBreakList.replaceChildren();
  tieBreakSection.hidden = true;
  tieBreakOrderByPoints = new Map();
  matchCreateMessage.textContent = "";
  matchCreateMessage.className = "form-message";
  matchPreviewSection.hidden = true;

  matchFormTitle.textContent = match
    ? "半荘結果を編集"
    : `第${getNextMatchNumber()}半荘を登録`;
  matchFormActions.classList.toggle(
    "is-editing",
    Boolean(match),
  );
  restoreMatchSaveButtonLabels(Boolean(match));
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

  if (match) {
    const resultsByPoints = new Map();

    match.results
      .slice()
      .sort((a, b) => Number(a.rank) - Number(b.rank))
      .forEach((result) => {
        const key = String(result.points);
        const playerIds = resultsByPoints.get(key) || [];
        playerIds.push(result.playerId);
        resultsByPoints.set(key, playerIds);
      });

    resultsByPoints.forEach((playerIds, key) => {
      if (playerIds.length > 1) {
        tieBreakOrderByPoints.set(key, playerIds);
      }
    });
  }

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
          <div class="match-point-control">
            <div class="match-sign-buttons" role="group" aria-label="符号">
              <button class="match-sign-button is-active" type="button" data-sign="1" aria-pressed="true">＋</button>
              <button class="match-sign-button" type="button" data-sign="-1" aria-pressed="false">−</button>
            </div>
            <input class="match-point-input" type="number" inputmode="numeric" min="0" step="1" placeholder="例：420" />
            <span class="match-point-unit">00点</span>
          </div>
          <small class="match-point-converted">0点</small>
          <small class="auto-calculated-note" hidden>残り点数を自動入力</small>
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

    const signButtons = Array.from(row.querySelectorAll(".match-sign-button"));
    const setMatchSign = (sign) => {
      row.dataset.sign = String(sign);
      signButtons.forEach((button) => {
        const active = Number(button.dataset.sign) === sign;
        button.classList.toggle("is-active", active);
        button.setAttribute("aria-pressed", String(active));
      });
    };
    setMatchSign(existingResult && Number(existingResult.points) < 0 ? -1 : 1);
    if (existingResult) {
      pointInput.value = String(Math.abs(Number(existingResult.points)) / 100);
    }
    signButtons.forEach((button) => {
      button.addEventListener("click", () => {
        setMatchSign(Number(button.dataset.sign));
        updateMatchPointAssist();
        pointInput.focus();
      });
    });

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
        matchSaveNextButton.focus();
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
  const row = input.closest(".match-entry-row");
  const sign = points < 0 ? -1 : 1;
  if (row) {
    row.dataset.sign = String(sign);
    row.querySelectorAll(".match-sign-button").forEach((button) => {
      const active = Number(button.dataset.sign) === sign;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
  }
  input.value = String(Math.abs(points) / 100);
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

function getMatchInputPointValue(input) {
  const row = input.closest(".match-entry-row");
  const sign = Number(row?.dataset.sign || 1);
  const raw = input.value.trim();
  return raw === "" ? null : Number(raw) * 100 * sign;
}

function updateMatchPointConvertedLabels() {
  getMatchPointInputs().forEach((input) => {
    const value = getMatchInputPointValue(input);
    const label = input.closest("label")?.querySelector(".match-point-converted");
    if (label) {
      label.textContent = value === null || !Number.isFinite(value)
        ? "0点"
        : `${value.toLocaleString("ja-JP")}点`;
    }
  });
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
      .map((input) => getMatchInputPointValue(input));

    const canRecalculate = otherValues.every(
      (value) =>
        value !== null &&
        Number.isFinite(value) &&
        Number.isInteger(value),
    );

    if (!canRecalculate) {
      clearAutoCalculatedPoint(currentAutoInput, {
        clearValue: true,
      });
      return;
    }

    const otherTotal = otherValues.reduce(
      (sum, value) => sum + value,
      0,
    );
    const remaining = rule.requiredPointTotal - otherTotal;

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
  const allFilledValuesAreValid = filledInputs.every((input) => {
    const value = getMatchInputPointValue(input);
    return value !== null && Number.isFinite(value) && Number.isInteger(value);
  });

  if (!allFilledValuesAreValid) {
    return;
  }

  const filledTotal = filledInputs.reduce(
    (sum, input) => sum + getMatchInputPointValue(input),
    0,
  );
  const remaining = rule.requiredPointTotal - filledTotal;

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
  updateMatchPointConvertedLabels();
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

    const sign = Number(row.dataset.sign || 1);
    return {
      playerId,
      pointText,
      points: pointText === "" ? null : Number(pointText) * 100 * sign,
    };
  });
}

function getTiedEntryGroups(entries) {
  const groups = new Map();

  entries.forEach((entry) => {
    if (
      !entry.playerId ||
      entry.points === null ||
      !Number.isFinite(entry.points)
    ) {
      return;
    }

    const key = String(entry.points);
    const group = groups.get(key) || [];
    group.push(entry);
    groups.set(key, group);
  });

  return Array.from(groups.entries())
    .filter(([, group]) => group.length > 1)
    .sort((a, b) => Number(b[0]) - Number(a[0]));
}

function syncTieBreakOrders(entries) {
  const tiedGroups = getTiedEntryGroups(entries);
  const activeKeys = new Set(tiedGroups.map(([key]) => key));

  Array.from(tieBreakOrderByPoints.keys()).forEach((key) => {
    if (!activeKeys.has(key)) {
      tieBreakOrderByPoints.delete(key);
    }
  });

  tiedGroups.forEach(([key, group]) => {
    const playerIds = group.map((entry) => entry.playerId);
    const currentOrder = tieBreakOrderByPoints.get(key) || [];
    const preserved = currentOrder.filter((playerId) =>
      playerIds.includes(playerId),
    );
    const missing = playerIds.filter(
      (playerId) => !preserved.includes(playerId),
    );

    tieBreakOrderByPoints.set(key, [...preserved, ...missing]);
  });
}

function moveTieBreakPlayer(pointsKey, playerId, direction) {
  const order = tieBreakOrderByPoints.get(pointsKey);

  if (!order) {
    return;
  }

  const currentIndex = order.indexOf(playerId);
  const nextIndex = currentIndex + direction;

  if (
    currentIndex < 0 ||
    nextIndex < 0 ||
    nextIndex >= order.length
  ) {
    return;
  }

  [order[currentIndex], order[nextIndex]] = [
    order[nextIndex],
    order[currentIndex],
  ];

  tieBreakOrderByPoints.set(pointsKey, order);
  updateMatchPreview();
}

function renderTieBreakControls(entries) {
  syncTieBreakOrders(entries);
  tieBreakList.replaceChildren();
  tieBreakError.textContent = "";

  const tiedGroups = getTiedEntryGroups(entries);

  if (tiedGroups.length === 0) {
    tieBreakSection.hidden = true;
    return;
  }

  const players = getEventPlayers();
  tieBreakSection.hidden = false;

  tiedGroups.forEach(([pointsKey]) => {
    const order = tieBreakOrderByPoints.get(pointsKey) || [];
    const groupElement = document.createElement("div");
    groupElement.className = "tie-break-group";

    const heading = document.createElement("div");
    heading.className = "tie-break-group-heading";
    heading.innerHTML = `
      <strong>${Number(pointsKey).toLocaleString("ja-JP")}点で同点</strong>
      <span>上が上位</span>
    `;
    groupElement.appendChild(heading);

    const guide = document.createElement("p");
    guide.className = "tie-break-guide";
    guide.textContent =
      "矢印で並べ替えてください。起家に近いプレイヤーを上にします。";
    groupElement.appendChild(guide);

    const orderElement = document.createElement("div");
    orderElement.className = "tie-break-order";

    order.forEach((playerId, index) => {
      const player = players.find(
        (item) => item.playerId === playerId,
      );
      const row = document.createElement("div");
      row.className = "tie-break-player";

      row.innerHTML = `
        <span class="tie-break-rank">${index + 1}</span>
        <span class="tie-break-player-name"></span>
        <span class="tie-break-controls">
          <button
            class="tie-break-move-button"
            type="button"
            data-direction="-1"
            aria-label="上位へ移動"
            ${index === 0 ? "disabled" : ""}
          >↑</button>
          <button
            class="tie-break-move-button"
            type="button"
            data-direction="1"
            aria-label="下位へ移動"
            ${index === order.length - 1 ? "disabled" : ""}
          >↓</button>
        </span>
      `;

      row.querySelector(".tie-break-player-name").textContent =
        player ? player.name : "不明なプレイヤー";

      row.querySelectorAll(".tie-break-move-button").forEach(
        (button) => {
          button.addEventListener("click", () => {
            moveTieBreakPlayer(
              pointsKey,
              playerId,
              Number(button.dataset.direction),
            );
          });
        },
      );

      orderElement.appendChild(row);
    });

    groupElement.appendChild(orderElement);
    tieBreakList.appendChild(groupElement);
  });
}

function getCurrentEventRankPoints() {
  const gameType = currentEvent?.gameType === "sanma" ? "sanma" : "yonma";
  const preset = String(currentEvent?.umaPreset || "");
  const presetScores = UMA_PRESETS[preset];

  if (presetScores && Array.isArray(presetScores[gameType])) {
    return presetScores[gameType];
  }

  const sheetScores = [
    Number(currentEvent?.rankScore1),
    Number(currentEvent?.rankScore2),
    Number(currentEvent?.rankScore3),
    Number(currentEvent?.rankScore4),
  ];
  const requiredCount = gameType === "sanma" ? 3 : 4;

  if (
    sheetScores.slice(0, requiredCount).every(Number.isFinite)
  ) {
    return sheetScores.slice(0, requiredCount);
  }

  throw new Error(
    "対局のウマ・オカ設定を読み込めませんでした。ページを再読み込みして、もう一度お試しください。",
  );
}

function calculateMatchResults(entries) {
  const players = getEventPlayers();
  const rule = getMatchRule();
  const rankPoints = getCurrentEventRankPoints();

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
    .sort((a, b) => {
      const pointDifference = b.points - a.points;

      if (pointDifference !== 0) {
        return pointDifference;
      }

      const order =
        tieBreakOrderByPoints.get(String(a.points)) || [];
      return order.indexOf(a.playerId) - order.indexOf(b.playerId);
    })
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

  const tiedGroups = getTiedEntryGroups(entries);

  for (const [pointsKey, group] of tiedGroups) {
    const playerIds = group.map((entry) => entry.playerId);
    const order = tieBreakOrderByPoints.get(pointsKey) || [];

    if (
      order.length !== playerIds.length ||
      new Set(order).size !== playerIds.length ||
      order.some((playerId) => !playerIds.includes(playerId))
    ) {
      return "同点プレイヤーの順位を指定してください。";
    }
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
  renderTieBreakControls(entries);

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
  const event = cloudEvents.find(
    (item) => item.eventId === currentEvent.eventId,
  );

  if (!event) {
    return;
  }

  const matchCount = getLocalMatches().filter(
    (match) => match.eventId === currentEvent.eventId,
  ).length;

  event.matchCount = matchCount;
  currentEvent = event;
}

async function handleMatchCreateSubmit(event) {
  event.preventDefault();

  const entries = readMatchEntries();
  const errorMessage = validateMatchEntries(entries);

  if (errorMessage) {
    matchEntryError.textContent = errorMessage;
    matchPreviewSection.hidden = true;
    return;
  }

  const isEditing = Boolean(currentEditingMatch);
  const requestedAction =
    event.submitter?.dataset.saveAction || "back";
  const shouldContinue =
    !isEditing && requestedAction === "next";

  setMatchSaveButtonsDisabled(true);

  if (isEditing) {
    matchSaveNextButton.textContent = "保存中...";
  } else if (shouldContinue) {
    matchSaveNextButton.textContent = "保存中...";
  } else {
    matchSaveBackButton.textContent = "保存中...";
  }

  try {
    const results = calculateMatchResults(entries);
    const matches = getLocalMatches();
    const now = new Date().toISOString();
    let savedMatchNumber = null;

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
        tieBreakOrderPlayerIds: Array.from(
          tieBreakOrderByPoints.values(),
        ).flat(),
        results,
        updatedAt: now,
      };
    } else {
      savedMatchNumber =
        matches.filter(
          (match) => match.eventId === currentEvent.eventId,
        ).length + 1;

      matches.push({
        matchId: `local-match-${Date.now()}`,
        eventId: currentEvent.eventId,
        gameType: currentEvent.gameType,
        umaPreset: currentEvent.umaPreset,
        entryOrderPlayerIds: entries.map(
          (entry) => entry.playerId,
        ),
        tieBreakOrderPlayerIds: Array.from(
          tieBreakOrderByPoints.values(),
        ).flat(),
        results,
        createdAt: now,
        updatedAt: now,
      });
    }

    const targetMatch = currentEditingMatch
      ? matches.find((match) => match.matchId === currentEditingMatch.matchId)
      : matches[matches.length - 1];
    await saveMatchOnSheet(targetMatch);
    updatePlayersFromMatch();
    syncEventMatchCount();
    currentEditingMatch = null;

    if (shouldContinue) {
      prepareMatchForm();
      showContinuousMatchSavedMessage(savedMatchNumber);
    } else {
      showEventDetailScreen(currentEvent, { scrollToTop: true });
    }
  } catch (error) {
    console.error(error);

    matchCreateMessage.textContent =
      error instanceof Error
        ? error.message
        : "半荘結果の保存中にエラーが発生しました。";
    matchCreateMessage.className =
      "form-message is-error";
  } finally {
    setMatchSaveButtonsDisabled(false);
    restoreMatchSaveButtonLabels(isEditing);
  }
}

async function handleMatchDelete() {
  if (!currentEditingMatch) {
    return;
  }

  const confirmed = window.confirm(
    "この半荘結果を削除しますか？\n削除すると、参加プレイヤーの成績も再集計されます。",
  );

  if (!confirmed) {
    return;
  }

  setMatchSaveButtonsDisabled(true);
  matchDeleteButton.textContent = "削除中...";

  try {
    await deleteMatchOnSheet(currentEditingMatch.matchId);
    updatePlayersFromMatch();
    syncEventMatchCount();
    currentEditingMatch = null;
    showEventDetailScreen(currentEvent, { scrollToTop: true });
  } catch (error) {
    console.error(error);

    matchCreateMessage.textContent =
      "半荘結果の削除中にエラーが発生しました。";
    matchCreateMessage.className =
      "form-message is-error";
  } finally {
    setMatchSaveButtonsDisabled(false);
    restoreMatchSaveButtonLabels(false);
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

async function createLocalPlayer(name) {
  return createPlayerOnSheet(name);
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

async function handleFrequentPlayerAdd(name, button) {
  if (!currentEvent || button.disabled) {
    return;
  }

  button.disabled = true;
  button.classList.add("is-adding");
  button.textContent = "追加中...";

  playerAddMessage.textContent = "";
  playerAddMessage.className = "form-message";

  try {
    await createLocalPlayer(name);

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

async function handlePlayerAddSubmit(event) {
  event.preventDefault();

  if (!validatePlayerForm()) {
    return;
  }

  playerSaveButton.disabled = true;
  playerSaveButton.textContent = "追加中...";

  try {
    const addedName = playerNameInput.value.trim();
    await createLocalPlayer(addedName);
    playerNameInput.value = "";
    playerAddMessage.textContent =
      `${addedName}を追加しました。続けて別のプレイヤーも追加できます。`;
    playerAddMessage.className = "form-message is-success";
    renderRegisteredPlayers();
    renderFrequentPlayerCandidates();
    window.setTimeout(() => playerNameInput.focus(), 0);
  } catch (error) {
    console.error(error);

    playerAddMessage.textContent =
      error instanceof Error
        ? error.message
        : "プレイヤーの追加中にエラーが発生しました。";
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

function getTodayEventName() {
  const today = new Date();
  return `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`;
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

  const name = eventNameInput.value.trim() || getTodayEventName();
  eventNameInput.value = name;

  if (name.length > 40) {
    eventNameError.textContent =
      "対局名は40文字以内で入力してください。";
    eventNameInput.classList.add("input-error");
    return false;
  }

  return true;
}

async function handleEventCreateSubmit(event) {
  event.preventDefault();

  if (!validateEventForm()) {
    return;
  }

  eventSaveButton.disabled = true;
  eventSaveButton.textContent = "作成中...";

  try {
    const createdEvent = await callGasApi("createEvent", {
      ownerUserId: currentUser.userId,
      name: eventNameInput.value.trim() || getTodayEventName(),
      eventType: getSelectedRadioValue("eventType"),
      gameType: getSelectedRadioValue("gameType"),
      umaPreset: umaPresetSelect.value,
      status: "active",
    });

    cloudEvents.push(normalizeCloudEvent(createdEvent));
    loadedEventOwnerUserId = currentUser.userId;

    currentEventStatus = "active";
    switchEventStatus("active");
    eventCreateForm.reset();
    updateScorePreview();
    showEventListScreen();
  } catch (error) {
    console.error(error);

    eventCreateMessage.textContent =
      error.message ||
      "対局の作成中にエラーが発生しました。";
    eventCreateMessage.className =
      "form-message is-error";
  } finally {
    eventSaveButton.disabled = false;
    eventSaveButton.textContent = "対局を作成";
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
  eventNameInput.value = getTodayEventName();
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

standingsAllButton.addEventListener("click", () => {
  setStandingsMode("all");
});

standingsRangeButton.addEventListener("click", () => {
  setStandingsMode("range");
});

rangeSelectAllButton.addEventListener(
  "click",
  selectAllRangeRecords,
);

rangeClearButton.addEventListener(
  "click",
  clearRangeRecords,
);

rangeToLatestButton.addEventListener(
  "click",
  selectFromOldestSelectedToLatest,
);


matchCreateBackButton.addEventListener("click", () => {
  currentEditingMatch = null;
  showEventDetailScreen(currentEvent, { scrollToTop: true });
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
  showEventDetailScreen(currentEvent, { scrollToTop: true });
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
  showEventDetailScreen(currentEvent, { scrollToTop: true });
});

playerAddForm.addEventListener(
  "submit",
  handlePlayerAddSubmit,
);
playerFinishButton.addEventListener("click", () => {
  showEventDetailScreen(currentEvent, { scrollToTop: true });
});

connectionTestButton.addEventListener(
  "click",
  handleConnectionTest,
);

playerNameInput.addEventListener("input", () => {
  playerNameError.textContent = "";
  playerNameInput.classList.remove("input-error");
  playerAddMessage.textContent = "";
  playerAddMessage.className = "form-message";
});

initializeApp();
