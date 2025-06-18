// BarRating component (modified version of your example)
export const BarRating = ({ 
    currentRating,
    onChange,
    count = 7 
  }: {
    currentRating: number;
    onChange: (value: number) => void;
    count?: number;
  }) => {
    const maxBarHeight = 90; // pixels
    
    return (
      <div className="flex ml-1 items-end gap-1.5">
        {[...Array(count)].map((_, i) => {
          const barHeight = ((i + 1) / count) * maxBarHeight;
          const isActive = i < currentRating;
          const value = i + 1;
  
          return (
            <div
              key={i}
              onClick={() => onChange(value)}
              className={`w-6 cursor-pointer transition-all duration-200 ${
                isActive ? "bg-blue-500 dark:bg-red-500" : "bg-gray-200 dark:bg-gray-800"
              } hover:opacity-80`}
              style={{ 
                height: `${barHeight}px`, 
                borderRadius: "8px 8px 8px 8px" 
              }}
              title={`Rate ${value}`}
            >
              {/* Optional: Show the number inside the bar */}
              <div className="flex items-center justify-center h-full text-xs font-medium text-white">
                {isActive ? value : null}
              </div>
            </div>
          );
        })}
      </div>
    );
  };