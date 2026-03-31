# Refatoração: UX Mobile, Lógica de Sacola e Integração de QR Code

Este documento instrui o agente a adaptar o aplicativo "Garça's Burguer" para uma experiência 100% focada em dispositivos móveis (Mobile-First). O objetivo principal é ocultar a barra lateral do carrinho (adotando o padrão iFood com botão flutuante e Drawer) e criar um fluxo inteligente de entrada de usuários via link direto ou QR Code de mesa.

## Tarefa 1: Atualização do Estado de Fluxo do Pedido (Contexto)

**Prompt para o Agente:**
> "Precisamos armazenar a forma como o cliente vai consumir o pedido. 
> 1. No arquivo `src/types/index.ts`, adicione as seguintes tipagens:
>    - `OrderType = 'delivery' | 'pickup' | 'dine-in'` (Entrega, Retirada, Comer no Local).
>    - Adicione as propriedades `orderType: OrderType` e `tableNumber?: string` na interface `Order`.
> 2. No `StoreContext.tsx`, adicione os seguintes estados:
>    - `orderType` (tipo `OrderType | null`, iniciado como `null`).
>    - `tableNumber` (tipo `string | null`, iniciado como `null`).
> 3. Crie funções para atualizar esses estados: `setOrderType` e `setTableNumber`.
> 4. Garanta que, ao criar um pedido (`placeOrder`), esses dados (tipo de pedido e número da mesa) sejam incluídos no objeto final."

---

## Tarefa 2: Identificação Inteligente (QR Code vs Link Direto)

**Prompt para o Agente:**
> "O sistema precisa saber se o usuário escaneou um QR Code na mesa ou se entrou pelo link do Instagram/WhatsApp.
> 1. No componente raiz do cliente (ex: `src/pages/ClientPage.tsx` ou no seu layout principal), utilize o `useSearchParams` do `react-router-dom` para ler a URL.
> 2. **Lógica do QR Code:** Se a URL contiver `?mesa=12` (exemplo):
>    - Atualize automaticamente o contexto: `setOrderType('dine-in')` e `setTableNumber('12')`.
>    - Não exiba a tela de boas-vindas. Vá direto para o cardápio.
> 3. **Lógica do Link Direto:** Se a URL NÃO contiver o parâmetro de mesa e o `orderType` no contexto for `null`:
>    - Exiba um Modal de Boas-vindas (fullscreen ou centralizado) bloqueando o cardápio.
>    - Pergunte: 'Como você deseja seu pedido hoje?' com três grandes botões:
>      - 🛵 Entrega (pede o endereço ou cep depois, se necessário)
>      - 🏃‍♂️ Retirar na Loja
>      - 🍽️ Comer no Local (se clicar aqui sem ter lido QR Code, pode abrir um input pedindo o número da mesa ou comanda).
>    - Ao selecionar, salve no `StoreContext` e libere a navegação do cardápio."

---

## Tarefa 3: A Sacola Oculta e Botão Flutuante (Estilo iFood)

**Prompt para o Agente:**
> "A visualização de painel lateral do carrinho (`CartSidebar`) NÃO pode existir no layout do cliente. A experiência deve ser mobile.
> 1. Exclua a importação da `CartSidebar` da tela principal. O cardápio deve ocupar 100% da largura.
> 2. Crie o componente `FloatingCartButton.tsx`:
>    - Ele deve ficar fixo na parte inferior da tela (`fixed bottom-4 left-4 right-4 z-40`).
>    - Deve ter a cor primária (Vermelho).
>    - Deve mostrar: [Ícone de Sacola] [Quantidade de itens] | [Ver sacola] | [R$ Total].
>    - **Regra:** Este botão SÓ deve ser renderizado se `cart.length > 0`.
> 3. Ao clicar neste botão, ele deve abrir o componente `Sheet` (do Shadcn UI) deslizando de baixo para cima (`side="bottom"`) ocupando de 80% a 90% da altura da tela (estilo gaveta mobile).
> 4. O conteúdo desse `Sheet` será a nossa nova sacola:
>    - Lista de itens escolhidos (com opção de editar quantidade).
>    - Subtotal, Taxa de Entrega (se `orderType === 'delivery'`), e Total.
>    - Seleção de método de pagamento.
>    - Botão final 'Fazer Pedido' (`w-full`)."

