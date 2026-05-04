import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { GroupPage } from '../pages/GroupPage';
import { DbHelper } from '../helpers/database';

test.describe('Варіант 8: Повний пакет тестів', () => {
    let loginPage: LoginPage;
    let groupPage: GroupPage;
    const db = new DbHelper();
    const existingGroup = '102-A';
    const updatedGroup = '102-A-Updated';

    test.beforeAll(async () => {
        await db.connect();
        await db.deleteGroupByTitle(updatedGroup);
        await db.deleteGroupByTitle('103-A');
    });

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        groupPage = new GroupPage(page);
        await loginPage.navigate();
    });

    test('1. Доступність сторінки', async ({ page }) => {
        await page.goto('/');
        await expect(page.locator('.schedule-container')).toBeDefined();
    });

    test('2. Логін адміністратора', async ({ page }) => {
        await loginPage.login('ivan_super@test.com', 'password123q@Q');
        await expect(page.getByText('ivan_super@test.com')).toBeVisible();
    });

    test('3. Навігація в адмінку', async ({ page }) => {
        await loginPage.login('ivan_super@test.com', 'password123q@Q');
        await page.locator('nav >> button').first().click();
        await page.getByRole('menuitem', { name: /Admin/i }).click();
        await page.getByText('More').click();
        await page.locator('li, [role="menuitem"]').filter({ hasText: /^Groups$/ }).click();
        await expect(page).toHaveURL(/.*groups.*/);
    });

    test('4. Teachers: перехід та відображення списку', async ({ page }) => {
        await loginPage.login('ivan_super@test.com', 'password123q@Q');
        await groupPage.openTeachers();
        await expect(page).toHaveURL(/.*teachers.*/);
    });

    test.describe('Операції з групами', () => {
        test.beforeEach(async ({ page }) => {
            await loginPage.login('ivan_super@test.com', 'password123q@Q');
            await groupPage.openGroups();
            await groupPage.waitForLoading();
        });

        test('5. Пошук групи 101', async ({ page }) => {
            await page.locator('input[type="text"]').first().fill('101');
            await groupPage.waitForLoading();
            await expect(page.getByText('101').first()).toBeVisible();
        });

        test('6. Валідація назви', async ({ page }) => {
            await page.locator('input[name="title"]').fill('');
            await expect(page.getByRole('button', { name: 'SAVE' })).toBeDisabled();
        });

        test('7. Створення групи 103-A', async ({ page }) => {
            await groupPage.createGroup('103-A');
            await groupPage.waitForLoading();
            await expect(page.getByText('103-A').first()).toBeVisible();
        });

        test('8. Редагування групи 102-A', async ({ page }) => {
            await page.getByText(existingGroup).first().waitFor({ state: 'visible' });
            await groupPage.editGroupOnLeftSide(existingGroup, updatedGroup);
            await expect(page.getByText(updatedGroup).first()).toBeVisible();
        });

        test('9. Drag & Drop на лівий край', async ({ page }) => {
            await groupPage.waitForLoading();
            await groupPage.dragToLeftEdge('101', updatedGroup);
            await groupPage.waitForLoading();
            const firstCard = page.locator('.MuiPaper-root').filter({ hasText: 'Group:' }).first();
            await expect(firstCard).not.toContainText('101');
        });

        test('10. Видалення через path та Yes', async ({ page }) => {
            await groupPage.waitForLoading();
            await groupPage.deleteGroupPath();
            await groupPage.waitForLoading();
        });
    });

    test.afterAll(async () => {
        await db.deleteGroupByTitle('103-A');
        await db.deleteGroupByTitle(updatedGroup);
        await db.disconnect();
    });
});