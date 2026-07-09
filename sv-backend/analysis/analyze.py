import sys
import json
import warnings

warnings.filterwarnings('ignore')

from loader import load_data, detect_columns, clean_data
from statistics import compute_stats, attendance_analysis
from insights import generate_insights, generate_recommendations
from charts import build_charts_data


def run(file_path: str) -> dict:
    df = load_data(file_path)
    col_info = detect_columns(df)
    id_col = col_info['id']
    score_cols = col_info['scores']
    attendance_col = col_info['attendance']

    if not score_cols:
        raise ValueError('No numeric score columns found in the file.')

    df = clean_data(df, score_cols)

    statistics = compute_stats(df, score_cols, id_col)
    attendance_data = attendance_analysis(df, score_cols, attendance_col)

    insights = generate_insights(statistics, attendance_data, score_cols)
    recommendations = generate_recommendations(statistics, attendance_data, score_cols)
    charts = build_charts_data(statistics, score_cols)

    del statistics['df_with_grades']

    return {
        'success': True,
        'summary': {
            'totalStudents': statistics['total_students'],
            'subjectAnalysed': len(score_cols),
            'gradeDistribution': statistics['grade_distribution'],
            'subjectStatistics': statistics['subject_stats'],
            'topStudents': statistics['top_students'],
            'weakStudents': statistics['weak_students'],
        },
        'attendanceInsight': attendance_data,
        'insights': insights,
        'recommendations': recommendations,
        'chartData': charts,
        'columnsDetected': {
            'id': id_col,
            'scores': score_cols,
            'attendance': attendance_col,
        },
    }


def main():
    if len(sys.argv) < 2:
        print(json.dumps({'success': False, 'error': 'No file path provided'}))
        sys.exit(1)

    try:
        result = run(sys.argv[1])
        print(json.dumps(result, default=str))
    except Exception as e:
        print(json.dumps({'success': False, 'error': str(e)}))
        sys.exit(1)


if __name__ == '__main__':
    main()
