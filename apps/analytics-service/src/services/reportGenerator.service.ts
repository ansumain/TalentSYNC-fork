import ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';
import type { AggregatedReportSnapshot } from '../types/Export.type';

const formatDate = (iso: string | null | undefined) => (iso ? new Date(iso).toLocaleString() : 'N/A');

const generateExcelBuffer = async (snapshot: AggregatedReportSnapshot): Promise<Buffer> => {
  const wb = new ExcelJS.Workbook();

  const counters = wb.addWorksheet('Counters');
  counters.addRow(['Metric', 'Value']);
  counters.addRow(['Interview Scheduled', snapshot.counters.interviews.scheduled]);
  counters.addRow(['Interview Completed', snapshot.counters.interviews.completed]);
  counters.addRow(['Interview Cancelled', snapshot.counters.interviews.cancelled]);
  counters.addRow(['Interview NoShow', snapshot.counters.interviews.noShow]);
  counters.addRow(['Open Jobs', snapshot.counters.openJobs]);
  counters.addRow(['Hires', snapshot.counters.hires]);
  counters.addRow(['Last Updated At', formatDate(snapshot.counters.lastUpdatedAt)]);

  const skillGap = wb.addWorksheet('Skill Gap');
  skillGap.addRow(['Skill', 'Demand', 'Supply']);
  snapshot.graphs.skillGapBar.forEach((item) => {
    skillGap.addRow([item.skillName, item.demandCount, item.supplyCount]);
  });

  const jobPie = wb.addWorksheet('Job Applications');
  jobPie.addRow(['Job Title', 'Applications']);
  snapshot.graphs.jobApplicationsPie.forEach((item) => {
    jobPie.addRow([item.jobTitle, item.applicationCount]);
  });

  const funnel = wb.addWorksheet('Funnel');
  funnel.addRow(['Field', 'Value']);
  funnel.addRow(['Job', snapshot.tables.funnel.jobTitle]);
  funnel.addRow(['Applied', snapshot.tables.funnel.applied]);
  funnel.addRow(['Shortlisted', snapshot.tables.funnel.shortlisted]);
  funnel.addRow(['Selected', snapshot.tables.funnel.selected]);
  funnel.addRow(['Hired', snapshot.tables.funnel.hired]);
  funnel.addRow(['Time To Hire (Days)', snapshot.tables.funnel.timeToHireDays]);
  funnel.addRow(['Conversion Rate (%)', snapshot.tables.funnel.conversionRate]);

  const interviewers = wb.addWorksheet('Interviewer Performance');
  interviewers.addRow(['Interviewer', 'Total Interviews', 'Passed', 'Failed', 'Pass Rate (%)']);
  snapshot.tables.interviewerPerformance.forEach((item) => {
    interviewers.addRow([
      item.interviewerName,
      item.totalInterviews,
      item.passedCount,
      item.failedCount,
      item.passRate,
    ]);
  });

  const buffer = await wb.xlsx.writeBuffer();
  return Buffer.from(buffer);
};

const generatePdfBuffer = async (snapshot: AggregatedReportSnapshot): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 40, size: 'A4' });
    const chunks: Buffer[] = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    doc.fontSize(18).text('TalentSYNC Analytics Export', { underline: true });
    doc.moveDown();
    doc.fontSize(10).text(`Generated At: ${new Date(snapshot.generatedAt).toLocaleString()}`);
    doc.text(`Range: ${snapshot.filters.fromDate} to ${snapshot.filters.toDate}`);
    doc.moveDown();

    doc.fontSize(14).text('Counters');
    doc.fontSize(11).text(`Scheduled: ${snapshot.counters.interviews.scheduled}`);
    doc.text(`Completed: ${snapshot.counters.interviews.completed}`);
    doc.text(`Cancelled: ${snapshot.counters.interviews.cancelled}`);
    doc.text(`NoShow: ${snapshot.counters.interviews.noShow}`);
    doc.text(`Open Jobs: ${snapshot.counters.openJobs}`);
    doc.text(`Hires: ${snapshot.counters.hires}`);
    doc.text(`Last Updated: ${formatDate(snapshot.counters.lastUpdatedAt)}`);
    doc.moveDown();

    doc.fontSize(14).text('Skill Gap (Top 10)');
    snapshot.graphs.skillGapBar.slice(0, 10).forEach((item) => {
      doc.fontSize(10).text(`${item.skillName}: demand=${item.demandCount}, supply=${item.supplyCount}`);
    });
    doc.moveDown();

    doc.fontSize(14).text('Job Applications');
    snapshot.graphs.jobApplicationsPie.forEach((item) => {
      doc.fontSize(10).text(`${item.jobTitle}: ${item.applicationCount}`);
    });
    doc.moveDown();

    doc.fontSize(14).text('Funnel');
    doc.fontSize(10).text(`Job: ${snapshot.tables.funnel.jobTitle}`);
    doc.text(`Applied: ${snapshot.tables.funnel.applied}`);
    doc.text(`Shortlisted: ${snapshot.tables.funnel.shortlisted}`);
    doc.text(`Selected: ${snapshot.tables.funnel.selected}`);
    doc.text(`Hired: ${snapshot.tables.funnel.hired}`);
    doc.text(`Time To Hire (Days): ${snapshot.tables.funnel.timeToHireDays}`);
    doc.text(`Conversion Rate (%): ${snapshot.tables.funnel.conversionRate}`);
    doc.moveDown();

    doc.fontSize(14).text('Interviewer Performance (Top 15)');
    snapshot.tables.interviewerPerformance.slice(0, 15).forEach((item) => {
      doc.fontSize(10).text(
        `${item.interviewerName}: total=${item.totalInterviews}, passed=${item.passedCount}, failed=${item.failedCount}, passRate=${item.passRate}%`
      );
    });

    doc.end();
  });
};

export { generateExcelBuffer, generatePdfBuffer };
