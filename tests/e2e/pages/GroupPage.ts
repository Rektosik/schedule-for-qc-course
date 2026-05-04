import { Page, expect } from '@playwright/test';

export class GroupPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async waitForLoading() {
        await this.page.waitForLoadState('networkidle');
        const spinner = this.page.locator('.MuiCircularProgress-root');
        if (await spinner.isVisible()) {
            await spinner.waitFor({ state: 'hidden', timeout: 15000 });
        }
    }

    async openGroups() {
        await this.page.locator('nav >> button').first().click();
        await this.page.getByRole('menuitem', { name: /Admin/i }).click();
        await this.page.getByText('More').click();
        await this.page.locator('li, [role="menuitem"]').filter({ hasText: /^Groups$/ }).click();
        await this.waitForLoading();
    }

    async openTeachers() {
        await this.page.locator('nav >> button').first().click();
        await this.page.getByRole('menuitem', { name: /Admin/i }).click();
        await this.page.getByText('More').click();
        await this.page.locator('li, [role="menuitem"]').filter({ hasText: /^Teachers$/ }).click();
        await this.waitForLoading();
    }

    async createGroup(title: string) {
        const autocomplete = this.page.getByLabel(/Select after which group/i);
        await autocomplete.click();
        await this.page.locator('li.MuiAutocomplete-option').first().click();
        await this.page.getByPlaceholder('Group:', { exact: true }).fill(title);
        await this.page.getByRole('button', { name: 'SAVE' }).click();
        await this.waitForLoading();
    }

    async editGroupOnLeftSide(oldTitle: string, newTitle: string) {
        const card = this.page.locator('.MuiPaper-root').filter({ hasText: oldTitle }).last();
        await card.locator('.edit-icon-btn > path').first().click();
        const editForm = this.page.locator('.MuiPaper-root').filter({ hasText: 'Edit group' });
        const input = editForm.getByPlaceholder('Group:');
        await input.click();
        await this.page.keyboard.press('Control+A');
        await this.page.keyboard.press('Backspace');
        await input.fill(newTitle);
        
        await this.page.getByRole('button', { name: 'SAVE' }).click();
        await this.waitForLoading();
    }

    async deleteGroupPath() {
        await this.page.locator('.delete-icon-btn > path').first().click();
        await this.page.getByRole('button', { name: 'Yes' }).click();
        await this.waitForLoading();
    }

    async dragToLeftEdge(sourceTitle: string, targetTitle: string) {
        const sourceCard = this.page.locator('.MuiPaper-root').filter({ hasText: sourceTitle }).last();
        const targetCard = this.page.locator('.MuiPaper-root').filter({ hasText: targetTitle }).last();
        const handle = sourceCard.locator('.edit-icon-btn > path').first();
        const targetBox = await targetCard.boundingBox();

        if (targetBox) {
            await handle.hover();
            await this.page.mouse.down();
            await this.page.mouse.move(targetBox.x + 5, targetBox.y + targetBox.height / 2, { steps: 15 });
            await this.page.mouse.up();
        }
        await this.waitForLoading();
    }
}