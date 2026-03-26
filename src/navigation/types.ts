import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
    Onboarding: undefined;
    MainTabs: NavigatorScreenParams<MainTabParamList>;
    // Global Modals or full screens
    AddExpenseModal: undefined;
    AddReminderModal: undefined;
    AddMealModal: undefined;
    AddVoiceNoteModal: undefined;
};

export type MainTabParamList = {
    HomeTab: NavigatorScreenParams<HomeStackParamList>;
    FinanceTab: NavigatorScreenParams<FinanceStackParamList>;
    RemindersTab: NavigatorScreenParams<RemindersStackParamList>;
    HealthTab: NavigatorScreenParams<HealthStackParamList>;
    MoreTab: NavigatorScreenParams<MoreStackParamList>;
};

export type HomeStackParamList = {
    HomeDashboard: undefined;
};

export type FinanceStackParamList = {
    FinanceHome: undefined;
    TransactionHistory: undefined;
    BudgetPlanner: undefined;
};

export type RemindersStackParamList = {
    RemindersHome: undefined;
    TaskDetail: { taskId: string };
};

export type HealthStackParamList = {
    HealthDashboard: undefined;
    WaterTracker: undefined;
    SleepLog: undefined;
    ActivityLog: undefined;
};

export type MoreStackParamList = {
    MoreMenu: undefined;
    VoiceNotesHome: undefined;
    OutfitHome: undefined;
    AttendanceHome: undefined;
    DietHome: undefined;
    Settings: undefined;
    Profile: undefined;
};
