import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, AlertCircle, Info } from 'lucide-react';
import { spendingPredictorAgent } from '../utils/aiAgentManager.js';

const SpendingAnalysis = () => {
    const [spendingData, setSpendingData] = useState(null);
    const [analysis, setAnalysis] = useState({
        trends: null,
        categoryChanges: null,
        expenseRanges: null
    });
    const [loading, setLoading] = useState(true);
    const [agentStatus, setAgentStatus] = useState({ enabled: false });

    useEffect(() => {
        const initializeSpendingAnalysis = async () => {
            setLoading(true);
            
            // STEP 1: Generate deterministic spending analysis (REQUIRED FIRST)
            const deterministicData = generateDeterministicSpendingAnalysis();
            setSpendingData(deterministicData);
            
            // STEP 2: Check AI agent status
            try {
                const { getAIAgentSystemStatus } = await import('../utils/aiAgentManager.js');
                const status = getAIAgentSystemStatus();
                setAgentStatus(status);
            } catch (error) {
                console.warn('AI Agent Manager not available:', error);
            }
            
            // STEP 3: Enhance with AI agents (ONLY after deterministic analysis)
            try {
                const [trendsResult, changesResult, rangesResult] = await Promise.all([
                    spendingPredictorAgent.analyzeTrends(
                        deterministicData.deterministicTrends,
                        deterministicData,
                        { confidence: 0.7 }
                    ),
                    spendingPredictorAgent.highlightChanges(
                        deterministicData.deterministicChanges,
                        deterministicData.categories,
                        { confidence: 0.7 }
                    ),
                    spendingPredictorAgent.describeRanges(
                        deterministicData.deterministicRanges,
                        deterministicData.expenses,
                        { confidence: 0.7 }
                    )
                ]);
                
                setAnalysis({
                    trends: trendsResult,
                    categoryChanges: changesResult,
                    expenseRanges: rangesResult
                });
            } catch (error) {
                console.error('AI enhancement failed:', error);
                // System continues with deterministic analysis
                setAnalysis({
                    trends: { content: deterministicData.deterministicTrends.summary, enhanced: false, source: 'deterministic' },
                    categoryChanges: { content: deterministicData.deterministicChanges.summary, enhanced: false, source: 'deterministic' },
                    expenseRanges: { content: deterministicData.deterministicRanges.summary, enhanced: false, source: 'deterministic' }
                });
            }
            
            setLoading(false);
        };

        initializeSpendingAnalysis();
    }, []);

    // DETERMINISTIC SPENDING ANALYSIS (ALWAYS RUNS FIRST)
    const generateDeterministicSpendingAnalysis = () => {
        // Mock deterministic analysis - in real system, this would come from rule-based logic
        return {
            deterministicTrends: {
                summary: 'Food & Dining expenses increased 15% over last 3 months. Transportation costs decreased 8%. Entertainment spending remained stable.',
                confidence: 0.85,
                dataPoints: 90
            },
            deterministicChanges: {
                summary: 'Notable changes detected in 3 categories: Food & Dining (↑15%), Transportation (↓8%), Utilities (↑5%)',
                categories: [
                    { name: 'Food & Dining', change: 'Increased 15% - likely due to dining out frequency', trend: 'up' },
                    { name: 'Transportation', change: 'Decreased 8% - reduced commuting expenses', trend: 'down' },
                    { name: 'Utilities', change: 'Increased 5% - seasonal variation detected', trend: 'up' }
                ]
            },
            deterministicRanges: {
                summary: 'Monthly expenses typically range: Food ₹8,000-12,000, Transportation ₹3,000-5,000, Utilities ₹2,500-3,500',
                ranges: {
                    'Food & Dining': { min: 8000, max: 12000, level: 'high' },
                    'Transportation': { min: 3000, max: 5000, level: 'low' },
                    'Utilities': { min: 2500, max: 3500, level: 'normal' }
                }
            },
            categories: [
                { name: 'Food & Dining', amount: 11500, trend: 'increasing', change: 15 },
                { name: 'Transportation', amount: 3200, trend: 'decreasing', change: -8 },
                { name: 'Utilities', amount: 3100, trend: 'increasing', change: 5 },
                { name: 'Entertainment', amount: 4500, trend: 'stable', change: 0 }
            ],
            expenses: {
                ranges: {
                    'Food & Dining': { level: 'high', confidence: 0.9 },
                    'Transportation': { level: 'low', confidence: 0.8 },
                    'Utilities': { level: 'normal', confidence: 0.85 }
                }
            }
        };
    };

    if (loading) {
        return (
            <div className="bg-white rounded-3xl border border-slate-200 p-6">
                <div className="animate-pulse">
                    <div className="h-6 bg-slate-200 rounded w-1/3 mb-4"></div>
                    <div className="space-y-3">
                        <div className="h-4 bg-slate-200 rounded w-full"></div>
                        <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                        <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-3xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-800">Spending Analysis</h3>
                <div className="flex items-center gap-2">
                    {agentStatus.systemEnabled ? (
                        <span className="px-2 py-1 bg-teal-100 text-teal-700 text-xs font-semibold rounded-full">
                            AI Enhanced
                        </span>
                    ) : (
                        <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-full">
                            Rule-Based
                        </span>
                    )}
                </div>
            </div>

            {/* Spending Trends Section */}
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    <h4 className="font-semibold text-slate-700">Spending Trends</h4>
                    {analysis.trends?.enhanced && (
                        <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">AI Enhanced</span>
                    )}
                </div>
                <p className="text-sm text-slate-600 mb-2">
                    {analysis.trends?.content || 'Loading trend analysis...'}
                </p>
                {analysis.trends?.disclaimer && (
                    <p className="text-xs text-slate-500 italic">
                        {analysis.trends.disclaimer}
                    </p>
                )}
            </div>

            {/* Category Changes Section */}
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                    <AlertCircle className="w-5 h-5 text-amber-600" />
                    <h4 className="font-semibold text-slate-700">Category Changes</h4>
                    {analysis.categoryChanges?.enhanced && (
                        <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">AI Enhanced</span>
                    )}
                </div>
                
                {spendingData?.categories && (
                    <div className="space-y-2 mb-3">
                        {spendingData.categories.map((category, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full ${
                                        category.trend === 'increasing' ? 'bg-red-500' :
                                        category.trend === 'decreasing' ? 'bg-green-500' : 'bg-slate-400'
                                    }`} />
                                    <span className="font-medium text-slate-700">{category.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-slate-600">₹{category.amount.toLocaleString()}</span>
                                    {category.change !== 0 && (
                                        <span className={`text-xs font-semibold ${
                                            category.change > 0 ? 'text-red-600' : 'text-green-600'
                                        }`}>
                                            {category.change > 0 ? '+' : ''}{category.change}%
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                
                <div className="text-sm text-slate-600">
                    {analysis.categoryChanges?.content || 'Loading category analysis...'}
                </div>
                {analysis.categoryChanges?.disclaimer && (
                    <p className="text-xs text-slate-500 italic mt-2">
                        {analysis.categoryChanges.disclaimer}
                    </p>
                )}
            </div>

            {/* Expense Ranges Section */}
            <div>
                <div className="flex items-center gap-2 mb-3">
                    <Info className="w-5 h-5 text-slate-600" />
                    <h4 className="font-semibold text-slate-700">Expense Ranges</h4>
                    {analysis.expenseRanges?.enhanced && (
                        <span className="text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded">AI Enhanced</span>
                    )}
                </div>
                <p className="text-sm text-slate-600">
                    {analysis.expenseRanges?.content || 'Loading expense range analysis...'}
                </p>
                {analysis.expenseRanges?.disclaimer && (
                    <p className="text-xs text-slate-500 italic mt-2">
                        {analysis.expenseRanges.disclaimer}
                    </p>
                )}
            </div>

            {/* System Status Footer */}
            <div className="mt-6 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>
                        Analysis Mode: {agentStatus.systemEnabled ? 'AI-Enhanced' : 'Rule-Based Only'}
                    </span>
                    <span>
                        Last Updated: {new Date().toLocaleTimeString()}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default SpendingAnalysis;