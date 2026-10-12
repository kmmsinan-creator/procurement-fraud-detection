
SELECT band,
       COUNT(*)                                   AS hospitals,
       SUM(y)                                     AS fraud_cases,
       ROUND(100.0 * SUM(y) / COUNT(*), 2)        AS fraud_pct,
       ROUND(100.0 * SUM(y) / (SELECT SUM(y) FROM scores), 1) AS pct_of_all_fraud
FROM scores
GROUP BY band
ORDER BY CASE band WHEN 'High' THEN 1 WHEN 'Medium' THEN 2 ELSE 3 END;
