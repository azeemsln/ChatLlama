function Navbar({setMessages}) {

  function handleClick() {
    setMessages([]);
  }

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-neutral-900/90 backdrop-blur border-b border-neutral-700">
      <div className="max-w-3xl mx-auto flex items-center justify-between px-4 py-3">
        {/* Left: Logo / Title */}
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-emerald-500 flex items-center justify-center text-black font-bold">
            CL
          </div>
          <div>
            <h1 className="text-lg text-white font-semibold">Chat Llama</h1>
            <p className="text-xs text-neutral-400">Local AI playground</p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3 text-sm">
          <button className="px-3 py-1 rounded-lg border border-neutral-600 hover:bg-neutral-800 text-white" onClick={handleClick}>
            New chat
          </button>
          <button className="px-3 py-1 rounded-lg bg-emerald-500 text-black font-medium hover:bg-emerald-400" onClick={handleClick}>
            Clear
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
