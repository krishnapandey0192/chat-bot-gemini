import { useState, useRef, useEffect } from "react";
import "./Chat.css";
import axios from "axios";
import ReactMarkdown from "react-markdown";

function Chat() {
  const [chatHistory, setChatHistory] = useState([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [generatingAnswer, setGeneratingAnswer] = useState(false);

  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory, generatingAnswer]);

  async function generateAnswer(e) {
    e.preventDefault();
    if (!question.trim()) return;

    setGeneratingAnswer(true);
    const currentQuestion = question;
    setQuestion(""); // Clear input immediately after sending

    // Add user question to chat history
    setChatHistory((prev) => [
      ...prev,
      { type: "question", content: currentQuestion },
    ]);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/chat`,
        {
          prompt: currentQuestion,
        }
      );

      const aiResponse = response.data.text;
      setChatHistory((prev) => [
        ...prev,
        { type: "answer", content: aiResponse },
      ]);
      setAnswer(aiResponse);
    } catch (error) {
      console.log(error);
      setAnswer("Sorry - Something went wrong. Please try again!");
    }
    setGeneratingAnswer(false);
  }

  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-900">
      <div className="h-full max-w-4xl mx-auto flex flex-col p-3">
        {/* Fixed Header */}
        <header className="text-center py-4">
          <a
            href="https://github.com/krishnapandey0192"
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <h1 className="text-4xl font-bold text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300">
              Chat AI
            </h1>
          </a>
        </header>

        {/* Scrollable Chat Container */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto mb-4 rounded-lg bg-gray-200 dark:bg-gray-800 shadow-lg p-4 hide-scrollbar "
        >
          {chatHistory.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              <div className="bg-blue-50 dark:bg-gray-800 rounded-xl p-8 max-w-2xl">
                <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-4">
                  Welcome to Chat AI! 👋
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  I'm here to help you with anything you'd like to know. You can
                  ask me about:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  <div className="bg-white dark:bg-gray-700 dark:text-gray-300 p-4 rounded-lg shadow-sm">
                    <span className="text-blue-500 dark:text-blue-400">💡</span>{" "}
                    General knowledge
                  </div>
                  <div className="bg-white dark:bg-gray-700 dark:text-gray-300 p-4 rounded-lg shadow-sm">
                    <span className="text-blue-500 dark:text-blue-400">🔧</span>{" "}
                    Technical questions
                  </div>
                  <div className="bg-white dark:bg-gray-700 dark:text-gray-300 p-4 rounded-lg shadow-sm">
                    <span className="text-blue-500 dark:text-blue-400">📝</span>{" "}
                    Writing assistance
                  </div>
                  <div className="bg-white dark:bg-gray-700 dark:text-gray-300 p-4 rounded-lg shadow-sm">
                    <span className="text-blue-500 dark:text-blue-400">🤔</span>{" "}
                    Problem solving
                  </div>
                </div>
                <p className="text-gray-500 dark:text-gray-400 mt-6 text-sm">
                  Just type your question below and press Enter or click Send!
                </p>
              </div>
            </div>
          ) : (
            <>
              {chatHistory.map((chat, index) => (
                <div
                  key={index}
                  className={`mb-4 ${
                    chat.type === "question" ? "text-right" : "text-left"
                  }`}
                >
                  <div
                    className={`inline-block max-w-[80%] p-3 rounded-lg overflow-auto hide-scrollbar ${
                      chat.type === "question"
                        ? "bg-blue-500 text-white rounded-br-none dark:bg-blue-400"
                        : "bg-gray-100 text-gray-800 rounded-bl-none dark:bg-gray-700 dark:text-gray-200"
                    }`}
                  >
                    <ReactMarkdown className="overflow-auto hide-scrollbar">
                      {chat.content}
                    </ReactMarkdown>
                  </div>
                </div>
              ))}
            </>
          )}
          {generatingAnswer && (
            <div className="text-left">
              <div className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 p-3 rounded-lg animate-pulse">
                Thinking...
              </div>
            </div>
          )}
        </div>

        {/* Fixed Input Form */}
        <form
          onSubmit={generateAnswer}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4"
        >
          <div className="flex gap-2">
            <textarea
              required
              className="flex-1 border border-gray-300 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 rounded p-3 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 dark:focus:border-blue-300 dark:focus:ring-blue-300 resize-none"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask anything..."
              rows="2"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  generateAnswer(e);
                }
              }}
            ></textarea>
            <button
              type="submit"
              className={`px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 dark:bg-blue-400 dark:hover:bg-blue-500 ${
                generatingAnswer ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={generatingAnswer}
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Chat;
