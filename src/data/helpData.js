import {
  FiPlay,
  FiCalendar,
  FiSettings,
  FiUsers,
  FiFileText,
  FiShield,
  FiHelpCircle,
  FiBarChart2,
} from "react-icons/fi";

export const helpTopics = [
  {
    id: 1,
    title: "Primeiros Passos",
    desc: "Saiba como fazer login, configurar sua conta e navegar pelo sistema.",
    to: "/help/primeiros-passos",
    icon: FiPlay,
    details: [
      {
        id: "login",
        heading: "Fazendo Login",
        content:
          "Para acessar o sistema, clique em 'Login' na página inicial, insira seu e-mail e senha. Caso não tenha uma conta, clique em 'Registrar-se'.",
      },
      {
        id: "perfil",
        heading: "Configurando Perfil",
        content:
          "Após o login, clique no seu nome no canto superior direito para acessar e editar seu perfil, incluindo foto, telefone e senha.",
      },
      {
        id: "navegacao",
        heading: "Navegando pelo Sistema",
        content:
          "Use o menu lateral para acessar módulos como Dashboard, Agendamentos e Suporte.",
      },
    ],
  },
  {
    id: 2,
    title: "Dashboard",
    desc: "Acompanhe seus agendamentos e veja um resumo das atividades do dia a dia.",
    to: "/help/dashboard",
    icon: FiBarChart2,
    details: [
      {
        id: "visao-geral",
        heading: "O que é o Dashboard?",
        content:
          "É a tela principal onde você encontra um resumo rápido dos agendamentos, serviços mais solicitados e o andamento geral do seu negócio.",
      },
      {
        id: "graficos",
        heading: "Gráficos e Indicadores",
        content:
          "Visualize gráficos simples e intuitivos que mostram os serviços realizados, status dos agendamentos e tendências dos últimos dias.",
      },
      {
        id: "agenda-diaria",
        heading: "Agenda Diária",
        content:
          "Use o calendário semanal para escolher o dia e veja automaticamente os agendamentos daquele dia. Tudo em um só lugar, de forma rápida e prática.",
      },
    ],
  },
  {
    id: 3,
    title: "Agendamentos",
    desc: "Crie, visualize e gerencie todos os agendamentos de forma fácil.",
    to: "/help/appointments",
    icon: FiCalendar,
    details: [
      {
        id: "visao-geral",
        heading: "Como funciona?",
        content:
          "Aqui você gerencia todos os agendamentos de pets. Você pode criar novos, editar, cancelar ou marcar como finalizados.",
      },
      {
        id: "lista-calendario",
        heading: "Visualização flexível",
        content:
          "Alterne entre uma lista com filtros detalhados ou um calendário interativo para acompanhar todos os compromissos.",
      },
      {
        id: "exportacao",
        heading: "Exportar agendamentos",
        content:
          "Com apenas alguns cliques, você pode exportar seus agendamentos em formato CSV ou Excel.",
      },
    ],
  },
  {
    id: 4,
    title: "Serviços",
    desc: "Adicione, edite ou exclua os serviços oferecidos no seu pet shop.",
    to: "/help/services",
    icon: FiSettings,
    details: [
      {
        id: "gerenciamento",
        heading: "O que posso fazer aqui?",
        content:
          "Você pode cadastrar novos serviços, editar os existentes ou excluir aqueles que não são mais utilizados. Tudo de forma simples e rápida.",
      },
      {
        id: "diferenca",
        heading: "Serviços normais e extras",
        content:
          "Na hora de cadastrar, marque se o serviço é extra. Serviços extras são adicionados ao serviço principal de um agendamento.",
      },
      {
        id: "como-usar",
        heading: "Como usar?",
        content:
          "Clique em 'Novo Serviço' para adicionar um. Use os ícones de lápis e lixeira nos cartões para editar ou excluir os serviços já existentes.",
      },
    ],
  },
  {
    id: 5,
    title: "Colaboradores",
    desc: "Convide e gerencie colaboradores que têm acesso ao sistema.",
    to: "/help/collaborators",
    icon: FiUsers,
    details: [
      {
        id: "convite",
        heading: "Convite de colaboradores",
        content:
          "Você pode adicionar novos colaboradores informando o e-mail e o departamento. Eles receberão um convite por e-mail para criar uma conta e acessar o sistema.",
      },
      {
        id: "gestao",
        heading: "Gerenciamento",
        content:
          "Acompanhe todos os colaboradores cadastrados e exclua quem não faz mais parte da equipe. Use o filtro de busca para encontrar facilmente um nome ou e-mail.",
      },
      {
        id: "visualizacao",
        heading: "Visualização personalizável",
        content:
          "Escolha entre visualização em lista ou em cards, facilitando a leitura conforme sua preferência.",
      },
    ],
  },
  {
    id: 6,
    title: "Termos de Uso",
    desc: "Entenda as regras e responsabilidades ao utilizar o nosso sistema.",
    to: "/help/termos-de-uso",
    icon: FiFileText,
    details: [
      {
        id: "politica-geral",
        heading: "Política Geral",
        content:
          "Ao utilizar nosso sistema, você concorda com os termos estabelecidos neste documento. É importante ler atentamente para garantir o uso correto e consciente da plataforma.",
      },
      {
        id: "direitos-responsabilidades",
        heading: "Direitos e Responsabilidades",
        content:
          "Você tem o direito de acessar os recursos oferecidos pelo sistema, desde que os utilize de maneira ética e segura. É responsabilidade do usuário manter seus dados atualizados e não compartilhar acessos indevidamente.",
      },
      {
        id: "restricoes",
        heading: "Restrições de Uso",
        content:
          "Não é permitido utilizar o sistema para fins ilegais, ofensivos ou que violem os direitos de terceiros. Qualquer tentativa de manipular o funcionamento do sistema resultará em sanções ou exclusão da conta.",
      },
      {
        id: "modificacoes",
        heading: "Alterações nos Termos",
        content:
          "Nos reservamos o direito de atualizar estes termos periodicamente. Sempre que isso acontecer, os usuários serão notificados, e o uso contínuo do sistema implica concordância com as novas condições.",
      },
    ],
  },
  {
    id: 7,
    title: "Política de Privacidade",
    desc: "Saiba como coletamos, usamos e protegemos seus dados.",
    to: "/help/politica-de-privacidade",
    icon: FiShield,
    details: [
      {
        id: "coleta-dados",
        heading: "Coleta de Dados",
        content:
          "Coletamos apenas as informações essenciais para funcionamento do sistema, como nome, e-mail e dados relacionados a agendamentos. Não solicitamos informações sensíveis sem necessidade.",
      },
      {
        id: "uso-dados",
        heading: "Uso e Finalidade",
        content:
          "Os dados são utilizados para personalizar a experiência do usuário, melhorar nossos serviços e garantir segurança no acesso à plataforma. Nunca comercializamos suas informações.",
      },
      {
        id: "seguranca",
        heading: "Segurança e Proteção",
        content:
          "Utilizamos práticas e tecnologias modernas de segurança para proteger seus dados contra acessos não autorizados, perda ou vazamento.",
      },
      {
        id: "compartilhamento",
        heading: "Compartilhamento com Terceiros",
        content:
          "Suas informações não são compartilhadas com terceiros, exceto quando exigido por lei ou necessário para o funcionamento do sistema com prestadores confiáveis.",
      },
      {
        id: "direitos-usuario",
        heading: "Seus Direitos",
        content:
          "Você pode solicitar acesso, correção ou exclusão dos seus dados pessoais a qualquer momento. Para isso, basta entrar em contato com nossa equipe de suporte.",
      },
    ],
  },
  {
    id: 8,
    title: "Suporte Técnico",
    desc: "Tire dúvidas, encontre soluções ou fale diretamente com nossa equipe.",
    to: "/help/suporte",
    icon: FiHelpCircle,
    details: [
      {
        id: "faq",
        heading: "Perguntas Frequentes",
        content:
          "Antes de entrar em contato, recomendamos consultar os tópicos disponíveis na Central de Ajuda. Muitos problemas comuns já estão respondidos de forma rápida e prática.",
      },
      {
        id: "pesquisa",
        heading: "Busque por palavras-chave",
        content:
          "Use o campo de busca para encontrar conteúdos relacionados à sua dúvida, como 'agendamento', 'serviços', 'cadastro' ou 'senha'.",
      },
      {
        id: "contato-direto",
        heading: "Falar com o Suporte",
        content:
          "Se não encontrar a resposta, clique no botão 'Enviar mensagem' e preencha o formulário com seu nome, e-mail, assunto e descrição do problema. Nossa equipe responderá o mais breve possível.",
      },
      {
        id: "tempo-resposta",
        heading: "Tempo de Resposta",
        content:
          "A maioria das mensagens é respondida em até 1 dia útil. Durante fins de semana ou feriados, o retorno pode levar um pouco mais de tempo.",
      },
    ],
  },
];
