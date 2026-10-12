
-- Share of all fraud cases found in the top 20% of hospitals for each feature
WITH r AS (
  SELECT y,
         NTILE(5) OVER (ORDER BY std)       AS q_std,
         NTILE(5) OVER (ORDER BY obs_count) AS q_obs,
         NTILE(5) OVER (ORDER BY skew)      AS q_skew
  FROM train
)
SELECT ROUND(100.0 * SUM(CASE WHEN q_std  = 5 THEN y END) / SUM(y), 1) AS pct_fraud_in_top_std,
       ROUND(100.0 * SUM(CASE WHEN q_obs  = 5 THEN y END) / SUM(y), 1) AS pct_fraud_in_top_obs,
       ROUND(100.0 * SUM(CASE WHEN q_skew = 5 THEN y END) / SUM(y), 1) AS pct_fraud_in_top_skew
FROM r;
