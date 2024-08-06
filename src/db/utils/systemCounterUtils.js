import SystemCounter from '../systemCounter/model';
import {
  FINISHED_PRACTICE_COUNT,
  FINISHED_FORMAL_COUNT,
  INTERRUPTED_FORMAL_COUNT,
} from '../../constants/models/systemCounter.const';

export async function increaseFinishedPracticeCount() {
  await SystemCounter.findOneAndUpdate(
    { counterType: FINISHED_PRACTICE_COUNT },
    { $inc: { counterValue: 1 } },
    { new: true, upsert: true },
  );
}

export async function increaseFinishedFormalCount() {
  await SystemCounter.findOneAndUpdate(
    { counterType: FINISHED_FORMAL_COUNT },
    { $inc: { counterValue: 1 } },
    { new: true, upsert: true },
  );
}

export async function increaseInterruptFormalCount() {
  await SystemCounter.findOneAndUpdate(
    { counterType: INTERRUPTED_FORMAL_COUNT },
    { $inc: { counterValue: 1 } },
    { new: true, upsert: true },
  );
}
