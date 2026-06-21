export default function HeroSection() {
  return (
    <section className="flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
      <span className="mb-4 rounded-full border px-4 py-2 text-sm">
        Graduation Memory Platform
      </span>

      <h1 className="mb-6 max-w-4xl text-5xl font-bold md:text-7xl">
        Preserve Your Graduation Legacy Forever
      </h1>

      <p className="mb-8 max-w-2xl text-lg text-muted-foreground">
        Create a beautiful graduation page where
        family, friends, teachers and mentors can
        leave wishes, photos, videos and memories.
      </p>

      <div className="flex gap-4">
        <button className="rounded-lg border px-6 py-3">
          Create Your Page
        </button>

        <button className="rounded-lg border px-6 py-3">
          View Demo
        </button>
      </div>
    </section>
  );
}