import {
  decrypt,
  decryptFields,
  encrypt,
  encryptFields,
  getEncryptionKey,
} from "../encryption"

// Valid 64-character hex key (32 bytes)
const VALID_KEY =
  "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"

describe("encryption utilities", () => {
  const originalEnv = process.env.SETTINGS_ENCRYPTION_KEY

  afterEach(() => {
    if (originalEnv) {
      process.env.SETTINGS_ENCRYPTION_KEY = originalEnv
    } else {
      // biome-ignore lint/performance/noDelete: required to truly unset env var for testing
      delete process.env.SETTINGS_ENCRYPTION_KEY
    }
  })

  describe("getEncryptionKey", () => {
    it("returns Buffer from valid 64-char hex key", () => {
      process.env.SETTINGS_ENCRYPTION_KEY = VALID_KEY

      const result = getEncryptionKey()

      expect(result).toBeInstanceOf(Buffer)
      expect(result.length).toBe(32)
    })

    it("throws error when key is missing", () => {
      // biome-ignore lint/performance/noDelete: required to truly unset env var for testing
      delete process.env.SETTINGS_ENCRYPTION_KEY

      expect(() => getEncryptionKey()).toThrow(
        "SETTINGS_ENCRYPTION_KEY is required"
      )
    })

    it("throws error when key is too short", () => {
      process.env.SETTINGS_ENCRYPTION_KEY = "abc123"

      expect(() => getEncryptionKey()).toThrow(
        "SETTINGS_ENCRYPTION_KEY must be a 64-character hex string (got length: 6)"
      )
    })

    it("throws error when key is too long", () => {
      process.env.SETTINGS_ENCRYPTION_KEY = `${VALID_KEY}extra`

      expect(() => getEncryptionKey()).toThrow(
        "SETTINGS_ENCRYPTION_KEY must be a 64-character hex string (got length: 69)"
      )
    })
  })

  describe("encrypt / decrypt", () => {
    beforeEach(() => {
      process.env.SETTINGS_ENCRYPTION_KEY = VALID_KEY
    })

    it("round-trips plaintext correctly", () => {
      const plaintext = "my-secret-api-key"

      const encrypted = encrypt(plaintext)
      const decrypted = decrypt(encrypted)

      expect(decrypted).toBe(plaintext)
    })

    it("produces different ciphertext for same plaintext (random IV)", () => {
      const plaintext = "same-input"

      const encrypted1 = encrypt(plaintext)
      const encrypted2 = encrypt(plaintext)

      expect(encrypted1).not.toBe(encrypted2)
    })

    it("handles empty string", () => {
      const plaintext = ""

      const encrypted = encrypt(plaintext)
      const decrypted = decrypt(encrypted)

      expect(decrypted).toBe(plaintext)
    })

    it("handles unicode characters", () => {
      const plaintext = "Příliš žluťoučký kůň úpěl ďábelské ódy 🔐"

      const encrypted = encrypt(plaintext)
      const decrypted = decrypt(encrypted)

      expect(decrypted).toBe(plaintext)
    })

    it("handles long strings", () => {
      const plaintext = "a".repeat(10_000)

      const encrypted = encrypt(plaintext)
      const decrypted = decrypt(encrypted)

      expect(decrypted).toBe(plaintext)
    })

    it("throws on tampered ciphertext (authentication failure)", () => {
      const encrypted = encrypt("secret")
      // Tamper with the ciphertext (flip a bit using XOR)
      const tampered = Buffer.from(encrypted, "base64")
      const tamperedIndex = 20
      // biome-ignore lint/suspicious/noBitwiseOperators: XOR is intentional for tampering test
      tampered[tamperedIndex] = (tampered[tamperedIndex] ?? 0) ^ 0xff
      const tamperedBase64 = tampered.toString("base64")

      expect(() => decrypt(tamperedBase64)).toThrow()
    })

    it("throws on truncated ciphertext", () => {
      const encrypted = encrypt("secret")
      const truncated = encrypted.slice(0, 10)

      expect(() => decrypt(truncated)).toThrow()
    })
  })

  describe("encryptFields", () => {
    beforeEach(() => {
      process.env.SETTINGS_ENCRYPTION_KEY = VALID_KEY
    })

    it("encrypts specified string fields", () => {
      const data = {
        client_id: "public-id",
        client_secret: "secret-value",
        is_enabled: true,
      }

      const result = encryptFields(data, ["client_secret"])

      expect(result.client_id).toBe("public-id")
      expect(result.client_secret).not.toBe("secret-value")
      expect(result.is_enabled).toBe(true)
      // Verify it's actually encrypted (can be decrypted)
      expect(decrypt(result.client_secret as string)).toBe("secret-value")
    })

    it("skips null values", () => {
      const data = {
        field1: "value",
        field2: null,
      }

      const result = encryptFields(data, ["field1", "field2"])

      expect(decrypt(result.field1 as string)).toBe("value")
      expect(result.field2).toBeNull()
    })

    it("skips empty strings", () => {
      const data = {
        field1: "value",
        field2: "",
      }

      const result = encryptFields(data, ["field1", "field2"])

      expect(decrypt(result.field1 as string)).toBe("value")
      expect(result.field2).toBe("")
    })

    it("skips non-string values", () => {
      const data = {
        name: "test",
        count: 42,
        active: true,
      }

      const result = encryptFields(data, ["name", "count", "active"] as any)

      expect(decrypt(result.name as string)).toBe("test")
      expect(result.count).toBe(42)
      expect(result.active).toBe(true)
    })

    it("does not mutate original object", () => {
      const original = { secret: "value" }

      encryptFields(original, ["secret"])

      expect(original.secret).toBe("value")
    })
  })

  describe("decryptFields", () => {
    beforeEach(() => {
      process.env.SETTINGS_ENCRYPTION_KEY = VALID_KEY
    })

    it("decrypts specified encrypted fields", () => {
      const encrypted = encrypt("secret-value")
      const data = {
        client_id: "public-id",
        client_secret: encrypted,
      }

      const result = decryptFields(data, ["client_secret"])

      expect(result.client_id).toBe("public-id")
      expect(result.client_secret).toBe("secret-value")
    })

    it("skips null values", () => {
      const data = {
        field1: encrypt("value"),
        field2: null,
      }

      const result = decryptFields(data, ["field1", "field2"])

      expect(result.field1).toBe("value")
      expect(result.field2).toBeNull()
    })

    it("skips empty strings", () => {
      const data = {
        field1: encrypt("value"),
        field2: "",
      }

      const result = decryptFields(data, ["field1", "field2"])

      expect(result.field1).toBe("value")
      expect(result.field2).toBe("")
    })

    it("keeps original value on decryption failure (legacy data)", () => {
      const data = {
        legacy_field: "not-encrypted-plaintext",
      }

      const result = decryptFields(data, ["legacy_field"])

      expect(result.legacy_field).toBe("not-encrypted-plaintext")
    })

    it("does not mutate original object", () => {
      const encrypted = encrypt("value")
      const original = { secret: encrypted }

      decryptFields(original, ["secret"])

      expect(original.secret).toBe(encrypted)
    })
  })

  describe("encryptFields + decryptFields round-trip", () => {
    beforeEach(() => {
      process.env.SETTINGS_ENCRYPTION_KEY = VALID_KEY
    })

    it("round-trips object with multiple sensitive fields", () => {
      const original = {
        id: "123",
        client_id: "public",
        client_secret: "secret1",
        api_key: "secret2",
        is_enabled: true,
        count: 42,
      }
      const sensitiveFields: (keyof typeof original)[] = [
        "client_secret",
        "api_key",
      ]

      const encrypted = encryptFields(original, sensitiveFields)
      const decrypted = decryptFields(encrypted, sensitiveFields)

      expect(decrypted).toEqual(original)
    })
  })
})
