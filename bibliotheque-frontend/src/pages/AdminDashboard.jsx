"use client";

import { useEffect, useMemo, useState } from "react";
import { api } from "../api/axios";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  // ================= EDIT STATES =================
  const [editingUser, setEditingUser] = useState(null);
  const [editingBook, setEditingBook] = useState(null);

  // ================= SECURITY =================
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      window.location.href = "/login";
    }
  }, []);

  // ================= FETCH =================
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [u, b] = await Promise.all([api.get("/users"), api.get("/livres")]);
      setUsers(u.data);
      setBooks(b.data);
    } catch (err) {
      console.error(err);
      setError("Erreur de chargement des données");
    } finally {
      setLoading(false);
    }
  };

  // ================= LOGOUT =================
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  // ================= STATS =================
  const stats = useMemo(() => ({
    totalUsers: users.length,
    totalBooks: books.length,
    admins: users.filter(u => u.role === "admin").length,
    employes: users.filter(u => u.role === "employe").length,
    lowStock: books.filter(b => b.stock <= 5),
    recentUsers: [...users].slice(-5).reverse(),
  }), [users, books]);

  // ================= USERS =================
  const deleteUser = async (id) => {
    if (!confirm("Supprimer cet utilisateur ?")) return;
    try {
      await api.delete(`/users/${id}`);
      setUsers(prev => prev.filter(u => u._id !== id));
    } catch (err) {
      console.error("Erreur suppression utilisateur:", err.response?.data || err.message);
      alert("Impossible de supprimer l'utilisateur. Vérifiez la console.");
    }
  };

  const saveUser = async () => {
    try {
      await api.put(`/users/${editingUser._id}`, editingUser);
      setEditingUser(null);
      loadData();
    } catch (err) {
      console.error("Erreur mise à jour utilisateur:", err.response?.data || err.message);
      alert("Impossible de sauvegarder les modifications.");
    }
  };

  // ================= BOOKS =================
  const deleteBook = async (id) => {
    if (!confirm("Supprimer ce livre ?")) return;
    try {
      await api.delete(`/livres/${id}`);
      setBooks(prev => prev.filter(b => b._id !== id));
    } catch (err) {
      console.error("Erreur suppression livre:", err.response?.data || err.message);
      alert("Impossible de supprimer le livre. Vérifiez la console.");
    }
  };

  const saveBook = async () => {
    try {
      await api.put(`/livres/${editingBook._id}`, editingBook);
      setEditingBook(null);
      loadData();
    } catch (err) {
      console.error("Erreur mise à jour livre:", err.response?.data || err.message);
      alert("Impossible de sauvegarder les modifications.");
    }
  };

  // ================= UI =================
  const NavButton = ({ label, tab }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`px-5 py-2 rounded-full font-semibold ${
        activeTab === tab ? "bg-blue-700 text-white" : "bg-blue-100 text-blue-700"
      }`}
    >
      {label}
    </button>
  );

  const StatCard = ({ title, value }) => (
    <div className="p-6 rounded-xl shadow bg-gradient-to-r from-indigo-500 to-cyan-500 text-white">
      <p className="text-sm">{title}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-blue-600 font-bold">
        Chargement...
      </div>
    );
  }

  return (
    <div className="min-h-screen p-10 bg-slate-100">
      {/* HEADER */}
      <div className="flex justify-between mb-8">
        <h1 className="text-4xl font-bold text-blue-900">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      {/* NAV */}
      <div className="flex gap-4 mb-8">
        <NavButton label="Dashboard" tab="dashboard" />
        <NavButton label="Users" tab="users" />
        <NavButton label="Books" tab="books" />
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {/* ================= DASHBOARD ================= */}
      {activeTab === "dashboard" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard title="Total Users" value={stats.totalUsers} />
            <StatCard title="Admins" value={stats.admins} />
            <StatCard title="Employés" value={stats.employes} />
            <StatCard title="Total Books" value={stats.totalBooks} />
          </div>

          {stats.lowStock.length > 0 && (
            <div className="mt-8 bg-red-100 p-5 rounded">
              <h3 className="font-bold text-red-700 mb-2">⚠ Stock faible</h3>
              {stats.lowStock.map(b => (
                <p key={b._id}>{b.titre} — {b.stock}</p>
              ))}
            </div>
          )}
        </>
      )}

      {/* ================= USERS ================= */}
      {activeTab === "users" && (
        <>
          <input
            placeholder="Recherche..."
            className="mb-4 p-2 border rounded w-full"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />

          <table className="w-full bg-white shadow rounded">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-3">Nom</th>
                <th className="p-3">Prénom</th>
                <th className="p-3">Email</th>
                <th className="p-3">Rôle</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users
                .filter(u =>
                  `${u.nom} ${u.prenom} ${u.email}`.toLowerCase().includes(search.toLowerCase())
                )
                .map(u => (
                  <tr key={u._id} className="border-b">
                    <td className="p-3">{u.nom}</td>
                    <td className="p-3">{u.prenom}</td>
                    <td className="p-3">{u.email}</td>
                    <td className="p-3">{u.role}</td>
                    <td className="p-3 space-x-2">
                      <button
                        onClick={() => setEditingUser({ ...u })}
                        className="text-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteUser(u._id)}
                        className="text-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </>
      )}

      {/* ================= BOOKS ================= */}
      {activeTab === "books" && (
        <>
          <table className="w-full bg-white shadow rounded">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-3">Titre</th>
                <th className="p-3">Auteur</th>
                <th className="p-3"></th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map(b => (
                <tr key={b._id} className="border-b">
                  <td className="p-3">{b.titre}</td>
                  <td className="p-3">{b.auteur}</td>
                  <td className={`p-3 ${b.stock <= 5 ? "text-red-600 font-bold" : ""}`}>
                    {b.stock}
                  </td>
                  <td className="p-3 space-x-2">
                    <button
                      onClick={() => setEditingBook({ ...b })}
                      className="text-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteBook(b._id)}
                      className="text-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* ================= EDIT USER MODAL ================= */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-96">
            <h3 className="font-bold mb-4">Edit User</h3>
            {["nom", "prenom", "email", "role"].map(f => (
              <input
                key={f}
                value={editingUser[f]}
                onChange={e => setEditingUser({ ...editingUser, [f]: e.target.value })}
                className="w-full mb-2 p-2 border rounded"
                placeholder={f}
              />
            ))}
            <div className="flex justify-end gap-2">
              <button onClick={() => setEditingUser(null)}>Cancel</button>
              <button onClick={saveUser} className="text-blue-600">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* ================= EDIT BOOK MODAL ================= */}
      {editingBook && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-96">
            <h3 className="font-bold mb-4">Edit Book</h3>
            {["titre", "auteur", "stock"].map(f => (
              <input
                key={f}
                value={editingBook[f]}
                onChange={e => setEditingBook({ ...editingBook, [f]: e.target.value })}
                className="w-full mb-2 p-2 border rounded"
                placeholder={f}
              />
            ))}
            <div className="flex justify-end gap-2">
              <button onClick={() => setEditingBook(null)}>Cancel</button>
              <button onClick={saveBook} className="text-blue-600">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
