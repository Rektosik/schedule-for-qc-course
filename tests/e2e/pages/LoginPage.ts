import { Page, expect } from '@playwright/test';

export class LoginPage {
    constructor(private page: Page) {}

    async navigate() {
        await this.page.goto('/login');
    }

    async login(email: string, pass: string) {
        await this.page.fill('input[name="email"]', email);
        await this.page.fill('input[name="password"]', pass);
        await this.page.click('button[type="submit"]');
    }

    async checkErrorMessage(text: string) {
        await expect(this.page.locator('text=' + text)).toBeVisible();
    }
}