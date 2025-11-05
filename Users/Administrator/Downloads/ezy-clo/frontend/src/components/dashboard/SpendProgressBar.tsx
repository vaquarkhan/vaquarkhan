import React from 'react';

interface SpendProgressBarProps {
  cardType: string;
  lastFour: string;
  currentSpend: number;
  threshold: number;
  currency?: string;
}

export const SpendProgressBar: React.FC<SpendProgressBarProps> = ({
  cardType,
  lastFour,
  currentSpend,
  threshold,
  currency = 'SAR'
}) => {
  const progressPercentage = Math.min((currentSpend / threshold) * 100, 100);
  const remaining = Math.max(threshold - currentSpend, 0);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-medium text-gray-900">{cardType}</h3>
          <p className="text-sm text-gray-500">•••• {lastFour}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Current Spend</p>
          <p className="text-lg font-semibold text-gray-900">
            {currency} {currentSpend.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progress to next reward</span>
          <span>{progressPercentage.toFixed(0)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Remaining Amount */}
      <div className="text-center">
        {remaining > 0 ? (
          <p className="text-sm text-gray-600">
            Spend <span className="font-semibold text-gray-900">{currency} {remaining.toLocaleString()}</span> more to unlock your next reward
          </p>
        ) : (
          <p className="text-sm text-green-600 font-semibold">
            🎉 Congratulations! You've reached your spending threshold
          </p>
        )}
      </div>
    </div>
  );
};