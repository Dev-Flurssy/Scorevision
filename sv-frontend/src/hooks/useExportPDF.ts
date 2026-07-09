import { useCallback, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import type { AnalysisResult } from "../types/dataTypes";

export function useExportPDF(data: AnalysisResult) {
  const [exporting, setExporting] = useState(false);

  const exportPDF = useCallback(async () => {
    const el = document.getElementById("dashboard-export-root");
    if (!el) return;

    setExporting(true);

    try {
      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
        logging: false,
      });

      const PAGE_W = 210;
      const PAGE_H = 297;
      const MARGIN = 12;
      const CONTENT_W = PAGE_W - MARGIN * 2;

      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

      // Cover header bar
      pdf.setFillColor(15, 23, 42);
      pdf.rect(0, 0, PAGE_W, 28, "F");
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(18);
      pdf.setFont("helvetica", "bold");
      pdf.text("ScoreVision — Analysis Report", MARGIN, 16);
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "normal");
      pdf.text(`Generated: ${new Date().toLocaleString()}`, MARGIN, 23);

      // Quick-stats row
      const { summary, attendanceInsight } = data;
      const { totalStudents, subjectAnalysed, gradeDistribution } = summary;

      const stats: { label: string; value: string }[] = [
        { label: "Students",      value: String(totalStudents) },
        { label: "Subjects",      value: String(subjectAnalysed) },
        { label: "Top (>=75%)",   value: String(gradeDistribution.green) },
        { label: "Average",       value: String(gradeDistribution.yellow) },
        { label: "At Risk (<50%)",value: String(gradeDistribution.red) },
        ...(attendanceInsight?.difference != null
          ? [{ label: "Attend. Gap", value: `${attendanceInsight.difference.toFixed(1)} pts` }]
          : []),
      ];

      const boxW = CONTENT_W / stats.length;
      const boxY = 32;
      const boxH = 18;

      stats.forEach((s, i) => {
        const x = MARGIN + i * boxW;
        pdf.setFillColor(30, 41, 59);
        pdf.roundedRect(x, boxY, boxW - 2, boxH, 2, 2, "F");
        pdf.setTextColor(99, 179, 237);
        pdf.setFontSize(13);
        pdf.setFont("helvetica", "bold");
        pdf.text(s.value, x + (boxW - 2) / 2, boxY + 8, { align: "center" });
        pdf.setTextColor(148, 163, 184);
        pdf.setFontSize(7);
        pdf.setFont("helvetica", "normal");
        pdf.text(s.label, x + (boxW - 2) / 2, boxY + 14, { align: "center" });
      });

      // Paginated screenshot
      const firstPageContentY = boxY + boxH + 6;
      const firstPageContentH = PAGE_H - firstPageContentY - MARGIN;
      const imgW = CONTENT_W;
      const imgH = (canvas.height * imgW) / canvas.width;

      let remainingImgH = imgH;
      let srcOffsetMM = 0;
      let isFirstPage = true;

      while (remainingImgH > 0) {
        const slotH = isFirstPage ? firstPageContentH : PAGE_H - MARGIN * 2;
        const sliceH = Math.min(remainingImgH, slotH);
        const srcY = (srcOffsetMM / imgH) * canvas.height;
        const srcH = (sliceH / imgH) * canvas.height;

        const sliceCanvas = document.createElement("canvas");
        sliceCanvas.width = canvas.width;
        sliceCanvas.height = Math.ceil(srcH);
        const ctx = sliceCanvas.getContext("2d")!;
        ctx.drawImage(canvas, 0, -srcY);
        const sliceData = sliceCanvas.toDataURL("image/png");

        const destY = isFirstPage ? firstPageContentY : MARGIN;
        pdf.addImage(sliceData, "PNG", MARGIN, destY, imgW, sliceH);

        remainingImgH -= sliceH;
        srcOffsetMM += sliceH;

        if (remainingImgH > 0) {
          pdf.addPage();
          isFirstPage = false;
        }
      }

      // Page numbers
      const totalPages = (
        pdf as unknown as { internal: { getNumberOfPages(): number } }
      ).internal.getNumberOfPages();

      for (let p = 1; p <= totalPages; p++) {
        pdf.setPage(p);
        pdf.setFontSize(8);
        pdf.setTextColor(100, 116, 139);
        pdf.text(`Page ${p} of ${totalPages}`, PAGE_W - MARGIN, PAGE_H - 5, {
          align: "right",
        });
      }

      pdf.save(`ScoreVision_Report_${Date.now()}.pdf`);
    } finally {
      setExporting(false);
    }
  }, [data]);

  return { exportPDF, exporting };
}
