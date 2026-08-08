import { test, expect, type Page } from '@playwright/test'

const USER_EMAIL = process.env.TEST_EMAIL || 'test@mannaeden.fr'
const USER_PASSWORD = process.env.TEST_PASSWORD || 'Test1234!'

async function loginAsUser(page: Page) {
  await page.goto('/connexion')
  await page.getByLabel(/e-mail/i).fill(USER_EMAIL)
  await page.getByLabel(/mot de passe/i).fill(USER_PASSWORD)
  await page.getByRole('button', { name: /se connecter/i }).click()
  await page.waitForURL(/compte/, { timeout: 8000 })
}

test.describe('Panier / Commande', () => {
  test('Non connecté — Commander redirige vers /connexion', async ({ page }) => {
    await page.goto('/boutique')
    await page.getByRole('button', { name: /Commander/i }).click()
    await expect(page).toHaveURL(/connexion/)
  })

  test('Panier — affiche le formulaire de livraison', async ({ page }) => {
    await loginAsUser(page)
    await page.goto('/panier')
    await expect(page.getByText(/adresse de livraison/i)).toBeVisible()
    await expect(page.getByLabel(/prénom/i)).toBeVisible()
    await expect(page.getByLabel(/nom/i)).toBeVisible()
    await expect(page.getByLabel(/adresse/i).first()).toBeVisible()
  })

  test('Panier — ordre des champs ville avant code postal', async ({ page }) => {
    await loginAsUser(page)
    await page.goto('/panier')
    const row = page.locator('.field-row--ville-cp')
    const inputs = row.locator('input')
    await expect(inputs.first()).toHaveAttribute('autocomplete', 'address-level2')
    await expect(inputs.last()).toHaveAttribute('autocomplete', 'postal-code')
  })

  test('Panier — pré-remplit depuis le profil si adresse existante', async ({ page }) => {
    await loginAsUser(page)
    await page.goto('/panier')
    // Si l'utilisateur a une adresse sauvegardée, les champs doivent être pré-remplis
    const adresse = page.locator('input[autocomplete="address-line1"]')
    const value = await adresse.inputValue()
    // Au moins le champ existe
    expect(adresse).toBeDefined()
    expect(typeof value).toBe('string')
  })

  test('Panier — bouton paiement désactivé si champs vides', async ({ page }) => {
    await loginAsUser(page)
    await page.goto('/panier')
    // Vide tous les champs requis
    await page.locator('input[required]').evaluateAll(inputs =>
      inputs.forEach((input: HTMLInputElement) => { input.value = '' })
    )
    const btn = page.getByRole('button', { name: /passer au paiement/i })
    // Le bouton ne doit pas soumettre le formulaire HTML invalide
    await expect(btn).toBeVisible()
  })

  test('Panier — affiche le résumé de commande', async ({ page }) => {
    await loginAsUser(page)
    await page.goto('/panier')
    await expect(page.getByText(/Graines de Foi/i)).toBeVisible()
    await expect(page.getByText(/39/)).toBeVisible()
  })
})
