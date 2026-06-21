const steps = [
  "Create Your Profile",
  "Share Your Link",
  "Collect Wishes",
  "Preserve Memories Forever",
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="mx-auto max-w-6xl px-6 py-24"
    >
      <h2 className="mb-12 text-center text-4xl font-bold">
        How It Works
      </h2>

      <div className="grid gap-8 md:grid-cols-4">
        {steps.map((step, index) => (
          <div
            key={step}
            className="rounded-2xl border p-8 text-center"
          >
            <div className="mb-4 text-4xl font-bold">
              {index + 1}
            </div>

            <h3 className="font-semibold">
              {step}
            </h3>
          </div>
        ))}
      </div>
    </section>
  );
}