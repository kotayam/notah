export default function Landing() {
  return (
    <div className="bg-gradient-to-br from-yellow-300 via-amber-600 to-red-600 bg-[length:400%_400%] min-h-[100vh] animate-gradient flex justify-center items-center">
      <div className="grid grid-cols-1 gap-4 place-content-center">
        <div className="animate-slidein">
          <h1 className="text-5xl font-bold text-white text-center">
            Welcome to Notah
          </h1>
          <h2 className="text-2xl text-white text-center">
            An AI-powered quick note-taking app
          </h2>
        </div>
        <div className="grid grid-cols-3 gap-4 place-content-center text-center text-white">
          <a href="/note">Memo</a>
          <a href="/login">Login</a>
          <a href="/signup">Sign Up</a>
        </div>
      </div>
    </div>
  );
}
