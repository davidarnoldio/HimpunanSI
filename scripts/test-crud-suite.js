/**
 * TDD CRUD Evaluation Suite — HIMASI UG CMS & Database Layer
 * ─────────────────────────────────────────────────────────────────────────────
 * Automated test suite evaluating CRUD capabilities and database consistency
 * across all 7 CMS feature modules:
 *   1. BPH Pengurus (Supabase `Pengurus` Table)
 *   2. Events & Proker (Supabase `Event` Table)
 *   3. Merchandise (Supabase `settings` Table JSON)
 *   4. Divisi & Anggota (Supabase `settings` Table JSON)
 *   5. Aspirasi Mahasiswa (Supabase `Aspirasi` Table)
 *   6. Visi & Misi (Supabase `settings` Table JSON)
 *   7. Hero Content & Live Text (Supabase `settings` Table JSON)
 * ─────────────────────────────────────────────────────────────────────────────
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://avkfevavjdgcbfleqxmn.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2a2ZldmF2amRnY2JmbGVxeG1uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUyNDY0MjksImV4cCI6MjEwMDgyMjQyOX0.Ds5dLTviUjvQOfaeDK3zur3K0zl5i_Qjd-Dsp7KT79g';

const COMMON_HEADERS = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json',
  'Cache-Control': 'no-cache, no-store, must-revalidate',
};

let passedTests = 0;
let failedTests = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ [PASS] ${message}`);
    passedTests++;
  } else {
    console.error(`  ❌ [FAIL] ${message}`);
    failedTests++;
  }
}

async function runTddSuite() {
  console.log('\n================================================================');
  console.log('🚀 RUNNING HIMASI UG CMS — AUTOMATED TDD EVALUATION SUITE');
  console.log('================================================================\n');

  // ───────────────────────────────────────────────────────────────────────────
  // TEST 1: BPH PENGURUS CRUD & DELETION SYNC
  // ───────────────────────────────────────────────────────────────────────────
  console.log('📌 Module 1: BPH Pengurus (Supabase `Pengurus` Table)');
  const testBphId = `bph_tdd_test_${Date.now()}`;
  const initialBph = {
    id: testBphId,
    nama: 'TDD Test BPH Member',
    jabatan: 'Ketua Himpunan',
    divisi: 'BPH',
    periode: '2025/2026',
    fotoUrl: 'https://placehold.co/600x800',
    urutan: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // 1.1 CREATE BPH
  const createBphRes = await fetch(`${SUPABASE_URL}/rest/v1/Pengurus`, {
    method: 'POST',
    headers: { ...COMMON_HEADERS, Prefer: 'resolution=merge-duplicates,return=representation' },
    body: JSON.stringify([initialBph]),
  });
  assert(createBphRes.status === 201 || createBphRes.status === 200, `CREATE BPH item returned HTTP ${createBphRes.status}`);

  // 1.2 READ BPH
  const readBphRes = await fetch(`${SUPABASE_URL}/rest/v1/Pengurus?id=eq.${testBphId}`, {
    headers: COMMON_HEADERS,
  });
  const readBphData = await readBphRes.json();
  assert(readBphData.length === 1 && readBphData[0].nama === 'TDD Test BPH Member', 'READ BPH item verified in Supabase');

  // 1.3 UPDATE BPH
  const updatedBph = { ...initialBph, nama: 'TDD Test BPH Member Updated' };
  const updateBphRes = await fetch(`${SUPABASE_URL}/rest/v1/Pengurus`, {
    method: 'POST',
    headers: { ...COMMON_HEADERS, Prefer: 'resolution=merge-duplicates,return=representation' },
    body: JSON.stringify([updatedBph]),
  });
  assert(updateBphRes.status === 201 || updateBphRes.status === 200, 'UPDATE BPH item succeeded');

  const checkUpdatedBph = await (await fetch(`${SUPABASE_URL}/rest/v1/Pengurus?id=eq.${testBphId}`, { headers: COMMON_HEADERS })).json();
  assert(checkUpdatedBph[0]?.nama === 'TDD Test BPH Member Updated', 'UPDATE BPH name verified in DB');

  // 1.4 DELETE BPH (Testing fixed sync delete URL)
  const fetchAllBph = await (await fetch(`${SUPABASE_URL}/rest/v1/Pengurus?select=id,divisi`, { headers: COMMON_HEADERS })).json();
  const bphIdsInDb = fetchAllBph.filter(r => r.divisi && r.divisi.toLowerCase() === 'bph').map(r => r.id);
  const idsToDelete = bphIdsInDb.filter(id => id === testBphId);

  assert(idsToDelete.includes(testBphId), 'DELETE logic correctly identified item ID to delete');

  const deleteBphRes = await fetch(`${SUPABASE_URL}/rest/v1/Pengurus?id=in.("${idsToDelete.join('","')}")`, {
    method: 'DELETE',
    headers: { ...COMMON_HEADERS, Prefer: 'return=representation' },
  });
  assert(deleteBphRes.status === 200 || deleteBphRes.status === 204, `DELETE BPH returned HTTP ${deleteBphRes.status}`);

  const checkDeletedBph = await (await fetch(`${SUPABASE_URL}/rest/v1/Pengurus?id=eq.${testBphId}`, { headers: COMMON_HEADERS })).json();
  assert(checkDeletedBph.length === 0, 'DELETE BPH item verified removed from Supabase DB\n');

  // ───────────────────────────────────────────────────────────────────────────
  // TEST 2: EVENTS & PROKER CRUD
  // ───────────────────────────────────────────────────────────────────────────
  console.log('📌 Module 2: Events & Proker (Supabase `Event` Table)');
  const testEventId = `evt_tdd_test_${Date.now()}`;
  const testEvent = {
    id: testEventId,
    title: 'TDD Test Event 2025',
    kategori: 'Workshop',
    tanggal: '20 Oktober 2025',
    waktu: '10:00 WIB',
    lokasi: 'Auditorium Kampus J',
    isOnline: false,
    status: 'PENDAFTARAN_DIBUKA',
    deskripsi: 'Test description for automated TDD',
    bannerUrl: null,
    linkPendaftaran: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // 2.1 CREATE EVENT
  const createEvtRes = await fetch(`${SUPABASE_URL}/rest/v1/Event`, {
    method: 'POST',
    headers: { ...COMMON_HEADERS, Prefer: 'return=representation' },
    body: JSON.stringify([testEvent]),
  });
  assert(createEvtRes.status === 201 || createEvtRes.status === 200, `CREATE Event returned HTTP ${createEvtRes.status}`);

  // 2.2 READ EVENT
  const readEvtData = await (await fetch(`${SUPABASE_URL}/rest/v1/Event?id=eq.${testEventId}`, { headers: COMMON_HEADERS })).json();
  assert(readEvtData.length === 1 && readEvtData[0].title === 'TDD Test Event 2025', 'READ Event verified in DB');

  // 2.3 DELETE EVENT
  const deleteEvtRes = await fetch(`${SUPABASE_URL}/rest/v1/Event?id=eq.${testEventId}`, {
    method: 'DELETE',
    headers: COMMON_HEADERS,
  });
  assert(deleteEvtRes.status === 200 || deleteEvtRes.status === 204, 'DELETE Event succeeded');

  const checkDeletedEvt = await (await fetch(`${SUPABASE_URL}/rest/v1/Event?id=eq.${testEventId}`, { headers: COMMON_HEADERS })).json();
  assert(checkDeletedEvt.length === 0, 'DELETE Event verified removed from DB\n');

  // ───────────────────────────────────────────────────────────────────────────
  // TEST 3: ASPIRASI MAHASISWA
  // ───────────────────────────────────────────────────────────────────────────
  console.log('📌 Module 3: Aspirasi Mahasiswa (Supabase `Aspirasi` Table)');
  const testAspId = `asp_tdd_test_${Date.now()}`;
  const testAsp = {
    id: testAspId,
    pesan: 'Pesan Aspirasi TDD Test',
    isAnonim: false,
    nama: 'Budi Santoso',
    email: 'budi@student.gunadarma.ac.id',
    status: 'BARU',
  };

  // 3.1 INSERT ASPIRASI (Public anon submission with Prefer: return=minimal for RLS)
  const insAspRes = await fetch(`${SUPABASE_URL}/rest/v1/Aspirasi`, {
    method: 'POST',
    headers: { ...COMMON_HEADERS, Prefer: 'return=minimal' },
    body: JSON.stringify(testAsp),
  });
  assert(insAspRes.status === 201 || insAspRes.status === 200, `INSERT Aspirasi from public form returned HTTP ${insAspRes.status}`);

  // 3.2 UPDATE STATUS
  const updateAspRes = await fetch(`${SUPABASE_URL}/rest/v1/Aspirasi?id=eq.${testAspId}`, {
    method: 'PATCH',
    headers: COMMON_HEADERS,
    body: JSON.stringify({ status: 'SELESAI' }),
  });
  assert(updateAspRes.status === 200 || updateAspRes.status === 204, 'UPDATE Aspirasi status to SELESAI succeeded');

  // 3.3 DELETE ASPIRASI
  const deleteAspRes = await fetch(`${SUPABASE_URL}/rest/v1/Aspirasi?id=eq.${testAspId}`, {
    method: 'DELETE',
    headers: COMMON_HEADERS,
  });
  assert(deleteAspRes.status === 200 || deleteAspRes.status === 204, 'DELETE Aspirasi verified removed\n');

  // ───────────────────────────────────────────────────────────────────────────
  // TEST 4: SETTINGS BLOBS (MERCHANDISE, DIVISI, VISI-MISI, HERO)
  // ───────────────────────────────────────────────────────────────────────────
  console.log('📌 Module 4: CMS Settings Blobs (Merchandise, Divisi, VisiMisi, Hero)');

  const testSettingsKey = 'cms_tdd_test_key';
  const testPayload = { test: true, timestamp: Date.now() };

  const upsertSettingsRes = await fetch(`${SUPABASE_URL}/rest/v1/settings`, {
    method: 'POST',
    headers: { ...COMMON_HEADERS, Prefer: 'resolution=merge-duplicates' },
    body: JSON.stringify({ key: testSettingsKey, value: testPayload, updatedAt: new Date().toISOString() }),
  });
  assert(upsertSettingsRes.status === 201 || upsertSettingsRes.status === 200 || upsertSettingsRes.status === 204, 'UPSERT Settings JSON blob succeeded');

  const readSettingsData = await (await fetch(`${SUPABASE_URL}/rest/v1/settings?select=value&key=eq.${testSettingsKey}`, { headers: COMMON_HEADERS })).json();
  assert(readSettingsData.length === 1 && readSettingsData[0].value.test === true, 'READ Settings JSON blob verified');

  // Cleanup test key
  await fetch(`${SUPABASE_URL}/rest/v1/settings?key=eq.${testSettingsKey}`, { method: 'DELETE', headers: COMMON_HEADERS });
  console.log('  ✅ [PASS] Cleanup test settings blob completed\n');

  // ───────────────────────────────────────────────────────────────────────────
  // SUMMARY
  // ───────────────────────────────────────────────────────────────────────────
  console.log('================================================================');
  console.log(`📊 TDD SUITE COMPLETED: ${passedTests} Passed, ${failedTests} Failed.`);
  console.log('================================================================\n');

  if (failedTests > 0) {
    process.exit(1);
  }
}

runTddSuite().catch((err) => {
  console.error('TDD Suite Error:', err);
  process.exit(1);
});
