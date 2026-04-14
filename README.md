# VivaVistaTV — Application IPTV complète avec Stripe, Clerk & Prisma

## 1. Description du projet
VivaVistaTV est une plateforme IPTV moderne permettant aux utilisateurs d’acheter des abonnements en ligne, de recevoir un code d'activation instantané via Stripe, puis d’activer leur service IPTV en quelques secondes.
Le système inclut également une interface d’administration, un historique d’achats, une gestion des abonnements, un webhook Stripe fiable et une architecture sécurisée basée sur Next.js 16.

- parcourir les différents **plans IPTV** (Essai 24h, 1 mois, 6 mois, 1 an, etc.) ;
- payer en toute sécurité via **Stripe Checkout** ;
- recevoir automatiquement un **code d’activation** ;
- activer ce code sur la page `/activer` pour lier l’abonnement à leur compte ;
- consulter leurs abonnements actifs et l’historique sur `/mes-abonnements`.

Les administrateurs peuvent :

- voir la liste des **abonnements** et des **paiements Stripe** ;
- consulter les **codes d’activation** générés ;
- suivre le statut des abonnements (PENDING, ACTIVE, EXPIRED).

Ce projet a été réalisé dans le cadre du cours **[nom du cours]** au Collège de Maisonneuve.

---
## 1. Fonctionnalités principales
### Frontend

- **Next.js 16** (App Router)
- **React 18**
- **TypeScript**
- **Tailwind CSS** pour le style
- **Clerk** pour l’authentification (sign-up / sign-in / gestion de session)

### Backend / API

- API routes **`/app/api/...`** de Next.js (route handlers)
- **Stripe** (Checkout + Webhook sécurisé) pour les paiements
- **Prisma ORM** pour accéder à la base de données
- **PostgreSQL (Neon)** comme base de données hébergée

### Autres

- Prisma Studio pour visualiser les données
- Git / GitHub pour le contrôle de version

---
 ### 1.1 Fonctionnalités utilisateur

- Parcourir les plans IPTV (1 mois, 3 mois, Premium, Essai 24h, etc.)

- Paiement sécurisé via Stripe Checkout

- Génération automatique d’un code d’activation unique

- Activation du code via /activer

- Espace personnel :

    - Voir les abonnements

    - Voir le statut (Actif / En attente / Expiré)

    - Voir la date d’expiration

    - Renouveler ou annuler

- Historique complet des achats

- Interface moderne et responsive

### 1.2 Fonctionnalités administrateur

- Tableau de bord admin

- Liste de tous les abonnements du système

- Filtrage (active, pending, expired)

- Table des codes d’activation

- Suivi des Webhooks Stripe

- Vue détaillée de chaque utilisateur

````bash 
VivaVistaTV
│
├── Frontend (Next.js 16 - App Router)
│   ├── Pages Plans, Abonnements, Profil, Activation, live
│   ├── Composants UI (Header, Footer, Dashboard Cards)
│   ├── Authentification Clerk
│   └── Appels API sécurisés
│
├── Backend (Next.js API Routes)
│   ├── /api/plans
│   ├── /api/subscriptions
│   ├── /api/activation
│   ├── /api/stripe/checkout
│   └── /api/stripe/webhook  ← RAW BODY Stripe
│
├── Base de données (Neon PostgreSQL)
│   ├── Utilisateurs (Clerk sync)
│   ├── Plans IPTV
│   ├── Abonnements
│   ├── Codes d’activation
│   └── Audit Stripe
│
└── ORM (Prisma)

````
## Technologies utilisées

| Technologie                    | Rôle                                |
| ------------------------------ | ----------------------------------- |
| **Next.js 16**                 | Frontend + Backend unifiés          |
| **Stripe Checkout & Webhooks** | Paiements + génération abonnement   |
| **Clerk Auth**                 | Connexion, gestion des utilisateurs |
| **Prisma ORM**                 | Accès DB, migrations                |
| **NeonDB**                     | PostgreSQL Cloud                    |
| **TypeScript**                 | Sécurisation du code                |
| **TailwindCSS**                | Interface moderne                   |
| **React**                      | Composants                          |

### Modèle de données (Prisma)
- User
````bash 
id, clerkId, email, role, displayName, avatarUrl, createdAt

````
- Subscription
````bash
id, userId, planId, status (PENDING|ACTIVE|EXPIRED),
startDate, endDate,
stripeSessionId, stripePaymentIntentId

