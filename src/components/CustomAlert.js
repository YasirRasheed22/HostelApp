import React from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { Modal, Portal } from 'react-native-paper';

const AlertModal = ({ visible, onDismiss, message, type = 'success' }) => {
  const isSuccess = type === 'success';

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.modalContainer}
      >
        <View style={styles.modalContent}>
          <Text style={[styles.modalIcon, { color: isSuccess ? '#22c55e' : '#dc2626' }]}>
            {isSuccess ? '✅' : '⚠️'}
          </Text>

          <Text style={styles.modalTitle}>
            {isSuccess ? 'Success' : 'Alert'}
          </Text>

          <Text style={styles.modalMessage}>{message}</Text>

          <TouchableOpacity onPress={onDismiss} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Got it</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </Portal>
  );
};

export default AlertModal;

const styles = StyleSheet.create({
  modalContainer: {
    marginHorizontal: 30,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  modalContent: {
    alignItems: 'center',
  },
  modalIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 22,
  },
  closeButton: {
    backgroundColor: '#75AB38',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
