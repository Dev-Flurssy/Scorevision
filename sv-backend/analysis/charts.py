def build_charts_data(statistics: dict, score_cols: list)->dict:
    subject_stats = statistics['subject_stats']
    grade_dist = statistics['grade_distribution']
    
    subject_averages = [{
        'subject': col.replace('_', ' ').title(),
        'average': subject_stats[col]['mean'],
        'passRate': subject_stats[col]['pass_rate'], 
    }
    for col in score_cols
    ]
    
    grade_chart =[
        {"name": "Top (>=75)",       "value": grade_dist["green"],  "color": "#22c55e"},
        {"name": "Average (50–74)", "value": grade_dist["yellow"], "color": "#eab308"},
        {"name": "At Risk (<50)",   "value": grade_dist["red"],    "color": "#ef4444"},
    ]
    
    top_charts = [
        {'name': str(list(s.values())[0]),
         'score': s.get('_total', 0)
         }
        for s in statistics['top_students']
    ] 
    
    return{
        'subjectAverages': subject_averages,
        'gradeDistribution':grade_chart,
        'topStudents': top_charts
    }