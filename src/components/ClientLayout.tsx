import { Outlet } from 'react-router-dom';
import { TopNav } from './pdv/TopNav';
import { BottomNav } from './pdv/BottomNav';

const ClientLayout = () => {
  return (
    // Fundo cinza claro padrão de apps de delivery, ocupando toda a tela
    <div className="w-full min-h-[100dvh] bg-[#f8f9fa] relative overflow-x-hidden flex flex-col">
      <TopNav />
      {/* Container principal que centraliza o conteúdo em telas muito grandes */}
      <main className="flex-1 w-full max-w-[1600px] mx-auto flex flex-col relative">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
};

export default ClientLayout;