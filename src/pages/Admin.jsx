import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { v4 as uuidv4 } from "uuid";
import toast, { Toaster } from "react-hot-toast";

/** =========================
 * HARD-CODED ADMIN CREDENTIALS
 * ========================= */
const ADMIN_EMAIL = "tinuademichael@gmail.com";
const ADMIN_PASSWORD = "supersecret123"; // change this

export default function AdminPage() {
  const [session, setSession] = useState(null);
  const [activeTab, setActiveTab] = useState("showcase");
  const navigate = useNavigate();

  // Showcase
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [uploadingShowcase, setUploadingShowcase] = useState(false);
  const fileInputRef = useRef(null);

  // Journal
  const [journalTitle, setJournalTitle] = useState("");
  const [journalContent, setJournalContent] = useState("");
  const [savingJournal, setSavingJournal] = useState(false);

  // Messages
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  /** =========================
   * LOGIN (FAKE AUTH)
   * ========================= */
  const handleLogin = (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      toast.error("Invalid credentials ❌");
      navigate("/", { replace: true });
      return;
    }

    setSession({ admin: true });
    toast.success("Welcome Admin ✅");
  };

  const handleLogout = () => {
    setSession(null);
    toast.success("Logged out ✅");
    navigate("/", { replace: true });
  };

  /** =========================
   * SHOWCASE
   * ========================= */
  const handleUploadShowcase = async (e) => {
    e.preventDefault();
    if (!file || !title) return toast.error("Enter title & choose file");

    setUploadingShowcase(true);
    const fileName = `${uuidv4()}-${file.name}`;

    const { error: uploadError } = await supabase
      .storage
      .from("showcase-images")
      .upload(fileName, file);

    if (uploadError) {
      setUploadingShowcase(false);
      return toast.error("Upload failed ❌");
    }

    const { data } = supabase
      .storage
      .from("showcase-images")
      .getPublicUrl(fileName);

    const { error: dbError } = await supabase
      .from("showcase")
      .insert([{ title, image_url: data.publicUrl }]);

    setUploadingShowcase(false);

    if (dbError) return toast.error("DB insert failed ❌");

    toast.success("Showcase uploaded ✅");
    setTitle("");
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  /** =========================
   * JOURNAL
   * ========================= */
  const handleAddJournal = async (e) => {
    e.preventDefault();
    if (!journalTitle || !journalContent)
      return toast.error("Enter title & content");

    setSavingJournal(true);

    const excerpt = journalContent.slice(0, 100) + "...";

    const { error } = await supabase.from("journal").insert([
      {
        title: journalTitle,
        content: journalContent,
        excerpt,
      },
    ]);

    setSavingJournal(false);

    if (error) return toast.error("Failed ❌");

    toast.success("Journal saved ✅");
    setJournalTitle("");
    setJournalContent("");
  };

  /** =========================
   * MESSAGES
   * ========================= */
  const handleFetchMessages = async () => {
    setLoadingMessages(true);

    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false });

    setLoadingMessages(false);

    if (error) return toast.error("Failed ❌");
    setMessages(data);
  };

  const handleDeleteMessage = async (id) => {
    const { error } = await supabase
      .from("messages")
      .delete()
      .eq("id", id);

    if (error) return toast.error("Delete failed ❌");

    setMessages((prev) => prev.filter((msg) => msg.id !== id));
    toast.success("Message deleted ✅");
  };

  /** =========================
   * LOGIN SCREEN
   * ========================= */
  if (!session) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <form
          onSubmit={handleLogin}
          className="bg-white p-8 rounded-xl shadow-md space-y-4 w-80"
        >
          <Toaster />
          <h2 className="text-xl font-bold text-center">Admin Login</h2>
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full border px-4 py-2 rounded-md"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full border px-4 py-2 rounded-md"
            required
          />
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-md"
          >
            Login
          </button>
        </form>
      </div>
    );
  }

  /** =========================
   * DASHBOARD
   * ========================= */
  return (
    <div className="pt-40 p-10 space-y-6">
      <Toaster />

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-md"
        >
          Logout
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4">
        {["showcase", "journal", "messages"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-md ${
              activeTab === tab
                ? "bg-green-500 text-white"
                : "bg-gray-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Showcase */}
      {activeTab === "showcase" && (
        <form
          onSubmit={handleUploadShowcase}
          className="bg-white p-6 rounded-xl shadow space-y-4"
        >
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border p-2 rounded"
          />
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => setFile(e.target.files[0])}
          />
          <button
            disabled={uploadingShowcase}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            {uploadingShowcase ? "Uploading..." : "Upload"}
          </button>
        </form>
      )}

      {/* Journal */}
      {activeTab === "journal" && (
        <form
          onSubmit={handleAddJournal}
          className="bg-white p-6 rounded-xl shadow space-y-4"
        >
          <input
            type="text"
            placeholder="Title"
            value={journalTitle}
            onChange={(e) => setJournalTitle(e.target.value)}
            className="w-full border p-2 rounded"
          />
          <textarea
            rows="5"
            placeholder="Content"
            value={journalContent}
            onChange={(e) => setJournalContent(e.target.value)}
            className="w-full border p-2 rounded"
          />
          <button
            disabled={savingJournal}
            className="bg-purple-500 text-white px-4 py-2 rounded"
          >
            {savingJournal ? "Saving..." : "Save"}
          </button>
        </form>
      )}

      {/* Messages */}
      {activeTab === "messages" && (
        <div className="bg-white p-6 rounded-xl shadow space-y-4">
          <button
            onClick={handleFetchMessages}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Load Messages
          </button>

          {messages.map((msg) => (
            <div key={msg.id} className="border p-3 rounded">
              <p className="font-bold">{msg.name}</p>
              <p className="text-sm">{msg.email}</p>
              <p>{msg.message}</p>
              <button
                onClick={() => handleDeleteMessage(msg.id)}
                className="text-red-500 mt-2"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
