const puppeteer = require("puppeteer");

async function downloadImages(url, selector, downloadPath) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  const imageSrcs = await page.$$eval(selector, (elements) =>
    elements.map((element) => element.src)
  );

  for (let i = 0; i < imageSrcs.length; i++) {
    const imageSrc = imageSrcs[i];
    const viewSource = await page.goto(imageSrc);
    const buffer = await viewSource.buffer();
    const fileName = `${downloadPath}/image${i + 1}.jpg`;

    require("fs").writeFileSync(fileName, buffer);
    console.log(`Image downloaded: ${fileName}`);
  }

  await browser.close();
}

// Usage example
const url = "https://oleadanyc.com/products/captain-sleeve-suite-oat";
const selector = ".lazy-img img"; // Adjust this selector to match your HTML structure
const downloadPath = "./downloaded-images";

downloadImages(url, selector, downloadPath);
