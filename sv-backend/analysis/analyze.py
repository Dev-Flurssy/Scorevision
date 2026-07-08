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
    col_info = df['col']
    id_col = col_info['id_col']
    score_col = col_info['score_cols']
    attendance_col = col_info['attendance_col']
    
    return{
        'data':df,
        'columninformation': col_info,
        'studentId': id_col,
        'studentScores':score_col,
        'studentAttendance':attendance_col
    }