function RoomSettings({ settings, setSettings }) {

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-white mb-6">
        ⚙️ Room Settings
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

        {/* MAX PLAYERS */}
        <div className="bg-white/10 border border-white/10 rounded-3xl p-5 backdrop-blur-xl">
          <label className="text-white block mb-3 font-semibold">
            👥 Max Players
          </label>

          <select
            value={settings.maxPlayers}
            onChange={(e) =>
              setSettings({
                ...settings,
                maxPlayers: Number(e.target.value),
              })
            }
            className="w-full p-4 rounded-2xl bg-black/20 text-white outline-none border border-white/10"
          >
            {[2, 4, 6, 8, 10, 12, 16, 20].map((num) => (
              <option key={num} value={num} className="text-black">
                {num}
              </option>
            ))}
          </select>
        </div>

        {/* ROUNDS */}
        <div className="bg-white/10 border border-white/10 rounded-3xl p-5 backdrop-blur-xl">
          <label className="text-white block mb-3 font-semibold">
            🔁 Rounds
          </label>

          <select
            value={settings.rounds}
            onChange={(e) =>
              setSettings({
                ...settings,
                rounds: Number(e.target.value),
              })
            }
            className="w-full p-4 rounded-2xl bg-black/20 text-white outline-none border border-white/10"
          >
            {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <option key={num} value={num} className="text-black">
                {num}
              </option>
            ))}
          </select>
        </div>

        {/* DRAW TIME */}
        <div className="bg-white/10 border border-white/10 rounded-3xl p-5 backdrop-blur-xl">
          <label className="text-white block mb-3 font-semibold">
            ⏳ Draw Time
          </label>

          <select
            value={settings.drawTime}
            onChange={(e) =>
              setSettings({
                ...settings,
                drawTime: Number(e.target.value),
              })
            }
            className="w-full p-4 rounded-2xl bg-black/20 text-white outline-none border border-white/10"
          >
            {[15, 30, 60, 90, 120, 180, 240].map((num) => (
              <option key={num} value={num} className="text-black">
                {num} sec
              </option>
            ))}
          </select>
        </div>

        {/* WORD CHOICES */}
        <div className="bg-white/10 border border-white/10 rounded-3xl p-5 backdrop-blur-xl">
          <label className="text-white block mb-3 font-semibold">
            🔤 Word Choices
          </label>

          <select
            value={settings.wordChoices}
            onChange={(e) =>
              setSettings({
                ...settings,
                wordChoices: Number(e.target.value),
              })
            }
            className="w-full p-4 rounded-2xl bg-black/20 text-white outline-none border border-white/10"
          >
            {[1, 2, 3, 4, 5].map((num) => (
              <option key={num} value={num} className="text-black">
                {num}
              </option>
            ))}
          </select>
        </div>

        {/* HINTS */}
        <div className="bg-white/10 border border-white/10 rounded-3xl p-5 backdrop-blur-xl">
          <label className="text-white block mb-3 font-semibold">
            💡 Hints
          </label>

          <select
            value={settings.hints}
            onChange={(e) =>
              setSettings({
                ...settings,
                hints: Number(e.target.value),
              })
            }
            className="w-full p-4 rounded-2xl bg-black/20 text-white outline-none border border-white/10"
          >
            {[0, 1, 2, 3, 4, 5].map((num) => (
              <option key={num} value={num} className="text-black">
                {num}
              </option>
            ))}
          </select>
        </div>

        {/* WORD MODE */}
        <div className="bg-white/10 border border-white/10 rounded-3xl p-5 backdrop-blur-xl">
          <label className="text-white block mb-3 font-semibold">
            👁️ Word Mode
          </label>

          <select
            value={settings.wordMode}
            onChange={(e) =>
              setSettings({
                ...settings,
                wordMode: e.target.value,
              })
            }
            className="w-full p-4 rounded-2xl bg-black/20 text-white outline-none border border-white/10"
          >
            <option value="normal" className="text-black">
              Normal
            </option>

            <option value="hidden" className="text-black">
              Hidden
            </option>
          </select>
        </div>

      </div>
    </div>
  );
}

export default RoomSettings;