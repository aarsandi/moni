import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Sreens
import History from '../historyScreen/History';
import HistoryPengeluaran from '../historyScreen/HistoryPengeluaran';
import HistoryDompet from '../historyScreen/HistoryDompet';
import HistoryDompetCash from '../historyScreen/HistoryDompetCash';
import HistoryTabungan from '../historyScreen/HistoryTabungan';
import HistoryLoan from '../historyScreen/HistoryLoan';

export default function FinanceScreenNavigator() {
    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator initialRouteName="History" screenOptions={{
            headerTintColor: 'white',
            headerStyle: {
                backgroundColor: '#14213d'
            }
        }}>
            <Stack.Screen name="History" component={History} options={{ title: 'History' }}  />
            <Stack.Screen name="HistoryPengeluaran" component={HistoryPengeluaran} options={{ title: 'History Pengeluaran' }}  />
            <Stack.Screen name="HistoryDompet" component={HistoryDompet} options={{ title: 'History Dompet' }}  />
            <Stack.Screen name="HistoryDompetCash" component={HistoryDompetCash} options={{ title: 'History Dompet Cash' }}  />
            <Stack.Screen name="HistoryTabungan" component={HistoryTabungan} options={{ title: 'History Tabungan' }}  />
            <Stack.Screen name="HistoryLoan" component={HistoryLoan} options={{ title: 'History Loan' }}  />
        </Stack.Navigator>
    )
}
