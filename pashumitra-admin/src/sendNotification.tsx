import React, { useState, useEffect } from "react";
import { useDataProvider, Loading, Error } from "react-admin";
import { Button, TextField, Select, MenuItem, TextareaAutosize } from "@mui/material";

export default function NotificationPage() {
  const dataProvider = useDataProvider();
  const [role, setRole] = useState("All");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const { data } = await dataProvider.getList("notifications", {
        pagination: { page: 1, perPage: 100 },
        sort: { field: "createdAt", order: "DESC" },
      });
      setNotifications(data);
      setLoading(false);
    } catch {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNotifications(); }, []);

  const handleSend = async () => {
    if (!title || !message) return alert("Fill title & message");
    setSending(true);
    try {
      await dataProvider.create("notifications/send", {
        data: { title, message, role: role === "All" ? null : role },
      });
      alert("Notification sent");
      setTitle(""); setMessage(""); setRole("All");
      fetchNotifications();
    } catch (err: any) {
      alert("Failed: " + err.message);
    }
    setSending(false);
  };

  const handleMarkRead = async (id: string) => {
    await dataProvider.update("notifications", { id, data: {} });
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, isRead: true } : n));
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete?")) return;
    await dataProvider.delete("notifications", { id });
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  if (loading) return <Loading />;

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Send Notification</h2>
      <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} fullWidth />
      <TextareaAutosize placeholder="Message" minRows={3} style={{ width: "100%" }} value={message} onChange={(e) => setMessage(e.target.value)} />
      <Select value={role} onChange={(e) => setRole(e.target.value)}>
        <MenuItem value="All">All</MenuItem>
        <MenuItem value="Doctor">Doctor</MenuItem>
        <MenuItem value="Farmer">Farmer</MenuItem>
        <MenuItem value="MedicalStore">MedicalStore</MenuItem>
      </Select>
      <Button variant="contained" color="primary" onClick={handleSend} disabled={sending}>
        {sending ? "Sending..." : "Send Notification"}
      </Button>

      <h2>Notifications</h2>
      <ul>
        {notifications.map((n) => (
          <li key={n.id}>
            <b>{n.title}</b> - {n.message} [{n.isRead ? "Read" : "Unread"}]
            <Button onClick={() => handleMarkRead(n.id)}>Mark Read</Button>
            <Button color="error" onClick={() => handleDelete(n.id)}>Delete</Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
