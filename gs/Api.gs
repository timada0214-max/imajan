"use strict";

/**
 * STEP12-7: Spreadsheetアクセス削減とMatchResults書込最適化を追加。
 * STEP12-1: API処理時間を計測するための簡易コンテキストです。
 * 通常のAPIレスポンスには影響せず、GASの実行ログだけへ出力します。
 */
let activePerformanceContext_ = null;

/**
 * STEP12-5: Spreadsheet読込と画面レスポンスを短時間キャッシュします。
 * CacheServiceは値ごとに容量上限があるため、保存できない場合は
 * キャッシュを使わず通常処理へ自動的に戻ります。
 */
const CACHE_CONFIG_ = Object.freeze({
  SHEET_TTL_SECONDS: 300,
  EVENT_LIST_TTL_SECONDS: 300,
  EVENT_DETAIL_TTL_SECONDS: 30,
  MAX_VALUE_BYTES: 95000,
});

function getAppCache_() {
  return CacheService.getScriptCache();
}

function buildCacheKey_(type, id) {
  const spreadsheetId = getAppSpreadsheet_().getId();
  return ["imajan", APP_CONFIG.API_VERSION, spreadsheetId, type, String(id || "all")]
    .join(":");
}

function logCache_(label, status) {
  const action = activePerformanceContext_
    ? activePerformanceContext_.action
    : "unknown";
  console.log("[PERF][CACHE][" + action + "][" + label + "] " + status);
}

function readJsonCache_(key, label) {
  try {
    const cached = getAppCache_().get(key);
    if (!cached) {
      logCache_(label, "MISS");
      return null;
    }

    const parsed = JSON.parse(cached);
    logCache_(label, "HIT");
    return parsed;
  } catch (error) {
    console.warn("[PERF][CACHE][" + label + "] READ_ERROR: " + error.message);
    return null;
  }
}

function writeJsonCache_(key, value, ttlSeconds, label) {
  try {
    const json = JSON.stringify(value);
    const bytes = Utilities.newBlob(json).getBytes().length;

    if (bytes > CACHE_CONFIG_.MAX_VALUE_BYTES) {
      logCache_(label, "SKIP_TOO_LARGE:" + bytes + "bytes");
      return false;
    }

    getAppCache_().put(key, json, ttlSeconds);
    logCache_(label, "PUT:" + bytes + "bytes");
    return true;
  } catch (error) {
    console.warn("[PERF][CACHE][" + label + "] WRITE_ERROR: " + error.message);
    return false;
  }
}

function removeCacheKeys_(keys, label) {
  const uniqueKeys = keys.filter(function (key, index, array) {
    return key && array.indexOf(key) === index;
  });

  if (uniqueKeys.length === 0) {
    return;
  }

  try {
    getAppCache_().removeAll(uniqueKeys);
    logCache_(label, "INVALIDATE:" + uniqueKeys.length);
  } catch (error) {
    console.warn("[PERF][CACHE][" + label + "] INVALIDATE_ERROR: " + error.message);
  }
}

function getCachedSheetRecordsWithPerf_(sheet) {
  const sheetName = sheet.getName();

  // 同一API実行中に同じシートを複数回要求された場合は、
  // CacheServiceへも再アクセスせず、実行中メモリの値を使い回します。
  if (
    activePerformanceContext_ &&
    Object.prototype.hasOwnProperty.call(
      activePerformanceContext_.requestRecordCache,
      sheetName
    )
  ) {
    logCache_("request:" + sheetName, "HIT");
    return activePerformanceContext_.requestRecordCache[sheetName];
  }

  const key = buildCacheKey_("sheet", sheetName);
  const cached = readJsonCache_(key, "sheet:" + sheetName);

  if (cached !== null) {
    if (activePerformanceContext_) {
      activePerformanceContext_.requestRecordCache[sheetName] = cached;
    }
    return cached;
  }

  const records = getSheetRecordsWithPerf_(sheet);
  if (activePerformanceContext_) {
    activePerformanceContext_.requestRecordCache[sheetName] = records;
  }
  writeJsonCache_(
    key,
    records,
    CACHE_CONFIG_.SHEET_TTL_SECONDS,
    "sheet:" + sheetName
  );
  return records;
}

function invalidateSheetCache_(sheetName) {
  removeCacheKeys_([
    buildCacheKey_("sheet", sheetName),
  ], "sheet:" + sheetName);

  if (activePerformanceContext_) {
    delete activePerformanceContext_.requestRecordCache[sheetName];
  }
}

function invalidateMatchDataCaches_() {
  [
    APP_CONFIG.SHEETS.MATCHES,
    APP_CONFIG.SHEETS.MATCH_RESULTS,
  ].forEach(invalidateSheetCache_);
}

function invalidateAdjustmentDataCaches_() {
  [
    APP_CONFIG.SHEETS.ADJUSTMENTS,
    APP_CONFIG.SHEETS.ADJUSTMENT_ENTRIES,
  ].forEach(invalidateSheetCache_);
}

function invalidateOwnerCaches_(ownerUserId, options) {
  const normalizedOwnerUserId = String(ownerUserId || "").trim();
  if (!normalizedOwnerUserId) {
    return;
  }

  const settings = options || {};
  const keys = [];

  if (settings.eventList) {
    keys.push(buildCacheKey_("eventList", normalizedOwnerUserId));
  }
  if (settings.eventDetail) {
    keys.push(buildCacheKey_("eventDetail", normalizedOwnerUserId));
  }

  removeCacheKeys_(keys, "owner:" + normalizedOwnerUserId);
}

function startPerformanceContext_(action) {
  activePerformanceContext_ = {
    action: String(action || "unknown"),
    startedAt: Date.now(),
    lastMarkedAt: Date.now(),
    sheetReads: {},
    steps: [],
    requestRecordCache: {},
  };

  console.log(
    "[PERF][" + activePerformanceContext_.action + "] START"
  );
}

function markPerformance_(label) {
  if (!activePerformanceContext_) {
    return;
  }

  const now = Date.now();
  const elapsedMs = now - activePerformanceContext_.lastMarkedAt;
  activePerformanceContext_.steps.push({
    label: String(label),
    elapsedMs: elapsedMs,
  });
  console.log(
    "[PERF][" +
      activePerformanceContext_.action +
      "] " +
      String(label) +
      ": " +
      elapsedMs +
      "ms"
  );
  activePerformanceContext_.lastMarkedAt = now;
}

function getPerformanceSnapshot_() {
  if (!activePerformanceContext_) {
    return null;
  }

  const context = activePerformanceContext_;
  const sheetReads = {};
  Object.keys(context.sheetReads).forEach(function (sheetName) {
    const item = context.sheetReads[sheetName];
    sheetReads[sheetName] = {
      count: item.count,
      totalMs: item.totalMs,
    };
  });

  return {
    action: context.action,
    totalMs: Date.now() - context.startedAt,
    steps: context.steps.slice(),
    sheetReads: sheetReads,
  };
}

function attachPerformance_(data) {
  if (!data || typeof data !== "object") {
    return data;
  }
  data.__performance = getPerformanceSnapshot_();
  return data;
}

function finishPerformanceContext_(status) {
  if (!activePerformanceContext_) {
    return;
  }

  const context = activePerformanceContext_;
  const totalMs = Date.now() - context.startedAt;
  const sheetSummary = Object.keys(context.sheetReads)
    .map(function (sheetName) {
      const item = context.sheetReads[sheetName];
      return (
        sheetName +
        "=" +
        item.totalMs +
        "ms/" +
        item.count +
        "回"
      );
    })
    .join(", ");

  console.log(
    "[PERF][" +
      context.action +
      "] END " +
      String(status || "success") +
      ": " +
      totalMs +
      "ms" +
      (sheetSummary ? " | SHEETS " + sheetSummary : "")
  );

  activePerformanceContext_ = null;
}

/**
 * Api.gs内のシート読込を計測します。
 * 元のgetSheetRecords_の戻り値はそのまま返します。
 */
function getSheetRecordsWithPerf_(sheet) {
  const startedAt = Date.now();
  const records = getSheetRecords_(sheet);
  const elapsedMs = Date.now() - startedAt;

  if (activePerformanceContext_) {
    const sheetName = sheet ? sheet.getName() : "unknown";
    const current = activePerformanceContext_.sheetReads[sheetName] || {
      count: 0,
      totalMs: 0,
    };
    current.count += 1;
    current.totalMs += elapsedMs;
    activePerformanceContext_.sheetReads[sheetName] = current;

    console.log(
      "[PERF][" +
        activePerformanceContext_.action +
        "] READ " +
        sheetName +
        ": " +
        elapsedMs +
        "ms (" +
        records.length +
        "件)"
    );
    activePerformanceContext_.lastMarkedAt = Date.now();
  }

  return records;
}

