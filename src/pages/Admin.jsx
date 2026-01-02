import { useState, useEffect, useRef } from "react";
import { supabase } from "../supabaseClient";
import { v4 as uuidv4 } from "uuid";
import toast, { Toaster } from "react-hot-toast";

export default function AdminPage() {
  const [session, setSession] = useState(null);
  const [activeTab, setActiveTab] = useState("showcase"); // "showcase", "journal", "messages"

  // Showcase upload states
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  const [uploadingShowcase, setUploadingShowcase] = useState(false);

  // Journal upload states
  const [journalTitle, setJournalTitle] = useState("");
  const [journalContent, setJournalContent] = useState("");
  const [savingJournal, setSavingJournal] = useState(false);

  // Messages
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  useEffect(() => {
    // Get current session
    supabase.auth.getSession().then(({ data }) => setSession(data.session));

    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  // Login via magic link
  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) toast.error("Login failed ❌");
    else toast.success("Check your email for the login link ✉️");
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) return toast.error("Logout failed ❌");
    setSession(null);
    toast.success("Logged out ✅");
  };

  // Showcase Upload
  const handleUploadShowcase = async (e) => {
    e.preventDefault();
    if (!file || !title) return toast.error("Please select a file and enter a title");

    setUploadingShowcase(true);
    const fileName = `${uuidv4()}-${file.name}`;

    const { error: uploadError } = await supabase.storage.from("upload").upload(fileName, file);
    if (uploadError) {
      setUploadingShowcase(false);
      return toast.error("Upload failed ❌");
    }

    const { data: urlData, error: urlError } = await supabase.storage.from("upload").getPublicUrl(fileName);
    if (urlError) {
      setUploadingShowcase(false);
      return toast.error("Failed to get public URL ❌");
    }

    const { error: dbError } = await supabase.from("showcase").insert([{ title, image_url: urlData.publicUrl }]);
    setUploadingShowcase(false);
    if (dbError) return toast.error("Database insert failed ❌");

    toast.success("Showcase item uploaded ✅");
    setTitle(""); setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Journal Upload
  const handleAddJournal = async (e) => {
    e.preventDefault();
    if (!journalTitle || !journalContent) return toast.error("Please enter both title and content");

    setSavingJournal(true);
    const excerpt = journalContent.slice(0, 100).split(" ").slice(0, -1).join(" ") + "...";

    const { error } = await supabase.from("journal").insert([{ title: journalTitle, content: journalContent, excerpt }]);
    setSavingJournal(false);
    if (error) return toast.error("Failed to save journal ❌");

    toast.success("Journal saved ✅");
    setJournalTitle(""); setJournalContent("");
  };

  // Messages
  const handleFetchMessages = async () => {
    setLoadingMessages(true);
    const { data, error } = await supabase.from("messages").select("*").order("created_at", { ascending: false });
    setLoadingMessages(false);
    if (error) return toast.error("Failed to fetch messages ❌");
    setMessages(data);
  };

  const handleDeleteMessage = async (id) => {
    const { error } = await supabase.from("messages").delete().eq("id", id);
    if (error) return toast.error("Failed to delete message ❌");
    setMessages(messages.filter((msg) => msg.id !== id));
    toast.success("Message deleted ✅");
  };

  if (!session) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <form onSubmit={handleLogin} className="bg-white shadow-lg rounded-xl p-8 space-y-6 w-80">
          <Toaster />
          <h2 className="text-xl font-bold text-center text-gray-800">Admin Login</h2>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            className="w-full border px-4 py-2 rounded-md focus:ring-2 focus:ring-green-500"
            required
          />
          <button type="submit" className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700">
            Send Magic Link
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="p-10 space-y-6">
      <Toaster />
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        <button onClick={handleLogout} className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600">
          Logout
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6">
        {["showcase", "journal", "messages"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-2 px-4 rounded-t-md font-semibold ${
              activeTab === tab ? "bg-green-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      {activeTab === "showcase" && (
        <form onSubmit={handleUploadShowcase} className="bg-white shadow-md rounded-xl p-6 space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Upload Showcase Image</h2>
          <input
            type="text"
            placeholder="Enter image title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border px-4 py-2 rounded-md"
          />
          <input type="file" ref={fileInputRef} accept="image/*" onChange={(e) => setFile(e.target.files[0])} className="w-full" />
          <button type="submit" disabled={uploadingShowcase} className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 disabled:opacity-50">
            {uploadingShowcase ? "Uploading..." : "Upload"}
          </button>
        </form>
      )}

      {activeTab === "journal" && (
        <form onSubmit={handleAddJournal} className="bg-white shadow-md rounded-xl p-6 space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Add Journal Article</h2>
          <input type="text" placeholder="Article Title" value={journalTitle} onChange={(e) => setJournalTitle(e.target.value)} className="w-full border px-4 py-2 rounded-md" />
          <textarea placeholder="Article Content" value={journalContent} onChange={(e) => setJournalContent(e.target.value)} rows="5" className="w-full border px-4 py-2 rounded-md"></textarea>
          <button type="submit" disabled={savingJournal} className="w-full bg-purple-500 text-white py-2 rounded-md hover:bg-purple-600 disabled:opacity-50">
            {savingJournal ? "Saving..." : "Save Article"}
          </button>
        </form>
      )}

      {activeTab === "messages" && (
        <div className="bg-white shadow-md rounded-xl p-6 space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Messages</h2>
          <button onClick={handleFetchMessages} disabled={loadingMessages} className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 disabled:opacity-50">
            {loadingMessages ? "Loading..." : "View Messages"}
          </button>
          <div className="mt-4 space-y-3">
            {messages.length === 0 ? (
              <p className="text-gray-600">No messages found.</p>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className="border p-3 rounded-md bg-gray-50 shadow-sm flex justify-between items-start">
                  <div>
                    <p className="font-semibold">{msg.name}</p>
                    <p className="text-sm text-gray-600">{msg.email}</p>
                    <p className="mt-2">{msg.message}</p>
                  </div>
                  <button onClick={() => handleDeleteMessage(msg.id)} className="text-red-500 font-bold hover:underline ml-4">
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
