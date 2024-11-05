import ExcelJS from 'exceljs';
import { MyReport } from '../interfaces/report.interface';

class ExcelExportService {
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
  
}

export default new ExcelExportService();
