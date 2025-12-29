export interface WelcomeEmailTranslations {
  greeting: string;
  intro: string;
  credentialsLabel: string;
  emailLabel: string;
  passwordLabel: string;
  loginUrlLabel: string;
  loginButton: string;
  instructions: string;
  security: string;
  footer: string;
}

export interface WelcomeEmailData {
  name: string;
  email: string;
  password: string;
  loginUrl: string;
  translations: WelcomeEmailTranslations;
}

export function generateWelcomeEmailContent(data: WelcomeEmailData): string {
  return `
    <h2 style="color: #1F2937; margin-top: 0; font-size: 22px;">${data.translations.greeting}</h2>

    <p style="color: #4B5563; margin-bottom: 24px; font-size: 16px;">
      ${data.translations.intro}
    </p>

    <div style="background-color: #F3F4F6; border-radius: 8px; padding: 24px; margin: 24px 0;">
      <p style="margin: 0 0 16px 0; font-weight: 600; color: #1F2937; font-size: 16px;">
        ${data.translations.credentialsLabel}
      </p>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 10px 0; color: #6B7280;">
            <strong>${data.translations.emailLabel}:</strong>
          </td>
          <td style="padding: 10px 0; color: #1F2937;">
            ${data.email}
          </td>
        </tr>
        <tr>
          <td style="padding: 10px 0; color: #6B7280;">
            <strong>${data.translations.passwordLabel}:</strong>
          </td>
          <td style="padding: 10px 0;">
            <code style="background-color: #E5E7EB; padding: 6px 12px; border-radius: 4px; font-family: 'Courier New', monospace; color: #1F2937; font-size: 14px;">
              ${data.password}
            </code>
          </td>
        </tr>
      </table>
    </div>

    <div style="text-align: center; margin: 32px 0;">
      <a href="${data.loginUrl}"
         style="display: inline-block;
                background: linear-gradient(135deg, #10B981 0%, #3B82F6 100%);
                color: #ffffff;
                padding: 14px 32px;
                text-decoration: none;
                border-radius: 6px;
                font-weight: 600;
                font-size: 16px;">
        ${data.translations.loginButton}
      </a>
    </div>

    <div style="background-color: #FEF3C7;
                border-left: 4px solid #F59E0B;
                padding: 16px;
                margin: 24px 0;
                border-radius: 4px;">
      <p style="margin: 0 0 8px 0; color: #92400E;">
        <strong>⚠️ ${data.translations.instructions}</strong>
      </p>
      <p style="margin: 0; font-size: 14px; color: #92400E;">
        ${data.translations.security}
      </p>
    </div>

    <p style="color: #6B7280; margin-top: 32px; font-size: 14px;">
      ${data.translations.footer}
    </p>
  `.trim();
}
