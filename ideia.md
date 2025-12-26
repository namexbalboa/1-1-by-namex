DOCUMENTO DE ESPECIFICAÇÃO TÉCNICA E FUNCIONAL UNIFICADA (v2) - SISTEMA SaaS DE GESTÃO DE REUNIÕES 1:1

A aplicação deve respeitar a hierarquia de pastas ja presentes: frontend e backend. Não criando codigo na raiz do projeto, será apenas para documentações.

VISÃO GERAL DO NEGÓCIO E PRODUTO O produto consiste em uma aplicação web (Web App) do tipo SaaS (Software as a Service) Multi-tenant, distribuída sob licença MIT (Open Source). O objetivo é gerenciar reuniões individuais (1:1) entre Gerente e Colaborador, transformando conversas subjetivas em dados estruturados. A plataforma é "White-label" e Multi-idioma (Internacionalização Nativa), suportando nativamente Português (pt-BR), Inglês (en-US) e Espanhol (es-ES). O sistema é otimizado exclusivamente para visualização em Desktop e Tablets (modo paisagem).

PERFIS DE USUÁRIO E DINÂMICA DE USO O sistema possui dois atores: Gerente (Operador) e Funcionário (Observador). A metodologia impõe um ciclo de 30 minutos: 15min de Revisão (Passado) + 15min de Planejamento (Futuro). A interface adapta-se automaticamente ao idioma de preferência do usuário logado.

ARQUITETURA TÉCNICA E STACK (JAVASCRIPT FULLSTACK) Frontend: React.js com Vite.

Gerenciamento de Estado: Zustand ou Context API.

Internacionalização (i18n): Utilização da biblioteca i18next e react-i18next. Os literais de texto (labels, botões, perguntas) são segregados em arquivos JSON de tradução (locales/pt.json, locales/en.json, locales/es.json). Backend: API REST em Nest.js.

Módulos: Auth, Meeting, Tenant, Analytics, I18n.

Interceptadores: Middleware global para ler o header Accept-Language e retornar mensagens de erro/sucesso no idioma correto. Banco de Dados: MongoDB via TypeORM. Autenticação: Firebase Authentication (Email/Google).

MODELAGEM DE DADOS (MONGODB)

Coleção Tenants: Configurações da empresa, branding e defaultLanguage (idioma padrão da empresa caso o usuário não defina).

Coleção Collaborators: CRUD contendo dados cadastrais e o campo preferredLanguage (Enum: 'pt', 'en', 'es').

Coleção Meeting_Journeys: Documento mestre anual com array de sub-documentos (reuniões).

Coleção System_Logs: Audit Trail.

ESTRATÉGIA DE INTERNACIONALIZAÇÃO (i18n) Detecção Automática: No primeiro acesso (antes do login), o sistema detecta o idioma do navegador. Persistência: Após o login, o sistema carrega o preferredLanguage salvo no perfil do MongoDB. Troca Dinâmica: Um seletor de idioma (Toggle Flag) fica disponível no menu de configurações, permitindo a troca instantânea sem recarregar a página (Hot-reload de traduções). Conteúdo do Usuário: O conteúdo gerado pelo usuário (ex: texto do "Foco Quinzenal") é salvo no idioma em que foi digitado, não havendo tradução automática de inputs do usuário, apenas da interface do sistema.

DETALHAMENTO DA JORNADA (METODOLOGIA 15+15)

FASE 1: RETROSPECTIVA (0-15 Min)

Status dos Action Items: Lista de tarefas (Tradução das labels: "Feito/Done/Hecho").

Histórico de Pulso: Gráfico de humor das últimas 4 semanas.

FASE 2: PULSO E FUTURO - OS 4 BLOCOS (15-30 Min) Todas as perguntas e opções de escala possuem chaves de tradução mapeadas nos 3 idiomas.

BLOCO A: OPERACIONAL

Distribuição de Tempo: Gráfico de Pizza (Execução/Reuniões/Resolução).

Bloqueadores: Semáforo. Nuvem de tags traduzida (ex: "Cliente/Client/Cliente", "Infra").

Adequação de Ferramentas: Escala visual de ícones.

Clareza das Prioridades: Slider ("Confuso" a "Cristalino").

BLOCO B: ESTRATÉGIA 5. Conexão com a Meta: Ícone de Alvo. 6. Autonomia Percebida: Barra de progresso. 7. Inovação: Checkbox Sim/Não.

BLOCO C: DINÂMICA HUMANA 8. Segurança Psicológica: Escala de Emojis. 9. Fricção na Colaboração: Heatmap (Azul a Vermelho). 10. Reconhecimento: Botão tripla escolha.

BLOCO D: DESENVOLVIMENTO 11. Desafio Intelectual (Flow): Gráfico X/Y. 12. Utilização de Pontos Fortes: Bateria. 13. Aprendizado Ativo: Nuvem de Tags. O endpoint de tags deve suportar um objeto de labels { pt: "Liderança", en: "Leadership", es: "Liderazgo" } para que o RH cadastre a competência uma única vez e ela apareça corretamente para todos. 14. Saúde Mental: Ícones de Cérebro. 15. Foco Quinzenal: Campo de texto único.

SAÍDA E RELATÓRIOS O Relatório Anual (Infográfico Timeline) renderiza os títulos e legendas no idioma atual selecionado pelo visualizador, permitindo que um gerente americano visualize o relatório de um funcionário brasileiro em Inglês (os dados numéricos e visuais são universais, apenas os labels mudam).

INFRAESTRUTURA Configuração do Nest.js para validação de DTOs com mensagens de erro traduzidas baseadas no idioma da requisição. Build do Vite configurado para code-splitting, garantindo que os arquivos de tradução (JSONs) sejam carregados sob demanda para não pesar o bundle inicial.