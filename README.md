# Hospital Tender Fraud Risk Detection

Live dashboard: https://kmmsinan-creator.github.io/procurement-fraud-detection/

An end-to-end fraud-risk project built from my Master's thesis (HSE University, Business Analytics and Big Data Systems, 2026). It uses SQL for data audit and feature analysis, Python for modelling and explainability, and GitHub Pages for a dashboard that scores hospitals in the browser.

## Problem

Hospital tender history from 2012 to 2018 (about 16 million observations) was condensed into five statistics per hospital: tender count (`obs_count`), `std`, `median`, `mean` and `skew`. The task is to predict a fraud flag from them.

- 5,092 labelled hospitals, 99 fraud cases (1.94%)
- 2,546 unlabelled test hospitals
- Source: Kaggle "Hospital Tenders" competition

## Key findings

| Finding | Result |
|---|---|
| Honest ROC-AUC (5-fold, SMOTE inside training folds) | **0.90** (Logistic Regression 0.897 out-of-fold) |
| Top 5% of risk scores | 255 hospitals, 50 fraud cases: **19.6% fraud rate** (about 10x the average), **50.5% of all fraud** |
| Bottom 80% of scores | 0.47% fraud rate, but still 19 of the 99 fraud cases |
| Model choice | Seven of eight models land within 0.89 to 0.91 AUC, so the differences are noise |
| Strongest signals | High standard deviation, high tender count and high skewness |

## Thesis vs leakage-free validation

My thesis reported AUC 0.989 for Random Forest. Reproducing the original notebook showed why: SMOTE was applied to the **whole dataset before cross-validation and the train/test split**, so synthetic copies of fraud rows appeared in both training and test folds. The test set in the thesis confusion matrix is balanced (999 fraud, 999 non-fraud) rather than the real 1.9% fraud rate.

This repo keeps both:

- `notebooks/`: the thesis replication (reproduces Table 5.1) and the leakage-free evaluation
- `reports/05_thesis_vs_leakage_free.csv`: the side-by-side AUC comparison

| Model | Thesis AUC | Leakage-free AUC (5 features) |
|---|---|---|
| Random Forest | 0.989 | 0.890 |
| XGBoost | 0.985 | 0.896 |
| LightGBM | 0.985 | 0.903 |
| Gradient Boosting | 0.970 | 0.907 |
| Logistic Regression | 0.913 | 0.898 |

Other differences from the thesis text: the original pipeline used only three features (`obs_count`, `std`, `skew`) after a correlation filter, and ran distance-based models on unscaled data.

## Dashboard

Tabs: Overview, EDA, Model Results, Explainability (SHAP), Network, Live Monitor and Check Hospitals.

- **Live Monitor** replays the 2,546 test hospitals one by one and raises alerts. It is a simulation on historical data, not a production feed.
- **Check Hospitals** scores one hospital or a CSV of hospitals in the browser. Nothing is uploaded.
- **Network** shows a similarity network of hospitals (not suppliers). A fraud hospital's 5 nearest neighbours are fraud 15.4% of the time, against 1.94% overall.
- **Risk bands** are set by score rank: High (top 5%), Medium (next 15%), Low (other 80%).

## Repository layout

```
data/raw/          train.csv, test.csv
data/processed/    SQLite database, scored test hospitals
sql/               audit, feature analysis, risk bands, top-risk queries
notebooks/         full pipeline notebook
reports/           result tables and figures
docs/              dashboard (GitHub Pages): index.html, app.js, *.json
```

## Run it yourself

1. Open the notebook in Kaggle or Jupyter with `train.csv` and `test.csv`.
2. Run the cells in order. They create the SQLite database, the SQL outputs, the models and the JSON files in `docs/`.
3. Serve the dashboard locally: `cd docs && python -m http.server 8000`, then open `http://localhost:8000`.

Python libraries: pandas, numpy, scikit-learn, imbalanced-learn, XGBoost, LightGBM, SHAP, NetworkX, matplotlib, seaborn.

## Limitations

- Only five summary statistics per hospital: no dates, suppliers or tender text.
- Only 99 fraud cases, so metrics are noisy (AUC standard deviation about 0.02 across folds).
- Risk scores come from a model trained on SMOTE-balanced data, so they are rankings, not true probabilities.
- Test labels are hidden, so test-set alerts cannot be verified.
- A High band is a reason to review, not proof of fraud.

## Next steps

- Add temporal and supplier-level features if such data becomes available.
- Calibrate the scores into real probabilities.
- Scheduled scoring with alerts through GitHub Actions or a small API.

## Author

Mohammad Sinan Koyam Moopa, Master's in Business Analytics and Big Data Systems, HSE University.
