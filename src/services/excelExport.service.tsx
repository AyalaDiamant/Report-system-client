import ExcelJS from 'exceljs';
import { MyReport } from '../interfaces/report.interface';

class ExcelExportService {
  // הפונקציות הקיימות נשארות כמו שהן

  async exportStyledReportToExcel(report: MyReport, userName: string) {
    const today = new Date();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const year = today.getFullYear().toString().slice(-2);
    const formattedDate = `${month}-${year}`;
    const totalSum: number = this.totalSumCalculation(report);
    const fileName = `דוח_${userName}_${formattedDate}.xlsx`;

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('דוח');

    worksheet.addRow([formattedDate, userName])
      .eachCell({ includeEmpty: true }, (cell) => {
        cell.font = { bold: true };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      });

    worksheet.addRow([]);
    worksheet.addRow(['כמות', 'תעריף', 'תפקיד', 'פרויקט', 'סימן', 'סעיף', 'סכום סה"כ'])
      .eachCell({ includeEmpty: true }, (cell) => {
        cell.font = { bold: true };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFF00' } };
      });

    report.deliverables.forEach(deliverable => {
      worksheet.addRow([
        deliverable.quantity,
        deliverable.rate,
        deliverable.role,
        deliverable.project,
        deliverable.sign,
        deliverable.seif,
        deliverable.total
      ]);
    });

    worksheet.addRow([]);
    worksheet.addRow(['הערה כללית', report.common, 'סכום סה"כ', totalSum]);

    await workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.click();
      window.URL.revokeObjectURL(url);
    });
  }

  totalSumCalculation(report: MyReport): number {
    return report.deliverables.reduce((sum, item) => sum + (item?.total || 0), 0);
  }

  // הפונקציה החדשה שהוספתי
  async exportReportsToExcel(reports: MyReport[], employeeNames: Record<string, string>) {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('דוחות מקור');
    const sheetUpdated = workbook.addWorksheet('דוחות לאחר שינוי');
    const sheetCalculations = workbook.addWorksheet('טבלת חישובים');
    const sheetSummary = workbook.addWorksheet('התאמות שכר');

    const headerStyle = {
      font: { bold: true },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFFF00' }
      },
      alignment: { horizontal: 'center' as ExcelJS.Alignment['horizontal'] }
    };

    const headers = ["שם עובד", "פרוייקט", "סימן", "סעיף", "תפקיד", "תעריף", "סה\"כ", "כמות", "הערה"];
    const headerRow = sheet.addRow(headers);
    headerRow.eachCell(cell => {
      cell.font = headerStyle.font;
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFF00' } };
      cell.alignment = headerStyle.alignment;
    });

    reports.forEach(report => {
      report.deliverables.forEach(e => {
        sheet.addRow([
          employeeNames[report.employeeId] || 'טוען...',
          e.project,
          e.sign,
          e.seif,
          e.role,
          e.rate,
          e.total,
          e.quantity,
          report.common
        ]);
      });
    });

    const updatedReports = reports.map(report => {
      const updatedDeliverables = report.deliverables.map(e => {
        const newRate = e.rate + (e.rateIncrease || 0);
        const newTotal = e.quantity * newRate;

        return {
          ...e,
          rate: newRate,
          total: newTotal
        };
      });

      return {
        ...report,
        deliverables: updatedDeliverables
      };
    });

    const updatedHeaderRow = sheetUpdated.addRow(headers);
    updatedHeaderRow.eachCell(cell => {
      cell.font = headerStyle.font;
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFF00' } };
      cell.alignment = headerStyle.alignment;
    });

    updatedReports.forEach(report => {
      report.deliverables.forEach(e => {
        sheetUpdated.addRow([
          employeeNames[report.employeeId] || 'טוען...',
          e.project,
          e.sign,
          e.seif,
          e.role,
          e.rate,
          e.total,
          e.quantity,
          report.common
        ]);
      });
    });

    const calcHeaders = ["שם עובד", "שכר נטו", "שכר ברוטו", "הפרש 15%", "יתרה"];
    const calcHeaderRow = sheetCalculations.addRow(calcHeaders);
    calcHeaderRow.eachCell(cell => {
      cell.font = headerStyle.font;
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFF00' } };
      cell.alignment = headerStyle.alignment;
    });

    reports.forEach(report => {
      report.deliverables.forEach(e => {
        let grossSalary = 0;
        let netSalary = 0;
        let deduction = 0;
        let balance = 0;

        netSalary = e.quantity * e.rate;

        const newRate = e.rate + (e.rateIncrease || 0);
        grossSalary = e.quantity * newRate;

        deduction = grossSalary * 0.15;

        balance = grossSalary - netSalary - deduction;

        sheetCalculations.addRow([
          employeeNames[report.employeeId] || 'טוען...',
          netSalary,
          grossSalary,
          deduction,
          balance
        ]);
      });
    });

    const employeeSummaries: { _id: number; name: string; totalNetSalary: number; totalGrossSalary: number; difference: number; }[] = [];

    sheetCalculations.eachRow((row, rowIndex) => {
      if (rowIndex > 1) {
        const employeeName = row.getCell(1).value;
        const netSalary = row.getCell(2).value;
        const grossSalary = row.getCell(3).value;

        let existingEmployee = employeeSummaries.find(emp => emp.name === employeeName);

        if (existingEmployee) {
          existingEmployee.totalNetSalary += Number(netSalary);
          existingEmployee.totalGrossSalary += Number(grossSalary);
          existingEmployee.difference = existingEmployee.totalGrossSalary - 3000 > 0 ? existingEmployee.totalGrossSalary - 3000 : 0;
        } else {
          employeeSummaries.push({
            _id: rowIndex,
            name: String(employeeName),
            totalNetSalary: netSalary as number,
            totalGrossSalary: grossSalary as number,
            difference: (grossSalary as number) > 3000 ? (grossSalary as number) - 3000 : 0
          });
        }
      }
    });

    const summaryHeaders = ["שם עובד", "שכר נטו", "שכר ברוטו"];
    const summaryHeaderRow = sheetSummary.addRow(summaryHeaders);
    summaryHeaderRow.eachCell(cell => {
      cell.font = headerStyle.font;
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFF00' } };
      cell.alignment = headerStyle.alignment;
    });

    employeeSummaries.forEach(emp => {
      sheetSummary.addRow([
        emp.name,
        emp.totalNetSalary,
        emp.totalGrossSalary
      ]);
    });

    await workbook.xlsx.writeBuffer().then(buffer => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `דוחות_${new Date().toISOString().split('T')[0]}.xlsx`;
      link.click();
      window.URL.revokeObjectURL(url);
    });
  }
}

export default new ExcelExportService();
