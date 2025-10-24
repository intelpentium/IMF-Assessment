export default function Home() {
  return (
    <div className="hero min-h-[70vh] bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">Welcome to Fullstack App</h1>
          <p className="py-6">
            This is a fullstack application built with Hono.js (backend) and Next.js (frontend).
            You can sign in to create and manage your posts.
          </p>
          <a href="/auth/sign-in" className="btn btn-primary">Get Started</a>
        </div>
      </div>
    </div>
  );
}