import logging
from fastapi import FastAPI, BackgroundTasks, HTTPException
from fastapi.responses import JSONResponse

from models.schemas import ReportRequest
from services.pdf_service import PDFService
from services.email_service import EmailService

# Configure basic logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Notification Service",
    description="Microservice to generate PDFs and send emails asynchronously.",
    version="1.0.0"
)

email_service = EmailService()

def process_report_task(request: ReportRequest):
    """
    Background task to generate a PDF and send it via email.
    """
    try:
        logger.info(f"Starting background task for {request.email}")
        
        # 1. Generate PDF
        pdf_bytes = PDFService.generate_report(
            title=request.report_title,
            name=request.name,
            ml_results=request.ml_results
        )
        logger.info(f"PDF successfully generated for {request.name}")

        # 2. Send Email
        subject = f"Your {request.report_title} is Ready"
        email_service.send_email_with_pdf(
            to_email=request.email,
            subject=subject,
            name=request.name,
            report_title=request.report_title,
            pdf_bytes=pdf_bytes
        )
        logger.info(f"Background task finished for {request.email}")
        
    except Exception as e:
        logger.error(f"Failed to process background task for {request.email}: {e}")

@app.post("/send-report", tags=["Notifications"])
async def trigger_report(request: ReportRequest, background_tasks: BackgroundTasks):
    """
    Accepts user email, name, and ML predictive data, then schedules a background
    task to generate a PDF report and email it.
    """
    logger.info(f"Received request to send report to {request.email}")
    background_tasks.add_task(process_report_task, request)
    
    return JSONResponse(
        status_code=202,
        content={"message": f"Report processing queued for {request.email}. You will receive an email shortly."}
    )

@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "ok"}
