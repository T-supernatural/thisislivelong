import { useState, useEffect, useRef } from "react";
import { supabase } from "../supabaseClient";
import { v4 as uuidv4 } from "uuid";
import toast, { Toaster } from "react-hot-toast";

export default function AdminPage() {
  const [session, setSession] = useState(null);
  const [activeTab, setActiveTab] = useState("showcase");

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

  // Check session on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  /** ADMIN AUTH FLOW **/

  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password?.value; // if using signInWithPassword
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return toast.error("Login failed ❌");
    toast.success("Logged in ✅");
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) return toast.error("Logout failed ❌");
    setSession(null);
    toast.success("Logged out ✅");
  };

  /** SHOWCASE FLOW **/

  const handleUploadShowcase = async (e) => {
    e.preventDefault();
    if (!file || !title) return toast.error("Enter title & choose file");

    setUploadingShowcase(true);
    const fileName = `${uuidv4()}-${file.name}`;
    const { error: uploadError } = await supabase.storage.from("showcase-images").upload(fileName, file);
    if (uploadError) {
      setUploadingShowcase(false);
      return toast.error("Upload failed ❌");
    }

    const { data: urlData, error: urlError } = await supabase.storage.from("showcase-images").getPublicUrl(fileName);
    if (urlError) {
      setUploadingShowcase(false);
      return toast.error("Failed to get URL ❌");
    }

    const { error: dbError } = await supabase.from("showcase").insert([{ title, image_url: urlData.publicUrl }]);
    setUploadingShowcase(false);
    if (dbError) return toast.error("DB insert failed ❌");

    toast.success("Showcase uploaded ✅");
    setTitle(""); setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  /** JOURNAL FLOW **/

  const handleAddJournal = async (e) => {
    e.preventDefault();
    if (!journalTitle || !journalContent) return toast.error("Enter title & content");

    setSavingJournal(true);
    const excerpt = journalContent.slice(0, 100) + "...";
    const { error } = await supabase.from("journal").insert([{ title: journalTitle, content: journalContent, excerpt }]);
    setSavingJournal(false);
    if (error) return toast.error("Failed ❌");

    toast.success("Journal saved ✅");
    setJournalTitle(""); setJournalContent("");
  };

  /** MESSAGES **/

  const handleFetchMessages = async () => {
    setLoadingMessages(true);
    const { data, error } = await supabase.from("messages").select("*").order("created_at", { ascending: false });
    setLoadingMessages(false);
    if (error) return toast.error("Failed ❌");
    setMessages(data);
  };

  const handleDeleteMessage = async (id) => {
    const { error } = await supabase.from("messages").delete().eq("id", id);
    if (error) return toast.error("Delete failed ❌");
    setMessages(messages.filter((msg) => msg.id !== id));
    toast.success("Message deleted ✅");
  };

  /** RENDER **/

  if (!session) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow-md space-y-4 w-80">
          <Toaster />
          <h2 className="text-xl font-bold text-center">Admin Login</h2>
          <input type="email" name="email" placeholder="Email" className="w-full border px-4 py-2 rounded-md" required />
          <input type="password" name="password" placeholder="Password" className="w-full border px-4 py-2 rounded-md" required />
          <button type="submit" className="w-full bg-green-600 text-white py-2 rounded-md">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div className="pt-40 p-10 space-y-6">
      <Toaster />
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">Logout</button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6">
        {["showcase", "journal", "messages"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-2 px-4 rounded-t-md font-semibold ${activeTab === tab ? "bg-green-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      {activeTab === "showcase" && (
        <form onSubmit={handleUploadShowcase} className="bg-white p-6 rounded-xl shadow-md space-y-4">
          <h2 className="font-semibold text-xl">Upload Showcase</h2>
          <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} className="w-full border px-4 py-2 rounded-md" />
          <input type="file" ref={fileInputRef} onChange={e => setFile(e.target.files[0])} className="w-full" />
          <button type="submit" disabled={uploadingShowcase} className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 disabled:opacity-50">{uploadingShowcase ? "Uploading..." : "Upload"}</button>
        </form>
      )}

      {activeTab === "journal" && (
        <form onSubmit={handleAddJournal} className="bg-white p-6 rounded-xl shadow-md space-y-4">
          <h2 className="font-semibold text-xl">Add Journal</h2>
          <input type="text" placeholder="Title" value={journalTitle} onChange={e => setJournalTitle(e.target.value)} className="w-full border px-4 py-2 rounded-md" />
          <textarea placeholder="Content" value={journalContent} onChange={e => setJournalContent(e.target.value)} className="w-full border px-4 py-2 rounded-md" rows={5}></textarea>
          <button type="submit" disabled={savingJournal} className="w-full bg-purple-500 text-white py-2 rounded-md hover:bg-purple-600 disabled:opacity-50">{savingJournal ? "Saving..." : "Save"}</button>
        </form>
      )}

      {activeTab === "messages" && (
        <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
          <h2 className="font-semibold text-xl">Messages</h2>
          <button onClick={handleFetchMessages} disabled={loadingMessages} className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 disabled:opacity-50">{loadingMessages ? "Loading..." : "View Messages"}</button>
          {messages.length === 0 ? <p className="text-gray-600 mt-2">No messages yet.</p> :
            messages.map(msg => (
              <div key={msg.id} className="border p-3 rounded-md flex justify-between bg-gray-50 shadow-sm mt-2">
                <div>
                  <p className="font-semibold">{msg.name}</p>
                  <p className="text-sm text-gray-600">{msg.email}</p>
                  <p className="mt-1">{msg.message}</p>
                </div>
                <button onClick={() => handleDeleteMessage(msg.id)} className="text-red-500 hover:underline ml-4">Delete</button>
              </div>
            ))
          }
        </div>
      )}
    </div>
  );
}
