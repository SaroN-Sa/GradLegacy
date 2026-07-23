// components/password-requirements.tsx
import { CheckCircle, Circle, Shield, AlertTriangle, Check } from "lucide-react";

interface PasswordRequirementsProps {
  password: string;
}

export default function PasswordRequirements({ password }: PasswordRequirementsProps) {
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };

  const score = Object.values(checks).filter(Boolean).length;

  // Don't show anything if password is empty
  if (password.length === 0) {
    return null;
  }

  // Get strength color and label
  const getStrengthInfo = () => {
    if (score === 0) return { color: "bg-gray-300", label: "", textColor: "text-gray-400" };
    if (score === 1) return { color: "bg-red-500", label: "Weak", textColor: "text-red-500" };
    if (score === 2) return { color: "bg-orange-500", label: "Fair", textColor: "text-orange-500" };
    if (score === 3) return { color: "bg-yellow-500", label: "Good", textColor: "text-yellow-600" };
    return { color: "bg-green-500", label: "Strong", textColor: "text-green-600" };
  };

  const strength = getStrengthInfo();

  return (
    <div className="space-y-2 sm:space-y-3 mt-2 p-2.5 sm:p-3 md:p-4 bg-gray-50 rounded-xl border border-gray-100 w-full max-w-full">
      {/* Password strength meter */}
      <div className="space-y-1 sm:space-y-1.5">
        <div className="flex justify-between items-center flex-wrap gap-1">
          <span className="text-xs sm:text-sm font-medium text-gray-600">
            Password Strength
          </span>
          {score > 0 && (
            <span
              className={`text-xs sm:text-sm font-semibold ${strength.textColor} flex items-center gap-1`}
            >
              {score === 4 && <Shield size={12} className="sm:w-3.5 sm:h-3.5" />}
              {strength.label}
            </span>
          )}
        </div>
        <div className="flex gap-1">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className={`h-1.5 sm:h-2 flex-1 rounded-full transition-all duration-300 ${
                score >= item ? strength.color : "bg-gray-200"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Requirements list */}
      <div>
        <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1 sm:mb-1.5 flex flex-wrap items-center gap-x-2">
          Requirements:
          {score === 4 && (
            <span className="text-green-600 font-semibold">✓ All met!</span>
          )}
        </p>
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-x-2 sm:gap-x-3 gap-y-1 sm:gap-y-1.5">
          {/* 8+ Characters */}
          <div className="flex items-center gap-1.5 text-xs sm:text-sm min-w-0">
            {checks.length ? (
              <CheckCircle size={14} className="text-green-500 flex-shrink-0 sm:w-4 sm:h-4" />
            ) : (
              <Circle size={14} className="text-gray-300 flex-shrink-0 sm:w-4 sm:h-4" />
            )}
            <span
              className={`truncate ${
                checks.length ? "text-green-600 font-medium" : "text-gray-500"
              }`}
            >
              8+ Characters
            </span>
          </div>

          {/* Uppercase */}
          <div className="flex items-center gap-1.5 text-xs sm:text-sm min-w-0">
            {checks.uppercase ? (
              <CheckCircle size={14} className="text-green-500 flex-shrink-0 sm:w-4 sm:h-4" />
            ) : (
              <Circle size={14} className="text-gray-300 flex-shrink-0 sm:w-4 sm:h-4" />
            )}
            <span
              className={`truncate ${
                checks.uppercase ? "text-green-600 font-medium" : "text-gray-500"
              }`}
            >
              Uppercase
            </span>
          </div>

          {/* Number */}
          <div className="flex items-center gap-1.5 text-xs sm:text-sm min-w-0">
            {checks.number ? (
              <CheckCircle size={14} className="text-green-500 flex-shrink-0 sm:w-4 sm:h-4" />
            ) : (
              <Circle size={14} className="text-gray-300 flex-shrink-0 sm:w-4 sm:h-4" />
            )}
            <span
              className={`truncate ${
                checks.number ? "text-green-600 font-medium" : "text-gray-500"
              }`}
            >
              Number
            </span>
          </div>

          {/* Special */}
          <div className="flex items-center gap-1.5 text-xs sm:text-sm min-w-0">
            {checks.special ? (
              <CheckCircle size={14} className="text-green-500 flex-shrink-0 sm:w-4 sm:h-4" />
            ) : (
              <Circle size={14} className="text-gray-300 flex-shrink-0 sm:w-4 sm:h-4" />
            )}
            <span
              className={`truncate ${
                checks.special ? "text-green-600 font-medium" : "text-gray-500"
              }`}
            >
              Special Character
            </span>
          </div>
        </div>
      </div>

      {/* Success message */}
      {score === 4 && (
        <div className="flex items-center gap-2 p-2 sm:p-2.5 bg-green-50 rounded-lg border border-green-200">
          <Check size={16} className="text-green-600 flex-shrink-0 sm:w-[18px] sm:h-[18px]" />
          <p className="text-xs sm:text-sm font-medium text-green-700">
            🔒 Excellent password! Your account is well protected.
          </p>
        </div>
      )}

      {/* Warning for weak password */}
      {score > 0 && score <= 2 && (
        <div className="flex items-center gap-2 p-2 sm:p-2.5 bg-orange-50 rounded-lg border border-orange-200">
          <AlertTriangle
            size={16}
            className="text-orange-500 flex-shrink-0 sm:w-[18px] sm:h-[18px]"
          />
          <p className="text-xs sm:text-sm font-medium text-orange-700">
            Consider adding more characters, numbers, and special characters.
          </p>
        </div>
      )}
    </div>
  );
}