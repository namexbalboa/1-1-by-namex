import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { I18nService } from 'nestjs-i18n';
import { MailerSend, EmailParams, Sender, Recipient } from 'mailersend';
import { generateEmailBase } from './templates/email-base.template';
import {
  generateWelcomeEmailContent,
  WelcomeEmailTranslations,
} from './templates/welcome-email.template';

export interface EmailResult {
  success: boolean;
  error?: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private mailerSend: MailerSend;

  constructor(
    private readonly configService: ConfigService,
    private readonly i18nService: I18nService,
  ) {
    const apiKey = this.configService.get<string>('MAILERSEND_API_KEY');
    if (apiKey && apiKey !== 'your-mailersend-api-key') {
      this.mailerSend = new MailerSend({
        apiKey,
      });
      this.logger.log('MailerSend initialized successfully');
    } else {
      this.logger.warn(
        'MailerSend API key not configured. Email sending will be disabled.',
      );
    }
  }

  async sendWelcomeEmail(
    name: string,
    email: string,
    password: string,
    language: string,
  ): Promise<EmailResult> {
    try {
      // Validate inputs
      if (!name || !email || !password) {
        this.logger.warn('Missing required fields for welcome email', {
          email,
        });
        return { success: false, error: 'Missing required fields' };
      }

      // Check if MailerSend is configured
      const apiKey = this.configService.get<string>('MAILERSEND_API_KEY');
      if (!apiKey || apiKey === 'your-mailersend-api-key' || !this.mailerSend) {
        this.logger.warn(
          'MailerSend not configured. Skipping email send.',
          { email },
        );
        return {
          success: false,
          error: 'MailerSend API key not configured',
        };
      }

      // Get translations
      const translations = await this.getWelcomeEmailTranslations(language);

      // Replace {name} placeholder in greeting
      translations.greeting = translations.greeting.replace('{name}', name);

      // Build email content
      const loginUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:5173';

      const welcomeContent = generateWelcomeEmailContent({
        name,
        email,
        password,
        loginUrl,
        translations,
      });

      const htmlContent = generateEmailBase({
        content: welcomeContent,
        language,
      });

      // Send email via MailerSend
      const senderEmail = this.configService.get<string>('MAILERSEND_SENDER_EMAIL');
      const senderName = this.configService.get<string>('MAILERSEND_SENDER_NAME') || '1:1 Meetings Platform';

      const sentFrom = new Sender(senderEmail, senderName);
      const recipients = [new Recipient(email, name)];

      const emailParams = new EmailParams()
        .setFrom(sentFrom)
        .setTo(recipients)
        .setSubject(translations.subject)
        .setHtml(htmlContent);

      await this.mailerSend.email.send(emailParams);

      this.logger.log(`Welcome email sent successfully to ${email}`);
      return { success: true };
    } catch (error) {
      this.logger.error('Failed to send welcome email', {
        email,
        error: error.message,
        stack: error.stack,
      });
      return { success: false, error: error.message };
    }
  }

  private async getWelcomeEmailTranslations(
    language: string,
  ): Promise<WelcomeEmailTranslations & { subject: string }> {
    const lang = language || 'pt';

    try {
      // Load translations directly from the JSON file
      const fs = require('fs');
      const path = require('path');
      const translationPath = path.join(process.cwd(), 'src', 'locales', `${lang}.json`);

      if (!fs.existsSync(translationPath)) {
        throw new Error(`Translation file not found: ${translationPath}`);
      }

      const translations = JSON.parse(fs.readFileSync(translationPath, 'utf8'));
      const emailWelcome = translations.email?.welcome;

      if (!emailWelcome) {
        throw new Error('Email welcome translations not found');
      }

      return {
        subject: emailWelcome.subject || 'Bem-vindo à equipe!',
        greeting: emailWelcome.greeting || 'Olá,',
        intro: emailWelcome.intro || 'Sua conta foi criada com sucesso.',
        credentialsLabel: emailWelcome.credentials?.label || 'Credenciais de acesso',
        emailLabel: emailWelcome.credentials?.email || 'Email',
        passwordLabel: emailWelcome.credentials?.password || 'Senha Temporária',
        loginUrlLabel: emailWelcome.credentials?.loginUrl || 'URL de Acesso',
        loginButton: emailWelcome.loginButton || 'Acessar Plataforma',
        instructions: emailWelcome.instructions || 'Por favor, altere sua senha no primeiro acesso.',
        security: emailWelcome.security || 'Por segurança, não compartilhe estas credenciais.',
        footer: emailWelcome.footer || 'Atenciosamente,<br>Equipe 1:1 Meetings',
      };
    } catch (error) {
      this.logger.error('Failed to load email translations', {
        language: lang,
        error: error.message,
      });
      // Return default Portuguese translations as fallback
      return {
        subject: 'Bem-vindo à equipe!',
        greeting: 'Olá,',
        intro: 'Sua conta foi criada com sucesso. Aqui estão suas credenciais de acesso:',
        credentialsLabel: 'Credenciais de acesso',
        emailLabel: 'Email',
        passwordLabel: 'Senha Temporária',
        loginUrlLabel: 'URL de Acesso',
        loginButton: 'Acessar Plataforma',
        instructions: 'Por favor, altere sua senha no primeiro acesso.',
        security: 'Por segurança, não compartilhe estas credenciais.',
        footer: 'Atenciosamente,<br>Equipe 1:1 Meetings',
      };
    }
  }