function routeApiRequest_(action, payload) {
  startPerformanceContext_(action);

  try {
    switch (action) {
    case "ping":
      return apiPing_();

    case "createUser":
      return apiCreateUser_(payload);

    case "loginUser":
      return apiLoginUser_(payload);

    case "createEvent":
      return apiCreateEvent_(payload);

    case "listEvents":
      return apiListEvents_(payload);

    case "createPlayer":
      return apiCreatePlayer_(payload);

    case "createPlayers":
      return apiCreatePlayers_(payload);

    case "listPlayers":
      return apiListPlayers_(payload);

    case "saveMatch":
      return apiSaveMatch_(payload);

    case "listMatches":
      return apiListMatches_(payload);

    case "deleteMatch":
      return apiDeleteMatch_(payload);

    case "saveAdjustment":
      return apiSaveAdjustment_(payload);

    case "listAdjustments":
      return apiListAdjustments_(payload);

    case "getEventDetailData":
      return apiGetEventDetailData_(payload);

    case "deleteAdjustment":
      return apiDeleteAdjustment_(payload);

    default:
      const notFoundError = new Error(
        "指定されたAPI操作は存在しません: " + action
      );
      notFoundError.code = "ACTION_NOT_FOUND";
      throw notFoundError;
    }
  } catch (error) {
    finishPerformanceContext_(
      "error:" + String((error && error.code) || "UNKNOWN")
    );
    throw error;
  } finally {
    if (activePerformanceContext_) {
      finishPerformanceContext_("success");
    }
  }
}

function apiPing_() {
  const spreadsheet = getAppSpreadsheet_();
  const missingSheets = SHEET_DEFINITIONS
    .map(function (definition) {
      return definition.name;
    })
    .filter(function (sheetName) {
      return !spreadsheet.getSheetByName(sheetName);
    });

  if (missingSheets.length > 0) {
    const setupError = new Error(
      "初期設定が完了していません。setupSpreadsheetを実行してください。不足シート: " +
        missingSheets.join(", ")
    );
    setupError.code = "SETUP_REQUIRED";
    throw setupError;
  }

  return {
    appName: APP_CONFIG.APP_NAME,
    apiVersion: APP_CONFIG.API_VERSION,
    spreadsheetId: spreadsheet.getId(),
    spreadsheetName: spreadsheet.getName(),
    sheetCount: SHEET_DEFINITIONS.length,
    serverTime: getNowIso_(),
  };
}


function apiCreateUser_(payload) {
  validateUserPayload_(payload);

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    const sheet = getSheetByNameOrThrow_(
      APP_CONFIG.SHEETS.USERS
    );
    const nickname = String(payload.nickname).trim();
    const users = getSheetRecordsWithPerf_(sheet);
    const duplicatedUser = users.find(function (user) {
      return (
        String(user.nickname).trim().toLowerCase() ===
        nickname.toLowerCase()
      );
    });

    if (duplicatedUser) {
      const duplicateError = new Error(
        "同じニックネームが既に登録されています。"
      );
      duplicateError.code = "DUPLICATE_NICKNAME";
      throw duplicateError;
    }

    const now = getNowIso_();
    const userId =
      String(payload.preferredUserId || "").trim() ||
      createId_("user");

    sheet.appendRow([
      userId,
      nickname,
      createPinHash_(payload.pin),
      "active",
      now,
      now,
    ]);

    return {
      userId: userId,
      nickname: nickname,
      createdAt: now,
    };
  } finally {
    lock.releaseLock();
  }
}

function apiLoginUser_(payload) {
  validateUserPayload_(payload);

  const sheet = getSheetByNameOrThrow_(
    APP_CONFIG.SHEETS.USERS
  );
  const nickname = String(payload.nickname).trim();
  const user = getSheetRecordsWithPerf_(sheet).find(function (item) {
    return (
      String(item.nickname).trim().toLowerCase() ===
      nickname.toLowerCase()
    );
  });

  if (!user) {
    const notFoundError = new Error(
      "ニックネームまたは暗証番号が正しくありません。先に新規登録してください。"
    );
    notFoundError.code = "USER_NOT_FOUND";
    throw notFoundError;
  }

  if (
    String(user.status || "active") !== "active" ||
    !verifyPinHash_(payload.pin, user.pinHash)
  ) {
    const authenticationError = new Error(
      "ニックネームまたは暗証番号が正しくありません。"
    );
    authenticationError.code = "AUTHENTICATION_FAILED";
    throw authenticationError;
  }

  return {
    userId: String(user.userId),
    nickname: String(user.nickname),
    createdAt:
      user.createdAt instanceof Date
        ? user.createdAt.toISOString()
        : String(user.createdAt || ""),
  };
}

function validateUserPayload_(payload) {
  if (!payload || typeof payload !== "object") {
    const payloadError = new Error(
      "ユーザー情報が送信されていません。"
    );
    payloadError.code = "INVALID_USER_PAYLOAD";
    throw payloadError;
  }

  const nickname = String(payload.nickname || "").trim();
  const pin = String(payload.pin || "");

  if (nickname.length < 1 || nickname.length > 20) {
    const nicknameError = new Error(
      "ニックネームは1文字以上20文字以内で入力してください。"
    );
    nicknameError.code = "INVALID_NICKNAME";
    throw nicknameError;
  }

  if (!/^\d{4}$/.test(pin)) {
    const pinError = new Error(
      "暗証番号は4桁の数字で入力してください。"
    );
    pinError.code = "INVALID_PIN";
    throw pinError;
  }
}


function apiCreateEvent_(payload) {
  validateEventPayload_(payload);

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    const sheet = getSheetByNameOrThrow_(
      APP_CONFIG.SHEETS.EVENTS
    );
    const events = getCachedSheetRecordsWithPerf_(sheet);
    const preferredEventId = String(
      payload.preferredEventId || ""
    ).trim();

    if (preferredEventId) {
      const existingEvent = events.find(function (event) {
        return String(event.eventId) === preferredEventId;
      });

      if (existingEvent) {
        if (
          String(existingEvent.ownerUserId) !==
          String(payload.ownerUserId)
        ) {
          const ownershipError = new Error(
            "同じイベントIDが別のユーザーに使用されています。"
          );
          ownershipError.code = "EVENT_ID_CONFLICT";
          throw ownershipError;
        }

        return serializeEventRecord_(
          existingEvent,
          getMatchCountMap_()
        );
      }
    }

    const eventRule = buildEventRuleFromPayload_(payload);
    const rankScores = calculateRankScores_(eventRule);
    const oka = calculateOka_(eventRule);
    const now = getNowIso_();
    const createdAt =
      normalizeOptionalIso_(payload.createdAt) || now;
    const updatedAt =
      normalizeOptionalIso_(payload.updatedAt) || createdAt;
    const eventId =
      preferredEventId || createId_("event");

    sheet.appendRow([
      eventId,
      String(payload.ownerUserId),
      String(payload.name).trim(),
      String(payload.eventType),
      String(payload.gameType),
      eventRule.ruleMode,
      eventRule.rulePreset,
      eventRule.startingPoints,
      eventRule.returnPoints,
      eventRule.umaByRank[0] || 0,
      eventRule.umaByRank[1] || 0,
      eventRule.umaByRank[2] || 0,
      eventRule.umaByRank[3] || 0,
      oka,
      rankScores[0] || 0,
      rankScores[1] || 0,
      rankScores[2] || 0,
      rankScores[3] || 0,
      String(payload.status || "active"),
      createdAt,
      updatedAt,
    ]);

    invalidateSheetCache_(APP_CONFIG.SHEETS.EVENTS);
    invalidateOwnerCaches_(payload.ownerUserId, {
      eventList: true,
      eventDetail: true,
    });

    return {
      eventId: eventId,
      ownerUserId: String(payload.ownerUserId),
      name: String(payload.name).trim(),
      eventType: String(payload.eventType),
      gameType: String(payload.gameType),
      ruleMode: eventRule.ruleMode,
      rulePreset: eventRule.rulePreset,
      umaPreset: eventRule.rulePreset,
      startingPoints: eventRule.startingPoints,
      returnPoints: eventRule.returnPoints,
      uma1: Number(eventRule.umaByRank[0] || 0),
      uma2: Number(eventRule.umaByRank[1] || 0),
      uma3: Number(eventRule.umaByRank[2] || 0),
      uma4: Number(eventRule.umaByRank[3] || 0),
      oka: oka,
      rankScore1: Number(rankScores[0] || 0),
      rankScore2: Number(rankScores[1] || 0),
      rankScore3: Number(rankScores[2] || 0),
      rankScore4: Number(rankScores[3] || 0),
      status: String(payload.status || "active"),
      matchCount: 0,
      createdAt: createdAt,
      updatedAt: updatedAt,
    };
  } finally {
    lock.releaseLock();
  }
}

