import {
  FiPlus,
  FiUsers,
  FiClipboard,
  FiTool,
  FiBarChart2,
  FiCpu,
} from "react-icons/fi";

export const helpTopics = [
  {
    id: 1,
    title: "Primeiros Passos",
    desc: "Saiba como fazer login, configurar sua conta e navegar pelo sistema.",
    to: "/help/primeiros-passos",
    icon: FiPlus,
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
    desc: "Visualize indicadores, métricas e resumos de atividade em tempo real.",
    to: "/help/dashboard",
    icon: FiUsers,
    details: [
      {
        id: "visao-geral",
        heading: "Visão Geral",
        content:
          "No Dashboard, você encontra um resumo rápido dos principais indicadores de desempenho do seu negócio.",
      },
      {
        id: "metricas",
        heading: "Métricas Detalhadas",
        content:
          "Analise métricas como número de agendamentos, receita e engajamento ao longo do tempo.",
      },
    ],
  },
  {
    id: 3,
    title: "Agendamentos",
    desc: "Crie, edite e gerencie agendamentos de forma prática e rápida.",
    to: "/help/agendamentos",
    icon: FiClipboard,
    details: [
      {
        id: "criar-agendamento",
        heading: "Criando Agendamentos",
        content:
          "Clique em 'Novo Agendamento', selecione cliente, serviço, data e hora e confirme.",
      },
      {
        id: "gerenciar-agendamento",
        heading: "Gerenciando Agendamentos",
        content:
          "Visualize, edite ou cancele agendamentos existentes através do calendário ou lista de agendamentos.",
      },
    ],
  },
  {
    id: 4,
    title: "Termos de Uso",
    desc: "Entenda as regras e responsabilidades ao utilizar o nosso sistema.",
    to: "/help/termos-de-uso",
    icon: FiTool,
    details: [
      {
        id: "politica-geral",
        heading: "Política Geral",
        content:
          "Ao usar nosso sistema, você concorda em seguir todas as regras descritas nos Termos de Uso.",
      },
      {
        id: "direitos-responsabilidades",
        heading: "Direitos e Responsabilidades",
        content:
          "Leia atentamente para entender seus direitos e obrigações ao utilizar a plataforma.",
      },
    ],
  },
  {
    id: 5,
    title: "Política de Privacidade",
    desc: "Saiba como coletamos, usamos e protegemos seus dados.",
    to: "/help/politica-de-privacidade",
    icon: FiBarChart2,
    details: [
      {
        id: "coleta-dados",
        heading: "Coleta de Dados",
        content:
          "Coletamos apenas informações necessárias para oferecer uma experiência personalizada e segura.",
      },
      {
        id: "uso-dados",
        heading: "Uso e Proteção de Dados",
        content:
          "Seus dados são usados apenas para fins internos e protegidos por tecnologias de segurança modernas.",
      },
    ],
  },
  {
    id: 6,
    title: "Suporte Técnico",
    desc: "Encontre soluções para problemas ou fale com o suporte.",
    to: "/help/suporte",
    icon: FiCpu,
    details: [
      {
        id: "faq",
        heading: "Perguntas Frequentes",
        content:
          "Antes de abrir um chamado, consulte a lista de dúvidas frequentes.",
      },
      {
        id: "contato",
        heading: "Contato com Suporte",
        content:
          "Clique em 'Enviar Mensagem' na Central de Ajuda para falar com nossa equipe.",
      },
    ],
  },
];
