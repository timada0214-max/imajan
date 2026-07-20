"use strict";

const APP_CONFIG = Object.freeze({
  APP_NAME: "IMAJAN",
  API_VERSION: "1.0.0",

  /**
   * スプレッドシートに紐づけたGASの場合は空欄で構いません。
   * スタンドアロンGASを使う場合だけ、対象スプレッドシートIDを設定します。
   */
  SPREADSHEET_ID: "",

  SHEETS: Object.freeze({
    USERS: "Users",
    EVENTS: "Events",
    PLAYERS: "Players",
    MATCHES: "Matches",
    MATCH_RESULTS: "MatchResults",
    ADJUSTMENTS: "Adjustments",
    ADJUSTMENT_ENTRIES: "AdjustmentEntries",
  }),
});

const SHEET_DEFINITIONS = Object.freeze([
  {
    name: APP_CONFIG.SHEETS.USERS,
    headers: [
      "userId",
      "nickname",
      "pinHash",
      "status",
      "createdAt",
      "updatedAt",
    ],
  },
  {
    name: APP_CONFIG.SHEETS.EVENTS,
    headers: [
      "eventId",
      "ownerUserId",
      "name",
      "eventType",
      "gameType",
      "ruleMode",
      "rulePreset",
      "startingPoints",
      "returnPoints",
      "uma1",
      "uma2",
      "uma3",
      "uma4",
      "oka",
      "rankScore1",
      "rankScore2",
      "rankScore3",
      "rankScore4",
      "status",
      "createdAt",
      "updatedAt",
    ],
  },
  {
    name: APP_CONFIG.SHEETS.PLAYERS,
    headers: [
      "playerId",
      "eventId",
      "name",
      "sortOrder",
      "createdAt",
      "updatedAt",
    ],
  },
  {
    name: APP_CONFIG.SHEETS.MATCHES,
    headers: [
      "matchId",
      "eventId",
      "gameType",
      "playedAt",
      "createdAt",
      "updatedAt",
    ],
  },
  {
    name: APP_CONFIG.SHEETS.MATCH_RESULTS,
    headers: [
      "matchResultId",
      "matchId",
      "playerId",
      "rawScore",
      "rank",
      "rankScore",
      "finalScore",
      "tieBreakOrder",
      "createdAt",
      "updatedAt",
    ],
  },
  {
    name: APP_CONFIG.SHEETS.ADJUSTMENTS,
    headers: [
      "adjustmentId",
      "eventId",
      "title",
      "adjustedAt",
      "createdAt",
      "updatedAt",
    ],
  },
  {
    name: APP_CONFIG.SHEETS.ADJUSTMENT_ENTRIES,
    headers: [
      "adjustmentEntryId",
      "adjustmentId",
      "playerId",
      "points",
      "createdAt",
      "updatedAt",
    ],
  },
]);
