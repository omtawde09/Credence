import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, TrendingUp, Users, Briefcase, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const AdvisorDashboard = () => {
  const navigate = useNavigate();

  const clients = [
    { name: 'Rahul Mehta', aum: '₹45,00,000', status: 'On track', change: '+2.3%', positive: true },
    { name: 'Anita Sharma', aum: '₹28,50,000', status: 'Review needed', change: '-1.8%', positive: false },
    { name: 'Vikram Singh', aum: '₹1,20,00,000', status: 'On track', change: '+4.1%', positive: true },
    { name: 'Priya Reddy', aum: '₹15,75,000', status: 'On track', change: '+1.9%', positive: true },
    { name: 'Amit Patel', aum: '₹62,30,000', status: 'Risk mismatch', change: '+5.2%', positive: true }
  ];

  const alerts = [
    { client: 'Anita Sharma', type: 'Review required', desc: 'Portfolio underperforming benchmark by 8% over 6 months', severity: 'warning' },
    { client: 'Amit Patel', type: 'Risk mismatch', desc: 'Current allocation exceeds stated risk tolerance', severity: 'alert' },
    { client: 'Vikram Singh', type: 'Life event', desc: 'Client reported upcoming retirement - review allocation', severity: 'info' }
  ];

  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <button onClick={() => navigate('/')} className="text-xl font-medium text-gray-900">
            Credence
          </button>
          <div className="flex items-center gap-6">
            <span className="text-sm text-gray-600">Advisor Portal</span>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium">
                PS
              </div>
              <span className="text-sm text-gray-900">Priya Sharma</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <header className="mb-8 fade-in">
          <h1 className="text-2xl font-medium text-gray-900 mb-1">Dashboard</h1>
          <p className="text-gray-600">Overview of your client portfolio</p>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 slide-up">
          <div className="border border-gray-200 rounded-lg p-5">
            <div className="flex items-center gap-2 text-gray-500 mb-2">
              <Users size={16} />
              <span className="text-sm">Active clients</span>
            </div>
            <div className="text-2xl font-medium text-gray-900">47</div>
          </div>
          <div className="border border-gray-200 rounded-lg p-5">
            <div className="flex items-center gap-2 text-gray-500 mb-2">
              <Briefcase size={16} />
              <span className="text-sm">AUM</span>
            </div>
            <div className="text-2xl font-medium text-gray-900">₹12.4 Cr</div>
          </div>
          <div className="border border-gray-200 rounded-lg p-5">
            <div className="flex items-center gap-2 text-gray-500 mb-2">
              <TrendingUp size={16} />
              <span className="text-sm">Avg. returns (1Y)</span>
            </div>
            <div className="text-2xl font-medium text-green-600">+11.2%</div>
          </div>
          <div className="border border-gray-200 rounded-lg p-5">
            <div className="flex items-center gap-2 text-gray-500 mb-2">
              <AlertTriangle size={16} />
              <span className="text-sm">Pending alerts</span>
            </div>
            <div className="text-2xl font-medium text-amber-600">3</div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="md:col-span-2">
            <div className="border border-gray-200 rounded-lg">
              <div className="px-5 py-4 border-b border-gray-100">
                <h2 className="font-medium text-gray-900">Client overview</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm text-gray-500 border-b border-gray-100">
                      <th className="px-5 py-3 font-medium">Client</th>
                      <th className="px-5 py-3 font-medium">AUM</th>
                      <th className="px-5 py-3 font-medium">Status</th>
                      <th className="px-5 py-3 font-medium text-right">1M change</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clients.map((client, i) => (
                      <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer">
                        <td className="px-5 py-4 text-sm text-gray-900">{client.name}</td>
                        <td className="px-5 py-4 text-sm text-gray-600">{client.aum}</td>
                        <td className="px-5 py-4">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            client.status === 'On track' ? 'bg-green-50 text-green-700' :
                            client.status === 'Review needed' ? 'bg-amber-50 text-amber-700' :
                            'bg-red-50 text-red-700'
                          }`}>
                            {client.status}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-sm text-right">
                          <span className={`flex items-center justify-end gap-1 ${client.positive ? 'text-green-600' : 'text-red-600'}`}>
                            {client.positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                            {client.change}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-5 py-3 border-t border-gray-100 text-center">
                <button className="text-sm text-blue-600 hover:text-blue-700">
                  View all clients
                </button>
              </div>
            </div>
          </div>

          <div>
            <div className="border border-gray-200 rounded-lg">
              <div className="px-5 py-4 border-b border-gray-100">
                <h2 className="font-medium text-gray-900">Alerts</h2>
              </div>
              <div className="divide-y divide-gray-100">
                {alerts.map((alert, i) => (
                  <div key={i} className="px-5 py-4 hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 ${
                        alert.severity === 'alert' ? 'text-red-500' :
                        alert.severity === 'warning' ? 'text-amber-500' :
                        'text-blue-500'
                      }`}>
                        <AlertTriangle size={16} />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{alert.client}</div>
                        <div className="text-xs text-gray-500 mb-1">{alert.type}</div>
                        <div className="text-xs text-gray-600">{alert.desc}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg mt-4 p-5">
              <h3 className="font-medium text-gray-900 mb-4">Performance vs benchmark</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Your portfolio</span>
                    <span className="text-gray-900 font-medium">+11.2%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '78%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Nifty 50</span>
                    <span className="text-gray-900 font-medium">+9.8%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gray-400 rounded-full" style={{ width: '68%' }} />
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-4">
                Outperforming benchmark by 1.4%
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdvisorDashboard;
