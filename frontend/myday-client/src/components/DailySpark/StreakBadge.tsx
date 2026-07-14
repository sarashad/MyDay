import { useQuery } from '@tanstack/react-query';
import { sparkApi } from '../../api/spark';

export default function StreakBadge() {
  const { data: streak } = useQuery({
    queryKey: ['spark-streak'],
    queryFn: sparkApi.getStreak,
  });

  if (!streak) return null;

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
      {/* Streak numbers */}
      <div className="flex items-center gap-6 mb-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-orange-500">
            🔥 {streak.currentStreak}
          </div>
          <div className="text-xs text-gray-500 mt-1">Current Streak</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-yellow-500">
            ⭐ {streak.longestStreak}
          </div>
          <div className="text-xs text-gray-500 mt-1">Best Streak</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-violet-500">
            {streak.totalCompleted}
          </div>
          <div className="text-xs text-gray-500 mt-1">Total Done</div>
        </div>
      </div>

      {/* Badges */}
      {streak.badges.length > 0 && (
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">
            Badges Earned
          </p>
          <div className="flex flex-wrap gap-2">
            {streak.badges.map(badge => (
              <div
                key={badge.key}
                title={badge.description}
                className="flex items-center gap-1 bg-violet-50 border border-violet-100
                  rounded-full px-3 py-1 text-sm"
              >
                <span>{badge.icon}</span>
                <span className="text-violet-700 font-medium">{badge.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}