````
- ActivationCode
````bash
id, code (unique), status (AVAILABLE|USED), assignedAt, subscriptionId

````
- PlanTarifair
````bash
id, nomPlan, prix, dureeJours, description

````
### Sécurité
- webhook Stripe validé par signature HMAC

- bodyParser désactivé uniquement sur l’endpoint Stripe

- Clerk protège les pages sensibles

- Prisma protège contre injections SQL

- Redirections sécurisées après paiement

### Flux Stripe
````bash
Utilisateur choisit un plan
        ↓
/api/stripe/checkout
        ↓
Stripe Checkout s’ouvre
        ↓
Paiement réussi
        ↓
Webhook Stripe reçoit l’événement
        ↓
Prisma crée un abonnement avec:
     • status = PENDING
     • activationCode = AVAILABLE
        ↓
L’utilisateur est redirigé vers /mes-abonnements

````
### Flux d’activation IPTV
````css
Utilisateur reçoit son code
        ↓
Page /activer
        ↓
Vérification:
    - code existe ?
    - code déjà utilisé ?
    - abonnement expiré ?
        ↓
Si OK :
    → status = ACTIVE
    → startDate = now()
    → endDate = now() + durée plan
    → activationCode.status = USED
        ↓
Affichage page de succès

````
### Compte de test
**Clerk Test Account**

````bash
Email : test@example.com
Mot de passe : Test1234!

````
**Stripe Test Card**
````bash
4242 4242 4242 4242
Date future
CVC : 123

````
### Installation du projet
**Cloner le repo**
````sh
git clone https://github.com/ton-compte/vivavistatv.git
cd vivavistatv

````
**Installer les dépendances**
````bash
npm install
````
**Ajouter le fichier** .env

````env
DATABASE_URL=postgresql://xxx
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
NEXT_PUBLIC_APP_URL=http://localhost:3000

````
```bash
#instalation nexjs + clerk + prisma+ zod
npx create-next-app@latest vivavistatv
npm install @prisma/client prisma zod @clerk/nextjs
#prisma
npx prisma init
npx prisma format
npx prisma migrate dev --name init
npx prisma studio
# pour aller vite de lancer prisma directement 
npm install prisma@latest @prisma/client@latest @prisma/adapter-pg@latest pg
#----------------------
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
#Forcer prisma version
npm remove prisma @prisma/client

npm install -D prisma@6.19.0
npm install @prisma/client@6.19.0

```
### Appliquer Prisma

````bash
npx prisma generate
npx prisma db push

````
#### si tu modifier prisma plus tard

````bash
npx prisma migrate dev --name nom_du_changement --config ./prisma.config.ts
npx prisma generate --config ./prisma.config.ts

````
#### Si tu veux reset a zero 

````bash
npx prisma migrate reset --config ./prisma.config.ts
npx prisma migrate dev --name init --config ./prisma.config.ts
npx prisma generate --config ./prisma.config.ts
# Migrer 
npx prisma migrate dev --name init --config ./prisma.config.ts
npx prisma generate --config ./prisma.config.ts
````

## Stripe 
````bash
stripe login
# ou 
stripe login --interactive
stripe listen --forward-to http://localhost:3000/api/stripe/webhook
stripe trigger checkout.session.completed
````
### Lancer le serveur
````bash
Lancer le serveur
````
### Captures
- Plans IPTV

- Checkout Stripe

- Webhook reçu

- Activation code

- Dashboard admin

- Page Mes Abonnements
## Développeur principal
| Nom                  | Rôle                                                                  |
| -------------------- | --------------------------------------------------------------------- |
| **Abderrafie Saber** | Développeur full-stack — Backend, Frontend, Stripe, Clerk, Prisma, DB |
J’ai conçu et développé l’intégralité du projet : architecture, base de données, intégration Stripe, API Next.js, interface utilisateur, tableau admin, logique d’activation, sécurité et déploiement.

## Conclusion
VivaVistaTV est une plateforme IPTV complète, moderne et sécurisée.
Elle démontre une maîtrise globale :

- de l’écosystème Next.js 16

- de Stripe (Checkout + Webhooks)

- de Prisma + Neon DB

- de Clerk pour l’authentification

- du design UI/UX

- de la structuration backend et frontend

Le projet suit les bonnes pratiques : séparation logique, sécurité, gestion d’erreurs, validation, architecture claire.

## Améliorations futures

- Mode revendeur + codes multi-activations

- Notifications email

- Dashboard admin avancé (stats + graphiques)

- App mobile

- Système d’affiliation

