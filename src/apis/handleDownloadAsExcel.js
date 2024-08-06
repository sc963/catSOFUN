import log4js from 'log4js';
import fs from 'fs';
import xlsx from 'node-xlsx';
import getCDVTExcelData from './excelReports/cdvtReport';
import getLeisureExcelData from './excelReports/leisureReport';
import getSocialParticipateExcelData from './excelReports/socialParticipareReport';
import getToolingLifeExcelData from './excelReports/toolingReport';
import getEmotionalExcelData from './excelReports/emotionalReport';
import getCAATExcelData from './excelReports/caatReport';
import Case from '../db/case/model';
import {
  CDVT,
  LEISURE,
  SOCIAL_PARTICIPATE,
  TOOLING_LIFE,
  EMOTIONAL,
  CAAT,
  SQOL,
} from '../constants/testType.const';
import getDatetimeString from '../utils/reports/getDatetimeString';
import getSQOLExcelData from './excelReports/sqolReport';

const log = log4js.getLogger('handleDownloadAsExcel');

function getSheetName(testName) {
  return `${testName}-報表產生於-${getDatetimeString(Date.now().toString())}`;
}

async function handleDownloadAsExcel(req, res) {
  try {
    const { caseNo, caseIds } = req.query;
    const filename = 'cdvtReport.xlsx';
    let cases = null;

    if (caseNo) {
      cases = await Case.find({ caseNo });
    } else if (caseIds && Array.isArray(caseIds)) {
      cases = await Case.find({ _id: caseIds });
    } else {
      throw Error('INVALID PARAMETERS');
    }

    if (cases && Array.isArray(cases)) {
      const excelSheets = [];

      // CDVT Cases
      const cdvtCases = cases.filter(c => c.testType === CDVT);
      if (cdvtCases && cdvtCases.length > 0) {
        const cdvtExcelData = await getCDVTExcelData(cdvtCases);
        const cdvtSheet = {
          name: getSheetName('CDVT'),
          data: cdvtExcelData,
        };
        excelSheets.push(cdvtSheet);
      }

      // Leisure
      const leisureCases = cases.filter(c => c.testType === LEISURE);
      if (leisureCases && leisureCases.length > 0) {
        const leisureExcelData = await getLeisureExcelData(leisureCases);
        const leisureSheet = {
          name: getSheetName('休閒生活'),
          data: leisureExcelData,
        };
        excelSheets.push(leisureSheet);
      }

      // Social Participate
      const socialCases = cases.filter(c => c.testType === SOCIAL_PARTICIPATE);
      if (socialCases && socialCases.length > 0) {
        const socialExcelData = await getSocialParticipateExcelData(
          socialCases,
        );
        const socialSheet = {
          name: getSheetName('社會參與'),
          data: socialExcelData,
        };
        excelSheets.push(socialSheet);
      }

      // Tooling Life
      const toolingCases = cases.filter(c => c.testType === TOOLING_LIFE);
      if (toolingCases && toolingCases.length > 0) {
        const toolingExcelData = await getToolingLifeExcelData(toolingCases);
        const toolingSheet = {
          name: getSheetName('日常生活'),
          data: toolingExcelData,
        };
        excelSheets.push(toolingSheet);
      }

      // Emotional
      const emotionalCases = cases.filter(c => c.testType === EMOTIONAL);
      if (emotionalCases && emotionalCases.length > 0) {
        const emotionalExcelData = await getEmotionalExcelData(emotionalCases);
        const emotionalSheet = {
          name: getSheetName('表情測驗'),
          data: emotionalExcelData,
        };
        excelSheets.push(emotionalSheet);
      }

      // CAAT
      const caatCases = cases.filter(c => c.testType === CAAT);
      if (caatCases && caatCases.length > 0) {
        const caatExcelData = await getCAATExcelData(caatCases);
        const caatSheet = {
          name: getSheetName('CAAT'),
          data: caatExcelData,
        };
        excelSheets.push(caatSheet);
      }

      // SQOL
      const sqolCases = cases.filter(c => c.testType === SQOL);
      if (sqolCases && sqolCases.length > 0) {
        const sqolExcelData = await getSQOLExcelData(sqolCases);
        const sqolSheet = {
          name: getSheetName('SQOL'),
          data: sqolExcelData,
        };
        excelSheets.push(sqolSheet);
      }

      const buffer = xlsx.build(excelSheets);
      fs.writeFileSync(filename, buffer);
      res.download(filename);
    } else {
      throw Error('DATA NOT FOUND');
    }
  } catch (e) {
    log.error(e);
    res.status(200).send({ ok: false, message: e.message });
  }
}

export default handleDownloadAsExcel;
