import json;
import os;
import sys;
import pandas as pd;


def detect_delimiter(file_path: str) -> str| None:
    with open(file_path, 'r', errors='ignore') as f:
        sample= f.read(4096)
    for delim in [',', '|', ';', '\t', '[', ']', ' ']:
        if delim in sample:
            return delim
    return None


def load_json(file_path: str) -> pd.DataFrame:
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    if isinstance(data, list):
        return pd.json_normalize(data)
    if isinstance(data, dict):
        return pd.json_normalize(data)
    raise ValueError('Unsupported JSON structure')


def load_excel(file_path: str) -> pd.DataFrame:
    return pd.read_excel(file_path)


def load_delimited(file_path: str)-> pd.DataFrame:
    delimiter = detect_delimiter(file_path)
    if delimiter is None:
        raise ValueError(f'Could not detect delimiter in {file_path}')
    return pd.read_csv(file_path, delimiter=delimiter)


def load_data(file_path: str)-> pd.DataFrame:
    ext = os.path.splitext(file_path)[1].lower()
    if ext == '.json':
        return load_json(file_path)
    elif ext in ['.xlsx', '.xls']:
        return load_excel(file_path)
    elif ext in ['.csv', '.psv', '.txt']:
        return load_delimited(file_path)
    raise ValueError(f'Unsupported file extension: {ext}')


def detect_columns(df: pd.DataFrame) -> dict:
    cols = df.columns.to_list()

    id_col = None
    for col in cols:
        if df[col].dtype == 'object':
            id_col = col
            break

    if id_col is None:
        raise ValueError("No object column found for ID")

    score_cols = [
        col for col in cols
        if pd.api.types.is_numeric_dtype(df[col]) and col != id_col
    ]

    
    attendance_col = None
    for col in cols:
        if "attendance" in col.lower():
            attendance_col = col
            break

    return {
        "id": id_col,
        "scores": score_cols,
        "attendance": attendance_col,
    }


def clean_data(df:pd.DataFrame, score: list[str]) -> pd.DataFrame:
    for col in score:
        df[col] = pd.to_numeric(df[col], errors='coerce')
    df[score] = df[score].fillna(df[score].mean())
    return df