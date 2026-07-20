"use strict";

/**
 * IMAJANのルール計算をまとめた共通エンジンです。
 *
 * STEP10-1では、画面・シート・既存APIからはまだ呼び出しません。
 * 次のSTEPでEventsシートと対局作成画面を新ルールへ移行する際に使用します。
 */

/**
 * ルール設定を検証し、計算に使える形へ正規化します。
 *
 * @param {Object} rule
 * @param {number} rule.playerCount 参加人数（3または4）
 * @param {number} rule.startingPoints 配給原点
 * @param {number} rule.returnPoints 返し点
 * @param {number[]} rule.umaByRank 順位別ウマ（1位から順）
 * @return {Object} 正規化済みルール
 */
function normalizeMahjongRule_(rule) {
  if (!rule || typeof rule !== "object") {
    throw createRuleCalculationError_(
      "INVALID_RULE",
      "ルール設定が指定されていません。"
    );
  }

  const playerCount = Number(rule.playerCount);
  const startingPoints = Number(rule.startingPoints);
  const returnPoints = Number(rule.returnPoints);
  const umaByRank = Array.isArray(rule.umaByRank)
    ? rule.umaByRank.map(function (value) {
        return Number(value);
      })
    : [];

  if ([3, 4].indexOf(playerCount) === -1) {
    throw createRuleCalculationError_(
      "INVALID_PLAYER_COUNT",
      "参加人数は3人または4人で指定してください。"
    );
  }

  if (!Number.isFinite(startingPoints) || startingPoints <= 0) {
    throw createRuleCalculationError_(
      "INVALID_STARTING_POINTS",
      "配給原点は0より大きい数値で指定してください。"
    );
  }

  if (!Number.isFinite(returnPoints) || returnPoints <= 0) {
    throw createRuleCalculationError_(
      "INVALID_RETURN_POINTS",
      "返し点は0より大きい数値で指定してください。"
    );
  }

  if (umaByRank.length !== playerCount) {
    throw createRuleCalculationError_(
      "INVALID_UMA_COUNT",
      "ウマは参加人数と同じ数だけ指定してください。"
    );
  }

  if (
    umaByRank.some(function (value) {
      return !Number.isFinite(value);
    })
  ) {
    throw createRuleCalculationError_(
      "INVALID_UMA_VALUE",
      "ウマには数値を指定してください。"
    );
  }

  const umaTotal = sumNumbers_(umaByRank);

  if (!isAlmostZero_(umaTotal)) {
    throw createRuleCalculationError_(
      "INVALID_UMA_TOTAL",
      "ウマの合計は0にしてください。"
    );
  }

  return {
    playerCount: playerCount,
    startingPoints: startingPoints,
    returnPoints: returnPoints,
    umaByRank: umaByRank,
  };
}

/**
 * ルールからオカ総額を計算します。
 * 単位は順位点と同じ「千点」です。
 *
 * 例：四麻・25,000点持ち・30,000点返し
 * (30,000 - 25,000) × 4 ÷ 1,000 = 20
 *
 * @param {Object} rule
 * @return {number} オカ総額
 */
function calculateOka_(rule) {
  const normalizedRule = normalizeMahjongRule_(rule);

  return roundScore_(
    ((normalizedRule.returnPoints - normalizedRule.startingPoints) *
      normalizedRule.playerCount) /
      1000
  );
}

/**
 * 各順位に加算する順位点を計算します。
 * オカはすべて1位へ加算します。
 *
 * @param {Object} rule
 * @return {number[]} 1位から順の順位点
 */
function calculateRankScores_(rule) {
  const normalizedRule = normalizeMahjongRule_(rule);
  const oka = calculateOka_(normalizedRule);

  return normalizedRule.umaByRank.map(function (uma, index) {
    return roundScore_(uma + (index === 0 ? oka : 0));
  });
}

/**
 * 1人分の最終スコアを計算します。
 *
 * 計算式：
 * （素点 - 返し点）÷ 1,000 + 順位点
 *
 * @param {number} rawPoints 素点
 * @param {number} rank 順位（1始まり）
 * @param {Object} rule
 * @return {number} 最終スコア
 */
