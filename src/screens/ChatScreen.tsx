import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';

import Button from '../components/Button';
import Input from '../components/Input';
import { colors, typography, spacing, borderRadius, shadows } from '../styles/theme';

interface Message {
  id: string;
  text: string;
  fromUser: boolean;
  timestamp: Date;
}

const ChatScreen: React.FC = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! How can we help you today?',
      fromUser: false,
      timestamp: new Date(),
    },
  ]);

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: message,
        fromUser: true,
        timestamp: new Date(),
      };

      setMessages([...messages, newMessage]);
      setMessage('');

      // Mock auto-reply
      setTimeout(() => {
        const autoReply: Message = {
          id: (Date.now() + 1).toString(),
          text: 'Thanks for your message! Our team will get back to you shortly. For urgent matters, please call us at 0800 123 4567.',
          fromUser: false,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, autoReply]);
      }, 1000);
    }
  };

  const handleQuickAction = (action: string) => {
    Alert.alert(
      'Quick Action',
      `This would handle: ${action}`,
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>💬 Support Chat</Text>
        <Text style={styles.subtitle}>We're here to help</Text>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => handleQuickAction('Book Service')}
          >
            <Text style={styles.quickActionText}>📅 Book Service</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => handleQuickAction('Check Tyres')}
          >
            <Text style={styles.quickActionText}>🏎️ Check Balance</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => handleQuickAction('Find Location')}
          >
            <Text style={styles.quickActionText}>📍 Find Us</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Messages */}
      <ScrollView style={styles.messagesContainer} showsVerticalScrollIndicator={false}>
        {messages.map((msg) => (
          <View
            key={msg.id}
            style={[
              styles.messageWrapper,
              msg.fromUser ? styles.userMessageWrapper : styles.systemMessageWrapper
            ]}
          >
            <View
              style={[
                styles.messageBubble,
                msg.fromUser ? styles.userMessage : styles.systemMessage
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  msg.fromUser ? styles.userMessageText : styles.systemMessageText
                ]}
              >
                {msg.text}
              </Text>
              <Text
                style={[
                  styles.timestamp,
                  msg.fromUser ? styles.userTimestamp : styles.systemTimestamp
                ]}
              >
                {msg.timestamp.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <View style={styles.inputRow}>
          <View style={styles.inputWrapper}>
            <Input
              placeholder="Type your message..."
              value={message}
              onChangeText={setMessage}
              multiline
            />
          </View>
          <Button
            title="Send"
            onPress={handleSendMessage}
            variant="primary"
            style={styles.sendButton}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  header: {
    backgroundColor: colors.primary,
    paddingTop: 20,
    paddingBottom: 32,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
  },
  title: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.white,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: typography.fontSize.lg,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  quickActions: {
    backgroundColor: colors.white,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  quickActionButton: {
    backgroundColor: colors.backgroundTertiary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    marginHorizontal: spacing.xs,
  },
  quickActionText: {
    fontSize: typography.fontSize.sm,
    color: colors.primary,
    fontWeight: typography.fontWeight.medium,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  messageWrapper: {
    marginBottom: spacing.md,
  },
  userMessageWrapper: {
    alignItems: 'flex-end',
  },
  systemMessageWrapper: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  userMessage: {
    backgroundColor: colors.primary,
  },
  systemMessage: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  messageText: {
    fontSize: typography.fontSize.base,
    marginBottom: spacing.xs,
  },
  userMessageText: {
    color: colors.white,
  },
  systemMessageText: {
    color: colors.textPrimary,
  },
  timestamp: {
    fontSize: typography.fontSize.xs,
  },
  userTimestamp: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  systemTimestamp: {
    color: colors.textTertiary,
  },
  inputContainer: {
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  inputWrapper: {
    flex: 1,
    marginRight: spacing.sm,
  },
  sendButton: {
    paddingHorizontal: spacing.lg,
  },
});

export default ChatScreen;