import { ReactNode } from 'react';
import AppHeader from './AppHeader';
import AppSidebar from './AppSidebar';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col w-full m-0 p-0">
      <AppHeader />
      <div className="flex flex-1 w-full overflow-hidden m-0 p-0">
        <AppSidebar />
        <main className="flex-1 overflow-y-auto p-0 m-0">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
