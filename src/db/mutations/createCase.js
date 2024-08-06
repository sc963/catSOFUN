import Case from '../case/model';

async function createCase(
  _,
  { caseNo, medicalStaffId: medicalStaff, locationId: location, testType },
) {
  const c = await Case.create({ caseNo, medicalStaff, location, testType });
  return c;
}

export default createCase;
