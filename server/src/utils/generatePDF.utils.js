import cloudinary from "../config/cloudinary.js";
import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

export const generatePDF = async (html) => {
  const browser = await puppeteer.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath(),
    headless: chromium.headless,
  });

  try {
    const page = await browser.newPage();

    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    return pdfBuffer;
  } finally {
    await browser.close();
  }
};
export const uploadPDF = async (buffer) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          resource_type: "raw",
          folder: "offers",
          format: "pdf",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result.secure_url);
        },
      )
      .end(buffer);
  });
};
