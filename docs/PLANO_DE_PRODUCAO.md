# Plano de produção — 5 dias

## Visão do produto

**Sabor da Casa** é um app responsivo para encontrar receitas, organizar escolhas da semana e gerar uma lista de compras. O foco é tornar o ato de cozinhar mais leve, bonito e prático.

### Critérios de sucesso da primeira versão

- Uma pessoa consegue descobrir, salvar e abrir receitas com conforto no celular e no desktop.
- A pessoa consegue adicionar ingredientes de receitas à lista, alterar quantidades e visualizar uma estimativa de gasto.
- A experiência é rápida, acessível e mantém os dados no navegador nesta primeira versão.

## Dia 1 — Fundação visual e descoberta de receitas

**Status: concluído nesta entrega.**

Construir a identidade do Sabor da Casa, a tela inicial e a estrutura técnica do projeto. Entregar navegação, hero, filtros de categoria, cards de receitas, estado de favoritos e adaptação para mobile/desktop. Criar o plano, o backlog e os dados iniciais de exemplo.

**Validação:** conferir layout em telas pequenas e largas; testar filtros e favoritos.

## Dia 2 — Receita e lista de compras

Criar a página/modal de detalhes da receita: ingredientes, preparo, tempo e porções. Implementar ajuste de porções e botão **Adicionar ingredientes à lista**. Consolidar itens iguais e permitir marcar/remover itens da lista.

**Validação:** adicionar duas receitas, conferir soma de ingredientes repetidos e persistir a lista após recarregar a página.

## Dia 3 — Planejamento e estimativa de preço

Criar o planejamento semanal com seleção de dias e refeições. Incluir preço estimado por ingrediente, total da lista e aviso claro de que os valores são referências, não preços em tempo real. Acrescentar filtros por tempo, dificuldade e tipo de alimentação.

**Validação:** montar uma semana com receitas distintas, alterar uma quantidade e conferir o novo total.

## Dia 4 — Refinamento de experiência

Evoluir busca, favoritos persistentes, estados vazios, carregamento e acessibilidade de teclado. Revisar contraste, semântica, foco e leitura por tela. Ajustar cada tela para desktop, tablet e celular.

**Validação:** testar navegação apenas por teclado e breakpoints de 360 px, 768 px e 1440 px.

## Dia 5 — Qualidade e entrega de portfólio

Revisar conteúdo, dados e interações. Criar testes úteis para carrinho/lista e cálculo de estimativas, preparar capturas, README final e uma demonstração publicada. Registrar decisões e próximos passos.

**Validação:** build de produção, teste dos fluxos principais e checklist final de responsividade.

## Acordos técnicos desta versão

Os dados de receitas e preços começam locais para acelerar a interface. Favoritos e lista serão persistidos no navegador. Uma API, autenticação e preços por mercado entram como evolução posterior, após validar a experiência principal.

