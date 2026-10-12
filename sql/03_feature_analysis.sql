
-- Fraud rate by quintile of obs_count
WITH q AS (
  SELECT y, obs_count AS v, NTILE(5) OVER (ORDER BY obs_count) AS quintile
  FROM train
)
SELECT 'obs_count'        AS feature,
       quintile,
       COUNT(*)       AS hospitals,
       ROUND(MIN(v), 2) AS min_value,
       ROUND(MAX(v), 2) AS max_value,
       SUM(y)         AS fraud_cases,
       ROUND(100.0 * SUM(y) / COUNT(*), 2) AS fraud_pct
FROM q
GROUP BY quintile
ORDER BY quintile;


-- Fraud rate by quintile of std
WITH q AS (
  SELECT y, std AS v, NTILE(5) OVER (ORDER BY std) AS quintile
  FROM train
)
SELECT 'std'        AS feature,
       quintile,
       COUNT(*)       AS hospitals,
       ROUND(MIN(v), 2) AS min_value,
       ROUND(MAX(v), 2) AS max_value,
       SUM(y)         AS fraud_cases,
       ROUND(100.0 * SUM(y) / COUNT(*), 2) AS fraud_pct
FROM q
GROUP BY quintile
ORDER BY quintile;


-- Fraud rate by quintile of skew
WITH q AS (
  SELECT y, skew AS v, NTILE(5) OVER (ORDER BY skew) AS quintile
  FROM train
)
SELECT 'skew'        AS feature,
       quintile,
       COUNT(*)       AS hospitals,
       ROUND(MIN(v), 2) AS min_value,
       ROUND(MAX(v), 2) AS max_value,
       SUM(y)         AS fraud_cases,
       ROUND(100.0 * SUM(y) / COUNT(*), 2) AS fraud_pct
FROM q
GROUP BY quintile
ORDER BY quintile;


-- Fraud rate by quintile of median
WITH q AS (
  SELECT y, median AS v, NTILE(5) OVER (ORDER BY median) AS quintile
  FROM train
)
SELECT 'median'        AS feature,
       quintile,
       COUNT(*)       AS hospitals,
       ROUND(MIN(v), 2) AS min_value,
       ROUND(MAX(v), 2) AS max_value,
       SUM(y)         AS fraud_cases,
       ROUND(100.0 * SUM(y) / COUNT(*), 2) AS fraud_pct
FROM q
GROUP BY quintile
ORDER BY quintile;


-- Fraud rate by quintile of mean
WITH q AS (
  SELECT y, mean AS v, NTILE(5) OVER (ORDER BY mean) AS quintile
  FROM train
)
SELECT 'mean'        AS feature,
       quintile,
       COUNT(*)       AS hospitals,
       ROUND(MIN(v), 2) AS min_value,
       ROUND(MAX(v), 2) AS max_value,
       SUM(y)         AS fraud_cases,
       ROUND(100.0 * SUM(y) / COUNT(*), 2) AS fraud_pct
FROM q
GROUP BY quintile
ORDER BY quintile;
