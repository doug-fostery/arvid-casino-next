import Casino from './components/Casino';
import './globals.css';

export const metadata = {
  title: "Arvid's Salary Casino",
  description: 'Win back your salary (probably not)',
};

export default function Home() {
  return (
    <main>
      <div className="casino-lights"></div>
      <Casino />
      <div className="casino-lights bottom"></div>
    </main>
  );
}