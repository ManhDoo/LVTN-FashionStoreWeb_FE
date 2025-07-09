// layouts/UserLayout.js
import Header from "../user/components/Header";
import Menu from "../user/components/Menu";
import Footer from "../user/components/Footer";

const UserLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100 w-full">
      <Header />
      <Menu />
      <div className="pt-30">
        {children}
      </div>
      <Footer />
    </div>
  );
};

export default UserLayout;
