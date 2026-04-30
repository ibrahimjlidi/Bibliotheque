"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { api } from "../api/axios"
import { motion, AnimatePresence } from "framer-motion"
const BACKEND_URL = "http://localhost:3001";

const EmployeDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [books, setBooks] = useState([])
  const [categories, setCategories] = useState([])
  const [reservations, setReservations] = useState([])

  const [showBookModal, setShowBookModal] = useState(false)
  const [bookForm, setBookForm] = useState({
    titre: "",
    auteur: "",
    isbn: "",
    langue: "",
    categorie: "",
    prix: "",
    stock: "",
    description: "",
    image: null, // image field
  })
  const [previewImage, setPreviewImage] = useState(null) // for preview

  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [categoryForm, setCategoryForm] = useState({
    nom: "",
    description: "",
    codeClassification: "",
  })

  const [profile, setProfile] = useState({ nom: "", prenom: "", email: "" })

  const navigate = useNavigate()
  const token = localStorage.getItem("token")

  useEffect(() => {
    if (!token) return navigate("/login")
    fetchBooks()
    fetchCategories()
    fetchReservations()
    fetchProfile()
  }, [])

  // --- Fetch Books ---
  const fetchBooks = async () => {
    try {
      const res = await api.get("/livres", {
        headers: { Authorization: `Bearer ${token}` },
      })
      setBooks(res.data || [])
    } catch (err) {
      console.error("Failed to fetch books:", err)
    }
  }

  // --- Fetch Categories ---
  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories", {
        headers: { Authorization: `Bearer ${token}` },
      })
      setCategories(res.data || [])
    } catch (err) {
      console.error("Failed to fetch categories:", err)
    }
  }

  // --- Fetch Reservations ---
  const fetchReservations = async () => {
    try {
      const res = await api.get("/reservations", {
        headers: { Authorization: `Bearer ${token}` },
      })
      setReservations(res.data || [])
    } catch (err) {
      console.error("Failed to fetch reservations:", err)
    }
  }

  // --- Confirm Reservation ---
  const handleConfirmReservation = async (id) => {
    try {
      await api.put(`/reservations/confirmer/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      })
      fetchReservations()
      fetchBooks()
    } catch (err) {
      console.error(err)
      alert("Failed to confirm reservation.")
    }
  }

  // --- Cancel Reservation ---
  const handleCancelReservation = async (id) => {
    if (!window.confirm("Annuler cette réservation ?")) return
    try {
      await api.delete(`/reservations/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      fetchReservations()
      fetchBooks()
    } catch (err) {
      console.error(err)
      alert("Failed to cancel reservation.")
    }
  }

  // --- Fetch Profile ---
  const fetchProfile = async () => {
    try {
      const res = await api.get("/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      setProfile(res.data)
    } catch (err) {
      console.error("Failed to fetch profile:", err)
    }
  }

  // --- Logout ---
  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/login")
  }

  // --- Create Category ---
  const handleCreateCategory = async (e) => {
    e.preventDefault()
    if (!categoryForm.nom || !categoryForm.codeClassification) {
      alert("Name and Code Classification are required.")
      return
    }
    try {
      await api.post("/categories", categoryForm, {
        headers: { Authorization: `Bearer ${token}` },
      })
      fetchCategories()
      setShowCategoryModal(false)
      setCategoryForm({ nom: "", description: "", codeClassification: "" })
    } catch (err) {
      console.error(err)
      alert(err.response?.data?.message || "Failed to create category.")
    }
  }

  // --- Create Book with image ---
  const handleCreateBook = async (e) => {
    e.preventDefault()
    if (!bookForm.titre || !bookForm.auteur || !bookForm.isbn || !bookForm.langue || !bookForm.categorie) {
      alert("Please fill all required fields.")
      return
    }

    try {
      const formData = new FormData()
      for (let key in bookForm) {
        if (bookForm[key] !== null) {
          formData.append(key, bookForm[key])
        }
      }

      await api.post("/livres", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })

      fetchBooks()
      setShowBookModal(false)
      setBookForm({
        titre: "",
        auteur: "",
        isbn: "",
        langue: "",
        categorie: "",
        prix: "",
        stock: "",
        description: "",
        image: null,
      })
      setPreviewImage(null)
    } catch (err) {
      console.error(err)
      alert(err.response?.data?.message || "Failed to create book.")
    }
  }

  const sidebarItems = [
    { id: "dashboard", name: "Dashboard", icon: "📊" },
    { id: "books", name: "Books", icon: "📚" },
    { id: "categories", name: "Categories", icon: "📁" },
    { id: "reservations", name: "Reservations", icon: "📝" },
  ]

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200">
      {/* Sidebar */}
      <div className="w-64 bg-blue-900 text-white shadow-xl flex flex-col justify-between rounded-r-2xl">
        <div>
          <div className="p-6 flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center text-white font-bold">
              EP
            </div>
            <span className="text-xl font-semibold">Employee Panel</span>
          </div>
          <nav className="mt-6">
            {sidebarItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-6 py-3 cursor-pointer rounded-r-xl transition-all duration-200 flex items-center gap-3 ${
                  activeTab === item.id ? "bg-blue-700 shadow-inner font-semibold" : "hover:bg-blue-800"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.name}</span>
              </div>
            ))}
          </nav>
        </div>

        {/* Logout */}
        <div className="p-4">
          <button
            onClick={handleLogout}
            className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 
                       text-white px-4 py-3 rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
          >
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-auto">
        {/* Dashboard */}
        {activeTab === "dashboard" && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <h1 className="text-3xl font-bold text-blue-900 mb-6">📊 Employee Dashboard</h1>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
                <h2 className="text-lg font-semibold text-gray-700">Total Books</h2>
                <p className="text-4xl font-bold text-blue-600 mt-2">{books.length}</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
                <h2 className="text-lg font-semibold text-gray-700">Low Stock</h2>
                <p className="text-4xl font-bold text-yellow-500 mt-2">
                  {books.filter((b) => b.stock < 5).length}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowBookModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow-lg transition flex items-center gap-2"
            >
              ➕ Add New Book
            </button>
          </motion.div>
        )}

        {/* Books Management */}
        {activeTab === "books" && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <h1 className="text-2xl font-bold text-blue-900 mb-6">📚 Books Management</h1>
            <button
              onClick={() => setShowBookModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow-lg transition flex items-center gap-2 mb-6"
            >
              ➕ Add New Book
            </button>
            <div className="bg-white rounded-2xl shadow p-6 overflow-auto">
              <ul>
                {books.length === 0 && <li className="text-gray-500">No books found.</li>}
                {books.map((book) => (
                  <li key={book._id} className="flex justify-between items-center py-2 border-b gap-3">
                    <div className="flex items-center gap-3">
                      {book.image && (
                        <img src={book.image.startsWith("http") ? book.image : `${BACKEND_URL}${book.image}`} alt={book.titre} className="w-12 h-12 object-cover rounded" />
                      )}
                      <div>
                        <span className="font-semibold">{book.titre}</span> by {book.auteur} 
                        <span className="ml-2 text-gray-400 text-xs">({book.isbn})</span>
                    
                      </div>
                    </div>
                    <span className="text-xs text-blue-700">{book.langue}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}

        {/* Reservations Management */}
        {activeTab === "reservations" && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <h1 className="text-2xl font-bold text-blue-900 mb-6">📝 Reservations Management</h1>
            <div className="bg-white rounded-2xl shadow p-6 overflow-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b">
                    <th className="py-2">Book</th>
                    <th className="py-2">Student</th>
                    <th className="py-2">Status</th>
                    <th className="py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reservations.length === 0 && (
                    <tr>
                      <td colSpan="4" className="py-4 text-center text-gray-500">No reservations found.</td>
                    </tr>
                  )}
                  {reservations.map((res) => (
                    <tr key={res._id} className="border-b hover:bg-gray-50 transition">
                      <td className="py-3">
                        <div className="font-semibold">{res.livre?.titre || "N/A"}</div>
                        <div className="text-xs text-gray-400">{res.livre?.auteur}</div>
                      </td>
                      <td className="py-3">
                        {res.utilisateur?.nom} {res.utilisateur?.prenom}
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                          res.statutReservation === "confirmée" ? "bg-green-100 text-green-700" :
                          res.statutReservation === "annulée" ? "bg-red-100 text-red-700" :
                          "bg-yellow-100 text-yellow-700"
                        }`}>
                          {res.statutReservation}
                        </span>
                      </td>
                      <td className="py-3 flex gap-2">
                        {res.statutReservation === "en attente" && (
                          <button
                            onClick={() => handleConfirmReservation(res._id)}
                            className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs transition"
                          >
                            Confirm
                          </button>
                        )}
                        <button
                          onClick={() => handleCancelReservation(res._id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs transition"
                        >
                          Cancel
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>

      {/* Book Modal */}
      <AnimatePresence>
        {showBookModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowBookModal(false)}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg overflow-auto"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-semibold mb-4 text-blue-700">Add New Book</h3>
              <form className="space-y-4" onSubmit={handleCreateBook}>
                <input type="text" placeholder="Title" value={bookForm.titre} onChange={(e) => setBookForm({ ...bookForm, titre: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" required />
                <input type="text" placeholder="Author" value={bookForm.auteur} onChange={(e) => setBookForm({ ...bookForm, auteur: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" required />
                <input type="text" placeholder="ISBN" value={bookForm.isbn} onChange={(e) => setBookForm({ ...bookForm, isbn: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" required />
                <input type="text" placeholder="Language" value={bookForm.langue} onChange={(e) => setBookForm({ ...bookForm, langue: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" required />
                <select value={bookForm.categorie} onChange={(e) => setBookForm({ ...bookForm, categorie: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" required>
                  <option value="">Select Category</option>
                  {categories.map((cat) => <option key={cat._id} value={cat._id}>{cat.nom}</option>)}
                </select>
                <input type="number" placeholder="Price" value={bookForm.prix} onChange={(e) => setBookForm({ ...bookForm, prix: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                <input type="number" placeholder="Stock" value={bookForm.stock} onChange={(e) => setBookForm({ ...bookForm, stock: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                <textarea placeholder="Description" value={bookForm.description} onChange={(e) => setBookForm({ ...bookForm, description: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />

                {/* IMAGE UPLOAD */}
                <input type="file" accept="image/*" onChange={(e) => {
                  setBookForm({ ...bookForm, image: e.target.files[0] })
                  setPreviewImage(URL.createObjectURL(e.target.files[0]))
                }} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                {previewImage && <img src={previewImage} alt="Preview" className="w-32 h-32 object-cover rounded mt-2" />}

                <div className="flex gap-3 pt-4">
                  <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow">Create Book</button>
                  <button type="button" onClick={() => { setShowBookModal(false); setPreviewImage(null); }} className="flex-1 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg">Cancel</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default EmployeDashboard
