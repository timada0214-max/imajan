"use strict";

/**
 * 初回にGASエディタからこの関数を実行してください。
 * 必要なシートと見出しを自動作成します。
 */
function setupSpreadsheet() {
  const spreadsheet = getAppSpreadsheet_();
  const results = SHEET_DEFINITIONS.map(function (definition) {
    return setupSheet_(spreadsheet, definition);
  });

  SpreadsheetApp.flush();

  console.log(
    JSON.stringify({
      spreadsheetId: spreadsheet.getId(),
      spreadsheetName: spreadsheet.getName(),
      sheets: results,
    })
  );

  return {
    spreadsheetId: spreadsheet.getId(),
    spreadsheetName: spreadsheet.getName(),
    sheets: results,
  };
}

function setupSheet_(spreadsheet, definition) {
  let sheet = spreadsheet.getSheetByName(definition.name);
  const wasCreated = !sheet;

  if (!sheet) {
    sheet = spreadsheet.insertSheet(definition.name);
  }

  const requiredColumnCount = definition.headers.length;

  if (sheet.getMaxColumns() < requiredColumnCount) {
    sheet.insertColumnsAfter(
      sheet.getMaxColumns(),
      requiredColumnCount - sheet.getMaxColumns()
    );
  }

  const currentHeaders = sheet
    .getRange(1, 1, 1, requiredColumnCount)
    .getDisplayValues()[0]
    .map(normalizeHeader_);
  const headersAreDifferent = definition.headers.some(function (
    header,
    index
  ) {
    return currentHeaders[index] !== header;
  });

  if (headersAreDifferent) {
    const hasExistingHeaderValues = currentHeaders.some(Boolean);

    if (hasExistingHeaderValues && sheet.getLastRow() > 1) {
      throw new Error(
        definition.name +
          "シートには既存データがあり、見出しが想定と異なります。内容を確認してください。"
      );
    }

    sheet
      .getRange(1, 1, 1, requiredColumnCount)
      .setValues([definition.headers]);
  }

  const headerRange = sheet.getRange(
    1,
    1,
    1,
    requiredColumnCount
  );

  headerRange
    .setFontWeight("bold")
    .setBackground("#14532d")
    .setFontColor("#ffffff")
    .setHorizontalAlignment("center");

  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, requiredColumnCount);

  if (sheet.getFilter()) {
    sheet.getFilter().remove();
  }

  const filterRowCount = Math.max(sheet.getLastRow(), 2);
  sheet
    .getRange(1, 1, filterRowCount, requiredColumnCount)
    .createFilter();

  return {
    name: definition.name,
    created: wasCreated,
    columns: requiredColumnCount,
  };
}


/**
 * STEP10-2移行用：ユーザー登録を残し、ゲームデータだけを初期化します。
 * Eventsシートの列構成変更前に、GASエディタから1回だけ実行してください。
 */
function resetGameDataForStep10_2() {
  const spreadsheet = getAppSpreadsheet_();
  const resetSheetNames = [
    APP_CONFIG.SHEETS.EVENTS,
    APP_CONFIG.SHEETS.PLAYERS,
    APP_CONFIG.SHEETS.MATCHES,
    APP_CONFIG.SHEETS.MATCH_RESULTS,
    APP_CONFIG.SHEETS.ADJUSTMENTS,
    APP_CONFIG.SHEETS.ADJUSTMENT_ENTRIES,
  ];

  resetSheetNames.forEach(function (sheetName) {
    const sheet = spreadsheet.getSheetByName(sheetName);

    if (sheet) {
      spreadsheet.deleteSheet(sheet);
    }
  });

  const result = setupSpreadsheet();

  console.log(
    JSON.stringify({
      success: true,
      message: "ゲームデータを初期化し、STEP10-2のシート構成へ更新しました。",
      resetSheets: resetSheetNames,
      setupResult: result,
    })
  );

  return result;
}

/**
 * STEP10-2の保存形式を確認するテストです。
 * resetGameDataForStep10_2の実行後に使用してください。
 */
function testEventRuleStorageStep10_2() {
  const sheet = getSheetByNameOrThrow_(APP_CONFIG.SHEETS.EVENTS);
  const actualHeaders = sheet
    .getRange(1, 1, 1, sheet.getLastColumn())
    .getDisplayValues()[0]
    .map(normalizeHeader_);
  const expectedHeaders = SHEET_DEFINITIONS.find(function (definition) {
    return definition.name === APP_CONFIG.SHEETS.EVENTS;
  }).headers;

  const success =
    actualHeaders.length === expectedHeaders.length &&
    expectedHeaders.every(function (header, index) {
      return actualHeaders[index] === header;
    });

  if (!success) {
    throw new Error("Eventsシートの見出しがSTEP10-2の構成と一致しません。");
  }

  console.log(
    JSON.stringify({
      success: true,
      message: "EventsシートはSTEP10-2の保存形式です。",
      headers: actualHeaders,
    })
  );
}
