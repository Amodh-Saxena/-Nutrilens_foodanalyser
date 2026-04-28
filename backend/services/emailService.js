const nodemailer = require('nodemailer');

// Helper to get or create a test account
let transporter = null;

const createTransporter = async () => {
    if (transporter) return transporter;
    
    try {
        // Generate test SMTP service account from ethereal.email
        const testAccount = await nodemailer.createTestAccount();
        
        transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: testAccount.user, // generated ethereal user
                pass: testAccount.pass, // generated ethereal password
            },
        });
        return transporter;
    } catch (err) {
        console.error("Failed to create Ethereal account:", err);
        return null;
    }
};

exports.sendWelcomeEmail = async (userEmail, userName) => {
    try {
        const mailer = await createTransporter();
        if (!mailer) return;
        
        const info = await mailer.sendMail({
            from: '"NutriLens Platform" <noreply@nutrilens.ai>',
            to: userEmail,
            subject: "Welcome to NutriLens - Your Metabolic Journey Begins",
            html: `
                <div style="font-family: Arial, sans-serif; padding: 25px; color: #333; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 12px;">
                    <h2 style="color: #16a34a;">Welcome to NutriLens, ${userName}! 🌱</h2>
                    <p style="font-size: 16px; line-height: 1.5;">We're thrilled to have you onboard. Your secure account is fully active and ready.</p>
                    <p style="font-size: 16px; line-height: 1.5;">Start scanning your food labels today to discover hidden metabolic stressors, track your energy telemetry, and take pristine control of your daily vitality.</p>
                    <br/>
                    <p style="font-size: 16px;">Stay healthy,</p>
                    <p style="font-size: 16px;"><strong>The NutriLens AI Team</strong></p>
                </div>
            `
        });

        console.log("-----------------------------------------");
        console.log("📧 Welcome Email sent! Preview URL: %s", nodemailer.getTestMessageUrl(info));
        console.log("-----------------------------------------");
        
        return info;
    } catch (error) {
        console.error("Error sending welcome email:", error);
    }
};

exports.sendHighRiskAlert = async (userEmail, userName, score, summary) => {
    try {
        const mailer = await createTransporter();
        if (!mailer) return;
        
        const info = await mailer.sendMail({
            from: '"NutriLens Medical Desk" <alerts@nutrilens.ai>',
            to: userEmail,
            subject: "🚨 Critical Alert: High Metabolic Stress Detected in Recent Scan",
            html: `
                <div style="font-family: Arial, sans-serif; padding: 25px; color: #333; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 12px; border-top: 6px solid #ef4444;">
                    <h2 style="color: #ef4444; margin-top: 0;">High-Risk Ingredient Alert!</h2>
                    <p style="font-size: 16px;">Hi ${userName},</p>
                    <p style="font-size: 16px; line-height: 1.5;">Your recent food scan actively triggered a structural metabolic warning within the NutriLens global database.</p>
                    
                    <div style="background: #fef2f2; padding: 20px; border: 1px solid #fca5a5; border-radius: 8px; margin: 20px 0;">
                        <h3 style="color: #ef4444; margin: 0 0 10px 0; font-size: 22px;">Risk Score: ${score} / 100</h3>
                        <p style="margin: 0; line-height: 1.5; color: #7f1d1d;"><strong>Analysis:</strong> ${summary}</p>
                    </div>
                    
                    <p style="font-size: 16px; line-height: 1.5;">We heavily recommend avoiding repeated consumption of these additives, as they introduce intense friction to your baseline energy retention and metabolic throughput.</p>
                    <br/>
                    <p style="font-size: 16px;">Stay vigilant,</p>
                    <p style="font-size: 16px;"><strong>NutriLens AI Telemetry</strong></p>
                </div>
            `
        });

        console.log("-----------------------------------------");
        console.log("🚨 High-Risk Alert Email sent! Preview URL: %s", nodemailer.getTestMessageUrl(info));
        console.log("-----------------------------------------");
        
        return info;
    } catch (error) {
        console.error("Error sending alert email:", error);
    }
};
