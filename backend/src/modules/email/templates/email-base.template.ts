export interface EmailBaseData {
  content: string;
  language: string;
}

export function generateEmailBase(data: EmailBaseData): string {
  return `
<!DOCTYPE html>
<html lang="${data.language}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background-color: #F3F4F6;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    .email-header {
      background: linear-gradient(135deg, #10B981 0%, #3B82F6 100%);
      padding: 32px 24px;
      text-align: center;
    }
    .email-header h1 {
      color: #ffffff;
      margin: 0;
      font-size: 24px;
      font-weight: 600;
    }
    .email-content {
      padding: 32px 24px;
      color: #1F2937;
      line-height: 1.6;
    }
    .email-footer {
      background-color: #F9FAFB;
      padding: 24px;
      text-align: center;
      color: #6B7280;
      font-size: 14px;
      border-top: 1px solid #E5E7EB;
    }
    @media only screen and (max-width: 600px) {
      .email-content {
        padding: 24px 16px;
      }
      .email-header {
        padding: 24px 16px;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-header">
      <h1>1:1 Meetings Platform</h1>
    </div>
    <div class="email-content">
      ${data.content}
    </div>
    <div class="email-footer">
      <p style="margin: 0;">© 2025 1:1 Meetings Platform. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}
