def _format_column_name(col_name: str)-> str:
    return col_name.replace('_', ' ').title()

def generate_insights(
    statistics: dict, attendance_data: dict| None, score_cols: list)->list[str]:
    insights: list[str] = []
    subject_stats = statistics['subject_stats']
    
    lowest_subject = min(subject_stats, key= lambda s: subject_stats[s]['mean'])
    highest_subject = max(subject_stats, key= lambda s: subject_stats[s]['mean'])
    low_mean = subject_stats[lowest_subject]['mean']
    high_mean = subject_stats[highest_subject]['mean']
    
    insights.append(
        f'{_format_column_name(lowest_subject)} has the lowest average at {low_mean: .1f}%'
    )
    insights.append(
        f'{_format_column_name(highest_subject)} leads with {high_mean: .1f}%.'
    )
    insights.append(
        f'The {high_mean - low_mean: .1f} point gap suggests uneven academic support across subjects.'
    )
    
    failing = [s for s, v in subject_stats.items() if v['mean'] < 60]
    if failing:
        subject_list = ', '.join(_format_column_name(s) for s in failing)
        insights.append(f'Subjects with failing grades: {subject_list}')
        insights.append('More than 40% of students are below the passing threshold, targeted intervention is urgent.')
        insights.append('Consider providing additional support and resources to students struggling in these subjects.')
    
    
    red_count = statistics['grade_distribution']['red']
    total_students = statistics['total_students']
    
    if red_count > 0:
        red_percentage = round((red_count/total_students) * 100, 1)
        plural = 's' if red_count > 1 else ''
        insights.append(
            f'{red_count} student{plural} ({red_percentage}% of the class) fall in the at-risk category with an average below 50%.'
        )
        insights.append('These students require immediate personalised support.')
        
    if attendance_data and attendance_data['score_difference'] is not None:
        difference = attendance_data['score_difference']
        high_avg = attendance_data['high_attendance_avg']
        low_avg = attendance_data['low_attendance_avg']
        insights.append(
            f'Students with high attendance (80% or more) have an average score of {high_avg: .1f}%, '
            f'while those with low attendance (below 60%) average {low_avg: .1f}%. '
            f'The {difference: .1f} point difference suggests a strong correlation between attendance and academic performance.'
        )
        
    most_varied = max(subject_stats, key=lambda s: subject_stats[s]['std'])
    std_val = subject_stats[most_varied]['std']
    insights.append(
        f'{_format_column_name(most_varied)} shows the highest score variance (±{std_val:.1f})',
        f'indicating inconsistent understanding, some students excel while others struggle significantly.'
    )
    return insights


def generate_recommendations(
    statistics: dict, attendance_data: list[str], score_cols: list) -> list[str]:
    recs: list[str] = []
    subject_stats = statistics['subject_stats']
    lowest_subj = min(subject_stats, key= lambda s: subject_stats[s]['mean'])
    recs.append(
        f"Allocate additional teaching resources and revision sessions to "
        f"{_format_column_name(lowest_subj)} — it has the lowest class average."
    )
    
    red_count = statistics['grade_distribution']['red']
    if red_count > 0:
        plural = 's' if red_count > 1 else ''
        recs.append(
            f"Enrol the {red_count} at-risk student{plural} in a structured "
            f"catch-up programme with one-on-one mentoring and weekly check-ins."
        )

    
    failing = [s for s, v in subject_stats.items() if v["pass_rate"] < 60]
    if failing:
        subj_list = ", ".join(_format_column_name(s) for s in failing)
        recs.append(
            f"Introduce diagnostic assessments in {subj_list} to identify "
            f"specific knowledge gaps before end-of-term exams."
        )

     
    if attendance_data and attendance_data["score_difference"] is not None:
        if attendance_data["score_difference"] > 10:
            recs.append(
                f"Launch an attendance awareness campaign. The data shows a "
                f"{attendance_data['score_difference']:.1f}-point score advantage "
                f"for students with high attendance."
            )

    
    recs.append(
        "Recognise top performers publicly and consider a peer-tutoring "
        "programme — high achievers helping at-risk students benefits both groups."
    )

    return recs
