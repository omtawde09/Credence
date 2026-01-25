import usePortfolioStore from '../store/usePortfolioStore';

const PortfolioHealthScore = () => {
    const { healthData } = usePortfolioStore();

    if (!healthData) return null;

    const getScoreColor = (score) => {
        if (score >= 80) return 'text-green-500';
        if (score >= 60) return 'text-amber-500';
        return 'text-red-500';
    };

    const getProgressColor = (score) => {
        if (score >= 80) return 'bg-green-500';
        if (score >= 60) return 'bg-amber-500';
        return 'bg-red-500';
    };

    return (
        <div className="glass-panel p-6 rounded-[24px]">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl text-indigo-600 dark:text-indigo-400">
                    <Activity size={20} />
                </div>
                <div>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Health Score</h3>
                </div>
            </div>

            <div className="flex items-center gap-6 mb-8">
                <div className="relative w-24 h-24 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                        <circle
                            cx="48"
                            cy="48"
                            r="40"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="none"
                            className="text-slate-100 dark:text-slate-700"
                        />
                        <circle
                            cx="48"
                            cy="48"
                            r="40"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="none"
                            strokeDasharray={251.2}
                            strokeDashoffset={251.2 * (1 - healthData.score / 100)}
                            className={`${getScoreColor(healthData.score)} transition-all duration-1000 ease-out`}
                            strokeLinecap="round"
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className={`text-2xl font-black ${getScoreColor(healthData.score)}`}>{healthData.score}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">/ 100</span>
                    </div>
                </div>
                <div>
                    <h4 className="text-lg font-bold text-slate-800 dark:text-white mb-1">Portfolio Status: {healthData.status}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 max-w-[200px]">
                        Your portfolio is healthy but has room for optimization in risk alignment.
                    </p>
                </div>
            </div>

            <div className="space-y-4">
                {healthData.metrics.map((metric, idx) => (
                    <div key={idx}>
                        <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                            <span>{metric.name}</span>
                            <span className={getScoreColor(metric.score)}>{metric.status}</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div
                                className={`h-full ${getProgressColor(metric.score)} rounded-full`}
                                style={{ width: `${metric.score}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PortfolioHealthScore;