---

## Tarefa 4: Layout Exclusivamente Mobile-First

**Prompt para o Agente:**
> "Para garantir que a experiência do usuário fique boa até se ele abrir no computador, vamos simular a proporção de celular.
> 1. No componente que envolve o layout do cliente (ex: `AppLayout.tsx` ou `ClientLayout.tsx`), adicione as classes do Tailwind: `max-w-md mx-auto min-h-screen bg-background relative shadow-2xl`.
> 2. Isso fará com que, em monitores grandes, o app fique centralizado no formato de um celular moderno, e em dispositivos móveis, ele ocupe 100% da tela (`w-full`).
> 3. Certifique-se de que não haja quebras de barra de rolagem horizontal (`overflow-x-hidden`)."

# Refatoração: Responsividade Universal e Carrinho Inteligente

Este documento foca em garantir que o sistema se adapte perfeitamente a qualquer tamanho de tela, mantendo a experiência mobile idêntica ao app do iFood (botão flutuante) e otimizando o espaço em telas grandes (computadores e tablets).

## Tarefa 1: Comportamento Responsivo do Carrinho (Desktop vs Mobile)

**Prompt para o Agente:**
> "Atue como um Especialista em UX/UI Responsivo. O aplicativo precisa se comportar de maneira inteligente dependendo da tela do usuário.
>
> 1. No layout principal do cliente (onde os produtos são listados):
>    - **No Desktop (`lg:` ou telas maiores):** Exiba o componente `CartSidebar.tsx` fixado na lateral direita (ocupando cerca de 300px a 380px), aproveitando o espaço da tela.
>    - **No Mobile/Tablet (`telas menores que lg`):** Oculte a `CartSidebar.tsx` usando as classes do Tailwind (ex: `hidden lg:flex`).
> 
> 2. Atualize o componente `FloatingCartButton.tsx`:
>    - Este botão deve ser EXCLUSIVO para dispositivos móveis.
>    - Adicione a classe `lg:hidden` ao container principal do botão flutuante, para que ele desapareça em telas grandes (já que o painel lateral estará visível).
>    - O botão deve permanecer fixo no rodapé (`fixed bottom-4 left-4 right-4 z-50`)."

---

## Tarefa 2: Ajuste do Grid de Produtos para Todas as Telas

**Prompt para o Agente:**
> "O catálogo de produtos precisa fluir naturalmente de acordo com a largura da tela.
>
> 1. No componente `ProductGrid.tsx`, ajuste a renderização da lista:
>    - **Mobile:** Um item por linha (ex: `grid-cols-1` ou `flex flex-col`). Cada card de produto deve ter a imagem na direita e os textos na esquerda, como combinamos anteriormente.
>    - **Tablet:** Dois itens por linha (`md:grid-cols-2`).
>    - **Desktop (telas bem largas):** Três ou até quatro itens por linha (`xl:grid-cols-3` ou `2xl:grid-cols-4`), mantendo o layout de lista horizontal de cada card.
> 2. Certifique-se de que o cabeçalho (`StoreHeader.tsx`) e os banners (`PromoBanners.tsx`) não ultrapassem a largura máxima do container principal em monitores ultrawide, centralizando o conteúdo (`max-w-7xl mx-auto`)."

---

## Tarefa 3: Gaveta da Sacola no Mobile (Bottom Sheet)

**Prompt para o Agente:**
> "Para garantir a usabilidade no celular quando o cliente clicar no Botão Flutuante:
>
> 1. O componente de `Sheet` (Shadcn UI) que exibe o resumo do carrinho no mobile deve estar configurado com `side="bottom"`.
> 2. Adicione bordas arredondadas apenas no topo da gaveta (`rounded-t-2xl` ou `rounded-t-3xl`), típico do iFood.
> 3. Garanta que a área interna da gaveta tenha um comportamento de rolagem seguro (`overflow-y-auto max-h-[85vh]`), para que o botão de 'Fazer Pedido' fique sempre visível e não seja empurrado para fora da tela caso o cliente tenha muitos itens na sacola."