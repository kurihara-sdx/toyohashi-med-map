export default function OccupancyBar({ rate }: { rate: number }) {
  const color = rate >= 90 ? 'bg-red-500' : rate >= 70 ? 'bg-amber-500' : 'bg-green-500';

  return (
    <div className="w-full bg-slate-200 rounded-full h-2.5">
      <div className={`h-2.5 rounded-full ${color} transition-all`} style={{ width: `${Math.min(rate, 100)}%` }} />
    </div>
  );
}
