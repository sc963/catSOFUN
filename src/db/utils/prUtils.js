import { reduce } from 'lodash';
import {
  TYPE_TOTAL_COST_SECONDS,
  TYPE_CORRTECT_COUNT,
  TYPE_CORRTECT_AVG_COST_SECONDS,
  FORMAL_PR,
} from '../../constants/models/pr.const';
import {
  FINISHED_PRACTICE_COUNT,
  FINISHED_FORMAL_COUNT,
} from '../../constants/models/systemCounter.const';
import Pr from '../pr/model';
import SystemCounter from '../systemCounter/model';

async function updatePr(
  totalCostSeconds,
  correctCount,
  correctAvgCostSeconds,
  isFormal = false,
) {
  await Pr.findOneAndUpdate(
    {
      prType: TYPE_TOTAL_COST_SECONDS,
      prValue: parseFloat(totalCostSeconds).toFixed(4),
      isFormal,
    },
    { $inc: { count: 1 } },
    { new: true, upsert: true },
  ).lean();
  await Pr.findOneAndUpdate(
    {
      prType: TYPE_CORRTECT_COUNT,
      prValue: correctCount,
      isFormal,
    },
    { $inc: { count: 1 } },
    { new: true, upsert: true },
  ).lean();
  await Pr.findOneAndUpdate(
    {
      prType: TYPE_CORRTECT_AVG_COST_SECONDS,
      prValue: parseFloat(correctAvgCostSeconds).toFixed(4),
      isFormal,
    },
    { $inc: { count: 1 } },
    { new: true, upsert: true },
  ).lean();
}

export async function updateFormalPr(
  totalCostSeconds,
  correctCount,
  correctAvgCostSeconds,
) {
  await updatePr(totalCostSeconds, correctCount, correctAvgCostSeconds, true);
}

export async function updatePracticePr(
  totalCostSeconds,
  correctCount,
  correctAvgCostSeconds,
) {
  await updatePr(totalCostSeconds, correctCount, correctAvgCostSeconds, false);
}

async function calculatePr(prType, valueCompareOption, prTarget) {
  const isFormal = prTarget === FORMAL_PR;
  const prRecords = await Pr.find({
    prType,
    prValue: valueCompareOption,
    isFormal,
  });
  const loserCount = reduce(
    prRecords,
    (counter, prRecord) => counter + prRecord.count,
    0,
  );
  const systemCounter = await SystemCounter.findOne({
    counterType: isFormal ? FINISHED_FORMAL_COUNT : FINISHED_PRACTICE_COUNT,
  });
  const total = systemCounter.counterValue;
  let pr = Math.floor(parseFloat((total - (total - loserCount)) / total) * 100);
  pr = pr === 100 ? 99 : pr;
  pr = pr === 0 ? 1 : pr;
  console.info(
    `Calculate ${prType}: Total:${total} Value:${JSON.stringify(
      valueCompareOption,
    )} Over:${loserCount} people`,
  );
  return pr;
}

export async function calTotcalSecondPR(totalSeconds, prTarget = FORMAL_PR) {
  const pr = await calculatePr(
    TYPE_TOTAL_COST_SECONDS,
    { $gt: totalSeconds },
    prTarget,
  );
  return pr;
}

export async function calCorrectCountPR(correctCount, prTarget = FORMAL_PR) {
  const pr = await calculatePr(
    TYPE_CORRTECT_COUNT,
    { $lt: correctCount },
    prTarget,
  );
  return pr;
}

export async function calCorrectAvgSecondsPR(avgSeconds, prTarget = FORMAL_PR) {
  const pr = await calculatePr(
    TYPE_CORRTECT_AVG_COST_SECONDS,
    { $gt: avgSeconds },
    prTarget,
  );
  return pr;
}
