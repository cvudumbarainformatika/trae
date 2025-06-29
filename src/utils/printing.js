export function printHtmlElement (element, title = 'Print') {
  if (!element) {
    console.warn('printHtmlElement: target element not found.');
    return;
  }

  // Buat iframe tersembunyi
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.top = '-9999px';
  iframe.style.left = '-9999px';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.visibility = 'hidden';
  document.body.appendChild(iframe);

  const doc = iframe.contentDocument || iframe.contentWindow?.document;
  if (!doc) return;

  // CSS global print styles
  const styles = `
    <style>
      body {
        margin: 0;
        padding: 20px;
        font-family: Arial, sans-serif;
      }

      @media print {
        @page {
          margin: 20mm;
        }

        body {
          counter-reset: page;
        }

        .page-footer::after {
          content: "Page " counter(page);
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          text-align: center;
          font-size: 12px;
          padding: 10px 0;
          color: #888;
        }
      }

      /* Style default hanya berlaku jika tidak ditimpa */
      table {
        border-collapse: collapse;
        width: 100%;
        font-size: 12px;
      }

      th, td {
        border: 1px solid #ddd;
        padding: 8px;
        text-align: left;
      }

      th {
        background-color: #f2f2f2;
      }
    </style>
  `;

  // Tulis konten HTML ke iframe
  doc.open();
  doc.write(`
    <html>
      <head>
        <title>${title}</title>
        ${styles}
      </head>
      <body>
        ${element.innerHTML}
      </body>
    </html>
  `);
  doc.close();

  // Tunggu iframe load lalu cetak
  iframe.onload = () => {
    iframe.contentWindow?.focus();
    iframe.contentWindow?.print();

    // Cleanup setelah print
    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 500);
  };
};
