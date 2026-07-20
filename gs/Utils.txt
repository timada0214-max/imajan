"use strict";

function getAppSpreadsheet_() {
  if (APP_CONFIG.SPREADSHEET_ID) {
    return SpreadsheetApp.openById(APP_CONFIG.SPREADSHEET_ID);
  }

  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

  if (!spreadsheet) {
    throw new Error(
      "対象スプレッドシートを取得できません。Config.gsのSPREADSHEET_IDを設定してください。"
    );
  }

  return spreadsheet;
}

function createJsonResponse_(body) {
  return ContentService
    .createTextOutput(JSON.stringify(body))
    .setMimeType(ContentService.MimeType.JSON);
}

function createSuccessResponse_(data) {
  return createJsonResponse_({
    ok: true,
    data: data || {},
    error: null,
    timestamp: new Date().toISOString(),
  });
}

function createErrorResponse_(error) {
  console.error(error);

  return createJsonResponse_({
    ok: false,
    data: null,
    error: {
      code: error && error.code ? error.code : "INTERNAL_ERROR",
      message:
        error && error.message
          ? error.message
          : "予期しないエラーが発生しました。",
    },
    timestamp: new Date().toISOString(),
  });
}

function getRequestAction_(event, requestBody) {
  if (
    requestBody &&
    typeof requestBody.action === "string" &&
    requestBody.action
  ) {
    return requestBody.action;
  }

  if (
    event &&
    event.parameter &&
    typeof event.parameter.action === "string"
  ) {
    return event.parameter.action;
  }

  return "";
}

function parsePostBody_(event) {
  if (!event || !event.postData || !event.postData.contents) {
    return {};
  }

  try {
    return JSON.parse(event.postData.contents);
  } catch (error) {
    const invalidJsonError = new Error(
      "送信されたJSONを読み取れませんでした。"
    );
    invalidJsonError.code = "INVALID_JSON";
    throw invalidJsonError;
  }
}

function normalizeHeader_(value) {
  return String(value || "").trim();
}

function getNowIso_() {
  return new Date().toISOString();
}


function getSheetByNameOrThrow_(sheetName) {
  const sheet = getAppSpreadsheet_().getSheetByName(sheetName);

  if (!sheet) {
    const error = new Error(
      sheetName +
        "シートがありません。setupSpreadsheetを実行してください。"
    );
    error.code = "SETUP_REQUIRED";
    throw error;
  }

  return sheet;
}

function createId_(prefix) {
  return prefix + "-" + Utilities.getUuid();
}

function createPinHash_(pin) {
  const salt = Utilities.getUuid();
  const hash = hashPinWithSalt_(pin, salt);

  return salt + "$" + hash;
}

function verifyPinHash_(pin, storedValue) {
  const parts = String(storedValue || "").split("$");

  if (parts.length !== 2) {
    return false;
  }

  return hashPinWithSalt_(pin, parts[0]) === parts[1];
}

function hashPinWithSalt_(pin, salt) {
  const bytes = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    String(salt) + ":" + String(pin),
    Utilities.Charset.UTF_8
  );

  return bytes
    .map(function (value) {
      const unsignedValue = value < 0 ? value + 256 : value;
      return ("0" + unsignedValue.toString(16)).slice(-2);
    })
    .join("");
}

function getSheetRecords_(sheet) {
  const lastRow = sheet.getLastRow();
  const lastColumn = sheet.getLastColumn();

  if (lastRow < 2 || lastColumn < 1) {
    return [];
  }

  const values = sheet
    .getRange(1, 1, lastRow, lastColumn)
    .getValues();
  const headers = values[0].map(normalizeHeader_);

  return values.slice(1).map(function (row, rowIndex) {
    const record = {
      _rowNumber: rowIndex + 2,
    };

    headers.forEach(function (header, columnIndex) {
      record[header] = row[columnIndex];
    });

    return record;
  });
}


function toIsoString_(value) {
  if (value instanceof Date) {
    return value.toISOString();
  }

  const text = String(value || "").trim();

  if (!text) {
    return "";
  }

  const parsed = new Date(text);

  if (isNaN(parsed.getTime())) {
    return text;
  }

  return parsed.toISOString();
}

function normalizeOptionalIso_(value) {
  if (!value) {
    return "";
  }

  const parsed = new Date(value);

  if (isNaN(parsed.getTime())) {
    return "";
  }

  return parsed.toISOString();
}
