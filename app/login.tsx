import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
  Pressable,
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { signIn } from '@/lib/auth';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError(null);

    if (!email.trim() || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);

    try {
      const { data, error: authError } = await signIn(email.trim(), password);

      if (authError) {
        setError(authError.message);
      } else {
        router.replace('/dashboard');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.glassCard}>
              
              {/* Brand Header */}
              <View style={styles.brandWrapper}>
                <View style={styles.iconGlowingCircle}>
                  <Ionicons name="school" size={38} color="#a855f7" />
                </View>
                <Text style={styles.mainTitle}>QR Attendance</Text>
              </View>

              {/* View Titles */}
              <View style={styles.titleBlock}>
                <Text style={styles.title}>Welcome Back</Text>
                <Text style={styles.subtitle}>Sign in to record your attendance</Text>
              </View>

              {/* Sign In Form */}
              <View style={styles.form}>
                <Text style={styles.label}>Email Address</Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="enter.your@email.com"
                  placeholderTextColor="rgba(255, 255, 255, 0.3)"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  editable={!loading}
                />

                <Text style={styles.label}>Password</Text>
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••"
                  placeholderTextColor="rgba(255, 255, 255, 0.3)"
                  secureTextEntry
                  autoCapitalize="none"
                  editable={!loading}
                />

                {error && <Text style={styles.errorText}>{error}</Text>}

                {loading ? (
                  <ActivityIndicator
                    size="large"
                    color="#a855f7"
                    style={styles.loader}
                  />
                ) : (
                  <Pressable
                    style={({ pressed }) => [styles.primaryBtn, pressed && styles.btnPressed]}
                    onPress={handleLogin}
                  >
                    <Ionicons name="log-in-outline" size={20} color="#fff" style={styles.btnIcon} />
                    <Text style={styles.primaryBtnText}>Sign In</Text>
                  </Pressable>
                )}
              </View>

              {/* Registration Link Anchor */}
              <View style={styles.footerRow}>
                <Text style={styles.footerText}>Don't have an account? </Text>
                <Link href="/register" asChild>
                  <Pressable>
                    <Text style={styles.linkText}>Sign Up</Text>
                  </Pressable>
                </Link>
              </View>

            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111026', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyboardView: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    width: '100%', // Fixed width compile error here
  },
  glassCard: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: 'rgba(255, 255, 255, 0.06)', 
    borderRadius: 24,
    padding: 32,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)', 
    shadowColor: '#a855f7',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
  },
  brandWrapper: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconGlowingCircle: {
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: 'rgba(168, 85, 247, 0.15)', 
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.3)',
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  titleBlock: {
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#94a3b8',
  },
  form: {
    width: '100%',
    gap: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#cbd5e1',
    marginBottom: -8,
  },
  input: {
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    color: '#ffffff',
    fontSize: 16,
  },
  errorText: {
    color: '#ff4d4f',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 4,
  },
  loader: {
    marginVertical: 12,
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
    marginTop: 8,
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
  btnIcon: {
    marginRight: 8,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 28,
  },
  footerText: {
    color: '#94a3b8',
    fontSize: 14,
  },
  linkText: {
    color: '#a855f7',
    fontSize: 14,
    fontWeight: '700',
  },
});