function apiListEvents_(payload) {
  const ownerUserId = String(
    payload && payload.ownerUserId
      ? payload.ownerUserId
      : ""
  ).trim();

  if (!ownerUserId) {
    const ownerError = new Error(
      "ユーザーIDが指定されていません。"
    );
    ownerError.code = "INVALID_OWNER_USER_ID";
    throw ownerError;
  }

  const cacheKey = buildCacheKey_("eventList", ownerUserId);
  const cachedEvents = readJsonCache_(cacheKey, "eventList");
  if (cachedEvents !== null) {
    return cachedEvents;
  }

  const sheet = getSheetByNameOrThrow_(
    APP_CONFIG.SHEETS.EVENTS
  );
  const matchCountMap = getMatchCountMap_();

  const events = getCachedSheetRecordsWithPerf_(sheet)
    .filter(function (event) {
      return String(event.ownerUserId) === ownerUserId;
    })
    .map(function (event) {
      return serializeEventRecord_(
        event,
        matchCountMap
      );
    })
    .sort(function (a, b) {
      return (
        new Date(b.updatedAt).getTime() -
        new Date(a.updatedAt).getTime()
      );
    });

  writeJsonCache_(
    cacheKey,
    events,
    CACHE_CONFIG_.EVENT_LIST_TTL_SECONDS,
    "eventList"
  );
  return events;
}

function validateEventPayload_(payload) {
  if (!payload || typeof payload !== "object") {
    const payloadError = new Error(
      "イベント情報が送信されていません。"
    );
    payloadError.code = "INVALID_EVENT_PAYLOAD";
    throw payloadError;
  }

  const ownerUserId = String(
    payload.ownerUserId || ""
  ).trim();
  const name = String(payload.name || "").trim();
  const eventType = String(payload.eventType || "");
  const gameType = String(payload.gameType || "");
  const status = String(payload.status || "active");

  if (!ownerUserId) {
    const ownerError = new Error(
      "ユーザーIDが指定されていません。"
    );
    ownerError.code = "INVALID_OWNER_USER_ID";
    throw ownerError;
  }

  if (name.length < 1 || name.length > 40) {
    const nameError = new Error(
      "イベント名は1文字以上40文字以内で入力してください。"
    );
    nameError.code = "INVALID_EVENT_NAME";
    throw nameError;
  }

  if (["league", "single"].indexOf(eventType) === -1) {
    const typeError = new Error(
      "イベント種別が正しくありません。"
    );
    typeError.code = "INVALID_EVENT_TYPE";
    throw typeError;
  }

  if (["yonma", "sanma"].indexOf(gameType) === -1) {
    const gameError = new Error(
      "麻雀種別が正しくありません。"
    );
    gameError.code = "INVALID_GAME_TYPE";
    throw gameError;
  }

  if (["active", "completed"].indexOf(status) === -1) {
    const statusError = new Error(
      "イベント状態が正しくありません。"
    );
    statusError.code = "INVALID_EVENT_STATUS";
    throw statusError;
  }

  buildEventRuleFromPayload_(payload);
}

/**
 * STEP10-2ではフロント画面をまだ変更しないため、現在のumaPresetも受け取れます。
 * 次STEPで画面をルール入力方式へ変更した後も、同じ関数を使用します。
 */
function buildEventRuleFromPayload_(payload) {
  const gameType = String(payload.gameType || "");
  const playerCount = gameType === "sanma" ? 3 : 4;
  const explicitRuleMode = String(payload.ruleMode || "").trim();

  if (explicitRuleMode === "manual") {
    const manualRule = normalizeMahjongRule_({
      playerCount: playerCount,
      startingPoints: payload.startingPoints,
      returnPoints: payload.returnPoints,
      umaByRank: [
        payload.uma1,
        payload.uma2,
        payload.uma3,
        payload.uma4,
      ].slice(0, playerCount),
    });

    return {
      playerCount: playerCount,
      ruleMode: "manual",
      rulePreset: "custom",
      startingPoints: manualRule.startingPoints,
      returnPoints: manualRule.returnPoints,
      umaByRank: manualRule.umaByRank,
    };
  }

  const presetName = String(
    payload.rulePreset || payload.umaPreset || "10-30"
  ).trim();

  return getEventRulePreset_(presetName, gameType);
}

function getEventRulePreset_(presetName, gameType) {
  const presets = {
    yonma: {
      "10-30": {
        startingPoints: 25000,
        returnPoints: 30000,
        umaByRank: [30, 10, -10, -30],
      },
      "10-20": {
        startingPoints: 25000,
        returnPoints: 30000,
        umaByRank: [20, 10, -10, -20],
      },
      "5-10": {
        startingPoints: 25000,
        returnPoints: 30000,
        umaByRank: [10, 5, -5, -10],
      },
      none: {
        startingPoints: 30000,
        returnPoints: 30000,
        umaByRank: [0, 0, 0, 0],
      },
    },
    sanma: {
      "30-0-30": {
        startingPoints: 35000,
        returnPoints: 40000,
        umaByRank: [30, 0, -30],
      },
      "20-0-20": {
        startingPoints: 35000,
        returnPoints: 40000,
        umaByRank: [20, 0, -20],
      },
      "15-0-15": {
        startingPoints: 35000,
        returnPoints: 40000,
        umaByRank: [15, 0, -15],
      },
      none: {
        startingPoints: 35000,
        returnPoints: 35000,
        umaByRank: [0, 0, 0],
      },
      "10-30": {
        startingPoints: 35000,
        returnPoints: 40000,
        umaByRank: [25, 0, -25],
      },
      "10-20": {
        startingPoints: 35000,
        returnPoints: 40000,
        umaByRank: [20, 0, -20],
      },
      "5-10": {
        startingPoints: 35000,
        returnPoints: 40000,
        umaByRank: [10, 0, -10],
      },
    },
  };

  if (!presets[gameType] || !presets[gameType][presetName]) {
    const error = new Error("ルールプリセットが正しくありません。");
    error.code = "INVALID_RULE_PRESET";
    throw error;
  }

  const normalizedRule = normalizeMahjongRule_({
    playerCount: gameType === "sanma" ? 3 : 4,
    startingPoints: presets[gameType][presetName].startingPoints,
    returnPoints: presets[gameType][presetName].returnPoints,
    umaByRank: presets[gameType][presetName].umaByRank,
  });

  return {
    playerCount: normalizedRule.playerCount,
    ruleMode: "preset",
    rulePreset: presetName,
    startingPoints: normalizedRule.startingPoints,
    returnPoints: normalizedRule.returnPoints,
    umaByRank: normalizedRule.umaByRank,
  };
}

function getMatchCountMap_() {
  const sheet = getSheetByNameOrThrow_(
    APP_CONFIG.SHEETS.MATCHES
  );
  const countMap = {};

  getSheetRecordsWithPerf_(sheet).forEach(function (match) {
    const eventId = String(match.eventId);
    countMap[eventId] =
      (countMap[eventId] || 0) + 1;
  });

  return countMap;
}

function serializeEventRecord_(event, matchCountMap) {
  return {
    eventId: String(event.eventId),
    ownerUserId: String(event.ownerUserId),
    name: String(event.name),
    eventType: String(event.eventType),
    gameType: String(event.gameType),
    ruleMode: String(event.ruleMode || "preset"),
    rulePreset: String(event.rulePreset || ""),
    umaPreset: String(event.rulePreset || ""),
    startingPoints: Number(event.startingPoints || 0),
    returnPoints: Number(event.returnPoints || 0),
    uma1: Number(event.uma1 || 0),
    uma2: Number(event.uma2 || 0),
    uma3: Number(event.uma3 || 0),
    uma4: Number(event.uma4 || 0),
    oka: Number(event.oka || 0),
    rankScore1: Number(event.rankScore1 || 0),
    rankScore2: Number(event.rankScore2 || 0),
    rankScore3: Number(event.rankScore3 || 0),
    rankScore4: Number(event.rankScore4 || 0),
    status: String(event.status || "active"),
    matchCount:
      matchCountMap[String(event.eventId)] || 0,
    createdAt: toIsoString_(event.createdAt),
    updatedAt: toIsoString_(event.updatedAt),
  };
}

