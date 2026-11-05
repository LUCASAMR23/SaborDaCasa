# Persistência local

Nesta versão, os dados permanecem apenas no navegador da pessoa usuária.

| Chave | Conteúdo | Finalidade |
| --- | --- | --- |
| `sabor-da-casa-shopping-list` | Itens, quantidades, unidades e check-ins | Retomar a lista de compras após recarregar a página. |
| `sabor-da-casa-favorites` | Identificadores de receitas | Manter as receitas salvas entre sessões. |

Não são enviados dados para um servidor. Limpar os dados do site no navegador remove essas informações. Uma futura sincronização por conta deverá pedir consentimento explícito e substituir essa estratégia local de forma segura.
