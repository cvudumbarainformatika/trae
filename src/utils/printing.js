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
        font-family: 'Inter', sans-serif;
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

      /* Styles for Profit and Loss Report */
      .profit-loss-report .print-header {
        text-align: center;
        margin-bottom: 2rem;
      }
      .profit-loss-report .print-title {
        font-size: 1.5rem;
        font-weight: 700;
      }
      .profit-loss-report .print-subtitle {
        font-size: 0.875rem;
        color: #6b7280;
      }
      .profit-loss-report .section-title {
        font-size: 1.125rem;
        font-weight: 600;
        border-bottom: 2px solid #e5e7eb;
        padding-bottom: 0.5rem;
        margin-bottom: 0.75rem;
      }
      .profit-loss-report .profit-loss-info-row { /* Renamed from .info-row */
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.75rem 0;
        border-bottom: 1px solid #f3f4f6;
      }
      .profit-loss-report .profit-loss-info-row-label { /* Renamed from .info-row-label */
        font-size: 0.875rem;
        color: #374151;
      }
      .profit-loss-report .profit-loss-info-row-value { /* Renamed from .info-row-value */
        font-size: 0.875rem;
        font-family: monospace;
        font-weight: 600;
        color: #1f2937;
      }
      .profit-loss-report .profit-loss-info-row-value.negative {
        color: #dc2626;
      }
      .profit-loss-report .section-total {
        margin-top: 1rem;
        padding-top: 0.75rem;
        border-top: 1px solid #d1d5db;
      }
      .profit-loss-report .section-total .profit-loss-info-row-label, .profit-loss-report .section-total .profit-loss-info-row-value {
        font-weight: 700;
        font-size: 1rem;
      }
      .profit-loss-report .section-total .profit-loss-info-row-value.green {
        color: #16a34a;
      }
      .profit-loss-report .section-total .profit-loss-info-row-value.yellow {
        color: #f59e0b;
      }
      .profit-loss-report .final-total {
        margin-top: 2rem;
        padding-top: 1rem;
        border-top: 4px double #9ca3af;
      }
      .profit-loss-report .final-total .profit-loss-info-row-label, .profit-loss-report .final-total .profit-loss-info-row-value {
        font-weight: 800;
        font-size: 1.25rem;
      }
      .profit-loss-report .final-total .profit-loss-info-row-value.blue {
        color: #2563eb;
      }

    </style>
  `;

  // Tulis konten HTML ke iframe
  doc.open();
  doc.write(`
    <html>
      <head>
        <title>${title}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
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
        size: 75mm auto;
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
          width: 75mm auto;
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