function apiCreatePlayer_(payload) {
  validatePlayerPayload_(payload);

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    const ownerUserId = String(payload.ownerUserId).trim();
    const eventId = String(payload.eventId).trim();
    assertEventOwnership_(eventId, ownerUserId);
    markPerformance_("VERIFY_EVENT_OWNERSHIP");

    const sheet = getSheetByNameOrThrow_(
      APP_CONFIG.SHEETS.PLAYERS
    );
    const players = getCachedSheetRecordsWithPerf_(sheet);
    markPerformance_("READ_PLAYERS");
    const preferredPlayerId = String(
      payload.preferredPlayerId || ""
    ).trim();

    if (preferredPlayerId) {
      const existingPlayer = players.find(function (player) {
        return String(player.playerId) === preferredPlayerId;
      });

      if (existingPlayer) {
        if (String(existingPlayer.eventId) !== eventId) {
          const conflictError = new Error(
            "同じプレイヤーIDが別のイベントに使用されています。"
          );
          conflictError.code = "PLAYER_ID_CONFLICT";
          throw conflictError;
        }

        return serializePlayerRecord_(existingPlayer);
      }
    }

    const name = String(payload.name).trim();
    const duplicatedPlayer = players.find(function (player) {
      return (
        String(player.eventId) === eventId &&
        String(player.name).trim().toLowerCase() ===
          name.toLowerCase()
      );
    });

    if (duplicatedPlayer) {
      const duplicateError = new Error(
        "同じ名前のプレイヤーが既に登録されています。"
      );
      duplicateError.code = "DUPLICATE_PLAYER_NAME";
      throw duplicateError;
    }

    const now = getNowIso_();
    const createdAt =
      normalizeOptionalIso_(payload.createdAt) || now;
    const updatedAt =
      normalizeOptionalIso_(payload.updatedAt) || createdAt;
    const playerId =
      preferredPlayerId || createId_("player");
    const sortOrder = Number.isFinite(Number(payload.sortOrder))
      ? Number(payload.sortOrder)
      : players.filter(function (player) {
          return String(player.eventId) === eventId;
        }).length + 1;

    markPerformance_("VALIDATE_DUPLICATE_AND_BUILD_ROW");
    sheet.appendRow([
      playerId,
      eventId,
      name,
      sortOrder,
      createdAt,
      updatedAt,
    ]);
    markPerformance_("WRITE_PLAYER");
    invalidateSheetCache_(APP_CONFIG.SHEETS.PLAYERS);
    invalidateOwnerCaches_(ownerUserId, {
      eventDetail: true,
    });

    markPerformance_("RETURN_RESPONSE");
    return attachPerformance_({
      playerId: playerId,
      eventId: eventId,
      name: name,
      sortOrder: sortOrder,
      createdAt: createdAt,
      updatedAt: updatedAt,
    });
  } finally {
    lock.releaseLock();
  }
}


/**
 * 複数プレイヤーを1回のAPI通信・1回のsetValuesで一括登録します。
 * 1件でも入力不備や重複があれば、全件を保存せずエラーにします。
 */
function apiCreatePlayers_(payload) {
  const ownerUserId = String(
    payload && payload.ownerUserId ? payload.ownerUserId : ""
  ).trim();
  const eventId = String(
    payload && payload.eventId ? payload.eventId : ""
  ).trim();
  const names = Array.isArray(payload && payload.names)
    ? payload.names.map(function (name) {
        return String(name || "").trim();
      }).filter(Boolean)
    : [];

  if (!ownerUserId) {
    const ownerError = new Error("ユーザーIDが指定されていません。");
    ownerError.code = "INVALID_OWNER_USER_ID";
    throw ownerError;
  }
  if (!eventId) {
    const eventError = new Error("イベントIDが指定されていません。");
    eventError.code = "INVALID_EVENT_ID";
    throw eventError;
  }
  if (names.length === 0) {
    const namesError = new Error(
      "プレイヤー名を1人以上入力してください。"
    );
    namesError.code = "INVALID_PLAYER_NAMES";
    throw namesError;
  }
  if (names.length > 20) {
    const limitError = new Error(
      "一度に登録できるプレイヤーは20人までです。"
    );
    limitError.code = "TOO_MANY_PLAYERS";
    throw limitError;
  }

  names.forEach(function (name) {
    if (name.length > 20) {
      const lengthError = new Error(
        "プレイヤー名は20文字以内で入力してください。"
      );
      lengthError.code = "PLAYER_NAME_TOO_LONG";
      throw lengthError;
    }
  });

  const normalizedInputNames = names.map(function (name) {
    return name.toLowerCase();
  });
  const inputNameSet = Object.create(null);
  normalizedInputNames.forEach(function (name, index) {
    if (inputNameSet[name]) {
      const duplicateInputError = new Error(
        "入力されたプレイヤー名が重複しています: " + names[index]
      );
      duplicateInputError.code = "DUPLICATE_INPUT_PLAYER_NAME";
      throw duplicateInputError;
    }
    inputNameSet[name] = true;
  });

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    assertEventOwnership_(eventId, ownerUserId);
    markPerformance_("VERIFY_EVENT_OWNERSHIP");

    const sheet = getSheetByNameOrThrow_(APP_CONFIG.SHEETS.PLAYERS);
    const players = getCachedSheetRecordsWithPerf_(sheet);
    markPerformance_("READ_PLAYERS");

    const existingNameSet = Object.create(null);
    let currentEventPlayerCount = 0;
    players.forEach(function (player) {
      if (String(player.eventId) !== eventId) {
        return;
      }
      currentEventPlayerCount += 1;
      existingNameSet[String(player.name).trim().toLowerCase()] = true;
    });

    names.forEach(function (name) {
      if (existingNameSet[name.toLowerCase()]) {
        const duplicateError = new Error(
          "同じ名前のプレイヤーが既に登録されています: " + name
        );
        duplicateError.code = "DUPLICATE_PLAYER_NAME";
        throw duplicateError;
      }
    });

    const now = getNowIso_();
    const startSortOrder = Number.isFinite(Number(payload.startSortOrder))
      ? Number(payload.startSortOrder)
      : currentEventPlayerCount + 1;
    const createdPlayers = names.map(function (name, index) {
      return {
        playerId: createId_("player"),
        eventId: eventId,
        name: name,
        sortOrder: startSortOrder + index,
        createdAt: now,
        updatedAt: now,
      };
    });
    const rows = createdPlayers.map(function (player) {
      return [
        player.playerId,
        player.eventId,
        player.name,
        player.sortOrder,
        player.createdAt,
        player.updatedAt,
      ];
    });
    markPerformance_("VALIDATE_AND_BUILD_ROWS");

    const startRow = sheet.getLastRow() + 1;
    sheet.getRange(startRow, 1, rows.length, rows[0].length).setValues(rows);
    markPerformance_("WRITE_PLAYERS_BATCH");

    invalidateSheetCache_(APP_CONFIG.SHEETS.PLAYERS);
    invalidateOwnerCaches_(ownerUserId, { eventDetail: true });
    markPerformance_("INVALIDATE_CACHE");
    markPerformance_("RETURN_RESPONSE");

    return attachPerformance_({
      players: createdPlayers,
    });
  } finally {
    lock.releaseLock();
  }
}

