import React, { useState, useEffect } from "react";
import {
    Award,
    CreditCard,
    CheckCircle,
    Clock,
    TrendingUp,
    TrendingDown,
    Building2,
    DollarSign,
    Target,
    Shield,
} from "lucide-react";
import Sidebar from './Sidebar';
import useAuthStore from '../store/useAuthStore';

const CreditPage = () => {
    const { user } = useAuthStore();
    const [activeTab, setActiveTab] = useState("dashboard");
    const [creditScore, setCreditScore] = useState(680);
    const [previousScore, setPreviousScore] = useState(680);
    const [creditHistory, setCreditHistory] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [inquiries, setInquiries] = useState([]);

    // Credit Factors
    const [creditFactors, setCreditFactors] = useState({
        paymentHistory: { score: 35, current: 78, status: "Good" },
        creditUtilization: { score: 30, current: 45, status: "Fair" },
        creditLength: { score: 15, current: 60, status: "Good" },
        creditMix: { score: 10, current: 85, status: "Excellent" },
        newCredit: { score: 10, current: 70, status: "Good" },
    });

    // Mock Credit Accounts
    useEffect(() => {
        setAccounts([
            {
                id: 1,
                type: "Credit Card",
                provider: "Bank A",
                accountNumber: "****4567",
                creditLimit: 200000,
                currentBalance: 45000,
                minimumDue: 4500,
                dueDate: "2025-01-05",
                status: "Active",
                openDate: "2021-03-15",
                paymentStatus: "Current",
            },
            {
                id: 2,
                type: "Credit Card",
                provider: "Bank B",
                accountNumber: "****8901",
                creditLimit: 150000,
                currentBalance: 28000,
                minimumDue: 2800,
                dueDate: "2025-01-10",
                status: "Active",
                openDate: "2020-08-22",
                paymentStatus: "Current",
            },
            {
                id: 3,
                type: "Personal Loan",
                provider: "Bank C",
                accountNumber: "****2345",
                originalAmount: 500000,
                currentBalance: 180000,
                emiAmount: 12500,
                dueDate: "2025-01-01",
                status: "Active",
                openDate: "2023-06-10",
                paymentStatus: "Current",
            },
        ]);

        // Mock Credit Inquiries
        setInquiries([
            {
                date: "2024-11-15",
                type: "Hard Inquiry",
                provider: "Bank D",
                product: "Home Loan",
                impact: "-3",
            },
            {
                date: "2024-09-22",
                type: "Soft Inquiry",
                provider: "Financial Services A",
                product: "Personal Loan",
                impact: "0",
            },
            {
                date: "2024-07-10",
                type: "Hard Inquiry",
                provider: "Bank A",
                product: "Credit Card",
                impact: "-5",
            },
        ]);
    }, []);

    const getCreditScoreLabel = (score) => {
        if (score >= 750) return "Excellent";
        if (score >= 650) return "Good";
        if (score >= 550) return "Fair";
        return "Poor";
    };

    const getCreditScoreBg = (score) => {
        // Keeping simple solid backgrounds
        if (score >= 750) return "bg-green-800";
        return "bg-green-800"; // Consistently usage of primary brand color for main card
    };

    const getTotalCreditUtilization = () => {
        const creditCards = accounts.filter((acc) => acc.type === "Credit Card");
        const totalLimit = creditCards.reduce(
            (sum, card) => sum + card.creditLimit,
            0
        );
        const totalBalance = creditCards.reduce(
            (sum, card) => sum + card.currentBalance,
            0
        );
        return totalLimit > 0 ? Math.round((totalBalance / totalLimit) * 100) : 0;
    };

    const addCreditActivity = (type, description, impact) => {
        const activity = {
            id: Date.now(),
            type,
            description,
            impact,
            date: new Date().toLocaleDateString(),
            timestamp: Date.now(),
        };
        setCreditHistory((prev) => [activity, ...prev].slice(0, 10));
    };

    // Simulation Functions
    const makePayment = (accountId, amount, onTime = true) => {
        const account = accounts.find((acc) => acc.id === accountId);
        if (!account) return;

        setAccounts((prev) =>
            prev.map((acc) =>
                acc.id === accountId
                    ? { ...acc, currentBalance: Math.max(0, acc.currentBalance - amount) }
                    : acc
            )
        );

        const scoreChange = onTime ? 5 : -15;
        setPreviousScore(creditScore);
        setCreditScore((prev) => Math.max(300, Math.min(850, prev + scoreChange)));

        addCreditActivity(
            onTime ? "On-time Payment" : "Late Payment",
            `${onTime ? "Paid" : "Late payment for"} ${account.provider} ${account.type
            } - ₹${amount.toLocaleString()}`,
            scoreChange
        );

        setCreditFactors((prev) => ({
            ...prev,
            paymentHistory: {
                ...prev.paymentHistory,
                current: onTime
                    ? Math.min(100, prev.paymentHistory.current + 2)
                    : Math.max(0, prev.paymentHistory.current - 5),
            },
        }));
    };

    const simulateNewCreditApplication = (provider, product, approved = true) => {
        const inquiry = {
            date: new Date().toLocaleDateString(),
            type: "Hard Inquiry",
            provider,
            product,
            impact: approved ? "-2" : "-5",
        };

        setInquiries((prev) => [inquiry, ...prev]);

        const scoreChange = approved ? -2 : -5;
        setPreviousScore(creditScore);
        setCreditScore((prev) => Math.max(300, prev + scoreChange));

        addCreditActivity(
            "Credit Application",
            `Applied for ${product} at ${provider} - ${approved ? "Approved" : "Rejected"
            }`,
            scoreChange
        );

        if (approved) {
            const newAccount = {
                id: accounts.length + 1,
                type: product,
                provider,
                accountNumber: "****" + Math.floor(1000 + Math.random() * 9000),
                creditLimit: product.includes("Card") ? 100000 : 300000,
                currentBalance: 0,
                minimumDue: 0,
                dueDate: new Date(
                    Date.now() + 30 * 24 * 60 * 60 * 1000
                ).toLocaleDateString(),
                status: "Active",
                openDate: new Date().toLocaleDateString(),
                paymentStatus: "Current",
            };
            setAccounts((prev) => [...prev, newAccount]);
        }
    };

    const improveUtilization = () => {
        const creditCards = accounts.filter((acc) => acc.type === "Credit Card");
        if (creditCards.length === 0) return;

        setAccounts((prev) =>
            prev.map((acc) =>
                acc.type === "Credit Card"
                    ? { ...acc, currentBalance: Math.max(0, acc.currentBalance * 0.7) }
                    : acc
            )
        );

        setPreviousScore(creditScore);
        setCreditScore((prev) => Math.min(850, prev + 15));

        addCreditActivity(
            "Improved Credit Utilization",
            "Paid down credit card balances, reducing utilization ratio",
            15
        );

        setCreditFactors((prev) => ({
            ...prev,
            creditUtilization: {
                ...prev.creditUtilization,
                current: Math.min(100, prev.creditUtilization.current + 10),
            },
        }));
    };

    // Dashboard Component
    const Dashboard = () => (
        <div className="space-y-6">
            {/* Credit Score Overview */}
            <div className="bg-green-800 rounded-[32px] shadow-lg border border-orange-200 overflow-hidden text-white transition-all duration-300">
                <div className="p-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-3xl font-bold mb-2 text-white">Credit Score</h2>
                            <div className="flex items-center space-x-4">
                                <div className="text-6xl font-bold text-white">{creditScore}</div>
                                <div>
                                    <div className="text-xl font-semibold text-orange-200">
                                        {getCreditScoreLabel(creditScore)}
                                    </div>
                                    <div className="flex items-center space-x-2 text-sm opacity-80 text-white">
                                        {creditScore > previousScore ? (
                                            <TrendingUp className="w-4 h-4" />
                                        ) : creditScore < previousScore ? (
                                            <TrendingDown className="w-4 h-4" />
                                        ) : null}
                                        <span>
                                            {creditScore !== previousScore &&
                                                `${creditScore > previousScore ? "+" : ""}${creditScore - previousScore
                                                } from last update`}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="text-right bg-orange-200/10 p-4 rounded-full">
                            <Award className="w-12 h-12 text-orange-200" />
                        </div>
                    </div>
                </div>

                {/* Score Range Indicator */}
                <div className="p-6 bg-green-900">
                    <div className="relative">
                        <div className="flex justify-between text-xs text-orange-200/70 mb-2 uppercase tracking-wider font-semibold">
                            <span>Too Poor</span>
                            <span>Poor</span>
                            <span>Fair</span>
                            <span>Good</span>
                            <span>Excellent</span>
                        </div>
                        <div className="w-full bg-orange-200/20 rounded-full h-2 overflow-hidden">
                            <div className="flex h-full w-full">
                                {/* Using opacity to distinguish ranges instead of rainbow colors */}
                                <div className="bg-white/20 flex-1"></div>
                                <div className="bg-white/40 flex-1"></div>
                                <div className="bg-white/60 flex-1"></div>
                                <div className="bg-white/80 flex-1"></div>
                                <div className="bg-orange-200 flex-1"></div>
                            </div>
                        </div>
                        <div
                            className="absolute top-0 w-1 h-2 bg-white"
                            style={{ left: `${((creditScore - 300) / 550) * 100}%`, top: '1.5rem' }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-[24px] shadow-sm border border-orange-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-green-800/60">
                                Utilization
                            </p>
                            <p className="text-2xl font-bold text-green-800 mt-1">
                                {getTotalCreditUtilization()}%
                            </p>
                            <p className="text-xs text-green-800/50 mt-1">
                                Keep below 30%
                            </p>
                        </div>
                        <div className="bg-orange-100 p-3 rounded-full">
                            <CreditCard className="w-5 h-5 text-green-800" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-[24px] shadow-sm border border-orange-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-green-800/60">
                                Active Accounts
                            </p>
                            <p className="text-2xl font-bold text-green-800 mt-1">
                                {accounts.length}
                            </p>
                            <p className="text-xs text-green-800/50 mt-1">
                                Total accounts
                            </p>
                        </div>
                        <div className="bg-orange-100 p-3 rounded-full">
                            <Building2 className="w-5 h-5 text-green-800" />
                        </div>
                    </div>
                </div>

                <div className="bg-orange-100 p-6 rounded-[24px] shadow-sm border border-orange-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-green-800/60">
                                Payment History
                            </p>
                            <p className="text-2xl font-bold text-green-800 mt-1">
                                94%
                            </p>
                            <p className="text-xs text-green-800/50 mt-1">
                                On-time payments
                            </p>
                        </div>
                        <div className="bg-white p-3 rounded-full">
                            <CheckCircle className="w-5 h-5 text-green-800" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-[24px] shadow-sm border border-orange-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-green-800/60">
                                Hard Inquiries
                            </p>
                            <p className="text-2xl font-bold text-green-800 mt-1">
                                {inquiries.filter((inq) => inq.type === "Hard Inquiry").length}
                            </p>
                            <p className="text-xs text-green-800/50 mt-1">
                                Last 12 months
                            </p>
                        </div>
                        <div className="bg-orange-100 p-3 rounded-full">
                            <Target className="w-5 h-5 text-green-800" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Credit Score Factors */}
            <div className="bg-white rounded-[32px] shadow-sm border border-[#E6EFEA]">
                <div className="p-6 border-b border-[#E6EFEA]">
                    <h3 className="text-xl font-bold text-[#1E3A2F]">
                        Credit Score Breakdown
                    </h3>
                    <p className="text-[#1E3A2F]/60 text-sm mt-1">
                        Factors affecting your credit score
                    </p>
                </div>
                <div className="p-6">
                    <div className="space-y-6">
                        {Object.entries(creditFactors).map(([key, factor]) => (
                            <div key={key}>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-bold text-[#1E3A2F] capitalize">
                                        {key
                                            .replace(/([A-Z])/g, " $1")
                                            .replace(/^./, (str) => str.toUpperCase())}
                                    </span>
                                    <div className="flex items-center space-x-2">
                                        <span
                                            className={`px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider ${factor.status === "Excellent" || factor.status === "Good"
                                                ? "bg-[#1E3A2F] text-white"
                                                : "bg-[#E6EFEA] text-[#1E3A2F]"
                                                }`}
                                        >
                                            {factor.status}
                                        </span>
                                        <span className="text-xs text-[#1E3A2F]/60 font-medium">
                                            {factor.score}% of score
                                        </span>
                                    </div>
                                </div>
                                <div className="w-full bg-[#E6EFEA] rounded-full h-2">
                                    <div
                                        className={`h-2 rounded-full bg-[#1E3A2F]`}
                                        style={{ width: `${factor.current}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                    onClick={() => makePayment(1, 5000, true)}
                    className="bg-[#1E3A2F] text-white p-6 rounded-[24px] text-left hover:scale-[1.02] transition-transform duration-300 shadow-lg shadow-[#1E3A2F]/10"
                >
                    <div className="flex justify-between items-start mb-4">
                        <div className="bg-[#E6EFEA]/20 p-3 rounded-full">
                            <DollarSign className="w-6 h-6 text-[#E6EFEA]" />
                        </div>
                    </div>
                    <div className="font-bold text-lg">Make Payment</div>
                    <div className="text-sm text-[#E6EFEA]/70 mt-1">
                        Pay credit card bill (+5 points)
                    </div>
                </button>

                <button
                    onClick={improveUtilization}
                    className="bg-[#E6EFEA] text-[#1E3A2F] p-6 rounded-[24px] text-left hover:scale-[1.02] transition-transform duration-300 border border-[#CFE3D8]"
                >
                    <div className="flex justify-between items-start mb-4">
                        <div className="bg-white p-3 rounded-full">
                            <TrendingDown className="w-6 h-6 text-[#1E3A2F]" />
                        </div>
                    </div>
                    <div className="font-bold text-lg">Reduce Utilization</div>
                    <div className="text-sm text-[#1E3A2F]/70 mt-1">
                        Pay down balances (+15 points)
                    </div>
                </button>

                <button
                    onClick={() => makePayment(2, 3000, false)}
                    className="bg-white text-[#1E3A2F] p-6 rounded-[24px] text-left hover:scale-[1.02] transition-transform duration-300 border border-[#E6EFEA]"
                >
                    <div className="flex justify-between items-start mb-4">
                        <div className="bg-[#E6EFEA] p-3 rounded-full">
                            <Clock className="w-6 h-6 text-[#1E3A2F]" />
                        </div>
                    </div>
                    <div className="font-bold text-lg">Make Late Payment</div>
                    <div className="text-sm text-[#1E3A2F]/70 mt-1">
                        Pay bill 15 days late (-15 points)
                    </div>
                </button>
            </div>

            {/* Recent Activities */}
            <div className="bg-white rounded-[32px] shadow-sm border border-[#E6EFEA]">
                <div className="p-6 border-b border-[#E6EFEA]">
                    <h3 className="text-xl font-bold text-[#1E3A2F]">
                        Recent Activity
                    </h3>
                </div>
                <div className="divide-y divide-[#E6EFEA] max-h-80 overflow-y-auto">
                    {creditHistory.length === 0 ? (
                        <div className="p-8 text-center text-[#1E3A2F]/50">
                            <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <p>No recent activities</p>
                        </div>
                    ) : (
                        creditHistory.map((activity) => (
                            <div
                                key={activity.id}
                                className="p-6 flex items-center justify-between hover:bg-[#FAFAF7] transition-colors"
                            >
                                <div>
                                    <div className="font-bold text-[#1E3A2F]">
                                        {activity.type}
                                    </div>
                                    <div className="text-sm text-[#1E3A2F]/60 mt-0.5">
                                        {activity.description}
                                    </div>
                                    <div className="text-[10px] uppercase tracking-wider font-bold text-[#1E3A2F]/40 mt-1">
                                        {activity.date}
                                    </div>
                                </div>
                                <div
                                    className={`font-bold text-lg ${activity.impact >= 0
                                        ? "text-[#1E3A2F]"
                                        : "text-[#1E3A2F]/70"
                                        }`}
                                >
                                    {activity.impact >= 0 ? "+" : ""}
                                    {activity.impact}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );

    // Accounts Component
    const Accounts = () => (
        <div className="space-y-6">
            {/* Account Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#1E3A2F] p-6 rounded-[24px] text-white shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-[#E6EFEA]/70">
                                Total Credit Limit
                            </p>
                            <p className="text-2xl font-bold mt-1">
                                ₹
                                {accounts
                                    .filter((acc) => acc.type === "Credit Card")
                                    .reduce((sum, acc) => sum + acc.creditLimit, 0)
                                    .toLocaleString("en-IN")}
                            </p>
                        </div>
                        <div className="bg-[#E6EFEA]/10 p-3 rounded-full">
                            <CreditCard className="w-6 h-6 text-[#E6EFEA]" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-[24px] border border-[#E6EFEA] text-[#1E3A2F]">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider opacity-60">
                                Total Balance
                            </p>
                            <p className="text-2xl font-bold mt-1">
                                ₹
                                {accounts
                                    .reduce((sum, acc) => sum + acc.currentBalance, 0)
                                    .toLocaleString("en-IN")}
                            </p>
                        </div>
                        <div className="bg-[#E6EFEA] p-3 rounded-full">
                            <DollarSign className="w-6 h-6 text-[#1E3A2F]" />
                        </div>
                    </div>
                </div>

                <div className="bg-[#E6EFEA] p-6 rounded-[24px] border border-[#CFE3D8] text-[#1E3A2F]">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider opacity-60">
                                Available Credit
                            </p>
                            <p className="text-2xl font-bold mt-1">
                                ₹
                                {accounts
                                    .filter((acc) => acc.type === "Credit Card")
                                    .reduce(
                                        (sum, acc) => sum + (acc.creditLimit - acc.currentBalance),
                                        0
                                    )
                                    .toLocaleString("en-IN")}
                            </p>
                        </div>
                        <div className="bg-white p-3 rounded-full">
                            <Shield className="w-6 h-6 text-[#1E3A2F]" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Accounts Table */}
            <div className="bg-white rounded-[32px] shadow-sm border border-[#E6EFEA] overflow-hidden">
                <div className="p-6 border-b border-[#E6EFEA]">
                    <h3 className="text-xl font-bold text-[#1E3A2F]">
                        Your Accounts
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-[#FAFAF7]">
                            <tr>
                                <th className="px-6 py-4 text-left text-[10px] font-bold text-[#1E3A2F]/50 uppercase tracking-widest">
                                    Account
                                </th>
                                <th className="px-6 py-4 text-left text-[10px] font-bold text-[#1E3A2F]/50 uppercase tracking-widest">
                                    Balance
                                </th>
                                <th className="px-6 py-4 text-left text-[10px] font-bold text-[#1E3A2F]/50 uppercase tracking-widest">
                                    Limit/Amount
                                </th>
                                <th className="px-6 py-4 text-left text-[10px] font-bold text-[#1E3A2F]/50 uppercase tracking-widest">
                                    Utilization
                                </th>
                                <th className="px-6 py-4 text-left text-[10px] font-bold text-[#1E3A2F]/50 uppercase tracking-widest">
                                    Status
                                </th>
                                <th className="px-6 py-4 text-left text-[10px] font-bold text-[#1E3A2F]/50 uppercase tracking-widest">

                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E6EFEA]">
                            {accounts.map((account) => {
                                const utilization =
                                    account.type === "Credit Card"
                                        ? Math.round(
                                            (account.currentBalance / account.creditLimit) * 100
                                        )
                                        : null;

                                return (
                                    <tr
                                        key={account.id}
                                        className="hover:bg-[#FAFAF7] transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div>
                                                <div className="font-bold text-[#1E3A2F]">
                                                    {account.provider}
                                                </div>
                                                <div className="text-xs text-[#1E3A2F]/60 mt-0.5">
                                                    {account.type} • {account.accountNumber}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-[#1E3A2F]">
                                                ₹{account.currentBalance.toLocaleString("en-IN")}
                                            </div>
                                            {account.minimumDue > 0 && (
                                                <div className="text-xs text-[#1E3A2F]/50 mt-0.5">
                                                    Min Due: ₹{account.minimumDue.toLocaleString("en-IN")}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-[#1E3A2F]">
                                                ₹
                                                {(
                                                    account.creditLimit || account.originalAmount
                                                ).toLocaleString("en-IN")}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {utilization !== null ? (
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-bold text-[#1E3A2F] w-8">{utilization}%</span>
                                                    <div className="w-16 bg-[#E6EFEA] rounded-full h-1.5">
                                                        <div
                                                            className="h-1.5 rounded-full bg-[#1E3A2F]"
                                                            style={{
                                                                width: `${Math.min(utilization, 100)}%`,
                                                            }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="text-[#1E3A2F]/30 text-xs">
                                                    N/A
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`px-2 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider ${account.paymentStatus === "Current"
                                                    ? "bg-[#E6EFEA] text-[#1E3A2F]"
                                                    : "bg-[#1E3A2F] text-white"
                                                    }`}
                                            >
                                                {account.paymentStatus}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {account.currentBalance > 0 && (
                                                <button
                                                    onClick={() =>
                                                        makePayment(
                                                            account.id,
                                                            Math.min(
                                                                account.currentBalance,
                                                                account.minimumDue || 5000
                                                            ),
                                                            true
                                                        )
                                                    }
                                                    className="text-xs font-bold text-[#1E3A2F] hover:bg-[#E6EFEA] px-3 py-2 rounded-lg transition-colors"
                                                >
                                                    Pay
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-orange-50/30 text-green-800">
            <Sidebar />
            {/* Main Content Wrapper - Offset by Sidebar width */}
            <div className="md:ml-64 p-8 pt-6 transition-all duration-300">
                <header className="mb-8 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-green-800">Credit Dashboard</h2>
                        <p className="text-green-800/60 text-xs font-bold uppercase tracking-widest mt-1">Monitor and improve your credit health</p>
                    </div>
                </header>

                {/* Tabs to switch */}
                <div className="flex space-x-2 mb-8 bg-white p-1 rounded-2xl w-fit border border-orange-200">
                    <button
                        onClick={() => setActiveTab("dashboard")}
                        className={`px-6 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === "dashboard"
                            ? "bg-green-800 text-green-50 shadow-md"
                            : "text-green-800/60 hover:text-green-800"
                            }`}
                    >
                        Dashboard
                    </button>
                    <button
                        onClick={() => setActiveTab("accounts")}
                        className={`px-6 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === "accounts"
                            ? "bg-green-800 text-green-50 shadow-md"
                            : "text-green-800/60 hover:text-green-800"
                            }`}
                    >
                        Accounts
                    </button>
                </div>

                {/* Render the active section */}
                <main className="grid grid-cols-1 gap-6">
                    {activeTab === "dashboard" && <Dashboard />}
                    {activeTab === "accounts" && <Accounts />}
                </main>
            </div>
        </div>
    );
};

export default CreditPage;
