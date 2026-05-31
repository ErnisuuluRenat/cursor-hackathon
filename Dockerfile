FROM python:3.12-slim

# Prevent Python from writing .pyc files and enable unbuffered logging
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code (db.sqlite3 is created at startup via migrate + seed)
COPY api/ ./api/
COPY core/ ./core/
COPY manage.py .

# Expose Django port
EXPOSE 8000

# Create DB, seed players, then start server
CMD ["sh", "-c", "python manage.py migrate && python manage.py seed && python manage.py runserver 0.0.0.0:8000"]
