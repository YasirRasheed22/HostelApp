import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import AntDesign from 'react-native-vector-icons/EvilIcons'

export default function ActiveTenantReport() {
  return (
   <SafeAreaView style={styles.safeArea}>
         <ScrollView contentContainerStyle={styles.container}>
           <View style={styles.titleRow}>
             <Text style={styles.title}>Reports</Text>
             <TouchableOpacity>
               <AntDesign name="addfile" size={28} color="#4E4E5F" />
             </TouchableOpacity>
           </View>
           </ScrollView>
           </SafeAreaView>
  )
}

const styles = StyleSheet.create({
   safeArea: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  container: {
    padding: 24,
  },
   title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
    titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
})