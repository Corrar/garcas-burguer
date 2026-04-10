# Atualização de Identidade Visual - Nome do App

**Prompt para o Agente:**
> "O cliente decidiu alterar o nome do sistema. A partir de agora, o projeto se chama **Garça's Burguer**.
> 
> Por favor, faça uma busca global no projeto e atualize os seguintes pontos:
> 1. No arquivo `index.html`, altere a tag `<title>` para `Garça's Burguer - PDV`.
> 2. No arquivo `package.json`, atualize o campo `"name"` (se aplicável, use um formato amigável para URL, como `garcas-burguer-pdv`).
> 3. Verifique o arquivo `src/components/AppLayout.tsx` e qualquer outro componente de Header/Sidebar que exiba o nome do sistema na interface visual, substituindo qualquer menção genérica ou anterior pelo novo nome **Garça's Burguer**.
> 4. Se houver alguma tag `<meta name="description">` no `index.html`, atualize para refletir o novo nome."

# Plano de Refatoração e Melhorias - PDV Burger Buddy

Este documento contém os prompts para o agente de IA executar as melhorias de arquitetura, performance e regras de negócio no sistema.

## Tarefa 1: Refatoração do PDVPage.tsx (Componentização)

**Prompt para o Agente:**
> "Atue como um desenvolvedor React Sênior. Analise o arquivo `src/pages/PDVPage.tsx`. Atualmente, ele está atuando como um componente monolítico, lidando com múltiplas responsabilidades (listagem de produtos, categorias, carrinho, modais de customização e WhatsApp). 
> 
> Sua tarefa é refatorar este arquivo aplicando os princípios de Clean Code:
> 1. Crie uma nova pasta em `src/components/pdv/`.
> 2. Extraia as seguintes responsabilidades para componentes separados dentro desta pasta:
>    - `CategoryTabs.tsx`: Para gerenciar a navegação de categorias.
>    - `ProductGrid.tsx`: Para exibir a lista de produtos filtrados.
>    - `CartSidebar.tsx`: Para a barra lateral do carrinho de compras e área de pagamento.
>    - `CustomizationModal.tsx`: Para o modal de personalização de itens (remoções/adições).
>    - `WhatsAppModal.tsx`: Para o modal de confirmação e envio de comprovante.
> 3. Mantenha os estados principais no `PDVPage.tsx` (ou mova lógicas estritas do carrinho para o `StoreContext.tsx` se fizer sentido) e passe as propriedades (props) e callbacks necessários para os novos componentes.
> 4. Envolva as operações custosas (como o filtro de `filteredProducts`) em `useMemo` para evitar re-renderizações desnecessárias."

---

## Tarefa 2: Persistência de Dados do Carrinho

**Prompt para o Agente:**
> "Preciso evitar que os itens do carrinho sejam perdidos caso o usuário recarregue a página acidentalmente (F5). 
> 
> Edite o arquivo `src/context/StoreContext.tsx` para implementar a persistência do estado `cart` utilizando o `localStorage` do navegador.
> 1. Crie um `useEffect` que seja executado ao montar o componente (`[]`) para ler os dados salvos no `localStorage` sob a chave `@burger-buddy:cart` e inicializar o estado `cart`.
> 2. Crie outro `useEffect` que escute as mudanças no estado `cart` e salve a string JSON atualizada no `localStorage` sempre que um item for adicionado, atualizado ou removido.
> 3. Garanta que a função `clearCart` e a função `placeOrder` também limpem o `localStorage` referente ao carrinho para evitar que uma venda finalizada permaneça no storage."

---

## Tarefa 3: Correção da Lógica de Precificação de Adicionais

**Prompt para o Agente:**
> "No modelo atual (`src/types/index.ts` e `src/context/StoreContext.tsx`), a interface `OrderItem` possui `removals` e `additions`, mas o sistema na interface do PDV está lidando com customizações (como 'Extra Bacon' ou 'Extra Queijo') misturadas no array de remoções e não repassa o custo para o valor final.
> 
> Por favor, faça os seguintes ajustes:
> 1. No `StoreContext.tsx`, atualize a função `getCartTotal` (e a lógica de `placeOrder`) para que ela calcule o subtotal de cada item não apenas multiplicando `unitPrice * quantity`, mas somando o valor dos adicionais (additions) selecionados. *Dica: Você pode precisar ajustar a tipagem de `additions` em `OrderItem` para guardar o preço do adicional, ou buscar o preço baseando-se no ID do adicional no catálogo de produtos.*
> 2. Modifique o componente responsável pelo Modal de Customização (que refatoramos da `PDVPage.tsx`) para distinguir visualmente e logicamente o que é uma 'Remoção' (sem custo, ex: Sem cebola) do que é um 'Adicional' (com custo, ex: +R$ 4,00 Extra Queijo).
> 3. Certifique-se de que, ao adicionar um item com adicionais pagos ao carrinho, o valor exibido na interface reflita corretamente a soma do (preço do lanche + preço dos adicionais) * quantidade."


