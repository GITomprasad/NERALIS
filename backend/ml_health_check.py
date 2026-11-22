import joblib
import pandas as pd

MODEL_PATH = "app/ml/model.pkl"

# ─────────────────────────────────────────────
# 1. LOAD MODEL BUNDLE
# ─────────────────────────────────────────────

print("=" * 60)
print("NERALIS ML HEALTH CHECK")
print("=" * 60)

try:
    bundle = joblib.load(MODEL_PATH)

    print("\n✅ MODEL LOADED SUCCESSFULLY")

except Exception as e:
    print(f"\n❌ MODEL FAILED TO LOAD")
    print(f"Error: {e}")
    raise


# ─────────────────────────────────────────────
# 2. CHECK BUNDLE CONTENTS
# ─────────────────────────────────────────────

print("\n" + "=" * 60)
print("MODEL BUNDLE CHECK")
print("=" * 60)

print("\nBundle keys:")
for key in bundle.keys():
    print(f"  - {key}")


# ─────────────────────────────────────────────
# 3. EXTRACT MODEL + METADATA
# ─────────────────────────────────────────────

model = bundle["model"]
feature_names = bundle["feature_names"]
class_names = bundle["class_names"]

print("\nModel type:")
print(f"  {type(model)}")

print("\nClasses:")
for class_name in class_names:
    print(f"  - {class_name}")

print("\nFeatures:")
for i, feature in enumerate(feature_names, start=1):
    print(f"  {i}. {feature}")


# ─────────────────────────────────────────────
# 4. BASIC FEATURE VALIDATION
# ─────────────────────────────────────────────

print("\n" + "=" * 60)
print("FEATURE VALIDATION")
print("=" * 60)

print(f"\nExpected feature count: {len(feature_names)}")

if len(feature_names) == 9:
    print("✅ Correct feature count: 9")
else:
    print(f"⚠️ Unexpected feature count: {len(feature_names)}")


expected_features = [
    "latitude",
    "longitude",
    "admin_division_population",
    "gazeteer_distance",
    "event_year",
    "event_month",
    "event_month_rainfall",
    "seasonal_rainfall",
    "ANNUAL"
]

if list(feature_names) == expected_features:
    print("✅ Feature order matches expected model configuration")
else:
    print("⚠️ Feature names/order do not exactly match expected configuration")

    print("\nExpected:")
    print(expected_features)

    print("\nFound:")
    print(list(feature_names))


# ─────────────────────────────────────────────
# 5. PIPELINE CHECK
# ─────────────────────────────────────────────

print("\n" + "=" * 60)
print("PIPELINE CHECK")
print("=" * 60)

if hasattr(model, "named_steps"):
    print("\n✅ Model is a sklearn Pipeline")

    print("\nPipeline steps:")
    for name, step in model.named_steps.items():
        print(f"  - {name}: {type(step).__name__}")

    classifier = model.named_steps.get("classifier")

    if classifier is not None:
        print("\nClassifier:")
        print(f"  {type(classifier).__name__}")

        if hasattr(classifier, "n_estimators"):
            print(f"  n_estimators: {classifier.n_estimators}")

else:
    print("\nℹ️ Model is not a Pipeline")


# ─────────────────────────────────────────────
# FINAL STATUS
# ─────────────────────────────────────────────

print("\n" + "=" * 60)
print("FIRST-STAGE HEALTH CHECK COMPLETE")
print("=" * 60)

print("""
What this verifies:
✅ model.pkl exists and loads
✅ model bundle structure works
✅ model metadata is available
✅ correct number of features
✅ feature order is checked
✅ pipeline structure is checked
""")

# ─────────────────────────────────────────────
# 6. PREDICTION HEALTH CHECK
# ─────────────────────────────────────────────

import numpy as np

print("\n" + "=" * 60)
print("PREDICTION HEALTH CHECK")
print("=" * 60)

# Use one realistic NERALIS-style input row
sample = np.array([[
    26.14,      # latitude
    91.74,      # longitude
    1000000,    # admin_division_population
    25.0,       # gazeteer_distance
    2014,       # event_year
    7,          # event_month
    350.0,      # event_month_rainfall
    1200.0,     # seasonal_rainfall
    2500.0      # ANNUAL
]])

print("\nTest input:")
for feature, value in zip(feature_names, sample[0]):
    print(f"  {feature}: {value}")

try:
    prediction = model.predict(sample)[0]
    probabilities = model.predict_proba(sample)[0]

    print("\n✅ PREDICTION SUCCESSFUL")

    print(f"\nPredicted class: {prediction}")

    print("\nClass probabilities:")

    for class_name, probability in zip(class_names, probabilities):
        print(f"  {class_name}: {probability:.4f}")

    probability_sum = probabilities.sum()

    print(f"\nProbability sum: {probability_sum:.6f}")

    if np.isclose(probability_sum, 1.0):
        print("✅ Probabilities are valid")
    else:
        print("❌ Probabilities do not sum to 1")

except Exception as e:
    print("\n❌ PREDICTION FAILED")
    print(f"Error: {e}")


# ─────────────────────────────────────────────
# 7. FEATURE IMPORTANCE HEALTH CHECK
# ─────────────────────────────────────────────

import pandas as pd

print("\n" + "=" * 60)
print("FEATURE IMPORTANCE HEALTH CHECK")
print("=" * 60)

if hasattr(model, "feature_importances_"):

    importance = pd.DataFrame({
        "feature": feature_names,
        "importance": model.feature_importances_
    }).sort_values(
        "importance",
        ascending=False
    )

    print("\nFeature importance ranking:\n")

    for rank, (_, row) in enumerate(importance.iterrows(), start=1):
        print(
            f"{rank}. "
            f"{row['feature']}: "
            f"{row['importance']:.6f}"
        )

    print("\nFeature contribution check:\n")

    for _, row in importance.iterrows():

        feature = row["feature"]
        score = row["importance"]

        if score > 0:
            status = "🟢 USED"
        else:
            status = "🔴 NOT USED"

        print(
            f"{status} | "
            f"{feature}: "
            f"{score:.6f}"
        )

    total_importance = importance["importance"].sum()

    print(
        f"\nTotal importance: "
        f"{total_importance:.6f}"
    )

    if np.isclose(total_importance, 1.0):
        print("✅ Feature importances are valid")
    else:
        print("⚠️ Feature importances do not sum to approximately 1")

else:
    print("\n⚠️ This model does not provide feature_importances_")