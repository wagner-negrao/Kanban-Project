import { expect, test } from "@playwright/test";
import { initialData } from "../src/lib/kanban";

test.beforeEach(async ({ page }) => {
  await page.route("/api/kanban", async (route) => {
    if (route.request().method() === "GET") {
      await route.fulfill({ json: initialData });
    } else if (route.request().method() === "PUT") {
      await route.fulfill({ json: { status: "success" } });
    }
  });

  await page.goto("/");
  await page.getByPlaceholder(/Enter 'user'/i).fill("user");
  await page.getByPlaceholder(/Enter 'password'/i).fill("password");
  await page.getByRole("button", { name: /Sign In/i }).click();
  await expect(page.getByRole("heading", { name: "Kanban Studio" })).toBeVisible();
});

test("AI chat widget opens and updates the board", async ({ page }) => {
  const newBoardState = {
    ...initialData,
    cards: {
      ...initialData.cards,
      "ai-card-1": { id: "ai-card-1", title: "AI Generated Task", details: "Added by AI" }
    },
    columns: initialData.columns.map(c => 
      c.id === "col-backlog" ? { ...c, cardIds: [...c.cardIds, "ai-card-1"] } : c
    )
  };

  await page.route("/api/chat", async (route) => {
    await route.fulfill({
      json: {
        reply: "I added the task for you!",
        board_update: newBoardState
      }
    });
  });

  await page.getByRole('button', { name: 'Open AI Chat' }).click();
  await page.getByPlaceholder(/Ask AI/i).fill("Add an AI task to the backlog");
  await page.getByPlaceholder(/Ask AI/i).press("Enter");
  
  await expect(page.getByText("I added the task for you!")).toBeVisible();
  await expect(page.getByText("AI Generated Task")).toBeVisible();
});

test("loads the kanban board", async ({ page }) => {
  await expect(page.locator('[data-testid^="column-"]')).toHaveCount(5);
});

test("logs out successfully", async ({ page }) => {
  await page.getByRole("button", { name: /Sign Out/i }).click();
  await expect(page.getByRole("heading", { name: "Welcome Back" })).toBeVisible();
});

test("adds a card to a column", async ({ page }) => {
  const firstColumn = page.locator('[data-testid^="column-"]').first();
  await firstColumn.getByRole("button", { name: /add a card/i }).click();
  await firstColumn.getByPlaceholder("Card title").fill("Playwright card");
  await firstColumn.getByPlaceholder("Details").fill("Added via e2e.");
  await firstColumn.getByRole("button", { name: /add card/i }).click();
  await expect(firstColumn.getByText("Playwright card")).toBeVisible();
});

test("moves a card between columns", async ({ page }) => {
  const card = page.getByTestId("card-card-1");
  const targetColumn = page.getByTestId("column-col-review");
  const cardBox = await card.boundingBox();
  const columnBox = await targetColumn.boundingBox();
  if (!cardBox || !columnBox) {
    throw new Error("Unable to resolve drag coordinates.");
  }

  await page.mouse.move(
    cardBox.x + cardBox.width / 2,
    cardBox.y + cardBox.height / 2
  );
  await page.mouse.down();
  await page.mouse.move(
    columnBox.x + columnBox.width / 2,
    columnBox.y + 120,
    { steps: 12 }
  );
  await page.mouse.up();
  await expect(targetColumn.getByTestId("card-card-1")).toBeVisible();
});
