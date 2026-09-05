import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Fallback direct-download Quran PDF from archive.org (public domain, no login)
const QURAN_PDF_URL =
  "https://archive.org/download/QuranMajeed-15Lines-PakistaniPrint/QuranMajeed-15Lines-PakistaniPrint.pdf";

const PDF_PATH = path.join(process.cwd(), "public", "quran-pak.pdf");
const PDF_MAGIC = "%PDF-";

// Stream a file from disk as a web ReadableStream (used by the NextResponse body)
function fileToWebStream(filePath: string) {
  const fileStream = fs.createReadStream(filePath);
  return new ReadableStream({
    start(controller) {
      fileStream.on("data", (chunk) => controller.enqueue(chunk));
      fileStream.on("end", () => controller.close());
      fileStream.on("error", (err) => controller.error(err));
    },
  });
}

// Reads only the first bytes of a file to verify its magic signature
function isRealPdf(filePath: string): boolean {
  const fd = fs.openSync(filePath, "r");
  try {
    const header = Buffer.alloc(PDF_MAGIC.length);
    const read = fs.readSync(fd, header, 0, PDF_MAGIC.length, 0);
    return read === PDF_MAGIC.length && header.toString("ascii") === PDF_MAGIC;
  } finally {
    fs.closeSync(fd);
  }
}

export async function GET() {
  try {
    // Serve the local, complete Quran PDF (validated so a broken/HTML file is never sent)
    if (fs.existsSync(PDF_PATH)) {
      const stat = fs.statSync(PDF_PATH);
      if (stat.size > 500_000 && isRealPdf(PDF_PATH)) {
        return new NextResponse(fileToWebStream(PDF_PATH) as any, {
          status: 200,
          headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": 'attachment; filename="Al-Quran-Al-Kareem.pdf"',
            "Content-Length": String(stat.size),
            "Cache-Control": "public, max-age=86400",
          },
        });
      }
    }
  } catch (err) {
    console.error("Error serving local Quran PDF:", err);
  }

  // Fallback: redirect to the public-domain mirror if the local file is missing/invalid
  return NextResponse.redirect(QURAN_PDF_URL, { status: 302 });
}
