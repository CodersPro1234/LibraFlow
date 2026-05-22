import { vi } from 'vitest';

// Variables d'environnement minimales pour les tests
process.env['NODE_ENV'] = 'test';
process.env['SUPABASE_URL'] = 'https://test.supabase.co';
process.env['SUPABASE_ANON_KEY'] = 'test-anon-key';
process.env['SUPABASE_SERVICE_ROLE_KEY'] = 'test-service-role-key';
process.env['JWT_ACCESS_SECRET'] = 'test-access-secret-32chars-minimum!!';
process.env['JWT_REFRESH_SECRET'] = 'test-refresh-secret-32chars-minimum!';
process.env['REDIS_URL'] = 'redis://localhost:6379';
process.env['CAMPUS_FASO_API_URL'] = 'https://api.campusfaso.bf';
process.env['CAMPUS_FASO_API_KEY'] = 'test-api-key';
process.env['IA_SERVICE_URL'] = 'http://localhost:5001';
process.env['MINISTERE_EMAIL'] = 'ministere@test.bf';
process.env['MINISTERE_PASSWORD'] = 'TestPassword123!';
process.env['FRONTEND_URL'] = 'http://localhost:5173';
process.env['PORT'] = '4001';

// Mock Supabase
vi.mock('../src/config/supabase', () => ({
  supabaseAdmin: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      neq: vi.fn().mockReturnThis(),
      lt: vi.fn().mockReturnThis(),
      lte: vi.fn().mockReturnThis(),
      gt: vi.fn().mockReturnThis(),
      gte: vi.fn().mockReturnThis(),
      in: vi.fn().mockReturnThis(),
      is: vi.fn().mockReturnThis(),
      not: vi.fn().mockReturnThis(),
      upsert: vi.fn().mockResolvedValue({ data: null, error: null }),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: null }),
      maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
      returns: vi.fn().mockResolvedValue({ data: [], error: null }),
      then: vi.fn().mockImplementation((onFulfilled: (v: unknown) => unknown) => {
        onFulfilled?.({ data: null, error: null });
        return Promise.resolve({ data: null, error: null });
      }),
    })),
    storage: {
      from: vi.fn(() => ({
        upload: vi.fn().mockResolvedValue({ error: null }),
        getPublicUrl: vi.fn().mockReturnValue({ data: { publicUrl: 'https://test.storage/doc.pdf' } }),
        createSignedUrl: vi.fn().mockResolvedValue({ data: { signedUrl: 'https://test.storage/signed' }, error: null }),
        remove: vi.fn().mockResolvedValue({ error: null }),
      })),
    },
    rpc: vi.fn().mockResolvedValue({ data: [], error: null }),
  },
}));

// Mock Redis
vi.mock('../src/config/redis', () => ({
  default: {
    get: vi.fn().mockResolvedValue(null),
    set: vi.fn().mockResolvedValue('OK'),
    del: vi.fn().mockResolvedValue(1),
    ping: vi.fn().mockResolvedValue('PONG'),
    call: vi.fn().mockResolvedValue(null),
  },
}));

// Mock BullMQ queues
vi.mock('../src/jobs/queues', () => ({
  moderationQueue: { add: vi.fn().mockResolvedValue({ id: 'job-1' }) },
  ttsQueue: {
    add: vi.fn().mockResolvedValue({ id: 'job-2' }),
    getJobs: vi.fn().mockResolvedValue([]),
  },
}));

// Mock workers (ne pas les démarrer en test)
vi.mock('../src/jobs/moderation.worker', () => ({
  startModerationWorker: vi.fn(),
}));
vi.mock('../src/jobs/tts.worker', () => ({
  startTtsWorker: vi.fn(),
}));

// Mock rate limiter — évite les connexions Redis en test
vi.mock('../src/middlewares/rateLimiter.middleware', () => {
  const noop = (_req: unknown, _res: unknown, next: () => void) => next();
  return { globalLimiter: noop, authLimiter: noop, askLimiter: noop };
});
