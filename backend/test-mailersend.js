const { MailerSend, EmailParams, Sender, Recipient } = require('mailersend');
require('dotenv').config();

// Configurar MailerSend
const mailerSend = new MailerSend({
  apiKey: process.env.MAILERSEND_API_KEY || '',
});

// Email de teste
const testEmail = 'naama.ortiz@gmail.com';

console.log('🚀 Testando MailerSend...');
console.log('📧 Para:', testEmail);
console.log('📤 De:', process.env.MAILERSEND_SENDER_EMAIL);
console.log('🔑 API Key configurada:', process.env.MAILERSEND_API_KEY ? 'Sim' : 'Não');

if (!process.env.MAILERSEND_API_KEY || process.env.MAILERSEND_API_KEY === 'your-mailersend-api-key') {
  console.log('');
  console.log('❌ API Key do MailerSend não configurada!');
  console.log('');
  console.log('📋 Instruções para configurar:');
  console.log('1. Acesse: https://www.mailersend.com/');
  console.log('2. Crie uma conta gratuita (12.000 emails/mês)');
  console.log('3. Vá em Settings → API Tokens');
  console.log('4. Crie um novo token com permissão "Email: Full Access"');
  console.log('5. Copie o token e adicione no arquivo .env:');
  console.log('   MAILERSEND_API_KEY=seu-token-aqui');
  console.log('');
  console.log('6. Configure um domínio verificado:');
  console.log('   - Vá em Domains → Add Domain');
  console.log('   - Adicione svelten.com.br');
  console.log('   - Configure os registros DNS conforme instruções');
  console.log('   - Ou use um domínio de teste fornecido pelo MailerSend');
  console.log('');
  process.exit(1);
}

// HTML do email de teste
const htmlContent = `
<!DOCTYPE html>
<html lang="pt">
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
    .credentials-box {
      background-color: #F3F4F6;
      border-radius: 8px;
      padding: 24px;
      margin: 24px 0;
    }
    .button {
      display: inline-block;
      background: linear-gradient(135deg, #10B981 0%, #3B82F6 100%);
      color: #ffffff;
      padding: 14px 32px;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      font-size: 16px;
    }
    .warning-box {
      background-color: #FEF3C7;
      border-left: 4px solid #F59E0B;
      padding: 16px;
      margin: 24px 0;
      border-radius: 4px;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-header">
      <h1>1:1 Meetings Platform</h1>
    </div>
    <div class="email-content">
      <h2 style="color: #1F2937; margin-top: 0; font-size: 22px;">Olá! 👋</h2>

      <p style="color: #4B5563; margin-bottom: 24px; font-size: 16px;">
        Este é um email de teste do sistema 1:1 Meetings Platform usando <strong>MailerSend</strong>.
      </p>

      <div class="credentials-box">
        <p style="margin: 0 0 16px 0; font-weight: 600; color: #1F2937; font-size: 16px;">
          ✅ Teste de Email Bem-Sucedido!
        </p>
        <p style="margin: 0; color: #6B7280;">
          Se você está vendo este email, significa que a integração com o MailerSend está funcionando perfeitamente.
        </p>
      </div>

      <div style="text-align: center; margin: 32px 0;">
        <a href="http://localhost:5173" class="button">
          Acessar Plataforma
        </a>
      </div>

      <div class="warning-box">
        <p style="margin: 0 0 8px 0; color: #92400E;">
          <strong>📊 Plano Gratuito MailerSend</strong>
        </p>
        <p style="margin: 0; font-size: 14px; color: #92400E;">
          12.000 emails por mês • Domínios personalizados • Analytics completo
        </p>
      </div>

      <p style="color: #6B7280; margin-top: 32px; font-size: 14px;">
        Atenciosamente,<br>Equipe 1:1 Meetings
      </p>
    </div>
    <div class="email-footer">
      <p style="margin: 0;">© 2025 1:1 Meetings Platform. Powered by MailerSend</p>
    </div>
  </div>
</body>
</html>
`;

const sentFrom = new Sender(
  process.env.MAILERSEND_SENDER_EMAIL,
  process.env.MAILERSEND_SENDER_NAME || '1:1 Meetings Platform'
);

const recipients = [
  new Recipient(testEmail, 'Teste')
];

const emailParams = new EmailParams()
  .setFrom(sentFrom)
  .setTo(recipients)
  .setSubject('✅ Teste MailerSend - 1:1 Meetings Platform')
  .setHtml(htmlContent);

console.log('');
console.log('📤 Enviando email...');

mailerSend.email.send(emailParams)
  .then((response) => {
    console.log('✅ Email enviado com sucesso!');
    console.log('📬 Verifique sua caixa de entrada:', testEmail);
    console.log('📊 Response:', response.statusCode);
    process.exit(0);
  })
  .catch((error) => {
    console.error('');
    console.error('❌ Erro ao enviar email:');
    console.error('Status:', error.statusCode);
    console.error('Mensagem:', error.body);
    console.error('');

    if (error.statusCode === 401) {
      console.error('🔑 Erro de autenticação - Verifique se a API Key está correta');
    } else if (error.statusCode === 422) {
      console.error('📧 Erro de validação - Verifique se o email de remetente está verificado no MailerSend');
    }

    process.exit(1);
  });
