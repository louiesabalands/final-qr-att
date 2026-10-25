import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView, Platform, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS } from '@/constants/colors';
import { useAuth, signOut } from '@/lib/auth'; // Ensure these hooks exist in your auth module
import { getProfile, type Profile } from '@/lib/profiles';

export default function ProfileScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingSignOut, setLoadingSignOut] = useState(false);

  // Load active authenticated profile metadata from database hook
  useEffect(() => {
    if (user?.id) {
      getProfile(user.id)
        .then((data) => {
          if (data) setProfile(data);
        })
        .catch((err) => console.error('Error fetching profile logs:', err))
        .finally(() => setLoadingProfile(false));
    } else {
      setLoadingProfile(false);
    }
  }, [user]);

  // ACTIVE INTERACTION HANDLER: Triggers system session clearance
  const handleSignOut = async () => {
    if (loadingSignOut) return;
    setLoadingSignOut(true);
    
    try {
      await signOut(); // Clear auth credentials state from memory / storage
      router.replace('/login'); // Force clean reset navigation to auth tree base path
    } catch (error) {
      console.error('Failed to log out user session:', error);
    } finally {
      setLoadingSignOut(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.profileGlassCard}>
          <Text style={styles.cardHeader}>My Profile</Text>
          <Text style={styles.cardSubtitle}>Manage your account information</Text>

          {loadingProfile ? (
            <ActivityIndicator size="large" color={COLORS.primary} style={styles.loader} />
          ) : (
            <View style={styles.infoGroup}>
              <View style={styles.groupHeaderRow}>
                <Text style={styles.groupTitle}>Account Information</Text>
                <Pressable><Text style={styles.editBtn}>Edit</Text></Pressable>
              </View>

              <View style={styles.roleBadge}>
                <Text style={styles.roleText}>{profile?.role ?? 'Teacher'}</Text>
              </View>

              <Text style={styles.fieldLabel}>FULL NAME</Text>
              <Text style={styles.fieldValue}>{profile?.full_name ?? 'Jomat'}</Text>

              <Text style={styles.fieldLabel}>EMAIL ADDRESS</Text>
              <Text style={styles.fieldValue}>{user?.email ?? 'Jmarhonoridez@gmail.com'}</Text>

              <Text style={styles.fieldLabel}>USER ID IDENTIFIER</Text>
              <Text style={styles.fieldValueCode}>{user?.id ?? '74bcda3e-0012-421f-8ba5-121654aef'}</Text>
            </View>
          )}

          {/* Connected Asynchronous Sign Out Action Trigger Button */}
          <Pressable 
            style={({ pressed }) => [
              styles.signOutBtn, 
              pressed && styles.signOutBtnPressed,
              loadingSignOut && styles.signOutBtnDisabled
            ]} 
            onPress={handleSignOut}
            disabled={loadingSignOut}
          >
            {loadingSignOut ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Ionicons name="log-out-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.signOutText}>Sign Out of System</Text>
              </>
            )}
          </Pressable>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: 24,
    paddingTop: 40,
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
  },
  profileGlassCard: {
    width: '100%',
    maxWidth: 500,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 24,
    padding: 28,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
  },
  cardHeader: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.textMain,
  },
  cardSubtitle: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginBottom: 24,
  },
  infoGroup: {
    backgroundColor: COLORS.surfaceSunken,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    marginBottom: 28,
  },
  groupHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  groupTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textLabel,
  },
  editBtn: {
    color: COLORS.secondary,
    fontWeight: '700',
    fontSize: 14,
  },
  roleBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(74, 169, 219, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.secondary,
    marginBottom: 16,
  },
  roleText: {
    color: COLORS.secondary,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textMuted,
    letterSpacing: 0.5,
    marginTop: 14,
  },
  fieldValue: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textMain,
    marginTop: 2,
  },
  fieldValueCode: {
    fontSize: 13,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: COLORS.textMuted,
    marginTop: 4,
  },
  signOutBtn: {
    flexDirection: 'row',
    backgroundColor: COLORS.error,
    paddingVertical: 14,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  signOutBtnPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
  signOutBtnDisabled: {
    opacity: 0.6,
  },
  signOutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  loader: {
    marginVertical: 40,
  },
});
