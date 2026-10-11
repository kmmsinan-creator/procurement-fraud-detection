import sqlite3, pandas as pd
from pathlib import Path

root = Path(__file__).resolve().parents[1]
con = sqlite3.connect(root / "data" / "processed" / "tenders.db")

pd.read_csv(root / "data/raw/train.csv").to_sql("train", con, if_exists="replace", index=False)
pd.read_csv(root / "data/raw/test.csv").to_sql("test", con, if_exists="replace", index=False)

print(con.execute("SELECT COUNT(*) FROM train").fetchone(),
      con.execute("SELECT COUNT(*) FROM test").fetchone())
con.close()
