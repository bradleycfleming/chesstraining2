import pandas as pd
from supabase import create_client, Client
import os
from dotenv import load_dotenv

load_dotenv(dotenv_path="../.env.local")
url = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
key = os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")

supabase: Client = create_client(url, key)

df = pd.read_csv(r"C:\Users\brad1\Downloads\smallLichessDB.csv")
df = df.fillna('')

for row in df.to_dict(orient="records"):
    supabase.table("puzzles").insert(row).execute()