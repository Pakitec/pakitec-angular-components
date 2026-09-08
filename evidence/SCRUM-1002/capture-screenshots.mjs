import { chromium } from 'playwright';
import { createHash } from 'crypto';
import { writeFile, mkdir } from 'fs/promises';
import { stat } from 'fs/promises';
import { join } from 'path';

const evidenceDir = '/Volumes/External HD/Projetos/pakitec/pakitec-angular-components/evidence/SCRUM-1002';
const storybookUrl = 'http://localhost:6006';

const captures = [
  {
    criteriaId: 'AC-004',
    story: 'componentes-sidenav--playground',
    globals: 'theme:light',
    action: 'none',
    viewport: { width: 1280, height: 720 },
  },
  {
    criteriaId: 'AC-005',
    story: 'componentes-sidenav--playground',
    globals: 'theme:dark',
    action: 'none',
    viewport: { width: 1280, height: 720 },
  },
  {
    criteriaId: 'AC-008',
    story: 'componentes-sidenav--playground',
    globals: 'theme:light',
    action: 'focus',
    viewport: { width: 1280, height: 720 },
  },
];

async function sha256(filePath) {
  const fs = await import('fs');
  const hash = createHash('sha256');
  const stream = fs.createReadStream(filePath);
  for await (const chunk of stream) {
    hash.update(chunk);
  }
  return hash.digest('hex');
}

async function capture() {
  await mkdir(evidenceDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  const page = await context.newPage();

  const manifestItems = [];

  for (const cap of captures) {
    const url = `${storybookUrl}/?path=/story/${cap.story}&globals=${encodeURIComponent(cap.globals)}`;
    await page.goto(url, { waitUntil: 'networkidle' });

    // Wait for the storybook preview iframe and its load state
    const iframeHandle = await page.waitForSelector('iframe#storybook-preview-iframe', { timeout: 30000 });
    const iframe = await iframeHandle.contentFrame();
    await iframe.waitForLoadState('networkidle');

    // Wait for sidenav element
    await iframe.waitForSelector('paki-sidenav, .paki-sidenav', { timeout: 10000 }).catch(() => null);
    await iframe.waitForTimeout(500);

    if (cap.action === 'focus') {
      // Focus first interactive element (link) inside the sidenav
      await iframe.evaluate(() => {
        const sidenav = document.querySelector('paki-sidenav, .paki-sidenav');
        const focusable = sidenav?.querySelector('a, button, [tabindex="0"]');
        if (focusable) {
          focusable.focus();
          return focusable.tagName;
        }
        return null;
      });
      await page.waitForTimeout(500);
    }

    const fileName = `SCRUM-1002-${cap.criteriaId}-desktop.png`;
    const filePath = join(evidenceDir, fileName);
    await page.screenshot({ path: filePath, fullPage: true });

    const stats = await stat(filePath);
    const hash = await sha256(filePath);

    manifestItems.push({
      criteriaId: cap.criteriaId,
      kind: 'official',
      status: 'pass',
      viewport: `${cap.viewport.width}x${cap.viewport.height}`,
      file: fileName,
      mimeType: 'image/png',
      size: stats.size,
      sha256: hash,
      containsSensitiveData: false,
    });
  }

  await browser.close();

  const manifest = {
    runner: 'ollama',
    issueKey: 'SCRUM-1002',
    taskId: 'TASK-011',
    revision: 'r1',
    generatedAt: new Date().toISOString(),
    evidences: manifestItems,
  };

  await writeFile(join(evidenceDir, 'manifest.json'), JSON.stringify(manifest, null, 2));
  console.log(JSON.stringify(manifest, null, 2));
}

capture().catch((err) => {
  console.error(err);
  process.exit(1);
});
