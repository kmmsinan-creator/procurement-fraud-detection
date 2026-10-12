
-- Query 1: row count and fraud rate
SELECT COUNT(*) AS rows_total,
       SUM(y) AS fraud_cases,
       ROUND(100.0 * SUM(y) / COUNT(*), 2) AS fraud_pct
FROM train;

-- Query 2: missing values and duplicate ids
SELECT SUM(obs_count IS NULL) AS null_obs,
       SUM(std IS NULL)       AS null_std,
       SUM(median IS NULL)    AS null_median,
       SUM(mean IS NULL)      AS null_mean,
       SUM(skew IS NULL)      AS null_skew,
       COUNT(*) - COUNT(DISTINCT id) AS duplicate_ids
FROM train;

-- Query 3: feature ranges by fraud flag
SELECT y,
       COUNT(*)            AS n,
       MIN(obs_count)      AS min_obs,
       MAX(obs_count)      AS max_obs,
       ROUND(AVG(std), 2)  AS avg_std,
       ROUND(AVG(skew), 2) AS avg_skew
FROM train
GROUP BY y;
