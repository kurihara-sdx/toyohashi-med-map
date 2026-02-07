export default function Header() {
  const now = new Date();
  const dateStr = now.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  });
  const timeStr = now.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });

  return (
    <header className="bg-teal-800 text-white px-6 py-3 flex items-center justify-between shadow-lg">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center">
          <span className="text-teal-800 font-bold text-lg">+</span>
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-wide">豊橋メディカルネットワーク</h1>
          <p className="text-teal-200 text-xs">病院間連携BIダッシュボード</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm">{dateStr}</p>
        <p className="text-teal-200 text-xs">{timeStr} 更新</p>
      </div>
    </header>
  );
}
