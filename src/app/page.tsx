"use client";

import React, { useState } from "react";
import NavBar from "./components/NavBar";
import TabBar from "./components/TabBar";
import HomeView from "./views/HomeView";
import ProfileView from "./views/ProfileView";
import CourseDetailView from "./views/CourseDetailView";
import CategoriesView from "./views/CategoriesView";
import ShortsView from "./views/ShortsView";
import MyCoursesView from "./views/MyCoursesView";
import LoginScreen from "./components/LoginScreen";
import MenuSheet from "./components/MenuSheet";
import { IoChevronBack } from "react-icons/io5";

// Feature flags — flip to true later to bring these back.
const SHOW_TAB_BAR = false;
const SHOW_MENU = false;

export default function IosViewSecret() {
  const [activeTab, setActiveTab] = useState("home");

  // Navigation state (main, course_detail, etc)
  const [currentView, setCurrentView] = useState("main");
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  // Determine what title to show based on tab
  const getNavTitle = () => {
    if (currentView === "course_detail") return "Course Detail";
    
    switch(activeTab) {
      case 'home': return 'Thantra Astro';
      case 'categories': return 'All Categories';
      case 'shorts': return 'Trending Shorts';
      case 'my-courses': return 'My Learning';
      case 'profile': return 'My Profile';
      default: return 'Thantra Astro';
    }
  };

  // For shorts we want full screen immersive view
  const isImmersiveView =
    (activeTab === 'shorts' && currentView === 'main') || currentView === 'shorts';

  // Render the main content
  const renderContent = () => {
    if (currentView === "shorts") {
      return <ShortsView />;
    }
    if (currentView === "course_detail") {
      return (
        <CourseDetailView
          courseId={selectedCourseId}
          onBack={() => {
            setCurrentView("main");
            setSelectedCourseId(null);
          }}
        />
      );
    }

    switch(activeTab) {
      case 'home':
        return (
          <HomeView
            onNavigateToCourse={(courseId) => {
              setSelectedCourseId(courseId);
              setCurrentView("course_detail");
            }}
            onRequireLogin={() => setShowLogin(true)}
            onOpenShorts={() => setCurrentView("shorts")}
          />
        );
      case 'profile':
        return <ProfileView onOpenLogin={() => setShowLogin(true)} />;
      case 'categories':
        return <CategoriesView />;
      case 'shorts':
        return <ShortsView />;
      case 'my-courses':
        return <MyCoursesView onOpenLogin={() => setShowLogin(true)} />;
      default:
        return (
          <HomeView
            onNavigateToCourse={(courseId) => {
              setSelectedCourseId(courseId);
              setCurrentView("course_detail");
            }}
            onRequireLogin={() => setShowLogin(true)}
            onOpenShorts={() => setCurrentView("shorts")}
          />
        );
    }
  };

  return (
    <div className={`flex flex-col h-screen overflow-hidden relative ${isImmersiveView ? 'bg-black' : 'bg-[#f2f2f7]'}`}>
      {/* Top Navigation - hide in immersive views like shorts */}
      {!isImmersiveView && (
        <NavBar
          title={getNavTitle()}
          showBack={currentView !== "main"}
          showLogo={currentView === "main" && activeTab === "home"}
          onMenu={SHOW_MENU ? () => setShowMenu(true) : undefined}
          onBack={() => {
            setCurrentView("main");
            setSelectedCourseId(null);
          }}
        />
      )}

      {/* Main Content Area — keyed wrapper replays the iOS transition on nav */}
      <div
        key={
          currentView === "course_detail"
            ? "view-detail"
            : currentView === "shorts"
            ? "view-shorts"
            : `tab-${activeTab}`
        }
        className={`flex-1 flex flex-col min-h-0 ${
          currentView === "course_detail" || currentView === "shorts" ? "ios-push-in" : "ios-fade-in"
        }`}
      >
        {renderContent()}
      </div>

      {/* Floating back button for the immersive shorts feed (tab bar is hidden) */}
      {currentView === "shorts" && (
        <button
          className="fixed top-[env(safe-area-inset-top,16px)] left-4 z-[70] w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center ios-clickable"
          style={{ marginTop: 12 }}
          onClick={() => setCurrentView("main")}
          aria-label="Back"
        >
          <IoChevronBack size={24} className="text-white -ml-0.5" />
        </button>
      )}

      {/* Bottom Navigation */}
      {SHOW_TAB_BAR && currentView === "main" && (
        <TabBar
          activeTab={activeTab}
          onChangeTab={setActiveTab}
        />
      )}

      {/* Menu drawer */}
      {showMenu && (
        <MenuSheet
          onClose={() => setShowMenu(false)}
          onNavigate={(tab) => {
            setCurrentView("main");
            setSelectedCourseId(null);
            setActiveTab(tab);
          }}
        />
      )}

      {/* Login overlay */}
      {showLogin && (
        <LoginScreen
          onClose={() => setShowLogin(false)}
          onSuccess={() => {
            // After OTP login, land the user on the Home page.
            setShowLogin(false);
            setCurrentView("main");
            setSelectedCourseId(null);
            setActiveTab("home");
          }}
        />
      )}
    </div>
  );
}
