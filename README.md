# PELAGE — Salon de toilettage premium

Site vitrine full-stack en français, avec réservation en ligne, données persistantes et administration protégée. **Version de préparation non ouverte au public** : les informations du salon, les textes légaux et certaines intégrations doivent encore être finalisés.

## Architecture

- Next.js/Vinext, React, TypeScript, CSS responsive ; Cloudflare Workers via Sites.
- Cloudflare D1 (SQLite), Drizzle ORM, migration SQL versionnée dans `drizzle/`.
- `app/` : pages publiques, réservation, gestion de rendez-vous et administration.
- `app/api/` : logique serveur et accès à la base, jamais directement depuis le navigateur.
- `lib/pelage.ts` : prestations et horaires par défaut ; `lib/server.ts` : contrôles, réglages, e-mails.

## Fonctionnalités implémentées

1. Accueil, prestations, galerie d'ambiance, contact, à propos, mentions légales provisoires et confidentialité provisoire.
2. Réservation par animal, prestation, date, heure et coordonnées. Les quarts d'heure sont verrouillés par clé unique et insertion atomique dans D1.
3. Confirmation à l'écran avec lien de gestion aléatoire. Annulation par ce lien ; modification par annulation puis nouvelle réservation.
4. Confirmation et alerte par e-mail **uniquement si Resend et l'expéditeur sont configurés**.
5. Administration via compte ChatGPT et allowlist serveur `ADMIN_EMAILS` : rendez-vous, annulation, anonymisation, export JSON, prestations, tarifs, fermetures et messages.
6. Validation serveur, contrôle d'origine, champ piège, limitation horaire par empreinte IP hachée, blocage des doubles réservations en base.

## Installation locale

Node.js >= 22 requis. Installer les dépendances avec `pnpm install --frozen-lockfile`, puis `pnpm run dev` et `pnpm run build`.

Pour l'aperçu local D1, après le build, appliquer les migrations une seule fois, dans l'ordre :

```bash
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_mushy_night_thrasher.sql
```

Après une évolution du schéma : `pnpm run db:generate`. Ne jamais réécrire ou rejouer une migration appliquée ; ajouter une nouvelle migration.

## Variables d'environnement de production

- `ADMIN_EMAILS` : adresses exactes des comptes ChatGPT administrateurs, séparées par virgules. Aucune entrée = aucun accès admin.
- `RATE_HASH_SECRET` : chaîne aléatoire longue pour les empreintes de limitation des demandes.
- `RESEND_API_KEY` et `MAIL_FROM` : nécessaire à l'envoi des e-mails ; domaine d'envoi à vérifier chez le prestataire.
- La base D1 `DB` est provisionnée par Sites ; elle doit rester accessible uniquement au Worker.

Conserver les secrets dans l'hébergeur, jamais dans Git. `.env.example` contient seulement des exemples.

## À terminer avant ouverture au public

- Renseigner la raison sociale, le SIRET, l'adresse, les coordonnées, horaires, prix, parcours du toiletteur et les photos réellement autorisées.
- Faire valider mentions légales, politique RGPD, durées de conservation et liste des sous-traitants.
- Brancher et tester l'e-mail transactionnel ; ajouter les rappels automatiques si souhaités.
- Mettre en place une protection anti-abus renforcée (p. ex. Turnstile), la supervision et les procédures de sauvegarde/restauration D1.
- Tester en bout-en-bout réservation simultanée, annulation, fermeture exceptionnelle, fuseau/DST, permissions d'administration et délivrabilité des e-mails.
- Compléter si nécessaire : création manuelle et déplacement de rendez-vous, upload et gestion des photos en R2, calendrier externe, rétention automatisée, édition de tous les textes et de tous les horaires depuis l'administration.
- Revoir la CSP pour supprimer `unsafe-inline` lorsque des nonces de script sont intégrées, et contrôler les en-têtes après publication.

## Déploiement

Le projet est lié à un Site privé. Le pipeline de publication gère le Worker et les migrations D1. Après validation, configurer le domaine personnalisé, les DNS, TLS et l'accès public via le service d'hébergement. Le paiement s'effectue au salon, sans transaction en ligne.

## Données et sauvegardes

L'administration propose un export JSON des rendez-vous et l'anonymisation unitaire. Définir une purge périodique, une sauvegarde D1 chiffrée et un test de restauration récurrent avant exploitation publique.
