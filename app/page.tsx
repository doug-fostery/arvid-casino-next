import Casino from './components/Casino';
import './globals.css';

export const metadata = {
  title: "Arvid's Salary Casino",
  description: 'Win back your salary (probably not)',
};

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-5 overflow-x-hidden overflow-y-auto">
      <div className="fixed top-0 left-0 right-0 h-2 sm:h-1 bg-gradient-lights animate-lights shadow-lights z-50"></div>
      <Casino />
      <div className="fixed bottom-0 left-0 right-0 h-2 sm:h-1 bg-gradient-lights animate-lights shadow-lights"></div>
    </main>
  );
}