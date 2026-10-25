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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { supabase } from '@/lib/supabase';
import { signUp } from '@/lib/auth';
import { COLORS } from '@/constants/colors';

export default function RegisterScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'student' | 'teacher'>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setError(null);

    if (!fullName.trim() || !email.trim() || !password || !confirmPassword) {
      setError('All fields are required.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

        try {
      // 1. Fire the core sign up sequence
      const { data, error: authError } = await signUp(
        email.trim(),
        password,
        {
          full_name: fullName.trim(),
          role,
        }
      );

      if (authError) {
        setError(authError.message);
      } else if (data?.user) {
        // 2. SUCCESS PATH: Bypassed verification database insertions completely
        setSuccess(true);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }

  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
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
              
              <View style={styles.brandWrapper}>
                <View style={styles.iconGlowingCircle}>
                  <Ionicons name="school" size={38} color="#a855f7" />
                </View>
                <Text style={styles.mainTitle}>QR Attendance</Text>
              </View>

              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>Register to start recording attendance</Text>

              {success ? (
                <View style={styles.successContainer}>
                  <Ionicons name="checkmark-circle-outline" size={64} color="#52c41a" style={{ marginBottom: 12 }} />
                  <Text style={styles.successTitle}>Registration Successful!</Text>
                  <Text style={styles.successText}>
                    Your account has been created and auto-approved. You can now proceed to login.
                  </Text>
                  <Link href="/login" asChild>
                    <Pressable style={styles.primaryBtn}>
                      <Text style={styles.primaryBtnText}>Back to Sign In</Text>
                    </Pressable>
                  </Link>
                </View>
              ) : (
                <View style={styles.form}>
                  <Text style={styles.label}>Full Name</Text>
                  <TextInput
                    style={styles.input}
                    value={fullName}
                    onChangeText={setFullName}
                    placeholder="Enter your full name"
                    placeholderTextColor="rgba(255, 255, 255, 0.3)"
                    autoCapitalize="words"
                    editable={!loading}
                  />

                  <Text style={styles.label}>I am a...</Text>
                  <View style={styles.roleRow}>
                    <Pressable
                      style={[styles.roleChip, role === 'student' && styles.roleChipActive]}
                      onPress={() => setRole('student')}
                      disabled={loading}
                    >
                      <Text style={[styles.roleChipText, role === 'student' && styles.roleChipTextActive]}>
                        Student
                      </Text>
                    </Pressable>

                    <Pressable
                      style={[styles.roleChip, role === 'teacher' && styles.roleChipActive]}
                      onPress={() => setRole('teacher')}
                      disabled={loading}
                    >
                      <Text style={[styles.roleChipText, role === 'teacher' && styles.roleChipTextActive]}>
                        Teacher
                      </Text>
                    </Pressable>
                  </View>

                  <Text style={styles.label}>Email Address</Text>
                  <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="your.email@school.edu"
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
                    placeholder="At least 6 characters"
                    placeholderTextColor="rgba(255, 255, 255, 0.3)"
                    secureTextEntry
                    autoCapitalize="none"
                    editable={!loading}
                  />

                  <Text style={styles.label}>Confirm Password</Text>
                  <TextInput
                    style={styles.input}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="Re-enter your password"
                    placeholderTextColor="rgba(255, 255, 255, 0.3)"
                    secureTextEntry
                    autoCapitalize="none"
                    editable={!loading}
                  />

                  {error && <Text style={styles.errorText}>{error}</Text>}

                  {loading ? (
                    <ActivityIndicator size="large" color="#a855f7" style={styles.loader} />
                  ) : (
                    <Pressable
                      style={({ pressed }) => [styles.primaryBtn, pressed && styles.btnPressed]}
                      onPress={handleRegister}
                    >
                      <Ionicons name="person-add-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
                      <Text style={styles.primaryBtnText}>Sign Up</Text>
                    </Pressable>
                  )}
                </View>
              )}

              {!success && (
                <View style={styles.footerRow}>
                  <Text style={styles.footerText}>Already have an account? </Text>
                  <Link href="/login" asChild>
                    <Pressable>
                      <Text style={styles.linkText}>Sign In</Text>
                    </Pressable>
                  </Link>
                </View>
              )}

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
    width: '100%',
  },
  glassCard: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 24,
    padding: 32,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  brandWrapper: {
    alignItems: 'center',
    marginBottom: 20,
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
    color: '#fff',
    letterSpacing: -0.5,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 24,
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
color: '#fff',
fontSize: 16,
},
roleRow: {
flexDirection: 'row',
gap: 12,
marginTop: 4,
},
roleChip: {
flex: 1,
paddingVertical: 12,
borderRadius: 12,
borderWidth: 1,
borderColor: 'rgba(255, 255, 255, 0.12)',
alignItems: 'center',
backgroundColor: 'rgba(15, 23, 42, 0.4)',
},
roleChipActive: {
backgroundColor: 'rgba(168, 85, 247, 0.15)',
borderColor: '#a855f7',
},
roleChipText: {
fontSize: 15,
color: '#94a3b8',
fontWeight: '600',
},
roleChipTextActive: {
color: '#fff',
fontWeight: '700',
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
marginTop: 8,
width: '100%',
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
successContainer: {
alignItems: 'center',
paddingVertical: 12,
width: '100%',
},
successTitle: {
fontSize: 20,
fontWeight: '700',
color: '#fff',
marginBottom: 8,
},
successText: {
fontSize: 14,
color: '#94a3b8',
textAlign: 'center',
lineHeight: 20,
marginBottom: 24,
},
});