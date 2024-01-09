export default function NotFound() {
  return (
    <div className="bg-gradient-to-br from-yellow-200 via-amber-600 to-red-600 bg-[length:400%_400%] min-h-[100vh] flex justify-center items-center animate-gradient text-lg mobile:text-md">
      <div className="grid grid-cols-1 gap-2 place-content-center text-center text-white">
        <h1 className="text-2xl mobile:text-xl">404 Page Not Found</h1>
        <img
          src="/notah-logo.gif"
          alt="Notah Logo"
          className="w-80 mobile:w-40"
        />
        <a href="/" className="hover:underline">
          Return to home
        </a>
      </div>
    </div>
  );
}
