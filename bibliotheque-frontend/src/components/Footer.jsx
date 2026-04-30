import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white p-4">
      <div className="container mx-auto text-center">
        <p className="text-sm">© 2023 My Project. All rights reserved.</p>
        <ul className="flex justify-center space-x-4 mt-2">
          <li><a href="/privacy" className="hover:text-blue-400">Privacy Policy</a></li>
          <li><a href="/terms" className="hover:text-blue-400">Terms of Service</a></li>
          <li><a href="/contact" className="hover:text-blue-400">Contact Us</a></li>
          <p><Link to="/">Accueil</Link></p>
        </ul>
      </div>
    </footer>
  );
}