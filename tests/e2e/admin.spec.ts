import { test, expect, type Page } from '@playwright/test'

const ADMIN_EMAIL = process.env.TEST_ADMIN_EMAIL || process.env.ADMIN_EMAIL || ''
const ADMIN_PASSWORD = process.env.TEST_ADMIN_PASSWORD || process.env.ADMIN_PASSWORD || ''

test.describe('Back-office admin', () => {
  test.skip(!ADMIN_EMAIL, 'ADMIN_EMAIL non défini — passez TEST_ADMIN_EMAIL en env var')

  async function loginAsAdmin(page: Page) {
    await page.goto('/connexion')
    await page.getByLabel(/e-mail/i).fill(ADMIN_EMAIL)
    await page.getByLabel(/mot de passe/i).fill(ADMIN_PASSWORD)
    await page.getByRole('button', { name: /se connecter/i }).click()
    await page.waitForURL(/admin/, { timeout: 8000 })
  }

  test('Login admin — redirige vers /admin/commandes', async ({ page }) => {
    await loginAsAdmin(page)
    await expect(page).toHaveURL(/admin\/commandes/)
  })

  test('Sidebar — liens Commandes et Stock visibles', async ({ page }) => {
    await loginAsAdmin(page)
    await expect(page.getByRole('link', { name: /commandes/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /stock/i })).toBeVisible()
  })

  test('Commandes — liste s'affiche', async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/admin/commandes')
    // En-têtes du tableau
    await expect(page.getByText(/client/i)).toBeVisible()
    await expect(page.getByText(/montant/i)).toBeVisible()
    await expect(page.getByText(/statut/i)).toBeVisible()
  })

  test('Commandes — filtre par statut fonctionne', async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/admin/commandes')
    const select = page.locator('.filter-select')
    await select.selectOption('LIVREE')
    await page.waitForTimeout(500)
    // Toutes les lignes affichées doivent avoir le badge "Livrée"
    const badges = page.locator('.badge--done')
    const rows = page.locator('.table-row')
    const rowCount = await rows.count()
    const badgeCount = await badges.count()
    if (rowCount > 0) {
      expect(badgeCount).toBe(rowCount)
    }
  })

  test('Commande détail — s'ouvre en cliquant sur une ligne', async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/admin/commandes')
    const firstRow = page.locator('.table-row').first()
    const rowCount = await firstRow.count()
    if (rowCount === 0) {
      test.skip()
      return
    }
    await firstRow.click()
    await expect(page).toHaveURL(/admin\/commandes\/.+/)
    await expect(page.getByText(/statut de livraison/i)).toBeVisible()
  })

  test('Commande détail — 4 étapes de livraison visibles', async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/admin/commandes')
    const firstRow = page.locator('.table-row').first()
    if (await firstRow.count() === 0) { test.skip(); return }
    await firstRow.click()
    await page.waitForURL(/admin\/commandes\/.+/)
    const steps = page.locator('.statut-step')
    await expect(steps).toHaveCount(4)
    await expect(page.getByText('Commandée')).toBeVisible()
    await expect(page.getByText('Expédiée')).toBeVisible()
    await expect(page.getByText('En livraison')).toBeVisible()
    await expect(page.getByText('Livrée')).toBeVisible()
  })

  test('Commande détail — changement de statut affiche le toast', async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/admin/commandes')
    const firstRow = page.locator('.table-row').first()
    if (await firstRow.count() === 0) { test.skip(); return }
    await firstRow.click()
    await page.waitForURL(/admin\/commandes\/.+/)
    // Clique sur "Expédiée" (step 2)
    const steps = page.locator('.statut-step')
    const expedieeStep = steps.nth(1)
    const isActive = await expedieeStep.evaluate(el => el.classList.contains('statut-step--active'))
    if (!isActive) {
      await expedieeStep.click()
      await expect(page.getByText(/statut mis à jour/i)).toBeVisible({ timeout: 6000 })
    }
  })

  test('Stock — affiche le produit avec contrôles +/−', async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/admin/stock')
    await expect(page.getByText('Graines de Foi')).toBeVisible()
    await expect(page.locator('.stock-btn').first()).toBeVisible()
    await expect(page.locator('.stock-input').first()).toBeVisible()
  })

  test('Stock — bouton − désactivé quand stock = 0', async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/admin/stock')
    const input = page.locator('.stock-input').first()
    const minusBtn = page.locator('.stock-btn').first()
    // Met la valeur à 0
    await input.fill('0')
    await input.dispatchEvent('input')
    await expect(minusBtn).toBeDisabled()
  })

  test('Stock — Enregistrer devient actif après modification', async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/admin/stock')
    const input = page.locator('.stock-input').first()
    const saveBtn = page.locator('.save-btn').first()
    const currentVal = await input.inputValue()
    const newVal = String(Number(currentVal) + 1)
    await input.fill(newVal)
    await input.dispatchEvent('input')
    await expect(saveBtn).toBeEnabled()
  })

  test('Déconnexion depuis le BO', async ({ page }) => {
    await loginAsAdmin(page)
    await page.getByRole('button', { name: /déconnexion/i }).click()
    await expect(page).toHaveURL('/')
  })
})
