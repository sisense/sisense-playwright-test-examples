import { BasePage } from '@pages/basePage';
import { Locator, Page } from '@playwright/test';
import { ElementState } from '@constants/elementState';

export class AddToPulsePopupUsersTab extends BasePage {
    constructor(
        page: Page,
        private tab: Locator = page.locator(`div.tab-users`),
        private searchInput: Locator = tab.locator(`div.autocomplete-host input`),
        private autocompleteDropdownList: Locator = tab.locator(`div.autocomplete-items`),
        private autocompleteDropdownListItem: Locator = autocompleteDropdownList.locator(
            `div.autocomplete-item`,
        ),
        private addedUsersGroupsListContainer: Locator = tab.locator(`div.user-group-list-content`),
        private addedUsersGroupsListItem: Locator = addedUsersGroupsListContainer.locator(
            `div.user-group-item`,
        ),
    ) {
        super(page);
    }

    async typeIntoSearchInput(search: string): Promise<void> {
        await this.searchInput.fill(search);
    }

    async clickAutocompleteListItemByTitle(title: string): Promise<void> {
        const targetItem: Locator = this.getAutocompleteListItemByTitle(title);
        await targetItem.click();
    }

    async waitAddedUserGroupItemByTitleHasState(title: string, state: ElementState): Promise<void> {
        const targetItem: Locator = this.getAddedUserGroupItemByTitle(title);
        await targetItem.waitFor({ state });
    }

    private getAutocompleteListItemByTitle(title: string): Locator {
        return this.autocompleteDropdownListItem.filter({
            has: this.page.locator(`div`).getByTitle(title, { exact: true }),
        });
    }

    private getAddedUserGroupItemByTitle(title: string): Locator {
        return this.addedUsersGroupsListItem.filter({
            has: this.page.locator(`div`).getByText(title, { exact: true }),
        });
    }
}
