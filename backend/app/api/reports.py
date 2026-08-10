"""
Reports Router: PDF export generation, Report metadata storage, and CSV/Excel downloads.
"""

import os
import pandas as pd
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from backend.app.database.database import get_db
from backend.app.models import User, Dataset, Report, AnalysisResult
from backend.app.schemas.report import ReportOut, CreateReportRequest
from backend.app.api.deps import get_current_user
from backend.app.core.config import settings
from backend.app.analysis.statistics import calculate_descriptive_statistics
from backend.app.analysis.data_quality import calculate_data_quality_score

router = APIRouter(prefix="/reports", tags=["Reports"])


def _generate_pdf_report(dataset: Dataset, df: pd.DataFrame, pdf_path: str):
    """Generates a professional PDF executive report using ReportLab or fallback TXT/PDF formatting."""
    quality_info = calculate_data_quality_score(df)
    stats_info = calculate_descriptive_statistics(df)

    try:
        from reportlab.lib.pagesizes import letter
        from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
        from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
        from reportlab.lib import colors

        doc = SimpleDocTemplate(pdf_path, pagesize=letter)
        styles = getSampleStyleSheet()
        story = []

        title_style = ParagraphStyle(
            'TitleStyle',
            parent=styles['Heading1'],
            fontSize=22,
            leading=26,
            textColor=colors.HexColor('#0F172A'),
            spaceAfter=12
        )

        subtitle_style = ParagraphStyle(
            'SubTitleStyle',
            parent=styles['Normal'],
            fontSize=12,
            textColor=colors.HexColor('#64748B'),
            spaceAfter=20
        )

        story.append(Paragraph(f"DataPilot AI - Executive Report", title_style))
        story.append(Paragraph(f"Dataset: <b>{dataset.name}</b> | Filename: {dataset.filename} | Total Rows: {len(df):,}", subtitle_style))
        story.append(Spacer(1, 10))

        # Data Quality Section
        story.append(Paragraph("1. Data Quality & Health Score", styles['Heading2']))
        grade_str = quality_info.get('grade', 'A+')
        score_text = f"Overall Quality Score: <b>{quality_info['overall_score']:.1f}%</b> ({grade_str})"
        story.append(Paragraph(score_text, styles['Normal']))
        story.append(Spacer(1, 10))

        # Table of Column Metrics
        story.append(Paragraph("2. Column Breakdown & Metrics", styles['Heading2']))
        table_data = [["Column Name", "Type", "Missing Rows", "Unique Values"]]
        for col in df.columns[:10]:
            dt = str(df[col].dtype)
            table_data.append([
                str(col),
                "Numeric" if "int" in dt or "float" in dt else "String",
                str(df[col].isnull().sum()),
                str(df[col].nunique())
            ])

        t = Table(table_data)
        t.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#1E293B')),
            ('TEXTCOLOR', (0,0), (-1,0), colors.whitesmoke),
            ('ALIGN', (0,0), (-1,-1), 'LEFT'),
            ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
            ('BOTTOMPADDING', (0,0), (-1,0), 8),
            ('BACKGROUND', (0,1), (-1,-1), colors.HexColor('#F8FAFC')),
            ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#CBD5E1')),
        ]))
        story.append(t)
        story.append(Spacer(1, 15))

        # Algorithmic Recommendations
        story.append(Paragraph("3. Algorithmic Recommendations (DSA)", styles['Heading2']))
        story.append(Paragraph("• <b>Primary Search Indexing</b>: Hash Table index on record keys for O(1) retrieval.", styles['Normal']))
        story.append(Paragraph("• <b>Sorting Strategy</b>: QuickSort / MergeSort for O(n log n) sorting.", styles['Normal']))
        story.append(Paragraph("• <b>Heap Selection</b>: Min/Max Heap extraction for top-K metrics.", styles['Normal']))

        doc.build(story)
    except Exception as e:
        print(f"ReportLab PDF generation error: {e}. Writing fallback PDF/text...")
        with open(pdf_path, "w") as f:
            f.write(f"DataPilot AI - Executive Report\nDataset: {dataset.name}\nQuality: {quality_info['overall_score']}%\nTotal Rows: {len(df)}")


@router.post("/generate", response_model=ReportOut)
def generate_report(
    req: CreateReportRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    dataset = db.query(Dataset).filter(Dataset.id == req.dataset_id, (Dataset.user_id == current_user.id) | (Dataset.user_id == 1)).first()
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found")

    if not os.path.exists(dataset.file_path):
        raise HTTPException(status_code=404, detail="Dataset file missing")

    if dataset.filename.endswith('.csv'):
        df = pd.read_csv(dataset.file_path)
    elif dataset.filename.endswith(('.xlsx', '.xls')):
        df = pd.read_excel(dataset.file_path)
    else:
        df = pd.read_json(dataset.file_path)

    report_type = (req.report_type or "PDF").lower()
    if "csv" in report_type:
        ext = "csv"
        media = "text/csv"
    elif "excel" in report_type or "xlsx" in report_type:
        ext = "xlsx"
        media = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    else:
        ext = "pdf"
        media = "application/pdf"

    report_filename = f"report_{dataset.id}_{int(pd.Timestamp.now().timestamp())}.{ext}"
    file_path = os.path.join(settings.EXPORT_DIR, report_filename)

    if ext == "csv":
        df.to_csv(file_path, index=False)
    elif ext == "xlsx":
        df.to_excel(file_path, index=False)
    else:
        _generate_pdf_report(dataset, df, file_path)

    file_size = os.path.getsize(file_path) if os.path.exists(file_path) else 1024

    report = Report(
        user_id=current_user.id,
        dataset_id=dataset.id,
        title=req.title or f"Executive Analysis Report - {dataset.name}",
        report_type=req.report_type or "PDF",
        file_path=file_path,
        status="Completed"
    )
    db.add(report)
    db.commit()
    db.refresh(report)

    return ReportOut(
        id=report.id,
        dataset_id=report.dataset_id,
        title=report.title,
        report_type=report.report_type,
        file_size_bytes=file_size,
        status=report.status,
        download_url=f"/api/reports/{report.id}/download",
        created_at=report.created_at
    )


@router.get("", response_model=List[ReportOut])
def list_reports(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    reports = db.query(Report).filter(Report.user_id == current_user.id).order_by(Report.created_at.desc()).all()
    return [
        ReportOut(
            id=r.id,
            dataset_id=r.dataset_id,
            title=r.title,
            report_type=r.report_type,
            file_size_bytes=os.path.getsize(r.file_path) if os.path.exists(r.file_path) else 1024,
            status=r.status,
            download_url=f"/api/reports/{r.id}/download",
            created_at=r.created_at
        ) for r in reports
    ]


@router.get("/{report_id}/download")
def download_report(
    report_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    report = db.query(Report).filter(Report.id == report_id, Report.user_id == current_user.id).first()
    if not report or not os.path.exists(report.file_path):
        raise HTTPException(status_code=404, detail="Report file not found")

    return FileResponse(
        path=report.file_path,
        media_type="application/pdf",
        filename=os.path.basename(report.file_path)
    )
