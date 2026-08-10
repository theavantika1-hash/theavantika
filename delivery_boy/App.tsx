import React, { useState } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { RegisterScreen } from './src/screens/RegisterScreen';
import { OtpVerificationScreen } from './src/screens/OtpVerificationScreen';
import { RegisterDetailsScreen } from './src/screens/RegisterDetailsScreen';
import { RegisterPasswordScreen } from './src/screens/RegisterPasswordScreen';
import { RegisterPhotoScreen } from './src/screens/RegisterPhotoScreen';
import { RegisterDocumentsScreen } from './src/screens/RegisterDocumentsScreen';
import { RegisterSuccessScreen } from './src/screens/RegisterSuccessScreen';
import { UnderProgressScreen } from './src/screens/UnderProgressScreen';
import { ApprovalSuccessScreen } from './src/screens/ApprovalSuccessScreen';
import { NotVerifiedScreen } from './src/screens/NotVerifiedScreen';

import { HomeScreen } from './src/screens/HomeScreen';
import { LocationPickerScreen } from './src/screens/LocationPickerScreen';
import { OrdersScreen } from './src/screens/OrdersScreen';
import { MapScreen } from './src/screens/MapScreen';
import { OrderDetailScreen } from './src/screens/OrderDetailScreen';
import { OrderTrackingScreen } from './src/screens/OrderTrackingScreen';
import { AccountScreen } from './src/screens/AccountScreen';
import { ChooseLanguageScreen, LanguageItem } from './src/screens/ChooseLanguageScreen';
import { NotificationsScreen } from './src/screens/NotificationsScreen';
import { MyEarningsScreen } from './src/screens/MyEarningsScreen';
import { RatingsScreen } from './src/screens/RatingsScreen';
import { DepositCashScreen } from './src/screens/DepositCashScreen';
import { TransactionsScreen } from './src/screens/TransactionsScreen';

