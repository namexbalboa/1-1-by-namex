const { MailerSend } = require('mailersend');
require('dotenv').config();

const mailerSend = new MailerSend({
  apiKey: process.env.MAILERSEND_API_KEY || '',
});

console.log('🔍 Verificando domínios no MailerSend...\n');

mailerSend.email.domain.list()
  .then((response) => {
    console.log('✅ Domínios encontrados:\n');

    if (response.body && response.body.data && response.body.data.length > 0) {
      response.body.data.forEach((domain, index) => {
        const status = domain.domain_settings?.send_paused === false ? '✅ VERIFICADO' : '⏳ Pendente';
        console.log(`${index + 1}. ${domain.name}`);
        console.log(`   Status: ${status}`);
        console.log(`   ID: ${domain.id}`);

        if (domain.domain_settings?.send_paused === false) {
          console.log(`   📧 Use este email: noreply@${domain.name}`);
        }
        console.log('');
      });
    } else {
      console.log('Nenhum domínio encontrado.');
      console.log('Adicione um domínio em: https://app.mailersend.com/domains');
    }
  })
  .catch((error) => {
    console.error('❌ Erro ao buscar domínios:', error.message);
    console.log('\nVerifique manualmente em: https://app.mailersend.com/domains');
  });
