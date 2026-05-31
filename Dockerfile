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

# Copy source code and sqlite DB
COPY api/ ./api/
COPY core/ ./core/
COPY manage.py .
COPY db.sqlite3 .

# Expose Django port
EXPOSE 8000

# Run migrations and start backend server
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
