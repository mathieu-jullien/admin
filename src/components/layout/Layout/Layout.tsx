import { Outlet } from 'react-router-dom';
import Menu from '../Menu';
import Header from '../Header';
import SubNav from '../SubNav';
import Content from '../Content';
import { menuItems } from '../../../config/MenuItems';

interface LayoutProps {
  headerTitle: string;
  showSubNavigation?: boolean;
}

export default function Layout({
  headerTitle = 'Mon super titre',
  showSubNavigation = false,
}: LayoutProps) {
  return (
    <div className="h-screen flex">
      <Menu menuItems={menuItems} />

      <div className="flex-1 flex flex-col">
        <Header title={headerTitle} />

        {showSubNavigation && <SubNav section="Fil d'arianne" />}

        <Content title="content title">
          <Outlet />
        </Content>
      </div>
    </div>
  );
}