function apiListPlayers_(payload) {
  const ownerUserId = String(
    payload && payload.ownerUserId
      ? payload.ownerUserId
      : ""
  ).trim();
  const eventId = String(
    payload && payload.eventId ? payload.eventId : ""
  ).trim();

  if (!ownerUserId) {
    const ownerError = new Error(
      "ユーザーIDが指定されていません。"
    );
    ownerError.code = "INVALID_OWNER_USER_ID";
    throw ownerError;
  }

  const ownedEventIds = getCachedSheetRecordsWithPerf_(
    getSheetByNameOrThrow_(APP_CONFIG.SHEETS.EVENTS)
  )
    .filter(function (event) {
      return String(event.ownerUserId) === ownerUserId;
    })
    .map(function (event) {
      return String(event.eventId);
    });

  if (eventId && ownedEventIds.indexOf(eventId) === -1) {
    const ownershipError = new Error(
      "指定されたイベントを操作する権限がありません。"
    );
    ownershipError.code = "EVENT_ACCESS_DENIED";
    throw ownershipError;
  }

  return getCachedSheetRecordsWithPerf_(
    getSheetByNameOrThrow_(APP_CONFIG.SHEETS.PLAYERS)
  )
    .filter(function (player) {
      const playerEventId = String(player.eventId);
      return (
        ownedEventIds.indexOf(playerEventId) !== -1 &&
        (!eventId || playerEventId === eventId)
      );
    })
    .map(serializePlayerRecord_)
    .sort(function (a, b) {
      if (a.eventId !== b.eventId) {
        return a.eventId.localeCompare(b.eventId);
      }

      if (a.sortOrder !== b.sortOrder) {
        return a.sortOrder - b.sortOrder;
      }

      return (
        new Date(a.createdAt).getTime() -
        new Date(b.createdAt).getTime()
      );
    });
}

function validatePlayerPayload_(payload) {
  if (!payload || typeof payload !== "object") {
    const payloadError = new Error(
      "プレイヤー情報が送信されていません。"
    );
    payloadError.code = "INVALID_PLAYER_PAYLOAD";
    throw payloadError;
  }

  const ownerUserId = String(payload.ownerUserId || "").trim();
  const eventId = String(payload.eventId || "").trim();
  const name = String(payload.name || "").trim();

  if (!ownerUserId) {
    const ownerError = new Error(
      "ユーザーIDが指定されていません。"
    );
    ownerError.code = "INVALID_OWNER_USER_ID";
    throw ownerError;
  }

  if (!eventId) {
    const eventError = new Error(
      "イベントIDが指定されていません。"
    );
    eventError.code = "INVALID_EVENT_ID";
    throw eventError;
  }

  if (name.length < 1 || name.length > 20) {
    const nameError = new Error(
      "プレイヤー名は1文字以上20文字以内で入力してください。"
    );
    nameError.code = "INVALID_PLAYER_NAME";
    throw nameError;
  }
}

function assertEventOwnership_(eventId, ownerUserId) {
  const event = getCachedSheetRecordsWithPerf_(
    getSheetByNameOrThrow_(APP_CONFIG.SHEETS.EVENTS)
  ).find(function (item) {
    return String(item.eventId) === String(eventId);
  });

  if (!event) {
    const notFoundError = new Error(
      "指定されたイベントが見つかりません。"
    );
    notFoundError.code = "EVENT_NOT_FOUND";
    throw notFoundError;
  }

  if (String(event.ownerUserId) !== String(ownerUserId)) {
    const ownershipError = new Error(
      "指定されたイベントを操作する権限がありません。"
    );
    ownershipError.code = "EVENT_ACCESS_DENIED";
    throw ownershipError;
  }
}

function serializePlayerRecord_(player) {
  return {
    playerId: String(player.playerId),
    eventId: String(player.eventId),
    name: String(player.name),
    sortOrder: Number(player.sortOrder || 0),
    createdAt: toIsoString_(player.createdAt),
    updatedAt: toIsoString_(player.updatedAt),
  };
}


function apiSaveMatch_(payload) {
  validateMatchPayload_(payload);

  const event = getOwnedEventRecord_(
    payload.eventId,
    payload.ownerUserId
  );
  markPerformance_("READ_AND_VERIFY_EVENT");
  const eventRule = buildEventRuleFromRecord_(event);
  const calculatedResults = calculateMatchResultsForEvent_(
    payload.results,
    event,
    eventRule
  );
  markPerformance_("VALIDATE_AND_CALCULATE");

  const lock = LockService.getScriptLock();
  const lockStartedAt = Date.now();
  lock.waitLock(10000);
  if (activePerformanceContext_) {
    activePerformanceContext_.steps.push({
      label: "WAIT_LOCK",
      elapsedMs: Date.now() - lockStartedAt,
    });
    activePerformanceContext_.lastMarkedAt = Date.now();
  }

  try {
    const matchSheet = getSheetByNameOrThrow_(
      APP_CONFIG.SHEETS.MATCHES
    );
    const resultSheet = getSheetByNameOrThrow_(
      APP_CONFIG.SHEETS.MATCH_RESULTS
    );
    markPerformance_("GET_MATCH_SHEETS");
    const matchId = String(
      payload.preferredMatchId || payload.matchId || ""
    ).trim() || createId_("match");
    const existingMatch = findMatchRowById_(matchSheet, matchId);
    markPerformance_("FIND_MATCH_ROW");

    if (
      existingMatch &&
      String(existingMatch.eventId) !== String(event.eventId)
    ) {
      const conflictError = new Error(
        "同じ半荘IDが別のイベントに使用されています。"
      );
      conflictError.code = "MATCH_ID_CONFLICT";
      throw conflictError;
    }

    const now = getNowIso_();
    const createdAt = existingMatch
      ? toIsoString_(existingMatch.createdAt)
      : normalizeOptionalIso_(payload.createdAt) || now;
    const playedAt =
      normalizeOptionalIso_(payload.playedAt) || createdAt;
    const gameType = String(event.gameType);
    const row = [
      matchId,
      String(event.eventId),
      gameType,
      playedAt,
      createdAt,
      now,
    ];

    if (existingMatch) {
      matchSheet
        .getRange(existingMatch.rowNumber, 1, 1, row.length)
        .setValues([row]);
    } else {
      const nextRow = Math.max(matchSheet.getLastRow() + 1, 2);
      matchSheet
        .getRange(nextRow, 1, 1, row.length)
        .setValues([row]);
    }
    markPerformance_("WRITE_MATCH");

    upsertMatchResultRows_(
      resultSheet,
      matchId,
      calculatedResults,
      createdAt,
      now,
      Boolean(existingMatch)
    );
    markPerformance_("WRITE_MATCH_RESULTS");
    invalidateMatchDataCaches_();
    invalidateOwnerCaches_(payload.ownerUserId, {
      eventList: true,
      eventDetail: true,
    });

    markPerformance_("BUILD_RESPONSE");
    markPerformance_("RETURN_RESPONSE");
    return attachPerformance_({
      matchId: matchId,
      eventId: String(event.eventId),
      gameType: gameType,
      ruleMode: String(event.ruleMode || "preset"),
      rulePreset: String(event.rulePreset || ""),
      umaPreset: String(event.rulePreset || ""),
      entryOrderPlayerIds: Array.isArray(payload.entryOrderPlayerIds)
        ? payload.entryOrderPlayerIds.map(String)
        : [],
      tieBreakOrderPlayerIds: Array.isArray(
        payload.tieBreakOrderPlayerIds
      )
        ? payload.tieBreakOrderPlayerIds.map(String)
        : [],
      results: calculatedResults.map(function (result) {
        return {
          playerId: result.playerId,
          playerName: result.playerName,
          points: result.rawPoints,
          rank: result.rank,
          rankPoint: result.rankScore,
          finalScore: result.finalScore,
        };
      }),
      playedAt: playedAt,
      createdAt: createdAt,
      updatedAt: now,
    });
  } finally {
    lock.releaseLock();
  }
}

function findMatchRowById_(matchSheet, matchId) {
  const lastRow = matchSheet.getLastRow();
  if (lastRow < 2) {
    return null;
  }

  const finder = matchSheet
    .getRange(2, 1, lastRow - 1, 1)
    .createTextFinder(String(matchId))
    .matchEntireCell(true);
  const found = finder.findNext();

  if (!found) {
    return null;
  }

  const rowNumber = found.getRow();
  const values = matchSheet
    .getRange(rowNumber, 1, 1, 6)
    .getValues()[0];

  return {
    rowNumber: rowNumber,
    matchId: values[0],
    eventId: values[1],
    gameType: values[2],
    playedAt: values[3],
    createdAt: values[4],
    updatedAt: values[5],
  };
}