export type ScreenType =
  | 'onboarding'
  | 'login'
  | 'register'
  | 'otp'
  | 'register_details'
  | 'register_password'
  | 'register_photo'
  | 'register_documents'
  | 'register_success'
  | 'under_progress'
  | 'approval_success'
  | 'not_verified'
  | 'home'
  | 'location'
  | 'orders'
  | 'map'
  | 'order_detail'
  | 'order_tracking'
  | 'account'
  | 'choose_language'
  | 'notifications'
  | 'my_earnings'
  | 'ratings'
  | 'deposit'
  | 'transactions';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('login');
  const [userEmail, setUserEmail] = useState('');
  const [userLocation, setUserLocation] = useState('#321, Phase-II, UE, Ludhiana, India...');
  const [activeLanguage, setActiveLanguage] = useState<LanguageItem>({
    id: 'en',
    name: 'English',
    flag: '🇺🇸',
  });
  const [regDetails, setRegDetails] = useState<{ fullName: string; phone: string; email: string } | null>(null);

  // Automatic App Permissions Request & Continuous GPS Location Streaming
  React.useEffect(() => {
    import('./src/utils/permissionHelper').then(({ requestAppPermissions }) => {
      requestAppPermissions().then((result) => {
        console.log('[App Permissions] Granted status:', result);
      });
    });

    import('./src/services/locationService').then(({ startLiveLocationTracking }) => {
      startLiveLocationTracking().then(() => {
        console.log('[GPS Tracking] Continuous Live Location Streaming Started');
      });
    });
  }, []);

  // Security Guard: Prevent unapproved users from accessing home / dashboard
  React.useEffect(() => {
    if (currentScreen === 'home' && userEmail) {
      import('./src/config/api').then(({ deliveryBoyApi }) => {
        deliveryBoyApi.getApprovalStatus(userEmail).then((res) => {
          if (res.data?.approvalStatus !== 'approved') {
            console.log('[Approval Guard] User approvalStatus is not "approved". Redirecting to under_progress screen.');
            setIsLoggedIn(false);
            setCurrentScreen('under_progress');
          }
        }).catch(() => {});
      });
    }
  }, [currentScreen, userEmail]);


  const isYellowHeader = currentScreen === 'otp' || currentScreen === 'register';




  const isWhiteHeader =
    currentScreen === 'register_details' ||
    currentScreen === 'register_password' ||
    currentScreen === 'register_photo' ||
    currentScreen === 'register_documents' ||
    currentScreen === 'register_success' ||
    currentScreen === 'under_progress' ||
    currentScreen === 'not_verified' ||
    currentScreen === 'location' ||
    currentScreen === 'map' ||
    currentScreen === 'order_detail' ||
    currentScreen === 'order_tracking' ||
    currentScreen === 'choose_language' ||
    currentScreen === 'notifications' ||
    currentScreen === 'my_earnings' ||
    currentScreen === 'ratings' ||
    currentScreen === 'deposit' ||
    currentScreen === 'transactions';

  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle={isYellowHeader || isWhiteHeader ? 'dark-content' : 'light-content'}
        backgroundColor={isYellowHeader ? '#FDE047' : isWhiteHeader ? '#FFFFFF' : '#4CA687'}
      />
      {currentScreen === 'transactions' ? (
        <TransactionsScreen
          onBack={() => setCurrentScreen('deposit')}
          onNavigateToNotifications={() => setCurrentScreen('notifications')}
        />
      ) : currentScreen === 'deposit' ? (
        <DepositCashScreen
          onBack={() => setCurrentScreen('home')}
          onNavigateTab={(tab) => {
            if (tab === 'profile') setCurrentScreen('home');
            else if (tab === 'orders') setCurrentScreen('orders');
            else if (tab === 'account') setCurrentScreen('account');
            else if (tab === 'deposit') setCurrentScreen('deposit');
          }}
          onNavigateToNotifications={() => setCurrentScreen('notifications')}
          onNavigateToTransactions={() => setCurrentScreen('transactions')}
        />
      ) : currentScreen === 'ratings' ? (
        <RatingsScreen
          onBack={() => setCurrentScreen('account')}
        />
      ) : currentScreen === 'my_earnings' ? (
        <MyEarningsScreen
          onBack={() => setCurrentScreen('account')}
        />
      ) : currentScreen === 'notifications' ? (
        <NotificationsScreen
          onBack={() => setCurrentScreen('home')}
          onSelectNotification={() => setCurrentScreen('order_detail')}
        />
      ) : currentScreen === 'choose_language' ? (
        <ChooseLanguageScreen
          onBack={() => setCurrentScreen('account')}
          selectedLanguageId={activeLanguage.id}
          onSelectLanguage={(lang) => setActiveLanguage(lang)}
        />
      ) : currentScreen === 'account' ? (
        <AccountScreen
          selectedLanguage={activeLanguage}
          onNavigateTab={(tab) => {
            if (tab === 'profile') setCurrentScreen('home');
            else if (tab === 'orders') setCurrentScreen('orders');
            else if (tab === 'account') setCurrentScreen('account');
            else if (tab === 'deposit') setCurrentScreen('deposit');
          }}
          onNavigateToEarnings={() => setCurrentScreen('my_earnings')}
          onNavigateToRatings={() => setCurrentScreen('ratings')}
          onNavigateToLanguage={() => setCurrentScreen('choose_language')}
          onNavigateToNotifications={() => setCurrentScreen('notifications')}
          onLogout={() => {
            setIsLoggedIn(false);
            setCurrentScreen('login');
          }}
        />
      ) : currentScreen === 'order_tracking' ? (
        <OrderTrackingScreen
          onBack={() => setCurrentScreen('order_detail')}
        />
      ) : currentScreen === 'order_detail' ? (
        <OrderDetailScreen
          userEmail={userEmail}
          onBack={() => setCurrentScreen('orders')}
          onNavigateToTracking={() => setCurrentScreen('order_tracking')}
        />
      ) : currentScreen === 'map' ? (
        <MapScreen
          onBack={() => setCurrentScreen('orders')}
          locationText={userLocation}
          activeOrdersCount={4}
          totalDistanceKm={12.5}
        />
      ) : currentScreen === 'orders' ? (
        <OrdersScreen
          userEmail={userEmail}
          onNavigateTab={(tab) => {
            if (tab === 'profile') setCurrentScreen('home');
            else if (tab === 'orders') setCurrentScreen('orders');
            else if (tab === 'account') setCurrentScreen('account');
            else if (tab === 'deposit') setCurrentScreen('deposit');
          }}
          onNavigateToMap={() => setCurrentScreen('map')}
          onNavigateToDetail={() => setCurrentScreen('order_detail')}
          onNavigateToNotifications={() => setCurrentScreen('notifications')}
        />

      ) : currentScreen === 'location' ? (
        <LocationPickerScreen
          onBack={() => setCurrentScreen('home')}
          onSelectLocation={(selectedLoc) => {
            setUserLocation(selectedLoc);
            setCurrentScreen('home');
          }}
        />
      ) : currentScreen === 'home' ? (
        <HomeScreen
          userEmail={userEmail}
          onNavigateToLogin={() => setCurrentScreen('login')}
          onNavigateToLocation={() => setCurrentScreen('location')}
          onNavigateToOrders={() => setCurrentScreen('orders')}
          onNavigateToAccount={() => setCurrentScreen('account')}
          onNavigateToNotifications={() => setCurrentScreen('notifications')}
          onNavigateToDeposit={() => setCurrentScreen('deposit')}
          currentLocationText={userLocation}
        />

      ) : currentScreen === 'onboarding' ? (
        <OnboardingScreen onNavigateToLogin={() => setCurrentScreen('login')} />
      ) : currentScreen === 'login' ? (
        <LoginScreen
          onNavigateToOnboarding={() => setCurrentScreen('onboarding')}
          onNavigateToRegister={() => setCurrentScreen('register')}
          onNavigateToOtp={(email) => {
            if (email) setUserEmail(email);
            setCurrentScreen('otp');
          }}
          onLoginSuccess={(email, approvalStatus) => {
            if (email) setUserEmail(email);
            if (approvalStatus === 'approved') {
              setIsLoggedIn(true);
              setCurrentScreen('home');
            } else {
              setCurrentScreen('under_progress');
            }
          }}
        />

      ) : currentScreen === 'register' ? (
        <RegisterScreen
          onBack={() => setCurrentScreen('login')}
          onNavigateToLogin={() => setCurrentScreen('login')}
          onProceedToOtp={(email) => {
            if (email) setUserEmail(email);
            setCurrentScreen('otp');
          }}
        />
      ) : currentScreen === 'otp' ? (
        <OtpVerificationScreen
          email={userEmail || 'des.gaurav@gmail.com'}
          onBack={() => setCurrentScreen('register')}
          onVerifySuccess={() => {
            setCurrentScreen('register_details');
          }}
        />
      ) : currentScreen === 'register_details' ? (
        <RegisterDetailsScreen
          initialEmail={userEmail || 'des.gaurav@gmail.com'}
          onBack={() => setCurrentScreen('otp')}
          onSubmit={(details) => {
            setRegDetails(details);
            setCurrentScreen('register_password');
          }}
        />
      ) : currentScreen === 'register_password' ? (
        <RegisterPasswordScreen
          registrationDetails={regDetails || undefined}
          onBack={() => setCurrentScreen('register_details')}
          onSubmit={() => {
            setCurrentScreen('register_photo');
          }}
        />
      ) : currentScreen === 'register_photo' ? (


        <RegisterPhotoScreen
          onBack={() => setCurrentScreen('register_password')}
          onSubmit={() => {
            setCurrentScreen('register_documents');
          }}
        />
      ) : currentScreen === 'register_documents' ? (
        <RegisterDocumentsScreen
          onBack={() => setCurrentScreen('register_photo')}
          onSubmit={() => {
            setCurrentScreen('register_success');
          }}
        />
      ) : currentScreen === 'register_success' ? (
        <RegisterSuccessScreen
          onNextState={() => setCurrentScreen('under_progress')}
          onDone={() => {
            setCurrentScreen('under_progress');
          }}
        />
      ) : currentScreen === 'under_progress' ? (

        <UnderProgressScreen
          userEmail={userEmail}
          onApproved={() => setCurrentScreen('approval_success')}
          onNextState={() => setCurrentScreen('not_verified')}
          onBack={() => setCurrentScreen('register_success')}
        />
      ) : currentScreen === 'approval_success' ? (
        <ApprovalSuccessScreen
          onNavigateToHome={() => {
            setIsLoggedIn(true);
            setCurrentScreen('home');
          }}
        />
      ) : (
        <NotVerifiedScreen
          onUploadAgain={() => setCurrentScreen('register_documents')}
        />
      )}

    </SafeAreaProvider>
  );
}

export default App;
