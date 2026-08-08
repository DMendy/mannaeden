import { test, expect } from '@playwright/test'

test.describe('Pages publiques', () => {
  test('Home — charge et affiche le planner', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/mannaeden/i)
    await expect(page.locator('h1')).toBeVisible()
  })

  test('Boutique — affiche Graines de Foi et le prix', async ({ page }) => {
    await page.goto('/boutique')
    await expect(page.getByText('Graines de Foi')).toBeVisible()
    await expect(page.getByText('39')).toBeVisible()
    await expect(page.getByRole('button', { name: /Commander/i })).toBeVisible()
  })

  test('Boutique — galerie : cliquer sur miniature change la photo principale', async ({ page }) => {
    await page.goto('/boutique')
    const thumbs = page.locator('.gallery__thumb')
    await expect(thumbs).toHaveCount(2)
    const firstSrc = await page.locator('.gallery__main img').getAttribute('src')
    await thumbs.nth(1).click()
    const secondSrc = await page.locator('.gallery__main img').getAttribute('src')
    expect(firstSrc).not.toBe(secondSrc)
  })

  test('Boutique — FAQ s'ouvre et se ferme', async ({ page }) => {
    await page.goto('/boutique')
    const question = page.getByText('Quand vais-je recevoir mon planner ?')
    await question.click()
    await expect(page.getByText('2 à 4 jours ouvrés')).toBeVisible()
    await question.click()
    await expect(page.getByText('2 à 4 jours ouvrés')).toBeHidden()
  })

  test('Qui suis-je — présente Camille', async ({ page }) => {
    await page.goto('/qui-sommes-nous')
    await expect(page.getByText('Camille Gicquiaud')).toBeVisible()
    await expect(page.getByText('mannaeden')).toBeVisible()
  })

  test('Contact — formulaire visible', async ({ page }) => {
    await page.goto('/contact')
    await expect(page.getByLabel(/nom/i)).toBeVisible()
    await expect(page.getByLabel(/e-mail/i)).toBeVisible()
    await expect(page.getByLabel(/message/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /envoyer/i })).toBeVisible()
  })

  test('Navigation — liens header fonctionnent', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: /boutique/i }).click()
    await expect(page).toHaveURL(/boutique/)

    await page.getByRole('link', { name: /qui suis-je/i }).click()
    await expect(page).toHaveURL(/qui-sommes-nous/)

    await page.getByRole('link', { name: /contact/i }).click()
    await expect(page).toHaveURL(/contact/)
  })

  test('Page inexistante — redirige vers 404', async ({ page }) => {
    const res = await page.goto('/page-qui-nexiste-pas')
    expect(res?.status()).toBe(404)
  })
})
