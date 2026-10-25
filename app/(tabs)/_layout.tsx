import { Tabs, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native'; 
import Ionicons from '@expo/vector-icons/Ionicons';

import { COLORS } from '@/constants/colors';
import { useAuth } from '@/lib/auth';
import { getProfile, type Role } from '@/lib/profiles';
import { useGlobalTheme } from '@/lib/theme';

export default function TabLayout() {
  const { user } = useAuth();
  const [role, setRole] = useState<Role | null>(null);
  const { darkMode } = useGlobalTheme();
  const router = useRouter(); 

  useEffect(() => {
    // SECURITY AUTO-REDIRECT: If no active user session exists, push them to the landing screen instantly
    if (!user) { 
      setRole(null);
      return;
    }

    getProfile(user.id).then((profile) => {
      setRole(profile?.role ?? 'student');
    }).catch((error) => {
      console.error('Error loading role in layout:', error);
      setRole('student'); 
    });
  }, [user]);

  const navBgColor = darkMode ? '#1E1E1E' : '#FFFFFF';
  const navBorderColor = darkMode ? '#2D2D2D' : '#F0EFEF';
  const activeIconColor = '#4aa9db';
  const inactiveIconColor = darkMode ? '#888888' : '#666666';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: activeIconColor,
        tabBarInactiveTintColor: inactiveIconColor,
        tabBarStyle: {
          backgroundColor: navBgColor,
          borderTopColor: navBorderColor,
          borderTopWidth: 1,
          height: Platform.OS === 'android' ? 114 : 78,
          paddingTop: 14,
          paddingBottom: Platform.OS === 'android' ? 36 : 18,
          // SYSTEM HARD LOCK GATEWAY: Forces display to 'none' if there is no logged-in user session
          display: !user ? 'none' : 'flex', 
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 2,
        },
      }}
    >
      {/* FORCE HIDE LEFTOVER TAB COPIES FROM RENDER SCOPES */}
      <Tabs.Screen name="index" options={{ href: null }} />
      <Tabs.Screen name="notification" options={{ href: null }} />

      {/* Main Dashboard tab */}
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? 'grid' : 'grid-outline'} 
              size={22} 
              color={color} 
            />
          ),
        }}
      />

      {/* Dynamic Scan QR Code Tab - Visible ONLY to students */}
      <Tabs.Screen
        name="scan"
        options={{
          title: 'Scan QR',
          href: role === 'teacher' ? null : undefined, 
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'qr-code' : 'qr-code-outline'}
              color={color}
              size={22}
            />
          ),
        }}
      />

      {/* Shared History Logs tab */}
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'time' : 'time-outline'}
              color={color}
              size={22}
            />
          ),
        }}
      />

      {/* Account Settings profile tab */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'person' : 'person-outline'}
              color={color}
              size={22}
            />
          ),
        }}
      />

      {/* Dynamic Teacher Management Tab - Visible ONLY to teachers */}
      <Tabs.Screen
        name="teacher"
        options={{
          title: 'Teacher',
          href: role === 'student' ? null : undefined, 
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'clipboard' : 'clipboard-outline'}
              color={color}
              size={22}
            />
          ),
        }}
      />

      {/* Dynamic Admin Control Panel Tab - Visible ONLY to teachers */}
      <Tabs.Screen
        name="admin"
        options={{
          title: 'Admin',
          href: role === 'student' ? null : undefined, 
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'shield-checkmark' : 'shield-checkmark-outline'}
              color={color}
              size={22}
            />
          ),
        }}
      />
    </Tabs>
  );
}
