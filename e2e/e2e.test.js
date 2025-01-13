import puppeteer from "puppeteer-core"; // используйте puppeteer или puppeteer-core в зависимости от вашего окружения
import { executablePath } from "puppeteer"; // автоматически получаем путь к браузеру

// Тестирование взаимодействия с формой в браузере
describe("Тестирование взаимодействия с формой в браузере", () => {
  let browser;
  let page;

  // Увеличиваем таймаут для beforeAll
  beforeAll(async () => {
    jest.setTimeout(20000); // Устанавливаем таймаут для всех тестов в этом блоке
    browser = await puppeteer.launch({
      headless: true,
      slowMo: 100,
      devtools: true,
      executablePath: executablePath(), // Указываем путь к исполняемому файлу браузера
    });

    page = await browser.newPage();
    await page.goto("http://localhost:8080"); // Убедитесь, что сервер запущен на этом адресе
  }, 20000); // Увеличиваем таймаут для beforeAll

  test("Ввод валидного номера карты", async () => {
    await page.waitForSelector("#cardNumberInput");
    await page.type("#cardNumberInput", "4111111111111111");
    await page.click("#validateButton");
    await page.waitForSelector("#result");
    const resultText = await page.$eval("#result", (el) => el.textContent);
    expect(resultText).toBe("Card is valid: Visa");
  }, 10000); // Тайм-аут 10 секунд

  test("Ввод невалидного номера карты", async () => {
    await page.waitForSelector("#cardNumberInput");
    await page.$eval("#cardNumberInput", (el) => (el.value = ""));
    await page.type("#cardNumberInput", "1234567890123456");
    await page.click("#validateButton");
    await page.waitForSelector("#result");
    const resultText = await page.$eval("#result", (el) => el.textContent);
    expect(resultText).toBe("Card is invalid");
  }, 10000); // Тайм-аут 10 секунд

  afterAll(async () => {
    if (browser) {
      await browser.close();
    }
  });
});
