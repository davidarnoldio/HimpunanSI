import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="id">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>402 - System Locked</title>
        <style>
          body {
            background-color: #0a0a0a;
            color: #ff3333;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            font-family: 'Courier New', Courier, monospace;
            text-align: center;
            overflow: hidden;
          }
          h1 {
            font-size: clamp(3rem, 8vw, 6rem);
            margin-bottom: 10px;
            text-transform: uppercase;
            letter-spacing: 5px;
            text-shadow: 0 0 20px rgba(255, 51, 51, 0.5);
          }
          p {
            color: #cccccc;
            font-size: 1.2rem;
            max-width: 600px;
            line-height: 1.5;
            padding: 0 20px;
          }
          .blink {
            animation: blink-animation 1s steps(5, start) infinite;
          }
          @keyframes blink-animation {
            to { visibility: hidden; }
          }
        </style>
      </head>
      <body>
        <h1>NO PAY<br>NO SYSTEM</h1>
        <p>Akses ke sistem ditangguhkan secara permanen.<br>Hubungi <span class="blink">Developer</span> untuk menyelesaikan administrasi.</p>
      </body>
    </html>
  `;

  return new NextResponse(htmlContent, {
    status: 402,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}

export const config = {
  matcher: '/:path*',
};
