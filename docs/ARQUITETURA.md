# Arquitetura e decisões técnicas

## Objetivo da primeira versão

Entregar uma experiência rápida e responsiva que rode inteiramente no navegador. Isso permite validar a navegação e a lista de compras antes de introduzir uma API, autenticação ou banco de dados.

## Organização atual

| Local | Responsabilidade |
| --- | --- |
| `src/main.tsx` | Inicializa o React e carrega os estilos globais. |
| `src/App.tsx` | Mantém os dados de demonstração, a tela inicial e os estados de filtro/favoritos. |
| `src/styles.css` | Define tokens visuais, layout, componentes e breakpoints. |
| `public/images` | Guarda imagens que pertencem ao projeto e devem estar disponíveis no build. |
| `docs` | Centraliza as decisões e o acompanhamento do trabalho. |

## Interface e responsividade

O projeto começa com a experiência desktop, mas usa um breakpoint em `760px` para reorganizar conteúdo no celular. No mobile, a navegação é simplificada, o hero fica em coluna e a grade de receitas vira uma faixa horizontal que pode ser deslizada.

A identidade usa verde profundo, terracota e tons claros para comunicar acolhimento e comida caseira. A fonte serifada é reservada para títulos; a sans-serif garante leitura confortável nos textos e controles.

## Estado atual

Os filtros e favoritos usam estado local de React porque ainda pertencem apenas à sessão atual. Essa escolha mantém o primeiro dia focado na interface e torna o código fácil de evoluir.

## Persistência planejada

No Dia 2, favoritos e lista de compras serão salvos em `localStorage`. A estrutura prevista é:

```ts
type ShoppingItem = {
  id: string
  name: string
  quantity: number
  unit: string
  checked: boolean
  estimatedUnitPrice?: number
}
```

No Dia 3, o total será calculado a partir de `quantity × estimatedUnitPrice`. Os valores serão explicitamente identificados como estimativas de referência, nunca como preço em tempo real.

## Evolução posterior

Uma API e autenticação só serão consideradas após a validação da primeira versão. Nessa etapa, receitas podem sair do arquivo local para uma fonte de conteúdo e dados do usuário podem ser sincronizados entre dispositivos.

