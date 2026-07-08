import numpy as np
import pandas as pd

Green = 75
Yellow = 50

def _grade_label(score: float) -> str:
    if score >= Green:
        return 'green'
    if score >= Yellow:
        return 'yellow'
    return 'red'


def compute_stats(df:pd.DataFrame, score_cols:list, id_col:str) -> dict:
    subjects_stats = {}
    
    for col in score_cols:
        subjects_stats[col] = {
            'mean': round(float(df[col].mean()), 2),
            'median': round(float(df[col].median()), 2),
            'std': round(float(df[col].std()), 2),
            'min': round(float(df[col].min()), 2),
            'max': round(float(df[col].max()), 2),
            'pass-rate': round(float((df[col] >= Yellow).mean() * 100), 2),
        }
    
    df['_total'] = df[score_cols].mean(axis=1)
    df['_grade'] = df['_total'].apply(_grade_label)
    
    grade_dist = df['_grade'].value_counts().to_dict()
    n= min(5, len(df))
    cols_to_show = [id_col, '_total'] + score_cols
    
    top_students = (
        df.nlargest(n, '_total')[cols_to_show]
        .round(2)
        .to_dict(orient='records')
    )
    
    weak_students = (
        df.nsmallest(n, '_total')[cols_to_show]
        .round(2)
        .to_dict(orient='records')
    )
    
    return {
        'subject_stats': subjects_stats,
        'top_students': top_students,
        'weak_students': weak_students,
        'grade_distribution': {
            'green': int(grade_dist.get('green', 0)),
            'yellow': int(grade_dist.get('yellow', 0)),
            'red': int(grade_dist.get('red', 0)),
        },
        'total_students': len(df),
        'df_with_grades': df,
    }
    
def attendance_analysis(df:pd.DataFrame, score_cols:list, attendance_cols: str|None)-> dict|None:
    if attendance_cols is None:
        return None
    
    df = df.copy()
    df['attendance'] = pd.to_numeric(df[attendance_cols], errors='coerce').clip(0, 100)
    df['total_score'] = df[score_cols].mean(axis=1)
    
    high_avg= df[df['attendance'] >=80]['total_score'].mean()
    low_avg = df[df['attendance'] < 60]['total_score'].mean()
    
    diff = (round(float(high_avg - low_avg), 2) if not np.isnan(high_avg - low_avg) else None)
    
    return{
        'high_attendance_avg': round(float(high_avg), 2) if not np.isnan(high_avg) else None,
        'low_attendance_avg': round(float(low_avg), 2) if not np.isnan(low_avg) else None,
        'difference': diff,
        'attendance_column': attendance_cols,
    }
    