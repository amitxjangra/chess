import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-950 via-indigo-950 to-purple-950 relative overflow-hidden">
      {/* Royal pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(139, 92, 246, 0.1) 35px, rgba(139, 92, 246, 0.1) 70px)`,
          }}
        />
      </div>

      {/* Glowing orbs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl animate-pulse" />
      <div
        className="absolute bottom-20 right-20 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "1s" }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="text-center space-y-3 mb-10">
          {/* Crown with glow */}
          <div className="relative inline-block">
            <div className="absolute inset-0 blur-xl bg-yellow-400/30 rounded-full scale-150" />
            <div
              className="relative text-6xl animate-bounce"
              style={{ animationDuration: "3s" }}
            >
              👑
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <h1 className="text-5xl lg:text-6xl font-serif font-black bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 bg-clip-text text-transparent tracking-widest drop-shadow-[0_0_30px_rgba(251,191,36,0.5)] uppercase">
              Chess Royale
            </h1>

            {/* Subtitle with decorative elements */}
            <div className="flex items-center justify-center gap-3 mt-3">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-purple-400" />
              <div className="flex items-center gap-2">
                <span className="text-xl text-purple-400">♔</span>
                <p className="text-sm lg:text-base text-purple-200 font-serif italic">
                  Where Legends Are Crowned
                </p>
                <span className="text-xl text-purple-400">♕</span>
              </div>
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-purple-400" />
            </div>
          </div>
        </div>

        {/* Game Modes Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {/* Royal Duel - Main Card (Spans 2 columns on large screens) */}
          <button
            onClick={() => navigate("/game")}
            className="lg:col-span-2 group relative overflow-hidden bg-gradient-to-br from-purple-900/90 via-violet-900/90 to-purple-900/90 backdrop-blur-md border-2 border-purple-500/50 hover:border-purple-400 text-white px-8 py-10 rounded-xl shadow-[0_0_40px_rgba(168,85,247,0.3)] transition-all duration-700 hover:scale-105 hover:shadow-[0_0_60px_rgba(168,85,247,0.5)]"
          >
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-400/0 via-purple-400/0 to-purple-400/0 group-hover:from-purple-400/20 group-hover:via-purple-400/10 group-hover:to-transparent transition-all duration-700" />

            {/* Corner decorations */}
            <div className="absolute top-3 left-3 w-10 h-10 border-t-2 border-l-2 border-purple-400/50 rounded-tl-lg" />
            <div className="absolute bottom-3 right-3 w-10 h-10 border-b-2 border-r-2 border-purple-400/50 rounded-br-lg" />

            <div className="relative space-y-4">
              <div className="text-5xl filter drop-shadow-[0_0_20px_rgba(168,85,247,0.8)]">
                ⚔️
              </div>
              <h2 className="text-3xl font-serif font-bold text-transparent bg-gradient-to-r from-purple-200 to-purple-100 bg-clip-text">
                Royal Duel
              </h2>
              <p className="text-sm text-purple-200/80 font-serif max-w-xs mx-auto">
                Face a worthy adversary in battle of wits
              </p>
              <div className="flex items-center justify-center gap-2 pt-2">
                <div className="h-px w-8 bg-gradient-to-r from-transparent to-purple-400" />
                <span className="text-purple-300 text-xs font-serif uppercase tracking-widest">
                  Enter Battle
                </span>
                <div className="h-px w-8 bg-gradient-to-l from-transparent to-purple-400" />
              </div>
            </div>
          </button>

          {/* VS Court Advisor */}
          <button
            disabled
            className="relative overflow-hidden bg-gradient-to-br from-slate-900/80 via-slate-800/80 to-slate-900/80 backdrop-blur-md border-2 border-slate-700/50 text-white/30 px-6 py-8 rounded-xl shadow-xl cursor-not-allowed"
          >
            <div className="space-y-3">
              <div className="text-4xl opacity-30">🤖</div>
              <h2 className="text-lg font-serif font-bold text-slate-400">
                Court Advisor
              </h2>
              <p className="text-xs text-slate-500 font-serif italic">
                In Development
              </p>
            </div>
          </button>

          {/* Kingdom Wars */}
          <button
            disabled
            className="relative overflow-hidden bg-gradient-to-br from-slate-900/80 via-slate-800/80 to-slate-900/80 backdrop-blur-md border-2 border-slate-700/50 text-white/30 px-6 py-8 rounded-xl shadow-xl cursor-not-allowed"
          >
            <div className="space-y-3">
              <div className="text-4xl opacity-30">🌐</div>
              <h2 className="text-lg font-serif font-bold text-slate-400">
                Kingdom Wars
              </h2>
              <p className="text-xs text-slate-500 font-serif italic">
                In Development
              </p>
            </div>
          </button>

          {/* Royal Academy - Spans 2 columns */}
          <button
            disabled
            className="lg:col-span-2 relative overflow-hidden bg-gradient-to-br from-slate-900/80 via-slate-800/80 to-slate-900/80 backdrop-blur-md border-2 border-slate-700/50 text-white/30 px-6 py-8 rounded-xl shadow-xl cursor-not-allowed"
          >
            <div className="space-y-3">
              <div className="text-4xl opacity-30">📜</div>
              <h2 className="text-lg font-serif font-bold text-slate-400">
                Royal Academy
              </h2>
              <p className="text-xs text-slate-500 font-serif italic">
                Master the ancient arts - Coming Soon
              </p>
            </div>
          </button>
        </div>

        {/* Features Footer */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-purple-300/70 text-xs font-serif">
          <div className="flex items-center gap-2">
            <span className="text-purple-400">⚔️</span>
            <span>Complete Chess Rules</span>
          </div>
          <div className="w-px h-3 bg-purple-500/30" />
          <div className="flex items-center gap-2">
            <span className="text-purple-400">✨</span>
            <span>Advanced Techniques</span>
          </div>
          <div className="w-px h-3 bg-purple-500/30" />
          <div className="flex items-center gap-2">
            <span className="text-purple-400">🎯</span>
            <span>Intuitive Controls</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
