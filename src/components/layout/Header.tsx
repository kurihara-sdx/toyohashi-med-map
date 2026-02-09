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
    <header className="bg-teal-800 text-white px-3 py-2 md:px-6 md:py-3 flex items-center justify-between shadow-lg">
      <div className="flex items-center gap-2 md:gap-3">
        <div className="w-7 h-7 md:w-9 md:h-9 bg-white rounded-lg flex items-center justify-center shrink-0">
          <span className="text-teal-800 font-bold text-sm md:text-lg">+</span>
        </div>
        <div className="min-w-0">
          <h1 className="text-sm md:text-lg font-bold tracking-wide truncate">豊橋メディカルネットワーク</h1>
          <p className="text-teal-200 text-[10px] md:text-xs hidden sm:block">病院間連携BIダッシュボード</p>
        </div>
      </div>
      <div className="text-right shrink-0">
        <p className="text-xs md:text-sm">{dateStr}</p>
        <p className="text-teal-200 text-[10px] md:text-xs">{timeStr} 更新</p>
      </div>
    </header>
  );
}
