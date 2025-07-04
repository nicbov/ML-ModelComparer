# backend/api.py

import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report

from models.logistic import build_logistic_model
from models.random_forest import build_random_forest_model
from models.svm import build_svm_model
from models.xgboost import build_xgboost_model

def run_all_models():
    df = pd.read_csv("data/heart.csv")
    df = df.loc[:, ~df.columns.str.contains('^Unnamed')]

    X = df.drop("HeartDisease", axis=1)
    y = df["HeartDisease"]

    categorical_features = ["Sex", "ChestPainType", "RestingECG", "ExerciseAngina", "ST_Slope"]
    numeric_features = ["Age", "RestingBP", "Cholesterol", "FastingBS", "MaxHR", "Oldpeak"]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    models = {
        "Logistic Regression": build_logistic_model(categorical_features, numeric_features),
        "Random Forest": build_random_forest_model(categorical_features, numeric_features),
        "Support Vector Machine": build_svm_model(categorical_features, numeric_features),
        "XGBoost": build_xgboost_model(categorical_features, numeric_features),
    }

    results = {}

    for model_name, model in models.items():
        model.fit(X_train, y_train)
        y_pred = model.predict(X_test)
        acc = accuracy_score(y_test, y_pred)
        report = classification_report(y_test, y_pred, output_dict=True)  # JSON-safe format
        results[model_name] = {
            "accuracy": acc,
            "report": report
        }

    return results
