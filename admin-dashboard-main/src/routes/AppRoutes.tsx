import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {ScrollToTop} from "../components/common/ScrollToTop.tsx";
import AppLayout from "../layout/AppLayout.tsx";
import Home from "../pages/Dashboard/Home.tsx";
import UserProfiles from "../pages/UserProfiles.tsx";
import UsersList from "../pages/Users/UsersList.tsx";
import Calendar from "../pages/Calendar.tsx";
import Blank from "../pages/Blank.tsx";
import FormElements from "../pages/Forms/FormElements.tsx";
import BasicTables from "../pages/Tables/BasicTables.tsx";
import Alerts from "../pages/UiElements/Alerts.tsx";
import Avatars from "../pages/UiElements/Avatars.tsx";
import Badges from "../pages/UiElements/Badges.tsx";
import Buttons from "../pages/UiElements/Buttons.tsx";
import Images from "../pages/UiElements/Images.tsx";
import Videos from "../pages/UiElements/Videos.tsx";
import LineChart from "../pages/Charts/LineChart.tsx";
import BarChart from "../pages/Charts/BarChart.tsx";
import SignIn from "../pages/AuthPages/SignIn.tsx";
import SignUp from "../pages/AuthPages/SignUp.tsx";
import NotFound from "../pages/OtherPage/NotFound.tsx";
import MainPage from "../pages/MainPage.tsx";
import MainLayout from "../layout/MainLayout.tsx";
import ForgotPassword from "../pages/OtherPage/ForgotPassword.tsx";
import ResetPassword from "../pages/OtherPage/ResetPassword.tsx";
import CategoriesList from "../pages/Categories/components/CategoriesList.tsx";
import AdminRoute from "./AdminRoutes.tsx";
import Profile from "../pages/Profile.tsx";

const AppRoutes : React.FC = () => {
    return (
        <Router>
            <ScrollToTop />
            <Routes>
                {/* Main Layout */}
                <Route element={<MainLayout />}>
                    <Route path="/" element={<MainPage />} />
                </Route>

                {/* Dashboard Layout */}
                <Route path="admin" element={
                    <AdminRoute>
                        <AppLayout />
                    </AdminRoute>
                }>
                    <Route index element={<Home />} />

                    {/* Others Page */}
                    <Route path={"user"}>
                        <Route path=":id" element={<UserProfiles />} />
                    </Route>
                    <Route path="users-list" element={<UsersList />} />
                    <Route path="categories-list" element={<CategoriesList />} />
                    <Route path="calendar" element={<Calendar />} />
                    <Route path="blank" element={<Blank />} />

                    {/* Forms */}
                    <Route path="form-elements" element={<FormElements />} />

                    {/* Tables */}
                    <Route path="basic-tables" element={<BasicTables />} />

                    {/* Ui Elements */}
                    <Route path="alerts" element={<Alerts />} />
                    <Route path="avatars" element={<Avatars />} />
                    <Route path="badge" element={<Badges />} />
                    <Route path="buttons" element={<Buttons />} />
                    <Route path="images" element={<Images />} />
                    <Route path="videos" element={<Videos />} />

                    {/* Charts */}
                    <Route path="line-chart" element={<LineChart />} />
                    <Route path="bar-chart" element={<BarChart />} />
                </Route>

                {/* Auth Layout */}
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="forgot-password" element={<ForgotPassword />} />
                <Route path="reset-password" element={<ResetPassword />} />

                {/* Fallback Route */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    )
};

export default AppRoutes;