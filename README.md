# Sabor da Casa

Aplicação responsiva de receitas que ajuda pessoas a descobrir pratos, planejar refeições e, nas próximas entregas, montar uma lista de compras com estimativa de gasto. O projeto é desenvolvido em cinco dias, cada um com escopo e validação definidos.

## Estado do projeto

**Entrega atual: Dia 1 concluído.** A aplicação já possui uma página inicial responsiva, receitas de exemplo, filtros de categoria, favoritos em memória e uma prévia do futuro planejamento semanal.

| Funcionalidade | Situação |
| --- | --- |
| Página inicial para desktop e celular | Concluída |
| Filtros de receitas | Concluída |
| Favoritar receitas durante a sessão | Concluída |
| Detalhe da receita e porções | Planejada para o Dia 2 |
| Lista de compras funcional | Planejada para o Dia 2 |
| Estimativa de preço | Planejada para o Dia 3 |
| Planejamento semanal | Planejado para o Dia 3 |

## Documentação

- [Plano de produção](docs/PLANO_DE_PRODUCAO.md): objetivos, atividades e validação de cada um dos cinco dias.
- [Backlog](docs/BACKLOG.md): histórias priorizadas do produto e definição de pronto.
- [Arquitetura](docs/ARQUITETURA.md): estrutura de arquivos, decisões técnicas e persistência planejada.
- [Diário de entregas](docs/DIARIO_DE_ENTREGAS.md): registro do que foi entregue e do que será feito a seguir.

## Tecnologias

- React 19
- TypeScript
- Vite
- CSS responsivo, sem biblioteca de componentes

## Estrutura do projeto

```text
SaborDaCasa/
├── docs/                 # planejamento, backlog e registros técnicos
├── public/images/        # imagens estáticas usadas na interface
├── src/
│   ├── App.tsx           # página e interações atuais
│   ├── main.tsx          # entrada da aplicação
│   └── styles.css        # identidade visual e responsividade
├── package.json
└── vite.config.ts
```

## Como executar

Pré-requisito: Node.js LTS instalado.

```bash
npm install
npm run dev
```

No PowerShell em que a execução de scripts esteja desabilitada, use `npm.cmd`:

```powershell
npm.cmd install
npm.cmd run dev
```

Depois, abra no navegador o endereço mostrado no terminal, normalmente `http://localhost:5173`.

## Comandos disponíveis

| Comando | Uso |
| --- | --- |
| `npm.cmd run dev` | Inicia o ambiente de desenvolvimento. |
| `npm.cmd run build` | Gera a versão otimizada em `dist/`. |
| `npm.cmd run preview` | Abre localmente a versão construída. |
| `npm.cmd run typecheck` | Confere os tipos do TypeScript. |

## Limites atuais

Os dados das receitas ainda são demonstrativos e ficam no código. Favoritos não são persistidos ao recarregar a página nesta entrega. A lista exibida na página inicial é visual; o carrinho de ingredientes e a estimativa de preços serão implementados conforme o plano.

## Imagem autoral

A imagem principal em `public/images/hero-bowl.png` foi gerada para o projeto com o prompt: “fotografia editorial de um bowl brasileiro de legumes assados, ervas, grãos e molho cremoso, em bancada clara e acolhedora”. As demais imagens de exemplo usam URLs do Unsplash e serão revisadas antes da publicação final.