  async sendMeetingConfirmationEmail(
    name: string,
    email: string,
    meetingDate: Date,
    language: string,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Validate inputs
      if (!name || !email || !meetingDate) {
        this.logger.warn('Missing required fields for meeting confirmation email', {
          email,
        });
        return { success: false, error: 'Missing required fields' };
      }

      // Check if MailerSend is configured
      const apiKey = this.configService.get<string>('MAILERSEND_API_KEY');
      if (!apiKey || apiKey === 'your-mailersend-api-key' || !this.mailerSend) {
        this.logger.warn(
          'MailerSend not configured. Skipping email send.',
          { email },
        );
        return {
          success: false,
          error: 'MailerSend API key not configured',
        };
      }

      const translations = await this.getMeetingConfirmationTranslations(language);

      // Format date and time
      const formattedDate = meetingDate.toLocaleDateString(language === 'pt' ? 'pt-BR' : language === 'es' ? 'es-ES' : 'en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      const formattedTime = meetingDate.toLocaleTimeString(language === 'pt' ? 'pt-BR' : language === 'es' ? 'es-ES' : 'en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });

      const htmlContent = this.generateMeetingConfirmationEmailContent({
        name,
        meetingDate: formattedDate,
        meetingTime: formattedTime,
        translations,
      });

      // Send email via MailerSend
      const senderEmail = this.configService.get<string>('MAILERSEND_SENDER_EMAIL');
      const senderName = this.configService.get<string>('MAILERSEND_SENDER_NAME') || '1:1 Meetings Platform';

      const sentFrom = new Sender(senderEmail, senderName);
      const recipients = [new Recipient(email, name)];

      const emailParams = new EmailParams()
        .setFrom(sentFrom)
        .setTo(recipients)
        .setSubject(translations.subject)
        .setHtml(htmlContent);

      await this.mailerSend.email.send(emailParams);

      this.logger.log(`Meeting confirmation email sent to ${email}`);
      return { success: true };
    } catch (error) {
      this.logger.error('Failed to send meeting confirmation email', {
        email,
        error: error.message,
        stack: error.stack,
      });
      return { success: false, error: error.message };
    }
  }

  private async getMeetingConfirmationTranslations(language: string) {
    const lang = language || 'pt';

    try {
      const fs = require('fs');
      const path = require('path');
      const translationPath = path.join(process.cwd(), 'src', 'locales', `${lang}.json`);

      if (!fs.existsSync(translationPath)) {
        throw new Error(`Translation file not found: ${translationPath}`);
      }

      const translations = JSON.parse(fs.readFileSync(translationPath, 'utf8'));
      const emailMeeting = translations.email?.meetingConfirmation;

      if (!emailMeeting) {
        throw new Error('Email meeting confirmation translations not found');
      }

      return {
        subject: emailMeeting.subject || 'Reunião 1:1 Agendada',
        greeting: emailMeeting.greeting || 'Olá,',
        intro: emailMeeting.intro || 'Sua reunião 1:1 foi agendada com sucesso.',
        dateLabel: emailMeeting.dateLabel || 'Data',
        timeLabel: emailMeeting.timeLabel || 'Horário',
        instructions: emailMeeting.instructions || 'Você receberá um lembrete próximo à data da reunião.',
        footer: emailMeeting.footer || 'Atenciosamente,<br>Equipe 1:1 Meetings',
      };
    } catch (error) {
      this.logger.error('Failed to load meeting confirmation email translations', {
        language: lang,
        error: error.message,
      });
      // Return default Portuguese translations as fallback
      return {
        subject: 'Reunião 1:1 Agendada',
        greeting: 'Olá,',
        intro: 'Sua reunião 1:1 foi agendada com sucesso.',
        dateLabel: 'Data',
        timeLabel: 'Horário',
        instructions: 'Você receberá um lembrete próximo à data da reunião.',
        footer: 'Atenciosamente,<br>Equipe 1:1 Meetings',
      };
    }
  }

  private generateMeetingConfirmationEmailContent(data: {
    name: string;
    meetingDate: string;
    meetingTime: string;
    translations: any;
  }): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; }
          .meeting-details { background: white; border-left: 4px solid #667eea; padding: 20px; margin: 20px 0; border-radius: 5px; }
          .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
          .detail-label { font-weight: bold; color: #667eea; }
          .detail-value { color: #333; }
          .instructions { background: #e8eaf6; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📅 ${data.translations.subject}</h1>
          </div>
          <div class="content">
            <p>${data.translations.greeting} ${data.name},</p>
            <p>${data.translations.intro}</p>

            <div class="meeting-details">
              <h3 style="margin-top: 0; color: #667eea;">Detalhes da Reunião</h3>
              <div class="detail-row">
                <span class="detail-label">${data.translations.dateLabel}:</span>
                <span class="detail-value">${data.meetingDate}</span>
              </div>
              <div class="detail-row" style="border-bottom: none;">
                <span class="detail-label">${data.translations.timeLabel}:</span>
                <span class="detail-value">${data.meetingTime}</span>
              </div>
            </div>

            <div class="instructions">
              <p style="margin: 0;">ℹ️ ${data.translations.instructions}</p>
            </div>
          </div>
          <div class="footer">
            ${data.translations.footer}
          </div>
        </div>
      </body>
      </html>
    `;
  }
}
