import { test, expect } from '@playwright/test'

const USER_EMAIL = process.env.TEST_EMAIL || 'test@mannaeden.fr'
const USER_PASSWORD = process.env.TEST_PASSWORD || 'Test1234!'
const ADMIN_EMAIL = process.env.TEST_ADMIN_EMAIL || process.env.ADMIN_EMAIL || ''
const ADMIN_PASSWORD = process.env.TEST_ADMIN_PASSWORD || process.env.ADMIN_PASSWORD || ''

test.describe('Authentification', () => {
  test('Connexion — accès refusé avec mauvais mot de passe', async ({ page }) => {
    await page.goto('/connexion')
    await page.getByLabel(/e-mail/i).fill('inconnu@test.fr')
    await page.getByLabel(/mot de passe/i).fill('mauvaismdp')
    await page.getByRole('button', { name: /se connecter/i }).click()
    await expect(page.locator('.form-error')).toBeVisible()
  })

  test('Connexion — redirige vers /compte après login client', async ({ page }) => {
    await page.goto('/connexion')
    await page.getByLabel(/e-mail/i).fill(USER_EMAIL)
    await page.getByLabel(/mot de passe/i).fill(USER_PASSWORD)
    await page.getByRole('button', { name: /se connecter/i }).click()
    await expect(page).toHaveURL(/compte/, { timeout: 8000 })
  })

  test('Connexion admin — redirige vers /admin', async ({ page }) => {
    test.skip(!ADMIN_EMAIL, 'ADMIN_EMAIL non défini')
    await page.goto('/connexion')
    await page.getByLabel(/e-mail/i).fill(ADMIN_EMAIL)
    await page.getByLabel(/mot de passe/i).fill(ADMIN_PASSWORD)
    await page.getByRole('button', { name: /se connecter/i }).click()
    await expect(page).toHaveURL(/admin/, { timeout: 8000 })
  })

  test('Middleware guest — /connexion redirige si déjà connecté', async ({ page }) => {
    // Login d'abord
    await page.goto('/connexion')
    await page.getByLabel(/e-mail/i).fill(USER_EMAIL)
    await page.getByLabel(/mot de passe/i).fill(USER_PASSWORD)
    await page.getByRole('button', { name: /se connecter/i }).click()
    await page.waitForURL(/compte/)

    // Retour sur /connexion → doit rediriger
    await page.goto('/connexion')
    await expect(page).not.toHaveURL(/connexion/)
  })

  test('Middleware auth — /compte redirige si non connecté', async ({ page }) => {
    await page.goto('/compte')
    await expect(page).toHaveURL(/connexion/)
  })

  test('Middleware admin — /admin redirige si non connecté', async ({ page }) => {
    await page.goto('/admin')
    await expect(page).toHaveURL(/connexion/)
  })

  test('Middleware admin — /admin redirige si client', async ({ page }) => {
    await page.goto('/connexion')
    await page.getByLabel(/e-mail/i).fill(USER_EMAIL)
    await page.getByLabel(/mot de passe/i).fill(USER_PASSWORD)
    await page.getByRole('button', { name: /se connecter/i }).click()
    await page.waitForURL(/compte/)

    await page.goto('/admin')
    await expect(page).not.toHaveURL(/admin/)
  })

  test('Déconnexion — redirige vers accueil', async ({ page }) => {
    await page.goto('/connexion')
    await page.getByLabel(/e-mail/i).fill(USER_EMAIL)
    await page.getByLabel(/mot de passe/i).fill(USER_PASSWORD)
    await page.getByRole('button', { name: /se connecter/i }).click()
    await page.waitForURL(/compte/)

    await page.getByRole('button', { name: /déconnexion/i }).click()
    await expect(page).toHaveURL('/')
  })
})
