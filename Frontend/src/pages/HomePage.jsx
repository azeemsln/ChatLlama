

import { useState, useEffect, useRef } from "react";

const threadId =
  Date.now().toString(36) + Math.random().toString(36);

async function callServer(inputText) {
  const response = await fetch("http://localhost:3001/chat", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ threadId, message: inputText }),
  });

  if (!response.ok) {
    throw new Error("Error in generating response");
  }

  const result = await response.json();
  return result.response;
}

export default function HomePage({messages,setMessages}) {
  const [input, setInput] = useState("");
//   const [messages, setMessages] = useState([]); {role: 'user' | 'assistant', text: string}
  const [loading, setLoading] = useState(false);

  const mainRef = useRef(null);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTop = mainRef.current.scrollHeight;
    }
  }, [messages, loading]);

  async function generate(text) {
    // add user message
    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");
    setLoading(true);

    try {
      const assistantMessage = await callServer(text);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: assistantMessage },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Error generating response."+err },
      ]);
    } finally {
      setLoading(false);
    }
  }

  async function handleAsk() {
    const text = input.trim();
    if (!text) return;
    await generate(text);
  }

  async function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const text = input.trim();
      if (!text) return;
      await generate(text);
    }
  }

  return (
    <div
      className="bg-neutral-800 text-white overflow-x-hidden h-screen pt-14"
      id="main"
      ref={mainRef}
    >
      <div
        className="container mx-auto max-w-3xl pb-8 px-2 mb-28 overflow-y-auto"
        id="chat-container"
        ref={chatContainerRef}
      >
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={
              "my-6 bg-neutral-900 p-3 rounded-xl max-w-fit " +
              (m.role === "user" ? "ml-auto" : "mr-auto mb-6")
            }
          >
            {m.text}
          </div>
        ))}

        {loading && (
          <div className="my-6 animate-pulse">Thinking...</div>
        )}
      </div>

      <div className="fixed text-white bg-neutral-800 mx-auto pb-8 inset-x-0 items-center justify-center bottom-0 w-[80%]">
        <div className="bg-neutral-900 max-w-3xl py-2 px-4 rounded-xl flex mx-auto items-center justify-center w-full">
          <textarea
            name="input"
            id="input"
            placeholder="Ask Anything"
            rows="4"
            className="border-0 bg-neutral-900 outline-none rounded-xl content-center resize-none w-full scrollbar-hide"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <div className="mx-auto">
            <button
              className="bg-white px-4 py-1 rounded-xl text-black cursor-pointer hover:bg-gray-300"
              id="ask"
              onClick={handleAsk}
            >
              Ask
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
