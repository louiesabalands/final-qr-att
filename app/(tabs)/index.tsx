import React from 'react';
import { StyleSheet, Text, View, Pressable, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

const { width } = Dimensions.get('window');

export default function EnhancedLandingScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.glassCard}>
        
        {/* Modern App Brand Identity Header */}
        <View style={styles.brandWrapper}>
          <View style={styles.iconGlowingCircle}>
            <Ionicons name="school" size={38} color="#a855f7" />
          </View>
          <Text style={styles.mainTitle}>QR Attendance</Text>
          <Text style={styles.byline}>By: Louie Sabalande</Text>
        </View>

        {/* Informational Context Box Widget */}
        <View style={styles.infoWidget}>
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoTitle}>School Event Attendance</Text>
            <Text style={styles.infoDescription}>
              Scan QR Codes to seamlessly record and keep track of your attendance during institutional activities.
            </Text>
          </View>
        </View>

        {/* Redesigned Button Actions Suite */}
        <View style={styles.actionsContainer}>
          <Pressable 
            style={({ pressed }) => [styles.primaryBtn, pressed && styles.btnPressed]}
            onPress={() => router.push('/login')}
          >
            <Ionicons name="log-in-outline" size={20} color="#fff" style={styles.btnIcon} />
            <Text style={styles.primaryBtnText}>Sign In to Account</Text>
          </Pressable>

          <Pressable 
            style={({ pressed }) => [styles.secondaryBtn, pressed && styles.secondaryBtnPressed]}
            onPress={() => router.push('/register')}
          >
            <Ionicons name="person-add-outline" size={18} color="#e2e8f0" style={styles.btnIcon} />
            <Text style={styles.secondaryBtnText}>Create New Account</Text>
          </Pressable>
        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111026', // Solid premium deep midnight-indigo alternative canvas background
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  glassCard: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: 'rgba(255, 255, 255, 0.06)', 
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)', 
    shadowColor: '#a855f7',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
  },
  brandWrapper: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconGlowingCircle: {
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: 'rgba(168, 85, 247, 0.15)', 
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.3)',
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  byline: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginTop: 6,
  },
  infoWidget: {
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    borderRadius: 16,
    padding: 18,
    marginBottom: 36,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  infoTextContainer: {
    alignItems: 'center',
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#e2e8f0',
    marginBottom: 6,
    textAlign: 'center',
  },
  infoDescription: {
    fontSize: 13,
    color: '#94a3b8',
    lineHeight: 19,
    textAlign: 'center',
  },
  actionsContainer: {
    width: '100%',
    gap: 14,
  },
  primaryBtn: {
    flexDirection: 'row',
    backgroundColor: '#a855f7', 
    paddingVertical: 15,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#a855f7',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  btnPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.985 }], 
  },
  primaryBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  secondaryBtn: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    paddingVertical: 15,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  secondaryBtnPressed: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  secondaryBtnText: {
    color: '#e2e8f0',
    fontSize: 16,
    fontWeight: '600',
  },
  btnIcon: {
    marginRight: 8,
  },
});
