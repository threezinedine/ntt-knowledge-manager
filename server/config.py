import os
from pathlib import Path

from dotenv import load_dotenv

PROJECT_ROOT = Path(__file__).resolve().parent.parent
ENVIRONMENT = os.getenv("APP_ENV", "development")
ENV_FILE = PROJECT_ROOT / (".test.env" if ENVIRONMENT == "test" else ".env")

load_dotenv(ENV_FILE)
