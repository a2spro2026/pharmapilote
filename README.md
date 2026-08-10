# PharmaPilote

Solution de gestion d’officine — Laravel + MySQL (connexion, tableau de bord, caisse et modules Achats / Ventes / Stock).

## Prérequis

- PHP 8.2+
- Composer
- MySQL (XAMPP / phpMyAdmin) — base `pharmapilote`

## Installation

```bash
composer install
copy .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

Ouvrir **http://127.0.0.1:8000** (page de connexion).

## Configuration (.env)

| Variable | Valeur typique (XAMPP) |
|----------|-------------------------|
| `DB_CONNECTION` | `mysql` |
| `DB_HOST` | `127.0.0.1` |
| `DB_PORT` | `3306` |
| `DB_DATABASE` | `pharmapilote` |
| `DB_USERNAME` | `root` |
| `DB_PASSWORD` | *(vide)* |

## Front actuel

Les écrans HTML sont servis depuis `public/` (`login.html`, `dashboard.html`). Ils seront progressivement branchés sur Laravel (auth, modèles, API).

## Démo GitHub Pages (front seul)

**https://a2spro2026.github.io/pharmapilote/**

© 2026-A2S.. Tous Droits Réservés
