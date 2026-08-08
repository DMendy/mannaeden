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

test.describe('Espace client — /compte', () => {
  test('Affiche les infos personnelles', async ({ page }) => {
    await loginAsUser(page)
    await expect(page.getByText(/informations personnelles/i)).toBeVisible()
    await expect(page.getByText(USER_EMAIL)).toBeVisible()
  })

  test('Bouton Ajouter ouvre le formulaire d'adresse', async ({ page }) => {
    await loginAsUser(page)
    const btn = page.getByRole('button', { name: /ajouter|modifier/i })
    await btn.click()
    await expect(page.getByLabel(/adresse/i).first()).toBeVisible()
    await expect(page.getByLabel(/ville/i)).toBeVisible()
    await expect(page.getByLabel(/code postal/i)).toBeVisible()
    await expect(page.getByLabel(/pays/i)).toBeVisible()
  })

  test('Formulaire adresse — champs ville avant code postal', async ({ page }) => {
    await loginAsUser(page)
    await page.getByRole('button', { name: /ajouter|modifier/i }).click()
    const inputs = page.locator('.field-row--ville-cp .field-input')
    await expect(inputs).toHaveCount(2)
    // premier input = ville, second = code postal
    await expect(inputs.first()).toHaveAttribute('autocomplete', 'address-level2')
    await expect(inputs.last()).toHaveAttribute('autocomplete', 'postal-code')
  })

  test('Formulaire adresse — sauvegarde et affiche toast', async ({ page }) => {
    await loginAsUser(page)
    await page.getByRole('button', { name: /ajouter|modifier/i }).click()
    await page.getByLabel(/adresse/i).first().fill('12 rue de la Paix')
    await page.locator('#ville').fill('Paris')
    await page.locator('#cp').fill('75001')
    await page.locator('#pays').fill('France')
    await page.getByRole('button', { name: /enregistrer/i }).click()
    await expect(page.getByText(/adresse mise à jour/i)).toBeVisible({ timeout: 5000 })
  })

  test('Annuler ferme le formulaire sans sauvegarder', async ({ page }) => {
    await loginAsUser(page)
    await page.getByRole('button', { name: /ajouter|modifier/i }).click()
    await page.getByRole('button', { name: /annuler/i }).click()
    await expect(page.getByLabel(/adresse/i)).toBeHidden()
  })

  test('Section commandes visible', async ({ page }) => {
    await loginAsUser(page)
    await expect(page.getByText(/mes commandes/i)).toBeVisible()
  })

  test('Lien Commander le planner pointe vers /panier', async ({ page }) => {
    await loginAsUser(page)
    await page.getByRole('link', { name: /commander le planner/i }).click()
    await expect(page).toHaveURL(/panier/)
  })
})
