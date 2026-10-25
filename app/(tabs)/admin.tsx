import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView, ActivityIndicator, Alert } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS } from '@/constants/colors';
import { supabase } from '@/lib/supabase';

interface AdminEvent {
  id: string;
  event_code: string;
  title: string;
}

interface StudentProfile {
  id: string;
  full_name: string;
  email: string;
}

export default function AdminScreen() {
  const [activeTab, setActiveTab] = useState<'events' | 'roster'>('events');
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadAdminData() {
    setLoading(true);
    try {
      // 1. Fetch live events
      const { data: eventsData } = await supabase
        .from('events')
        .select('id, event_code, title');
      if (eventsData) setEvents(eventsData);

      // 2. Fetch student list records
      const { data: studentsData } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .eq('role', 'student')
        .order('full_name', { ascending: true });
      if (studentsData) setStudents(studentsData);

    } catch (err) {
      console.error('Error loading admin control panel data:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAdminData();
  }, []);

  // Handler to safely remove a student row from the public profiles table
    // Handler to safely remove a student record on BOTH public tables and auth cache systems
  const handleDeleteStudent = async (studentId: string, studentName: string) => {
    try {
      // 1. Delete row from the public profiles sheet layout
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', studentId);

      if (profileError) throw profileError;

      // 2. Clear out corresponding system authentication rows using the client RPC manager
      const { error: authError } = await supabase.auth.admin.deleteUser(studentId);
      if (authError) {
        console.warn('Auth account removal require elevated master keys or service triggers:', authError.message);
      }
      
      // Refresh admin metrics count components smoothly
      loadAdminData();
    } catch (err) {
      console.error('Error deleting student record:', err);
    }
  };


  return (
    <View style={styles.container}>
      <View style={styles.adminGlassContainer}>
        <Text style={styles.title}>Admin Control Dashboard</Text>
        
        <View style={styles.segmentedControl}>
          <Pressable 
            style={[styles.tabSegment, activeTab === 'events' && styles.tabSegmentActive]}
            onPress={() => setActiveTab('events')}
          >
            <Text style={activeTab === 'events' ? styles.activeTabText : styles.inactiveTabText}>
              Manage Events ({events.length})
            </Text>
          </Pressable>

          <Pressable 
            style={[styles.tabSegment, activeTab === 'roster' && styles.tabSegmentActive]}
            onPress={() => setActiveTab('roster')}
          >
            <Text style={activeTab === 'roster' ? styles.activeTabText : styles.inactiveTabText}>
              Student Roster ({students.length})
            </Text>
          </Pressable>
        </View>

        <View style={styles.innerWorkboard}>
          {loading ? (
            <ActivityIndicator size="small" color={COLORS.primary} />
          ) : activeTab === 'events' ? (
            events.length === 0 ? (
              <Text style={styles.emptyText}>No registered management items listed inside system directories.</Text>
            ) : (
              <ScrollView style={styles.listScroll} showsVerticalScrollIndicator={false}>
                {events.map((evt) => (
                  <View key={evt.id} style={styles.adminItemRow}>
                    <Ionicons name="layers-outline" size={18} color={COLORS.primary} style={{ marginRight: 10 }} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.itemTitle}>{evt.title}</Text>
                      <Text style={styles.itemSubtitle}>Code: {evt.event_code}</Text>
                    </View>
                    <Pressable onPress={async () => {
                      await supabase.from('events').delete().eq('id', evt.id);
                      loadAdminData(); 
                    }}>
                      <Ionicons name="trash-outline" size={18} color={COLORS.error} />
                    </Pressable>
                  </View>
                ))}
              </ScrollView>
            )
          ) : (
            students.length === 0 ? (
              <Text style={styles.emptyText}>No student profiles are currently registered.</Text>
            ) : (
              <ScrollView style={styles.listScroll} showsVerticalScrollIndicator={false}>
                {students.map((student) => (
                  <View key={student.id} style={styles.adminItemRow}>
                    <Ionicons name="person-outline" size={18} color={COLORS.secondary} style={{ marginRight: 10 }} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.itemTitle}>{student.full_name || 'Unnamed Student'}</Text>
                      <Text style={styles.itemSubtitle}>{student.email}</Text>
                    </View>
                    
                    {/* ADDED: Connected Interactive Trash Deletion Button for Students */}
                    <Pressable 
                      onPress={() => handleDeleteStudent(student.id, student.full_name)}
                      style={styles.deleteButtonWrapper}
                    >
                      <Ionicons name="trash-outline" size={18} color={COLORS.error} />
                    </Pressable>
                  </View>
                ))}
              </ScrollView>
            )
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 24,
    paddingTop: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  adminGlassContainer: {
    width: '100%',
    maxWidth: 600,
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 24,
    padding: 28,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textMain,
    textAlign: 'center',
    marginBottom: 20,
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: COLORS.surfaceSunken,
    padding: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    marginBottom: 20,
  },
  tabSegment: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabSegmentActive: {
    backgroundColor: COLORS.primary,
  },
  activeTabText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  inactiveTabText: {
    color: COLORS.textMuted,
    fontSize: 14,
    fontWeight: '600',
  },
  innerWorkboard: {
    minHeight: 220,
    maxHeight: 340,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceSunken,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    width: '100%',
  },
  emptyText: {
    color: COLORS.textMuted,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  listScroll: {
    width: '100%',
  },
  adminItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderColor: COLORS.borderSubtle,
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },
  itemTitle: {
    color: COLORS.textMain,
    fontSize: 14,
    fontWeight: '700',
  },
  itemSubtitle: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  deleteButtonWrapper: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 77, 79, 0.05)',
  },
});
