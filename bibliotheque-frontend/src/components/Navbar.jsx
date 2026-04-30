import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-gray-800 text-white p-4">
        <ul className="flex space-x-4">
            <li><Link to="/" className="hover:text-blue-400">Home</Link></li>
            <li><Link to="/about" className="hover:text-blue-400">About</Link></li>
            <li><Link to="/contact" className="hover:text-blue-400">Contact</Link></li>
            <li><Link to="/services" className="hover:text-blue-400">Services</Link></li>
            <li><Link to="/blog" className="hover:text-blue-400">Blog   </Link></li>
            <li><Link to="/login" className="hover:text-blue-400">Login</Link></li>
            <li><Link to="/register" className="hover:text-blue-400">Register</Link></li>
        </ul>
      
    </nav>
  );
}