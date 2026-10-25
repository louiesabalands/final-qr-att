import React from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS } from '@/constants/colors';

export default function DashboardScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Welcome Banner Card */}
        <View style={styles.welcomeCard}>
          <View style={styles.avatarGlow}>
            <Ionicons name="person" size={28} color={COLORS.primary} />
          </View>
          <View style={styles.welcomeTextGroup}>
            <Text style={styles.welcomeTitle}>Welcome Back!</Text>
            <Text style={styles.welcomeSubtitle}>Ready to manage attendance?</Text>
          </View>
        </View>

        <Text style={styles.sectionHeader}>Quick Actions</Text>

        {/* Action Options List */}
        <View style={styles.actionsList}>
          <Pressable style={styles.actionItem} onPress={() => router.push('/history')}>
            <Ionicons name="time-outline" size={22} color={COLORS.secondary} style={styles.actionIcon} />
            <Text style={styles.actionText}>Attendance History</Text>
            <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
          </Pressable>

          <Pressable style={styles.actionItem} onPress={() => router.push('/teacher')}>
            <Ionicons name="clipboard-outline" size={22} color={COLORS.primary} style={styles.actionIcon} />
            <Text style={styles.actionText}>Teacher Management</Text>
            <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
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
  },
  welcomeCard: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 20,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarGlow: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: COLORS.primaryGlow,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderColor: 'rgba(168, 85, 247, 0.3)',
    borderWidth: 1,
  },
  welcomeTextGroup: {
    flex: 1,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textMain,
  },
  welcomeSubtitle: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
    paddingLeft: 4,
  },
  actionsList: {
    gap: 12,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 18,
    borderRadius: 16,
  },
  actionIcon: {
    marginRight: 14,
  },
  actionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textMain,
  },
});
