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

      th.text-right, td.text-right {
        text-align: right;
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






export function printReceiptElement(element, title = 'Struk Penjualan', onDone = null) {
  if (!element) {
    console.warn('printReceiptElement: target element not found.');
    return;
  }

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

  const styles = `
    <style>
      @page {
        size: 60mm auto;
        margin: 0;
      }

      body {
        margin: 0;
        padding: 0;
        font-size: 8pt;
        line-height: 1;
        color: #000;
        width: 80mm;
      }

      .receipt {
        width: 100%;
        padding: 8px;
        box-sizing: border-box;
      }

      .center {
        text-align: center;
      }

      .right {
        text-align: right;
      }

      .bold {
        font-weight: bold;
      }

      table {
        width: 100%;
        border-collapse: collapse;
        font-size: 8pt;
      }

      td {
        padding: 2px 0;
        word-break: break-word;
      }

      .item-row {
        display: flex;
        justify-content: space-between;
      }

      hr {
        border: none;
        border-top: 1px dashed #000;
        margin: 8px 0;
      }
      .flex {
        display: flex;
      }

      .justify-between {
        justify-content: space-between;
      }

      span {
        word-break: break-word;
      }

      @media print {
        html, body {
          width: 60mm auto;
          margin: 0;
          padding: 0;
          color: #000;
        }
      }

      body {
        page-break-inside: avoid;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }

      * {
        page-break-inside: avoid !important;
        break-inside: avoid !important;
      }
    </style>
  `;

  doc.open();
  doc.write(`
    <html>
      <head>
        <title>${title}</title>
        ${styles}
      </head>
      <body>
        <div class="receipt">
          ${element.innerHTML}
        </div>
      </body>
    </html>
  `);
  doc.close();

  const handlePrintDone = (event) => {
    if (event.data?.type === 'PRINT_DONE') {
      window.removeEventListener('message', handlePrintDone);
      if (typeof onDone === 'function') onDone();

      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 500);
    }
  };
  window.addEventListener('message', handlePrintDone);

  iframe.onload = () => {
    iframe.contentWindow?.focus();
    iframe.contentWindow?.print();

    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 500);
  };
}

