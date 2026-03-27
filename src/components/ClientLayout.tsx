import { Outlet } from 'react-router-dom';
import { TopNav } from './pdv/TopNav';
import { BottomNav } from './pdv/BottomNav';

const ClientLayout = () => {
  return (
    <div className="w-full min-h-[100dvh] bg-background relative overflow-x-hidden flex flex-col">
      <TopNav />
      <Outlet />
      <BottomNav />
    </div>
  );
};

export default ClientLayout;
