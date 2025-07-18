import { Routes, Route } from "react-router-dom";
import UserLayout from './layouts/UserLayout';
import AdminLayout from './layouts/AdminLayout';

import Banner from './user/components/Banner';
import ProductSection from './user/components/ProductSection';
import ProductDetail from './user/pages/ProductDetail';
import CartPage from './user/pages/Cart';
import CheckoutPage from './user/pages/CheckoutPage';
import LoginPage from './user/pages/LoginPage';
import RegisterPage from "./user/pages/RegisterPage";
import AllProducts from './user/pages/AllProducts';
import OrderHistory from './user/pages/OrderHistory';
import ReturnRequestPage from "./user/pages/ReturnRequestPage";
import VNPayReturnPage from './user/pages/VNPayReturnPage.JSX';
import PaymentSuccessPage from './user/pages/PaymentSuccessPage';
import PaymentFailurePage from "./user/pages/PaymentFailurePage";
import PromotionProductsPage from "./user/pages/PromotionProductsPage";
import ProductsByCategoryPage from "./user/pages/ProductsByCategoryPage";
import ProductsByGenderPage from "./user/pages/ProductsByGenderPage";
import ListReturnRequestPage from "./user/pages/ListReturnRequestsPage";

import LoginForm from "./admin/page/LoginPageAdmin";

import CategoryPage from "./admin/page/Category/CategoryPage";
import CategoryCreate from "./admin/page/Category/CategoryCreate";
import CategoryEdit from "./admin/page/Category/CategoryEdit";

import ProductPage from "./admin/page/Product/ProductPage";
import ProductCreate from "./admin/page/Product/ProductCreate";
import ProductEdit from "./admin/page/Product/ProductEdit";

import PromotionPage from "./admin/page/Promotion/PromotionPage";
import PromotionCreate from "./admin/page/Promotion/PromotionCreate";
import AssignPromotionToProduct from "./admin/page/Promotion/AddPromotionProduct";

import ReturnRequestPageAdmin from "./admin/page/ReturnRequest/ReturnRequestPage";

import BillPage from "./admin/page/Bill/BillPage";
import BillCreate from "./admin/page/Bill/BillCreate";

import OrderPage from "./admin/page/Order/OrderPage";

function App() {
  return (
    <Routes>
      {/* Layout cho user */}
      <Route
        path="/"
        element={
          <UserLayout>
            <>
              <Banner />
              <ProductSection category="FOR MAN" />
              <ProductSection category="FOR WOMEN" />
            </>
          </UserLayout>
        }
      />
      <Route
        path="/product/:slugWithId"
        element={<UserLayout><ProductDetail /></UserLayout>}
      />
      <Route
        path="/promotion"
        element={<UserLayout><PromotionProductsPage /></UserLayout>}
      />
      <Route
        path="/cart"
        element={<UserLayout><CartPage /></UserLayout>}
      />
      <Route
        path="/checkout"
        element={<UserLayout><CheckoutPage /></UserLayout>}
      />
      <Route
        path="/login"
        element={<UserLayout><LoginPage /></UserLayout>}
      />
      <Route
        path="/register"
        element={<UserLayout><RegisterPage /></UserLayout>}
      />
      <Route
        path="/all/:category"
        element={<UserLayout><AllProducts /></UserLayout>}
      />
      <Route
        path="/category/:slugWithId"
        element={<UserLayout><ProductsByCategoryPage /></UserLayout>}
      />
      <Route
        path="/gender/:gender"
        element={<UserLayout><ProductsByGenderPage /></UserLayout>}
      />
      <Route
        path="/orders"
        element={<UserLayout><OrderHistory /></UserLayout>}
      />
      <Route
        path="/return-request"
        element={<UserLayout><ReturnRequestPage /></UserLayout>}
      />
      <Route
        path="/list-return"
        element={<UserLayout><ListReturnRequestPage /></UserLayout>}
      />
      <Route
        path="/vnpay-return"
        element={<VNPayReturnPage />}
      />
      <Route
        path="/payment-success"
        element={<PaymentSuccessPage />}
      />
      <Route
        path="/payment-failure"
        element={<PaymentFailurePage />}
      />

      {/* Layout cho admin */}
      <Route
        path="/admin"
        element={<LoginForm />}
      />
      <Route
        path="/category"
        element={<AdminLayout><CategoryPage /></AdminLayout>}
      />
      <Route
        path="/product"
        element={<AdminLayout><ProductPage /></AdminLayout>}
      />
      <Route
        path="/product-create"
        element={<AdminLayout><ProductCreate /></AdminLayout>}
      />
      <Route
        path="/product-edit/:id"
        element={<AdminLayout><ProductEdit /></AdminLayout>}
      />
      <Route
        path="/category-create"
        element={<AdminLayout><CategoryCreate /></AdminLayout>}
      />
      <Route
        path="/category-edit/:id"
        element={<AdminLayout><CategoryEdit /></AdminLayout>}
      />
      <Route
        path="/order"
        element={<AdminLayout><OrderPage /></AdminLayout>}
      />
      <Route
        path="/promotion-page"
        element={<AdminLayout><PromotionPage /></AdminLayout>}
      />
      <Route
        path="/promotion-create"
        element={<AdminLayout><PromotionCreate /></AdminLayout>}
      />
      <Route
        path="/promotion-assign"
        element={<AdminLayout><AssignPromotionToProduct /></AdminLayout>}
      />
      <Route
        path="/return-request-page"
        element={<AdminLayout><ReturnRequestPageAdmin /></AdminLayout>}
      />
      <Route
        path="/bills-create/:id"
        element={<AdminLayout><BillCreate /></AdminLayout>}
      />
      <Route
        path="/bills"
        element={<AdminLayout><BillPage /></AdminLayout>}
      />
      
    </Routes>
  );
}

export default App;