function apiListMatches_(payload) {
  const ownerUserId = String(
    (payload && payload.ownerUserId) || ""
  ).trim();

  if (!ownerUserId) {
    const ownerError = new Error(
      "ユーザーIDが指定されていません。"
    );
    ownerError.code = "INVALID_OWNER_USER_ID";
    throw ownerError;
  }

  const events = getSheetRecordsWithPerf_(
    getSheetByNameOrThrow_(APP_CONFIG.SHEETS.EVENTS)
  ).filter(function (event) {
    return String(event.ownerUserId) === ownerUserId;
  });
  const eventMap = {};

  events.forEach(function (event) {
    eventMap[String(event.eventId)] = event;
  });

  const playerMap = {};
  getSheetRecordsWithPerf_(
    getSheetByNameOrThrow_(APP_CONFIG.SHEETS.PLAYERS)
  ).forEach(function (player) {
    playerMap[String(player.playerId)] = String(player.name || "");
  });

  const results = getSheetRecordsWithPerf_(
    getSheetByNameOrThrow_(APP_CONFIG.SHEETS.MATCH_RESULTS)
  );

  return getSheetRecordsWithPerf_(
    getSheetByNameOrThrow_(APP_CONFIG.SHEETS.MATCHES)
  )
    .filter(function (match) {
      return Boolean(eventMap[String(match.eventId)]);
    })
    .map(function (match) {
      const event = eventMap[String(match.eventId)];
      const matchResults = results
        .filter(function (result) {
          return String(result.matchId) === String(match.matchId);
        })
        .sort(function (a, b) {
          return Number(a.rank) - Number(b.rank);
        })
        .map(function (result) {
          return {
            playerId: String(result.playerId),
            playerName: playerMap[String(result.playerId)] || "",
            points: Number(result.rawScore),
            rank: Number(result.rank),
            rankPoint: Number(result.rankScore),
            finalScore: Number(result.finalScore),
          };
        });

      return {
        matchId: String(match.matchId),
        eventId: String(match.eventId),
        gameType: String(match.gameType),
        ruleMode: String(event.ruleMode || "preset"),
        rulePreset: String(event.rulePreset || ""),
        umaPreset: String(event.rulePreset || ""),
        entryOrderPlayerIds: matchResults.map(function (result) {
          return result.playerId;
        }),
        tieBreakOrderPlayerIds: [],
        results: matchResults,
        playedAt: toIsoString_(match.playedAt),
        createdAt: toIsoString_(match.createdAt),
        updatedAt: toIsoString_(match.updatedAt),
      };
    });
}

function apiDeleteMatch_(payload) {
  const matchId = String(
    (payload && payload.matchId) || ""
  ).trim();
  const ownerUserId = String(
    (payload && payload.ownerUserId) || ""
  ).trim();

  if (!matchId || !ownerUserId) {
    const targetError = new Error(
      "削除対象が正しく指定されていません。"
    );
    targetError.code = "INVALID_DELETE_TARGET";
    throw targetError;
  }

  const matchSheet = getSheetByNameOrThrow_(
    APP_CONFIG.SHEETS.MATCHES
  );
  const matches = getSheetRecordsWithPerf_(matchSheet);
  const index = matches.findIndex(function (match) {
    return String(match.matchId) === matchId;
  });

  if (index < 0) {
    return { deleted: false };
  }

  assertEventOwnership_(matches[index].eventId, ownerUserId);

  const resultSheet = getSheetByNameOrThrow_(
    APP_CONFIG.SHEETS.MATCH_RESULTS
  );
  deleteMatchResultRows_(resultSheet, matchId);
  matchSheet.deleteRow(index + 2);
  invalidateMatchDataCaches_();
  invalidateOwnerCaches_(ownerUserId, {
    eventList: true,
    eventDetail: true,
  });

  return { deleted: true, matchId: matchId };
}

function validateMatchPayload_(payload) {
  if (!payload || typeof payload !== "object") {
    const payloadError = new Error(
      "半荘結果が送信されていません。"
    );
    payloadError.code = "INVALID_MATCH_PAYLOAD";
    throw payloadError;
  }

  if (!String(payload.ownerUserId || "").trim()) {
    const ownerError = new Error(
      "ユーザーIDが指定されていません。"
    );
    ownerError.code = "INVALID_OWNER_USER_ID";
    throw ownerError;
  }

  if (!String(payload.eventId || "").trim()) {
    const eventError = new Error(
      "イベントIDが指定されていません。"
    );
    eventError.code = "INVALID_EVENT_ID";
    throw eventError;
  }

  if (!Array.isArray(payload.results)) {
    const resultError = new Error(
      "半荘結果が正しくありません。"
    );
    resultError.code = "INVALID_MATCH_RESULTS";
    throw resultError;
  }
}

function getOwnedEventRecord_(eventId, ownerUserId) {
  const normalizedEventId = String(eventId || "").trim();
  const normalizedOwnerUserId = String(ownerUserId || "").trim();
  const event = getCachedSheetRecordsWithPerf_(
    getSheetByNameOrThrow_(APP_CONFIG.SHEETS.EVENTS)
  ).find(function (item) {
    return String(item.eventId) === normalizedEventId;
  });

  if (!event) {
    const notFoundError = new Error(
      "指定されたイベントが見つかりません。"
    );
    notFoundError.code = "EVENT_NOT_FOUND";
    throw notFoundError;
  }

  if (String(event.ownerUserId) !== normalizedOwnerUserId) {
    const accessError = new Error(
      "指定されたイベントを操作する権限がありません。"
    );
    accessError.code = "EVENT_ACCESS_DENIED";
    throw accessError;
  }

  return event;
}

function buildEventRuleFromRecord_(event) {
  const gameType = String(event.gameType || "");
  const playerCount = gameType === "sanma" ? 3 : 4;

  return normalizeMahjongRule_({
    playerCount: playerCount,
    startingPoints: event.startingPoints,
    returnPoints: event.returnPoints,
    umaByRank: [
      event.uma1,
      event.uma2,
      event.uma3,
      event.uma4,
    ].slice(0, playerCount),
  });
}

function calculateMatchResultsForEvent_(payloadResults, event, eventRule) {
  const eventId = String(event.eventId);
  const eventPlayers = getCachedSheetRecordsWithPerf_(
    getSheetByNameOrThrow_(APP_CONFIG.SHEETS.PLAYERS)
  ).filter(function (player) {
    return String(player.eventId) === eventId;
  });
  const playerMap = {};

  eventPlayers.forEach(function (player) {
    playerMap[String(player.playerId)] = player;
  });

  const rawResults = payloadResults.map(function (result) {
    const playerId = String(
      (result && result.playerId) || ""
    ).trim();

    if (!playerMap[playerId]) {
      const playerError = new Error(
        "イベントに登録されていないプレイヤーが含まれています。"
      );
      playerError.code = "PLAYER_NOT_IN_EVENT";
      throw playerError;
    }

    return {
      playerId: playerId,
      rawPoints: Number(
        result && result.points !== undefined
          ? result.points
          : result && result.rawPoints
      ),
      rank: Number(result && result.rank),
    };
  });

  return calculateMatchScores_(rawResults, eventRule).map(function (result) {
    return {
      playerId: result.playerId,
      playerName: String(playerMap[result.playerId].name || ""),
      rawPoints: result.rawPoints,
      rank: result.rank,
      rankScore: result.rankScore,
      finalScore: result.finalScore,
    };
  });
}

function upsertMatchResultRows_(
  resultSheet,
  matchId,
  calculatedResults,
  createdAt,
  updatedAt,
  isExistingMatch
) {
  const resultRows = calculatedResults.map(function (result, index) {
    return [
      createId_("matchResult"),
      matchId,
      result.playerId,
      result.rawPoints,
      result.rank,
      result.rankScore,
      result.finalScore,
      index + 1,
      createdAt,
      updatedAt,
    ];
  });

  // 新規半荘は既存結果が存在しないことが確定しているため、
  // MatchResults列全体の検索を省略して末尾へ一括追記します。
  if (!isExistingMatch) {
    const nextRow = Math.max(resultSheet.getLastRow() + 1, 2);
    resultSheet
      .getRange(nextRow, 1, resultRows.length, resultRows[0].length)
      .setValues(resultRows);
    return;
  }

  // 編集時だけTextFinderで対象行を探します。全matchId列のgetValuesを
  // 毎回行う方式より、対象行が少ない通常ケースでアクセス量を抑えられます。
  const matchIdRange = resultSheet.getRange(
    2,
    2,
    Math.max(resultSheet.getLastRow() - 1, 1),
    1
  );
  const matches = matchIdRange
    .createTextFinder(String(matchId))
    .matchEntireCell(true)
    .findAll();
  const matchingRowNumbers = matches
    .map(function (range) {
      return range.getRow();
    })
    .sort(function (a, b) {
      return a - b;
    });

  if (matchingRowNumbers.length === 0) {
    const nextRow = Math.max(resultSheet.getLastRow() + 1, 2);
    resultSheet
      .getRange(nextRow, 1, resultRows.length, resultRows[0].length)
      .setValues(resultRows);
    return;
  }

  const firstRow = matchingRowNumbers[0];
  const rowsAreContiguous = matchingRowNumbers.every(function (
    rowNumber,
    index
  ) {
    return rowNumber === firstRow + index;
  });

  if (
    rowsAreContiguous &&
    matchingRowNumbers.length === resultRows.length
  ) {
    const existingIds = resultSheet
      .getRange(firstRow, 1, resultRows.length, 1)
      .getValues();

    resultRows.forEach(function (row, index) {
      row[0] = existingIds[index][0] || row[0];
    });

    resultSheet
      .getRange(firstRow, 1, resultRows.length, resultRows[0].length)
      .setValues(resultRows);
    return;
  }

  replaceMatchResultRowsFallback_(
    resultSheet,
    matchId,
    resultRows
  );
}

