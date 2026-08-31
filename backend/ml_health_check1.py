import joblib
import numpy as np
import pandas as pd

bundle = joblib.load("app/ml/model.pkl")
model       = bundle["model"]
feat_names  = bundle["feature_names"]
class_names = bundle["class_names"]

# Feature order: latitude, longitude, admin_division_population, gazeteer_distance,
#                event_year, event_month, event_month_rainfall, seasonal_rainfall, ANNUAL

# ── HIGH RISK: NER coords, heavy rainfall, recent year, monsoon month
high_risk = pd.DataFrame([[
    26.5,   # latitude  (Assam region)
    92.0,   # longitude
    50000,  # admin_division_population
    5.0,    # gazeteer_distance (km)
    2023,   # event_year
    7,      # event_month (July = peak monsoon)
    450.0,  # event_month_rainfall (mm)
    1200.0, # seasonal_rainfall (mm)
    2800.0  # ANNUAL (mm)
]], columns=feat_names)

# ── LOW RISK: dry month, low rainfall
low_risk = pd.DataFrame([[
    26.5, 92.0, 50000, 5.0,
    2023,
    1,      # January (dry)
    20.0,   # low monthly rain
    60.0,   # low seasonal
    800.0   # low annual
]], columns=feat_names)

print("Feature Importance (ranked):")
fi = pd.Series(model.feature_importances_, index=feat_names).sort_values(ascending=False)
print(fi.to_string())

print("\n─── SANITY PREDICTIONS ───")
for label, row in [("HIGH-RISK (July, heavy rain)", high_risk), ("LOW-RISK (Jan, dry)", low_risk)]:
    pred  = model.predict(row)[0]
    probs = model.predict_proba(row)[0]
    print(f"\n{label}")
    print(f"  → Prediction: {pred}")
    for c, p in zip(class_names, probs):
        bar = "█" * int(p * 20)
        print(f"  {c:8s}: {p:.3f} {bar}")