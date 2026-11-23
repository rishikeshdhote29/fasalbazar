import { useNavigate } from "react-router";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <main className="flex min-h-[calc(100vh-64px)] items-center justify-center px-6 py-12">
      <div className="max-w-md text-center">
        <p className="text-7xl font-bold text-amber-500">404</p>
        <h1 className="mt-4 text-3xl font-bold text-gray-900">Page not found</h1>
        <p className="mt-3 text-gray-600">
          The page you are looking for does not exist or has been moved.
        </p>
        <button
          type="button"
          onClick={() => navigate("/")}
          className="mt-6 rounded-lg bg-amber-400 px-5 py-2.5 font-semibold text-gray-900 transition hover:bg-amber-500"
        >
          Go to home
        </button>
      </div>
    </main>
  );
};

export default NotFound;
