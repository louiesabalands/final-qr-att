import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useGlobalTheme } from '@/lib/theme'; // Fixed import path symbol
import { signOut } from '@/lib/auth';   // Fixed import path symbol

export default function AwaitingApprovalScreen() {
  const { darkMode } = useGlobalTheme();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.replace('/login');
  };

  return (
    <View style={[styles.container, darkMode ? styles.darkContainer : styles.lightContainer]}>
      <Ionicons 
        name="time-outline" 
        size={80} 
        color={darkMode ? '#47b0da' : '#0288d1'} 
        style={styles.icon} 
      />
      
      <Text style={[styles.title, darkMode ? styles.darkMainText : styles.lightMainText]}>
        Account Pending Approval
      </Text>
      
      <Text style={[styles.subtitle, darkMode ? styles.darkSubText : styles.lightSubText]}>
        Your registration was successful! However, your account must be verified by a teacher before you can log in. Please check back shortly.
      </Text>

      <Pressable 
        style={styles.logoutButton} 
        onPress={handleSignOut}
      >
        <Text style={styles.logoutButtonText}>Back to Sign In</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  lightContainer: {
    backgroundColor: '#fff',
  },
  darkContainer: {
    backgroundColor: '#121212',
  },
  icon: {
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  lightMainText: {
    color: '#333',
  },
  darkMainText: {
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  lightSubText: {
    color: '#666',
  },
  darkSubText: {
    color: '#aaa',
  },
  logoutButton: {
    backgroundColor: '#ff4d4f',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: '100%',
    maxWidth: 200,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