function calculateFinalScore_(rawPoints, rank, rule) {
  const normalizedRule = normalizeMahjongRule_(rule);
  const normalizedRawPoints = Number(rawPoints);
  const normalizedRank = Number(rank);

  if (!Number.isFinite(normalizedRawPoints)) {
    throw createRuleCalculationError_(
      "INVALID_RAW_POINTS",
      "素点には数値を指定してください。"
    );
  }

  if (
    !Number.isInteger(normalizedRank) ||
    normalizedRank < 1 ||
    normalizedRank > normalizedRule.playerCount
  ) {
    throw createRuleCalculationError_(
      "INVALID_RANK",
      "順位が参加人数の範囲内ではありません。"
    );
  }

  const rankScores = calculateRankScores_(normalizedRule);
  const baseScore =
    (normalizedRawPoints - normalizedRule.returnPoints) / 1000;

  return roundScore_(baseScore + rankScores[normalizedRank - 1]);
}

/**
 * 半荘1回分の全員の最終スコアを計算します。
 * 入力順は自由ですが、rankは1位から参加人数まで重複なしで指定します。
 *
 * @param {Object[]} results
 * @param {string} results[].playerId
 * @param {number} results[].rawPoints
 * @param {number} results[].rank
 * @param {Object} rule
 * @return {Object[]} 計算結果
 */
function calculateMatchScores_(results, rule) {
  const normalizedRule = normalizeMahjongRule_(rule);

  if (!Array.isArray(results) || results.length !== normalizedRule.playerCount) {
    throw createRuleCalculationError_(
      "INVALID_RESULT_COUNT",
      "半荘結果は参加人数と同じ数だけ指定してください。"
    );
  }

  const normalizedResults = results.map(function (result) {
    const playerId = String((result && result.playerId) || "").trim();
    const rawPoints = Number(result && result.rawPoints);
    const rank = Number(result && result.rank);

    if (!playerId) {
      throw createRuleCalculationError_(
        "INVALID_PLAYER_ID",
        "プレイヤーIDが指定されていません。"
      );
    }

    if (!Number.isFinite(rawPoints)) {
      throw createRuleCalculationError_(
        "INVALID_RAW_POINTS",
        "素点には数値を指定してください。"
      );
    }

    if (!Number.isInteger(rank)) {
      throw createRuleCalculationError_(
        "INVALID_RANK",
        "順位は整数で指定してください。"
      );
    }

    return {
      playerId: playerId,
      rawPoints: rawPoints,
      rank: rank,
    };
  });

  validateUniqueValues_(
    normalizedResults.map(function (result) {
      return result.playerId;
    }),
    "DUPLICATE_PLAYER",
    "同じプレイヤーが重複しています。"
  );

  validateUniqueValues_(
    normalizedResults.map(function (result) {
      return result.rank;
    }),
    "DUPLICATE_RANK",
    "同じ順位が重複しています。"
  );

  const expectedRanks = Array.from(
    { length: normalizedRule.playerCount },
    function (_, index) {
      return index + 1;
    }
  );
  const actualRanks = normalizedResults
    .map(function (result) {
      return result.rank;
    })
    .sort(function (a, b) {
      return a - b;
    });

  if (
    expectedRanks.some(function (rank, index) {
      return actualRanks[index] !== rank;
    })
  ) {
    throw createRuleCalculationError_(
      "INVALID_RANK_SET",
      "順位は1位から参加人数までを1回ずつ指定してください。"
    );
  }

  const requiredRawPointTotal =
    normalizedRule.startingPoints * normalizedRule.playerCount;
  const actualRawPointTotal = sumNumbers_(
    normalizedResults.map(function (result) {
      return result.rawPoints;
    })
  );

  if (!isAlmostEqual_(actualRawPointTotal, requiredRawPointTotal)) {
    throw createRuleCalculationError_(
      "INVALID_RAW_POINT_TOTAL",
      "素点の合計が配給原点の合計と一致しません。必要合計: " +
        requiredRawPointTotal +
        "点 / 入力合計: " +
        actualRawPointTotal +
        "点"
    );
  }

  const rankScores = calculateRankScores_(normalizedRule);
  const calculatedResults = normalizedResults.map(function (result) {
    return {
      playerId: result.playerId,
      rawPoints: result.rawPoints,
      rank: result.rank,
      rankScore: rankScores[result.rank - 1],
      finalScore: calculateFinalScore_(
        result.rawPoints,
        result.rank,
        normalizedRule
      ),
    };
  });

  const finalScoreTotal = sumNumbers_(
    calculatedResults.map(function (result) {
      return result.finalScore;
    })
  );

  if (!isAlmostZero_(finalScoreTotal)) {
    throw createRuleCalculationError_(
      "INVALID_FINAL_SCORE_TOTAL",
      "計算後の最終スコア合計が0になりません。"
    );
  }

  return calculatedResults;
}