function replaceMatchResultRowsFallback_(
  resultSheet,
  matchId,
  newRows
) {
  const lastColumn = resultSheet.getLastColumn();
  const existingValues = resultSheet.getDataRange().getValues();
  const retainedRows = existingValues.slice(1).filter(function (row) {
    return String(row[1]) !== String(matchId);
  });
  const allRows = retainedRows.concat(newRows);

  if (resultSheet.getLastRow() > 1) {
    resultSheet
      .getRange(2, 1, resultSheet.getLastRow() - 1, lastColumn)
      .clearContent();
  }

  if (allRows.length > 0) {
    resultSheet
      .getRange(2, 1, allRows.length, lastColumn)
      .setValues(allRows);
  }
}

function testMatchRuleCalculationStep10_4() {
  const event = {
    eventId: "event-test",
    gameType: "yonma",
    startingPoints: 25000,
    returnPoints: 30000,
    uma1: 30,
    uma2: 10,
    uma3: -10,
    uma4: -30,
  };
  const rule = buildEventRuleFromRecord_(event);
  const results = calculateMatchScores_([
    { playerId: "player-1", rawPoints: 41000, rank: 1 },
    { playerId: "player-2", rawPoints: 30000, rank: 2 },
    { playerId: "player-3", rawPoints: 20000, rank: 3 },
    { playerId: "player-4", rawPoints: 9000, rank: 4 },
  ], rule);

  const expectedScores = [61, 10, -20, -51];
  results.forEach(function (result, index) {
    if (result.finalScore !== expectedScores[index]) {
      throw new Error(
        "STEP10-4テスト失敗: finalScoreが一致しません。"
      );
    }
  });

  console.log(JSON.stringify({
    success: true,
    message: "STEP10-4の半荘計算テストは成功しました。",
    results: results,
  }));

  return {
    success: true,
    results: results,
  };
}

function apiSaveAdjustment_(payload) {
  validateAdjustmentPayload_(payload);
  assertEventOwnership_(payload.eventId, payload.ownerUserId);

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    const adjustmentSheet = getSheetByNameOrThrow_(
      APP_CONFIG.SHEETS.ADJUSTMENTS
    );
    const entrySheet = getSheetByNameOrThrow_(
      APP_CONFIG.SHEETS.ADJUSTMENT_ENTRIES
    );
    const adjustments = getSheetRecordsWithPerf_(adjustmentSheet);
    const adjustmentId = String(
      payload.preferredAdjustmentId || payload.adjustmentId || ""
    ).trim() || createId_("adjustment");
    const existingIndex = adjustments.findIndex(function (item) {
      return String(item.adjustmentId) === adjustmentId;
    });

    if (existingIndex >= 0) {
      assertEventOwnership_(
        adjustments[existingIndex].eventId,
        payload.ownerUserId
      );
    }

    const now = getNowIso_();
    const createdAt = existingIndex >= 0
      ? toIsoString_(adjustments[existingIndex].createdAt)
      : String(payload.createdAt || now);
    const adjustedAt = String(
      payload.adjustedAt || payload.createdAt || now
    );
    const row = [
      adjustmentId,
      String(payload.eventId),
      String(payload.title || "").trim(),
      adjustedAt,
      createdAt,
      now,
    ];

    if (existingIndex >= 0) {
      adjustmentSheet
        .getRange(existingIndex + 2, 1, 1, row.length)
        .setValues([row]);
    } else {
      adjustmentSheet.appendRow(row);
    }

    const entryValues = entrySheet.getDataRange().getValues();
    for (let index = entryValues.length - 1; index >= 1; index -= 1) {
      if (String(entryValues[index][1]) === adjustmentId) {
        entrySheet.deleteRow(index + 1);
      }
    }

    payload.entries.forEach(function (entry) {
      entrySheet.appendRow([
        createId_("adjustmentEntry"),
        adjustmentId,
        String(entry.playerId),
        Number(entry.points),
        createdAt,
        now,
      ]);
    });

    invalidateAdjustmentDataCaches_();
    invalidateOwnerCaches_(payload.ownerUserId, {
      eventDetail: true,
    });

    return {
      adjustmentId: adjustmentId,
      eventId: String(payload.eventId),
      title: String(payload.title || "").trim(),
      entries: payload.entries.map(function (entry) {
        return {
          playerId: String(entry.playerId),
          playerName: String(entry.playerName || ""),
          points: Number(entry.points),
        };
      }),
      adjustedAt: adjustedAt,
      createdAt: createdAt,
      updatedAt: now,
    };
  } finally {
    lock.releaseLock();
  }
}

function apiListAdjustments_(payload) {
  const ownerUserId = String(
    (payload && payload.ownerUserId) || ""
  ).trim();

  if (!ownerUserId) {
    throw new Error("ユーザーIDが指定されていません。");
  }

  const eventIds = getSheetRecordsWithPerf_(
    getSheetByNameOrThrow_(APP_CONFIG.SHEETS.EVENTS)
  )
    .filter(function (event) {
      return String(event.ownerUserId) === ownerUserId;
    })
    .map(function (event) {
      return String(event.eventId);
    });
  const entries = getSheetRecordsWithPerf_(
    getSheetByNameOrThrow_(APP_CONFIG.SHEETS.ADJUSTMENT_ENTRIES)
  );

  return getSheetRecordsWithPerf_(
    getSheetByNameOrThrow_(APP_CONFIG.SHEETS.ADJUSTMENTS)
  )
    .filter(function (adjustment) {
      return eventIds.indexOf(String(adjustment.eventId)) !== -1;
    })
    .map(function (adjustment) {
      const adjustmentEntries = entries
        .filter(function (entry) {
          return String(entry.adjustmentId) ===
            String(adjustment.adjustmentId);
        })
        .map(function (entry) {
          return {
            playerId: String(entry.playerId),
            playerName: "",
            points: Number(entry.points),
          };
        });

      return {
        adjustmentId: String(adjustment.adjustmentId),
        eventId: String(adjustment.eventId),
        title: String(adjustment.title || ""),
        entries: adjustmentEntries,
        adjustedAt: toIsoString_(adjustment.adjustedAt),
        createdAt: toIsoString_(adjustment.createdAt),
        updatedAt: toIsoString_(adjustment.updatedAt),
      };
    });
}


/**
 * STEP12-2: 対局詳細画面に必要なプレイヤー・半荘・調整を一括取得します。
 * 各シートは1回だけ読み込み、従来の3API分の重複読込をなくします。
 */
