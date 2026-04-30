const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const connectDB = require('./src/config/db');
const User = require('./src/models/User');
const Livre = require('./src/models/Livre');
const Categorie = require('./src/models/Categorie');
const Exemplaire = require('./src/models/Exemplaire');

dotenv.config();

const seed = async () => {
  try {
    await connectDB();

    console.log('Nettoyage des collections...');
    await Promise.all([
      User.deleteMany(),
      Categorie.deleteMany(),
      Livre.deleteMany(),
      Exemplaire.deleteMany(),
    ]);

    const passwordHash = await bcrypt.hash('Password123!', 10);

    const users = [
      {
        nom: 'Admin',
        prenom: 'Super',
        email: 'admin@example.com',
        motDePasse: passwordHash,
        role: 'admin',
        statut: 'actif',
      },
      {
        nom: 'Leila',
        prenom: 'Khalil',
        email: 'employe@example.com',
        motDePasse: passwordHash,
        role: 'employe',
        statut: 'actif',
        matricule: 'EMP001',
        departement: 'Gestion',
        roleEmploye: 'Bibliothécaire',
      },
      {
        nom: 'Sofia',
        prenom: 'Amine',
        email: 'etudiant@example.com',
        motDePasse: passwordHash,
        role: 'etudiant',
        statut: 'actif',
        numeroEtudiant: 'ETU12345',
        filiere: 'Informatique',
        niveauEtude: 'Licence 2',
        maxEmprunts: 5,
      },
      {
        nom: 'Pierre',
        prenom: 'Dupont',
        email: 'fournisseur@example.com',
        motDePasse: passwordHash,
        role: 'supplier',
        statut: 'actif',
        nomEntreprise: 'Books Distribution SARL',
        siret: '12345678900010',
        adresseEntreprise: '12 Rue de la Bibliothèque, Paris',
        contactPrincipal: 'Pierre Dupont',
      },
    ];

    const categories = [
      {
        nom: 'Informatique',
        description: 'Ouvrages sur les technologies, le code et les systèmes d\'information.',
        codeClassification: 'INF-001',
      },
      {
        nom: 'Littérature',
        description: 'Romans, poésie et essais littéraires.',
        codeClassification: 'LIT-002',
      },
    ];

    const createdUsers = await User.insertMany(users);
    const createdCategories = await Categorie.insertMany(categories);

    const livres = [
      {
        titre: 'Introduction à Node.js',
        auteur: 'Nadia Benali',
        isbn: 9782100123456,
        statutLivre: 'disponible',
        anneePublication: new Date('2021-05-10'),
        editeur: 'OpenSource Press',
        langue: 'Français',
        description: 'Guide pratique pour débuter avec Node.js et développer des API.',
        image: '/uploads/1755547251851-image.jpg',
      },
      {
        titre: 'Les mystères de Paris',
        auteur: 'Eugène Sue',
        isbn: 9782234567890,
        statutLivre: 'disponible',
        anneePublication: new Date('1843-01-01'),
        editeur: 'Classiques Français',
        langue: 'Français',
        description: 'Roman historique et feuilleton de l\'époque romantique.',
        image: '/uploads/1755547259946-image.jpg',
      },
      {
        titre: 'The Future of AI',
        auteur: 'Dr. Alan Turing',
        isbn: 1112223334445,
        statutLivre: 'disponible',
        anneePublication: new Date('2025-01-01'),
        editeur: 'Cyberdyne Systems',
        langue: 'Anglais',
        description: 'An in-depth look at neural networks and the evolution of intelligence.',
        image: '/uploads/ai_future.png',
      },
      {
        titre: 'The Quiet Strength of Trees',
        auteur: 'Anna Forestier',
        isbn: 2223334445556,
        statutLivre: 'disponible',
        anneePublication: new Date('2023-06-12'),
        editeur: 'Earthy Reads',
        langue: 'Français',
        description: 'Nature inspired philosophy for a better life.',
        image: '/uploads/quiet_trees.png',
      },
      {
        titre: 'Vibrant Echoes',
        auteur: 'Marc Lavoie',
        isbn: 3334445556667,
        statutLivre: 'disponible',
        anneePublication: new Date('2024-11-20'),
        editeur: 'Art Nouveau',
        langue: 'Français',
        description: 'A study of modern abstract art through the decades.',
        image: '/uploads/vibrant_echoes.png',
      },
      {
        titre: 'The Midnight Lighthouse',
        auteur: 'H.P. Lovecraft',
        isbn: 4445556667778,
        statutLivre: 'disponible',
        anneePublication: new Date('2022-10-31'),
        editeur: 'Arkham House',
        langue: 'Anglais',
        description: 'A dark mystery that unfolds on the shores of New England.',
        image: '/uploads/midnight_lighthouse.png',
      },
      {
        titre: 'Recipes for the Soul',
        auteur: 'Maria Rossi',
        isbn: 5556667778889,
        statutLivre: 'disponible',
        anneePublication: new Date('2024-03-15'),
        editeur: 'Tuscan Flavors',
        langue: 'Italien',
        description: 'Comfort food recipes that nourish both the body and the spirit.',
        image: '/uploads/recipes_soul.png',
      },
    ];

    const createdLivres = await Livre.insertMany(livres);

    const exemplaires = [
      {
        IdExemplaire: 'EX-001',
        etat: 'Neuf',
        disponible: true,
        livreId: createdLivres[0]._id,
        dateAcquisition: new Date('2024-01-15'),
      },
      {
        IdExemplaire: 'EX-002',
        etat: 'Bon',
        disponible: true,
        livreId: createdLivres[1]._id,
        dateAcquisition: new Date('2024-02-20'),
      },
      {
        IdExemplaire: 'EX-003',
        etat: 'Neuf',
        disponible: true,
        livreId: createdLivres[2]._id,
        dateAcquisition: new Date('2025-02-01'),
      },
      {
        IdExemplaire: 'EX-004',
        etat: 'Neuf',
        disponible: true,
        livreId: createdLivres[3]._id,
        dateAcquisition: new Date('2024-05-10'),
      },
      {
        IdExemplaire: 'EX-005',
        etat: 'Neuf',
        disponible: true,
        livreId: createdLivres[4]._id,
        dateAcquisition: new Date('2024-12-05'),
      },
      {
        IdExemplaire: 'EX-006',
        etat: 'Usé',
        disponible: true,
        livreId: createdLivres[5]._id,
        dateAcquisition: new Date('2023-11-01'),
      },
      {
        IdExemplaire: 'EX-007',
        etat: 'Neuf',
        disponible: true,
        livreId: createdLivres[6]._id,
        dateAcquisition: new Date('2024-04-01'),
      },
    ];

    const createdExemplaires = await Exemplaire.insertMany(exemplaires);

    console.log('Données insérées avec succès :');
    console.log(`- Utilisateurs : ${createdUsers.length}`);
    console.log(`- Catégories : ${createdCategories.length}`);
    console.log(`- Livres : ${createdLivres.length}`);
    console.log(`- Exemplaires : ${createdExemplaires.length}`);

    process.exit(0);
  } catch (error) {
    console.error('Erreur lors du seeding :', error);
    process.exit(1);
  }
};

seed();
