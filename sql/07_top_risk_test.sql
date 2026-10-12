
SELECT t.id, t.obs_count, ROUND(t.std, 1) AS std, t.median,
       ROUND(t.mean, 1) AS mean, ROUND(t.skew, 1) AS skew,
       ROUND(s.score, 3) AS score, s.band
FROM test t JOIN test_scores s ON s.id = t.id
ORDER BY s.score DESC
LIMIT 25;
