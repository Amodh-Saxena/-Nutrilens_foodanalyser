# Notification Service

A FastAPI-based microservice that handles generating custom PDF reports (using ReportLab) and securely dispatching them as email attachments via SendGrid.

## Features
- **FastAPI**: Exceptionally fast and modern API frameork. Used for the core REST endpoint.
- **Async Execution**: Employs FastAPI's `BackgroundTasks` to free up the HTTP response instantly while PDFs are generated and emails are sent securely.
- **SendGrid Integration**: Sends high quality HTML emails with retries built in using the `tenacity` library.
- **ReportLab**: Dynamically generates visual PDF reports in-memory avoiding risky disk I/O.

## Setup Instructions

### 1. Requirements

Ensure you have Python 3.9+ installed. From the `notification_service` directory, run:

```bash
pip install -r requirements.txt
```

### 2. Environment Configuration

Create a `.env` file in the root of the `notification_service` directory, and populate it with your keys:

```ini
SENDGRID_API_KEY=SG.your_sendgrid_api_key_here
SENDER_EMAIL=noreply@yourdomain.com
```

> **Note**: If you don't supply a SendGrid API Key or a matching initialized Sender Email, the service will successfully build PDFs, but it will skip the actual email sending and log a warning.

### 3. Run Locally

Start the local `uvicorn` development server on port 8000:

```bash
uvicorn main:app --reload
```

## API Usage

### `POST /send-report`

Triggers a background task that builds a dynamic PDF report and emails it to the user. Instantly responds with `202 Accepted`.

#### Request (Postman or curl)
```bash
curl -X 'POST' \
  'http://127.0.0.1:8000/send-report' \
  -H 'Content-Type: application/json' \
  -d '{
  "email": "user@example.com",
  "name": "Jane Doe",
  "report_title": "Food Analysis Report",
  "ml_results": {
    "Prediction": "Medium Risk",
    "Score": 0.75,
    "Model Output": "Positive Indicator",
    "Recommendation": "Increase fiber intake."
  }
}'
```

#### Expected Output

```json
{
  "message": "Report processing queued for user@example.com. You will receive an email shortly."
}
```
