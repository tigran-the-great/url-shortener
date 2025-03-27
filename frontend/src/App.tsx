import Shortener from './components/Shortener';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 p-6">
      <div className="max-w-4xl mx-auto space-y-10">
        <h1 className="text-4xl font-bold text-center">🔗 URL Shortener</h1>
        <Shortener />
        <Dashboard />
      </div>
    </div>
  );
}

export default App;
