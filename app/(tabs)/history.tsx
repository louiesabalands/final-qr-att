import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, ActivityIndicator } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS } from '@/constants/colors';
import { supabase } from '@/lib/supabase';

interface SchoolEvent {
  id: string;
  event_code: string;
  title: string;
  start_time: string;
}

export default function HistoryScreen() {
  const [events, setEvents] = useState<SchoolEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('id, event_code, title, start_time')
          .order('start_time', { ascending: false });

        if (error) throw error;
        if (data) setEvents(data);
      } catch (err) {
        console.error('Error fetching history records:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.viewTitle}>Attendance Logs</Text>
        
        {events.length === 0 ? (
          <View style={styles.emptyViewCard}>
            <View style={styles.iconWrapper}>
              <Ionicons name="calendar-outline" size={48} color={COLORS.secondary} />
            </View>
            <Text style={styles.title}>Attendance History</Text>
            <Text style={styles.subtitle}>Track created event check-ins</Text>
            <View style={styles.infoWidget}>
              <Text style={styles.infoText}>No events yet. Create an event from the Teacher tab.</Text>
            </View>
          </View>
        ) : (
          <View style={styles.listContainer}>
            {events.map((event) => (
              <View key={event.id} style={styles.eventItemCard}>
                <View style={styles.eventIconIndicator}>
                  <Ionicons name="bookmark" size={20} color={COLORS.primary} />
                </View>
                <View style={styles.eventDetails}>
                  <Text style={styles.eventCardTitle}>{event.title || 'Untitled Event'}</Text>
                  <Text style={styles.eventCardSubtitle}>Code: {event.event_code}</Text>
                  <Text style={styles.eventCardDate}>
                    {new Date(event.start_time).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
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
    width: '100%',
  },
  viewTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.textMain,
    marginBottom: 20,
  },
  emptyViewCard: {
    width: '100%',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
  },
  iconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(74, 169, 219, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textMain,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginBottom: 24,
  },
  infoWidget: {
    backgroundColor: COLORS.surfaceSunken,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  infoText: {
    color: COLORS.textMuted,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
  listContainer: {
    gap: 14,
  },
  eventItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: 16,
  },
  eventIconIndicator: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.primaryGlow,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  eventDetails: {
    flex: 1,
  },
  eventCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textMain,
  },
  eventCardSubtitle: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  eventCardDate: {
    fontSize: 11,
    color: COLORS.secondary,
    fontWeight: '600',
    marginTop: 6,
  },
});
