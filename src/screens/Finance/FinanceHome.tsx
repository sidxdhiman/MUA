import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { AppText } from '../../components/AppText';
import { Screen } from '../../components/Screen';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { useFinanceStore } from '../../store/useFinanceStore';
import { colors, spacing, radius } from '../../theme';
import { ArrowUpCircle, ArrowDownCircle, Trash2, Calendar, Map } from 'lucide-react-native';

export default function FinanceHome() {
    const { transactions, addTransaction, removeTransaction } = useFinanceStore();
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [type, setType] = useState<'income' | 'expense'>('expense');

    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [modalData, setModalData] = useState<any>(null);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const handleAdd = () => {
        if (!title || !amount || isNaN(Number(amount))) return;
        addTransaction({ title, amount: Number(amount), type, date: new Date().toISOString(), category: 'General' });
        setTitle(''); setAmount('');
    };

    const monthlyTransactions = transactions.filter(t => new Date(t.date).getMonth() === currentMonth);
    const income = monthlyTransactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const expense = monthlyTransactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    const balance = income - expense;

    const shiftMonth = (dir: number) => {
        let m = currentMonth + dir;
        if (m < 0) m = 11;
        if (m > 11) m = 0;
        setCurrentMonth(m);
    };

    const heatmapDays = Array.from({ length: 31 }).map((_, i) => {
        let count = 0;
        let daySpent = 0;
        monthlyTransactions.forEach(t => {
            if (new Date(t.date).getDate() === i + 1 && t.type === 'expense') {
                count++;
                daySpent += t.amount;
            }
        });
        return { day: i + 1, spend: daySpent, count };
    });

    return (
        <Screen>
            <View style={[styles.headerArea, { backgroundColor: colors.finance }]}>
                <AppText variant="h2" color={colors.textInverse}>Money</AppText>

                <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: spacing.l }}>
                    <TouchableOpacity onPress={() => shiftMonth(-1)} style={styles.monthBtn}><AppText color="#fff">{"<"}</AppText></TouchableOpacity>
                    <AppText color="#fff" variant="title" style={{ marginHorizontal: spacing.l }}>{monthNames[currentMonth]} {new Date().getFullYear()}</AppText>
                    <TouchableOpacity onPress={() => shiftMonth(1)} style={styles.monthBtn}><AppText color="#fff">{">"}</AppText></TouchableOpacity>
                </View>

                <View style={styles.balanceCard}>
                    <AppText variant="caption" color={colors.textInverse} style={{ opacity: 0.8 }}>MONTH'S NET</AppText>
                    <AppText variant="h1" color={colors.textInverse}>₹{balance.toFixed(2)}</AppText>
                    <View style={styles.statsRow}>
                        <View style={styles.statBox}>
                            <ArrowUpCircle color={colors.success} size={16} />
                            <AppText color={colors.textInverse} style={styles.statVal}>₹{income.toFixed(2)}</AppText>
                        </View>
                        <View style={styles.statBox}>
                            <ArrowDownCircle color={colors.error} size={16} />
                            <AppText color={colors.textInverse} style={styles.statVal}>₹{expense.toFixed(2)}</AppText>
                        </View>
                    </View>
                </View>
            </View>

            <ScrollView style={styles.contentArea} contentContainerStyle={{ padding: spacing.m, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
                <View style={styles.formContainer}>
                    <AppText variant="title" style={{ marginBottom: spacing.s }}>Quick Add</AppText>
                    <Input placeholder="E.g. Coffee" value={title} onChangeText={setTitle} />
                    <Input placeholder="Amount" value={amount} onChangeText={setAmount} keyboardType="numeric" />
                    <View style={styles.typeSelector}>
                        <View style={{ flex: 1, marginRight: spacing.xs }}>
                            <Button title="Expense" variant={type === 'expense' ? 'primary' : 'outline'} onPress={() => setType('expense')} />
                        </View>
                        <View style={{ flex: 1, marginLeft: spacing.xs }}>
                            <Button title="Income" variant={type === 'income' ? 'primary' : 'outline'} onPress={() => setType('income')} />
                        </View>
                    </View>
                    <Button title="Save Transaction" onPress={handleAdd} />
                </View>

                <AppText variant="title" style={{ marginBottom: spacing.m }}>Expense Frequency Heatmap</AppText>
                <View style={styles.heatmapGrid}>
                    {heatmapDays.map(d => (
                        <TouchableOpacity
                            key={d.day}
                            onPress={() => setModalData(d)}
                            style={[
                                styles.heatCell,
                                { backgroundColor: d.spend === 0 ? colors.border : Object.assign(colors.finance, { opacity: Math.min(d.spend / 100, 1) }) }
                            ]}
                        >
                            <AppText style={{ fontSize: 8, color: d.spend > 0 ? '#fff' : '#000' }}>{d.day}</AppText>
                        </TouchableOpacity>
                    ))}
                </View>

                <AppText variant="title" style={{ marginTop: spacing.l, marginBottom: spacing.m }}>Recent in {monthNames[currentMonth]}</AppText>
                {monthlyTransactions.length === 0 ? (
                    <AppText color={colors.textLight} style={{ textAlign: 'center', marginTop: spacing.xl }}>No transactions found for this month.</AppText>
                ) : (
                    monthlyTransactions.map(t => (
                        <View key={t.id} style={styles.transactionCard}>
                            <View style={styles.transactionIconBg}>
                                {t.type === 'income' ? <ArrowUpCircle color={colors.success} size={24} /> : <ArrowDownCircle color={colors.error} size={24} />}
                            </View>
                            <View style={{ flex: 1 }}>
                                <AppText variant="body">{t.title}</AppText>
                                <AppText variant="caption" color={colors.textSecondary}>{new Date(t.date).toLocaleDateString()}</AppText>
                            </View>
                            <AppText variant="title" color={t.type === 'income' ? colors.success : colors.text}>
                                {t.type === 'income' ? '+' : '-'}₹{t.amount.toFixed(2)}
                            </AppText>
                            <TouchableOpacity onPress={() => removeTransaction(t.id)} style={{ marginLeft: spacing.s }}>
                                <Trash2 color={colors.textLight} size={18} />
                            </TouchableOpacity>
                        </View>
                    ))
                )}
            </ScrollView>

            {modalData && (
                <Modal transparent visible={!!modalData} animationType="fade">
                    <View style={styles.modalBg}>
                        <View style={styles.modalCard}>
                            <AppText variant="title" style={{ marginBottom: spacing.m }}>{monthNames[currentMonth]} {modalData.day}</AppText>
                            <AppText>Total Spend: ₹{modalData.spend}</AppText>
                            <AppText>Transactions: {modalData.count} items</AppText>
                            <View style={{ marginTop: spacing.l }}>
                                <Button title="Close" onPress={() => setModalData(null)} />
                            </View>
                        </View>
                    </View>
                </Modal>
            )}
        </Screen>
    );
}

const styles = StyleSheet.create({
    headerArea: { padding: spacing.xl, paddingBottom: spacing.xl },
    monthBtn: { padding: 4, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 4 },
    balanceCard: { alignItems: 'center', marginTop: spacing.m },
    statsRow: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.m, gap: spacing.l },
    statBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: spacing.s, paddingVertical: 4, borderRadius: radius.s },
    statVal: { marginLeft: spacing.xs, fontWeight: 'bold' },
    contentArea: { flex: 1, backgroundColor: colors.background, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl },
    formContainer: { backgroundColor: colors.card, padding: spacing.m, borderRadius: radius.l, marginBottom: spacing.l },
    typeSelector: { flexDirection: 'row', marginBottom: spacing.m },
    transactionCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, padding: spacing.m, borderRadius: radius.m, marginBottom: spacing.s },
    transactionIconBg: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center', marginRight: spacing.m },
    heatmapGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
    heatCell: { width: 34, height: 34, borderRadius: radius.round, justifyContent: 'center', alignItems: 'center' },
    modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
    modalCard: { width: 300, backgroundColor: colors.card, padding: spacing.xl, borderRadius: radius.l }
});
