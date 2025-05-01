#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Cari semua file Vue
const vueFiles = glob.sync('src/**/*.vue');

let inconsistentIcons = [];

vueFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');

  // Cek penggunaan ikon yang tidak konsisten
  const remixIconUsage = content.match(/<i class="ri-[^"]+"><\/i>/g);
  const directLucideUsage = content.match(/<[A-Z][a-zA-Z]+ /g); // Komponen Lucide langsung

  if (remixIconUsage || directLucideUsage) {
    inconsistentIcons.push({
      file,
      remixIcons: remixIconUsage || [],
      directLucideIcons: directLucideUsage || []
    });
  }
});

if (inconsistentIcons.length > 0) {
  console.error('\x1b[31m%s\x1b[0m', 'Penggunaan ikon tidak konsisten ditemukan:');

  inconsistentIcons.forEach(item => {
    console.error(`\x1b[33m${item.file}\x1b[0m`);

    if (item.remixIcons.length > 0) {
      console.error('  Remix Icons ditemukan:');
      item.remixIcons.forEach(icon => {
        console.error(`    ${icon}`);
      });
    }

    if (item.directLucideIcons.length > 0) {
      console.error('  Penggunaan Lucide langsung ditemukan:');
      item.directLucideIcons.forEach(icon => {
        console.error(`    ${icon}`);
      });
    }

    console.error('  Gunakan komponen Icon: <Icon name="IconName" class="w-4 h-4" />');
  });

  process.exit(1);
} else {
  console.log('\x1b[32m%s\x1b[0m', 'Semua ikon digunakan secara konsisten! 👍');
}
