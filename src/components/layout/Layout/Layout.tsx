import Menu from '../Menu';
import Header from '../Header';
import SubNav from '../SubNav';
import Content from '../Content';
import { menuItems } from '../../../config/MenuItems';

interface LayoutProps {
  children?: React.ReactNode;
  headerTitle: string;
  showSubNavigation?: boolean;
}

const Layout = ({
  children,
  headerTitle,
  showSubNavigation = true,
}: LayoutProps) => {
  return (
    <div className="h-screen flex">
      <Menu menuItems={menuItems} />

      <div className="flex-1 flex flex-col">
        <Header title={headerTitle} />

        {showSubNavigation && <SubNav section="Fil d'arianne" />}

        <Content title="content title">{children}</Content>
      </div>
    </div>
  );
};

export default Layout;