# Correção Crítica: Responsividade Global e Barra de Navegação

Este documento visa corrigir o layout estrutural do "Garça's Burguer" para que ele seja perfeitamente responsivo (Desktop fluindo em tela cheia com carrinho lateral, e Mobile com barra inferior e botão de sacola flutuante), restaurando a barra de navegação que desapareceu.

## Tarefa 1: Refatoração do AppLayout (Estrutura Responsiva Base)

**Prompt para o Agente:**
> "Houve um problema com o layout principal. A restrição de largura quebrou a responsividade no Desktop e a barra de navegação sumiu.
> 
> 1. Vá para o arquivo do layout principal do cliente (ex: `src/components/AppLayout.tsx`).
> 2. Remova qualquer classe `max-w-md` que esteja limitando o container inteiro.
> 3. A estrutura principal (`<div className="...">`) deve ter as seguintes características:
>    - `flex flex-col min-h-screen bg-background w-full`
> 4. O miolo da página (onde o `<Routes>` ou `{children}` é renderizado) deve estar dentro de um container flexível com limite máximo elegante para desktop:
>    - `<main className="flex-1 flex w-full max-w-7xl mx-auto pb-24 lg:pb-8 pt-16 lg:pt-20">`
>    *(Nota: O `pb-24` no mobile é crucial para que a Bottom Navigation e o Cart Flutuante não cubram os últimos produtos do cardápio).*
> 5. Dentro desse `<main>`, a área de conteúdo/produtos deve ter `flex-1 w-full px-4`.
> 6. O componente `CartSidebar` deve ser renderizado *dentro* deste `<main>`, logo após a área de conteúdo, com as classes: `hidden lg:flex w-96 border-l`. Assim, no PC, o carrinho fica sempre perfeitamente encaixado na direita."

---

## Tarefa 2: Restauração da Barra de Navegação (Mobile e Desktop)

**Prompt para o Agente:**
> "A navegação precisa estar sempre acessível e fixada corretamente.
>
> 1. **Top Header (Fixo no topo):**
>    - Crie/ajuste o componente de Header superior para ter as classes: `fixed top-0 left-0 right-0 z-40 bg-background border-b h-16 flex items-center px-4 lg:px-8`.
>    - Ele deve conter a logo do Garça's Burguer, o botão de endereço/busca e o botão para o painel de Admin (caso exista).
> 
> 2. **Bottom Navigation (Exclusivo para Mobile):**
>    - Crie o componente `BottomNav.tsx`. Ele deve ser fixado na base **apenas em telas pequenas**:
>    - Classes do container: `fixed bottom-0 left-0 right-0 z-50 bg-background border-t h-16 flex items-center justify-around lg:hidden`.
>    - Inclua os botões com ícones (Lucide React): Início (`Home`), Busca (`Search`), Pedidos (`Receipt`) e Perfil (`User`).
>    - Adicione este `BottomNav` no final do seu `AppLayout.tsx` (fora da tag `<main>`)."

---

## Tarefa 3: Ajuste do Botão Flutuante da Sacola (Evitando Sobreposição)

**Prompt para o Agente:**
> "O botão flutuante da sacola no mobile não pode ficar escondido atrás da Bottom Navigation.
>
> 1. Vá para o `FloatingCartButton.tsx`.
> 2. Garanta que ele só apareça em telas pequenas (`lg:hidden`).
> 3. Ajuste o posicionamento dele para ficar um pouco acima da barra de navegação inferior. Use as classes: `fixed bottom-20 left-4 right-4 z-40`. (O `bottom-20` garante que ele flutue logo acima da `BottomNav` que tem altura de `16` / `64px`).
> 4. Garanta que a gaveta (Sheet/Drawer) da sacola se abra por cima de tudo (`z-[60]`)."
