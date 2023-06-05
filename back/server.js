const express = require('express');
//ajout de mongoose
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const cors = require('cors');
// dotenv ajout mes info perso email.
require('dotenv').config();
const email = process.env.EMAIL;
const password = process.env.PASSWORD;


const app = express();
app.use(express.json());
app.use(cors());

//importation de mongoose db 
const dbURI = process.env.MONGOOSECONNECT;

mongoose.connect(dbURI)
  .then(() => {
    console.log('Connecté à la base de données MongoDB');
    // Ajoutez ici le reste de votre code du serveur

    // Configuration du transporteur de courriels
    const transporter = nodemailer.createTransport({
      service: 'Gmail', // Remplacez par le service de courrier électronique de votre choix
      auth: {
        user: email, // Remplacez par votre adresse email
        pass: password, // Remplacez par votre mot de passe
      },
    });

    app.post('/api/users', (req, res) => {
      // Récupérer les données de la requête
      const { username, email, password } = req.body;

      // Ici, vous pouvez ajouter la logique pour créer un nouvel utilisateur
      // Par exemple, vous pouvez utiliser une base de données pour stocker les informations de l'utilisateur

      // Exemple de code pour créer un nouvel utilisateur dans une base de données (simulé ici avec un objet JavaScript)
      const newUser = {
        username,
        email,
        password,
      };

      // Ajouter ici la logique pour enregistrer l'utilisateur dans la base de données

      // Répondre avec succès et renvoyer les informations de l'utilisateur créé
      res.status(200).json({ success: true, user: newUser });
    });

    // Route pour l'envoi de courriels
    app.post('/api/send-email', (req, res) => {
      const { recipient, subject, message } = req.body;

      const mailOptions = {
        from: email, // Remplacez par votre adresse email
        to: recipient,
        subject: subject,
        text: message,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(error);
          res.status(500).json({ success: false, message: "Une erreur s'est produite lors de l'envoi du courriel." });
        } else {
          console.log('Courriel envoyé:', info.response);
          res.status(200).json({ success: true, message: 'Courriel envoyé avec succès.' });
        }
      });
    });

    // Port d'écoute du serveur
    const port = process.env.PORT || 5000;
    app.listen(port, () => {
      console.log(`Le serveur est en écoute sur le port ${port}`);
    });
  })
  .catch((err) => {
    console.error('Erreur de connexion à la base de données MongoDB', err);
  });



