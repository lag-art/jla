import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Loader from "../components/common/Loader";
import ROUTES from "./routePaths";

// TODO: All pages are lazy-loaded for route-level code splitting.
// Each page lives at src/pages/<PageName>.jsx

const HomePage = lazy(() => import("../pages/HomePage"));
const AboutPage = lazy(() => import("../pages/AboutPage"));
const LeadershipPage = lazy(() => import("../pages/LeadershipPage"));

const ResourcesPage = lazy(() => import("../pages/ResourcesPage"));
const ResourcesConstitutionPage = lazy(() => import("../pages/ResourcesConstitutionPage"));
const ResourcesManifestoPage = lazy(() => import("../pages/ResourcesManifestoPage"));
const ResourcesPublicationsPage = lazy(() => import("../pages/ResourcesPublicationsPage"));

const MediaPage = lazy(() => import("../pages/MediaPage"));
const NominationsPage = lazy(() => import("../pages/NominationsPage"));
const ContactPage = lazy(() => import("../pages/ContactPage"));
const JoinPage = lazy(() => import("../pages/JoinPage"));
const NotFoundPage = lazy(() => import("../pages/NotFoundPage"));

const AppRoutes = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route path={ROUTES.ABOUT} element={<AboutPage />} />
          <Route path={ROUTES.LEADERSHIP} element={<LeadershipPage />} />

          {/* Resources: hub page + deep-linkable document pages */}
          <Route path={ROUTES.RESOURCES} element={<ResourcesPage />} />
          <Route path={ROUTES.RESOURCES_CONSTITUTION} element={<ResourcesConstitutionPage />} />
          <Route path={ROUTES.RESOURCES_MANIFESTO} element={<ResourcesManifestoPage />} />
          
          <Route path={ROUTES.RESOURCES_PUBLICATIONS} element={<ResourcesPublicationsPage />} />

          <Route path={ROUTES.MEDIA} element={<MediaPage />} />
          {/* <Route path={ROUTES.NOMINATIONS} element={<NominationsPage />} /> */}
          <Route path={ROUTES.CONTACT} element={<ContactPage />} />
          <Route path={ROUTES.JOIN} element={<JoinPage />} />

          <Route path={ROUTES.NOT_FOUND} element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