function apiGetEventDetailData_(payload) {
  const ownerUserId = String(
    (payload && payload.ownerUserId) || ""
  ).trim();

  if (!ownerUserId) {
    const ownerError = new Error(
      "ユーザーIDが指定されていません。"
    );
    ownerError.code = "INVALID_OWNER_USER_ID";
    throw ownerError;
  }

  const cacheKey = buildCacheKey_("eventDetail", ownerUserId);
  const cachedDetail = readJsonCache_(cacheKey, "eventDetail");
  if (cachedDetail !== null) {
    markPerformance_("CACHE_HIT_EVENT_DETAIL");
    markPerformance_("RETURN_RESPONSE");
    return attachPerformance_(cachedDetail);
  }

  const events = getCachedSheetRecordsWithPerf_(
    getSheetByNameOrThrow_(APP_CONFIG.SHEETS.EVENTS)
  ).filter(function (event) {
    return String(event.ownerUserId) === ownerUserId;
  });
  markPerformance_("READ_EVENTS");
  const ownedEventIdSet = {};
  const eventMap = {};

  events.forEach(function (event) {
    const eventId = String(event.eventId);
    ownedEventIdSet[eventId] = true;
    eventMap[eventId] = event;
  });

  const playerRecords = getCachedSheetRecordsWithPerf_(
    getSheetByNameOrThrow_(APP_CONFIG.SHEETS.PLAYERS)
  ).filter(function (player) {
    return Boolean(ownedEventIdSet[String(player.eventId)]);
  });
  markPerformance_("READ_PLAYERS");
  const playerMap = {};

  playerRecords.forEach(function (player) {
    playerMap[String(player.playerId)] = String(player.name || "");
  });

  const matchRecords = getCachedSheetRecordsWithPerf_(
    getSheetByNameOrThrow_(APP_CONFIG.SHEETS.MATCHES)
  ).filter(function (match) {
    return Boolean(ownedEventIdSet[String(match.eventId)]);
  });
  markPerformance_("READ_MATCHES");
  const ownedMatchIdSet = {};

  matchRecords.forEach(function (match) {
    ownedMatchIdSet[String(match.matchId)] = true;
  });

  const matchResultsByMatchId = {};
  getCachedSheetRecordsWithPerf_(
    getSheetByNameOrThrow_(APP_CONFIG.SHEETS.MATCH_RESULTS)
  )
    .filter(function (result) {
      return Boolean(ownedMatchIdSet[String(result.matchId)]);
    })
    .forEach(function (result) {
      const matchId = String(result.matchId);
      if (!matchResultsByMatchId[matchId]) {
        matchResultsByMatchId[matchId] = [];
      }
      matchResultsByMatchId[matchId].push(result);
    });

  markPerformance_("READ_MATCH_RESULTS");
  const adjustmentRecords = getCachedSheetRecordsWithPerf_(
    getSheetByNameOrThrow_(APP_CONFIG.SHEETS.ADJUSTMENTS)
  ).filter(function (adjustment) {
    return Boolean(ownedEventIdSet[String(adjustment.eventId)]);
  });
  markPerformance_("READ_ADJUSTMENTS");
  const ownedAdjustmentIdSet = {};

  adjustmentRecords.forEach(function (adjustment) {
    ownedAdjustmentIdSet[String(adjustment.adjustmentId)] = true;
  });

  const adjustmentEntriesByAdjustmentId = {};
  getCachedSheetRecordsWithPerf_(
    getSheetByNameOrThrow_(APP_CONFIG.SHEETS.ADJUSTMENT_ENTRIES)
  )
    .filter(function (entry) {
      return Boolean(
        ownedAdjustmentIdSet[String(entry.adjustmentId)]
      );
    })
    .forEach(function (entry) {
      const adjustmentId = String(entry.adjustmentId);
      if (!adjustmentEntriesByAdjustmentId[adjustmentId]) {
        adjustmentEntriesByAdjustmentId[adjustmentId] = [];
      }
      adjustmentEntriesByAdjustmentId[adjustmentId].push(entry);
    });

  markPerformance_("READ_ADJUSTMENT_ENTRIES");
  const players = playerRecords
    .map(serializePlayerRecord_)
    .sort(function (a, b) {
      if (a.eventId !== b.eventId) {
        return a.eventId.localeCompare(b.eventId);
      }
      if (a.sortOrder !== b.sortOrder) {
        return a.sortOrder - b.sortOrder;
      }
      return new Date(a.createdAt).getTime() -
        new Date(b.createdAt).getTime();
    });

  const matches = matchRecords.map(function (match) {
    const event = eventMap[String(match.eventId)];
    const matchResults = (matchResultsByMatchId[String(match.matchId)] || [])
      .slice()
      .sort(function (a, b) {
        return Number(a.rank) - Number(b.rank);
      })
      .map(function (result) {
        return {
          playerId: String(result.playerId),
          playerName: playerMap[String(result.playerId)] || "",
          points: Number(result.rawScore),
          rank: Number(result.rank),
          rankPoint: Number(result.rankScore),
          finalScore: Number(result.finalScore),
        };
      });

    return {
      matchId: String(match.matchId),
      eventId: String(match.eventId),
      gameType: String(match.gameType),
      ruleMode: String(event.ruleMode || "preset"),
      rulePreset: String(event.rulePreset || ""),
      umaPreset: String(event.rulePreset || ""),
      entryOrderPlayerIds: matchResults.map(function (result) {
        return result.playerId;
      }),
      tieBreakOrderPlayerIds: [],
      results: matchResults,
      playedAt: toIsoString_(match.playedAt),
      createdAt: toIsoString_(match.createdAt),
      updatedAt: toIsoString_(match.updatedAt),
    };
  });

  const adjustments = adjustmentRecords.map(function (adjustment) {
    const entries = (
      adjustmentEntriesByAdjustmentId[
        String(adjustment.adjustmentId)
      ] || []
    ).map(function (entry) {
      return {
        playerId: String(entry.playerId),
        playerName: playerMap[String(entry.playerId)] || "",
        points: Number(entry.points),
      };
    });

    return {
      adjustmentId: String(adjustment.adjustmentId),
      eventId: String(adjustment.eventId),
      title: String(adjustment.title || ""),
      entries: entries,
      adjustedAt: toIsoString_(adjustment.adjustedAt),
      createdAt: toIsoString_(adjustment.createdAt),
      updatedAt: toIsoString_(adjustment.updatedAt),
    };
  });

  markPerformance_("BUILD_EVENT_DETAIL_RESPONSE");
  const detail = {
    players: players,
    matches: matches,
    adjustments: adjustments,
  };
  writeJsonCache_(
    cacheKey,
    detail,
    CACHE_CONFIG_.EVENT_DETAIL_TTL_SECONDS,
    "eventDetail"
  );
  markPerformance_("RETURN_RESPONSE");
  return attachPerformance_(detail);
}

function apiDeleteAdjustment_(payload) {
  const adjustmentId = String(
    (payload && payload.adjustmentId) || ""
  ).trim();
  const ownerUserId = String(
    (payload && payload.ownerUserId) || ""
  ).trim();

  if (!adjustmentId || !ownerUserId) {
    throw new Error("削除対象が正しく指定されていません。");
  }

  const adjustmentSheet = getSheetByNameOrThrow_(
    APP_CONFIG.SHEETS.ADJUSTMENTS
  );
  const adjustments = getSheetRecordsWithPerf_(adjustmentSheet);
  const index = adjustments.findIndex(function (item) {
    return String(item.adjustmentId) === adjustmentId;
  });

  if (index < 0) {
    return { deleted: false };
  }

  assertEventOwnership_(adjustments[index].eventId, ownerUserId);

  const entrySheet = getSheetByNameOrThrow_(
    APP_CONFIG.SHEETS.ADJUSTMENT_ENTRIES
  );
  const entryValues = entrySheet.getDataRange().getValues();
  for (let rowIndex = entryValues.length - 1; rowIndex >= 1; rowIndex -= 1) {
    if (String(entryValues[rowIndex][1]) === adjustmentId) {
      entrySheet.deleteRow(rowIndex + 1);
    }
  }

  adjustmentSheet.deleteRow(index + 2);
  invalidateAdjustmentDataCaches_();
  invalidateOwnerCaches_(ownerUserId, {
    eventDetail: true,
  });
  return { deleted: true, adjustmentId: adjustmentId };
}

function validateAdjustmentPayload_(payload) {
  if (!payload || typeof payload !== "object") {
    throw new Error("ポイント増減が送信されていません。");
  }

  if (!String(payload.ownerUserId || "").trim()) {
    throw new Error("ユーザーIDが指定されていません。");
  }

  if (!String(payload.eventId || "").trim()) {
    throw new Error("イベントIDが指定されていません。");
  }

  if (!Array.isArray(payload.entries) || payload.entries.length === 0) {
    throw new Error("ポイント増減の明細が正しくありません。");
  }

  const invalidEntry = payload.entries.some(function (entry) {
    return !String(entry.playerId || "").trim() ||
      !Number.isFinite(Number(entry.points));
  });

  if (invalidEntry) {
    throw new Error("ポイント増減の明細が正しくありません。");
  }

  const total = payload.entries.reduce(function (sum, entry) {
    return sum + Number(entry.points);
  }, 0);

  if (Math.abs(total) >= 0.0001) {
    throw new Error("ポイント増減の合計を0にしてください。");
  }
}