/**
 * STEP10-1の動作確認用テストです。
 * GASエディタ上でこの関数を実行してください。
 * すべて成功すると、実行ログへ success: true が表示されます。
 */
function testRuleCalculatorStep10_1() {
  const yonmaRule = {
    playerCount: 4,
    startingPoints: 25000,
    returnPoints: 30000,
    umaByRank: [30, 10, -10, -30],
  };

  assertRuleCalculationEqual_(
    calculateOka_(yonmaRule),
    20,
    "四麻のオカ"
  );
  assertRuleCalculationArrayEqual_(
    calculateRankScores_(yonmaRule),
    [50, 10, -10, -30],
    "四麻10-30の順位点"
  );

  const yonmaResults = calculateMatchScores_(
    [
      { playerId: "player-1", rawPoints: 41000, rank: 1 },
      { playerId: "player-2", rawPoints: 30000, rank: 2 },
      { playerId: "player-3", rawPoints: 20000, rank: 3 },
      { playerId: "player-4", rawPoints: 9000, rank: 4 },
    ],
    yonmaRule
  );

  assertRuleCalculationArrayEqual_(
    yonmaResults.map(function (result) {
      return result.finalScore;
    }),
    [61, 10, -20, -51],
    "四麻の最終スコア"
  );

  const sanmaRule = {
    playerCount: 3,
    startingPoints: 35000,
    returnPoints: 40000,
    umaByRank: [30, 0, -30],
  };

  assertRuleCalculationEqual_(
    calculateOka_(sanmaRule),
    15,
    "三麻のオカ"
  );
  assertRuleCalculationArrayEqual_(
    calculateRankScores_(sanmaRule),
    [45, 0, -30],
    "三麻の順位点"
  );

  const result = {
    success: true,
    message: "STEP10-1のルール計算テストはすべて成功しました。",
    yonma: {
      oka: calculateOka_(yonmaRule),
      rankScores: calculateRankScores_(yonmaRule),
      finalScores: yonmaResults.map(function (item) {
        return item.finalScore;
      }),
    },
    sanma: {
      oka: calculateOka_(sanmaRule),
      rankScores: calculateRankScores_(sanmaRule),
    },
  };

  console.log(JSON.stringify(result));
  return result;
}

function validateUniqueValues_(values, errorCode, errorMessage) {
  const uniqueValues = new Set(values);

  if (uniqueValues.size !== values.length) {
    throw createRuleCalculationError_(errorCode, errorMessage);
  }
}

function sumNumbers_(values) {
  return values.reduce(function (sum, value) {
    return sum + Number(value);
  }, 0);
}

function roundScore_(value) {
  return Math.round((Number(value) + Number.EPSILON) * 1000) / 1000;
}

function isAlmostZero_(value) {
  return Math.abs(Number(value)) < 0.000001;
}

function isAlmostEqual_(left, right) {
  return Math.abs(Number(left) - Number(right)) < 0.000001;
}

function createRuleCalculationError_(code, message) {
  const error = new Error(message);
  error.code = code;
  return error;
}

function assertRuleCalculationEqual_(actual, expected, label) {
  if (!isAlmostEqual_(actual, expected)) {
    throw new Error(
      label +
        "が想定と異なります。expected=" +
        expected +
        ", actual=" +
        actual
    );
  }
}

function assertRuleCalculationArrayEqual_(actual, expected, label) {
  if (
    actual.length !== expected.length ||
    actual.some(function (value, index) {
      return !isAlmostEqual_(value, expected[index]);
    })
  ) {
    throw new Error(
      label +
        "が想定と異なります。expected=" +
        JSON.stringify(expected) +
        ", actual=" +
        JSON.stringify(actual)
    );
  }
}
