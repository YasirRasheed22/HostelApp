import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { font } from '../components/ThemeStyle'

export default function ProfitAndLossReport() {
  return (
   <SafeAreaView style={styles.safeArea}>
         <ScrollView contentContainerStyle={styles.container}>
           <View style={styles.titleRow}>
             <Text style={styles.title}>Profit And Loss Report</Text>
             <TouchableOpacity>
               <AntDesign name="addfile" size={28} color="#4E4E5F" />
             </TouchableOpacity>
           </View>
          <View style={styles.separator} />
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
    fontSize: 25,
    // fontWeight: 'bold',
    fontFamily:font.secondary,
  },
    titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
   separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginTop: 10,
    marginBottom: 20,
  },
})