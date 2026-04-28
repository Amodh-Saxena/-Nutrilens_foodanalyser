import os
import base64
import logging
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import (
    Mail, Attachment, FileContent, FileName, FileType, Disposition
)
from tenacity import retry, stop_after_attempt, wait_exponential

from core.config import settings

logger = logging.getLogger(__name__)

class EmailService:
    def __init__(self):
        self.api_key = settings.sendgrid_api_key
        self.sender = settings.sender_email
        if not self.api_key or not self.sender:
            logger.warning("SendGrid API Key or Sender Email not configured!")

    @retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=2, max=10))
    def send_email_with_pdf(self, to_email: str, subject: str, name: str, report_title: str, pdf_bytes: bytes):
        """
        Sends an email with an attached PDF using SendGrid API.
        Includes a retry mechanism for robust delivery.
        """
        if not self.api_key:
            logger.error("Skipping email send. SendGrid API key is missing.")
            return

        # Read template
        template_path = os.path.join(os.path.dirname(__file__), "..", "templates", "email_template.html")
        try:
            with open(template_path, "r", encoding="utf-8") as file:
                html_content = file.read()
                # Basic template replacement
                html_content = html_content.replace("{{name}}", name).replace("{{report_title}}", report_title)
        except FileNotFoundError:
            html_content = f"Hi {name},<br><br>Your {report_title} is attached.<br><br>Thank you."

        message = Mail(
            from_email=self.sender,
            to_emails=to_email,
            subject=subject,
            html_content=html_content
        )

        # Attach PDF
        encoded_pdf = base64.b64encode(pdf_bytes).decode('utf-8')
        attachment = Attachment(
            FileContent(encoded_pdf),
            FileName(f"{report_title.replace(' ', '_')}.pdf"),
            FileType('application/pdf'),
            Disposition('attachment')
        )
        message.attachment = attachment

        try:
            sg = SendGridAPIClient(self.api_key)
            response = sg.send(message)
            logger.info(f"Email sent to {to_email}. Status Code: {response.status_code}")
            return response
        except Exception as e:
            logger.error(f"Error sending email to {to_email}: {str(e)}")
            raise e
