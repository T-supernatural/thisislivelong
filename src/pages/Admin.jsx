import { useState } from "react";
import { supabase } from "../supabaseClient";

export default function AdminPage() {
  const [input, setInput] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Showcase upload states
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);

  // Journal upload states
  const [journalTitle, setJournalTitle] = useState("");
  const [journalContent, setJournalContent] = useState("");

  // Messages
  const [messages, setMessages] = useState([]);
  const [showMessages, setShowMessages] = useState(false);

  const PASSWORD = "LivelongSecret2025"; // 🔑 hardcoded for now

  const handleLogin = (e) => {
    e.preventDefault();
    if (input === PASSWORD) {
      setIsAuthenticated(true);
    } else {
      alert("Wrong password!");
    }
  };

  // Upload Showcase
  const handleUploadShowcase = async (e) => {
    e.preventDefault();
    if (!file || !title) {
      alert("Please select a file and enter a title");
      return;
    }

    const fileName = `${Date.now()}-${file.name}`;

    // Upload file to Supabase storage with upsert
    const { error: uploadError } = await supabase.storage
      .from("upload")
      .upload(fileName, file, { upsert: true });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      alert("Upload failed ❌");
      return;
    }

    // Get public URL
    const { data: urlData, error: urlError } = supabase.storage
      .from("upload")
      .getPublicUrl(fileName);

    if (urlError) {
      console.error("Public URL error:", urlError);
      alert("Failed to get public URL ❌");
      return;
    }

    const imageUrl = urlData.publicUrl;

    // Insert into showcase table
    const { error: dbError } = await supabase
      .from("showcase")
      .insert([{ title, image_url: imageUrl }]);

    if (dbError) {
      console.error("DB insert error:", dbError);
      alert("Database insert failed ❌");
    } else {
      alert("Showcase item uploaded ✅");
      setTitle("");
      setFile(null);
    }
  };

  // Add Journal Article with excerpt
  const handleAddJournal = async (e) => {
    e.preventDefault();
    if (!journalTitle || !journalContent) {
      alert("Please enter both title and content");
      return;
    }

    // Generate excerpt from first 100 characters
    const excerpt = journalContent.slice(0, 100);

    const { error } = await supabase
      .from("journal")
      .insert([{ title: journalTitle, content: journalContent, excerpt }]);

    if (error) {
      console.error("Journal insert error:", error);
      alert("Failed to save journal ❌");
    } else {
      alert("Journal saved ✅");
      setJournalTitle("");
      setJournalContent("");
    }
  };

  // Fetch Messages
  const handleFetchMessages = async () => {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Fetch messages error:", error);
      alert("Failed to fetch messages ❌");
    } else {
      setMessages(data);
      setShowMessages(true);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <form
          onSubmit={handleLogin}
          className="bg-white shadow-lg rounded-xl p-8 space-y-6 w-80"
        >
          <h2 className="text-xl font-bold text-center text-gray-800">
            Admin Access
          </h2>
          <input
            type="password"
            placeholder="Enter password"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full border px-4 py-2 rounded-md focus:ring-2 focus:ring-green-500"
          />
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
          >
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="p-10 space-y-10">
      <h1 className="text-3xl font-bold mt-16 mb-6">Admin Dashboard</h1>
      <p className="mb-6 text-gray-700">Welcome, you’re logged in 🎉</p>

      {/* Showcase Upload */}
      <form
        onSubmit={handleUploadShowcase}
        className="bg-white shadow-md rounded-xl p-6 space-y-4"
      >
        <h2 className="text-xl font-semibold text-gray-800">
          Upload Showcase Image
        </h2>
        <input
          type="text"
          placeholder="Enter image title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border px-4 py-2 rounded-md"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
          className="w-full"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
        >
          Upload
        </button>
      </form>

      {/* Journal Upload */}
      <form
        onSubmit={handleAddJournal}
        className="bg-white shadow-md rounded-xl p-6 space-y-4"
      >
        <h2 className="text-xl font-semibold text-gray-800">
          Add Journal Article
        </h2>
        <input
          type="text"
          placeholder="Article Title"
          value={journalTitle}
          onChange={(e) => setJournalTitle(e.target.value)}
          className="w-full border px-4 py-2 rounded-md"
        />
        <textarea
          placeholder="Article Content"
          value={journalContent}
          onChange={(e) => setJournalContent(e.target.value)}
          rows="5"
          className="w-full border px-4 py-2 rounded-md"
        ></textarea>
        <button
          type="submit"
          className="w-full bg-purple-500 text-white py-2 rounded-md hover:bg-purple-600"
        >
          Save Article
        </button>
      </form>

      {/* Messages */}
      <div className="bg-white shadow-md rounded-xl p-6 space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Messages</h2>
        <button
          onClick={handleFetchMessages}
          className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600"
        >
          View Messages
        </button>
        {showMessages && (
          <div className="mt-4 space-y-3">
            {messages.length === 0 ? (
              <p className="text-gray-600">No messages found.</p>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className="border p-3 rounded-md bg-gray-50 shadow-sm"
                >
                  <p className="font-semibold">{msg.name}</p>
                  <p className="text-sm text-gray-600">{msg.email}</p>
                  <p className="mt-2">{msg.message}</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
