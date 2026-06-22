interface Props {
  password: string;
}

export default function PasswordStrength({
  password,
}: Props) {
  const getStrength = () => {
    let score = 0;

    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password))
      score++;

    if (score <= 2)
      return {
        label: "Weak",
        color: "bg-red-500",
      };

    if (score <= 4)
      return {
        label: "Medium",
        color: "bg-yellow-500",
      };

    return {
      label: "Strong",
      color: "bg-green-500",
    };
  };

  const strength = getStrength();

  return (
    <div className="space-y-2">
      <div className="h-2 rounded bg-gray-200 overflow-hidden">
        <div
          className={`h-full ${strength.color}`}
          style={{
            width: `${
              strength.label === "Weak"
                ? 33
                : strength.label === "Medium"
                ? 66
                : 100
            }%`,
          }}
        />
      </div>

      <p className="text-sm text-gray-500">
        Password Strength: {strength.label}
      </p>
    </div>
  );
}