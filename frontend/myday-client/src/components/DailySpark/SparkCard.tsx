import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { sparkApi } from '../../api/spark';

export default function SparkCard() {
  const qc = useQueryClient();

  const { data: spark, isLoading } = useQuery({
    queryKey: ['spark-today'],
    queryFn: sparkApi.getToday,
  });

  const { mutate: complete, isPending } = useMutation({
    mutationFn: sparkApi.complete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['spark-today'] });
      qc.invalidateQueries({ queryKey: ['spark-streak'] });
    },
  });

  if (isLoading) return (
    <div className="rounded-2xl bg-white p-6 shadow-sm animate-pulse h-40" />
  );

  if (!spark) return null;

  return (
    <div className={`rounded-2xl p-6 shadow-sm border transition-all
      ${spark.isCompleted
        ? 'bg-green-50 border-green-200'
        : 'bg-gradient-to-br from-violet-50 to-indigo-50 border-violet-200'
      }`}>

      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">✨</span>
          <span className="font-semibold text-violet-700 text-sm uppercase tracking-wide">
            Daily Spark
          </span>
        </div>
        {spark.isCompleted && (
          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
            ✅ Done!
          </span>
        )}
      </div>

      {/* Task */}
      <p className="text-gray-800 font-medium text-base mb-2">
        {spark.taskText}
      </p>

      {/* Motivational message */}
      <p className="text-gray-500 text-sm italic mb-4">
        "{spark.motivationalMessage}"
      </p>

      {/* Complete button */}
      {!spark.isCompleted && (
        <button
          onClick={() => complete()}
          disabled={isPending}
          className="w-full py-2 rounded-xl bg-violet-600 text-white text-sm font-medium
            hover:bg-violet-700 active:scale-95 transition-all disabled:opacity-50"
        >
          {isPending ? 'Marking done...' : 'Mark as Done 🎯'}
        </button>
      )}
    </div>
  );
}