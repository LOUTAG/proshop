# PROSHOP : ECOMMERCE

- Utilisation de Redux Toolkit
- Gestion de l'authentification via la librairie jwt (nouvel accessToken via axios.interceptor si refreshToken toujours valide).
- Prise en main de l'API REST PAYPAL + Webhooks pour gérer le status des utilisateurs (abonnés ou non abonnés) si paiment réussi ou échoué.
- Premiers pas avec les websockets (socket.io) pour connaitre le nombre de visiteurs en ligne et découvrir la communication bi-directionnelle server <=> client via l'écoute et l'emit d'event.
- Utilisation de multer pour la gestion des formulaires form-data afin de récupérer, vérifier et sauvegarder des fichiers (Cela ne fonctionnera pas sur le site car Heroku ne permet pas d'uploader des fichiers sur le server.)
- Création de pdf (pdfkit) + render coté client sous la forme d'un arrayBuffer, transformé en blob puis converti en URL


### En cours de développement - version brouillon

Mise à jours : 27/08/2022